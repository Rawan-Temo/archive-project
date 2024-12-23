import React, { useEffect, useState } from "react";
import "../../components/form.css";
import Mammoth from "mammoth";
import { baseURL, placeholder, searchPlaceholder } from "../../context/context";
import axios from "axios";
const AddPerson = () => {
  const handleClick = (e) => {
    e.stopPropagation();
    const divs = document.querySelectorAll("div.form .selecte .inp.active");
    divs.forEach((ele) => ele !== e.target && ele.classList.remove("active"));
    e.target.classList.toggle("active");
  };

  window.addEventListener("click", () => {
    const selectDiv = document.querySelector("div.form .selecte .inp.active");
    selectDiv && selectDiv.classList.remove("active");
  });

  const [error, setError] = useState(false);

  const [form, setForm] = useState({
    //personal data
    firstName: "",
    fatherName: "",
    surName: "",
    gender: "",
    maritalStatus: "",
    motherName: "",
    birthDate: "",
    placeOfBirth: "",
    occupation: "",
    //stay data
    countryId: "",
    governmentId: "",
    cityId: "",
    villageId: "",
    regionId: "",
    streetId: "",
    addressDetails: "",
    //contact data
    email: "",
    phone: "",
  });
  const [allDataSelect, setAllDataSelect] = useState({
    data: {
      country: [],
      government: [],
      city: [],
      region: [],
      street: [],
      village: [],
    },
    searchData: {
      country: [],
      government: [],
      city: [],
      region: [],
      street: [],
      village: [],
    },
  });

  useEffect(() => {
    axios
      .get(`${baseURL}/Countries?active=true`)
      .then((res) => {
        setAllDataSelect({
          ...allDataSelect,
          data: { ...allDataSelect.data, country: res.data.data },
          searchData: { ...allDataSelect.searchData, country: res.data.data },
        });
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (!form.countryId) return;
    setForm({ ...form, governmentId: "" });
    setAllDataSelect({
      ...allDataSelect,
      data: { ...allDataSelect.data, government: [] },
      searchData: {
        ...allDataSelect.searchData,
        government: [],
      },
    });
    axios
      .get(`${baseURL}/Governments?active=true&country=${form.countryId._id}`)
      .then((res) => {
        setAllDataSelect({
          ...allDataSelect,
          data: { ...allDataSelect.data, government: res.data.data },
          searchData: {
            ...allDataSelect.searchData,
            government: res.data.data,
          },
        });
      })
      .catch((err) => console.log(err));
  }, [form.countryId]);

  useEffect(() => {
    if (form.cityId) {
      setForm({ ...form, cityId: "" });
      setAllDataSelect({
        ...allDataSelect,
        data: { ...allDataSelect.data, city: [] },
        searchData: {
          ...allDataSelect.searchData,
          city: [],
        },
      });
    }
    if (!form.governmentId) return;
    axios
      .get(`${baseURL}/Cities?active=true&government=${form.governmentId._id}`)
      .then((res) => {
        setAllDataSelect({
          ...allDataSelect,
          data: { ...allDataSelect.data, city: res.data.data },
          searchData: {
            ...allDataSelect.searchData,
            city: res.data.data,
          },
        });
      })
      .catch((err) => console.log(err));
  }, [form.governmentId]);

  useEffect(() => {
    let formObj = { ...form };

    if (formObj.villageId) formObj = { ...formObj, villageId: "" };
    if (formObj.regionId) formObj = { ...formObj, regionId: "" };
    if (formObj.streetId) formObj = { ...formObj, streetId: "" };
    if (form.streetId || form.regionId || form.villageId) {
      setForm(formObj);
      setAllDataSelect({
        ...allDataSelect,
        data: { ...allDataSelect.data, street: [], region: [], villageId: [] },
        searchData: {
          ...allDataSelect.searchData,
          street: [],
          region: [],
          villageId: [],
        },
      });
    }

    if (!form.cityId) return;
    let dataObj = { ...allDataSelect };
    const promises = [];
    promises.push(
      axios
        .get(`${baseURL}/Villages?active=true&city=${form.cityId._id}`)
        .then((res) => {
          dataObj = {
            ...dataObj,
            data: { ...dataObj.data, village: res.data.data },
            searchData: {
              ...dataObj.searchData,
              village: res.data.data,
            },
          };
        })
        .catch((err) => console.log(err))
    );

    promises.push(
      axios
        .get(`${baseURL}/Streets?active=true&city=${form.cityId._id}`)
        .then((res) => {
          dataObj = {
            ...dataObj,
            data: { ...dataObj.data, street: res.data.data },
            searchData: {
              ...dataObj.searchData,
              street: res.data.data,
            },
          };
        })
        .catch((err) => console.log(err))
    );

    promises.push(
      axios
        .get(`${baseURL}/Regions?active=true&city=${form.cityId._id}`)
        .then((res) => {
          dataObj = {
            ...dataObj,
            data: { ...dataObj.data, region: res.data.data },
            searchData: {
              ...dataObj.searchData,
              region: res.data.data,
            },
          };
        })
        .catch((err) => console.log(err))
    );

    Promise.all(promises)
      .then(() => {
        setAllDataSelect(dataObj);
      })
      .catch((err) => console.log("Error in one or more requests:", err));
  }, [form.cityId]);

  const handleForm = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
    error && setError(false);
  };
  const handleFormSelect = (e) => {
    setForm({ ...form, [e.target.id]: e.target.title });
    error && setError(false);
  };

  const [documents, setDocuments] = useState({
    image: [],
    video: [],
    file: [],
    audio: [],
  });

  const [uploadedFiles, setUploadedFiles] = useState({ list: [] });
  const [activeFile, setActiveFile] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const formatFileSize = (fileSize) => `${(fileSize / 1024).toFixed(2)} KB`;

  const addperson = (file) => {
    const fileReader = new FileReader();

    fileReader.onload = (event) => {
      const fileType = file.type;

      if (fileType === "application/pdf") {
        setActiveFile({
          content: event.target.result,
          type: "application/pdf",
          name: file.name,
        });
      } else if (fileType === "text/plain") {
        setActiveFile({
          content: event.target.result,
          type: "text/plain",
          name: file.name,
        });
      } else if (
        fileType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        const arrayBuffer = event.target.result;
        Mammoth.extractRawText({ arrayBuffer })
          .then((result) => {
            setActiveFile({
              content: result.value,
              type: "docx",
              name: file.name,
            });
            setIsPopupOpen(true);
          })
          .catch((err) => {
            console.error("Error reading .docx file:", err);
            alert("Failed to open .docx file.");
          });
        return;
      } else {
        alert("Unsupported file type for preview.");
      }

      setIsPopupOpen(true);
    };

    if (file.type === "application/pdf") {
      fileReader.readAsDataURL(file);
    } else if (file.type === "text/plain") {
      fileReader.readAsText(file);
    } else if (
      file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      fileReader.readAsArrayBuffer(file);
    } else {
      alert(
        "Unsupported file type. Only text, PDF, and DOCX files are allowed."
      );
    }
  };

  function selectFilters(e, itm) {
    setForm({ ...form, [e.target.title]: itm });
    error && setError(false);
  }

  return (
    <>
      <h1 className="title">add person</h1>
      <form className="dashboard-form">
        <div className="form">
          <h1>personal information</h1>
          <div className="flex wrap">
            <div className="flex flex-direction">
              <label htmlFor="firstName">first name</label>
              <input
                required
                type="text"
                id="firstName"
                className="inp"
                value={form.firstName}
                onChange={handleForm}
                placeholder={`${placeholder} first name`}
              />
            </div>

            <div className="flex flex-direction">
              <label htmlFor="fotherName">fother name</label>
              <input
                required
                value={form.fotherName}
                onChange={handleForm}
                type="text"
                id="fotherName"
                className="inp"
                placeholder={`${placeholder} fother name`}
              />
            </div>

            <div className="flex flex-direction">
              <label htmlFor="surName">last name</label>
              <input
                value={form.surName}
                onChange={handleForm}
                required
                type="text"
                id="surName"
                className="inp"
                placeholder={`${placeholder} last name`}
              />
            </div>

            <div className="flex flex-direction">
              <label>gender</label>
              <div className="selecte relative">
                <div onClick={handleClick} className="inp">
                  {form.gender ? form.gender : "select gender"}
                </div>
                <article>
                  <h2 onClick={handleFormSelect} id="gender" title="male">
                    male
                  </h2>
                  <h2 onClick={handleFormSelect} id="gender" title="female">
                    Female
                  </h2>
                </article>
              </div>
            </div>

            <div className="flex flex-direction">
              <label>maritalStatus</label>
              <div className="selecte relative">
                <div onClick={handleClick} className="inp">
                  {form.maritalStatus
                    ? form.maritalStatus
                    : "select maritalStatus"}
                </div>
                <article>
                  <h2
                    onClick={handleFormSelect}
                    id="maritalStatus"
                    title="Married"
                  >
                    Married
                  </h2>
                  <h2
                    onClick={handleFormSelect}
                    id="maritalStatus"
                    title="Single"
                  >
                    single
                  </h2>
                  <h2
                    onClick={handleFormSelect}
                    id="maritalStatus"
                    title="Other"
                  >
                    Other
                  </h2>
                </article>
              </div>
            </div>

            <div className="flex flex-direction">
              <label htmlFor="motherName">mother name</label>
              <input
                value={form.motherName}
                onChange={handleForm}
                required
                type="text"
                id="motherName"
                className="inp"
                placeholder={`${placeholder} mother name`}
              />
            </div>

            <div className="flex flex-direction">
              <label htmlFor="birthDate">date of birth</label>
              <input
                value={form.birthDate}
                onChange={handleForm}
                required
                type="date"
                id="birthDate"
                className="inp"
              />
            </div>

            <div className="flex flex-direction">
              <label htmlFor="placeOfBirth">place of birth</label>
              <input
                required
                value={form.placeOfBirth}
                onChange={handleForm}
                type="text"
                id="placeOfBirth"
                className="inp"
                placeholder={`${placeholder} place of birth`}
              />
            </div>

            <div className="flex flex-direction">
              <label htmlFor="occupation">occupation</label>
              <input
                value={form.occupation}
                onChange={handleForm}
                required
                type="text"
                id="occupation"
                className="inp"
                placeholder={`${placeholder} occupation`}
              />
            </div>
          </div>
        </div>

        <div className="form">
          <h1>stay informations</h1>
          <div className="flex wrap">
            <div className="flex flex-direction">
              <label>country</label>
              <div className="selecte relative">
                <div onClick={handleClick} className="inp">
                  {form.countryId ? form.countryId.name : "select country"}
                </div>
                <article>
                  <input
                    onClick={(e) => e.stopPropagation()}
                    placeholder={`${searchPlaceholder} country`}
                    onInput={(inp) => {
                      const filteredCountries =
                        allDataSelect.data.country.filter((e) =>
                          e.name
                            .toLowerCase()
                            .includes(inp.target.value.toLowerCase())
                        );
                      setAllDataSelect({
                        ...allDataSelect,
                        searchData: {
                          ...allDataSelect.searchData,
                          country: filteredCountries,
                        },
                      });
                    }}
                    type="text"
                  />
                  {allDataSelect.searchData.country.map((itm, i) => (
                    <h2
                      key={i}
                      title="countryId"
                      onClick={(e) => {
                        selectFilters(e, itm);
                      }}
                    >
                      {itm.name}
                    </h2>
                  ))}
                  {allDataSelect.searchData.country.length <= 0 && (
                    <p>no data</p>
                  )}
                </article>
              </div>
            </div>

            <div className="flex flex-direction">
              <label>government</label>
              <div className="selecte relative">
                <div onClick={handleClick} className="inp">
                  {form.governmentId
                    ? form.governmentId.name
                    : "select government"}
                </div>
                <article>
                  <input
                    onClick={(e) => e.stopPropagation()}
                    placeholder={`${searchPlaceholder} government`}
                    onInput={(inp) => {
                      const filteredCountries =
                        allDataSelect.data.government.filter((e) =>
                          e.name
                            .toLowerCase()
                            .includes(inp.target.value.toLowerCase())
                        );
                      setAllDataSelect({
                        ...allDataSelect,
                        searchData: {
                          ...allDataSelect.searchData,
                          government: filteredCountries,
                        },
                      });
                    }}
                    type="text"
                  />
                  {allDataSelect.searchData.government.map((itm, i) => (
                    <h2
                      key={i}
                      title="governmentId"
                      onClick={(e) => {
                        selectFilters(e, itm);
                      }}
                    >
                      {itm.name}
                    </h2>
                  ))}
                  {form.countryId &&
                    allDataSelect.searchData.government.length <= 0 && (
                      <p>no data</p>
                    )}
                  {!form.countryId && <p>please select country first</p>}
                </article>
              </div>
            </div>

            <div className="flex flex-direction">
              <label>city</label>
              <div className="selecte relative">
                <div onClick={handleClick} className="inp">
                  {form.cityId ? form.cityId.name : "select city"}
                </div>
                <article>
                  <input
                    onClick={(e) => e.stopPropagation()}
                    placeholder={`${searchPlaceholder} city`}
                    onInput={(inp) => {
                      const filteredCountries = allDataSelect.data.city.filter(
                        (e) =>
                          e.name
                            .toLowerCase()
                            .includes(inp.target.value.toLowerCase())
                      );
                      setAllDataSelect({
                        ...allDataSelect,
                        searchData: {
                          ...allDataSelect.searchData,
                          city: filteredCountries,
                        },
                      });
                    }}
                    type="text"
                  />
                  {allDataSelect.searchData.city.map((itm, i) => (
                    <h2
                      key={i}
                      title="cityId"
                      onClick={(e) => {
                        selectFilters(e, itm);
                      }}
                    >
                      {itm.name}
                    </h2>
                  ))}
                  {form.governmentId &&
                    allDataSelect.searchData.city.length <= 0 && <p>no data</p>}
                  {!form.governmentId && <p>please select government first</p>}
                </article>
              </div>
            </div>

            <div className="flex flex-direction">
              <label>village</label>
              <div className="selecte relative">
                <div onClick={handleClick} className="inp">
                  {form.villageId ? form.villageId.name : "select village"}
                </div>
                <article>
                  <input
                    onClick={(e) => e.stopPropagation()}
                    placeholder={`${searchPlaceholder} village`}
                    onInput={(inp) => {
                      const filteredCountries =
                        allDataSelect.data.village.filter((e) =>
                          e.name
                            .toLowerCase()
                            .includes(inp.target.value.toLowerCase())
                        );
                      setAllDataSelect({
                        ...allDataSelect,
                        searchData: {
                          ...allDataSelect.searchData,
                          village: filteredCountries,
                        },
                      });
                    }}
                    type="text"
                  />
                  {allDataSelect.searchData.village.map((itm, i) => (
                    <h2
                      key={i}
                      title="villageId"
                      onClick={(e) => {
                        selectFilters(e, itm);
                      }}
                    >
                      {itm.name}
                    </h2>
                  ))}
                  {form.cityId &&
                    allDataSelect.searchData.village.length <= 0 && (
                      <p>no data</p>
                    )}
                  {!form.cityId && <p>please select city first</p>}
                </article>
              </div>
            </div>

            <div className="flex flex-direction">
              <label>region</label>
              <div className="selecte relative">
                <div onClick={handleClick} className="inp">
                  {form.regionId ? form.regionId.name : "select region"}
                </div>
                <article>
                  <input
                    onClick={(e) => e.stopPropagation()}
                    placeholder={`${searchPlaceholder} region`}
                    onInput={(inp) => {
                      const filteredCountries =
                        allDataSelect.data.region.filter((e) =>
                          e.name
                            .toLowerCase()
                            .includes(inp.target.value.toLowerCase())
                        );
                      setAllDataSelect({
                        ...allDataSelect,
                        searchData: {
                          ...allDataSelect.searchData,
                          region: filteredCountries,
                        },
                      });
                    }}
                    type="text"
                  />
                  {allDataSelect.searchData.region.map((itm, i) => (
                    <h2
                      key={i}
                      title="regionId"
                      onClick={(e) => {
                        selectFilters(e, itm);
                      }}
                    >
                      {itm.name}
                    </h2>
                  ))}
                  {form.cityId &&
                    allDataSelect.searchData.region.length <= 0 && (
                      <p>no data</p>
                    )}
                  {!form.cityId && <p>please select city first</p>}
                </article>
              </div>
            </div>

            <div className="flex flex-direction">
              <label>street</label>
              <div className="selecte relative">
                <div onClick={handleClick} className="inp">
                  {form.streetId ? form.streetId.name : "select street"}
                </div>
                <article>
                  <input
                    onClick={(e) => e.stopPropagation()}
                    placeholder={`${searchPlaceholder} street`}
                    onInput={(inp) => {
                      const filteredCountries =
                        allDataSelect.data.street.filter((e) =>
                          e.name
                            .toLowerCase()
                            .includes(inp.target.value.toLowerCase())
                        );
                      setAllDataSelect({
                        ...allDataSelect,
                        searchData: {
                          ...allDataSelect.searchData,
                          street: filteredCountries,
                        },
                      });
                    }}
                    type="text"
                  />
                  {allDataSelect.searchData.street.map((itm, i) => (
                    <h2
                      key={i}
                      title="streetId"
                      onClick={(e) => {
                        selectFilters(e, itm);
                      }}
                    >
                      {itm.name}
                    </h2>
                  ))}
                  {form.cityId &&
                    allDataSelect.searchData.street.length <= 0 && (
                      <p>no data</p>
                    )}
                  {!form.cityId && <p>please select city first</p>}
                </article>
              </div>
            </div>

            <div className="flex flex-direction">
              <label htmlFor="addressDetails">addressDetails</label>
              <textarea
                value={form.addressDetails}
                onChange={handleForm}
                className="inp"
                placeholder="test"
                id="addressDetails"
                rows={4}
              ></textarea>
            </div>
          </div>
        </div>

        <div className="form">
          <h1>contact informations</h1>
          <div className="flex warp">
            <div className="flex flex-direction">
              <label htmlFor="phone">phone</label>
              <input
                value={form.phone}
                onChange={handleForm}
                required
                type="text"
                id="phone"
                className="inp"
                placeholder={`${placeholder} phone`}
              />
            </div>
            <div className="flex flex-direction">
              <label htmlFor="email">email</label>
              <input
                value={form.email}
                onChange={handleForm}
                required
                type="email"
                id="email"
                className="inp"
                placeholder={`${placeholder} email`}
              />
            </div>
          </div>
        </div>

        <div className="form">
          <h1>test title2</h1>
          <div className="grid-2">
            <div className="flex flex-direction">
              <label className="inp document gap-10 center">
                <input
                  multiple
                  accept="image/*"
                  type="file"
                  id="image"
                  onInput={(e) => {
                    setDocuments((prevDocuments) => ({
                      ...prevDocuments,
                      image: [
                        ...prevDocuments.image,
                        ...Array.from(e.target.files),
                      ],
                    }));
                  }}
                />
                upload image
                <i className="fa-regular fa-image"></i>
              </label>
            </div>

            <div className="flex flex-direction">
              <label className="inp document gap-10 center">
                <input
                  type="file"
                  id="video"
                  multiple
                  accept="video/*"
                  onInput={(e) => {
                    setDocuments((prevDocuments) => ({
                      ...prevDocuments,
                      video: [
                        ...prevDocuments.video,
                        ...Array.from(e.target.files),
                      ],
                    }));
                  }}
                />
                upload video
                <i className="fa-solid fa-video"></i>
              </label>
            </div>

            <div className="flex flex-direction">
              <label className="inp document gap-10 center">
                <input
                  type="file"
                  id="audio"
                  multiple
                  accept=".mp3, .wav, .mpeg, .ogg, .flac, .aac"
                  onInput={(e) => {
                    setDocuments((prevDocuments) => ({
                      ...prevDocuments,
                      audio: [
                        ...prevDocuments.audio,
                        ...Array.from(e.target.files),
                      ],
                    }));
                  }}
                />
                upload audio
                <i className="fa-solid fa-microphone"></i>
              </label>
            </div>

            <div>
              <div className="flex flex-direction">
                <label className="inp document gap-10 center">
                  <input
                    type="file"
                    id="document"
                    multiple
                    accept=".pdf, .docx, .txt"
                    onInput={(e) => {
                      setUploadedFiles((prevFiles) => ({
                        ...prevFiles,
                        list: [
                          ...prevFiles.list,
                          ...Array.from(e.target.files),
                        ],
                      }));
                    }}
                  />
                  Upload Document
                  <i className="fa-solid fa-file"></i>
                </label>
              </div>
            </div>
          </div>
        </div>

        {documents.image.length > 0 && (
          <div className="form">
            <h1>images selected</h1>
            <div className="grid-3">
              {documents.image.map((e, i) => {
                return (
                  <div className="flex flex-direction relative" key={i}>
                    <i
                      onClick={() => {
                        const image = documents.image.filter(
                          (img) => img !== e
                        );
                        setDocuments({ ...documents, image });
                      }}
                      className="remove-doc fa-solid fa-trash-can"
                    ></i>
                    <img src={URL.createObjectURL(e)} alt="" />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {documents.video.length > 0 && (
          <div className="form">
            <h1>videos selected</h1>
            <div className="grid-3">
              {documents.video.map((e, i) => {
                return (
                  <div className="flex flex-direction relative" key={i}>
                    <i
                      onClick={() => {
                        const updatedVideos = documents.video.filter(
                          (video) => video !== e
                        );
                        setDocuments({ ...documents, video: updatedVideos });
                      }}
                      className="remove-doc fa-solid fa-trash-can"
                    ></i>
                    <video src={URL.createObjectURL(e)} controls></video>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {documents.audio.length > 0 && (
          <div className="form">
            <h1>audios selected</h1>
            <div className="grid-3">
              {documents.audio.map((e, i) => {
                return (
                  <div className="flex flex-direction relative" key={i}>
                    <i
                      onClick={() => {
                        const updatedaudio = documents.audio.filter(
                          (audio) => audio !== e
                        );
                        setDocuments({ ...documents, audio: updatedaudio });
                      }}
                      className="remove-doc fa-solid fa-trash-can"
                    ></i>
                    <audio src={URL.createObjectURL(e)} controls></audio>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {uploadedFiles.list.length > 0 && (
          <div className="form">
            <h1>Files Selected</h1>
            <div className="grid-3">
              {uploadedFiles.list.map((file, index) => (
                <div
                  className="c-pointer flex flex-direction relative"
                  key={index}
                >
                  <i
                    onClick={() => {
                      const updatedFiles = uploadedFiles.list.filter(
                        (f) => f !== file
                      );
                      setUploadedFiles({
                        ...uploadedFiles,
                        list: updatedFiles,
                      });
                    }}
                    className="remove-doc fa-solid fa-trash-can"
                  ></i>
                  <div
                    className="flex gap-10 files"
                    onClick={() => addperson(file)}
                  >
                    <img
                      src={require(`./${file.name.split(".").pop()}.png`)}
                      alt=""
                    />
                    <div className="flex flex-direction">
                      <h3>{file.name}</h3>
                      <h4>{formatFileSize(file.size)}</h4>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {isPopupOpen && activeFile && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>File Preview</h2>
              {activeFile.type === "text/plain" ||
              activeFile.type === "docx" ? (
                <div className="file-content">{activeFile.content}</div>
              ) : activeFile.type === "application/pdf" ? (
                <>
                  <iframe
                    src={activeFile.content}
                    title="PDF Preview"
                    width="100%"
                    height="500px"
                  ></iframe>
                  <a
                    href={activeFile.content}
                    download={activeFile.name}
                    target="_blank"
                    rel="noreferrer"
                    className="btn"
                  >
                    Open in Browser
                  </a>
                </>
              ) : null}
              <button onClick={() => setIsPopupOpen(false)}>Close</button>
            </div>
          </div>
        )}

        <button className="btn">save</button>
      </form>
    </>
  );
};

export default AddPerson;
