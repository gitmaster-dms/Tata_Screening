import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Grid,
  Box,
  Typography,
  Select,
  MenuItem,
  TextField,
  Button,
  InputLabel,
  FormControl,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

const Disability = ({
  pkid,
  onAcceptClick,
  citizensPkId,
  selectedTab,
  subVitalList,
}) => {
  const [nextName, setNextName] = useState("");
  const [languageDelay, setLanguageDelay] = useState([]);
  const [behavioural, setBehavioural] = useState([]);
  const [speech, setSpeech] = useState([]);
  const [disability, setDisability] = useState({
    comment: "",
    language_delay: "",
    behavioural_disorder: "",
    speech_screening: "",
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
  const source = localStorage.getItem("source");

  // ✅ Next Tab Name
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

  // ✅ Fetch Existing Data
  const fetchDataById = async (pkid) => {
    try {
      const response = await fetch(
        `${Port}/Screening/disability_screening_get_api/${pkid}/`,
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
          const info = data[0];
          setDisability((prev) => ({
            ...prev,
            comment: info.comment,
            language_delay: info.language_delay,
            behavioural_disorder: info.behavioural_disorder,
            speech_screening: info.speech_screening,
          }));
        }
      } else {
        console.error("Error:", response.status);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  useEffect(() => {
    fetchDataById(pkid);
  }, [pkid]);

  // ✅ Handle Form Change
  const handleChange = (e) => {
    setDisability({
      ...disability,
      [e.target.name]: e.target.value,
    });
  };

  const [openDialog, setOpenDialog] = useState(false);

  // ✅ Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
setOpenDialog(true);
    try {
      const response = await fetch(
        `${Port}/Screening/disability_screening_post_api/${pkid}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            ...disability,
            modify_by: localStorage.getItem("userID"),
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (response.status === 200) {
        openSnackbar("Disability Screening Saved Successfully.");
          onAcceptClick(nextName, data.disability_pk_id);
        } else if (response.status === 400) {
          console.error("Bad Request:", data.error);
        }
      } else {
        console.error("Error:", response.status);
      }
    } catch (error) {
      console.error("Error sending data:", error.message);
    }
  };

  // ✅ Fetch Dropdown Data
  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [langRes, behRes, speechRes] = await Promise.all([
          axios.get(`${Port}/Screening/language_delay/`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
          axios.get(`${Port}/Screening/behavioural_disorder/`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
          axios.get(`${Port}/Screening/speech_screening/`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
        ]);

        setLanguageDelay(langRes.data);
        setBehavioural(behRes.data);
        setSpeech(speechRes.data);
      } catch (err) {
        console.error("Error fetching dropdown data:", err);
      }
    };
    fetchDropdowns();
  }, [Port, accessToken]);


    const handleCancel = () => {
    setOpenDialog(false);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
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
          mb: 1,
          color: "#333",
          fontSize: "17px",
        }}
      >
        Disability Screening
      </Typography>
      <Grid container spacing={2}>
        {source === "1" && (
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Language Delay</InputLabel>
              <Select
                sx={{
                  "& .MuiInputBase-input.MuiSelect-select": {
                    color: "#000 !important",
                  },
                  "& .MuiSvgIcon-root": {
                    color: "#000",
                  },
                }}
                name="language_delay"
                value={disability.language_delay}
                label="Language Delay"
                onChange={handleChange}
              >
                <MenuItem value="">Select</MenuItem>
                {languageDelay.map((item) => (
                  <MenuItem
                    key={item.language_delay_id}
                    value={item.language_delay_id}
                  >
                    {item.language_delay}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}

        <Grid item xs={12} md={4}>
          <FormControl fullWidth size="small">
            <InputLabel>Behavioural Disorder</InputLabel>
            <Select
              sx={{
                "& .MuiInputBase-input.MuiSelect-select": {
                  color: "#000 !important",
                },
                "& .MuiSvgIcon-root": {
                  color: "#000",
                },
              }}
              name="behavioural_disorder"
              value={disability.behavioural_disorder}
              label="Behavioural Disorder"
              onChange={handleChange}
            >
              <MenuItem value="">Select</MenuItem>
              {behavioural.map((item) => (
                <MenuItem
                  key={item.behavioural_disorder_id}
                  value={item.behavioural_disorder_id}
                >
                  {item.behavioural_disorder}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl fullWidth size="small">
            <InputLabel>Speech Screening</InputLabel>
            <Select
              sx={{
                "& .MuiInputBase-input.MuiSelect-select": {
                  color: "#000 !important",
                },
                "& .MuiSvgIcon-root": {
                  color: "#000",
                },
              }}
              name="speech_screening"
              value={disability.speech_screening}
              label="Speech Screening"
              onChange={handleChange}
            >
              <MenuItem value="">Select</MenuItem>
              {speech.map((item) => (
                <MenuItem
                  key={item.speech_screening_id}
                  value={item.speech_screening_id}
                >
                  {item.speech_screening}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            label="Comment"
            name="comment"
            value={disability.comment}
            onChange={handleChange}
            fullWidth
            size="small"
          />
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
            type="button"
            variant="contained"
            color="primary"
            size="medium"
            onClick={handleOpenDialog}
            sx={{
              textTransform: "none",
              borderRadius: 2,
            }}
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
                      <Button onClick={handleSubmit} color="primary" variant="contained">
                        Confirm
                      </Button>
                    </DialogActions>
                  </Dialog>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Disability;
