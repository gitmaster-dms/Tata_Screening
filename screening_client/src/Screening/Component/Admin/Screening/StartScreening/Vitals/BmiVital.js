import React, { useState, useEffect } from "react";
import "./BmiVital.css";
import {
  Grid,
  Card,
  Typography,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Button,
  Box,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  MenuItem,
  InputLabel,
  Select,
} from "@mui/material";

const BmiVital = ({
  onAcceptClick,
  pkid,
  calculatedHeight,
  enteredWeight,
  scheduleID,
  fetchVital,
  selectedName,
}) => {
  //_________________________________START
  console.log(selectedName, "Present name");
  console.log(fetchVital, "Overall GET API");
  const [nextName, setNextName] = useState("");
  console.log(nextName, "nextName");
  

  useEffect(() => {
    if (fetchVital && selectedName) {
      const currentIndex = fetchVital.findIndex(
        (item) => item.screening_list === selectedName
      );

      console.log("Current Index:", currentIndex);

      if (currentIndex !== -1 && currentIndex < fetchVital.length - 1) {
        const nextItem = fetchVital[currentIndex + 1];
        const nextName = nextItem.screening_list;
        setNextName(nextName);
        console.log("Next Name Set:", nextName);
      } else {
        setNextName("");
        console.log("No next item or selectedName not found");
      }
    }
  }, [selectedName, fetchVital]);
  //__________________________________END
  const Port = process.env.REACT_APP_API_KEY;
  const accessToken = localStorage.getItem("token");
  const userID = localStorage.getItem("userID");
  console.log(userID);
  console.log(pkid, "pkiddddddddddddddddddddddddddddddddddddddddd");
  console.log(
    scheduleID,
    "scheduleIDdddddddddddddddddddddddddddddddddddddddddddd"
  );

  //// access the source from local storage
  const SourceUrlId = localStorage.getItem("loginSource");

  //// access the source name from local storage
  const SourceNameUrlId = localStorage.getItem("SourceNameFetched");

  const displayHeight =
    calculatedHeight !== undefined ? calculatedHeight : "N/A";
  console.log(pkid);

  const [isFormBlurred, setIsFormBlurred] = useState(true);
 
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

  const [bmiData, setBmiData] = useState({
  citizen_info: {
    gender: "",
    dob: "",
    height: null,
    weight: null,
    year: "0",
    months: "0",
    days: "0",
    arm_size: "",
    bmi: null,
  },
  symptoms_if_any: "",
  remark: "",
  refer_doctor: "",
  reffered_to_specialist: "",
});


  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const openSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBmiData({
      ...bmiData,
      [name]: value,
    });
  };

  const [updateId, setUpdateId] = useState(""); ////// PUT Store Variable

  useEffect(() => {
    if (updateId) {
      updateFormWithId(updateId);
    }
  }, [updateId]);

  const updateFormWithId = (citizen_id) => {
    console.log("Updating form with ID:", citizen_id);
  };

  const [growthId, setGrowthId] = useState(null);
  console.log(growthId,"growthId");
  
  const postBmiData = async () => {
    try {
      const response = await fetch(
        `${Port}/Screening/SaveGrowthMonitoringInfo/${pkid}/`,
        {
          method: "POST",   
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ pkid }),
        }
      );

      const data = await response.json();
      if (data?.data) {
        const d = data.data;

        setBmiData({
          citizen_info: {
            dob: d.dob,
            year: d.year,
            months: d.months,
            days: d.days,
            gender: d.gender,
            height: d.height,
            weight: d.weight,
            bmi: d.bmi,
            arm_size: d.arm_size,
            weight_for_age_label: d.weight_for_age,
            height_for_weight_label: d.weight_for_height,
            height_for_age_label: d.height_for_age,
          },
          symptoms_if_any: d.symptoms,
          remark: d.remark,
          refer_doctor : d.refer_doctor,
          reffered_to_specialist: d.reffered_to_specialist,
        });
        setGrowthId(d.growth_pk_id);

      setReferredToSpecialist(Number(d.reffered_to_specialist));
        selectedDoctor(Number(d.refer_doctor || ""));
        setUpdateId(d.citizen_id);
      }
      console.log("POST BMI:", data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    postBmiData();
  }, []);


 
  const updateDataInDatabase = async (citizen_id, confirmationStatus) => {
    try {
      const response = await fetch(
        `${Port}/Screening/Citizen_growth_monitoring_put/${growthId}/`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json", // Ensure correct content type
          },
          body: JSON.stringify({
            ...bmiData,
            added_by: userID,
            modify_by: userID,
            refer_doctor : selectedDoctor,
            form_submit: confirmationStatus,
            reffered_to_specialist: referredToSpecialist,

            
          }),
        }
      );

      console.log(response);

      if (response.ok) {
        const updatedBmiData = await response.json();
        setBmiData(updatedBmiData);
        openSnackbar("Data updated successfully!", "success");
        onAcceptClick(nextName);
      } else if (response.status === 400) {
        openSnackbar("Bad request. Please check your data.", "error");
      } else if (response.status === 500) {
        openSnackbar("Internal Server Error. Try again later.", "error");
      } else {
        openSnackbar(`Failed to update. Status: ${response.status}`, "error");
      }
    } catch (error) {
      console.error("Error updating data", error);
    }
  };

  const [openConfirm, setOpenConfirm] = useState(false);

  const handleSubmit = () => {
    setOpenConfirm(true);
  };

  const handleConfirmSubmit = async () => {
    setOpenConfirm(false);
    const confirmationStatus = "True";

    if (updateId) {
      await updateDataInDatabase(updateId, confirmationStatus);
    }
    console.log("Move to Vital button clicked");
  };

  const handleCancelSubmit = () => {
    setOpenConfirm(false);
    console.log("Form submission cancelled");
  };

  useEffect(() => {
    setBmiData((prevData) => ({
      ...prevData,
      citizen_info: {
        ...prevData.citizen_info,
        height:
          calculatedHeight !== undefined
            ? calculatedHeight
            : prevData.citizen_info.height,
      },
    }));
  }, [calculatedHeight]);

  useEffect(() => {
    setBmiData((prevData) => ({
      ...prevData,
      citizen_info: {
        ...prevData.citizen_info,
        weight: enteredWeight,
      },
    }));
  }, [enteredWeight]);

  

  // useEffect(() => {
  //     const fetchOtherData = async () => {
  //         try {
  //             const response = await fetch(`${Port}/Screening/SAM_MAM_BMI/${bmiData.citizen_info.year}/${bmiData.citizen_info.months}/${bmiData.citizen_info.gender}/${bmiData.citizen_info.height}/${bmiData.citizen_info.weight}/`, {
  //                 headers: {
  //                     'Authorization': `Bearer ${accessToken}`,
  //                 },
  //             });

  //             if (!response.ok) {
  //                 throw new Error(`Failed to fetch other data. Status: ${response.status}`);
  //             }

  //             const otherData = await response.json();
  //             console.log(otherData);

  //             setBmiData((prevBmiData) => ({
  //                 ...prevBmiData,
  //                 citizen_info: {
  //                     ...prevBmiData.citizen_info,
  //                     bmi: otherData.bmi,
  //                     weight_for_age: otherData.weight_for_age1,
  //                     weight_for_height: otherData.height_for_weight3,
  //                     height_for_age: otherData.height_for_age2,
  //                     weight_for_age_label: otherData.weight_for_age1,
  //                     height_for_age_label: otherData.height_for_age2,
  //                     height_for_weight_label: otherData.height_for_weight3,
  //                     result_BMI: otherData.result_BMI
  //                 },
  //             }));

  //             console.log('result dataaaaa', otherData.result_BMI);
  //         } catch (error) {
  //             console.error('Error fetching other data', error);
  //         }
  //     };

  //     fetchOtherData();
  // }, [bmiData.citizen_info.dob, bmiData.citizen_info.gender, bmiData.citizen_info.height, bmiData.citizen_info.weight]);

  const handleDOBChange = (event) => {
    const newDOB = event.target.value;
    setBmiData((prevBmiData) => ({
      ...prevBmiData,
      citizen_info: {
        ...prevBmiData.citizen_info,
        dob: newDOB,
      },
    }));

    const selectedDate = new Date(newDOB);
    const today = new Date();
    const differenceInYears = today.getFullYear() - selectedDate.getFullYear();

    setIsFormBlurred(differenceInYears < 10);
  };

  useEffect(() => {
    const calculateAge = () => {
      if (bmiData && bmiData.citizen_info && bmiData.citizen_info.dob) {
        const selectedDOB = new Date(bmiData.citizen_info.dob);
        const currentDate = new Date();

        const ageInMilliseconds = currentDate - selectedDOB;
        const ageInYears = Math.floor(
          ageInMilliseconds / (365.25 * 24 * 60 * 60 * 1000)
        );
        const ageInMonths = Math.floor(
          (ageInMilliseconds % (365.25 * 24 * 60 * 60 * 1000)) /
            (30.44 * 24 * 60 * 60 * 1000)
        );
        const ageInDays = Math.floor(
          (ageInMilliseconds % (30.44 * 24 * 60 * 60 * 1000)) /
            (24 * 60 * 60 * 1000)
        );

        // Update the state with the calculated values
        setBmiData((prevBmiData) => ({
          ...prevBmiData,
          citizen_info: {
            ...prevBmiData.citizen_info,
            year: ageInYears.toString(),
            months: ageInMonths.toString(),
            days: ageInDays.toString(),
          },
        }));
      }
    };

    calculateAge();
  }, [bmiData.citizen_info.dob]);

  return (
    <Box>
      <Dialog
        open={openConfirm}
        onClose={handleCancelSubmit}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>
          Confirm Submission
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center", fontSize: "15px" }}>
          Are you sure you want to submit the BMI & Symptoms Info Form?
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button
            variant="contained"
            onClick={handleConfirmSubmit}
            sx={{ bgcolor: "#1439A4", textTransform: "none" }}
          >
            Yes
          </Button>
          <Button
            variant="outlined"
            onClick={handleCancelSubmit}
            sx={{
              textTransform: "none",
              color: "#1439A4",
              borderColor: "#1439A4",
            }}
          >
            No
          </Button>
        </DialogActions>
      </Dialog>

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
          BMI & Symptoms
        </Typography>
      </Card>

      <Box
        sx={{
          maxHeight: "70vh",
          overflowY: "auto",
          pr: 2,
        }}
      >
        <Card sx={{ p: 2, mb: 2, borderRadius: "20px" }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={5}>
              <Card sx={{ p: 1, mb: 1 }}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Date of Birth"
                      type="date"
                      value={bmiData.citizen_info.dob || ""}
                      onChange={handleDOBChange}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Years"
                      value={bmiData.citizen_info.year || ""}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Months"
                      value={bmiData.citizen_info.months || ""}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Days"
                      value={bmiData.citizen_info.days || ""}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                </Grid>
              </Card>

              <FormControl component="fieldset">
                <RadioGroup
                  row
                  value={bmiData.citizen_info.gender}
                  onChange={(e) =>
                    setBmiData({
                      ...bmiData,
                      citizen_info: {
                        ...bmiData.citizen_info,
                        gender: e.target.value,
                      },
                    })
                  }
                >
                  <FormControlLabel
                    value="1"
                    control={<Radio size="small" />}
                    label="Male"
                  />
                  <FormControlLabel
                    value="2"
                    control={<Radio size="small" />}
                    label="Female"
                  />
                </RadioGroup>
              </FormControl>

              {/* Height */}
              <Card sx={{ p: 1, mb: 1, background: "#F8DEBD" }}>
                <Grid container alignItems="center">
                  <Grid item xs={7}>
                    <Typography variant="body2">Height (cm)</Typography>
                  </Grid>
                  <Grid item xs={5}>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      value={bmiData.citizen_info.height || ""}
                      onChange={(e) => {
                        const newValue = Math.min(
                          Math.max(parseInt(e.target.value)),
                          221
                        );

                        setBmiData({
                          ...bmiData,
                          citizen_info: {
                            ...bmiData.citizen_info,
                            height: newValue,
                          },
                        });
                      }}
                    />
                  </Grid>
                </Grid>
              </Card>

              {/* Weight */}
              <Card sx={{ p: 1, background: "#D0FBFF" }}>
                <Grid container alignItems="center">
                  <Grid item xs={7}>
                    <Typography variant="body2">Weight (kg)</Typography>
                  </Grid>
                  <Grid item xs={5}>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      value={bmiData.citizen_info.weight || ""}
                      onChange={(e) => {
                        let newValue = parseInt(e.target.value);

                        newValue = Math.min(newValue, 400);
                        newValue =
                          isNaN(newValue) || newValue < 0 ? 0 : newValue;

                        setBmiData({
                          ...bmiData,
                          citizen_info: {
                            ...bmiData.citizen_info,
                            weight: newValue,
                          },
                        });
                      }}
                    />
                  </Grid>
                </Grid>
              </Card>

              {/* Arm size (Conditional) */}
              {/* {SourceUrlId === "1" && ( */}
              <Card sx={{ p: 1, mt: 1, background: "#FFECF2" }}>
                <Grid container>
                  <Grid item xs={7}>
                    <Typography variant="body2">Arm</Typography>
                  </Grid>
                  <Grid item xs={5}>
                    <Typography variant="body2">
                      {bmiData.citizen_info.arm_size || "-"}
                    </Typography>
                  </Grid>
                </Grid>
              </Card>
              {/* )} */}
            </Grid>

            {/* BMI Data */}
            <Grid item xs={12} sm={7}>
              {bmiData.citizen_info.dob && (
                <Card
                  sx={{
                    p: 2,
                    height: "auto",
                    background:
                      "linear-gradient(180deg, #039BEF 0%, #1439A4 100%)",
                    color: "white",
                  }}
                >
                  <Typography variant="subtitle2" fontWeight="bold" mb={1}>
                    Body Mass Index (BMI)
                  </Typography>
                  <Typography variant="h6" color="white">
                    {bmiData.citizen_info.bmi || "--"}
                  </Typography>

                  <Typography variant="body2" mt={1} sx={{ color: "white" }}>
                    {bmiData.citizen_info.bmi < 18.5
                      ? "You are Underweight."
                      : bmiData.citizen_info.bmi < 25
                      ? "You are Normal."
                      : bmiData.citizen_info.bmi < 30
                      ? "You are Overweight."
                      : "Obese."}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <Grid
                    container
                    justifyContent="space-between"
                    sx={{ color: "white" }}
                  >
                    {["Underweight", "Normal", "Overweight", "Obesity"].map(
                      (label, index) => (
                        <Typography
                          key={index}
                          sx={{
                            fontWeight:
                              (label === "Underweight" &&
                                bmiData.citizen_info.bmi < 18.5) ||
                              (label === "Normal" &&
                                bmiData.citizen_info.bmi >= 18.5 &&
                                bmiData.citizen_info.bmi < 25) ||
                              (label === "Overweight" &&
                                bmiData.citizen_info.bmi >= 25 &&
                                bmiData.citizen_info.bmi < 30) ||
                              (label === "Obesity" &&
                                bmiData.citizen_info.bmi >= 30)
                                ? "bold"
                                : "normal",
                            color:
                              (label === "Underweight" &&
                                bmiData.citizen_info.bmi < 18.5) ||
                              (label === "Normal" &&
                                bmiData.citizen_info.bmi >= 18.5 &&
                                bmiData.citizen_info.bmi < 25) ||
                              (label === "Overweight" &&
                                bmiData.citizen_info.bmi >= 25 &&
                                bmiData.citizen_info.bmi < 30) ||
                              (label === "Obesity" &&
                                bmiData.citizen_info.bmi >= 30)
                                ? "red"
                                : "white",
                            fontSize: 14,
                          }}
                        >
                          {label}
                        </Typography>
                      )
                    )}
                  </Grid>
                </Card>
              )}

              {bmiData.citizen_info.dob && (
                <Grid container spacing={2} mt={1}>
                  <Grid item xs={12} sm={4}>
                    <Card
                      sx={{
                        p: 1.5,
                        textAlign: "center",
                        height: "100%",
                        border: "1px solid #E95D5C",
                        borderRadius: "15px",
                      }}
                    >
                      <Typography variant="body2">Weight for Age</Typography>
                      <Typography variant="subtitle2">
                        {bmiData.citizen_info.weight_for_age_label || "--"}
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Card
                      sx={{
                        p: 1.5,
                        textAlign: "center",
                        height: "100%",
                        border: "1px solid #90DF9E",
                        borderRadius: "15px",
                      }}
                    >
                      <Typography variant="body2">Weight for Height</Typography>
                      <Typography variant="subtitle2">
                        {bmiData.citizen_info.height_for_weight_label || "--"}
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Card
                      sx={{
                        p: 1.5,
                        textAlign: "center",
                        height: "100%",
                        border: "1px solid #C4C4C4",
                        borderRadius: "15px",
                      }}
                    >
                      <Typography variant="body2">Height for Age</Typography>
                      <Typography variant="subtitle2">
                        {bmiData.citizen_info.height_for_age_label || "--"}
                      </Typography>
                    </Card>
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Card>

        <Card sx={{ p: 1, borderRadius: "20px" }}>
          <Typography variant="subtitle1" fontWeight="bold" mb={2}>
            Medical Event
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Symptoms (if any)"
                name="symptoms_if_any"
                value={bmiData.symptoms_if_any || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Remark"
                name="remark"
                value={bmiData.remark || ""}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          {/* Referred to Specialist */}
       {/* <Grid container alignItems="center" mt={2}>
  <Grid item xs={12} sm={4}>
    <Typography variant="body1">Referred To Specialist</Typography>
  </Grid>

  <Grid item xs={12} sm={8}>
    <RadioGroup
      row
      value={referredToSpecialist}
      onChange={(e) => setReferredToSpecialist(parseInt(e.target.value))}
    >
      <FormControlLabel value={1} control={<Radio size="small" />} label="Yes" />
      <FormControlLabel value={2} control={<Radio size="small" />} label="No" />
    </RadioGroup>
  </Grid>
</Grid> */}

{/* Dropdown auto-renders after selecting “Yes” */}
{referredToSpecialist !== null && (
  <Grid container spacing={2} alignItems="center" sx={{ mt: 2 }}>
    {/* Radio Group */}
    <Grid item xs={12} sm={6}>
      <FormControl component="fieldset" fullWidth>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          Referred To Specialist
        </Typography>
        <RadioGroup
          row
          value={referredToSpecialist}
          onChange={(e) => setReferredToSpecialist(Number(e.target.value))}
        >
          <FormControlLabel value={1} control={<Radio />} label="Yes" />
          <FormControlLabel value={2} control={<Radio />} label="No" />
        </RadioGroup>
      </FormControl>
    </Grid>

    {/* Dropdown (only show if Yes) */}
    {referredToSpecialist === 1 && (
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth size="small">
          <InputLabel>Choose Specialist</InputLabel>
          <Select
            label="Choose Specialist"
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(Number(e.target.value))}
            disabled={loadingDoctors}
            sx={{
              "& .MuiInputBase-input.MuiSelect-select": {
                color: "#000 !important",
                fontSize: "0.85rem", // smaller font to fit nicely
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
                  <MenuItem key={doc.doctor_pk_id} value={doc.doctor_pk_id}>
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
)}


        </Card>

        <Box textAlign="center" mt={1} mb={2}>
          <Button
            variant="contained"
            size="small"
            sx={{ bgcolor: "#1439A4", textTransform: "none" }}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default BmiVital;
