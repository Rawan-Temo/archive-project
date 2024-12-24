import axios from "axios";
import { createContext, useEffect, useState } from "react";
const userLanguage = navigator.language || navigator.userLanguage;
const userLang = userLanguage.startsWith("ar") ? "AR" : "EN";
export const Context = createContext({});

export const baseURL = `http://localhost:8000/api`;
export const limit = 10;
const Provider = ({ children }) => {
  const [mode, setMode] = useState(+localStorage.getItem("isDark") || false);
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || userLang || "EN"
  );
  const [isClosed, setIsClosed] = useState(
    JSON.parse(localStorage.getItem("isClosed")) || false
  );
  const [selectedLang, setSelectedLang] = useState("");
  const [userDetails, setUserDetails] = useState({
    isAdmin: false,
    token: "",
    userDetails: {},
    role: "",
  });

  useEffect(() => {
    localStorage.setItem("isDark", mode ? 1 : 0);
    mode && document.body.classList.add("dark");
  }, [mode]);

  useEffect(() => {
    const h2Active = document.querySelector(".languages h2.active");
    const h2 = document.querySelectorAll(".languages h2");
    h2Active && h2Active.classList.remove("active");
    localStorage.setItem("language", language);
    if (h2) {
      h2.forEach(
        (e) => e.dataset.lang === language && e.classList.add("active")
      );
    }
    if (language === "AR") document.body.classList.add("arabic");
    else document.body.classList.remove("arabic");
  }, [language]);
  const getLang = async () => {
    try {
      const data = await axios.get(`/${language && language}.json`);
      setSelectedLang(data.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getLang();
  }, [language]);

  return (
    <Context.Provider
      value={{
        isClosed,
        setIsClosed,
        setMode,
        language,
        setLanguage,
        selectedLang,
        userDetails,
        setUserDetails,
      }}
    >
      {children}
    </Context.Provider>
  );
};
export default Provider;

export const placeholder = `pleace write`;
export const searchPlaceholder = `search for`;

export const date = (dat) => {
  const time = new Date(dat);
  const birthDate = `${time.getFullYear()}-${
    time.getMonth() + 1
  }-${time.getDate()}`;
  return birthDate;
};

export function nextJoin(array, obj) {
  let text = "";
  for (let i = 0; i < array.length; i++) {
    if (array[i + 1]) text += array[i][obj] + " , ";
    else text += array[i][obj];
  }

  return text;
}
