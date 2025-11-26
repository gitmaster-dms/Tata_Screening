import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import SearchIcon from "@mui/icons-material/Search";
import DriveFileRenameOutlineOutlinedIcon from "@mui/icons-material/DriveFileRenameOutlineOutlined";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import {
  Box,
  Grid,
  Modal,
  Card,
  Typography,
  Button,
  TextField,
  IconButton,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  TablePagination,
  Paper,
  Menu,
  MenuItem,
  CardContent,
  ListItemText,
  ListItemIcon,
  Snackbar,
  Alert,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ReplayOutlinedIcon from "@mui/icons-material/ReplayOutlined";
import PlayArrowOutlinedIcon from "@mui/icons-material/PlayArrowOutlined";
import { useLocation } from "react-router-dom";
const Citizenlist = () => {
  //permission code start
  const [canAddCitizen, setCanAddCitizen] = useState(false);
  const [canDelete, setCanDelete] = useState(false);
  const [canView, setCanView] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const userID = localStorage.getItem("userID");
  console.log(userID);
  const accessToken = localStorage.getItem("token");
  const location = useLocation();
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({
  open: false,
  message: "",
  severity: "success", // "success" | "error" | "warning" | "info"
});

  //// access the source from local storage
  const SourceUrlId = localStorage.getItem("loginSource");
  console.log("SourceUrlId", SourceUrlId);

  const source = localStorage.getItem("source_id");        // "5" (string)
const sourceName = localStorage.getItem("source_name_id"); // "1" (string)

console.log("Idddddddd", sourceName, source);


  //// access the source name from local storage
  const SourceNameUrlId = localStorage.getItem("SourceNameFetched");
  console.log("fetched sourcename in citizen", SourceNameUrlId);

  /////////// Roshni's Code Start /////////////////////
  const [viewInvestigation, setViewInvestigation] = useState(false);
  const viewInvest = localStorage.getItem("investiData");
  console.log("View Invest....", viewInvest);
  /////////// Roshni's Code End //////////////////////////

  useEffect(() => {
    const storedPermissions = localStorage.getItem("permissions");
    console.log("Stored Permissions:", storedPermissions);
    const parsedPermissions = storedPermissions
      ? JSON.parse(storedPermissions)
      : [];
    console.log("parsedPermissions Permissions:", parsedPermissions);
    // Check if the user has permission to add a citizen with 'Edit' submodule
    const hasAddCitizenPermission = parsedPermissions.some((p) =>
      p.modules_submodule.some(
        (m) =>
          m.moduleName === "Citizen" &&
          m.selectedSubmodules.some(
            (s) => s.submoduleName.toLowerCase() === "add"
          )
      )
    );
    setCanAddCitizen(hasAddCitizenPermission);
    // Check if the user has permission for the "Delete" submodule
    const hasDeletePermission = parsedPermissions.some((p) =>
      p.modules_submodule.some(
        (m) =>
          m.moduleName === "Citizen" &&
          m.selectedSubmodules.some((s) => s.submoduleName === "Delete")
      )
    );
    setCanDelete(hasDeletePermission);

    // Check if the user has permission for the "edit" submodule

    const hasEditPermission = parsedPermissions.some((p) =>
      p.modules_submodule.some(
        (m) =>
          m.moduleName === "Citizen" &&
          m.selectedSubmodules.some((s) => s.submoduleName === "Edit")
      )
    );
    setCanEdit(hasEditPermission);

    // Check if the user has permission for the "view" submodule

    const hasViewPermission = parsedPermissions.some((p) =>
      p.modules_submodule.some(
        (m) =>
          m.moduleName === "Citizen" &&
          m.selectedSubmodules.some((s) => s.submoduleName === "View")
      )
    );
    setCanView(hasViewPermission);

    ////// roshni code start

    // const investigationModules = parsedPermissions.map(permission => {
    //     const modules = permission.modules_submodule.find(module => module.moduleName === 'Investigation');
    //     if (modules) {
    //         return {
    //             moduleId: modules.moduleId,
    //             moduleName: modules.moduleName,
    //             selectedSubmodules: modules.selectedSubmodules
    //         };
    //     } else {
    //         return null;
    //     }
    // }).filter(module => module !== null);
    // console.log("investigationModules", investigationModules);
    // setViewInvestigation(investigationModules[0].selectedSubmodules);
    // localStorage.setItem('investiData', JSON.stringify(investigationModules[0].selectedSubmodules));

    const investigationModules = parsedPermissions
      .map((permission) => {
        const modules = permission.modules_submodule.find(
          (module) => module.moduleName === "Investigation"
        );
        if (modules) {
          return {
            moduleId: modules.moduleId,
            moduleName: modules.moduleName,
            selectedSubmodules: modules.selectedSubmodules,
          };
        } else {
          return null;
        }
      })
      .filter((module) => module !== null);

    console.log("investigationModules", investigationModules);

    if (investigationModules.length > 0) {
      setViewInvestigation(investigationModules[0].selectedSubmodules);
      localStorage.setItem(
        "investiData",
        JSON.stringify(investigationModules[0].selectedSubmodules)
      );
    } else {
      // Handle the case when investigationModules is empty
      setViewInvestigation([]);
      localStorage.setItem("investiData", JSON.stringify([]));
    }

    ////// roshni code end
  }, []);

  //permission code end
  const Port = process.env.REACT_APP_API_KEY;
  const [active, setActive] = useState("today"); // today filter
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAge, setSelectedAge] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedSource, setSelectedSource] = useState(SourceUrlId || "");
  const [selectedDisease, setSelectedDisease] = useState("");
  const [selectedClassNav, setSelectedClassNav] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");
  /////////////// user nav API  /////////////////
  const [ListAgeNav, setListAgeNav] = useState([]);
  const [ListGenderNav, setListGenderNav] = useState([]);
  const [ListSourceNav, setListSourceNav] = useState([]);
  const [ListDiseaseNav, setListDiseaseNav] = useState([]);

  const [screeningFor, setScreeningFor] = useState([]);
  const [selectedScheduleType, setSelectedScheduleType] = useState("");

  const [classList, setClassList] = useState([]); //// class API
  const [divisionList, setDivisionList] = useState([]); //// class API

  const [tableFetch, setTableFetch] = useState([]); ///////////////// table Data
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  ///////// Loader
  const [loading, setLoading] = useState(true);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    handleActive("today");
  }, []);

  //today till filter
  const handleActive = async (type) => {
    setLoading(true);

    try {
      const accessToken = localStorage.getItem("token");
      // const response = await axios.get(`${Port}/Screening/filter-citizens/?date_filter=${type}&source=${SourceUrlId}&source_name=${SourceNameUrlId}`, {
      const response = await axios.get(`${Port}/Screening/Citizen_Get/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      setTableFetch(response.data);
      console.log(response.data);
    } catch (error) {
      console.log("Error while fetching data", error);
    } finally {
      setLoading(false); // Set loading to false when the data fetching is complete (either success or error)
    }
    setActive(type);
  };

  const handlesubmit = async () => {
    setLoading(true);

    const filters = {
      age: selectedAge,
      gender: selectedGender,
      source: selectedSource,
      type: selectedScheduleType,
      disease: selectedDisease,
      Class: selectedClassNav,
      division: selectedDivision,
      sourceurl_id: SourceUrlId,
      source_name: SourceNameUrlId,
    };

    const accessToken = localStorage.getItem("token"); // Retrieve access token

    const url = `${Port}/Screening/filter-citizens/?${Object.entries(filters)
      .filter(([key, value]) => value !== null && value !== undefined)
      .map(([key, value]) => `${key}=${value}`)
      .join("&")}`;

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      setTableFetch(response.data);
    } catch (error) {
      console.log("Error while fetching data", error);
    } finally {
      setLoading(false);
    }
  };

  /////////////DELETE API
const handleDeleteClick = async (citizenID) => {
  try {
    const response = await fetch(`${Port}/Screening/Citizen_delete/${citizenID}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.ok) {
      console.log("Record deleted successfully");

      setSnackbar({
        open: true,
        message: "Record deleted successfully!",
        severity: "success",
      });

      await handleActive(active); // refresh table
    } else {
      console.error("Failed to delete record");

      setSnackbar({
        open: true,
        message: "Failed to delete record!",
        severity: "error",
      });
    }
  } catch (error) {
    console.error("Error:", error);

    setSnackbar({
      open: true,
      message: "Something went wrong!",
      severity: "error",
    });
  }
};




  /////////////Citizen Age nav API
  useEffect(() => {
    const fetchUserAgeDropdown = async () => {
      try {
        const response = await axios.get(
          `${Port}/Screening/Age_GET/?source_id=${SourceUrlId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        setListAgeNav(response.data);
        console.log(ListAgeNav);
      } catch (error) {
        console.log("Error while fetching data", error);
      }
    };
    fetchUserAgeDropdown();
  }, []);

  /////////////Citizen Gender nav API
  useEffect(() => {
    const fetchUserGenderDropdown = async () => {
      try {
        const response = await axios.get(`${Port}/Screening/Gender_GET/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });
        setListGenderNav(response.data);
        console.log(ListGenderNav);
      } catch (error) {
        console.log("Error while fetching data", error);
      }
    };
    fetchUserGenderDropdown();
  }, []);

  /////////////Citizen Source nav API
  useEffect(() => {
    const fetchUserSourceDropdown = async () => {
      try {
        const response = await axios.get(
          `${Port}/Screening/source_GET/?source_pk_id=${SourceUrlId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        setListSourceNav(response.data);
        console.log(ListSourceNav);
      } catch (error) {
        console.log("Error while fetching data", error);
      }
    };
    fetchUserSourceDropdown();
  }, []);

  /////////////Citizen Disease nav API
  useEffect(() => {
    const fetchUserDiseaseDropdown = async () => {
      try {
        const response = await axios.get(
          `${Port}/Screening/child_disease_info_get/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        setListDiseaseNav(response.data);
        console.log(ListDiseaseNav);
      } catch (error) {
        console.log("Error while fetching data", error);
      }
    };
    fetchUserDiseaseDropdown();
  }, []);

  ////// Screening For ///////
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
  /////// Class GET API
  useEffect(() => {
    const fetchClass = async () => {
      try {
        const response = await axios.get(`${Port}/Screening/get_class/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });
        setClassList(response.data);
      } catch (error) {
        console.log(error, "Error fetching Class");
      }
    };
    fetchClass();
  }, []);

  /////// Division GET API
  useEffect(() => {
    const fetchDivision = async () => {
      try {
        const response = await axios.get(`${Port}/Screening/get_division/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });
        setDivisionList(response.data);
      } catch (error) {
        console.log(error, "Error fetching Division");
      }
    };
    fetchDivision();
  }, []);

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCitizen, setSelectedCitizen] = useState(null);
  console.log("selectedted", selectedCitizen);
  const citizens_pk_id = location.state?.citizens_pk_id;
  console.log("CitizenID", citizens_pk_id);
  const [openModal, setOpenModal] = useState(false);
  const [openModalStart, setOpenModalStart] = useState(false);
  const [loadingPrevious, setLoadingPrevious] = useState(false);
  const [previousData, setPreviousData] = useState(null);
  console.log(previousData, "previousData");

  const open = Boolean(anchorEl);


  const handleMenuOpen = (event, citizen) => {
    setAnchorEl(event.currentTarget);
    setSelectedCitizen(citizen);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handlePreviousClick = async () => {
    if (!selectedCitizen) return;
    handleMenuClose();
    setOpenModal(true);
    setLoadingPrevious(true);

    try {
      const response = await fetch(
        `${Port}/Screening/Start_Screening/${selectedCitizen.citizens_pk_id}/`
      );
      const data = await response.json();
      console.log("Fetched Screening Data:", data);
      setPreviousData(data);
    } catch (error) {
      console.error("Error fetching previous screening:", error);
      setPreviousData({ error: true });
    } finally {
      setLoadingPrevious(false);
    }
  };

  const handleStartScreening = async () => {
    if (!selectedCitizen) return;
    handleMenuClose();
    setOpenModalStart(true);
    setLoadingPrevious(true);

    try {
      const response = await fetch(
        `${Port}/Screening/Start_Screening/${selectedCitizen.citizens_pk_id}/`
      );
      const data = await response.json();
      console.log("Fetched Screening Data:", data);
      setPreviousData(data);
    } catch (error) {
      console.error("Error fetching previous screening:", error);
      setPreviousData({ error: true });
    } finally {
      setLoadingPrevious(false);
    }
  };

  const handleStartNewScreening = async () => {
    if (!selectedCitizen?.citizens_pk_id) {
      setSnackbar({
        open: true,
        message: "Invalid citizen data.",
        severity: "error",
      });
      return;
    }

    try {
      const response = await axios.post(
        `${Port}/Screening/Start_Screening/${selectedCitizen.citizens_pk_id}/`,
        {
          citizen_id: selectedCitizen.citizens_pk_id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setSnackbar({
          open: true,
          message: "New screening started successfully!",
          severity: "success",
        });

        setOpenModalStart(false);
      } else {
        throw new Error("Failed to start new screening.");
      }
    } catch (error) {
      console.error("Error starting new screening:", error);
      setSnackbar({
        open: true,
        message: "Failed to start new screening. Please try again.",
        severity: "error",
      });
    }
  };

  return (
    <div>
      <Card
        sx={{
          p: 1,
          borderRadius: 2,
          boxShadow: 1,
          backgroundColor: "#fff",
          m: "0.1em 1em 0 4.5em",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 500,
              color: "#1A237E",
              fontFamily: "Roboto",
            }}
          >
            Search Citizen
          </Typography>

          {canAddCitizen && (
            <Link
              to="/mainscreen/Citizenheader"
              style={{ textDecoration: "none" }}
            >
              <IconButton
                sx={{
                  background: "rgba(10, 112, 183, 1)",
                  color: "white",
                  mr: 1,
                  "&:hover": { backgroundColor: "rgba(10, 112, 183, 1)" },
                }}
              >
                <PersonAddAltIcon />
              </IconButton>
            </Link>
          )}
        </Box>

        <Grid container spacing={2} alignItems="left" justifyContent="left">
          {/* <Grid item xs={12} sm={6} md="auto">
                        <TextField
                            select
                            size="small"
                            label="Age"
                            value={selectedAge}
                            onChange={(e) => setSelectedAge(e.target.value)}
                            sx={{
                                minWidth: 200,
                                "& .MuiInputBase-input.MuiSelect-select": {
                                    color: "#000 !important",
                                },
                                "& .MuiSvgIcon-root": {
                                    color: "#000",
                                },
                            }}
                        >
                            <MenuItem value="">Select Age</MenuItem>
                            {ListAgeNav.map((drop) => (
                                <MenuItem key={drop.age_pk_id} value={drop.age_pk_id}>
                                    {drop.age}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid> */}

          <Grid item xs={12} sm={6} md="auto">
            <TextField
              select
              size="small"
              label="Gender"
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              sx={{
                minWidth: 200,
                "& .MuiInputBase-input.MuiSelect-select": {
                  color: "#000 !important",
                },
                "& .MuiSvgIcon-root": {
                  color: "#000",
                },
              }}
            >
              <MenuItem value="">Select Gender</MenuItem>
              {ListGenderNav.map((drop) => (
                <MenuItem key={drop.gender_pk_id} value={drop.gender_pk_id}>
                  {drop.gender}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* <Grid item xs={12} sm={6} md="auto">
                        <TextField
                            select
                            size="small"
                            label="Workshop"
                            value={selectedSource}
                            onChange={(e) => setSelectedSource(e.target.value)}
                            sx={{
                                minWidth: 200,
                                "& .MuiInputBase-input.MuiSelect-select": {
                                    color: "#000 !important",
                                },
                                "& .MuiSvgIcon-root": {
                                    color: "#000",
                                },
                            }}
                        >
                            <MenuItem value="">Select Source</MenuItem>
                            {ListSourceNav.map((drop) => (
                                <MenuItem key={drop.source_pk_id} value={drop.source_pk_id}>
                                    {drop.source}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid> */}

          <Grid item xs={12} sm={6} md="auto">
            <TextField
              select
              size="small"
              label="Category"
              value={selectedScheduleType}
              onChange={(e) => setSelectedScheduleType(e.target.value)}
              sx={{
                minWidth: 200,
                "& .MuiInputBase-input.MuiSelect-select": {
                  color: "#000 !important",
                },
                "& .MuiSvgIcon-root": {
                  color: "#000",
                },
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

          <Grid item xs={12} sm={6} md="auto">
            <TextField
              label="Citizen ID"
              placeholder="Enter Citizen ID"
              size="small"
              // value={citizenId}
              // onChange={(e) => setCitizenId(e.target.value)}
              sx={{
                minWidth: 200,
                "& .MuiInputBase-input": {
                  color: "#000",
                },
              }}
            />
          </Grid>

          {/* <Grid item xs={12} sm={6} md="auto">
                        <TextField
                            select
                            size="small"
                            label="Disease"
                            value={selectedDisease}
                            onChange={(e) => setSelectedDisease(e.target.value)}
                            sx={{
                                minWidth: 200,
                                "& .MuiInputBase-input.MuiSelect-select": {
                                    color: "#000 !important",
                                },
                                "& .MuiSvgIcon-root": {
                                    color: "#000",
                                },
                            }}
                        >
                            <MenuItem value="">Select Disease</MenuItem>
                            {ListDiseaseNav.map((drop) => (
                                <MenuItem key={drop.disease_pk_id} value={drop.disease_pk_id}>
                                    {drop.disease}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid> */}

          <Grid item xs={12} sm={6} md="auto">
            <Button
              variant="contained"
              size="small"
              onClick={handlesubmit}
              sx={{
                background: "rgba(10, 112, 183, 1)",
                color: "white",
                textTransform: "none",
                fontWeight: 500,
                px: 3,
                "&:hover": {
                  background: "rgba(10, 112, 183, 1)",
                },
              }}
            >
              Search
            </Button>
          </Grid>
        </Grid>
      </Card>

      <Box sx={{ p: 1, m: "0.1em 0em 0 4.5em" }}>
        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                p: 0.1,
                borderRadius: 2,
                boxShadow: 2,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              {["today", "month", "date"].map((key) => (
                <Button
                  key={key}
                  variant={active === key ? "contained" : "outlined"}
                  onClick={() => handleActive(key)}
                  sx={{
                    flex: 1,
                    mx: 0.5,
                    my: 0.5,
                    textTransform: "none",
                    fontWeight: active === key ? 400 : 400,
                    background:
                      active === key
                        ? "linear-gradient(90deg, #2FB3F5 0%, #1439A4 100%)"
                        : "transparent",
                    color: active === key ? "white" : "black",
                    "&:hover": {
                      background:
                        active === key
                          ? "linear-gradient(90deg, #2FB3F5 0%, #1439A4 100%)"
                          : "#E3F2FD",
                    },
                  }}
                >
                  {key === "today"
                    ? "Today"
                    : key === "month"
                    ? "Month"
                    : "Till Date"}
                </Button>
              ))}
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ position: "relative", width: "100%" }}>
              <TextField
                size="small"
                fullWidth
                placeholder="Search Citizen"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <SearchIcon
                sx={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#1565C0",
                }}
              />
            </Box>
          </Grid>
        </Grid>

        <TableContainer>
          <Table>
            <TableHead
              sx={{
                background: "linear-gradient(90deg, #2FB3F5 0%, #1439A4 100%)",
              }}
            >
              <TableRow
                sx={{
                  background:
                    "linear-gradient(90deg, #2FB3F5 0%, #1439A4 100%)",
                  height: "45px",
                  "& th": {
                    color: "white",
                    fontWeight: 600,
                    fontSize: "0.8rem",
                    border: "none",
                    py: 0.5,
                    px: 5,
                  },
                  "& th:first-of-type": {
                    borderTopLeftRadius: "40px",
                    borderBottomLeftRadius: "40px",
                  },
                  "& th:last-of-type": {
                    borderTopRightRadius: "40px",
                    borderBottomRightRadius: "40px",
                  },
                }}
              >
                <TableCell sx={{ flex: 0.5 }}>Sr No.</TableCell>
                <TableCell sx={{ flex: 2 }}>Citizen Name</TableCell>
                <TableCell sx={{ flex: 1 }}>Mobile Number</TableCell>
                <TableCell sx={{ flex: 2 }}>Adhar Number</TableCell>
                <TableCell sx={{ flex: 1.5 }}>Added By</TableCell>
                <TableCell sx={{ flex: 1 }}>Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <CircularProgress
                      sx={{ my: 1, color: "#1439A4" }}
                      size={30}
                    />
                  </TableCell>
                </TableRow>
              ) : tableFetch.length > 0 ? (
                tableFetch
                  .filter((data) =>
                    Object.values(data).some(
                      (value) =>
                        value &&
                        value
                          .toString()
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase())
                    )
                  )
                  .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
                  .map((data, index) => {
                    console.log(data,"data");
                    const serialNumber = index + 1 + page * rowsPerPage;
                    return (
                      <TableRow
                        key={data.citizens_pk_id}
                        sx={{
                          height: "45px",
                          "& td": { border: "none", p: 0.5 },
                        }}
                      >
                        <TableCell colSpan={6}>
                          <Card
                            sx={{
                              borderRadius: "20px",
                              boxShadow: 2,
                              "&:hover": { boxShadow: 4 },
                              transition: "0.3s",
                              mt: 1,
                              height: "45px",
                            }}
                          >
                            <CardContent
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                textAlign: "center",
                                height: "100%",
                                py: 3,
                              }}
                            >
                              <Box sx={{ flex: 0.5 }}>{serialNumber}</Box>
                              <Box sx={{ flex: 2 }}>{data.name || "-"}</Box>
                              <Box sx={{ flex: 1 }}>
                                {" "}
                                {data.mobile_no || "-"}
                              </Box>
                              <Box sx={{ flex: 2 }}>
                                {data.aadhar_id || "-"}
                              </Box>
                              <Box sx={{ flex: 1.5 }}>
                                {" "}
                                {data.added_by || "-"}
                              </Box>
                              <Box
                                sx={{
                                  flex: 1,
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                              >
                                <IconButton
                                  onClick={(e) => handleMenuOpen(e, data)}
                                >
                                  <MoreVertIcon sx={{ color: "#1565C0" }} />
                                </IconButton>

                                <Menu
                                  anchorEl={anchorEl}
                                  open={open}
                                  onClose={handleMenuClose}
                                  anchorOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                  }}
                                  transformOrigin={{
                                    vertical: "top",
                                    horizontal: "left",
                                  }}
                                  PaperProps={{
                                    sx: {
                                      borderRadius: 2,
                                      boxShadow: 3,
                                      minWidth: 180,
                                    },
                                  }}
                                >
                                  {canEdit && (
                                    <MenuItem
                                      component={Link}
                                      to={`/mainscreen/updatecitizen/${selectedCitizen?.citizens_pk_id}/`}
                                      onClick={handleMenuClose}
                                    >
                                      <ListItemIcon>
                                        <DriveFileRenameOutlineOutlinedIcon
                                          sx={{ color: "#1565C0" }}
                                        />
                                      </ListItemIcon>
                                      <ListItemText primary="Edit Citizen" />
                                    </MenuItem>
                                  )}

                                  {canView && (
                                    <MenuItem
                                      component={Link}
                                      to={`/mainscreen/viewcitizen/${selectedCitizen?.citizens_pk_id}/`}
                                      onClick={handleMenuClose}
                                    >
                                      <ListItemIcon>
                                        <RemoveRedEyeOutlinedIcon
                                          sx={{ color: "#1976D2" }}
                                        />
                                      </ListItemIcon>
                                      <ListItemText primary="View Citizen" />
                                    </MenuItem>
                                  )}

                                  {canDelete && (
                                    <MenuItem
                                      onClick={() =>
                                        handleDeleteClick(data.citizens_pk_id)
                                      }
                                    >
                                      <ListItemIcon>
                                        <DeleteOutlineOutlinedIcon
                                          sx={{ color: "#D32F2F" }}
                                        />
                                      </ListItemIcon>
                                      <ListItemText primary="Delete Citizen" />
                                    </MenuItem>
                                  )}
                                  {selectedCitizen?.previous_screen ===
                                    true && (
                                    <MenuItem
                                      onClick={(e) => handlePreviousClick(data)}
                                    >
                                      <ListItemIcon>
                                        <ReplayOutlinedIcon
                                          sx={{ color: "#00796B" }}
                                        />
                                      </ListItemIcon>
                                      <ListItemText primary="Previous Screening" />
                                    </MenuItem>
                                  )}

                                  {/* <MenuItem
                                    component={Link}
                                    onClick={() => {
                                      handleMenuClose();
                                      setOpenModalStart(true); // Only show modal - DO NOT navigate here
                                      handleStartScreening();
                                    }}
                                    // to="/vital/childInfo"
                                    state={{
                                      citizens_pk_id: data.citizens_pk_id,
                                    }}
                                  >
                                    <ListItemIcon>
                                      <PlayArrowOutlinedIcon
                                        sx={{ color: "#2E7D32" }}
                                      />
                                    </ListItemIcon>
                                    <ListItemText primary="Start Screening" />
                                  </MenuItem> */}
                                  <MenuItem
    onClick={() => {
        handleMenuClose();

        if (selectedCitizen?.previous_screen === true) {
            setOpenModalStart(true);
            handleStartScreening();
        } else {
            console.log(data.citizens_pk_id, "citizens_pk_id");

            navigate("/mainscreen/Body", {
                state: {
                    citizens_pk_id: data.citizens_pk_id,
                    SourceUrlId,
                    SourceNameUrlId,
                    year:data.year,
                    dob:data.dob,
                    gender:data.gender,
                },
            });
        }
    }}
>
    <ListItemIcon>
        <PlayArrowOutlinedIcon sx={{ color: "#2E7D32" }} />
    </ListItemIcon>
    <ListItemText primary="Start Screening" />
</MenuItem>

                                </Menu>
                              </Box>
                            </CardContent>
                          </Card>
                        </TableCell>
                      </TableRow>
                    );
                  })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="subtitle2" color="text.secondary">
                      No Data Found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Modal
          open={openModal}
          onClose={() => setOpenModal(false)}
          aria-labelledby="previous-screening-modal"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: { xs: "90%", sm: 450 },
              bgcolor: "background.paper",
              borderRadius: 3,
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography
              id="previous-screening-modal"
              variant="h6"
              textAlign="center"
              fontWeight={600}
              sx={{ mb: 3, fontFamily: "Roboto" }}
            >
              Previous Screening Details
            </Typography>

            {loadingPrevious ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="120px"
              >
                <CircularProgress sx={{ color: "#1439A4" }} />
              </Box>
            ) : previousData ? (
              previousData.error ? (
                <Typography color="error" textAlign="center">
                  Failed to load data.
                </Typography>
              ) : previousData.citizen_exists ? (
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 1.2,
                      bgcolor: "#F9FAFB",
                      borderRadius: 2,
                      p: 2,
                      mb: 3,
                      fontFamily: "Roboto",
                    }}
                  >
                    <Typography>
                      <b>Citizen ID:</b>{" "}
                      {previousData.latest_screening.citizen_id}
                    </Typography>
                    <Typography>
                      <b>Screening Count:</b>{" "}
                      {previousData.latest_screening.screening_count}
                    </Typography>
                    <Typography>
                      <b>Added By:</b> {previousData.latest_screening.added_by}
                    </Typography>
                    <Typography>
                      <b>Added Date:</b>{" "}
                      {new Date(
                        previousData.latest_screening.added_date
                      ).toLocaleString()}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Button
                      fullWidth={false}
                      variant="contained"
                      sx={{
                        textTransform: "none",
                        bgcolor: "#2E7D32",
                        "&:hover": { bgcolor: "#2E7D32" },
                        minWidth: 180,
                      }}
                      onClick={() => {
                        console.log(
                          "Continuing screening for citizen:",
                          previousData.latest_screening.citizen_pk_id
                        );
                        setOpenModal(false);
                        // change path of the routing
                        navigate("/mainscreen/Body", {
                          state: {
                            citizens_pk_id: selectedCitizen.citizens_pk_id,
                          },
                        });
                      }}
                    >
                      Continue Previous Screening
                    </Button>

                    {/* <Button
                                            fullWidth={false}
                                            variant="contained"
                                            sx={{
                                                textTransform: "none",
                                                bgcolor: "#1565C0",
                                                "&:hover": { bgcolor: "#1565C0" },
                                                minWidth: 180,
                                            }}
                                            onClick={() => {
                                                console.log("Starting new screening for:", selectedCitizen.citizens_pk_id);
                                                setOpenModal(false);
                                                // navigate(`/mainscreen/body/${selectedCitizen.citizens_pk_id}`);
                                            }}
                                        >
                                            Start New Screening
                                        </Button> */}
                  </Box>
                </Box>
              ) : (
                <Box textAlign="center">
                  <Typography color="error" sx={{ mb: 3 }}>
                    No previous screening found.
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: "#1565C0",
                      "&:hover": { bgcolor: "#1565C0" },
                      px: 4,
                    }}
                    onClick={() => {
                      console.log(
                        "Starting new screening for:",
                        selectedCitizen.citizens_pk_id
                      );
                      setOpenModal(false);

                      handleStartNewScreening();
                      console.log(
                        "Navigating to childInfo with ID:",
                        selectedCitizen?.citizens_pk_id
                      );

                      navigate("/vital/childInfo", {
                        state: {
                          citizens_pk_id: selectedCitizen.citizens_pk_id,
                        },
                      });
                    }}
                  >
                    Start New Screening
                  </Button>
                </Box>
              )
            ) : (
              <Typography color="text.secondary" textAlign="center">
                No data available
              </Typography>
            )}
          </Box>
        </Modal>

        <Modal
          open={openModalStart}
          onClose={() => setOpenModalStart(false)}
          aria-labelledby="previous-screening-modal"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: { xs: "90%", sm: 450 },
              bgcolor: "background.paper",
              borderRadius: 3,
              boxShadow: 24,
              p: 4,
              width: "auto",
            }}
          >
            {loadingPrevious ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="120px"
              >
                <CircularProgress sx={{ color: "#1439A4" }} />
              </Box>
            ) : previousData ? (
              previousData.error ? (
                <Typography color="error" textAlign="center">
                  Failed to load data.
                </Typography>
              ) : previousData.citizen_exists ? (
                <Box>
                  <Typography
                    id="previous-screening-modal"
                    variant="h6"
                    textAlign="center"
                    fontWeight={600}
                    sx={{ mb: 3, fontFamily: "Roboto" }}
                  >
                    Starting a new screening will close the Previous one.
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Button
                      fullWidth={false}
                      variant="contained"
                      sx={{
                        textTransform: "none",
                        bgcolor: "#1565C0",
                        "&:hover": { bgcolor: "#1565C0" },
                        minWidth: 180,
                      }}
                      //   onClick={() => {
                      //     setOpenModal(false);
                      //     console.log(
                      //       "Starting new screening for:",
                      //       selectedCitizen.citizens_pk_id
                      //     );
                      //     handleStartNewScreening();
                      //     // navigate(`/mainscreen/body/${selectedCitizen.citizens_pk_id}`);
                      //   }}
                      onClick={() => {
                        console.log(
                          "Starting new screening for:",
                          selectedCitizen.citizens_pk_id
                        );
                        setOpenModal(false);

                        handleStartNewScreening();
                        console.log(
                          "Navigating to childInfo with ID:",
                          selectedCitizen?.citizens_pk_id
                        );

                        navigate("/mainscreen/Body", {
                          state: {
                            citizens_pk_id: selectedCitizen.citizens_pk_id,
                          },
                        });
                        console.log(
                          "Navigating to childInfo with ID:",
                          selectedCitizen?.citizens_pk_id
                        );
                      }}
                    >
                      Start New Screening
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box textAlign="center">
                  <Typography
                    id="previous-screening-modal"
                    variant="h6"
                    textAlign="center"
                    fontWeight={600}
                    sx={{ mb: 3, fontFamily: "Roboto" }}
                  >
                    No previous screening found.
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{
                      textTransform: "none",
                      bgcolor: "#1565C0",
                      "&:hover": { bgcolor: "#1565C0" },
                      px: 4,
                    }}
                    onClick={() => {
                      console.log(
                        "Starting new screening for:",
                        selectedCitizen.citizens_pk_id
                      );
                      setOpenModal(false);
                      // navigate(`/mainscreen/body/${selectedCitizen.citizens_pk_id}`);
                    }}
                  >
                    Start New Screening
                  </Button>
                </Box>
              )
            ) : (
              <Typography color="text.secondary" textAlign="center">
                No data available
              </Typography>
            )}
          </Box>
        </Modal>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
            {snackbar.message}
          </Alert>
        </Snackbar>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
          <TablePagination
            component="div"
            count={tableFetch.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 20]}
          />
        </Box>
      </Box>
    </div>
  );
};

export default Citizenlist;
