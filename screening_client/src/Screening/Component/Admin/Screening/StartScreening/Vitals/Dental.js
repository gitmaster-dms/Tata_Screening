import React, { useState, useEffect, useRef } from "react";
import "./Dental.css";
import CloseIcon from "@mui/icons-material/Close";
import { useSourceContext } from "../../../../../../contexts/SourceContext";
import Cookies from "js-cookie";
import {
  Grid,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  InputLabel,
  FormControl,
  Card,
  CardContent,
  RadioGroup,
  FormControlLabel,
  Radio,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Modal,
  Box,
  IconButton,
} from "@mui/material";
import { API_URL } from "../../../../../../Config/api";

const RowCard = ({ label, children }) => (
  <Card sx={{ p: 1.5, mb: 1, borderRadius: "18px" }}>
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12} md={3}>
        <Typography sx={labelStyle}>{label}</Typography>
      </Grid>
      {children}
    </Grid>
  </Card>
);

const Dental = ({
  scheduleID,
  pkid,
  citizensPkId,
  citizenId,
  onMoveTovision,
  fetchVital,
  selectedName,
  onAcceptClick,
}) => {
  //// QR Generate Update
  const [openModal, setOpenModal] = useState(false);
  const [qrCodeImage, setQrCodeImage] = useState(null);
  const { setScheduleIdd, setPkIddd, setCitizenIddd } = useSourceContext();

  const handleOpen = async () => {
    try {
      const response = await fetch(`${API_URL}/Screening/QRCode/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          citizens_pk_id: pkid,
          citizen_id: citizenId,
          schedule_id: scheduleID,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setQrCodeImage(data.qr_code_image);
        setOpenModal(true);
        setScheduleIdd(scheduleID);
        setPkIddd(pkid);
        setCitizenIddd(citizenId);

        const assessmentUrl = `${API_URL}/screening/dental_assesment?schedule_id=${encodeURIComponent(
          data.schedule_id
        )}&citizen_id=${encodeURIComponent(
          data.citizen_id
        )}&citizen_pk_id=${encodeURIComponent(data.citizens_pk_id)}`;
        Cookies.set("scheduleIdd", scheduleID, {
          expires: 1,
          path: assessmentUrl,
        });
      } else {
        console.error("Error:", response.status);
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };
  const handleClose = () => setOpenModal(false);

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
  //_________________________________END___________________________________

  const userGroup = localStorage.getItem("usergrp");
  const accessToken = localStorage.getItem("token");

  useEffect(() => {
    console.log("User Group:", userGroup);
  }, [userGroup]);

  const userID = localStorage.getItem("userID");
  console.log(userID);

  // const API_URL = process.env.REACT_APP_API_KEY;

  const [oralHygiene, setOralHygiene] = useState("");
  const [gum, setGum] = useState("");
  const [oral, setOral] = useState("");
  const [gumbleeding, setgumbleeding] = useState("");
  const [discolouration, setDiscolouration] = useState("");
  const [food, setFood] = useState("");
  const [carious, setCarious] = useState("");
  const [extraction, setExtraction] = useState("");
  const [fluorosis, setFluorosis] = useState("");
  const [tooth, setTooth] = useState("");
  // const [reffered, setReffered] = useState(null);
  const [referredToSpecialist, setReferredToSpecialist] = useState(null);
  const [sensitive, setSensitive] = useState("");
  const [malalignment, setMalalignment] = useState("");
  const [surgery, setSurgery] = useState("");
  const [orthodontic, setOrthodontic] = useState("");
  const [overall, setOverall] = useState("");
  const [openConfirm, setOpenConfirm] = useState(false);

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

      const res = await fetch(`${API_URL}/Screening/Doctor_List/`, {
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

  const calculateOverall = () => {
    const values = [
      oralHygiene,
      gum,
      oral,
      gumbleeding,
      discolouration,
      food,
      carious,
      extraction,
      fluorosis,
      tooth,
      referredToSpecialist,
      sensitive,
      malalignment,
      orthodontic,
      // orthodontic,
    ];

    const countGood = values.filter((value) => value === "1").length;
    const countBad = values.filter((value) => value === "2").length;

    let calculatedOverall = "";

    if (countGood >= 10) {
      calculatedOverall = "Good";
    } else if (countGood >= 4 && countGood <= 9) {
      calculatedOverall = "Fair";
    } else {
      calculatedOverall = "Bad";
    }

    // Handling '2' values
    if (countBad >= 10) {
      calculatedOverall = "Bad";
    } else if (countBad < 5) {
      calculatedOverall = "Good";
    } else if (countBad >= 2 && countBad < 5) {
      calculatedOverall = "Fair";
    }

    return calculatedOverall;
  };

  const handleRadioChange = (event) => {
    const { name, value } = event.target;

    if (name === "reffered_to_specialist") {
      setReferredToSpecialist(parseInt(value));
    } else {
      switch (name) {
        case "oral_hygiene":
          setOralHygiene(value);
          break;
        case "gum_condition":
          setGum(value);
          break;
        case "oral_ulcers":
          setOral(value);
          break;
        case "gum_bleeding":
          setgumbleeding(value);
          break;
        case "discoloration_of_teeth":
          setDiscolouration(value);
          break;
        case "food_impaction":
          setFood(value);
          break;
        case "carious_teeth":
          setCarious(value);
          break;
        case "extraction_done":
          setExtraction(value);
          break;
        case "fluorosis":
          setFluorosis(value);
          break;
        case "tooth_brushing_frequency":
          setTooth(value);
          break;
        case "sensitive_teeth":
          setSensitive(value);
          break;
        case "malalignment":
          setMalalignment(value);
          break;
        case "orthodontic_treatment":
          setOrthodontic(value);
          break;
        case "referred_to_surgery":
          setSurgery(value);
          break;
        default:
          break;
      }
    }

    const calculatedOverall = calculateOverall();
    setOverall(calculatedOverall);
    updateDentalConditions(calculatedOverall);
  };

  const updateDentalConditions = (updatedOverall) => {
    setDentalform((prevState) => ({
      ...prevState,
      dental_conditions: updatedOverall,
    }));
  };

  const [dentalform, setDentalform] = useState({
    oral_hygiene_remark: "",
    gum_condition_remark: "",
    oral_ulcers_remark: "",
    gum_bleeding_remark: "",
    discoloration_of_teeth_remark: "",
    food_impaction_remark: "",
    carious_teeth_remark: "",
    extraction_done_remark: "",
    fluorosis_remark: "",
    tooth_brushing_frequency_remark: "",
    reffered_to_specialist_remark: "",
    sensitive_teeth_remark: "",
    malalignment_remark: "",
    orthodontic_treatment_remark: "",
    comment: "",
    treatment_given: "",
    citizen_pk_id: citizensPkId,
    dental_conditions: overall,
    refer_doctor: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setDentalform((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setOpenConfirm(true); // open confirmation dialog instead of window.confirm
  };

  const handleConfirm = async () => {
    setOpenConfirm(false); // close dialog
    const calculatedOverall = calculateOverall();

    const formData = {
      ...dentalform,
      oral_hygiene: oralHygiene,
      gum_condition: gum,
      oral_ulcers: oral,
      gum_bleeding: gumbleeding,
      discoloration_of_teeth: discolouration,
      food_impaction: food,
      carious_teeth: carious,
      extraction_done: extraction,
      fluorosis: fluorosis,
      tooth_brushing_frequency: tooth,
      reffered_to_specialist: referredToSpecialist,
      sensitive_teeth: sensitive,
      malalignment: malalignment,
      orthodontic_treatment: orthodontic,
      referred_to_surgery: surgery,
      citizen_pk_id: citizensPkId,
      dental_conditions: calculatedOverall,
      form_submit: "True",
      added_by: userID,
      modify_by: userID,
      refer_doctor: selectedDoctor,
    };

    console.log("Form Data:", formData);

    try {
      const response = await fetch(
        `${API_URL}/Screening/dental_post_api/${pkid}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Server Response:", data);
        onAcceptClick(nextName);
      } else if (response.status === 400) {
        console.error("Bad Request:", response.data?.error);
      } else if (response.status === 500) {
        onAcceptClick(nextName);
      } else {
        console.error("Unhandled Status Code:", response.status);
      }
    } catch (error) {
      console.error("Error sending data:", error.message);
    }
  };

  const handleCancel = () => {
    setOpenConfirm(false);
    console.log("Form submission cancelled by user.");
  };

  const fetchDataById = async (pkid) => {
    try {
      const response = await fetch(
        `${API_URL}/Screening/dental_get_api/${pkid}/`,
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
          const dentalData = data[0];

          setDentalform((prevState) => ({
            ...prevState,
            oral_hygiene_remark: dentalData.oral_hygiene_remark,
            gum_condition_remark: dentalData.gum_condition_remark,
            oral_ulcers_remark: dentalData.oral_ulcers_remark,
            gum_bleeding_remark: dentalData.gum_bleeding_remark,
            discoloration_of_teeth_remark:
              dentalData.discoloration_of_teeth_remark,
            food_impaction_remark: dentalData.food_impaction_remark,
            carious_teeth_remark: dentalData.carious_teeth_remark,
            extraction_done_remark: dentalData.extraction_done_remark,
            fluorosis_remark: dentalData.fluorosis_remark,
            tooth_brushing_frequency_remark:
              data[0].tooth_brushing_frequency_remark,
            reffered_to_specialist_remark:
              data[0].reffered_to_specialist_remark,
            sensitive_teeth_remark: data[0].sensitive_teeth_remark,
            malalignment_remark: data[0].malalignment_remark,
            orthodontic_treatment_remark: data[0].orthodontic_treatment_remark,
            comment: data[0].comment,
            treatment_given: data[0].treatment_given,
            dental_conditions: dentalData.dental_conditions || overall,
            refer_doctor: dentalData.refer_doctor || "",
          }));

          setOralHygiene(dentalData.oral_hygiene.toString());
          setGum(dentalData.gum_condition.toString());
          setOral(dentalData.oral_ulcers.toString());
          setgumbleeding(dentalData.gum_bleeding.toString());
          setDiscolouration(dentalData.discoloration_of_teeth.toString());
          setFood(dentalData.food_impaction.toString());
          setCarious(dentalData.carious_teeth.toString());
          setExtraction(dentalData.extraction_done.toString());
          setFluorosis(dentalData.fluorosis.toString());
          setTooth(dentalData.tooth_brushing_frequency.toString());
          setReferredToSpecialist(dentalData.reffered_to_specialist);
          setSensitive(dentalData.sensitive_teeth.toString());
          setMalalignment(dentalData.malalignment.toString());
          setOrthodontic(dentalData.orthodontic_treatment.toString());
          setSurgery(dentalData.referred_to_surgery.toString());
          setSelectedDoctor(Number(dentalData.refer_doctor || ""));
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

  const [editMode, setEditMode] = useState(false);

  const handleEditClick = () => {
    setEditMode(!editMode);
  };

  return (
    <div>
      <Card
        sx={{
          borderRadius: "20px",
          p: 1,
          mb: 1,
          background: "linear-gradient(90deg, #039BEF 0%, #1439A4 100%)",
        }}
      >
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography
              sx={{
                fontWeight: 600,
                fontFamily: "Roboto",
                fontSize: "16px",
                color: "white",
              }}
            >
              Dental
            </Typography>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              onClick={handleOpen}
              sx={{
                backgroundColor: "white",
                color: "#1439A4",
                fontFamily: "Roboto",
                "&:hover": { backgroundColor: "white" },
              }}
            >
              Start Dental Screening
            </Button>
          </Grid>
        </Grid>
      </Card>

      <Modal
        open={openModal}
        onClose={handleClose}
        aria-labelledby="dental-screening-modal"
        aria-describedby="dental-screening-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            width: 400,
            position: "relative",
          }}
        >
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleClose}
            sx={{ position: "absolute", top: 8, right: 10 }}
          >
            <CloseIcon />
          </IconButton>
          <h4 id="dental-screening-modal">Scan QR Code</h4>
          {qrCodeImage ? (
            <img
              src={`${API_URL}${qrCodeImage}`}
              alt="QR Code"
              style={{ width: "100%", height: "auto", marginTop: "16px" }}
            />
          ) : (
            <p>Loading QR code...</p>
          )}
        </Box>
      </Modal>

      <Box
        sx={{
          maxHeight: "70vh",
          overflowY: "auto",
          pr: 2,
        }}
      >
        <form onSubmit={handleSubmit}>
          {[
            "UG-DOCTOR",
            "UG-EXPERT",
            "UG-SUPERADMIN",
            "UG-ADMIN",
            "CO-HR",
          ].includes(userGroup) && (
            <>
              <Box sx={{ mt: 2 }}>
                {/* ---------------- Oral Hygiene ---------------- */}
                <Card sx={{ p: 0, mb: 1, borderRadius: "18px" }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={3}>
                      <Typography
                        sx={{
                          fontWeight: 500,
                          fontSize: "15px",
                          ml: 2,
                          fontFamily: "Roboto",
                        }}
                      >
                        Oral Hygiene
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={5}>
                      <RadioGroup
                        row
                        name="oral_hygiene"
                        value={oralHygiene}
                        onChange={handleRadioChange}
                        sx={{
                          fontSize: "13px",
                          fontFamily: "Roboto",
                          fontWeight: 500,
                        }}
                      >
                        <FormControlLabel
                          sx={{
                            fontSize: "13px",
                            fontFamily: "Roboto",
                            fontWeight: 500,
                          }}
                          value="1"
                          control={<Radio />}
                          label="Good"
                        />
                        <FormControlLabel
                          sx={{ fontSize: "14px" }}
                          value="2"
                          control={<Radio />}
                          label="Fair"
                        />
                        <FormControlLabel
                          sx={{ fontSize: "14px" }}
                          value="3"
                          control={<Radio />}
                          label="Poor"
                        />
                      </RadioGroup>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        fullWidth
                        name="oral_hygiene_remark"
                        placeholder="Mention"
                        value={dentalform.oral_hygiene_remark}
                        onChange={handleChange}
                        size="small"
                      />
                    </Grid>
                  </Grid>
                </Card>

                {/* ---------------- Gum Condition ---------------- */}
                <Card sx={{ p: 0, mb: 1, borderRadius: "18px" }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={3}>
                      <Typography
                        sx={{
                          fontWeight: 500,
                          fontSize: "15px",
                          ml: 2,
                          fontFamily: "Roboto",
                        }}
                      >
                        Gum Condition
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={5}>
                      <RadioGroup
                        row
                        name="gum_condition"
                        value={gum}
                        onChange={handleRadioChange}
                      >
                        <FormControlLabel
                          sx={{ fontSize: "14px" }}
                          value="1"
                          control={<Radio />}
                          label="Good"
                        />
                        <FormControlLabel
                          sx={{ fontSize: "14px" }}
                          value="2"
                          control={<Radio />}
                          label="Fair"
                        />
                        <FormControlLabel
                          sx={{ fontSize: "14px" }}
                          value="3"
                          control={<Radio />}
                          label="Poor"
                        />
                      </RadioGroup>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        fullWidth
                        name="gum_condition_remark"
                        placeholder="Mention"
                        value={dentalform.gum_condition_remark}
                        onChange={handleChange}
                        size="small"
                      />
                    </Grid>
                  </Grid>
                </Card>

                {/* ---------------- Oral Ulcers ---------------- */}
                <Card sx={{ p: 0, mb: 1, borderRadius: "18px" }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={3}>
                      <Typography
                        sx={{
                          fontWeight: 500,
                          fontSize: "16px",
                          ml: 2,
                          fontFamily: "Roboto",
                        }}
                      >
                        Oral Ulcers
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={5}>
                      <RadioGroup
                        row
                        name="oral_ulcers"
                        value={oral}
                        onChange={handleRadioChange}
                      >
                        <FormControlLabel
                          sx={{ fontSize: "14px" }}
                          value="2"
                          control={<Radio />}
                          label="Yes"
                        />
                        <FormControlLabel
                          sx={{ fontSize: "14px" }}
                          value="1"
                          control={<Radio />}
                          label="No"
                        />
                      </RadioGroup>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        fullWidth
                        name="oral_ulcers_remark"
                        placeholder="Mention"
                        value={dentalform.oral_ulcers_remark}
                        onChange={handleChange}
                        size="small"
                      />
                    </Grid>
                  </Grid>
                </Card>

                {/* ---------------- Gum Bleeding ---------------- */}
                <Card sx={{ p: 0, mb: 1, borderRadius: "18px" }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={3}>
                      <Typography
                        sx={{
                          fontWeight: 500,
                          fontSize: "15px",
                          ml: 2,
                          fontFamily: "Roboto",
                        }}
                      >
                        Gum Bleeding
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={5}>
                      <RadioGroup
                        row
                        name="gum_bleeding"
                        value={gumbleeding}
                        onChange={handleRadioChange}
                      >
                        <FormControlLabel
                          sx={{ fontSize: "14px" }}
                          value="2"
                          control={<Radio />}
                          label="Yes"
                        />
                        <FormControlLabel
                          sx={{ fontSize: "14px" }}
                          value="1"
                          control={<Radio />}
                          label="No"
                        />
                      </RadioGroup>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        fullWidth
                        name="gum_bleeding_remark"
                        placeholder="Mention"
                        value={dentalform.gum_bleeding_remark}
                        onChange={handleChange}
                        size="small"
                      />
                    </Grid>
                  </Grid>
                </Card>

                {/* ---------------- Discolouration of Teeth ---------------- */}
                <Card sx={{ p: 0, mb: 1, borderRadius: "18px" }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={3}>
                      <Typography
                        sx={{
                          fontWeight: 500,
                          fontSize: "15px",
                          ml: 2,
                          fontFamily: "Roboto",
                        }}
                      >
                        Discolouration Of Teeth
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={5}>
                      <RadioGroup
                        row
                        name="discoloration_of_teeth"
                        value={discolouration}
                        onChange={handleRadioChange}
                      >
                        <FormControlLabel
                          sx={{ fontSize: "14px" }}
                          value="2"
                          control={<Radio />}
                          label="Yes"
                        />
                        <FormControlLabel
                          sx={{ fontSize: "14px" }}
                          value="1"
                          control={<Radio />}
                          label="No"
                        />
                      </RadioGroup>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        fullWidth
                        name="discoloration_of_teeth_remark"
                        placeholder="Mention"
                        value={dentalform.discoloration_of_teeth_remark}
                        onChange={handleChange}
                        size="small"
                      />
                    </Grid>
                  </Grid>
                </Card>

                {/* ---------------- Food Impaction ---------------- */}
                <Card sx={{ p: 0, mb: 1, borderRadius: "18px" }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={3}>
                      <Typography
                        sx={{
                          fontWeight: 500,
                          fontSize: "15px",
                          ml: 2,
                          fontFamily: "Roboto",
                        }}
                      >
                        Food Impaction
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={5}>
                      <RadioGroup
                        row
                        name="food_impaction"
                        value={food}
                        onChange={handleRadioChange}
                      >
                        <FormControlLabel
                          sx={{ fontSize: "14px" }}
                          value="2"
                          control={<Radio />}
                          label="Yes"
                        />
                        <FormControlLabel
                          sx={{ fontSize: "14px" }}
                          value="1"
                          control={<Radio />}
                          label="No"
                        />
                      </RadioGroup>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        fullWidth
                        name="food_impaction_remark"
                        placeholder="Mention"
                        value={dentalform.food_impaction_remark}
                        onChange={handleChange}
                        size="small"
                      />
                    </Grid>
                  </Grid>
                </Card>

                {/* ---------------- Carious Teeth ---------------- */}
                <Card sx={{ p: 0, mb: 1, borderRadius: "18px" }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={3}>
                      <Typography
                        sx={{
                          fontWeight: 500,
                          fontSize: "15px",
                          ml: 2,
                          fontFamily: "Roboto",
                        }}
                      >
                        Carious Teeth
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={5}>
                      <RadioGroup
                        row
                        name="carious_teeth"
                        value={carious}
                        onChange={handleRadioChange}
                      >
                        <FormControlLabel
                          sx={{ fontSize: "14px" }}
                          value="2"
                          control={<Radio />}
                          label="Yes"
                        />
                        <FormControlLabel
                          sx={{ fontSize: "14px" }}
                          value="1"
                          control={<Radio />}
                          label="No"
                        />
                      </RadioGroup>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        fullWidth
                        name="carious_teeth_remark"
                        placeholder="Mention"
                        value={dentalform.carious_teeth_remark}
                        onChange={handleChange}
                        size="small"
                      />
                    </Grid>
                  </Grid>
                </Card>

                {/* ---------------- Extraction Done ---------------- */}
                <Card sx={{ p: 0, mb: 1, borderRadius: "18px" }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={3}>
                      <Typography
                        sx={{
                          fontWeight: 500,
                          fontSize: "15px",
                          ml: 2,
                          fontFamily: "Roboto",
                        }}
                      >
                        Extraction Done
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={5}>
                      <RadioGroup
                        row
                        name="extraction_done"
                        value={extraction}
                        onChange={handleRadioChange}
                      >
                        <FormControlLabel
                          sx={{ fontSize: "14px" }}
                          value="2"
                          control={<Radio />}
                          label="Yes"
                        />
                        <FormControlLabel
                          sx={{ fontSize: "14px" }}
                          value="1"
                          control={<Radio />}
                          label="No"
                        />
                      </RadioGroup>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        fullWidth
                        name="extraction_done_remark"
                        placeholder="Mention"
                        value={dentalform.extraction_done_remark}
                        onChange={handleChange}
                        size="small"
                      />
                    </Grid>
                  </Grid>
                </Card>

                {/* ---------------- Fluorosis ---------------- */}
                <Card sx={{ p: 0, mb: 1, borderRadius: "18px" }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={3}>
                      <Typography
                        sx={{
                          fontWeight: 500,
                          fontSize: "15px",
                          ml: 2,
                          fontFamily: "Roboto",
                        }}
                      >
                        Fluorosis
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={5}>
                      <RadioGroup
                        row
                        name="fluorosis"
                        value={fluorosis}
                        onChange={handleRadioChange}
                      >
                        <FormControlLabel
                          sx={{ fontSize: "14px" }}
                          value="2"
                          control={<Radio />}
                          label="Yes"
                        />
                        <FormControlLabel
                          sx={{ fontSize: "14px" }}
                          value="1"
                          control={<Radio />}
                          label="No"
                        />
                      </RadioGroup>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        fullWidth
                        name="fluorosis_remark"
                        placeholder="Mention"
                        value={dentalform.fluorosis_remark}
                        onChange={handleChange}
                        size="small"
                      />
                    </Grid>
                  </Grid>
                </Card>

                {/* ---------------- Tooth Brushing Frequency ---------------- */}
                <Card sx={{ p: 0, mb: 1, borderRadius: "18px" }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={3}>
                      <Typography
                        sx={{
                          fontWeight: 500,
                          fontSize: "15px",
                          ml: 2,
                          fontFamily: "Roboto",
                        }}
                      >
                        Tooth Brushing Frequency
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={5}>
                      <RadioGroup
                        row
                        name="tooth_brushing_frequency"
                        value={tooth}
                        onChange={handleRadioChange}
                      >
                        <FormControlLabel
                          sx={{ fontSize: "14px" }}
                          value="3"
                          control={<Radio />}
                          label="1/day"
                        />
                        <FormControlLabel
                          sx={{ fontSize: "14px" }}
                          value="2"
                          control={<Radio />}
                          label="2/day"
                        />
                        <FormControlLabel
                          sx={{ fontSize: "14px" }}
                          value="1"
                          control={<Radio />}
                          label="Less Than 1 Day"
                        />
                      </RadioGroup>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        fullWidth
                        name="tooth_brushing_frequency_remark"
                        placeholder="Mention"
                        value={dentalform.tooth_brushing_frequency_remark}
                        onChange={handleChange}
                        size="small"
                      />
                    </Grid>
                  </Grid>
                </Card>
              </Box>
            </>
          )}

          {["UG-EXPERT", "UG-SUPERADMIN", "UG-ADMIN", "CO-HR"].includes(
            userGroup
          ) && (
            <>
              <Card sx={{ p: 0, mb: 1, borderRadius: "18px" }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={3}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 500,
                        fontSize: "15px",
                        ml: 2,
                        fontFamily: "Roboto",
                      }}
                    >
                      Sensitive Teeth
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={5}>
                    <FormControl component="fieldset">
                      <RadioGroup
                        row
                        name="sensitive_teeth"
                        value={sensitive}
                        onChange={handleRadioChange}
                      >
                        <FormControlLabel
                          sx={{ fontSize: "14px" }}
                          value="2"
                          control={<Radio />}
                          label="Yes"
                        />
                        <FormControlLabel
                          sx={{ fontSize: "14px" }}
                          value="1"
                          control={<Radio />}
                          label="No"
                        />
                      </RadioGroup>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <TextField
                      variant="outlined"
                      size="small"
                      fullWidth
                      placeholder="Mention"
                      name="sensitive_teeth_remark"
                      value={dentalform.sensitive_teeth_remark || ""}
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>
              </Card>

              <Card
                sx={{
                  mb: 1,
                  borderRadius: 2,
                  boxShadow: 2,
                  borderRadius: "18px",
                }}
              >
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={3}>
                    <Typography
                      sx={{
                        fontWeight: 500,
                        fontSize: "15px",
                        ml: 2,
                        fontFamily: "Roboto",
                      }}
                    >
                      Malalignment
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={5}>
                    <FormControl component="fieldset">
                      <RadioGroup
                        row
                        name="malalignment"
                        value={malalignment}
                        onChange={handleRadioChange}
                      >
                        <FormControlLabel
                          sx={{ fontSize: "14px" }}
                          value="2"
                          control={<Radio />}
                          label="Yes"
                        />
                        <FormControlLabel
                          sx={{ fontSize: "14px" }}
                          value="1"
                          control={<Radio />}
                          label="No"
                        />
                      </RadioGroup>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <TextField
                      variant="outlined"
                      size="small"
                      fullWidth
                      placeholder="Mention"
                      name="malalignment_remark"
                      value={dentalform.malalignment_remark || ""}
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>
              </Card>

              <Card
                sx={{
                  mb: 1,
                  borderRadius: 2,
                  boxShadow: 2,
                  borderRadius: "18px",
                }}
              >
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={3}>
                    <Typography
                      sx={{
                        fontWeight: 500,
                        fontSize: "15px",
                        ml: 2,
                        fontFamily: "Roboto",
                      }}
                    >
                      Orthodontic Treatment
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={5}>
                    <FormControl component="fieldset">
                      <RadioGroup
                        row
                        name="orthodontic_treatment"
                        value={orthodontic}
                        onChange={handleRadioChange}
                      >
                        <FormControlLabel
                          sx={{ fontSize: "14px" }}
                          value="2"
                          control={<Radio />}
                          label="Yes"
                        />
                        <FormControlLabel
                          sx={{ fontSize: "14px" }}
                          value="1"
                          control={<Radio />}
                          label="No"
                        />
                      </RadioGroup>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <TextField
                      variant="outlined"
                      size="small"
                      fullWidth
                      placeholder="Mention"
                      name="orthodontic_treatment_remark"
                      value={dentalform.orthodontic_treatment_remark || ""}
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>
              </Card>

              <Card
                sx={{
                  mb: 1,
                  borderRadius: 2,
                  boxShadow: 2,
                  borderRadius: "18px",
                }}
              >
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={3}>
                    <Typography
                      sx={{
                        fontWeight: 500,
                        fontSize: "15px",
                        ml: 2,
                        fontFamily: "Roboto",
                      }}
                    >
                      Referred To Specialist
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={5}>
                    <FormControl component="fieldset">
                      <RadioGroup
                        row
                        name="reffered_to_specialist"
                        value={referredToSpecialist}
                        onChange={handleRadioChange}
                      >
                        <FormControlLabel
                          sx={{ fontSize: "14px" }}
                          value={1}
                          control={<Radio />}
                          label="Yes"
                        />
                        <FormControlLabel
                          sx={{ fontSize: "14px" }}
                          value={2}
                          control={<Radio />}
                          label="No"
                        />
                      </RadioGroup>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <TextField
                      variant="outlined"
                      size="small"
                      fullWidth
                      placeholder="Mention"
                      name="reffered_to_specialist_remark"
                      value={dentalform.reffered_to_specialist_remark || ""}
                      onChange={handleChange}
                    />
                  </Grid>
                  {/* Dropdown → Only show if "Yes" is selected */}
                </Grid>
              </Card>
              {referredToSpecialist === 1 && (
                <Card
                  sx={{
                    mb: 2,
                    p: 2,
                    borderRadius: "18px",
                    boxShadow: 3,
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Choose Specialist</InputLabel>
                        <Select
                          label="Choose Specialist"
                          value={selectedDoctor}
                          onChange={(e) => setSelectedDoctor(e.target.value)}
                          disabled={loadingDoctors}
                          sx={{
                            "& .MuiInputBase-input.MuiSelect-select": {
                              color: "#000 !important",
                            },
                            "& .MuiSvgIcon-root": {
                              color: "#000",
                            },
                          }}
                        >
                          {loadingDoctors ? (
                            <MenuItem value="">
                              <em>Loading...</em>
                            </MenuItem>
                          ) : doctorList.length > 0 ? (
                            doctorList.map((doc) => (
                              <MenuItem
                                key={doc.doctor_pk_id}
                                value={doc.doctor_pk_id}
                              >
                                {doc.doctor_name}
                              </MenuItem>
                            ))
                          ) : (
                            <MenuItem value="">
                              <em>No Doctors Found</em>
                            </MenuItem>
                          )}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Card>
              )}
            </>
          )}

          <Box sx={{ flexGrow: 1, mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Remark"
                  name="Remark"
                  placeholder="Remark"
                  value={dentalform.comment || ""}
                  onChange={handleChange}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  size="small"
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Treatment Given"
                  name="treatment_given"
                  placeholder="Remark"
                  value={dentalform.treatment_given || ""}
                  onChange={handleChange}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  size="small"
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Dental Condition"
                  name="dental_conditions"
                  value={dentalform.dental_conditions || overall || ""}
                  InputProps={{
                    readOnly: true,
                  }}
                  variant="outlined"
                  size="small"
                />
              </Grid>

              <Grid
                item
                xs={12}
                sx={{
                  mb: 4,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  size="medium"
                  type="submit"
                  onClick={handleSubmit}
                  sx={{
                    textTransform: "none",
                    borderRadius: 2,
                  }}
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
            <Dialog open={openConfirm} onClose={handleCancel}>
              <DialogTitle>Confirm Submission</DialogTitle>
              <DialogContent>
                <Typography>
                  Are you sure you want to submit the Dental Form?
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCancel} color="secondary">
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirm}
                  variant="contained"
                  color="primary"
                >
                  Confirm
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        </form>
      </Box>
    </div>
  );
};
const labelStyle = {
  fontFamily: "Roboto",
  fontWeight: 500,
  fontSize: "16px",
};

export default Dental;
