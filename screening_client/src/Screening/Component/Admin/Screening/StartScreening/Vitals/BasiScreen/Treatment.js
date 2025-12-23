import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Snackbar,
  Alert,
  Button,
  Grid,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  TextField,
  Typography,
  MenuItem,
  Select,
  InputLabel,
} from "@mui/material";
import { API_URL } from "../../../../../../../Config/api";

const Treatment = ({
  pkid,
  onAcceptClick,
  citizensPkId,
  scheduleID,
  citizenidddddddd,
  selectedTab,
  subVitalList,
}) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const openSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  //_________________________________START
  console.log(selectedTab, "Present name");
  console.log(subVitalList, "Overall GET API");
  const [nextName, setNextName] = useState("");
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState("");

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

  const Port = process.env.REACT_APP_API_KEY;

  const userID = localStorage.getItem("userID");
  console.log(userID);
  console.log(scheduleID, "treatmentschedule");
  console.log(citizenidddddddd, "treatmentcitizen");
  const accessToken = localStorage.getItem("token");

  const [referral, setReferral] = useState([]);
  const [placereferaal, setPlacereferral] = useState([]);

  const basicScreeningPkId = localStorage.getItem("basicScreeningId");
  console.log(
    "Retrieved Basic Id in Treatment Local Storage:",
    basicScreeningPkId
  );

  const [referredToSpecialist, setReferredToSpecialist] = useState(null);

  const [treatmentForm, setTreatmentForm] = useState({
    treatment_for: "",
    reason_for_referral: "",
    outcome: "",
    referral: "",
    placereferaal: "",
    modify_by: userID,
    reffered_to_specialist: null,
    schedule_id: scheduleID,
    citizen_id: citizenidddddddd,
  });

  const [doctorList, setDoctorList] = useState([]);

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

  const handleChange = (e) => {
    setTreatmentForm({
      ...treatmentForm,
      [e.target.name]: e.target.value,
    });
  };

  const fetchDataById = async (pkid) => {
    try {
      const response = await fetch(
        `${Port}/Screening/treatment_get_api/${pkid}/`,
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

          setTreatmentForm((prevState) => ({
            ...prevState,
            treatment_for: treatmentData.treatment_for,
            reason_for_referral: treatmentData.reason_for_referral,
            outcome: treatmentData.outcome,
            referral: treatmentData.referral,
            place_referral: treatmentData.place_referral,
            reffered_to_specialist: treatmentData.reffered_to_specialist, // Set referred_to_specialist in state
          }));

          // Set referredToSpecialist state based on fetched value
          setReferredToSpecialist(treatmentData.reffered_to_specialist);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      ...treatmentForm,
      reffered_to_specialist: referredToSpecialist, // Include referredToSpecialist in formData
    };

    console.log("Form Data:", formData);

    try {
      const response = await fetch(
        `${Port}/Screening/treatment_post_api/${pkid}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.status === 200) {
        const data = await response.json();
        console.log("Server Response:", data);

        // Extract basic_screening_pk_id from the response
        const basicScreeningPkId = data.basic_screening_pk_id;

        // Use updatedBasicScreeningPkId as needed in your component
        console.log("Female Child Screening:", basicScreeningPkId);
        // Call onAcceptClick with the updated id
        // onAcceptClick('Female Child Screening', basicScreeningPkId);
        openSnackbar("Treatment form submitted successfully");
        onAcceptClick(nextName, basicScreeningPkId);
      } else if (response.status === 400) {
        console.error("Bad Request:");
      } else {
        console.error("Unhandled Status Code:", response.status);
      }
    } catch (error) {
      console.error("Error sending data:", error.message);
    }
  };

  // treatment referal
  useEffect(() => {
    const fetchReferralData = async () => {
      try {
        const response = await axios.get(`${Port}/Screening/referral/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setReferral(response.data);
      } catch (error) {
        console.error("Error fetching referral data:", error);
      }
    };

    fetchReferralData();
  }, []);

  // place_referral
  useEffect(() => {
    const placereferalFetch = async () => {
      try {
        const response = await axios.get(`${Port}/Screening/place_referral/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setPlacereferral(response.data);
      } catch (error) {
        console.log(error, "error fetching Data");
      }
    };
    placereferalFetch();
  }, []);

  return (
    <>
      {/* Snackbar */}
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

      <Typography variant="h6" sx={{ mb: 1,fontWeight: 580, fontSize: "20px",color:"black" }}>
        Treatment
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Treatment For */}
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Treatment For"
              name="treatment_for"
              value={treatmentForm.treatment_for}
              onChange={handleChange}
            />
          </Grid>

          {/* Referral */}
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Referral</InputLabel>
              <Select
                label="Referral"
                name="referral"
                value={treatmentForm.referral}
                onChange={handleChange}
              >
                <MenuItem value="">
                  <em>Select</em>
                </MenuItem>
                {referral.map((drop) => (
                  <MenuItem key={drop.referral_id} value={drop.referral_id}>
                    {drop.referral}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Reason For Referral */}
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Reason For Referral"
              name="reason_for_referral"
              value={treatmentForm.reason_for_referral}
              onChange={handleChange}
            />
          </Grid>

          {/* Place Referral */}
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Place Referral</InputLabel>
              <Select
                label="Place Referral"
                name="place_referral"
                value={treatmentForm.place_referral}
                onChange={handleChange}
              >
                <MenuItem value="">
                  <em>Select</em>
                </MenuItem>
                {placereferaal.map((drop) => (
                  <MenuItem
                    key={drop.place_referral_id}
                    value={drop.place_referral_id}
                  >
                    {drop.place_referral}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Outcome */}
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Outcome"
              name="outcome"
              value={treatmentForm.outcome}
              onChange={handleChange}
            />
          </Grid>

          {/* Referred To Specialist */}
          <Grid container spacing={1} alignItems="center">
            {/* Referred To Specialist */}
            <Grid item xs={12} sm={6} md={4}>
              <FormControl component="fieldset" fullWidth size="small">
                <Typography variant="body2" sx={{ fontWeight: 600,px:2.5 ,mt:2.5}}>
                  Referred To Specialist
                </Typography>

                <RadioGroup
                  row
                  value={referredToSpecialist}
                  onChange={(e) =>
                    setReferredToSpecialist(Number(e.target.value))
                  }
                  sx={{px:2.5}}
                >
                  <FormControlLabel value={1} control={<Radio />} label="Yes" />
                  <FormControlLabel value={2} control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
            </Grid>

            {/* Choose Doctor (Same Row) */}
            {referredToSpecialist === 1 && (
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Choose Doctor</InputLabel>
                  <Select
                    label="Choose Doctor"
                    value={selectedDoctor}
                    onChange={(e) => setSelectedDoctor(Number(e.target.value))}
                    disabled={loadingDoctors}
                    sx={{
                      "& .MuiInputBase-input.MuiSelect-select": {
                        color: "#000",
                        fontSize: "0.85rem",
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

          {/* Submit Button */}
          <Grid item xs={12}>
            <Button type="submit" variant="contained" size="small">
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default Treatment;
