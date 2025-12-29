import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import "./ScreeningList.css";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import axios from "axios";
import TablePagination from "@mui/material/TablePagination";
import CircularProgress from "@mui/material/CircularProgress";
import Modal from "@mui/material/Modal";
import { Card, CardContent, Typography, Grid, Button } from "@mui/material";
const ScreeningList = () => {
  const accessToken = localStorage.getItem("token");
  console.log(accessToken);
  const Port = process.env.REACT_APP_API_KEY;
  const userID = localStorage.getItem("userID");

  const SourceUrlId = localStorage.getItem("loginSource");
  const SourceNameUrlId = localStorage.getItem("SourceNameFetched");

  console.log(userID);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [sourceNav, setSourceNav] = useState([]);
  const [selectedSource, setSelectedSource] = useState(SourceUrlId);
  const [sourceType, setSourceType] = useState([]);
  const [selectedType, setSelectedType] = useState(3);
  const [sourceClass, setSourceClass] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedCount, setSelectedCount] = useState("");
  const [open, setOpen] = useState(false);
  const [cardData, setCardData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [loading, setLoading] = useState(true);
  const handleClose = () => setOpen(false);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  //////////////// Navbar Dropdown Value
  useEffect(() => {
    fetch(`${Port}/Screening/source_GET/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setSourceNav(data);
      })
      .catch((error) => {
        console.error("Error fetching sources:", error);
      });
  }, []);

  //// Soure Type against selected source
  useEffect(() => {
    const fetchTypeNavOptions = async () => {
      if (selectedSource) {
        try {
          const res = await fetch(
            `${Port}/Screening/screening_for_type_get/${selectedSource}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          const data = await res.json();
          setSourceType(data);
        } catch (error) {
          console.error("Error fetching type against source data:", error);
        }
      }
    };
    fetchTypeNavOptions();
  }, [selectedSource]);

  //// Class against selected source Type
  useEffect(() => {
    const fetchClass = async () => {
      try {
        const res = await fetch(`${Port}/Screening/get_class/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await res.json();
        setSourceClass(data);
      } catch (error) {
        console.error("Error fetching class against type data:", error);
      }
    };
    fetchClass();
  }, []);

  const handleStartScreening = (filteredIndex) => {
    const citizensPkId =
      filteredCardData[filteredIndex]?.citizen_info?.citizens_pk_id;
    const citizenidddddddd = filteredCardData[filteredIndex]?.citizen_id;
    const pkid = filteredCardData[filteredIndex]?.pk_id;
    const year = filteredCardData[filteredIndex]?.citizen_info?.year;
    const dob = filteredCardData[filteredIndex]?.citizen_info?.dob;
    const gender = filteredCardData[filteredIndex]?.citizen_info?.gender;
    const ScreeningCount = filteredCardData[filteredIndex]?.schedule_count;
    const citizenId = filteredCardData[filteredIndex]?.citizen_id;
    const scheduleID = filteredCardData[filteredIndex]?.schedule_id;
    const sourceID = filteredCardData[filteredIndex]?.citizen_info.source;

    console.log("Citizens PK ID:", citizensPkId);
    console.log("PK ID:", pkid);
    console.log("Year:", year);
    console.log("Gender:", gender);
    console.log("Citizen ID:", citizenId);
    console.log("Screening Count:", ScreeningCount);
    console.log("Citizens id:", citizenidddddddd);
    console.log("schedule id:", scheduleID);
    console.log("source id:", sourceID);

    navigate("/mainscreen/body", {
      state: {
        citizensPkId,
        pkid,
        year,
        dob,
        gender,
        citizenId,
        ScreeningCount,
        citizenidddddddd,
        scheduleID,
        sourceID,
      },
    });
  };

  const filteredCardData = (Array.isArray(cardData) ? cardData : []).filter(
    (card) => {
      const citizenName = card?.citizen_info?.name?.toLowerCase() || "";
      const citizenId = card?.citizen_id?.toLowerCase() || "";
      const scheduleId = card?.schedule_id?.toLowerCase() || "";
      const parentsMobile =
        card?.citizen_info?.parents_mobile?.toLowerCase() || "";

      return (
        citizenName.includes(searchQuery.toLowerCase()) ||
        citizenId.includes(searchQuery.toLowerCase()) ||
        scheduleId.includes(searchQuery.toLowerCase()) ||
        parentsMobile.includes(searchQuery.toLowerCase())
      );
    }
  );

  const handleSearch = async () => {
    try {
      let apiUrl = `${Port}/Screening/start_screening_info/?`;
      apiUrl += `source=${SourceUrlId}&source_name=${SourceNameUrlId}&`;
      if (selectedSource) {
        apiUrl += `source_id=${selectedSource}&`;
      }
      if (selectedType) {
        apiUrl += `type_id=${selectedType}&`;
      }
      if (selectedClass) {
        apiUrl += `class_id=${selectedClass}&`;
      }
      if (selectedCount) {
        apiUrl += `schedule_count=${selectedCount}&`;
      }
      if (selectedDepartment) {
        apiUrl += `department_id=${selectedDepartment}&`;
      }

      setLoading(true);

      const accessToken = localStorage.getItem("token");
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setCardData(response.data);

      response.data.forEach((item) => {
        console.log(item.citizen_info.source, "source fetched from response");
        localStorage.setItem("source", item.citizen_info.source);
      });

      console.log("Server Response:", response.data);
    } catch (error) {
      console.error("Error while fetching data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [selectedSource, selectedType, selectedClass, selectedCount]);

  const [department, setDepartmenet] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

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
  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const response = await axios.get(
          `${Port}/Screening/get_department/${SourceUrlId}/${SourceNameUrlId}/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setDepartmenet(response.data);
      } catch (error) {
        console.log(error, "Error fetching Class");
      }
    };
    fetchDepartment();
  }, []);

  return (
    <div>
      <div>
        <Box sx={{ m: "0.0em 0.4em 0 3em" }}>
          <Box className="container-fluid">
            <Card
              sx={{
                background: "white",
              }}
            >
              <CardContent>
                {/* ================= TITLE ================= */}
                <Typography
                  sx={{
                    mb: 1,
                    fontWeight: 600,
                    fontSize: "16px",
                    textAlign: "left",
                    color: "black",
                  }}
                >
                  Screening List
                </Typography>

                {/* ================= FILTER ROW ================= */}
                <Grid container spacing={1} alignItems="center">
                  {SourceUrlId === 1 && (
                    <Grid item xs={12} sm={6} md={2}>
                      <TextField
                        select
                        fullWidth
                        size="small"
                        label="WorkShop "
                        value={selectedSource}
                        onChange={(event) =>
                          setSelectedSource(event.target.value)
                        }
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
                        <MenuItem value="">Select WorkShop</MenuItem>
                        {sourceNav.map((drop) => (
                          <MenuItem
                            key={drop.source_pk_id}
                            value={drop.source_pk_id}
                          >
                            {drop.source}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  )}

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

                  {selectedSource === 1 && selectedType === 1 && (
                    <Grid item xs={12} sm={6} md={2}>
                      <TextField
                        select
                        fullWidth
                        size="small"
                        label="Class"
                        value={selectedClass}
                        onChange={(event) =>
                          setSelectedClass(event.target.value)
                        }
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
                        <MenuItem value="">Select Class</MenuItem>
                        {sourceClass.map((drop) => (
                          <MenuItem key={drop.class_id} value={drop.class_id}>
                            {drop.class_name}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  )}

                  {selectedSource === "5" && selectedType === 3 && (
                    <Grid item xs={12} sm={6} md={2}>
                      <TextField
                        select
                        fullWidth
                        size="small"
                        label="Department"
                        value={selectedDepartment}
                        onChange={(event) =>
                          setSelectedDepartment(event.target.value)
                        }
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
                        <MenuItem value="">Select Department</MenuItem>
                        {Array.isArray(department) &&
                          department.map((drop) => (
                            <MenuItem
                              key={drop.department_id}
                              value={drop.department_id}
                            >
                              {drop.department}
                            </MenuItem>
                          ))}
                      </TextField>
                    </Grid>
                  )}

                  {SourceUrlId === "1" && (
                    <Grid item xs={12} sm={6} md={2}>
                      <TextField
                        select
                        fullWidth
                        size="small"
                        label="Schedule Count"
                        value={selectedCount}
                        onChange={(event) =>
                          setSelectedCount(event.target.value)
                        }
                      >
                        <MenuItem value="">Select Count</MenuItem>
                        <MenuItem value="1">1</MenuItem>
                        <MenuItem value="2">2</MenuItem>
                        <MenuItem value="3">3</MenuItem>
                        <MenuItem value="4">4</MenuItem>
                        <MenuItem value="5">5</MenuItem>
                      </TextField>
                    </Grid>
                  )}

                  {/* ================= SEARCH BUTTON ================= */}
                  <Grid item xs={12} sm={6} md={2}>
                    <Button
                      fullWidth
                      variant="contained"
                      size="small"
                      sx={{
                        background:
                          "linear-gradient(90deg, #2FB3F5 0%, #1439A4 100%)",
                        ":hover": {
                          background:
                            "linear-gradient(90deg, #2FB3F5 0%, #1439A4 100%)",
                        },
                      }}
                      onClick={handleSearch}
                    >
                      Search
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </div>

      <Box className="content-wrapper">
        <Box className="content-header">
          <Box className="container-fluid">
            {/* ================= SEARCH + PAGINATION ================= */}
            <Grid container spacing={1} alignItems="center" mb={1}>
              <Grid item xs={12} md={3}>
                <Box position="relative" >
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <SearchIcon className="searchiconnew1111" />
                </Box>
              </Grid>

              <Grid
                item
                xs={12}
                md={9}
                display="flex"
                justifyContent="flex-end"
              >
                <TablePagination
                  component="div"
                  count={filteredCardData.length}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  rowsPerPageOptions={[6, 10, 20, 50, 75, 100]}
                />
              </Grid>
            </Grid>

            {/* ================= CARD LIST ================= */}
            <Grid container spacing={2}>
              {loading ? (
                <Grid item xs={12} display="flex" justifyContent="center">
                  <CircularProgress className="circular-progress-containerscreeninglist" />
                </Grid>
              ) : filteredCardData.length === 0 ? (
                <Grid item xs={12}>
                  <Typography
                    variant="h6"
                    className="recordsfound"
                    align="center"
                  >
                    No records found.
                  </Typography>
                </Grid>
              ) : (
                filteredCardData
                  .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
                  .map((card, index) => {
                    const completeForms = card.form_counts?.complete_forms || 0;
                    const totalTables = card.form_counts?.total_tables || 1;
                    const progressValue = (completeForms / totalTables) * 100;

                    return (
                      <Grid item xs={12} md={4} key={card.pk_id}>
                        <Card className="card-spacing">
                          <CardContent>
                            {/* ===== HEADER ===== */}
                            <Box
                              display="flex"
                              justifyContent="space-between"
                              mb={1}
                            >
                              <Box display="flex" alignItems="center">
                                <PersonOutlineOutlinedIcon
                                  className="outlineperson"
                                  sx={{ mr: 1 }}
                                />
                                <Typography className="citizennamehealth">
                                  {card.citizen_info?.prefix
                                    ? card.citizen_info.prefix
                                        .toLowerCase()
                                        .charAt(0)
                                        .toUpperCase() +
                                      card.citizen_info.prefix
                                        .toLowerCase()
                                        .slice(1) +
                                      "."
                                    : ""}
                                  {card.citizen_info?.name || ""}
                                </Typography>
                              </Box>

                              <Typography className="screeningcountcard">
                                Screening: {card.schedule_count || ""}
                              </Typography>
                            </Box>

                            {/* ===== MODAL (UNCHANGED) ===== */}
                            <Modal
                              open={open}
                              onClose={handleClose}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                              BackdropProps={{
                                style: { backgroundColor: "transparent" },
                              }}
                            >
                              <Box sx={{ width: 300, p: 2, bgcolor: "white" }}>
                                <Typography variant="h6">
                                  Modal Title
                                </Typography>
                                <Typography>
                                  This is the content of the modal.
                                </Typography>
                              </Box>
                            </Modal>

                            {/* ===== DETAILS ===== */}
                            <Grid container spacing={1} mt={1}>
                              <Grid item xs={6} className="textstyle">
                                Citizen Id
                              </Grid>
                              <Grid item xs={6} className="valuestyle">
                                {card.citizen_id || ""}
                              </Grid>

                              <Grid item xs={6} className="textstyle">
                                Schedule Id
                              </Grid>
                              <Grid item xs={6} className="valuestyle">
                                {card.schedule_id || ""}
                              </Grid>

                              <Grid item xs={6} className="textstyle">
                                Phone Number
                              </Grid>
                              <Grid item xs={6} className="valuestyle">
                                {SourceUrlId === "1"
                                  ? card.citizen_info?.parents_mobile || ""
                                  : card.citizen_info?.emp_mobile_no || ""}
                              </Grid>
                            </Grid>

                            {/* ===== ACTION ===== */}
                            <Button
                              fullWidth
                              size="small"
                              variant="contained"
                              className="start"
                              sx={{ mt: 2 }}
                              onClick={() =>
                                handleStartScreening(page * rowsPerPage + index)
                              }
                            >
                              Start Screening
                            </Button>
                          </CardContent>
                        </Card>
                      </Grid>
                    );
                  })
              )}
            </Grid>
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default ScreeningList;
