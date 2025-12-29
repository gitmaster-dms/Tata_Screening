import React, { useState, useEffect } from "react";
import dermatology from "../../../../../../Images/Dermatology.png";
import mouth from "../../../../../../Images/Smiling Mouth.png";
import torso from "../../../../../../Images/Torso.png";
import axios from "axios";
import headpic from "../../../../../../Images/Head Massage Area.png";
// import './Generalexam.css'
import {
  Grid,
  Box,
  Typography,
  Card,
  Select,
  MenuItem,
  TextField,
  Button,
  InputLabel,
  FormControl,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useNavigate } from "react-router-dom";


const selectSx = {
  "& .MuiInputBase-input.MuiSelect-select": {
    fontSize: { xs: "13px", sm: "14px" },
    color: "#000",
  },
  "& .MuiSvgIcon-root": {
    color: "#000",
  },
};

const sectionTitleSx = {
  fontSize: { xs: "14px", sm: "15px", md: "16px" },
  fontWeight: 600,
};

const iconSx = {
  height: { xs: "32px", sm: "36px" },
  mr: 1.5,
};

const sectionCardSx = {
  display: "flex",
  alignItems: "center",
  px: 1.5,
  py: 1,
  mb: 2,
  width: "fit-content",
  minWidth: { xs: "100%", sm: "12rem" },
};
const Generalexam = ({
  pkid,
  onAcceptClick,
  citizensPkId,
  citizenidddddddd,
  selectedTab,
  subVitalList,
}) => {
  console.log(selectedTab, "selectedTab");

  //_________________________________START
  console.log(selectedTab, "Present name");
  console.log(subVitalList, "Overall GET API");
  const [nextName, setNextName] = useState("");
  const navigation = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    if (subVitalList && selectedTab) {
      const currentIndex = subVitalList.findIndex(
        (item) => item.sub_list === selectedTab
      );

      console.log("Current Index:", currentIndex);

      if (currentIndex !== -1 && currentIndex < subVitalList.length - 1) {
        const nextItem = subVitalList[currentIndex + 1];
        const nextName = nextItem.sub_list;
        setNextName(nextName);
        console.log("Next Name Set:", nextName);
      } else {
        setNextName("");
        console.log("No next item or selectedTab not found");
      }
    }
  }, [selectedTab, subVitalList]);
  //__________________________________END

  const userID = localStorage.getItem("userID");
  console.log(userID);
  console.log(
    citizenidddddddd,
    "mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm"
  );
  const accessToken = localStorage.getItem("token");

  //// access the source from local storage
  const source = localStorage.getItem("source");
  const Port = process.env.REACT_APP_API_KEY;
  const [headData, setHeadData] = useState([]);
  const [hairData, setHairData] = useState([]);
  const [hairDensity, setHairDensity] = useState([]);
  const [hairTexture, setHairTexture] = useState([]);
  const [alopecia, setAlopecia] = useState([]);
  const [neck, setNeck] = useState([]);
  const [nose, setNose] = useState([]);
  const [skinColor, setSkinColor] = useState([]);
  const [skinTexture, setSkinTexture] = useState([]);
  const [skinLessions, setSkinLessions] = useState([]);
  const [lips, setLips] = useState([]);
  const [gum, setGums] = useState([]);
  const [dention, setdention] = useState([]);
  const [mucosa, setMucosa] = useState([]);
  const [toungue, setToungue] = useState([]);
  const [chest, setChest] = useState([]);
  const [abdomen, setAbdomen] = useState([]);
  const [extremity, setExtremity] = useState([]);

  const [generalExam, setGeneralExam] = useState({
    head: null,
    hair_color: null,
    hair_density: null,
    hair_texture: null,
    alopecia: null,
    neck: null,
    nose: null,
    skin_color: null,
    skin_texture: null,
    skin_lesions: null,
    lips: null,
    gums: null,
    oral_mucosa: null,
    tongue: null,
    dention: null,
    chest: null,
    abdomen: null,
    extremity: null,
    citizen_pk_id: citizensPkId,
    added_by: userID,
    modify_by: userID,
    observation: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setGeneralExam((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const openSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  const [genderalpkid, setgenderalpkid] = useState(null);
  const fetchDataById = async (pkid) => {
    try {
      const response = await fetch(
        `${Port}/Screening/genral_examination_get_api/${pkid}/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();

        // Check if the array has at least one element before accessing properties
        if (Array.isArray(data) && data.length > 0) {
          const treatmentData = data[0];

          setGeneralExam((prevState) => ({
            ...prevState,
            head: treatmentData.head,
            hair_color: treatmentData.hair_color,
            hair_density: treatmentData.hair_density,
            hair_texture: treatmentData.hair_texture,
            alopecia: treatmentData.alopecia,
            neck: treatmentData.neck,
            nose: treatmentData.nose,
            skin_color: treatmentData.skin_color,
            skin_texture: treatmentData.skin_texture,
            skin_lesions: treatmentData.skin_lesions,
            lips: treatmentData.lips,
            gums: treatmentData.gums,
            oral_mucosa: treatmentData.oral_mucosa,
            tongue: treatmentData.tongue,
            dention: treatmentData.dention,
            chest: treatmentData.chest,
            abdomen: treatmentData.abdomen,
            extremity: treatmentData.extremity,
          }));
          setgenderalpkid(treatmentData.genral_pk_id);
        } else {
          console.error("Empty or invalid data array.");
        }
      } else {
        console.error("Server Error:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  useEffect(() => {
    fetchDataById(pkid);
  }, [pkid]);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setOpenDialog(true);

    // const isConfirmed = openSnackbar("Submit Basic Screen Form");
    // if (!isConfirmed) return;
    // const confirmationStatus = isConfirmed ? "True" : "False";

    const formData = {
      ...generalExam,
      // form_submit: confirmationStatus,
    };

    console.log("Form Data:", formData);

    try {
      const response = await fetch(
        `${Port}/Screening/genral_examination_post_api/${pkid}/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.status === 200) {
        console.log("Server Response:", data);

        // Check if the response contains the basic_screening_pk_id
        const basicScreeningPkId =
          data?.data.genral_pk_id || data?.data.genral_pk_id;

        console.log(basicScreeningPkId, "jjjjjjjj");

        if (basicScreeningPkId) {
          localStorage.setItem("basicScreeningId", basicScreeningPkId);
          console.log("basicScreeningId:", basicScreeningPkId);
          onAcceptClick(nextName, basicScreeningPkId);

          openSnackbar("General Examination Saved Successfully.");
        } else {
          console.error("Basic Screening ID not found in response data");
          // Optionally, handle this case as appropriate
        }
      } else {
        console.error("Error:", response.status);
        openSnackbar("Error Saving General Examination.");
        // Optionally, show a message to the user
      }
    } catch (error) {
      console.error("Error sending data:", error.message);
    }
  };

  const handleCancel = () => {
    setOpenDialog(false);
  };

  const extractBasicScreeningPkId = (data) => {
    return data.updated_data
      ? data.updated_data.basic_screening_pk_id
      : undefined;
  };

  // head
  useEffect(() => {
    const headFetch = async () => {
      try {
        const response = await axios.get(`${Port}/Screening/head_scalp/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Include the authorization header
          },
        });
        setHeadData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    headFetch();
  }, []);

  // hair color
  useEffect(() => {
    const hairFetch = async () => {
      try {
        const response = await axios.get(`${Port}/Screening/hair_color/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Include the authorization header
          },
        });
        setHairData(response.data);
      } catch (error) {
        console.log(error, "error fetching Data");
      }
    };
    hairFetch();
  }, []);

  // hair density
  useEffect(() => {
    const hairDensityFetch = async () => {
      try {
        const response = await axios.get(`${Port}/Screening/hair_density/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Include the authorization header
          },
        });
        setHairDensity(response.data);
      } catch (error) {
        console.log(error, "error fetching Data");
      }
    };
    hairDensityFetch();
  }, []);

  // hair texture
  useEffect(() => {
    const hairDensityFetch = async () => {
      try {
        const response = await axios.get(`${Port}/Screening/hair_texture/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Include the authorization header
          },
        });
        setHairTexture(response.data);
      } catch (error) {
        console.log(error, "error fetching Data");
      }
    };
    hairDensityFetch();
  }, []);

  // Alopecia
  useEffect(() => {
    const alopeciaFetch = async () => {
      try {
        const response = await axios.get(`${Port}/Screening/alopecia/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Include the authorization header
          },
        });
        setAlopecia(response.data);
      } catch (error) {
        console.log(error, "error fetching Data");
      }
    };
    alopeciaFetch();
  }, []);

  // Neck
  useEffect(() => {
    const neckFetch = async () => {
      try {
        const response = await axios.get(`${Port}/Screening/neck/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Include the authorization header
          },
        });
        setNeck(response.data);
      } catch (error) {
        console.log(error, "error fetching Data");
      }
    };
    neckFetch();
  }, []);

  // Neck
  useEffect(() => {
    const noseFetch = async () => {
      try {
        const response = await axios.get(`${Port}/Screening/nose/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Include the authorization header
          },
        });
        setNose(response.data);
      } catch (error) {
        console.log(error, "error fetching Data");
      }
    };
    noseFetch();
  }, []);

  // Skin color
  useEffect(() => {
    const SkinColourfetch = async () => {
      try {
        const response = await axios.get(`${Port}/Screening/skin_color/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Include the authorization header
          },
        });
        setSkinColor(response.data);
      } catch (error) {
        console.log(error, "error fetching Data");
      }
    };
    SkinColourfetch();
  }, []);

  // Skin Texture
  useEffect(() => {
    const SkinTexturefetch = async () => {
      try {
        const response = await axios.get(`${Port}/Screening/skin_texture/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Include the authorization header
          },
        });
        setSkinTexture(response.data);
      } catch (error) {
        console.log(error, "error fetching Data");
      }
    };
    SkinTexturefetch();
  }, []);

  // Skin Lesion
  useEffect(() => {
    const SkinColourfetch = async () => {
      try {
        const response = await axios.get(`${Port}/Screening/skin_lension/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Include the authorization header
          },
        });
        setSkinLessions(response.data);
      } catch (error) {
        console.log(error, "error fetching Data");
      }
    };
    SkinColourfetch();
  }, []);

  // Lips
  useEffect(() => {
    const lipsFetch = async () => {
      try {
        const response = await axios.get(`${Port}/Screening/lips/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Include the authorization header
          },
        });
        setLips(response.data);
      } catch (error) {
        console.log(error, "error fetching Data");
      }
    };
    lipsFetch();
  }, []);

  // Gums
  useEffect(() => {
    const gumFetch = async () => {
      try {
        const response = await axios.get(`${Port}/Screening/gums/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Include the authorization header
          },
        });
        setGums(response.data);
      } catch (error) {
        console.log(error, "error fetching Data");
      }
    };
    gumFetch();
  }, []);

  // dention
  useEffect(() => {
    const dentionFetch = async () => {
      try {
        const response = await axios.get(`${Port}/Screening/dentition/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Include the authorization header
          },
        });
        setdention(response.data);
      } catch (error) {
        console.log(error, "error fetching Data");
      }
    };
    dentionFetch();
  }, []);

  // Healthy Mucosa
  useEffect(() => {
    const mucosaFetch = async () => {
      try {
        const response = await axios.get(`${Port}/Screening/oral_mucosa/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Include the authorization header
          },
        });
        setMucosa(response.data);
      } catch (error) {
        console.log(error, "error fetching Data");
      }
    };
    mucosaFetch();
  }, []);

  // toungue
  useEffect(() => {
    const toungueFetch = async () => {
      try {
        const response = await axios.get(`${Port}/Screening/tounge/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Include the authorization header
          },
        });
        setToungue(response.data);
      } catch (error) {
        console.log(error, "error fetching Data");
      }
    };
    toungueFetch();
  }, []);

  // chest
  useEffect(() => {
    const toungueFetch = async () => {
      try {
        const response = await axios.get(`${Port}/Screening/chest/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Include the authorization header
          },
        });
        setChest(response.data);
      } catch (error) {
        console.log(error, "error fetching Data");
      }
    };
    toungueFetch();
  }, []);

  // Abdomen
  useEffect(() => {
    const abdomenFetch = async () => {
      try {
        const response = await axios.get(`${Port}/Screening/abdomen/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Include the authorization header
          },
        });
        setAbdomen(response.data);
      } catch (error) {
        console.log(error, "error fetching Data");
      }
    };
    abdomenFetch();
  }, []);

  // Extremity
  useEffect(() => {
    const extremityFetch = async () => {
      try {
        const response = await axios.get(`${Port}/Screening/extremity/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Include the authorization header
          },
        });
        setExtremity(response.data);
      } catch (error) {
        console.log(error, "error fetching Data");
      }
    };
    extremityFetch();
  }, []);

  return (
    <Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 600,
          mb: 1,
          color: "#333",
          fontSize: "17px",
        }}
      >
        General Examination
      </Typography>
      <Box sx={{ borderBottom: "2px solid #ddd", mb: 2 }} />

      <form >
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ display: "flex", alignItems: "center" }}>
              <Box
                component="img"
                src={headpic}
                alt="head"
                sx={{ width: 50, mr: 2, backgroundColor: "#9ACAA1" ,padding:"5px"}}
              />
              <Typography sx={{fontSize:"16px",fontWeight:500,fontFamily:"Roboto"}}>Head / Scalp</Typography>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Head / Scalp</InputLabel>
              <Select
                sx={{
                  "& .MuiInputBase-input.MuiSelect-select": {
                    color: "#000 !important",
                  },
                  "& .MuiSvgIcon-root": {
                    color: "#000",
                  },
                }}
                name="head"
                value={generalExam.head || ""}
                onChange={handleChange}
                label="Head / Scalp"
              >
                <MenuItem value="">Select</MenuItem>
                {headData.map((drop) => (
                  <MenuItem key={drop.head_scalp_id} value={drop.head_scalp_id}>
                    {drop.head_scalp}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {source === "1" && (
            <>
              {/* Hair Color */}
              <Grid item xs={12} md={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Hair Color</InputLabel>
                  <Select
                    sx={{
                      "& .MuiInputBase-input.MuiSelect-select": {
                        color: "#000 !important",
                      },
                      "& .MuiSvgIcon-root": {
                        color: "#000",
                      },
                    }}
                    name="hair_color"
                    value={generalExam.hair_color || ""}
                    onChange={handleChange}
                    label="Hair Color"
                  >
                    <MenuItem value="">Select</MenuItem>
                    {hairData.map((drop) => (
                      <MenuItem
                        key={drop.hair_color_id}
                        value={drop.hair_color_id}
                      >
                        {drop.hair_color}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Hair Density */}
              <Grid item xs={12} md={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Hair Density</InputLabel>
                  <Select
                    sx={{
                      "& .MuiInputBase-input.MuiSelect-select": {
                        color: "#000 !important",
                      },
                      "& .MuiSvgIcon-root": {
                        color: "#000",
                      },
                    }}
                    name="hair_density"
                    value={generalExam.hair_density || ""}
                    onChange={handleChange}
                    label="Hair Density"
                  >
                    <MenuItem value="">Select</MenuItem>
                    {hairDensity.map((drop) => (
                      <MenuItem
                        key={drop.hair_density_id}
                        value={drop.hair_density_id}
                      >
                        {drop.hair_density}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Hair Texture */}
              <Grid item xs={12} md={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Hair Texture</InputLabel>
                  <Select
                    sx={{
                      "& .MuiInputBase-input.MuiSelect-select": {
                        color: "#000 !important",
                      },
                      "& .MuiSvgIcon-root": {
                        color: "#000",
                      },
                    }}
                    name="hair_texture"
                    value={generalExam.hair_texture || ""}
                    onChange={handleChange}
                    label="Hair Texture"
                  >
                    <MenuItem value="">Select</MenuItem>
                    {hairTexture.map((drop) => (
                      <MenuItem
                        key={drop.hair_texture_id}
                        value={drop.hair_texture_id}
                      >
                        {drop.hair_texture}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </>
          )}

          {/* Alopecia */}
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Alopecia</InputLabel>
              <Select
                sx={{
                  "& .MuiInputBase-input.MuiSelect-select": {
                    color: "#000 !important",
                  },
                  "& .MuiSvgIcon-root": {
                    color: "#000",
                  },
                }}
                name="alopecia"
                value={generalExam.alopecia || ""}
                onChange={handleChange}
                label="Alopecia"
              >
                <MenuItem value="">Select</MenuItem>
                {alopecia.map((drop) => (
                  <MenuItem key={drop.alopecia_id} value={drop.alopecia_id}>
                    {drop.alopecia}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Neck */}
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Neck</InputLabel>
              <Select
                sx={{
                  "& .MuiInputBase-input.MuiSelect-select": {
                    color: "#000 !important",
                  },
                  "& .MuiSvgIcon-root": {
                    color: "#000",
                  },
                }}
                name="neck"
                value={generalExam.neck || ""}
                onChange={handleChange}
                label="Neck"
              >
                <MenuItem value="">Select</MenuItem>
                {neck.map((drop) => (
                  <MenuItem key={drop.neck_id} value={drop.neck_id}>
                    {drop.neck}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Nose */}
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Nose</InputLabel>
              <Select
                sx={{
                  "& .MuiInputBase-input.MuiSelect-select": {
                    color: "#000 !important",
                  },
                  "& .MuiSvgIcon-root": {
                    color: "#000",
                  },
                }}
                name="nose"
                value={generalExam.nose || ""}
                onChange={handleChange}
                label="Nose"
              >
                <MenuItem value="">Select</MenuItem>
                {nose.map((drop) => (
                  <MenuItem key={drop.nose_id} value={drop.nose_id}>
                    {drop.nose}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Box sx={{ mt: 1 }}>
          <Card
            sx={{ display: "flex", alignItems: "center", mb: 2, width: "10em" }}
          >
            <Box
              component="img"
              src={dermatology}
              alt="skin"
              sx={{ height: "2.5em", mr: 2, backgroundColor: "#F3D8A5" ,padding:"0.3em",}}
            />
            <Typography sx={{fontSize:"16px",fontWeight:500,fontFamily:"Roboto"}}>Skin</Typography>
          </Card>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Skin Colour</InputLabel>
              <Select
                sx={{
                  "& .MuiInputBase-input.MuiSelect-select": {
                    color: "#000 !important",
                  },
                  "& .MuiSvgIcon-root": {
                    color: "#000",
                  },
                }}
                name="skin_color"
                value={generalExam.skin_color || ""}
                onChange={handleChange}
                label="Skin Colour"
              >
                <MenuItem value="">Select</MenuItem>
                {skinColor.map((drop) => (
                  <MenuItem key={drop.skin_id} value={drop.skin_id}>
                    {drop.skin_color}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {source === "1" && (
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Skin Texture</InputLabel>
                <Select
                  sx={{
                    "& .MuiInputBase-input.MuiSelect-select": {
                      color: "#000 !important",
                    },
                    "& .MuiSvgIcon-root": {
                      color: "#000",
                    },
                  }}
                  name="skin_texture"
                  value={generalExam.skin_texture || ""}
                  onChange={handleChange}
                  label="Skin Texture"
                >
                  <MenuItem value="">Select</MenuItem>
                  {skinTexture.map((drop) => (
                    <MenuItem
                      key={drop.skin_texture_id}
                      value={drop.skin_texture_id}
                    >
                      {drop.skin_texture}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}

          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Skin Lesions</InputLabel>
              <Select
                sx={{
                  "& .MuiInputBase-input.MuiSelect-select": {
                    color: "#000 !important",
                  },
                  "& .MuiSvgIcon-root": {
                    color: "#000",
                  },
                }}
                name="skin_lesions"
                value={generalExam.skin_lesions || ""}
                onChange={handleChange}
                label="Skin Lesions"
              >
                <MenuItem value="">Select</MenuItem>
                {skinLessions.map((drop) => (
                  <MenuItem
                    key={drop.skin_lesions_id}
                    value={drop.skin_lesions_id}
                  >
                    {drop.skin_lesions}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3 }}>
          <Card
            sx={{ display: "flex", alignItems: "center", mb: 2, width: "10em" }}
          >
            <Box
              component="img"
              src={mouth}
              alt="skin"
              sx={{ height: "2.5em", mr: 2, backgroundColor: "#D27E7B" ,padding:"4px"}}
            />
            <Typography sx={{fontSize:"16px",fontWeight:500,fontFamily:"Roboto",}}>Mouth</Typography>
          </Card>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Lips</InputLabel>
              <Select
                sx={{
                  "& .MuiInputBase-input.MuiSelect-select": {
                    color: "#000 !important",
                  },
                  "& .MuiSvgIcon-root": {
                    color: "#000",
                  },
                }}
                name="lips"
                value={generalExam.lips || ""}
                onChange={handleChange}
                label="Lips"
              >
                <MenuItem value="">Select</MenuItem>
                {lips.map((drop) => (
                  <MenuItem key={drop.lips_id} value={drop.lips_id}>
                    {drop.lips}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Gums */}
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Gums</InputLabel>
              <Select
                sx={{
                  "& .MuiInputBase-input.MuiSelect-select": {
                    color: "#000 !important",
                  },
                  "& .MuiSvgIcon-root": {
                    color: "#000",
                  },
                }}
                name="gums"
                value={generalExam.gums || ""}
                onChange={handleChange}
                label="Gums"
              >
                <MenuItem value="">Select</MenuItem>
                {gum.map((drop) => (
                  <MenuItem key={drop.gums_id} value={drop.gums_id}>
                    {drop.gums}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Dention */}
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Dention</InputLabel>
              <Select
                sx={{
                  "& .MuiInputBase-input.MuiSelect-select": {
                    color: "#000 !important",
                  },
                  "& .MuiSvgIcon-root": {
                    color: "#000",
                  },
                }}
                name="dention"
                value={generalExam.dention || ""}
                onChange={handleChange}
                label="Dention"
              >
                <MenuItem value="">Select</MenuItem>
                {dention.map((drop) => (
                  <MenuItem key={drop.dentition_id} value={drop.dentition_id}>
                    {drop.dentition}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Oral Mucosa */}
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Oral Mucosa</InputLabel>
              <Select
                sx={{
                  "& .MuiInputBase-input.MuiSelect-select": {
                    color: "#000 !important",
                  },
                  "& .MuiSvgIcon-root": {
                    color: "#000",
                  },
                }}
                name="oral_mucosa"
                value={generalExam.oral_mucosa || ""}
                onChange={handleChange}
                label="Oral Mucosa"
              >
                <MenuItem value="">Select</MenuItem>
                {mucosa.map((drop) => (
                  <MenuItem
                    key={drop.oral_mucosa_id}
                    value={drop.oral_mucosa_id}
                  >
                    {drop.oral_mucosa}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Tongue */}
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Tongue</InputLabel>
              <Select
                sx={{
                  "& .MuiInputBase-input.MuiSelect-select": {
                    color: "#000 !important",
                  },
                  "& .MuiSvgIcon-root": {
                    color: "#000",
                  },
                }}
                name="tongue"
                value={generalExam.tongue || ""}
                onChange={handleChange}
                label="Tongue"
              >
                <MenuItem value="">Select</MenuItem>
                {toungue.map((drop) => (
                  <MenuItem key={drop.tounge_id} value={drop.tounge_id}>
                    {drop.tounge}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3 }}>
          <Card
            sx={{ display: "flex", alignItems: "center", mb: 2, width: "10em" }}
          >
            <Box
              component="img"
              src={torso}
              alt="skin"
              sx={{ height: "2.5em", mr: 2, backgroundColor: "#6790D8" ,padding:"4px"}}
            />
            <Typography  sx={{fontSize:"16px",fontWeight:500,fontFamily:"Roboto"}}>Other</Typography>
          </Card>
        </Box>

        <Grid container spacing={2}>
          {source === "1" && (
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Chest</InputLabel>
                <Select
                  sx={{
                    "& .MuiInputBase-input.MuiSelect-select": {
                      color: "#000 !important",
                    },
                    "& .MuiSvgIcon-root": {
                      color: "#000",
                    },
                  }}
                  name="chest"
                  value={generalExam.chest || ""}
                  onChange={handleChange}
                  label="Chest"
                >
                  <MenuItem value="">Select</MenuItem>
                  {chest.map((drop) => (
                    <MenuItem key={drop.chest_id} value={drop.chest_id}>
                      {drop.chest}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}

          {/* Abdomen */}
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Abdomen</InputLabel>
              <Select
                sx={{
                  "& .MuiInputBase-input.MuiSelect-select": {
                    color: "#000 !important",
                  },
                  "& .MuiSvgIcon-root": {
                    color: "#000",
                  },
                }}
                name="abdomen"
                value={generalExam.abdomen || ""}
                onChange={handleChange}
                label="Abdomen"
              >
                <MenuItem value="">Select</MenuItem>
                {abdomen.map((drop) => (
                  <MenuItem key={drop.abdomen_id} value={drop.abdomen_id}>
                    {drop.abdomen}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Extremity */}
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Extremity</InputLabel>
              <Select
                sx={{
                  "& .MuiInputBase-input.MuiSelect-select": {
                    color: "#000 !important",
                  },
                  "& .MuiSvgIcon-root": {
                    color: "#000",
                  },
                }}
                name="extremity"
                value={generalExam.extremity || ""}
                onChange={handleChange}
                label="Extremity"
              >
                <MenuItem value="">Select</MenuItem>
                {extremity.map((drop) => (
                  <MenuItem key={drop.extremity_id} value={drop.extremity_id}>
                    {drop.extremity}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Observation */}
        {source === "5" && (
          <Box sx={{ mt: 3 }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              name="observation"
              value={generalExam.observation || ""}
              onChange={handleChange}
              label="General Remark"
            />
          </Box>
        )}

        <Grid
          item
          xs={12}
          sx={{
            mt: 2,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button
            type="button"

            variant="contained"
            color="primary"
            size="medium"
            onClick={handleOpenDialog}
            sx={{
              textTransform: "none",
              borderRadius: 2,
            }}
          >
            Submit
          </Button>
        </Grid>
        <Dialog open={openDialog} onClose={handleCancel}>
          <DialogTitle>Confirm Submission</DialogTitle>

          <DialogContent>
            <Typography>
              Are you sure you want to submit this General Examination form?
            </Typography>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleCancel} color="error">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary" variant="contained">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </form>
    </Box>
  );
};

export default Generalexam;
