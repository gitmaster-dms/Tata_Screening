import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  Grid,
  Button,
  Paper,
} from "@mui/material";

const particularsList = [
  "Footfall",
  "Ante-Natal Care (ANC) Services",
  "Iron Folic Acid (IFA) supplementation",
  "High Risk Pregnancy",
  "Post-Natal Care (PNC) Services",
  "Leprosy",
  "Tuberculosis (TB)",
  "Sickle Cell Disease (SCD)",
  "Hypertension",
  "Diabetes",
  "Anaemia",
  "Cervical Cancer",
  "Other health conditions/diseases",
  "RDT tests done for Malaria/Dengue",
  "Diagnostic tests conducted",
  "Higher health facility",
];

// mapping of display name → API field name
const fieldMapping = {
  "Footfall": "footfall",
  "Ante-Natal Care (ANC) Services": "anc_services",
  "Iron Folic Acid (IFA) supplementation": "ifa_supplementation",
  "High Risk Pregnancy": "high_risk_pregnancy",
  "Post-Natal Care (PNC) Services": "pnc_services",
  "Leprosy": "leprosy",
  "Tuberculosis (TB)": "tuberculosis",
  "Sickle Cell Disease (SCD)": "scd",
  "Hypertension": "hypertension",
  "Diabetes": "diabetes",
  "Anaemia": "anaemia",
  "Cervical Cancer": "cervical_cancer",
  "Other health conditions/diseases": "other_conditions",
  "RDT tests done for Malaria/Dengue": "malaria_dengue_rdt",
  "Diagnostic tests conducted": "diagnostic_tests",
  "Higher health facility": "higher_facility",
};

const Other = ({ pkid, citizensPkId, dob, fetchVital, selectedName, onAcceptClick }) => {
  const userID = localStorage.getItem('userID');
  const Port = process.env.REACT_APP_API_KEY;
  const accessToken = localStorage.getItem('token');

  useEffect(() => {
    const fetchExistingData = async () => {
      try {
        const response = await fetch(
          `${Port}/Screening/citizen_other_info_get/${citizensPkId}/`,
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
          console.log("Fetched Existing Data:", data);

          if (Array.isArray(data) && data.length > 0) {
            const record = data[0]; // ✅ take first object from array

            // Map API data → formData
            const updatedFormData = particularsList.map((item) => {
              const fieldName = fieldMapping[item];
              return {
                serviceName: item,
                serviceStatus: record[fieldName]?.toString() || "",
                referToSpecialist: record[`${fieldName}_refer`]?.toString() || "",
              };
            });

            setFormData(updatedFormData);
          }
        } else {
          console.error("Failed to fetch existing data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (citizensPkId) {
      fetchExistingData();
    }
  }, [citizensPkId, accessToken]);


  const [formData, setFormData] = useState(
    particularsList.map((item) => ({
      serviceName: item,
      serviceStatus: "",
      referToSpecialist: "",
    }))
  );

  const handleChange = (index, field, value) => {
    const updatedForm = [...formData];
    updatedForm[index][field] = value;
    setFormData(updatedForm);
    console.log(formData, 'ffffffff');

  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Step 1: Base object
    let requestBody = {
      citizen_pk_id: citizensPkId || 0,
      added_by: userID,   // static for now (replace with logged-in user id if needed)
      modify_by: userID,  // static for now
      schedule_pk: pkid || 0,
    };

    // Step 2: Map formData to API keys
    // formData.forEach((item) => {
    //   const fieldName = fieldMapping[item.serviceName];
    //   if (fieldName) {
    //     requestBody[fieldName] = parseInt(item.serviceStatus || 0);
    //     requestBody[`${fieldName}_refer`] = parseInt(item.referToSpecialist || 0);
    //   }
    // });

    // formData.forEach((item) => {
    //   const fieldName = fieldMapping[item.serviceName];
    //   if (fieldName) {
    //     requestBody[fieldName] = item.serviceStatus !== "" ? Number(item.serviceStatus) : "";
    //     requestBody[`${fieldName}_refer`] = item.referToSpecialist !== "" ? Number(item.referToSpecialist) : "";
    //   }
    // });

    formData.forEach((item) => {
      const fieldName = fieldMapping[item.serviceName];
      if (fieldName) {
        requestBody[fieldName] =
          item.serviceStatus !== "" ? Number(item.serviceStatus) : null;
        requestBody[`${fieldName}_refer`] =
          item.referToSpecialist !== "" ? Number(item.referToSpecialist) : null;
      }
    });


    console.log("Final Payload:", requestBody);

    // Step 3: API Call
    try {
      const response = await fetch(`${Port}/Screening/citizen_other_info_post/${pkid}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`, // ✅ Token passed here
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Success:", data);
        alert("Form submitted successfully!");
      } else {
        console.error("Error submitting form");
        alert("Something went wrong while submitting!");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Network error, please try again!");
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography
        variant="h5"
        sx={{
          bgcolor: "#313774",
          color: "#fff",
          pl: 1,
          borderRadius: 1,
          mb: 1,
        }}
      >
        Others
      </Typography>
      <Box
        sx={{
          height: "85vh",
          overflowX: "auto",
          overflowY: "auto",
          whiteSpace: "nowrap",
          pr: 2,
        }}
      >
        <form onSubmit={handleSubmit}>
          {particularsList.map((particular, index) => (
            <Paper
              key={index}
              sx={{ p: 1, mb: 1, borderRadius: 2, boxShadow: 2 }}
            >
              <Grid container spacing={0}>
                {/* Service Status */}
                <Grid item xs={12} sm={6}>
                  <FormControl component="fieldset">
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {particular} (Yes / No)?
                    </Typography>
                    <RadioGroup
                      row
                      value={formData[index].serviceStatus}
                      onChange={(e) =>
                        handleChange(index, "serviceStatus", e.target.value)
                      }
                    >
                      <FormControlLabel
                        value="1"
                        control={<Radio size="small" />}
                        label="Yes"
                      />
                      <FormControlLabel
                        value="0"
                        control={<Radio size="small" />}
                        label="No"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>

                {/* Refer to Specialist */}
                <Grid item xs={12} sm={6}>
                  <FormControl component="fieldset">
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Refer to Specialist?
                    </Typography>
                    <RadioGroup
                      row
                      value={formData[index].referToSpecialist}
                      onChange={(e) =>
                        handleChange(index, "referToSpecialist", e.target.value)
                      }
                    >
                      <FormControlLabel
                        value="1"
                        control={<Radio size="small" />}
                        label="Yes"
                      />
                      <FormControlLabel
                        value="0"
                        control={<Radio size="small" />}
                        label="No"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>
            </Paper>
          ))}

          <div className="d-flex justify-content-center">
            <Button
              type="submit"
              variant="contained"
              sx={{
                my: 1,
                bgcolor: "#313774",
                textTransform: "none",
                "&:hover": { bgcolor: "#313774" },
              }}
            >
              Submit
            </Button>
          </div>
        </form>
      </Box>
    </Box>
  );
};

export default Other;
