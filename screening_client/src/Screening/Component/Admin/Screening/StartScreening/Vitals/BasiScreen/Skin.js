import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Grid,
  Checkbox,
  FormControlLabel,
  Button,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";

const Skin = ({
  pkid,
  onAcceptClick,
  citizensPkId,
  selectedTab,
  subVitalList,
}) => {
  //____________________________ START
  const [nextName, setNextName] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const openSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };
  useEffect(() => {
    if (subVitalList && selectedTab) {
      const currentIndex = subVitalList.findIndex(
        (item) => item.sub_list === selectedTab
      );

      if (currentIndex !== -1 && currentIndex < subVitalList.length - 1) {
        const nextItem = subVitalList[currentIndex + 1];
        setNextName(nextItem.sub_list);
      } else {
        setNextName("");
      }
    }
  }, [selectedTab, subVitalList]);
  //____________________________ END

  const Port = process.env.REACT_APP_API_KEY;
  const [skinDisease, setSkinDisease] = useState([]);
  const accessToken = localStorage.getItem("token");
  const basicScreeningPkId = localStorage.getItem("basicScreeningId");
  const userID = localStorage.getItem("userID");

  // Fetch Skin Condition List
  useEffect(() => {
    const fetchskinData = async () => {
      try {
        const response = await axios.get(`${Port}/Screening/skin_conditions/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });
        setSkinDisease(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchskinData();
  }, []);

  const [formData, setFormData] = useState({
    checkboxes: [],
    selectedNames: [], // stores selected IDs
    citizen_pk_id: citizensPkId,
    modify_by: userID,
  });

  const handleCheckboxChange = (index) => {
    const updatedCheckboxes = [...formData.checkboxes];
    updatedCheckboxes[index] = !updatedCheckboxes[index];

    const selectedNames = skinDisease
      .filter((item, i) => updatedCheckboxes[i])
      .map((item) => item.skin_conditions_id);

    setFormData({
      ...formData,
      checkboxes: updatedCheckboxes,
      selectedNames: selectedNames,
    });
  };

  // Fetch Existing Data by ID old api
  // useEffect(() => {
  //     const fetchDataById = async (pkid) => {
  //         try {
  //             const response = await fetch(
  //                 `${Port}/Screening/citizen_basic_screening_info_get/${pkid}/`,
  //                 {
  //                     method: "GET",
  //                     headers: {
  //                         "Content-Type": "application/json",
  //                         Authorization: `Bearer ${accessToken}`,
  //                     },
  //                 }
  //             );

  //             if (response.ok) {
  //                 const data = await response.json();
  //                 if (Array.isArray(data) && data.length > 0) {
  //                     const screeningInfo = data[0];
  //                     const skinData = screeningInfo.skin_conditions || [];

  //                     const initialCheckboxes = skinDisease.map((item) =>
  //                         skinData.includes(item.skin_conditions)
  //                     );

  //                     setFormData((prevState) => ({
  //                         ...prevState,
  //                         checkboxes: initialCheckboxes,
  //                         selectedNames: skinData,
  //                     }));
  //                 }
  //             } else {
  //                 console.error("Server Error:", response.status, response.statusText);
  //             }
  //         } catch (error) {
  //             console.error("Error fetching data:", error.message);
  //         }
  //     };

  //     fetchDataById(pkid);
  // }, [pkid, skinDisease]);
  useEffect(() => {
    const fetchDataById = async (pkid) => {
      try {
        const response = await fetch(
          `${Port}/Screening/skincondition_get_api/${pkid}/`,
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
            const screeningInfo = data[0];
            const skinData = screeningInfo.skin_conditions || [];

            const initialCheckboxes = skinDisease.map((item) =>
              skinData.includes(item.skin_conditions_id)
            );

            setFormData((prevState) => ({
              ...prevState,
              checkboxes: initialCheckboxes,
              selectedNames: skinData,
            }));
          }
        } else {
          console.error("Server Error:", response.status, response.statusText);
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchDataById(pkid);
  }, [pkid, skinDisease]);
  // Initialize checkboxes array whenever skinDisease list changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      checkboxes:
        prev.checkboxes && prev.checkboxes.length > 0
          ? prev.checkboxes
          : new Array(skinDisease.length).fill(false),
    }));
  }, [skinDisease]);
  // Submit Handler old api
  // const handleSubmit = async (e) => {
  //     e.preventDefault();
  //     const postData = {
  //         skin_conditions: formData.selectedNames,
  //     };

  //     try {
  //         const response = await axios.put(
  //             `${Port}/Screening/skincondition/${basicScreeningPkId}/`,
  //             postData,
  //             {
  //                 headers: {
  //                     Authorization: `Bearer ${accessToken}`,
  //                     "Content-Type": "application/json",
  //                 },
  //             }
  //         );

  //         if (window.confirm("Submit Skin Conditions Form") && response.status === 200) {
  //             const responseData = response.data;
  //             const basicScreeningPkId = responseData.basic_screening_pk_id;
  //             console.log("Skin Form Submitted Successfully");
  //             onAcceptClick(nextName, basicScreeningPkId);
  //         }
  //     } catch (error) {
  //         console.error("Error posting data:", error);
  //     }
  // };

  const handleSubmit = async (e) => {
        e.preventDefault();
        const postData = {
            skin_conditions: formData.selectedNames,
        };

        try {
            const response = await axios.post(
                `${Port}/Screening/skincondition_post_api/${pkid}/`,
                postData,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if ( response.status === 200) {
              const responseData = response.data && response.data.data ? response.data.data : response.data;
              const basicScreeningPkId = responseData.skin_pk_id || (response.data && response.data.skin_pk_id);
                console.log("Skin Form Submitted Successfully");
                openSnackbar("Skin Form Submitted Successfully.");
                onAcceptClick(nextName, basicScreeningPkId);
            }
        } catch (error) {
            console.error("Error posting data:", error);
        }
    };
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
        variant="h6"
        sx={{
          fontWeight: "bold",
          mb: 1,
          color: "#333",
          fontSize: "17px",
        }}
      >
        Skin Condition
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container>
          {skinDisease.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={item.skin_conditions_id}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!formData.checkboxes[index]}
                    onChange={() => handleCheckboxChange(index)}
                    color="primary"
                    sx={{
                      color: "#1976d2",
                      "&.Mui-checked": {
                        color: "#1976d2",
                      },
                    }}
                  />
                }
                label={item.skin_conditions}
                sx={{
                  "& .MuiFormControlLabel-label": {
                    fontSize: "0.9rem",
                    color: "#000",
                  },
                }}
              />
            </Grid>
          ))}
        </Grid>

        {/* Submit Button - Center Aligned */}
        <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
          <Button
            type="submit"
            variant="contained"
            size="small"
            sx={{
              backgroundColor: "#1976d2",
              textTransform: "none",
              borderRadius: "8px",
              px: 4,
              "&:hover": {
                backgroundColor: "#1565c0",
              },
            }}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Skin;
