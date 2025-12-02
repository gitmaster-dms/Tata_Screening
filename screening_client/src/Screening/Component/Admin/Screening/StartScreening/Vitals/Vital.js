import React, { useState, useEffect } from "react";
import "./Vital.css";
import greenheart from "../../../../../Images/Greenheart.png";
import blueheart from "../../../../../Images/Blueheart.png";
import darkgreeneheart from "../../../../../Images/Darkgreenheart.png";
import temperature from "../../../../../Images/temperature.png";
import blueheartline from "../../../../../Images/blueheartline.png";
import redheart from "../../../../../Images/RedHeart.png";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Grid,
  Card,
  Typography,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
  Alert,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  MenuItem,
  InputLabel,
  Select,
} from "@mui/material";
import NotStartedIcon from "@mui/icons-material/NotStarted";
const Vital = ({
  year,
  pkid,
  citizensPkId,
  gender,
  selectedId,
  fetchVital,
  selectedName,
  onAcceptClick,
}) => {
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  console.log(pkid, "pkidpkidpkid");

  //_________________________________START
  console.log(selectedName, "Present name");
  console.log(fetchVital, "Overall GET API");
  const [nextName, setNextName] = useState("");

  useEffect(() => {
    if (fetchVital && selectedName) {
      const currentIndex = fetchVital.findIndex(
        (item) => item.screening_list === selectedName
      );

      console.log("Current Indexxxx:", currentIndex);

      if (currentIndex !== -1 && currentIndex < fetchVital.length - 1) {
        const nextItem = fetchVital[currentIndex + 1];
        const nextName = nextItem.screening_list;
        setNextName(nextName);
        console.log("Next Name Setttt:", nextName);
      } else {
        setNextName("");
        console.log("No next item or selectedName not found");
      }
    }
  }, [selectedName, fetchVital]);
  //_________________________________END

  const userID = localStorage.getItem("userID");
  console.log(selectedId, "selected id fetching..............");

  useEffect(() => {
    console.log("Fetched Vital Data:", fetchVital);
  }, [fetchVital]);

  console.log(userID);
  const accessToken = localStorage.getItem("token");

  const Port = process.env.REACT_APP_API_KEY;
  //////// pulse
  const [pulseValue, setPulseValue] = useState(null);
  const [pulseResponse, setPulseResponse] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  /////// sys
  const [sys, setSys] = useState(null);
  const [sysResponse, setSysResponse] = useState("");
  const [showErrorSys, setShowErrorSys] = useState(false);
  /////// dys
  const [dys, setDys] = useState(null);
  const [dysResponse, setDysResponse] = useState("");
  const [showErrorDys, setShowErrorDys] = useState(false);
  /////// rr
  const [rr, setRr] = useState(null);
  const [rrResponse, setRrResponse] = useState("");
  const [showErrorRr, setShowErrorRr] = useState(false);
  /////// sats
  const [sats, setSats] = useState(null);
  const [satsResponse, setSatsResponse] = useState("");
  const [showErrorSats, setShowErrorSats] = useState(false);
  /////// temp
  const [temp, setTemp] = useState(null);
  console.log(temp, "temptemptemptemptemp");

  const [tempResponse, setTempResponse] = useState("");
  const [showErrorTemp, setShowErrorTemp] = useState(false);
  /////// hb
  const [hb, setHb] = useState(null);
  const [hbResponse, setHbResponse] = useState("");
  const [showErrorHb, setShowErrorHb] = useState(false);
  ///////// vital from
  const [showVitalForm, setShowVitalForm] = useState(false);
  const [referredToSpecialist, setReferredToSpecialist] = useState(null);
  const [doctorList, setDoctorList] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState("");

  useEffect(() => {
    if (referredToSpecialist === 1) {
      fetchDoctors();
    } else {
      setDoctorList([]);
    }
  }, [referredToSpecialist]);

  const fetchDoctors = async () => {
    try {
      setLoadingDoctors(true);

      const res = await fetch(`${Port}/Screening/Doctor_List/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await res.json();
      setDoctorList(data || []);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setLoadingDoctors(false);
    }
  };
  console.log("Selected doctor:", selectedDoctor);

  ////pulse
  useEffect(() => {
    if (pulseValue !== "") {
      const fetchData = async () => {
        try {
          const response = await fetch(
            `${Port}/Screening/pulse_get_api/${year}/${pulseValue}/`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`, // Include the authorization header
              },
            }
          );

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          const data = await response.json();
          setPulseResponse(data.message);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
    }
  }, [pulseValue]);

  ///// sys
  useEffect(() => {
    if (sys !== "") {
      const fetchData = async () => {
        try {
          const response = await fetch(
            `${Port}/Screening/sys_get_api/${year}/${sys}/`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`, // Include the authorization header
              },
            }
          );

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          const data = await response.json();
          setSysResponse(data.message);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
    }
  }, [sys]);

  ///// dys
  useEffect(() => {
    if (dys !== "") {
      const fetchData = async () => {
        try {
          const response = await fetch(
            `${Port}/Screening/dys_get_api/${year}/${dys}/`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`, // Include the authorization header
              },
            }
          );

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          const data = await response.json();
          setDysResponse(data.message);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
    }
  }, [dys]);

  ///// rr
  useEffect(() => {
    if (rr !== "") {
      const fetchData = async () => {
        try {
          const response = await fetch(
            `${Port}/Screening/rr_get_api/${year}/${rr}/`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`, // Include the authorization header
              },
            }
          );

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          const data = await response.json();
          setRrResponse(data.message);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
    }
  }, [rr]);

  ///// sats
  useEffect(() => {
    if (sats !== "") {
      const fetchData = async () => {
        try {
          const response = await fetch(
            `${Port}/Screening/o2sat_get_api/${year}/${sats}/`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`, // Include the authorization header
              },
            }
          );

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          const data = await response.json();
          setSatsResponse(data.message);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
    }
  }, [sats]);

  ///// temp
  useEffect(() => {
    if (temp !== "") {
      const fetchData = async () => {
        try {
          const response = await fetch(
            `${Port}/Screening/temp_get_api/${year}/${temp}/`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          const data = await response.json();
          setTempResponse(data.message);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
    }
  }, [temp]);

  ///// hb
  useEffect(() => {
    if (hb !== "") {
      const fetchData = async () => {
        try {
          const response = await fetch(
            `${Port}/Screening/hb_get_api/${gender}/${year}/${hb}/`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`, // Include the authorization header
              },
            }
          );

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          const data = await response.json();
          setHbResponse(data.message);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
    }
  }, [hb]);

  const handlePulseInputChange = (event) => {
    const inputValue = event.target.value.replace(/[^0-9]/g, "");

    setPulseValue(inputValue); // Update the state with the cleaned numeric value

    if (inputValue !== "") {
      const numericValue = parseInt(inputValue, 10);

      if (!isNaN(numericValue) && numericValue <= 160) {
        setShowErrorModal(false); // Clear error when the input is valid
        setPulseResponse(""); // Clear the response when the input is cleared
      } else {
        setShowErrorModal(true);
        setPulseResponse(""); // Clear the response when the input is cleared
      }
    } else {
      setShowErrorModal(false); // Clear error when the input is cleared
      setPulseResponse(""); // Clear the response when the input is cleared
    }
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
  };

  ////sys
  const handleSysInputChange = (event) => {
    const inputValue = event.target.value.replace(/[^0-9]/g, "");

    setSys(inputValue); // Update the state with the cleaned numeric value

    if (inputValue !== "") {
      const numericValue = parseInt(inputValue, 10);

      if (!isNaN(numericValue) && numericValue <= 160) {
        setShowErrorSys(false); // Clear error when the input is valid
        setSysResponse(""); // Clear the response when the input is cleared
      } else {
        setShowErrorSys(true);
        setSysResponse(""); // Clear the response when the input is cleared
      }
    } else {
      setShowErrorSys(false); // Clear error when the input is cleared
      setSysResponse(""); // Clear the response when the input is cleared
    }
  };

  const handleCloseErrorSys = () => {
    setShowErrorSys(false);
  };

  const handleDysInputChange = (event) => {
    const inputValue = event.target.value;

    if (inputValue !== "") {
      if (inputValue <= 160) {
        setDys(inputValue);
        setShowErrorDys(false); // Clear error when the input is valid
        // validateDys(inputValue);
      } else {
        setShowErrorDys(true);
        setDys(""); // Clear the input field
        setDysResponse(""); // Clear the response when the input is cleared
      }
    } else {
      setDys(""); // Clear the input field
      setShowErrorDys(false); // Clear error when the input is cleared
      setDysResponse(""); // Clear the response when the input is cleared
    }
  };

  const handleCloseErrorDys = () => {
    setShowErrorDys(false);
  };

  // RR
  const handleRrInputChange = (event) => {
    const inputValue = event.target.value;

    if (inputValue !== "") {
      if (inputValue <= 160) {
        setRr(inputValue);
        setShowErrorRr(false); // Clear error when the input is valid
        // validateRr(inputValue);
      } else {
        setShowErrorRr(true);
        setRr(""); // Clear the input field
        setRrResponse(""); // Clear the response when the input is cleared
      }
    } else {
      setRr(""); // Clear the input field
      setShowErrorRr(false); // Clear error when the input is cleared
      setRrResponse(""); // Clear the response when the input is cleared
    }
  };

  const handleCloseErrorRr = () => {
    setShowErrorRr(false);
  };

  // Sats
  const handleSatsInputChange = (event) => {
    const inputValue = event.target.value;

    if (inputValue !== "") {
      if (inputValue <= 160) {
        setSats(inputValue);
        setShowErrorSats(false); // Clear error when the input is valid
        // validateSats(inputValue);
      } else {
        setShowErrorSats(true);
        setSats(""); // Clear the input field
        setSatsResponse(""); // Clear the response when the input is cleared
      }
    } else {
      setSats(""); // Clear the input field
      setShowErrorSats(false); // Clear error when the input is cleared
      setSatsResponse(""); // Clear the response when the input is cleared
    }
  };

  const handleCloseErrorSats = () => {
    setShowErrorSats(false);
  };

  // Temp
  const [loading, setLoading] = useState(false);

  // const fetchDataTemp = async (paramValue) => {
  //     setLoading(true);
  //     try {
  //         const response = await fetch(`${Port}/Screening/device_data/?type=${paramValue}`);
  //         if (!response.ok) {
  //             throw new Error("Network response was not ok");
  //         }
  //         const data = await response.json();
  //         const tempValue = Math.floor(data.temperature);
  //         const sys = Math.floor(data.systolicPressure);
  //         const SPO2 = Math.floor(data.spo2);
  //         const pulse = Math.floor(data.heartRate);
  //         setTemp(tempValue)
  //         setSys(sys)
  //         setSats(SPO2)
  //         setPulseValue(pulse)
  //     } catch (error) {
  //         setTemp("Error fetching data");
  //     }
  //     setLoading(false);
  // };

  const fetchDatapulse = async (paramValue) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${Port}/Screening/device_data/?type=${paramValue}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      const pulse = Math.floor(data.heartRate);
      setPulseValue(pulse);
    } catch (error) {
      setTemp("Error fetching data");
    }
    setLoading(false);
  };

  const fetchDataTemp = async (paramValue) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${Port}/Screening/device_data/?type=${paramValue}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      const temp = Math.floor(data.temperature);
      setTemp(temp);
    } catch (error) {
      setTemp("Error fetching data");
    }
    setLoading(false);
  };

  const fetchDatadys = async (paramValue) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${Port}/Screening/device_data/?type=${paramValue}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      const dys = Math.floor(data.diastolicPressure);
      setDys(dys);
    } catch (error) {
      setTemp("Error fetching data");
    }
    setLoading(false);
  };

  const fetchDatasys = async (paramValue) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${Port}/Screening/device_data/?type=${paramValue}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      const sys = Math.floor(data.systolicPressure);
      setSys(sys);
    } catch (error) {
      setTemp("Error fetching data");
    }
    setLoading(false);
  };

  const fetchDataspo2 = async (paramValue) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${Port}/Screening/device_data/?type=${paramValue}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      const SPO2 = Math.floor(data.spo2);
      setSats(SPO2);
    } catch (error) {
      setTemp("Error fetching data");
    }
    setLoading(false);
  };

  const handleTempInputChange = (event) => {
    const inputValue = event.target.value;

    if (inputValue !== "") {
      if (inputValue <= 170) {
        setTemp(inputValue);
        setShowErrorTemp(false);
      } else {
        setShowErrorTemp(true);
        setTemp("");
        setTempResponse("");
      }
    } else {
      setTemp("");
      setShowErrorTemp(false);
      setTempResponse("");
    }
  };

  const handleCloseErrorTemp = () => {
    setShowErrorTemp(false);
  };

  // Hb
  const handleHbInputChange = (event) => {
    const inputValue = event.target.value;

    if (inputValue !== "") {
      if (inputValue <= 20) {
        setHb(inputValue);
        setShowErrorHb(false); // Clear error when the input is valid
        // validateHb(inputValue);
      } else {
        setShowErrorHb(true);
        setHb(""); // Clear the input field
        setHbResponse(""); // Clear the response when the input is cleared
      }
    } else {
      setHb(""); // Clear the input field
      setShowErrorHb(false); // Clear error when the input is cleared
      setHbResponse(""); // Clear the response when the input is cleared
    }
  };

  const handleCloseErrorHb = () => {
    setShowErrorHb(false);
  };

  //////////// vital from
  const handleVitalForm = () => {
    setShowVitalForm(false);
  };

  const handleSubmit = () => {
    // const isConfirmed = window.confirm('Submit Vital Form');
    const confirmationStatus = "True";

    const formData = {
      pulse: pulseValue !== "" ? pulseValue : null,
      pulse_conditions: pulseResponse,
      sys_mm: sys !== "" ? sys : null,
      sys_mm_conditions: sysResponse,
      dys_mm: dys !== "" ? dys : null,
      dys_mm_conditions: dysResponse,
      hb: hb !== "" ? hb : null,
      hb_conditions: hbResponse,
      oxygen_saturation: sats !== "" ? sats : null,
      oxygen_saturation_conditions: satsResponse,
      rr: rr !== "" ? rr : null,
      rr_conditions: rrResponse,
      temp: temp !== "" ? temp : null,
      temp_conditions: tempResponse,
      citizen_pk_id: citizensPkId,
      form_submit: confirmationStatus,
      added_by: userID,
      modify_by: userID,
      reffered_to_specialist: referredToSpecialist,
      refer_doctor: selectedDoctor,
    };

    console.log("Form Data:", formData);

    if (confirmationStatus === "True") {
      fetch(`${Port}/Screening/Vital_Info_Post/${pkid}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      })
        .then((response) => {
          if (response.status === 201) {
            setShowVitalForm(true);
            onAcceptClick(nextName);
            return response.json();
          } else if (response.status === 400) {
            alert("Fill the * marked Field");
          } else if (response.status === 500) {
            alert("Error");
          } else if (response.status === 200) {
            onAcceptClick(nextName);
          }
        })
        .then((data) => {
          console.log("Success:", data);
        })
        .catch((error) => {
          console.error("Error:", error.message);
        });
    } else {
      // The user clicked "Cancel," do nothing or handle it as needed
      console.log("Form submission canceled");
    }
  };

  const fetchCitizenVitalInfo = () => {
    fetch(`${Port}/Screening/Vital_Info_Get/${pkid}/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`, // Include the authorization header
        "Content-Type": "application/json", // Ensure correct content type
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        return response.json();
      })
      .then((data) => {
        if (data && data.length > 0) {
          const firstRecord = data[0];
          console.log("First Record:", firstRecord);
          if (
            firstRecord.reffered_to_specialist !== undefined &&
            firstRecord.reffered_to_specialist !== null
          ) {
            setReferredToSpecialist(firstRecord.reffered_to_specialist);
            console.log(
              "Referred to Specialist:",
              firstRecord.reffered_to_specialist
            );
          } else {
            console.log("Referred to Specialist is undefined or null");
          }
          // Prefill doctor dropdown
          if (
            firstRecord.refer_doctor !== undefined &&
            firstRecord.refer_doctor !== null
          ) {
            setSelectedDoctor(Number(firstRecord.refer_doctor));
            console.log("Prefilled Doctor ID:", firstRecord.refer_doctor);
          }

          // Log all fields in the console
          Object.keys(firstRecord).forEach((field) => {
            console.log(`${field}:`, firstRecord[field]);
          });

          // Set state variables for each field
          setPulseValue(
            firstRecord.pulse !== null ? String(firstRecord.pulse) : ""
          );
          setPulseResponse(
            firstRecord.pulse_conditions !== null
              ? firstRecord.pulse_conditions
              : ""
          );
          setSys(firstRecord.sys_mm !== null ? String(firstRecord.sys_mm) : "");
          setSysResponse(
            firstRecord.sys_mm_conditions !== null
              ? firstRecord.sys_mm_conditions
              : ""
          );
          setDys(firstRecord.dys_mm !== null ? String(firstRecord.dys_mm) : "");
          setDysResponse(
            firstRecord.dys_mm_mm_conditions !== null
              ? firstRecord.dys_mm_mm_conditions
              : ""
          );
          setHb(firstRecord.hb !== null ? String(firstRecord.hb) : "");
          setHbResponse(
            firstRecord.hb_conditions !== null ? firstRecord.hb_conditions : ""
          );
          setSats(
            firstRecord.oxygen_saturation !== null
              ? String(firstRecord.oxygen_saturation)
              : ""
          );
          setSatsResponse(
            firstRecord.oxygen_saturation_conditions !== null
              ? firstRecord.oxygen_saturation_conditions
              : ""
          );
          setRr(firstRecord.rr !== null ? String(firstRecord.rr) : "");
          setRrResponse(
            firstRecord.rr_conditions !== null ? firstRecord.rr_conditions : ""
          );
          setTemp(firstRecord.temp !== null ? String(firstRecord.temp) : "");
          setTempResponse(
            firstRecord.temp_conditions !== null
              ? firstRecord.temp_conditions
              : ""
          );
        } else {
          console.warn("Data is empty or not in the expected format.");
        }
      })
      .catch((error) => console.error("Error:", error.message));
  };

  useEffect(() => {
    if (pkid) {
      fetchCitizenVitalInfo();
    }
  }, [pkid]);

  return (
    <Box sx={{ p: 2 }}>
      <Card
        sx={{
          borderRadius: "20px",
          p: 1,
          mb: 1,
          background: "linear-gradient(90deg, #039BEF 0%, #1439A4 100%)",
        }}
      >
        <Typography
          sx={{
            fontWeight: 600,
            fontFamily: "Roboto",
            fontSize: "16px",
            color: "white",
          }}
        >
          Vital
        </Typography>
      </Card>

      <Box
        sx={{
          maxHeight: "70vh",
          overflowY: "auto",
          pr: 2,
        }}
      >
        <Card sx={{ p: 2, borderRadius: "20px", mb: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 2 }}>
                <Grid container spacing={1} alignItems="center">
                  <Grid item xs={3}>
                    <Box component="img" src={redheart} sx={{ width: 40 }} />
                  </Grid>
                  <Grid item xs={9}>
                    <Typography variant="subtitle2">
                      Pulse - beats/min
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      value={pulseValue || ""}
                      onChange={handlePulseInputChange}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">{pulseResponse}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <IconButton
                      onClick={() => fetchDatapulse("SPO2")}
                      disabled={loading}
                    >
                      <NotStartedIcon sx={{ fontSize: 30, color: "black" }} />
                    </IconButton>
                  </Grid>
                </Grid>
              </Card>
            </Grid>

            {/* BP Sys */}
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 2 }}>
                <Grid container spacing={1} alignItems="center">
                  <Grid item xs={3}>
                    <Box component="img" src={greenheart} sx={{ width: 40 }} />
                  </Grid>
                  <Grid item xs={9}>
                    <Typography variant="subtitle2">
                      BP - mm Hg (Sys)
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      value={sys || ""}
                      onChange={handleSysInputChange}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">{sysResponse}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <IconButton
                      onClick={() => fetchDatasys("BP")}
                      disabled={loading}
                    >
                      <NotStartedIcon sx={{ fontSize: 30, color: "black" }} />
                    </IconButton>
                  </Grid>
                </Grid>
              </Card>
            </Grid>

            {/* BP Dys */}
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 2 }}>
                <Grid container spacing={1} alignItems="center">
                  <Grid item xs={3}>
                    <Box component="img" src={greenheart} sx={{ width: 40 }} />
                  </Grid>
                  <Grid item xs={9}>
                    <Typography variant="subtitle2">
                      BP - mm Hg (Dys)
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      value={dys || ""}
                      onChange={handleDysInputChange}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">{dysResponse}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <IconButton
                      onClick={() => fetchDatadys("BP")}
                      disabled={loading}
                    >
                      <NotStartedIcon sx={{ fontSize: 30, color: "black" }} />
                    </IconButton>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          </Grid>

          {/* RR, O2, Temp */}
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* RR */}
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 2, height: "100%" }}>
                <Grid container spacing={1}>
                  <Grid item xs={3}>
                    <Box component="img" src={blueheart} sx={{ width: 40 }} />
                  </Grid>
                  <Grid item xs={9}>
                    <Typography variant="subtitle2">RR - per min</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      value={rr || ""}
                      onChange={handleRrInputChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2">{rrResponse}</Typography>
                  </Grid>
                </Grid>
              </Card>
            </Grid>

            {/* O2 */}
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 2 }}>
                <Grid container spacing={1}>
                  <Grid item xs={3}>
                    <Box
                      component="img"
                      src={darkgreeneheart}
                      sx={{ width: 40 }}
                    />
                  </Grid>
                  <Grid item xs={9}>
                    <Typography variant="subtitle2">O2 Sats</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      value={sats || ""}
                      onChange={handleSatsInputChange}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">{satsResponse}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <IconButton
                      onClick={() => fetchDataspo2("SPO2")}
                      disabled={loading}
                    >
                      <NotStartedIcon sx={{ fontSize: 30, color: "black" }} />
                    </IconButton>
                  </Grid>
                </Grid>
              </Card>
            </Grid>

            {/* Temp */}
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 2 }}>
                <Grid container spacing={1}>
                  <Grid item xs={3}>
                    <Box component="img" src={temperature} sx={{ width: 40 }} />
                  </Grid>
                  <Grid item xs={9}>
                    <Typography variant="subtitle2">Temperature</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      value={temp || ""}
                      onChange={handleTempInputChange}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">{tempResponse}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <IconButton
                      onClick={() => fetchDataTemp("TEMPERATURE")}
                      disabled={loading}
                    >
                      <NotStartedIcon sx={{ fontSize: 30, color: "black" }} />
                    </IconButton>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          </Grid>

          <Grid container spacing={2} alignItems="center" sx={{ mt: 2 }}>
            {/* Left Side → Radio Group */}
            <Grid item xs={12} sm={6}>
              <FormControl component="fieldset" fullWidth>
                <FormLabel component="legend">Referred To Specialist</FormLabel>
                <RadioGroup
                  row
                  value={referredToSpecialist}
                  onChange={(e) =>
                    setReferredToSpecialist(Number(e.target.value))
                  }
                >
                  <FormControlLabel value={1} control={<Radio />} label="Yes" />
                  <FormControlLabel value={2} control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
            </Grid>

            {/* Right Side → Dropdown (Visible only if Yes) */}
            {referredToSpecialist === 1 && (
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Choose Doctor</InputLabel>
                  <Select
                    label="Choose Doctor"
                    value={selectedDoctor}
                    onChange={(e) => setSelectedDoctor(e.target.value)}
                    disabled={loadingDoctors}
                  >
                    {loadingDoctors && (
                      <MenuItem value="">
                        <em>Loading...</em>
                      </MenuItem>
                    )}

                    {doctorList.length > 0
                      ? doctorList.map((doc) => (
                          <MenuItem
                            key={doc.doctor_pk_id}
                            value={doc.doctor_pk_id}
                          >
                            {doc.doctor_name}
                          </MenuItem>
                        ))
                      : !loadingDoctors && (
                          <MenuItem value="">
                            <em>No Doctors Found</em>
                          </MenuItem>
                        )}
                  </Select>
                </FormControl>
              </Grid>
            )}
          </Grid>

          <Box sx={{ textAlign: "center", mt: 1, mb: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenConfirmDialog(true)}
            >
              Submit
            </Button>
          </Box>
        </Card>
      </Box>

      <Dialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
      >
        <DialogTitle>Confirm Submission</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to submit the Vital Form?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenConfirmDialog(false)}
            color="error"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleSubmit();
              setOpenConfirmDialog(false);
            }}
            color="primary"
            variant="contained"
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={showVitalForm}
        autoHideDuration={3000}
        onClose={handleVitalForm}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleVitalForm}
          severity="success"
          sx={{ width: "100%" }}
        >
          Vital Form Submitted Successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Vital;
