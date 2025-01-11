import React, { useEffect, useRef, useState } from "react";
import "../../components/form.css";
import Mammoth from "mammoth";
import { baseURL, searchPlaceholder } from "../../context/context";
import axios from "axios";
import SendData from "../../components/response/SendData";
import Loading from "../../components/loading/Loading";
import People from "./../people/People";
const AddInformation = () => {
  const [loading, setLoading] = useState(false);
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
    people: [],
    Coordinates: [],
    subject: "",
    note: "",
    details: "",
    sectionId: "",
    cityId: "",
    countryId: "",
    governmentId: "",
    regionId: "",
    villageId: "",
    streetId: "",
    addressDetails: "",
    //categories data
    sources: [],
    events: [],
    parties: [],
  });

  const [allDataSelect, setAllDataSelect] = useState({
    data: {
      country: [],
      government: [],
      city: [],
      region: [],
      street: [],
      village: [],
      sources: [],
      events: [],
      parties: [],
      sections: [],
    },
    searchData: {
      country: [],
      government: [],
      city: [],
      region: [],
      street: [],
      village: [],
      sources: [],
      events: [],
      parties: [],
      sections: [],
    },
  });
  const ignoreSelect = (e) => {
    setForm({ ...form, [e.target.title]: "" });
  };
  useEffect(() => {
    let dataObj = { ...allDataSelect };
    const promises = [];

    promises.push(
      axios
        .get(`${baseURL}/Countries?active=true`)
        .then((res) => {
          dataObj = {
            ...dataObj,
            data: { ...dataObj.data, country: res.data.data },
            searchData: {
              ...dataObj.searchData,
              country: res.data.data,
            },
          };
        })
        .catch((err) => console.log(err))
    );

    promises.push(
      axios
        .get(`${baseURL}/Sources?active=true`)
        .then((res) => {
          dataObj = {
            ...dataObj,
            data: { ...dataObj.data, sources: res.data.data },
            searchData: {
              ...dataObj.searchData,
              sources: res.data.data,
            },
          };
        })
        .catch((err) => console.log(err))
    );

    promises.push(
      axios
        .get(`${baseURL}/Events?active=true`)
        .then((res) => {
          dataObj = {
            ...dataObj,
            data: { ...dataObj.data, events: res.data.data },
            searchData: {
              ...dataObj.searchData,
              events: res.data.data,
            },
          };
        })
        .catch((err) => console.log(err))
    );

    promises.push(
      axios
        .get(`${baseURL}/Sections?active=true`)
        .then((res) => {
          dataObj = {
            ...dataObj,
            data: { ...dataObj.data, sections: res.data.data },
            searchData: {
              ...dataObj.searchData,
              sections: res.data.data,
            },
          };
        })
        .catch((err) => console.log(err))
    );

    promises.push(
      axios
        .get(`${baseURL}/Parties?active=true`)
        .then((res) => {
          dataObj = {
            ...dataObj,
            data: { ...dataObj.data, parties: res.data.data },
            searchData: {
              ...dataObj.searchData,
              parties: res.data.data,
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
  }, []);

  useEffect(() => {
    if (!form.countryId) {
      setForm({ ...form, governmentId: "" });
      setAllDataSelect({
        ...allDataSelect,
        data: { ...allDataSelect.data, government: [] },
        searchData: {
          ...allDataSelect.searchData,
          government: [],
        },
      });
      return;
    }
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
    setForm({ ...form, cityId: "" });
    setAllDataSelect({
      ...allDataSelect,
      data: { ...allDataSelect.data, city: [] },
      searchData: {
        ...allDataSelect.searchData,
        city: [],
      },
    });
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
    setForm({ ...form, villageId: "", regionId: "", streetId: "" });
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
  const handleFormSelect = (e, itm) => {
    setForm({ ...form, [e.target.id]: itm });
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

  const selectCategories = (e, itm) => {
    if (!form[e.target.id].includes(itm)) {
      setForm({
        ...form,
        [e.target.id]: [...new Set([...form[e.target.id], itm])],
      });

      error && setError(false);
    }
  };

  const removeSelectCategories = (e, itm) => {
    const data = form[e.target.id].filter((ele) => ele !== itm);

    setForm({
      ...form,
      [e.target.id]: data,
    });
  };

  const response = useRef(true);
  const [responseOverlay, setResponseOverlay] = useState(false);

  const responseFun = (complete = false) => {
    complete === true
      ? (response.current = true)
      : complete === "reapeted data"
      ? (response.current = 400)
      : (response.current = false);
    setResponseOverlay(true);
    window.onclick = () => {
      setResponseOverlay(false);
    };
    setTimeout(() => {
      setResponseOverlay(false);
    }, 3000);
  };

  console.log(form.people);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.maritalStatus) setError("please select maritalStatus");
    else if (!form.gender) setError("please select gender");
    else if (!form.countryId) setError("please select country");
    else if (!form.governmentId) setError("please select government");
    else if (!form.cityId) setError("please select city");
    else if (!form.sectionId) setError("please select section");
    else if (!form.sources) setError("please select source");
    else {
      setLoading(true);
      const keys = Object.keys(form);
      const formData = new FormData();

      keys.forEach((key) => {
        if (
          (form[key] && !Array.isArray(form[key])) ||
          (Array.isArray(form[key]) && form[key]?.length !== 0)
        ) {
          if (!Array.isArray(form[key]))
            formData.append(key, form[key]?._id ? form[key]?._id : form[key]);
          else {
            form[key].forEach((item) => {
              formData.append(`${key}[]`, item._id || item);
            });
          }
        }
      });

      try {
        const data = await axios.post(`${baseURL}/people`, formData);
        if (data.status === 201) {
          responseFun(true);
          setForm({
            //personal data
            imgae: "",
            firstName: "",
            fatherName: "",
            surName: "",
            gender: "",
            maritalStatus: "",
            motherName: "",
            birthDate: "",
            placeOfBirth: "",
            occupation: "",
            countryId: "",
            governmentId: "",
            cityId: "",
            villageId: "",
            regionId: "",
            streetId: "",
            addressDetails: "",
            email: "",
            phone: "",
            sectionId: "",
            //categories data
            sources: "",
            events: [],
            parties: [],
          });
        }
      } catch (error) {
        console.log(error);
        if (error.status === 400) responseFun("reapeted data");
        else responseFun(false);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      {responseOverlay && (
        <SendData data={`person`} response={response.current} />
      )}
      {loading && <Loading />}
      <h1 className="title">add info</h1>
      <form onSubmit={handleSubmit} className="dashboard-form">
        <div className="form">
          <h1>subject info </h1>
          <div className="flex wrap">
            <div className="flex flex-direction">
              <label htmlFor="subject">subject</label>
              <textarea
                value={form.subject}
                onChange={handleForm}
                className="inp"
                placeholder="test"
                id="subject"
                rows={4}
              ></textarea>
            </div>
            <div className="flex flex-direction">
              <label htmlFor="note">note</label>
              <textarea
                value={form.note}
                onChange={handleForm}
                className="inp"
                placeholder="test"
                id="note"
                rows={4}
              ></textarea>
            </div>
            <div className="flex flex-direction">
              <label htmlFor="details">details</label>
              <textarea
                value={form.details}
                onChange={handleForm}
                className="inp"
                placeholder="test"
                id="details"
                rows={4}
              ></textarea>
            </div>
          </div>
        </div>

        <div className="form">
          <h1>place informations</h1>
          <div className="flex wrap">
            <div className="flex flex-direction">
              <label>country</label>
              <div className="selecte relative">
                <div onClick={handleClick} className="inp">
                  select country
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
                      id="countryId"
                      onClick={(e) => handleFormSelect(e, itm)}
                    >
                      {itm.name}
                    </h2>
                  ))}
                  {allDataSelect.searchData.country.length <= 0 && (
                    <p>no data</p>
                  )}
                </article>
                {form.countryId && (
                  <span title="countryId" onClick={ignoreSelect}>
                    {form.countryId.name}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-direction">
              <label>government</label>
              <div className="selecte relative">
                <div onClick={handleClick} className="inp">
                  select government
                </div>
                <article>
                  {form.countryId && (
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
                  )}
                  {allDataSelect.searchData.government.map((itm, i) => (
                    <h2
                      key={i}
                      id="governmentId"
                      onClick={(e) => handleFormSelect(e, itm)}
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
              {form.governmentId && (
                <span title="governmentId" onClick={ignoreSelect}>
                  {form.governmentId.name}
                </span>
              )}
            </div>

            <div className="flex flex-direction">
              <label>city</label>
              <div className="selecte relative">
                <div onClick={handleClick} className="inp">
                  select city
                </div>
                <article>
                  {form.governmentId && (
                    <input
                      onClick={(e) => e.stopPropagation()}
                      placeholder={`${searchPlaceholder} city`}
                      onInput={(inp) => {
                        const filteredCountries =
                          allDataSelect.data.city.filter((e) =>
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
                  )}
                  {allDataSelect.searchData.city.map((itm, i) => (
                    <h2
                      key={i}
                      id="cityId"
                      onClick={(e) => handleFormSelect(e, itm)}
                    >
                      {itm.name}
                    </h2>
                  ))}
                  {form.governmentId &&
                    allDataSelect.searchData.city.length <= 0 && <p>no data</p>}
                  {!form.governmentId && <p>please select government first</p>}
                </article>
              </div>
              {form.cityId && (
                <span title="cityId" onClick={ignoreSelect}>
                  {form.cityId.name}
                </span>
              )}
            </div>

            <div className="flex flex-direction">
              <label>village</label>
              <div className="selecte relative">
                <div onClick={handleClick} className="inp">
                  select village
                </div>
                <article>
                  {form.cityId && (
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
                  )}
                  {allDataSelect.searchData.village.map((itm, i) => (
                    <h2
                      key={i}
                      id="villageId"
                      onClick={(e) => handleFormSelect(e, itm)}
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
              {form.villageId && (
                <span title="villageId" onClick={ignoreSelect}>
                  {form.villageId.name}
                </span>
              )}
            </div>

            <div className="flex flex-direction">
              <label>region</label>
              <div className="selecte relative">
                <div onClick={handleClick} className="inp">
                  select region
                </div>
                <article>
                  {form.cityId && (
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
                  )}
                  {allDataSelect.searchData.region.map((itm, i) => (
                    <h2
                      key={i}
                      id="regionId"
                      onClick={(e) => handleFormSelect(e, itm)}
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
              {form.regionId && (
                <span title="regionId" onClick={ignoreSelect}>
                  {form.regionId.name}
                </span>
              )}
            </div>

            <div className="flex flex-direction">
              <label>street</label>
              <div className="selecte relative">
                <div onClick={handleClick} className="inp">
                  select street
                </div>
                <article>
                  {form.cityId && (
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
                  )}
                  {allDataSelect.searchData.street.map((itm, i) => (
                    <h2
                      key={i}
                      id="streetId"
                      onClick={(e) => handleFormSelect(e, itm)}
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
              {form.streetId && (
                <span title="streetId" onClick={ignoreSelect}>
                  {form.streetId.name}
                </span>
              )}
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
          <h1>more informations</h1>
          <div className="flex wrap">
            <div className="flex flex-direction">
              <label>section</label>
              <div className="selecte relative">
                <div onClick={handleClick} className="inp">
                  select section
                </div>
                <article>
                  <input
                    onClick={(e) => e.stopPropagation()}
                    placeholder={`${searchPlaceholder} section`}
                    onInput={(inp) => {
                      const filteredCountries =
                        allDataSelect.data.sections.filter((e) =>
                          e.source_name
                            .toLowerCase()
                            .includes(inp.target.value.toLowerCase())
                        );
                      setAllDataSelect({
                        ...allDataSelect,
                        searchData: {
                          ...allDataSelect.searchData,
                          sections: filteredCountries,
                        },
                      });
                    }}
                    type="text"
                  />
                  {allDataSelect.searchData.sections.map((itm, i) => (
                    <h2
                      key={i}
                      id="sectionId"
                      onClick={(e) => handleFormSelect(e, itm)}
                    >
                      {itm.name}
                    </h2>
                  ))}
                  {allDataSelect.searchData.sections.length <= 0 && (
                    <p>no data</p>
                  )}
                </article>
              </div>
              {form.sectionId && (
                <span title="sectionId" onClick={ignoreSelect}>
                  {form.sectionId.name}
                </span>
              )}
            </div>

            <div className="flex flex-direction">
              <label>events</label>
              <div className="selecte relative">
                <div onClick={handleClick} className="inp">
                  {"select events"}
                </div>
                <article>
                  <input
                    onClick={(e) => e.stopPropagation()}
                    placeholder={`${searchPlaceholder} events`}
                    onInput={(inp) => {
                      const filteredCountries =
                        allDataSelect.data.events.filter((e) =>
                          e.name
                            .toLowerCase()
                            .includes(inp.target.value.toLowerCase())
                        );
                      setAllDataSelect({
                        ...allDataSelect,
                        searchData: {
                          ...allDataSelect.searchData,
                          events: filteredCountries,
                        },
                      });
                    }}
                    type="text"
                  />
                  {allDataSelect.searchData.events.map((itm, i) => (
                    <h2
                      key={i}
                      id="events"
                      onClick={(e) => selectCategories(e, itm)}
                    >
                      {itm.name}
                    </h2>
                  ))}
                  {allDataSelect.searchData.events.length <= 0 && (
                    <p>no data</p>
                  )}
                </article>
              </div>
              <div className="flex selceted-itms">
                {form.events.map((span) => (
                  <span
                    onClick={(e) => removeSelectCategories(e, span)}
                    id="events"
                    key={span._id}
                  >
                    {span.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-direction">
              <label>parties</label>
              <div className="selecte relative">
                <div onClick={handleClick} className="inp">
                  {"select parties"}
                </div>
                <article>
                  <input
                    onClick={(e) => e.stopPropagation()}
                    placeholder={`${searchPlaceholder} parties`}
                    onInput={(inp) => {
                      const filteredCountries =
                        allDataSelect.data.parties.filter((e) =>
                          e.name
                            .toLowerCase()
                            .includes(inp.target.value.toLowerCase())
                        );
                      setAllDataSelect({
                        ...allDataSelect,
                        searchData: {
                          ...allDataSelect.searchData,
                          parties: filteredCountries,
                        },
                      });
                    }}
                    type="text"
                  />
                  {allDataSelect.searchData.parties.map((itm, i) => (
                    <h2
                      key={i}
                      id="parties"
                      onClick={(e) => selectCategories(e, itm)}
                    >
                      {itm.name}
                    </h2>
                  ))}
                  {allDataSelect.searchData.parties.length <= 0 && (
                    <p>no data</p>
                  )}
                </article>
              </div>
              <div className="flex selceted-itms">
                {form.parties.map((span) => (
                  <span
                    onClick={(e) => removeSelectCategories(e, span)}
                    id="parties"
                    key={span._id}
                  >
                    {span.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-direction">
              <label>sources</label>
              <div className="selecte relative">
                <div onClick={handleClick} className="inp">
                  {"select sources"}
                </div>
                <article>
                  <input
                    onClick={(e) => e.stopPropagation()}
                    placeholder={`${searchPlaceholder} sources`}
                    onInput={(inp) => {
                      const filteredCountries =
                        allDataSelect.data.sources.filter((e) =>
                          e.source_name
                            .toLowerCase()
                            .includes(inp.target.value.toLowerCase())
                        );
                      setAllDataSelect({
                        ...allDataSelect,
                        searchData: {
                          ...allDataSelect.searchData,
                          sources: filteredCountries,
                        },
                      });
                    }}
                    type="text"
                  />
                  {allDataSelect.searchData.sources.map((itm, i) => (
                    <h2
                      key={i}
                      id="sources"
                      onClick={(e) => selectCategories(e, itm)}
                    >
                      {itm.source_name}
                    </h2>
                  ))}
                  {allDataSelect.searchData.sources.length <= 0 && (
                    <p>no data</p>
                  )}
                </article>
              </div>
              <div className="flex selceted-itms">
                {form.sources.map((span) => (
                  <span
                    onClick={(e) => removeSelectCategories(e, span)}
                    id="sources"
                    key={span._id}
                  >
                    {span.source_name}
                  </span>
                ))}
              </div>
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

        <People workSpace="add_info" people={{ setForm, form }} />

        {error && <p className="error"> {error} </p>}
        <button className="btn">save</button>
      </form>
    </>
  );
};

export default AddInformation;
