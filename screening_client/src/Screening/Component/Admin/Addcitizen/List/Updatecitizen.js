import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Grid,
  Typography,
  TextField,
  MenuItem,
  IconButton,
  Paper,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Link, useParams } from "react-router-dom";
import Childupdate from "./Childupdate";
import CorporateUpdate from "./CorporateUpdate";
import { API_URL } from "../../../../../Config/api";

const Updatecitizen = () => {
  const accessToken = localStorage.getItem("token");
  // const API_URL = process.env.REACT_APP_API_KEY;

  const { id, sourceId } = useParams();
  const [data1, setData1] = useState([]);
  const [sourceStateNav, setSourceStateNav] = useState([]);

  const [selectedAge1, setSelectedAge1] = useState({
    age: { id: "", name: "" },
    gender: { id: "", name: "" },
    source: { id: "", name: "" },
    type: { id: "", name: "" },
    disease: { id: "", name: "" },
  });
console.log(selectedAge1.type.id, "typessss");

  const [AgeNav, setAgeNav] = useState([]);
  const [GenderNav, setGenderNav] = useState([]);
  const [SourceNav, setSourceNav] = useState([]);
  const [screeningFor, setScreeningFor] = useState([]);
  console.log(screeningFor, "screeningFor");

  const [DiseaseNav, setDiseaseNav] = useState([]);

  const [ageError, setAgeError] = useState("");
  const [genderError, setGenderError] = useState("");
  const [sourceError, setSourceError] = useState("");

  // ------------------ FETCH DATA ------------------ //
  useEffect(() => {
    let apiUrl;
    if (id === "Community") {
      apiUrl = `${API_URL}/Screening/add_citizen_get/${id}/`;
    } else if (sourceId === "Corporate") {
      apiUrl = `${API_URL}/Screening/add_employee_get/${id}/`;
    } else {
      return;
    }

    axios
      .get(apiUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setData1(response.data);
        setSelectedAge1({
          age: {
            id: response.data.age || "",
            name: response.data.age_name || "",
          },
          gender: {
            id: response.data.gender || "",
            name: response.data.gender_name || "",
          },
          source: {
            id: response.data.source || "",
            name: response.data.source_id_name || "",
          },
          type: {
            id: response.data.category || "",
            name: response.data.pk_id || "",
          },
          disease: {
            id: response.data.disease || "",
            name: response.data.disease_name || "",
          },
        });

        axios
          .get(`${API_URL}/Screening/State_Get/${response.data.source}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          })
          .then((res) => setSourceStateNav(res.data))
          .catch((err) => console.error("Error second API:", err));
      })
      .catch((error) => console.error("Error:", error));
  }, [API_URL, accessToken, id, sourceId]);

  useEffect(() => {
    const fetchDropdown = async (url, setFn) => {
      try {
        const res = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });
        setFn(res.data);
      } catch (err) {
        console.error("Error fetching:", err);
      }
    };

    fetchDropdown(`${API_URL}/Screening/Age_GET/`, setAgeNav);
    fetchDropdown(`${API_URL}/Screening/Gender_GET/`, setGenderNav);
    fetchDropdown(`${API_URL}/Screening/source_GET/`, setSourceNav);
    fetchDropdown(
      `${API_URL}/Screening/child_disease_info_get/`,
      setDiseaseNav
    );
  }, [API_URL, accessToken]);

  useEffect(() => {
    if (selectedAge1) {
      axios
        .get(`${API_URL}/Screening/Category_Get/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          const data = res.data;
          setScreeningFor(Array.isArray(data) ? data : data ? [data] : []);
        })
        .catch((err) => console.error("Error fetching type:", err));
    }
  }, [selectedAge1.source.id, API_URL, accessToken]);

  // ------------------ HANDLE CHANGE ------------------ //
  const handleChange = (e) => {
    const { name, value } = e.target;
    const selectedOption = { id: "", name: value };

    switch (name) {
      case "age":
        selectedOption.id =
          AgeNav.find((opt) => opt.age === value)?.age_pk_id || "";
        break;
      case "gender":
        selectedOption.id =
          GenderNav.find((opt) => opt.gender === value)?.gender_pk_id || "";
        break;
      case "source":
        selectedOption.id =
          SourceNav.find((opt) => opt.source === value)?.source_pk_id || "";
        break;
      case "type": {
        const selected = screeningFor.find(
          (opt) => opt.pk_id.toString() === value
        );

        selectedOption.id = value; // ID
        selectedOption.name = selected?.category || ""; // LABEL
        break;
      }

      case "disease":
        selectedOption.id =
          DiseaseNav.find((opt) => opt.disease === value)?.disease_pk_id || "";
        break;
      default:
        break;
    }

    setSelectedAge1((prev) => ({
      ...prev,
      [name]: selectedOption,
    }));

    if (name === "source") {
      axios
        .get(`${API_URL}/Screening/Category_Get/${selectedOption.id}`)
        .then((res) => {
          const data = res.data;
          setScreeningFor(Array.isArray(data) ? data : data ? [data] : []);
        })
        .catch((err) => console.error("Error fetching type:", err));
    }
  };

  useEffect(() => {
    axios
      .get(`${API_URL}/Screening/Category_Get/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log("Category Loaded:", res.data);
        const data = res.data;
        setScreeningFor(Array.isArray(data) ? data : data ? [data] : []);
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  const [citizenData, setCitizenData] = useState({});

  const fetchCitizenData = async () => {
    try {
      const response = await fetch(
        `${API_URL}/Screening/Citizen_Put_api/${id}/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      console.log("Citizen Data:", data);

      setCitizenData(data);
      setData1(data);
      // Update selectedAge1 so selects show the updated option labels
      setSelectedAge1({
        age: { id: data.age || "", name: data.age_name || "" },
        gender: { id: data.gender || "", name: data.gender_name || "" },
        source: { id: data.source || "", name: data.source_id_name || "" },
        type: {
          id: data.category?.toString() || "", // ✅ ID
          name: data.category_name || "", // ✅ LABEL
        },
        disease: { id: data.disease || "", name: data.disease_name || "" },
      });
    } catch (error) {
      console.error("Error fetching citizen data:", error);
    }
  };

  useEffect(() => {
    fetchCitizenData();
  }, [id]);
  return (
    <Box sx={{ p: 2, minHeight: "100vh", m: "0.1em 0em 0em 2.5em" }}>
      <Paper elevation={2} sx={{ p: 1, borderRadius: 3 }}>
        <Grid container alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <Grid item>
            <Link
              to="/mainscreen/Citizen"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <IconButton>
                <ArrowBackIosIcon sx={{ color: "#1A237E" }} />
              </IconButton>
            </Link>
          </Grid>
          <Grid item>
            <Typography variant="h6" fontWeight="bold" color="#1A237E">
              Update Citizen
            </Typography>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          {/* <Grid item xs={12} sm={4} md={2.4}>
                        <TextField
                            select
                            name="age"
                            value={selectedAge1.age.name}
                            onChange={handleChange}
                            size="small"
                            fullWidth
                            error={!!ageError}
                            helperText={ageError}
                            label={
                                <span>
                                    Age<span style={{ color: 'red' }}>*</span>
                                </span>
                            }
                        >
                            {AgeNav.map((drop) => (
                                <MenuItem key={drop.age_pk_id} value={drop.age}>
                                    {drop.age}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid> */}

          <Grid item xs={12} sm={4} md={2.4}>
            <TextField
              select
              name="gender"
              value={selectedAge1.gender.name}
              onChange={handleChange}
              size="small"
              fullWidth
              error={!!genderError}
              helperText={genderError}
              label={
                <span>
                  Gender<span style={{ color: "red" }}>*</span>
                </span>
              }
              sx={{
                "& .MuiInputBase-input.MuiSelect-select": {
                  color: "#000 !important",
                },
                "& .MuiSvgIcon-root": {
                  color: "#000",
                },
              }}
            >
              {GenderNav.map((drop) => (
                <MenuItem key={drop.gender_pk_id} value={drop.gender}>
                  {drop.gender}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* <Grid item xs={12} sm={4} md={2.4}>
                        <TextField
                            select
                            name="source"
                            value={selectedAge1.source.name}
                            onChange={handleChange}
                            size="small"
                            fullWidth
                            error={!!sourceError}
                            helperText={sourceError}
                            label={
                                <span>
                                    Source<span style={{ color: 'red' }}>*</span>
                                </span>
                            }
                        >
                            {SourceNav.map((drop) => (
                                <MenuItem key={drop.source_pk_id} value={drop.source}>
                                    {drop.source}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid> */}

          <Grid item xs={12} sm={4} md={2.4}>
            <TextField
              select
              name="type"
              value={selectedAge1.type.name || ""}
              onChange={handleChange}
              size="small"
              fullWidth
              InputLabelProps={{
                sx: {
                  fontWeight: 100,
                  fontSize: "14px",
                  color: "black !important",
                },
              }}
              SelectProps={{
                MenuProps: {
                  classes: { paper: "custom-menu-paper" },
                },
              }}
              sx={{
                "& .MuiInputBase-input": { color: "black" },
                "& .MuiSelect-select": { color: "black !important" }, // <-- FIXEDss
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "black" },
                  "&:hover fieldset": { borderColor: "black" },
                  "&.Mui-focused fieldset": { borderColor: "black" },
                },
                "& .MuiSvgIcon-root": { color: "black" },
              }}
              label={
                <span>
                  Type<span style={{ color: "red" }}>*</span>
                </span>
              }
            >
              {screeningFor.map((drop) => (
                <MenuItem key={drop.pk_id} value={drop.category}>
                  {drop.category}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* <Grid item xs={12} sm={4} md={2.4}>
                        <TextField
                            select
                            name="disease"
                            value={selectedAge1.disease.name}
                            onChange={handleChange}
                            size="small"
                            fullWidth
                            label={
                                <span>
                                    Disease<span style={{ color: 'red' }}>*</span>
                                </span>
                            }
                        >
                            {DiseaseNav.map((drop) => (
                                <MenuItem key={drop.disease_pk_id} value={drop.disease}>
                                    {drop.disease}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid> */}
        </Grid>
      </Paper>

      <Box mt={2}>
        {citizenData?.source_id_name === "Community" && (
          <CorporateUpdate
            data={data1}
            main={selectedAge1}
            state={sourceStateNav}
          />
        )}
        {/* {sourceId === 'Corporate' && (
                    <CorporateUpdate data={data1} main={selectedAge1} state={sourceStateNav} />
                )} */}
      </Box>
    </Box>
  );
};

export default Updatecitizen;
