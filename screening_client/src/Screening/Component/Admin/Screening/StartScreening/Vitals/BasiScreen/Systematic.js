import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";

const Systematic = ({
  pkid,
  onAcceptClick,
  citizensPkId,
  selectedTab,
  subVitalList,
}) => {
  //_________________________________START
  console.log(selectedTab, "Present name");
  console.log(subVitalList, "Overall GET API");
  const [nextName, setNextName] = useState("");

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
  //_________________________________END

  // console.log('Systematic ID :', basicScreeningPkId);
  const basicScreeningPkId = localStorage.getItem("basicScreeningId");
  console.log("Retrieved Basic Id from Local Storage:", basicScreeningPkId);

  //// access the source from local storage
  const source = localStorage.getItem("source");
  ////////////////////////////////////

  const userID = localStorage.getItem("userID");
  console.log(userID);
  const accessToken = localStorage.getItem("token"); // Retrieve access token
  const Port = process.env.REACT_APP_API_KEY;
  //////////////// systematic exam
  const [rsright, setRsright] = useState([]);
  const [rsleft, setRsleft] = useState([]);
  const [cvs, setCvs] = useState([]);
  const [varicose, setVaricose] = useState([]);
  const [lmp, setLmp] = useState([]);
  const [cns, setCns] = useState([]);
  const [reflexes, setReflexes] = useState([]);
  const [romberg, setRomberg] = useState([]);
  const [pupils, setPupils] = useState([]);
  const [pa, setPa] = useState([]);
  const [tenderness, setTenderness] = useState([]);
  const [ascitis, setAscitis] = useState([]);
  const [guarding, setGuarding] = useState([]);
  const [joints, setJoints] = useState([]);
  const [swollen, setSwollen] = useState([]);
  const [spine, setSpine] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const openSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  console.log(basicScreeningPkId, "Systematic Exam");

  const [systematicExam, setSystematicExam] = useState({
    rs_right: null,
    rs_left: null,
    cvs: null,
    varicose_veins: null,
    lmp: null,
    cns: null,
    reflexes: null,
    rombergs: null,
    pupils: null,
    p_a: null,
    tenderness: null,
    ascitis: null,
    guarding: null,
    joints: null,
    swollen_joints: null,
    spine_posture: null,
    modify_by: userID,
    discharge: "",
    genito_urinary: "",
    hydrocele: "",
    cervical: "",
    axilla: "",
    inguinal: "",
    thyroid: "",
  });

  const fetchDataById = async (pkid) => {
    try {
      const response = await fetch(
        `${Port}/Screening/systemic_examination_get_api/${pkid}/`,
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
        if (Array.isArray(data) && data.length > 0) {
          const treatmentData = data[0];
          setSystematicExam((prevState) => ({
            ...prevState,
            rs_right: treatmentData.rs_right,
            rs_left: treatmentData.rs_left,
            cvs: treatmentData.cvs,
            varicose_veins: treatmentData.varicose_veins,
            lmp: treatmentData.lmp,
            cns: treatmentData.cns,
            reflexes: treatmentData.reflexes,
            rombergs: treatmentData.rombergs,
            pupils: treatmentData.pupils,
            pa: treatmentData.pa,
            tenderness: treatmentData.tenderness,
            ascitis: treatmentData.ascitis,
            guarding: treatmentData.guarding,
            joints: treatmentData.joints,
            swollen_joints: treatmentData.swollen_joints,
            spine_posture: treatmentData.spine_posture,
            discharge: treatmentData.discharge,
            genito_urinary: treatmentData.genito_urinary,
            hydrocele: treatmentData.hydrocele,
            cervical: treatmentData.cervical,
            axilla: treatmentData.axilla,
            inguinal: treatmentData.inguinal,
            thyroid: treatmentData.thyroid,
          }));
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

  const handleChange = (event) => {
    const { name, value } = event.target;

    setSystematicExam((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      ...systematicExam,
    };

    console.log("Form Data:", formData);

    try {
      const response = await fetch(
        `${Port}/Screening/systemic_examination_post_api/${pkid}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`, // Include the authorization header
          },
          body: JSON.stringify({
            ...formData,
            modify_by: userID,
          }),
                    // body: JSON.stringify(formData),

        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(data,"nextcount");

        // Backend se next count aata hai
        const nextCount = data.data?.screening_count;
        

        // SubVitalList me us count ka screen nikaalo
        const nextScreen = subVitalList?.find(
          (item) => item.screening_count === nextCount
        )?.screening_list;

        console.log("Next Screen:", nextScreen);

        onAcceptClick(nextScreen, basicScreeningPkId);
        openSnackbar("Systematic Examination Saved Successfully.");

        if (response.status === 200) {
          const basicScreeningPkId = data.systemic_pk_id;
          localStorage.setItem("basicScreeningId", basicScreeningPkId);
          console.log("basicScreeningId", basicScreeningPkId);
          openSnackbar("Systematic Examination Saved Successfully.");
          onAcceptClick(nextName, basicScreeningPkId);
        } else if (response.status === 400) {
          console.error("Bad Request:", data.error);
          openSnackbar("Saved, but ID missing!");
        } else if (response.status === 500) {
          openSnackbar("Internal Server Error. Try again later.", "error");
        } else {
          console.error("Unhandled Status Code:", response.status);
          openSnackbar("Something went wrong!");
        }
      } else {
        console.error("Error:", response.status);
      }
    } catch (error) {
      console.error("Error sending data:", error.message);
    }
  };

  // Rs Right
  useEffect(() => {
    const rsrightFetch = async () => {
      try {
        const response = await axios.get(`${Port}/Screening/rs_right/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Include the authorization header
          },
        });
        setRsright(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    rsrightFetch();
  }, []);

  // Rs left
  useEffect(() => {
    const rsleftFetch = async () => {
      try {
        const response = await axios.get(`${Port}/Screening/rs_left/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Include the authorization header
          },
        });
        setRsleft(response.data);
      } catch (error) {
        console.log(error, "error fetching Data");
      }
    };
    rsleftFetch();
  }, []);

  // CVS
  useEffect(() => {
    const CVSFetch = async () => {
      try {
        const response = await axios.get(`${Port}/Screening/cvs/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Include the authorization header
          },
        });
        setCvs(response.data);
      } catch (error) {
        console.log(error, "error fetching Data");
      }
    };
    CVSFetch();
  }, []);

  // Varicose
  useEffect(() => {
    const VaricoseFetch = async () => {
      try {
        const response = await axios.get(`${Port}/Screening/varicose_veins/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Include the authorization header
          },
        });
        setVaricose(response.data);
      } catch (error) {
        console.log(error, "error fetching Data");
      }
    };
    VaricoseFetch();
  }, []);

  // LMP
  useEffect(() => {
    const LMPFetch = async () => {
      try {
        const response = await axios.get(`${Port}/Screening/lmp/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Include the authorization header
          },
        });
        setLmp(response.data);
      } catch (error) {
        console.log(error, "error fetching Data");
      }
    };
    LMPFetch();
  }, []);

  // CNS
  useEffect(() => {
    const CNSFetch = async () => {
      try {
        const response = await axios.get(`${Port}/Screening/cns/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Include the authorization header
          },
        });
        setCns(response.data);
      } catch (error) {
        console.log(error, "error fetching Data");
      }
    };
    CNSFetch();
  }, []);

  // Reflexes
  useEffect(() => {
    const ReflexesFetch = async () => {
      try {
        const response = await axios.get(`${Port}/Screening/reflexes/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Include the authorization header
          },
        });
        setReflexes(response.data);
      } catch (error) {
        console.log(error, "error fetching Data");
      }
    };
    ReflexesFetch();
  }, []);

  // Romberg
  useEffect(() => {
    const RombergFetch = async () => {
      try {
        const response = await axios.get(`${Port}/Screening/rombergs/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Include the authorization header
          },
        });
        setRomberg(response.data);
      } catch (error) {
        console.log(error, "error fetching Data");
      }
    };
    RombergFetch();
  }, []);

  // Pupils
  useEffect(() => {
    const PupilsFetch = async () => {
      try {
        const response = await axios.get(`${Port}/Screening/pupils/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Include the authorization header
          },
        });
        setPupils(response.data);
      } catch (error) {
        console.log(error, "error fetching Data");
      }
    };
    PupilsFetch();
  }, []);

  // PA
  useEffect(() => {
    const PaFetch = async () => {
      try {
        const response = await axios.get(`${Port}/Screening/pa/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Include the authorization header
          },
        });
        setPa(response.data);
      } catch (error) {
        console.log(error, "error fetching Data");
      }
    };
    PaFetch();
  }, []);

  // Tenderness
  useEffect(() => {
    const TendernessFetch = async () => {
      try {
        const response = await axios.get(`${Port}/Screening/tendernes/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Include the authorization header
          },
        });
        setTenderness(response.data);
      } catch (error) {
        console.log(error, "error fetching Data");
      }
    };
    TendernessFetch();
  }, []);

  // Ascitis
  useEffect(() => {
    const AscitisFetch = async () => {
      try {
        const response = await axios.get(`${Port}/Screening/ascitis/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Include the authorization header
          },
        });
        setAscitis(response.data);
      } catch (error) {
        console.log(error, "error fetching Data");
      }
    };
    AscitisFetch();
  }, []);

  // Guarding
  useEffect(() => {
    const GuardingFetch = async () => {
      try {
        const response = await axios.get(`${Port}/Screening/guarding/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Include the authorization header
          },
        });
        setGuarding(response.data);
      } catch (error) {
        console.log(error, "error fetching Data");
      }
    };
    GuardingFetch();
  }, []);

  // Joints
  useEffect(() => {
    const JointsFetch = async () => {
      try {
        const response = await axios.get(`${Port}/Screening/joints/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Include the authorization header
          },
        });
        setJoints(response.data);
      } catch (error) {
        console.log(error, "error fetching Data");
      }
    };
    JointsFetch();
  }, []);

  // Swollen
  useEffect(() => {
    const SwollenFetch = async () => {
      try {
        const response = await axios.get(`${Port}/Screening/swollen_joints/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Include the authorization header
          },
        });
        setSwollen(response.data);
      } catch (error) {
        console.log(error, "error fetching Data");
      }
    };
    SwollenFetch();
  }, []);

  // Spine
  useEffect(() => {
    const SpineFetch = async () => {
      try {
        const response = await axios.get(`${Port}/Screening/spine_posture/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Include the authorization header
          },
        });
        setSpine(response.data);
      } catch (error) {
        console.log(error, "error fetching Data");
      }
    };
    SpineFetch();
  }, []);

  return (
    <div>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          mb: 1,
          color: "#333",
          fontSize: "17px",
        }}
      >
        Systemic Exam
      </Typography>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
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

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>RS Right</InputLabel>
              <Select
                sx={{
                  "& .MuiInputBase-input.MuiSelect-select": {
                    color: "#000 !important",
                  },
                  "& .MuiSvgIcon-root": {
                    color: "#000",
                  },
                }}
                label="RS Right"
                name="rs_right"
                value={systematicExam.rs_right || ""}
                onChange={handleChange}
              >
                <MenuItem value="">Select</MenuItem>
                {rsright.map((drop) => (
                  <MenuItem key={drop.rs_right_id} value={drop.rs_right_id}>
                    {drop.rs_right}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>RS Left</InputLabel>
              <Select
                sx={{
                  "& .MuiInputBase-input.MuiSelect-select": {
                    color: "#000 !important",
                  },
                  "& .MuiSvgIcon-root": {
                    color: "#000",
                  },
                }}
                label="RS Left"
                name="rs_left"
                value={systematicExam.rs_left || ""}
                onChange={handleChange}
              >
                <MenuItem value="">Select</MenuItem>
                {rsleft.map((drop) => (
                  <MenuItem key={drop.rs_left_id} value={drop.rs_left_id}>
                    {drop.rs_left}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>CVS</InputLabel>
              <Select
                sx={{
                  "& .MuiInputBase-input.MuiSelect-select": {
                    color: "#000 !important",
                  },
                  "& .MuiSvgIcon-root": {
                    color: "#000",
                  },
                }}
                label="CVS"
                name="cvs"
                value={systematicExam.cvs || ""}
                onChange={handleChange}
              >
                <MenuItem value="">Select</MenuItem>
                {cvs.map((drop) => (
                  <MenuItem key={drop.cvs_id} value={drop.cvs_id}>
                    {drop.cvs}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Varicose Veins</InputLabel>
              <Select
                sx={{
                  "& .MuiInputBase-input.MuiSelect-select": {
                    color: "#000 !important",
                  },
                  "& .MuiSvgIcon-root": {
                    color: "#000",
                  },
                }}
                label="Varicose Veins"
                name="varicose_veins"
                value={systematicExam.varicose_veins || ""}
                onChange={handleChange}
              >
                <MenuItem value="">Select</MenuItem>
                {varicose.map((drop) => (
                  <MenuItem
                    key={drop.varicose_veins_id}
                    value={drop.varicose_veins_id}
                  >
                    {drop.varicose_veins}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {source === "1" && (
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>LMP</InputLabel>
                <Select
                  sx={{
                    "& .MuiInputBase-input.MuiSelect-select": {
                      color: "#000 !important",
                    },
                    "& .MuiSvgIcon-root": {
                      color: "#000",
                    },
                  }}
                  label="LMP"
                  name="lmp"
                  value={systematicExam.lmp || ""}
                  onChange={handleChange}
                >
                  <MenuItem value="">Select</MenuItem>
                  {lmp.map((drop) => (
                    <MenuItem key={drop.lmp_id} value={drop.lmp_id}>
                      {drop.lmp}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}

          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>CNS</InputLabel>
              <Select
                sx={{
                  "& .MuiInputBase-input.MuiSelect-select": {
                    color: "#000 !important",
                  },
                  "& .MuiSvgIcon-root": {
                    color: "#000",
                  },
                }}
                label="CNS"
                name="cns"
                value={systematicExam.cns || ""}
                onChange={handleChange}
              >
                <MenuItem value="">Select</MenuItem>
                {cns.map((drop) => (
                  <MenuItem key={drop.cns_id} value={drop.cns_id}>
                    {drop.cns}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Reflexes</InputLabel>
              <Select
                sx={{
                  "& .MuiInputBase-input.MuiSelect-select": {
                    color: "#000 !important",
                  },
                  "& .MuiSvgIcon-root": {
                    color: "#000",
                  },
                }}
                label="Reflexes"
                name="reflexes"
                value={systematicExam.reflexes || ""}
                onChange={handleChange}
              >
                <MenuItem value="">Select</MenuItem>
                {reflexes.map((drop) => (
                  <MenuItem key={drop.reflexes_id} value={drop.reflexes_id}>
                    {drop.reflexes}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Romberg’s</InputLabel>
              <Select
                sx={{
                  "& .MuiInputBase-input.MuiSelect-select": {
                    color: "#000 !important",
                  },
                  "& .MuiSvgIcon-root": {
                    color: "#000",
                  },
                }}
                label="Romberg’s"
                name="rombergs"
                value={systematicExam.rombergs || ""}
                onChange={handleChange}
              >
                <MenuItem value="">Select</MenuItem>
                {romberg.map((drop) => (
                  <MenuItem key={drop.rombergs_id} value={drop.rombergs_id}>
                    {drop.rombergs}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Pupils</InputLabel>
              <Select
                sx={{
                  "& .MuiInputBase-input.MuiSelect-select": {
                    color: "#000 !important",
                  },
                  "& .MuiSvgIcon-root": {
                    color: "#000",
                  },
                }}
                label="Pupils"
                name="pupils"
                value={systematicExam.pupils || ""}
                onChange={handleChange}
              >
                <MenuItem value="">Select</MenuItem>
                {pupils.map((drop) => (
                  <MenuItem key={drop.pupils_id} value={drop.pupils_id}>
                    {drop.pupils}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>P/A</InputLabel>
              <Select
                sx={{
                  "& .MuiInputBase-input.MuiSelect-select": {
                    color: "#000 !important",
                  },
                  "& .MuiSvgIcon-root": {
                    color: "#000",
                  },
                }}
                label="P/A"
                name="pa"
                value={systematicExam.pa || ""}
                onChange={handleChange}
              >
                <MenuItem value="">Select</MenuItem>
                {pa.map((drop) => (
                  <MenuItem key={drop.pa_id} value={drop.pa_id}>
                    {drop.pa}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Tenderness</InputLabel>
              <Select
                sx={{
                  "& .MuiInputBase-input.MuiSelect-select": {
                    color: "#000 !important",
                  },
                  "& .MuiSvgIcon-root": {
                    color: "#000",
                  },
                }}
                label="Tenderness"
                name="tenderness"
                value={systematicExam.tenderness || ""}
                onChange={handleChange}
              >
                <MenuItem value="">Select</MenuItem>
                {tenderness.map((drop) => (
                  <MenuItem key={drop.tenderness_id} value={drop.tenderness_id}>
                    {drop.tenderness}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Ascitis</InputLabel>
              <Select
                sx={{
                  "& .MuiInputBase-input.MuiSelect-select": {
                    color: "#000 !important",
                  },
                  "& .MuiSvgIcon-root": {
                    color: "#000",
                  },
                }}
                label="Ascitis"
                name="ascitis"
                value={systematicExam.ascitis || ""}
                onChange={handleChange}
              >
                <MenuItem value="">Select</MenuItem>
                {ascitis.map((drop) => (
                  <MenuItem key={drop.ascitis_id} value={drop.ascitis_id}>
                    {drop.ascitis}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Guarding</InputLabel>
              <Select
                sx={{
                  "& .MuiInputBase-input.MuiSelect-select": {
                    color: "#000 !important",
                  },
                  "& .MuiSvgIcon-root": {
                    color: "#000",
                  },
                }}
                label="Guarding"
                name="guarding"
                value={systematicExam.guarding || ""}
                onChange={handleChange}
              >
                <MenuItem value="">Select</MenuItem>
                {guarding.map((drop) => (
                  <MenuItem key={drop.guarding_id} value={drop.guarding_id}>
                    {drop.guarding}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {source === "1" && (
            <>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Joints</InputLabel>
                  <Select
                    sx={{
                      "& .MuiInputBase-input.MuiSelect-select": {
                        color: "#000 !important",
                      },
                      "& .MuiSvgIcon-root": {
                        color: "#000",
                      },
                    }}
                    label="Joints"
                    name="joints"
                    value={systematicExam.joints || ""}
                    onChange={handleChange}
                  >
                    <MenuItem value="">Select</MenuItem>
                    {joints.map((drop) => (
                      <MenuItem key={drop.joints_id} value={drop.joints_id}>
                        {drop.joints}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Swollen Joints</InputLabel>
                  <Select
                    sx={{
                      "& .MuiInputBase-input.MuiSelect-select": {
                        color: "#000 !important",
                      },
                      "& .MuiSvgIcon-root": {
                        color: "#000",
                      },
                    }}
                    label="Swollen Joints"
                    name="swollen_joints"
                    value={systematicExam.swollen_joints || ""}
                    onChange={handleChange}
                  >
                    <MenuItem value="">Select</MenuItem>
                    {swollen.map((drop) => (
                      <MenuItem
                        key={drop.swollen_joints_id}
                        value={drop.swollen_joints_id}
                      >
                        {drop.swollen_joints}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Spine / Posture</InputLabel>
                  <Select
                    sx={{
                      "& .MuiInputBase-input.MuiSelect-select": {
                        color: "#000 !important",
                      },
                      "& .MuiSvgIcon-root": {
                        color: "#000",
                      },
                    }}
                    label="Spine / Posture"
                    name="spine_posture"
                    value={systematicExam.spine_posture || ""}
                    onChange={handleChange}
                  >
                    <MenuItem value="">Select</MenuItem>
                    {spine.map((drop) => (
                      <MenuItem
                        key={drop.spine_posture_id}
                        value={drop.spine_posture_id}
                      >
                        {drop.spine_posture}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </>
          )}

          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Genito Urinary</InputLabel>
              <Select
                sx={{
                  "& .MuiInputBase-input.MuiSelect-select": {
                    color: "#000 !important",
                  },
                  "& .MuiSvgIcon-root": {
                    color: "#000",
                  },
                }}
                label="Genito Urinary"
                name="discharge"
                value={systematicExam.discharge || ""}
                onChange={handleChange}
              >
                <MenuItem value="">Select</MenuItem>
                <MenuItem value="Normal">Normal</MenuItem>
                <MenuItem value="Abnormal">Abnormal</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Discharge</InputLabel>
              <Select
                sx={{
                  "& .MuiInputBase-input.MuiSelect-select": {
                    color: "#000 !important",
                  },
                  "& .MuiSvgIcon-root": {
                    color: "#000",
                  },
                }}
                label="Discharge"
                name="genito_urinary"
                value={systematicExam.genito_urinary || ""}
                onChange={handleChange}
              >
                <MenuItem value="">Select</MenuItem>
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Hydrocele */}
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Hydrocele</InputLabel>
              <Select
                sx={{
                  "& .MuiInputBase-input.MuiSelect-select": {
                    color: "#000 !important",
                  },
                  "& .MuiSvgIcon-root": {
                    color: "#000",
                  },
                }}
                label="Hydrocele"
                name="hydrocele"
                value={systematicExam.hydrocele || ""}
                onChange={handleChange}
              >
                <MenuItem value="">Select</MenuItem>
                <MenuItem value="Present">Present</MenuItem>
                <MenuItem value="Absent">Absent</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Cervical */}
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Cervical</InputLabel>
              <Select
                sx={{
                  "& .MuiInputBase-input.MuiSelect-select": {
                    color: "#000 !important",
                  },
                  "& .MuiSvgIcon-root": {
                    color: "#000",
                  },
                }}
                label="Cervical"
                name="cervical"
                value={systematicExam.cervical || ""}
                onChange={handleChange}
              >
                <MenuItem value="">Select</MenuItem>
                <MenuItem value="Palpable">Palpable</MenuItem>
                <MenuItem value="Not Palpable">Not Palpable</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Axilla */}
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Axilla</InputLabel>
              <Select
                sx={{
                  "& .MuiInputBase-input.MuiSelect-select": {
                    color: "#000 !important",
                  },
                  "& .MuiSvgIcon-root": {
                    color: "#000",
                  },
                }}
                label="Axilla"
                name="axilla"
                value={systematicExam.axilla || ""}
                onChange={handleChange}
              >
                <MenuItem value="">Select</MenuItem>
                <MenuItem value="Palpable">Palpable</MenuItem>
                <MenuItem value="Not Palpable">Not Palpable</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Inguinal */}
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Inguinal</InputLabel>
              <Select
                sx={{
                  "& .MuiInputBase-input.MuiSelect-select": {
                    color: "#000 !important",
                  },
                  "& .MuiSvgIcon-root": {
                    color: "#000",
                  },
                }}
                label="Inguinal"
                name="inguinal"
                value={systematicExam.inguinal || ""}
                onChange={handleChange}
              >
                <MenuItem value="">Select</MenuItem>
                <MenuItem value="Palpable">Palpable</MenuItem>
                <MenuItem value="Not Palpable">Not Palpable</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Thyroid */}
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Thyroid</InputLabel>
              <Select
                sx={{
                  "& .MuiInputBase-input.MuiSelect-select": {
                    color: "#000 !important",
                  },
                  "& .MuiSvgIcon-root": {
                    color: "#000",
                  },
                }}
                label="Thyroid"
                name="thyroid"
                value={systematicExam.thyroid || ""}
                onChange={handleChange}
              >
                <MenuItem value="">Select</MenuItem>
                <MenuItem value="Palpable">Palpable</MenuItem>
                <MenuItem value="Not Palpable">Not Palpable</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Button
          variant="contained"
          size="small"
          type="submit"
          sx={{ mt: 3, backgroundColor: "#1976d2", textTransform: "none" }}
        >
          Submit
        </Button>
      </form>
    </div>
  );
};

export default Systematic;
