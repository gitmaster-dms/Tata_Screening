import React, { useState, useEffect } from "react";
import "./Auditory.css";
import axios from "axios";
import ear from "../../../../../Images/Ear.png";
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
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Radio,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  FormLabel,
} from "@mui/material";

const Auditory = ({
  pkid,
  citizensPkId,
  lastview,
  recall,
  fetchVital,
  selectedName,
  onAcceptClick,
}) => {
  //_________________________________START
  console.log(selectedName, "Present name");
  console.log(fetchVital, "Overall GET API");
  const [nextName, setNextName] = useState("");
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

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

  const userGroup = localStorage.getItem("usergrp");

  const accessToken = localStorage.getItem("token");
  const source = localStorage.getItem("source");

  console.log(source, "fetched source in the auditory");
  const [pre, setPre] = useState(lastview[0] || {});

  console.log(lastview, "lastviewlastviewlastview");

  useEffect(() => {
    console.log("User Group:", userGroup);
  }, [userGroup]);

  const [editMode, setEditMode] = useState(false); // State to track edit mode

  const handleEditClick = () => {
    setEditMode(!editMode); // Toggle edit mode
  };

  const localStorageKey = `auditoryFormData_${pkid}`;

  const Port = process.env.REACT_APP_API_KEY;
  const [auditoryChechBox, setAuditoryChechBox] = useState([]);
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

 const [formData, setFormData] = useState({
  right: "",
  left: "",
  tratement_given: "",
  otoscopic_exam: "",
  remark: "",
  citizen_pk_id: citizensPkId,
  checkboxes: [],
  selectedNames: [],
  refer_doctor: "",
  reffered_to_specialist: null,

  // Audio fields
  hz_250_left: "",
  hz_500_left: "",
  hz_1000_left: "",
  hz_2000_left: "",
  hz_4000_left: "",
  hz_8000_left: "",
  reading_left: "",
  left_ear_observations_remarks: "",
  hz_250_right: "",
  hz_500_right: "",
  hz_1000_right: "",
  hz_2000_right: "",
  hz_4000_right: "",
  hz_8000_right: "",
  reading_right: "",
  right_ear_observations_remarks: "",
});

  console.log(formData, "fdddddddddd");
useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axios.get(`${Port}/Screening/auditory_get_api/${pkid}/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = response.data[0] || {};
      
      setFormData(prev => ({
        ...prev,
        right: data.right || "",
        left: data.left || "",
        tratement_given: data.tratement_given || "",
        otoscopic_exam: data.otoscopic_exam || "",
        remark: data.remark || "",
        selectedNames: data.checkboxes || [],
        hz_250_left: data.hz_250_left || null,
        hz_500_left: data.hz_500_left || null,
        hz_1000_left: data.hz_1000_left || null,
        hz_2000_left: data.hz_2000_left || null,
        hz_4000_left: data.hz_4000_left || null,
        hz_8000_left: data.hz_8000_left || null,
        left_ear_observations_remarks: data.left_ear_observations_remarks || "",
        reading_left: data.reading_left || null,
        hz_250_right: data.hz_250_right || null,
        hz_500_right: data.hz_500_right || null,
        hz_1000_right: data.hz_1000_right || null,
        hz_2000_right: data.hz_2000_right || null,
        hz_4000_right: data.hz_4000_right || null,
        hz_8000_right: data.hz_8000_right || null,
        right_ear_observations_remarks: data.right_ear_observations_remarks || "",
        reading_right: data.reading_right || null,
      }));

      // Specialist info
      setReferredToSpecialist(data.reffered_to_specialist || null);
      setSelectedDoctor(data.refer_doctor || "");

      // Prefill left/right reading states
      setLeftReading({
        left_average_reading: data.reading_left || "",
        message: data.left_ear_observations_remarks || "",
      });
      setRightReading({
        Right_average_reading: data.reading_right || "",
        message: data.right_ear_observations_remarks || "",
      });

    } catch (error) {
      console.error("Error fetching auditory data:", error);
    }
  };

  fetchData();
}, [Port, pkid, accessToken]);



  useEffect(() => {
    if (auditoryChechBox.length > 0) {
      setFormData((prev) => ({
        ...prev,
        selectedNames: lastview[0]?.checkboxes || [], // use lastview if exists
      }));
    }
  }, [auditoryChechBox, lastview]);
  const handleCheckboxChange = (name) => {
    setFormData((prev) => {
      const updatedNames = [...prev.selectedNames];
      const index = updatedNames.indexOf(name);
      if (index !== -1) updatedNames.splice(index, 1);
      else updatedNames.push(name);
      return { ...prev, selectedNames: updatedNames };
    });
  };

  const userID = localStorage.getItem("userID");
  console.log(userID);

  const handleSubmit = async () => {
    const confirmationStatus = "True";

    const postData = {
      checkboxes: formData.selectedNames,
      remark: formData.remark,
      right: formData.right,
      left: formData.left,
      tratement_given: formData.tratement_given,
      otoscopic_exam: formData.otoscopic_exam,
      citizen_pk_id: citizensPkId,
      form_submit: confirmationStatus,
      added_by: userID,
      modify_by: userID,
      reffered_to_specialist: referredToSpecialist,
      refer_doctor : selectedDoctor,

      // added fields
      hz_250_left: formData.hz_250_left,
      hz_500_left: formData.hz_500_left,
      hz_1000_left: formData.hz_1000_left,
      hz_2000_left: formData.hz_2000_left,
      hz_4000_left: formData.hz_4000_left,
      hz_8000_left: formData.hz_8000_left,
      reading_left: leftReading.left_average_reading,
      left_ear_observations_remarks: leftReading.message,

      hz_250_right: formData.hz_250_right,
      hz_500_right: formData.hz_500_right,
      hz_1000_right: formData.hz_1000_right,
      hz_2000_right: formData.hz_2000_right,
      hz_4000_right: formData.hz_4000_right,
      hz_8000_right: formData.hz_8000_right,
      reading_right: rightReading.Right_average_reading,
      right_ear_observations_remarks: rightReading.message,
    };

    console.log(postData, "postData");

    try {
      const response = await axios.post(
        `${Port}/Screening/auditory_post_api/${pkid}/`,
        postData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      onAcceptClick(nextName);
      recall();
      console.log("POST response:", response);
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

const handleChange = (e) => {
  const { name, value } = e.target;

  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));

  if (name.includes("_left")) {
    setLeftReading((prev) => ({
      ...prev,
      left_average_reading: "",
      message: "",
    }));
  }

  if (name.includes("_right")) {
    setRightReading((prev) => ({
      ...prev,
      Right_average_reading: "",
      message: "",
    }));
  }
};


useEffect(() => {
  if (lastview.length > 0) {
    const data = lastview[0];
    setFormData((prev) => ({
      ...prev,
      hz_250_left: data.hz_250_left || "",
      hz_500_left: data.hz_500_left || "",
      hz_1000_left: data.hz_1000_left || "",
      hz_2000_left: data.hz_2000_left || "",
      hz_4000_left: data.hz_4000_left || "",
      hz_8000_left: data.hz_8000_left || "",
      left_ear_observations_remarks: data.left_ear_observations_remarks || "",
      reading_left: data.reading_left || "",
      hz_250_right: data.hz_250_right || "",
      hz_500_right: data.hz_500_right || "",
      hz_1000_right: data.hz_1000_right || "",
      hz_2000_right: data.hz_2000_right || "",
      hz_4000_right: data.hz_4000_right || "",
      hz_8000_right: data.hz_8000_right || "",
      right_ear_observations_remarks: data.right_ear_observations_remarks || "",
      reading_right: data.reading_right || "",
      reffered_to_specialist: data.reffered_to_specialist || null,
      refer_doctor: data.refer_doctor || "",
    }));

    setLeftReading({
      message: data.left_ear_observations_remarks || "",
      left_average_reading: data.reading_left || "",
    });

    setRightReading({
      message: data.right_ear_observations_remarks || "",
      Right_average_reading: data.reading_right || "",
    });

    setReferredToSpecialist(data.reffered_to_specialist || null);
    setSelectedDoctor(data.refer_doctor || "");
  }
}, [lastview]);


  ////// value pass API ID wise

  const [leftReading, setLeftReading] = useState({
    left_average_reading: "",
    message: "",
  });
  const [rightReading, setRightReading] = useState({
    Right_average_reading: "",
    message: "",
  });

  useEffect(() => {
    const fetchLeftReading = async () => {
      if (
        formData.hz_500_left &&
        formData.hz_1000_left &&
        formData.hz_2000_left
      ) {
        try {
          const response = await axios.get(
            `${Port}/Screening/left_reading/${formData.hz_500_left}/${formData.hz_1000_left}/${formData.hz_2000_left}/`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          setLeftReading(response.data);
          console.log(
            "Left Ear Data Fetching As per Input Value......",
            response.data
          );
        } catch (error) {
          console.error("Error fetching Left data:", error);
        }
      }
    };

    fetchLeftReading();
  }, [formData, Port, accessToken]);

  useEffect(() => {
    const fetchRightReading = async () => {
      if (
        formData.hz_500_right &&
        formData.hz_1000_right &&
        formData.hz_2000_right
      ) {
        try {
          const response = await axios.get(
            `${Port}/Screening/right_reading/${formData.hz_500_right}/${formData.hz_1000_right}/${formData.hz_2000_right}/`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          setRightReading(response.data);
          console.log(
            "Right Ear Data Fetching As per Input Value......",
            response.data
          );
        } catch (error) {
          console.error("Error fetching Right data:", error);
        }
      }
    };

    fetchRightReading();
  }, [
    formData.hz_500_right,
    formData.hz_1000_right,
    formData.hz_2000_right,
    Port,
    accessToken,
  ]);

  useEffect(() => {
    if (fetchVital && selectedName) {
      const currentIndex = fetchVital.findIndex(
        (item) => item.screening_list === selectedName
      );
      if (currentIndex !== -1 && currentIndex < fetchVital.length - 1) {
        setNextName(fetchVital[currentIndex + 1].screening_list);
      } else {
        setNextName("");
      }
    }
  }, [selectedName, fetchVital]);

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
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
          Auditrory
        </Typography>
      </Card>

      <Box
        sx={{
          maxHeight: "70vh",
          overflowY: "auto",
          pr: 2,
        }}
      >
        <Grid item xs={12}>
          <Card sx={{ p: 1, borderRadius: "20px" }}>
            {/* <Box display="flex" alignItems="center" gap={1}>
              <img src={ear} alt="Ear" style={{ width: "40px", height: "40px" }} />
              <Typography variant="subtitle1" fontWeight="bold">
                Ear
              </Typography>
            </Box> */}

            {source === "1" ? (
              <>
                <Grid container spacing={2}>
                  {["UG-EXPERT", "UG-SUPERADMIN", "CO-HR"].includes(
                    userGroup
                  ) && (
                    <>
                      <Grid item xs={12} md={3}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Right</InputLabel>
                          <Select
                            label="Right"
                            name="right"
                            value={formData.right}
                            onChange={handleChange}
                          >
                            <MenuItem value="">Select</MenuItem>
                            <MenuItem value="Yes">Yes</MenuItem>
                            <MenuItem value="No">No</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} md={3}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Left</InputLabel>
                          <Select
                            label="Left"
                            name="left"
                            value={formData.left}
                            onChange={handleChange}
                          >
                            <MenuItem value="">Select</MenuItem>
                            <MenuItem value="Yes">Yes</MenuItem>
                            <MenuItem value="No">No</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Treatment Given"
                          name="tratement_given"
                          value={formData.tratement_given}
                          onChange={handleChange}
                          size="small"
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Otoscopic Exam"
                          name="otoscopic_exam"
                          value={formData.otoscopic_exam}
                          onChange={handleChange}
                          size="small"
                        />
                      </Grid>
                    </>
                  )}

                  {[
                    "UG-DOCTOR",
                    "UG-EXPERT",
                    "UG-SUPERADMIN",
                    "UG-ADMIN",
                    "CO-HR",
                  ].includes(userGroup) && (
                    <>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Remark"
                          name="remark"
                          value={formData.remark}
                          onChange={handleChange}
                          size="small"
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Typography
                          variant="subtitle2"
                          sx={{ mt: 2, fontWeight: "bold" }}
                        >
                          Check if Present
                        </Typography>
                      </Grid>

                      {auditoryChechBox.map((item) => (
                        <Grid item xs={12} sm={6} md={4} key={item.audit_id}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={formData.selectedNames.includes(
                                  item.audit_name
                                )}
                                onChange={() =>
                                  handleCheckboxChange(item.audit_name)
                                }
                              />
                            }
                            label={item.audit_name}
                          />
                        </Grid>
                      ))}
                    </>
                  )}
                </Grid>

                {/* Referred To Specialist */}
                <Grid container spacing={2} alignItems="center" sx={{ mt: 2 }}>
                  <Grid item xs={12} md={4}>
                    <Typography fontWeight="bold">
                      Referred To Specialist
                    </Typography>
                  </Grid>
                  <Grid item>
                    <RadioGroup
                      row
                      name="referred_to_specialist"
                      value={referredToSpecialist}
                      onChange={(e) =>
                        setReferredToSpecialist(Number(e.target.value))
                      }
                    >
                      <FormControlLabel
                        value={1}
                        control={<Radio />}
                        label="Yes"
                      />
                      <FormControlLabel
                        value={2}
                        control={<Radio />}
                        label="No"
                      />
                    </RadioGroup>
                  </Grid>
                </Grid>

                {/* Doctor Dropdown - Show only if Yes */}
                {referredToSpecialist === 1 && (
                  <Grid
                    container
                    spacing={2}
                    alignItems="center"
                    sx={{ mt: 1 }}
                  >
                    <Grid item xs={12} md={4}>
                      <Typography fontWeight="bold">Select Doctor</Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Doctor</InputLabel>
                        <Select
                          value={selectedDoctor}
                           onChange={(e) => setSelectedDoctor(Number(e.target.value))}
                        >
                          {doctorList.map((doc) => (
                            <MenuItem key={doc.id} value={doc.id}>
                              {doc.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                )}
              </>
            ) : (
              <>
                {[
                  "UG-EXPERT",
                  "UG-SUPERADMIN",
                  "UG-DOCTOR",
                  "UG-EXPERT",
                  "CO-HR",
                ].includes(userGroup) && (
                  <>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontFamily: "Roboto",
                        fontSize: "18px",
                        fontWeight: 600,
                      }}
                    >
                      Audio Ear Left
                    </Typography>
                    <Grid container spacing={2}>
                      {[250, 500, 1000, 2000, 4000, 8000].map((hz) => (
                        <Grid item xs={12} sm={6} md={4} key={hz}>
                          <TextField
                            fullWidth
                            label={`${hz}Hz`}
                            type="number"
                            size="small"
                            inputProps={{ min: 0, max: 200 }}
                            name={`hz_${hz}_left`}
                            value={formData[`hz_${hz}_left`]}
                            onChange={handleChange}
                          />
                        </Grid>
                      ))}
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Left Ear Observation"
                          value={leftReading.message}
                          InputProps={{ readOnly: true }}
                          size="small"
                          sx={{
                            bgcolor:
                              leftReading.message?.trim() === "Normal"
                                ? "rgb(183, 218, 201)"
                                : leftReading.message?.trim() ===
                                  "Mild Hearing Loss"
                                ? "rgb(160, 192, 203)"
                                : leftReading.message?.trim() ===
                                  "Moderate Hearing Loss"
                                ? "rgb(244, 236, 211)"
                                : leftReading.message?.trim() ===
                                  "Severe Hearing Loss"
                                ? "rgb(238, 220, 162)"
                                : leftReading.message?.trim() ===
                                  "Profound Hearning Loss"
                                ? "rgb(254, 164, 163)"
                                : "white",
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Reading"
                          value={leftReading.left_average_reading}
                          InputProps={{ readOnly: true }}
                          size="small"
                        />
                      </Grid>
                    </Grid>

                    <Typography
                      variant="subtitle1"
                      sx={{
                        mt: 2,
                        fontFamily: "Roboto",
                        fontSize: "18px",
                        fontWeight: 600,
                      }}
                    >
                      Audio Ear Right
                    </Typography>
                    <Grid container spacing={2}>
                      {[250, 500, 1000, 2000, 4000, 8000].map((hz) => (
                        <Grid item xs={12} sm={6} md={4} key={hz}>
                          <TextField
                            fullWidth
                            label={`${hz}Hz`}
                            type="number"
                            size="small"
                            inputProps={{ min: 0, max: 200 }}
                            name={`hz_${hz}_right`}
                            value={formData[`hz_${hz}_right`]}
                            onChange={handleChange}
                          />
                        </Grid>
                      ))}
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Right Ear Observation"
                          value={rightReading.message}
                          InputProps={{ readOnly: true }}
                          size="small"
                          sx={{
                            bgcolor:
                              rightReading.message?.trim() === "Normal"
                                ? "rgb(183, 218, 201)"
                                : rightReading.message?.trim() ===
                                  "Mild Hearing Loss"
                                ? "rgb(160, 192, 203)"
                                : rightReading.message?.trim() ===
                                  "Moderate Hearing Loss"
                                ? "rgb(244, 236, 211)"
                                : rightReading.message?.trim() ===
                                  "Severe Hearing Loss"
                                ? "rgb(238, 220, 162)"
                                : rightReading.message?.trim() ===
                                  "Profound Hearning Loss"
                                ? "rgb(254, 164, 163)"
                                : "white",
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Reading"
                          value={rightReading.Right_average_reading}
                          InputProps={{ readOnly: true }}
                          size="small"
                        />
                      </Grid>
                    </Grid>
                  </>
                )}

                {/* Referred To Specialist */}
                <Grid container spacing={2} alignItems="center" sx={{ mt: 2 }}>
                  {/* Left Side → Radio Group */}
                  <Grid item xs={12} sm={6}>
                    <FormControl component="fieldset" fullWidth>
                     <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                 Referred To Specialist
                                               </Typography>
                      <RadioGroup
                        row
                        value={referredToSpecialist}
                        onChange={(e) =>
                          setReferredToSpecialist(Number(e.target.value))
                        }
                      >
                        <FormControlLabel
                          value={1}
                          control={<Radio />}
                          label="Yes"
                        />
                        <FormControlLabel
                          value={2}
                          control={<Radio />}
                          label="No"
                        />
                      </RadioGroup>
                    </FormControl>
                  </Grid>

                  {/* Right Side → Dropdown (Visible only if Yes) */}
                {referredToSpecialist === 1 && (
  <Grid item xs={12} sm={6}>
    <FormControl fullWidth size="small">
      <InputLabel sx={{ fontSize: "0.8rem" }}>Choose Doctor</InputLabel>
      <Select
        label="Choose Doctor"
        value={selectedDoctor}
        onChange={(e) => setSelectedDoctor(Number(e.target.value))}
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
                sx={{ fontSize: "0.8rem" }}
              >
                {doc.doctor_name}
              </MenuItem>
            ))
          : !loadingDoctors && (
              <MenuItem value="" sx={{ fontSize: "0.8rem" }}>
                <em>No Doctors Found</em>
              </MenuItem>
            )}
      </Select>
    </FormControl>
  </Grid>
)}

                </Grid>

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
                    variant="contained"
                    color="primary"
                    size="medium"
                    onClick={() => setOpenConfirmDialog(true)}
                    sx={{
                      textTransform: "none",
                      borderRadius: 2,
                      mb: 3,
                    }}
                  >
                    Submit
                  </Button>
                </Grid>
              </>
            )}
          </Card>
        </Grid>
      </Box>
      <Dialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
      >
        <DialogTitle>Confirm Submission</DialogTitle>

        <DialogContent>
          <Typography>Do you want to submit this Auditory Form?</Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)} color="error">
            Cancel
          </Button>

          <Button
            onClick={() => {
              setOpenConfirmDialog(false);
              handleSubmit();
            }}
            color="primary"
            variant="contained"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Auditory;
