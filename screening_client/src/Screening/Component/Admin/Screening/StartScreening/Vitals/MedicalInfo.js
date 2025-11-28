import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Box,
    Grid,
    Card,
    Typography,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Button,
    LinearProgress,
    DialogActions,
    DialogContent,
    DialogTitle,
    Dialog,
    Alert,
    Snackbar,
} from "@mui/material";

const MedicalInfo = ({ citizensPkId, pkid, fetchVital, selectedName, onAcceptClick }) => {
    const [nextName, setNextName] = useState("");
    const [medInfoChechBox, setMedInfoChechBox] = useState([]);
    const [medPastInfoChechBox, setMedPastInfoChechBox] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    
      const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
      });

        // Open Snackbar Helper
const showSnackbar = (msg, type = "success") => {
  setSnackbar({
    open: true,
    message: msg,
    severity: type,
  });
};


const handleSnackbarClose = () => {
  setSnackbar({ ...snackbar, open: false });
};
    const [formData, setFormData] = useState({
        checkboxes: [],
        selectedNames: [],
        citizen_pk_id: citizensPkId,
    });

    const [formPastData, setFormPastData] = useState({
        checkbox: [],
        selectedMedPastName: [],
    });

    const userID = localStorage.getItem("userID");
    const accessToken = localStorage.getItem("token");
    const Port = process.env.REACT_APP_API_KEY;

    // Determine next screening name
    useEffect(() => {
        if (fetchVital && selectedName) {
            const currentIndex = fetchVital.findIndex(
                (item) => item.screening_list === selectedName
            );

            if (currentIndex !== -1 && currentIndex < fetchVital.length - 1) {
                const nextItem = fetchVital[currentIndex + 1];
                const nextName = nextItem.screening_list;
                setNextName(nextName);
            } else {
                setNextName("");
            }
        }
    }, [selectedName, fetchVital]);

    // Fetch Medical Info
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${Port}/Screening/citizen_medical_history/`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                });
                const data = await response.json();
                setMedInfoChechBox(data);
            } catch (error) {
                console.error("Error fetching medical info", error);
            }
        };
        fetchData();
    }, []);

    // Handle checkbox change for medical info
    const handleCheckboxChange = (index) => {
        const updatedCheckboxes = [...formData.checkboxes];
        updatedCheckboxes[index] = !updatedCheckboxes[index];
        const selectedNames = medInfoChechBox
            .filter((_, i) => updatedCheckboxes[i])
            .map((item) => item.medical_history);

        setFormData({
            ...formData,
            checkboxes: updatedCheckboxes,
            selectedNames,
        });
    };

    // Fetch Medical Past Info
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${Port}/Screening/citizen_past_operative_history/`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                });
                const data = await response.json();
                setMedPastInfoChechBox(data);
            } catch (error) {
                console.error("Error fetching past info", error);
            }
        };
        fetchData();
    }, []);

    // Handle checkbox change for past info
    const handleCheckboxMedPastChange = (index) => {
        const updatedCheckboxes = [...formPastData.checkbox];
        updatedCheckboxes[index] = !updatedCheckboxes[index];
        const selectedMedPastName = medPastInfoChechBox
            .filter((_, i) => updatedCheckboxes[i])
            .map((item) => item.past_operative_history);

        setFormPastData({
            ...formPastData,
            checkbox: updatedCheckboxes,
            selectedMedPastName,
        });
    };

    // Fetch selected data by pkid
    useEffect(() => {
        const fetchDataById = async (pkid) => {
            try {
                const response = await fetch(`${Port}/Screening/medical_get_api/${pkid}/`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    if (Array.isArray(data) && data.length > 0) {
                        const screeningInfo = data[0];
                        const medDefectsData = screeningInfo.medical_history || [];
                        const pastOperativeData = screeningInfo.past_operative_history || [];

                        const initialCheckboxes = medInfoChechBox.map((item) =>
                            medDefectsData.includes(item.medical_history)
                        );
                        const initialPastCheckboxes = medPastInfoChechBox.map((item) =>
                            pastOperativeData.includes(item.past_operative_history)
                        );

                        setFormData({
                            ...formData,
                            checkboxes: initialCheckboxes,
                            selectedNames: medDefectsData,
                        });
                        setFormPastData({
                            ...formPastData,
                            checkbox: initialPastCheckboxes,
                            selectedMedPastName: pastOperativeData,
                        });
                    }
                }
            } catch (error) {
                console.error("Error fetching by ID:", error);
            }
        };

        fetchDataById(pkid);
    }, [pkid, medInfoChechBox, medPastInfoChechBox]);


    const handleSubmit = (e) => {
    e.preventDefault();
    setOpenDialog(true); // Dialog open hoga
};

    // Submit Handler
