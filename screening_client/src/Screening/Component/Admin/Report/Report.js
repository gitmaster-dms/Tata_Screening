import React, { useState, useEffect } from "react";
import "./Report.css";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import axios from "axios";
import "./Report.css";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import {
  TableBody,
  TableContainer,
  TableCell,
  TableRow,
  TableHead,
  Table,
  Paper,
  Grid,
  Typography,
  Card,
  Button,
} from "@mui/material";
const Report = () => {
  const Port = process.env.REACT_APP_API_KEY;
  const accessToken = localStorage.getItem("token");
  const [sourceOption, setSourceOption] = useState([]);
  const [screeningForNav, setScreeningForNav] = useState([]);
  const [classList, setClassList] = useState([]);

  /////////// Navbar API
  const [selectedSourceNav, setSelectedSourceNav] = useState("");
  const [selectedTypeNav, setSelectedTypeNav] = useState("");
  const [selectedClassNav, setSelectedClassNav] = useState("");
  const [selectedCount, setSelectedCount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  /////// table start
  const [showTable, setShowTable] = useState(false);

  const commonTextFieldProps = {
    InputLabelProps: {
      sx: {
        fontSize: "14px",
        color: "black !important",
      },
    },
    sx: {
      "& .MuiInputBase-input": { color: "black" },
      "& .MuiSelect-select": { color: "black !important" },
      "& .MuiOutlinedInput-root": {
        "& fieldset": { borderColor: "black" },
        "&:hover fieldset": { borderColor: "black" },
        "&.Mui-focused fieldset": { borderColor: "black" },
      },
      "& .MuiSvgIcon-root": { color: "black" },
    },
  };

  const [data, setData] = useState([
    {
      citizenName: "Anjali Batale",
      citizenDetails: "1",
      familyInformation: "1",
      bmi: "2",
      basicScreening: "2",
      immunization: "2",
      auditory: "1",
      dentalCheckUp: "1",
      vision: "1",
      psychological: "1",
      medical: "1",
      investigation: "1",
    },
  ]);

  const [screeningFor, setScreeningFor] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${Port}/Screening/Category_Get/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });
        setScreeningFor(response.data);
        console.log("Fetched Categories:", response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [Port, accessToken]);

  const handleSearch = () => {
    setShowTable(true);
  };

  /////// table end

  ////////////////////////// Form value dropdown get ///////////////////////////////
  useEffect(() => {
    axios
      .get(`${Port}/Screening/Source_Get/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Include the token in the Authorization header
        },
      })
      .then((response) => {
        setSourceOption(response.data);
      })
      .catch((error) => {
        console.error("Error fetching sources:", error);
      });
  }, []);

  ///// Screening Type Nav
  useEffect(() => {
    if (selectedSourceNav) {
      axios
        .get(`${Port}/Screening/screening_for_type_get/${selectedSourceNav}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => {
          setScreeningForNav(response.data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [selectedSourceNav]);

  ///// Screening Type Nav
  useEffect(() => {
    axios
      .get(`${Port}/Screening/get_class/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        setClassList(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  ///// modal openeing
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState("");

  const handleIconClick = (content) => {
    setModalContent(content);
    setShowModal(true);
  };

  return (
    <Box>
      <Box>
        <Box>
          <Card
            sx={{ p: 2, p: 1, m: "0.0em 0.4em 0 3.5em", borderRadius: "16px" }}
          >
            {/* Header */}
            <Grid container>
              <Grid item xs={12}>
                <Typography
                  sx={{
                    mb: 1,
                    fontWeight: 600,
                    fontSize: "16px",
                    textAlign: "left",
                    color: "black",
                  }}
                >
                  Report List
                </Typography>
              </Grid>
            </Grid>

            {/* Filters */}
            <Box mt={1} pb={3}>
              <Grid container spacing={2} alignItems="center">
                {/* Screening Source */}
                <Grid item xs={12} sm={6} md={2}>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    label="Screening Workshop"
                    value={selectedSourceNav}
                    onChange={(e) => setSelectedSourceNav(e.target.value)}
                    {...commonTextFieldProps}
                  >
                    <MenuItem value="">Select Workshop</MenuItem>
                    {sourceOption.map((drop) => (
                      <MenuItem
                        key={drop.source_pk_id}
                        value={drop.source_pk_id}
                      >
                        {drop.source}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* Type */}
                <Grid item xs={12} sm={6} md={2}>
                   <TextField
                      select
                      fullWidth
                      size="small"
                      label="Category"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      InputLabelProps={{
                        sx: {
                          fontWeight: 100,
                          fontSize: "14px",
                          color: "black !important",
                        },
                      }}
                      SelectProps={{
                        MenuProps: {
                          classes: { paper: "custom-menu-paper" },
                        },
                      }}
                      sx={{
                        "& .MuiInputBase-input": { color: "black" },
                        "& .MuiSelect-select": { color: "black !important" }, // <-- FIXEDss
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": { borderColor: "black" },
                          "&:hover fieldset": { borderColor: "black" },
                          "&.Mui-focused fieldset": { borderColor: "black" },
                        },
                        "& .MuiSvgIcon-root": { color: "black" },
                      }}
                    >
                      <MenuItem value="">Select Category</MenuItem>
                      {screeningFor.map((drop) => (
                        <MenuItem key={drop.pk_id} value={drop.pk_id}>
                          {drop.category}
                        </MenuItem>
                      ))}
                    </TextField>
                </Grid>

                {/* Class (Conditional) */}
                {selectedSourceNav === "1" && (
                  <Grid item xs={12} sm={6} md={2}>
                    <TextField
                      select
                      fullWidth
                      size="small"
                      label="Class"
                      value={selectedClassNav}
                      onChange={(e) => setSelectedClassNav(e.target.value)}
                      {...commonTextFieldProps}
                    >
                      <MenuItem value="">Select Class</MenuItem>
                      {classList.map((drop) => (
                        <MenuItem key={drop.class_id} value={drop.class_id}>
                          {drop.class_name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                )}

                {/* Screening ID */}
                <Grid item xs={12} sm={6} md={2}>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    label="Screening ID"
                    value={selectedCount}
                    onChange={(e) => setSelectedCount(e.target.value)}
                    {...commonTextFieldProps}
                  >
                    <MenuItem value="">Select ID</MenuItem>
                    <MenuItem value="1">1</MenuItem>
                    <MenuItem value="2">2</MenuItem>
                    <MenuItem value="3">3</MenuItem>
                  </TextField>
                </Grid>

                {/* Search Button */}
                <Grid item xs={12} sm={6} md={2}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleSearch}
                    sx={{
                      height: "40px",
                      fontWeight: "bold",
                      background:
                        "linear-gradient(135deg, #2B7FFF 0%, #1439A4 100%)",
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #2B7FFF 0%, #1439A4 100%)",
                      },
                    }}
                  >
                    Search
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Card>
        </Box>
      </Box>

      {/* TABLE – SOURCE 1 */}
      {selectedSourceNav === 1 && showTable && (
        <Box p={2}>
          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#0f1830" }}>
                  {[
                    "Sr No.",
                    "Citizen Name",
                    "Citizen Details",
                    "Family Information",
                    "BMI",
                    "Basic Screening",
                    "Immunization",
                    "Auditory",
                    "Dental CheckUp",
                    "Vision",
                    "Psychological",
                  ].map((head) => (
                    <TableCell
                      key={head}
                      sx={{ color: "#fff", fontWeight: "bold" }}
                    >
                      {head}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {data.map((row, index) => (
                  <TableRow key={index} hover>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.citizenName}</TableCell>

                    {[
                      row.citizenDetails,
                      row.familyInformation,
                      row.bmi,
                      row.basicScreening,
                      row.immunization,
                      row.auditory,
                      row.dentalCheckUp,
                      row.vision,
                      row.psychological,
                    ].map((val, i) => (
                      <TableCell key={i}>
                        {val === "1" ? (
                          <CheckIcon color="success" />
                        ) : (
                          <CloseIcon color="error" />
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* MODAL */}
      {showModal && (
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            bgcolor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Paper sx={{ p: 3, minWidth: 300 }}>
            <Typography
              sx={{ cursor: "pointer", float: "right" }}
              onClick={() => setShowModal(false)}
            >
              ✕
            </Typography>
            {modalContent}
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default Report;
