import React, { useState, useEffect } from "react";
import axios, { all } from "axios";
import {
  Box,
  Grid,
  Checkbox,
  FormControlLabel,
  Button,
  Typography,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

const Difieciency = ({
  pkid,
  onAcceptClick,
  citizensPkId,
  selectedTab,
  subVitalList,
}) => {
  // _________________________________ START
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
        const nextName = nextItem.sub_list;
        setNextName(nextName);
      } else {
        setNextName("");
      }
    }
  }, [selectedTab, subVitalList]);
  // _________________________________ END

  const [deficiencies, setDeficiencies] = useState([]);
  const basicScreeningPkId = localStorage.getItem("basicScreeningId");
  const accessToken = localStorage.getItem("token");
  const userID = localStorage.getItem("userID");
  const Port = process.env.REACT_APP_API_KEY;

  useEffect(() => {
    const fetchdeficiencyData = async () => {
      try {
        const response = await axios.get(`${Port}/Screening/deficiencies/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });
        setDeficiencies(response.data);
        setFormData((prev) => ({
          ...prev,
          checkboxes: new Array(response.data.length).fill(false),
        }));
        console.log("Fetched master deficiencies:", response.data.length);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchdeficiencyData();
  }, []);

  const [formData, setFormData] = useState({
    checkboxes: [],
    selectedIds: [],
    citizen_pk_id: citizensPkId,
    modify_by: userID,
  });

  const handleCheckboxChange = (index) => {
    const updatedCheckboxes = [...formData.checkboxes];
    updatedCheckboxes[index] = !updatedCheckboxes[index];
    const selectedIds = deficiencies
      .filter((_, i) => updatedCheckboxes[i])
      .map((item) => item.deficiencies_id);

    setFormData((prev) => ({
      ...prev,
      checkboxes: updatedCheckboxes,
      selectedIds: selectedIds,
    }));
  };

  const [allData, setAllData] = useState([]);
  const fetchAllData = async () => {
    try {
      const response = await axios.get(
        `${Port}/Screening/deficiencies_get_api/${pkid}/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      setAllData(response.data);
      console.log("Fetched screening deficiencies for pkid:", response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [pkid]);

  // Initialize checkboxes/selected IDs when master list AND screening data are available
  useEffect(() => {
    if (
      deficiencies.length > 0 &&
      Array.isArray(allData) &&
      allData.length > 0
    ) {
      const screeningInfo = allData[0];
      const selectedIds = (screeningInfo.deficiencies || [])
        .filter((id) => id != null)
        .map((id) => Number(id));

      const initialCheckboxes = deficiencies.map((item) =>
        selectedIds.includes(item.deficiencies_id)
      );

      setFormData((prev) => ({
        ...prev,
        checkboxes: initialCheckboxes,
        selectedIds: selectedIds,
      }));
    }
  }, [deficiencies, allData]);
  const [openDialog, setOpenDialog] = useState(false);
  const handleCancel = () => {
    setOpenDialog(false);
  };
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  const handleSubmit = async (e) => {
    setOpenDialog(true);
    e.preventDefault();
    const selectedIdsClean = (formData.selectedIds || [])
      .filter((id) => id != null)
      .map((id) => Number(id));

    const postData = {
      deficiencies: selectedIdsClean,
    };
    console.log("Submitting Deficiencies POST:", postData);

    try {
      const accessToken = localStorage.getItem("token");

      const response = await axios.post(
        `${Port}/Screening/deficiencies_post_api/${pkid}/`,
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
        const basicScreeningPkId = responseData.deficiencies_pk_id;
        console.log("Deficiency Form Submitted Successfully");
        onAcceptClick(nextName, basicScreeningPkId);
        openSnackbar("Deficiencies Saved Successfully.");
        await fetchAllData();
      } else if (response.status === 400) {
        console.error("Bad Request:", response.data);
      } else {
        console.error("Unhandled Status Code:", response.status);
      }
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  return (
    <Box>
      <Typography
        variant="h6"
        sx={{ fontWeight: "bold", mb: 1, color: "#333", fontSize: "17px" }}
      >
        Deficiencies
      </Typography>

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
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container>
          {deficiencies.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={item.deficiencies_id}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.checkboxes[index] || false}
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
                label={item.deficiencies}
                sx={{
                  "& .MuiFormControlLabel-label": {
                    color: "#000",
                    fontWeight: 500,
                    fontSize: "14px",
                    fontFamily: "Roboto",
                  },
                }}
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
            type="button"
          >
            Submit
          </Button>
          <Dialog open={openDialog} onClose={handleCancel}>
            <DialogTitle>Confirm Submission</DialogTitle>

            <DialogContent>
              <Typography>
                Are you sure you want to submit this deficiencies form?
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

export default Difieciency;