const handleDialogConfirm = async () => {
  setOpenDialog(false);

  const postData = {
    citizen_pk_id: citizensPkId,
    form_submit: true,
    added_by: userID,
    modify_by: userID,
    medical_history: formData.selectedNames,
    past_operative_history: formPastData.selectedMedPastName,
  };

  try {
    const response = await axios.post(
      `${Port}/Screening/medical_post_api/${pkid}/`,
      postData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      showSnackbar("Medical form submitted successfully!", "success");
      onAcceptClick(nextName);
    }
  } catch (error) {
    console.error("Error posting data:", error);
    showSnackbar("Failed to submit medical form!", "error");
  }
};

const handleDialogCancel = () => {
    setOpenDialog(false);
};

    return (
        <Box sx={{ p: 1 }}>
            <Snackbar
  open={snackbar.open}
  autoHideDuration={3000}
  onClose={handleSnackbarClose}
  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
>
  <Alert
    onClose={handleSnackbarClose}
    severity={snackbar.severity}
    variant="filled"
    sx={{ width: "100%" }}
  >
    {snackbar.message}
  </Alert>
</Snackbar>

            <Dialog open={openDialog} onClose={handleDialogCancel}>
    <DialogTitle>Confirm Submission</DialogTitle>
    <DialogContent>
        <Typography>Are you sure you want to submit this medical form?</Typography>
    </DialogContent>
    <DialogActions>
        <Button onClick={handleDialogCancel} color="secondary">
            Cancel
        </Button>
        <Button onClick={handleDialogConfirm} color="primary" variant="contained">
            Confirm
        </Button>
    </DialogActions>
</Dialog>
            <Card sx={{ borderRadius: "20px", p: 1, mb: 1, background: "linear-gradient(90deg, #039BEF 0%, #1439A4 100%)" }}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Typography sx={{ fontWeight: 600, fontFamily: "Roboto", fontSize: "16px", color: "white" }}>
                        Medical Information
                    </Typography>
                </Grid>
            </Card>

            <Card
                sx={{
                    p: 1,
                    mb: 3,
                    borderRadius: "20px",
                    maxHeight: "70vh",
                    overflowY: "auto",
                    pr: 2,
                }}
            >
                <Typography sx={{ fontWeight: 600, fontFamily: "Roboto", fontSize: "16px", color: "black" }}>
                    Medical Information
                </Typography>
                <Grid container>
                    {medInfoChechBox.map((item, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={formData.checkboxes[index] || false}
                                        onChange={() => handleCheckboxChange(index)}
                                    />
                                }
                                label={item.medical_history}
                            />
                        </Grid>
                    ))}
                </Grid>

                <Typography sx={{ fontWeight: 600, fontFamily: "Roboto", fontSize: "16px", color: "black" }}>
                    Medical Past Information
                </Typography>

                <FormGroup>
                    <Grid container>
                        {medPastInfoChechBox.map((item, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={formPastData.checkbox[index] || false}
                                            onChange={() => handleCheckboxMedPastChange(index)}
                                        />
                                    }
                                    label={item.past_operative_history}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </FormGroup>

                <Box textAlign="center" mb={2}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        sx={{
                            borderRadius: 3,
                            textTransform: "none",
                            px: 4,
                            "&:hover": { backgroundColor: "primary.main" },
                        }}
                    >
                        Submit
                    </Button>
                </Box>
            </Card>
        </Box>
    );
};

export default MedicalInfo;
