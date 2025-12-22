import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Grid,
  Typography,
  Checkbox as MUICheckbox,
  FormControlLabel,
  Button,
  Paper,
  Snackbar,
  Alert,
  Dialog,  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

const Diagnosis = ({
  pkid,
  onAcceptClick,
  citizensPkId,
  selectedTab,
  subVitalList,
}) => {
  const [nextName, setNextName] = useState("");
  const [diagnosis, setDiagnosis] = useState([]);
  const [formData, setFormData] = useState({
    checkboxes: [],
    selectedIds: [],
    citizen_pk_id: citizensPkId,
    modify_by: localStorage.getItem("userID"),
  });

  const Port = process.env.REACT_APP_API_KEY;
  const accessToken = localStorage.getItem("token");
  const userID = localStorage.getItem("userID");
  const basicScreeningPkId = localStorage.getItem("basicScreeningId");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const openSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };
  // ---------------- FIND NEXT TAB NAME ----------------
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

  // ---------------- FETCH DIAGNOSIS DATA ----------------
  useEffect(() => {
    const fetchDiagnosisData = async () => {
      try {
        const response = await axios.get(`${Port}/Screening/diagnosis/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });
        setDiagnosis(response.data);
        console.log("Fetched diagnosis master list:", response.data.length);
        setFormData((prev) => ({
          ...prev,
          checkboxes: new Array(response.data.length).fill(false),
        }));
      } catch (error) {
        console.error("Error fetching diagnosis data:", error);
      }
    };

    fetchDiagnosisData();
  }, []);

  // ---------------- FETCH DATA BY ID ----------------
  useEffect(() => {
    const fetchDataById = async () => {
      try {
        const response = await fetch(
          `${Port}/Screening/diagnosis_get_api/${pkid}/`,
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
            // Assume screeningInfo.diagnosis is an array of diagnosis IDs
            const selectedDiagnosisIds = (screeningInfo.diagnosis || [])
              .filter((id) => id != null)
              .map((id) => Number(id));
            console.log(
              "Existing screening diagnosis IDs:",
              selectedDiagnosisIds
            );

            const initialCheckboxes = diagnosis.map((item) =>
              selectedDiagnosisIds.includes(item.diagnosis_id)
            );

            setFormData((prevState) => ({
              ...prevState,
              checkboxes: initialCheckboxes,
              selectedIds: selectedDiagnosisIds,
            }));
          } else {
            console.error("Empty or invalid data array.");
          }
        } else {
          console.error("Server Error:", response.status, response.statusText);
        }
      } catch (error) {
        console.error("Error fetching diagnosis info:", error.message);
      }
    };

    if (pkid && diagnosis.length > 0) {
      fetchDataById();
    }
  }, [pkid, diagnosis]);

  // ---------------- HANDLE CHECKBOX CHANGE ----------------
  const handleCheckboxChange = (index) => {
    const updatedCheckboxes = [...formData.checkboxes];
    updatedCheckboxes[index] = !updatedCheckboxes[index];

    const selectedIds = diagnosis
      .filter((_, i) => updatedCheckboxes[i])
      .map((item) => item.diagnosis_id);

    setFormData((prev) => ({
      ...prev,
      checkboxes: updatedCheckboxes,
      selectedIds: selectedIds,
    }));
  };


    const [openDialog, setOpenDialog] = useState(false);
      const handleCancel = () => {
        setOpenDialog(false);
      };
      const handleOpenDialog = () => {
        setOpenDialog(true);
      };
  // ---------------- SUBMIT HANDLER ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setOpenDialog(true);
    // Use selected diagnosis IDs directly, filter out null/undefined & coerce to Number
    const selectedIdsClean = (formData.selectedIds || [])
      .filter((id) => id != null)
      .map((id) => Number(id));
    const postData = {
      diagnosis: selectedIdsClean,
    };

    console.log("Submitting Diagnosis POST: ", postData);

    if (!postData.diagnosis || postData.diagnosis.length === 0) {
      openSnackbar(
        "Please select at least one diagnosis before submitting",
        "warning"
      );
      return;
    }

    try {
      const response = await axios.post(
        `${Port}/Screening/diagnosis_post_api/${pkid}/`,
        postData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        // if (window.confirm("Submit Diagnosis Form"))
        {
          console.log("Diagnosis Form Submitted Successfully");
          console.log("Diagnosis POST response:", response.data);
          openSnackbar("Diagnosis Form Submitted Successfully", "success");
          onAcceptClick(nextName, basicScreeningPkId);
        }
      } else {
        console.error("Unexpected status:", response.status);
      }
    } catch (error) {
      console.error(
        "Error posting diagnosis data:",
        error.response ? error.response.data : error.message
      );
      openSnackbar(
        "Error saving diagnosis. Check console for details.",
        "error"
      );
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
          fontWeight: 600,
          color: "#004d40",
          mb: 1,
          fontFamily: "Playfair Display",
        }}
      >
        Diagnosis
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container>
          {diagnosis.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={item.diagnosis_id}>
              <FormControlLabel
                control={
                  <MUICheckbox
                    checked={formData.checkboxes[index] || false}
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
                    sx={{
                      color: "#000",
                      fontSize: "0.9rem",
                      fontFamily: "Playfair Display",
                    }}
                  >
                    {item.diagnosis}
                  </Typography>
                }
              />
            </Grid>
          ))}
        </Grid>

        <Box textAlign="center" mt={1} mb={2}>
          <Button
            variant="contained"
            size="small"
            sx={{ bgcolor: "#1439A4", textTransform: "none" }}
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
      </form>
    </Box>
  );
};

export default Diagnosis;
