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

const Checkbox = ({
  pkid,
  onAcceptClick,
  citizensPkId,
  selectedTab,
  subVitalList,
}) => {
  const [nextName, setNextName] = useState("");
  const [checkBox, setCheckBox] = useState([]);
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
  const userID = localStorage.getItem("userID");
  const basicScreeningPkId = localStorage.getItem("basicScreeningId");

  // ---------- FIND NEXT TAB NAME ----------
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

  // ---------- FETCH CHECKBOX OPTIONS ----------
  useEffect(() => {
    const fetchCheckData = async () => {
      try {
        const response = await axios.get(`${Port}/Screening/check_box/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });
        setCheckBox(response.data);
        setFormData((prev) => ({
          ...prev,
          checkboxes: new Array(response.data.length).fill(false),
        }));
      } catch (error) {
        console.error("Error fetching checkbox options:", error);
      }
    };
    fetchCheckData();
  }, []);

  // ---------- FETCH DATA BY ID ----------
  useEffect(() => {
    const fetchDataById = async () => {
      try {
        const response = await fetch(
          `${Port}/Screening/checkboxifnormal_get_api/${pkid}/`,
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
            const checkBoxddd = screeningInfo.check_box_if_normal || [];

            const initialCheckboxes = checkBox.map((item) =>
              checkBoxddd.includes(item.check_box_if_normal)
            );

            setFormData((prevState) => ({
              ...prevState,
              checkboxes: initialCheckboxes,
              selectedNames: checkBoxddd,
            }));
          }
        } else {
          console.error("Failed to fetch data:", response.status);
        }
      } catch (error) {
        console.error("Error fetching citizen screening data:", error);
      }
    };

    if (pkid && checkBox.length > 0) {
      fetchDataById();
    }
  }, [pkid, checkBox]);

  // ---------- HANDLE CHECKBOX CHANGE ----------
  const handleCheckboxChange = (index) => {
    const updatedCheckboxes = [...formData.checkboxes];
    updatedCheckboxes[index] = !updatedCheckboxes[index];

    const selectedNames = checkBox
      .filter((_, i) => updatedCheckboxes[i])
      .map((item) => item.check_box_if_normal);

    setFormData({
      ...formData,
      checkboxes: updatedCheckboxes,
      selectedNames,
    });
  };

  // ---------- SUBMIT ----------
    const [openDialog, setOpenDialog] = useState(false);
    const handleCancel = () => {
      setOpenDialog(false);
    };
    const handleOpenDialog = () => {
      setOpenDialog(true);
    };
  const handleSubmit = async (e) => {
    e.preventDefault();
setOpenDialog(true);
    const postData = {
      check_box_if_normal: formData.selectedNames,
    };

    try {
      const response = await axios.post(
        `${Port}/Screening/checkboxifnormal_post_api/${pkid}/`,
        postData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        // if (window.confirm("Submit CheckBox Form"))
        {
          const responseData = response.data;
          const basicScreeningPkId = responseData.basic_screening_pk_id;
          console.log("CheckBox Form Submitted Successfully");
          openSnackbar("CheckBox Form Submitted Successfully.");
          onAcceptClick(nextName, basicScreeningPkId);
        }
      } else {
        console.error("Error:", response.status);
      }
    } catch (error) {
      console.error("Error posting checkbox data:", error);
    }
  };

  return (
    <Box
      sx={{
        borderRadius: 3,
        backgroundColor: "#fff",
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
        sx={{ fontWeight: "bold", mb: 1, color: "#333", fontSize: "17px" }}
      >
        Check Box if Normal
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container>
          {checkBox.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
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
                                      fontWeight: 500,fontSize:"14px" ,fontFamily:"Roboto",

                    }}
                  >
                    {item.check_box_if_normal}
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

export default Checkbox;
