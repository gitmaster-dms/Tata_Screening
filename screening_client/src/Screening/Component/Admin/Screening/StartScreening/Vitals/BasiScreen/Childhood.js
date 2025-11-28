import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Grid,
  Typography,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Button,
  Paper,
  Snackbar,
  Alert
} from "@mui/material";

const Childhood = ({
  pkid,
  onAcceptClick,
  citizensPkId,
  selectedTab,
  subVitalList,
}) => {
  const [nextName, setNextName] = useState("");
  const [childhoodData, setChildhoodData] = useState([]);
  const [formData, setFormData] = useState({
    checkboxes: [],
    selectedNames: [],
    citizen_pk_id: citizensPkId,
    modify_by: localStorage.getItem("userID"),
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const openSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  const Port = process.env.REACT_APP_API_KEY;
  const accessToken = localStorage.getItem("token");
  const basicScreeningPkId = localStorage.getItem("basicScreeningId");
  const userID = localStorage.getItem("userID");

  // 🔹 Handle finding next screen/tab
  useEffect(() => {
    if (subVitalList && selectedTab) {
      const currentIndex = subVitalList.findIndex(
        (item) => item.screening_list === selectedTab
      );

      if (currentIndex !== -1 && currentIndex < subVitalList.length - 1) {
        setNextName(subVitalList[currentIndex + 1].screening_list);
      } else {
        setNextName("");
      }
    }
  }, [selectedTab, subVitalList]);

  // 🔹 Fetch childhood disease options
  useEffect(() => {
    const fetchChildhoodData = async () => {
      try {
        const response = await axios.get(
          `${Port}/Screening/childhood_disease_get_api/${pkid}/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        setChildhoodData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchChildhoodData();
  }, [Port, accessToken]);

  // 🔹 Checkbox selection logic
  const handleCheckboxChange = (index) => {
    const updatedCheckboxes = [...formData.checkboxes];
    updatedCheckboxes[index] = !updatedCheckboxes[index];

    const selectedNames = childhoodData
      .filter((_, i) => updatedCheckboxes[i])
      .map((item) => item.childhood_disease);

    setFormData({
      ...formData,
      checkboxes: updatedCheckboxes,
      selectedNames,
    });
  };

  // 🔹 Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const postData = {
      childhood_disease: formData.selectedNames,
    };

    try {
      const response = await axios.post(
        `${Port}/Screening/childhood_disease_post_api/${pkid}/`,
        postData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const responseData = response.data;
        const basicScreeningPkId = responseData.basic_screening_pk_id;
        onAcceptClick(nextName, basicScreeningPkId);
        openSnackbar("Childhood Disease Saved Successfully.");
      } else if (response.status === 400) {
        console.error("Bad Request");
      } else {
        console.error("Unhandled Status Code:", response.status);
      }
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  // 🔹 Fetch selected values by pkid
  useEffect(() => {
    const fetchDataById = async (pkid) => {
      try {
        const response = await fetch(
          `${Port}/Screening/citizen_basic_screening_info_get/${pkid}/`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();

          if (Array.isArray(data) && data.length > 0) {
            const screeningInfo = data[0];
            const childHoodDisease = screeningInfo.childhood_disease || [];

            const initialCheckboxes = childhoodData.map((item) =>
              childHoodDisease.includes(item.childhood_disease)
            );

            setFormData((prevState) => ({
              ...prevState,
              checkboxes: initialCheckboxes,
              selectedNames: childHoodDisease,
            }));
          }
        } else {
          console.error("Server Error:", response.status);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (pkid) fetchDataById(pkid);
  }, [pkid, childhoodData, Port, accessToken]);

  return (
    <Box
      sx={{
        borderRadius: 3,
        bgcolor: "#fff",
      }}
    >
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
        variant="h6"
        sx={{
          mb: 2,
          fontWeight: "bold",
          fontSize: "17px",
        }}
      >
        Childhood Disease
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container>
          {childhoodData.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={!!formData.checkboxes[index]}
                      onChange={() => handleCheckboxChange(index)}
                      sx={{
                        color: "#1976d2",
                        "&.Mui-checked": {
                          color: "#1976d2",
                        },
                      }}
                    />
                  }
                  label={
                    <Typography variant="body2" color="textPrimary">
                      {item.childhood_disease}
                    </Typography>
                  }
                />
              </FormGroup>
            </Grid>
          ))}
        </Grid>

        <Box textAlign="center" mt={3}>
          <Button
            type="submit"
            variant="contained"
            size="small"
            sx={{
              bgcolor: "#1976d2",
              color: "#fff",
              "&:hover": {
                bgcolor: "#1976d2",
              },
              textTransform: "none",
              borderRadius: 2,
              px: 3,
            }}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Childhood;
