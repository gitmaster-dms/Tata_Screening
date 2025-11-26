import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  Typography,
  TextField,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";

const FamilyInfo = ({
  citizensPkId,
  pkid,
  fetchVital,
  selectedName,
  onAcceptClick,
}) => {
  const [nextName, setNextName] = useState("");
  const [updateId, setUpdateId] = useState("");
  const [familyData, setFamilyData] = useState({});
  console.log(familyData, "familydata");

  const [openConfirm, setOpenConfirm] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const userID = localStorage.getItem("userID");
  const accessToken = localStorage.getItem("token");
  const source = localStorage.getItem("source");
  const Port = process.env.REACT_APP_API_KEY;

  // Get next name in list
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

  // Fetch Emergency Info

  const [empkid , setEmpKID] = useState(null);
  console.log("empkid",empkid);
  
  const fetchData = async () => {
    try {
      const response = await fetch(
        `${Port}/Screening/SaveEmergencyInfo/${pkid}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ pkid }),
        }
      );

      const res = await response.json();
      if (res?.data) {
        setFamilyData(res.data); // store entire object
        setUpdateId(res.data?.citizen_id); // correct key sent by backend
        setEmpKID(res.data?.em_pk_id)
      }
    } catch (error) {
      console.error("Error fetching family data", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pkid]);

  // PUT API - Update emergency info
  const updateDataInDatabase = async (citizen_id) => {
    try {
      const response = await fetch(
        `${Port}/Screening/Citizen_emergency_put/${empkid}/`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...familyData, // direct data object (correct)
            added_by: userID,
            modify_by: userID,
            form_submit: "True",
          }),
        }
      );

      if (response.ok) {
        setSnackbar({
          open: true,
          message: "Data updated successfully",
          severity: "success",
        });
        if (nextName) onAcceptClick(nextName);
      } else {
        setSnackbar({
          open: true,
          message: "Update failed. Try again.",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error updating:", error);
      setSnackbar({
        open: true,
        message: "Something went wrong",
        severity: "error",
      });
    }
  };

  const handleSubmit = () => setOpenConfirm(true);
  const handleConfirm = async () => {
    setOpenConfirm(false);
    if (updateId) await updateDataInDatabase(updateId);
  };

  return (
    <Grid container justifyContent="center" sx={{ mt: 1 }}>
      <Grid item xs={12} md={12}>
        <Card
          sx={{
            borderRadius: "20px",
            p: 1,
            mb: 1,
            background: "linear-gradient(90deg, #039BEF 0%, #1439A4 100%)",
          }}
        >
          <Grid container alignItems="center" justifyContent="space-between">
            <Typography
              sx={{
                fontWeight: 600,
                fontFamily: "Roboto",
                fontSize: "16px",
                color: "white",
              }}
            >
              {source === "5" ? "Emergency Information" : "Family Information"}
            </Typography>
          </Grid>
        </Card>

        <Card sx={{ p: 2, boxShadow: 3, borderRadius: "20px" }}>
          <Grid container spacing={2}>
            {/* Prefix */}
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Prefix"
                size="small"
                value={familyData?.emergency_prefix || ""}
                onChange={(e) =>
                  setFamilyData({
                    ...familyData,
                    emergency_prefix: e.target.value,
                  })
                }
                sx={{
                  bgcolor: "#fff", // background color
                  color: "#c2da10ff !important", // selected text color
                  "& .MuiOutlinedInput-input": {
                    // targets displayed text
                    color: "#000 !important",
                  },
                }}
              >
                {["Mr", "Ms", "Mrs.", "Adv", "Col", "Dr"].map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Full Name */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name"
                size="small"
                value={familyData?.emergency_fullname || ""}
                onChange={(e) =>
                  setFamilyData({
                    ...familyData,
                    emergency_fullname: e.target.value.replace(/[0-9]/g, ""),
                  })
                }
              />
            </Grid>

            {/* Gender */}
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Gender"
                size="small"
                value={familyData?.emergency_gender || ""}
                onChange={(e) =>
                  setFamilyData({
                    ...familyData,
                    emergency_gender: e.target.value,
                  })
                }
                sx={{
                  bgcolor: "#fff", // background color
                  color: "#c2da10ff !important", // selected text color
                  "& .MuiOutlinedInput-input": {
                    // targets displayed text
                    color: "#000 !important",
                  },
                }}
              >
                {["Male", "Female", "Other"].map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Emergency Contact */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Emergency Contact"
                size="small"
                value={familyData?.emergency_contact || ""}
                onChange={(e) =>
                  setFamilyData({
                    ...familyData,
                    emergency_contact: e.target.value,
                  })
                }
              />
            </Grid>

            {/* Email */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                size="small"
                value={familyData?.emergency_email || ""}
                onChange={(e) =>
                  setFamilyData({
                    ...familyData,
                    emergency_email: e.target.value,
                  })
                }
              />
            </Grid>

            {/* Relationship */}
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Relationship"
                size="small"
                value={familyData?.relationship_with_employee || ""}
                onChange={(e) =>
                  setFamilyData({
                    ...familyData,
                    relationship_with_employee: e.target.value,
                  })
                }

                 sx={{
                  bgcolor: "#fff", // background color
                  color: "#c2da10ff !important", // selected text color
                  "& .MuiOutlinedInput-input": {
                    // targets displayed text
                    color: "#000 !important",
                  },
                }}
              >
                {["Father", "Mother", "Brother", "Sister", "Friend"].map(
                  (opt) => (
                    <MenuItem key={opt} value={opt}>
                      {opt}
                    </MenuItem>
                  )
                )}
              </TextField>
            </Grid>

            {/* Address */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                size="small"
                value={familyData?.emergency_address || ""}
                onChange={(e) =>
                  setFamilyData({
                    ...familyData,
                    emergency_address: e.target.value,
                  })
                }
              />
            </Grid>

            {/* Submit */}
            <Grid item xs={12} sx={{ textAlign: "center", mt: 2 }}>
              <Button
                variant="contained"
                sx={{ textTransform: "none", borderRadius: 2, px: 4 }}
                onClick={handleSubmit}
              >
                Accept
              </Button>
            </Grid>
          </Grid>
        </Card>
      </Grid>

      {/* Confirm Dialog */}
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Confirm Submission</DialogTitle>
        <DialogContent>Are you sure you want to submit the Form?</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>Cancel</Button>
          <Button onClick={handleConfirm} variant="contained">
            Yes, Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Grid>
  );
};

export default FamilyInfo;
