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
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

const Childhood = ({
  pkid,
  onAcceptClick,
  citizensPkId,
  selectedTab,
  subVitalList,
}) => {
  const [nextName, setNextName] = useState("");
  const [childhoodList, setChildhoodList] = useState([]); // master list
  const [screeningData, setScreeningData] = useState([]); // existing screening data
  const [formData, setFormData] = useState({
    checkboxes: [],
    selectedIds: [],
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
        (item) => item.sub_list === selectedTab
      );

      if (currentIndex !== -1 && currentIndex < subVitalList.length - 1) {
        setNextName(subVitalList[currentIndex + 1].sub_list);
      } else {
        setNextName("");
      }
    }
  }, [selectedTab, subVitalList]);

  useEffect(() => {
    const fetchChildhoodList = async () => {
      try {
        const response = await axios.get(
          `${Port}/Screening/childhood_disease/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        setChildhoodList(response.data);
        setFormData((prev) => ({
          ...prev,
          checkboxes: new Array(response.data.length).fill(false),
        }));
        console.log("Fetched childhood master list:", response.data.length);
      } catch (error) {
        console.error("Error fetching master childhood list:", error);
      }
    };
    fetchChildhoodList();
  }, [Port, accessToken]);
  // 🔹 Fetch childhood disease options
  useEffect(() => {
    const fetchChildhoodScreeningData = async () => {
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
        setScreeningData(response.data);
        console.log("Fetched screening data for childhood:", response.data);
      } catch (error) {
        console.error("Error fetching screening childhood data:", error);
      }
    };
    if (pkid) fetchChildhoodScreeningData();
  }, [Port, accessToken, pkid]);

  // 🔹 Checkbox selection logic
  const handleCheckboxChange = (index) => {
    const updatedCheckboxes = [...formData.checkboxes];
    updatedCheckboxes[index] = !updatedCheckboxes[index];
    setFormData({
      ...formData,
      checkboxes: updatedCheckboxes,
      selectedIds: childhoodList
        .filter((_, i) => updatedCheckboxes[i])
        .map((item) => item.childhood_disease_id),
    });
  };

  const [openDialog, setOpenDialog] = useState(false);
  // 🔹 Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setOpenDialog(true);
    const selectedIdsClean = (formData.selectedIds || [])
      .filter((id) => id != null)
      .map((id) => Number(id));

    const postData = {
      childhood_diseases: selectedIdsClean,
    };
    console.log("Submitting Childhood POST:", postData);

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
        const basicScreeningPkId = responseData.childhood_pk_id;
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

  // 🔹 Initialize checkbox selection from the screening GET API
  useEffect(() => {
    if (
      childhoodList.length > 0 &&
      Array.isArray(screeningData) &&
      screeningData.length > 0
    ) {
      const screeningInfo = screeningData[0];
      const childHoodDisease = (screeningInfo.childhood_diseases || [])
        .filter((id) => id != null)
        .map((id) => Number(id));

      const initialCheckboxes = childhoodList.map((item) =>
        childHoodDisease.includes(item.childhood_disease_id)
      );

      setFormData((prevState) => ({
        ...prevState,
        checkboxes: initialCheckboxes,
        selectedIds: childHoodDisease,
      }));
    }
  }, [childhoodList, screeningData]);

  const handleCancel = () => {
    setOpenDialog(false);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
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
          {childhoodList.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={item.childhood_disease_id}>
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
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#000",
                        fontWeight: 500,
                        fontSize: "14px",
                        fontFamily: "Roboto",
                      }}
                    >
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
            type="button"
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
            onClick={handleOpenDialog}
          >
            Submit
          </Button>
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
              <Button
                onClick={handleSubmit}
                color="primary"
                variant="contained"
              >
                Confirm
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </Box>
  );
};

export default Childhood;
