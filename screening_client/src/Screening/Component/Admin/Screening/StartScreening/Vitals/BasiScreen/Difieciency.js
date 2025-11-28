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
        (item) => item.screening_list === selectedTab
      );

      if (currentIndex !== -1 && currentIndex < subVitalList.length - 1) {
        const nextItem = subVitalList[currentIndex + 1];
        const nextName = nextItem.screening_list;
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
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchdeficiencyData();
  }, []);

  const [formData, setFormData] = useState({
    checkboxes: new Array(deficiencies.length).fill(0),
    selectedNames: [],
    citizen_pk_id: citizensPkId,
    modify_by: userID,
  });

  const handleCheckboxChange = (index) => {
    const updatedCheckboxes = [...formData.checkboxes];
    updatedCheckboxes[index] = !updatedCheckboxes[index];

    const selectedNames = deficiencies
      .filter((item, i) => updatedCheckboxes[i])
      .map((item) => item.deficiencies);

    setFormData({
      ...formData,
      checkboxes: updatedCheckboxes,
      selectedNames: selectedNames,
    });
  };

  useEffect(() => {
    const fetchDataById = async (pkid) => {
      try {
        const response = await fetch(
          `${Port}/Screening/citizen_basic_screening_info_get/${pkid}/`,
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
            const difeciencyData = screeningInfo.deficiencies || [];

            const initialCheckboxes = deficiencies.map((item) =>
              difeciencyData.includes(item.deficiencies)
            );

            setFormData((prevState) => ({
              ...prevState,
              checkboxes: initialCheckboxes,
              selectedNames: difeciencyData,
            }));
          } else {
            console.error("Empty or invalid data array.");
          }
        } else {
          console.error("Server Error:", response.status, response.statusText);
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchDataById(pkid);
  }, [pkid, deficiencies]);


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
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

   useEffect(() => {
     fetchAllData();
   },[pkid]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const postData = {
      deficiencies: formData.selectedNames,
    };

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
        const basicScreeningPkId = responseData.basic_screening_pk_id;
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
          {allData.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.checkboxes[index]}
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
                    fontSize: "0.9rem",
                    color: "#000",
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
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Difieciency;
