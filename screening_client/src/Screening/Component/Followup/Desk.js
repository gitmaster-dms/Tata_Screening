import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
// Removed external CSS to rely on MUI `sx` for responsive styling
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import axios from "axios";
import {
  Grid,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CardContent,
  Card,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TablePagination,
  Select,
  InputLabel,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  useTheme,
  useMediaQuery,
} from "@mui/material";

const Desk = () => {
  const Port = process.env.REACT_APP_API_KEY;
      const userID = localStorage.getItem('userID');
  const accessToken = localStorage.getItem("token");
  const newToken = localStorage.getItem("refreshToken");
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [canView, setCanView] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const [openFollowUpModal, setOpenFollowUpModal] = useState(false);
  const [selectedCitizen, setSelectedCitizen] = useState(null);
  // console.log(selectedCitizen, "selectedCitizen");
  
  const [callStatus, setCallStatus] = useState(null);
  const [conversationalRemark, setConversationalRemark] = useState("");
  const [status, setStatus] = useState(null);
  const [followUp, setFollowUp] = useState("");

  useEffect(() => {
    const storedPermissions = localStorage.getItem("permissions");
    console.log("Stored Permissions:", storedPermissions);
    const parsedPermissions = storedPermissions
      ? JSON.parse(storedPermissions)
      : [];
    console.log("parsedPermissions Permissions:", parsedPermissions);

    const hasEditPermission = parsedPermissions.some((p) =>
      p.modules_submodule.some(
        (m) =>
          m.moduleName === "Follow-Up" &&
          m.selectedSubmodules.some((s) => s.submoduleName === "Edit"),
      ),
    );
    setCanEdit(hasEditPermission);

    const hasViewPermission = parsedPermissions.some((p) =>
      p.modules_submodule.some(
        (m) =>
          m.moduleName === "Follow-Up" &&
          m.selectedSubmodules.some((s) => s.submoduleName === "View"),
      ),
    );
    setCanView(hasViewPermission);
  }, []);

  const [followUpStatusOptions, setFollowUpStatusOptions] = useState([]);
  const [selectedFollowUpStatus, setSelectedFollowUpStatus] = useState("");
  console.log(selectedFollowUpStatus, "selectedFollowUpStatus");

  const [followUpFor, setFollowUpFor] = useState([]);
  const [selectedFollowUpFor, setSelectedFollowUpFor] = useState("");
  // const [selectedFollowUpFor, setSelectedFollowUpFor] = useState(4);

  console.log(selectedFollowUpFor, "selectedFollowUpFor");

  const [sourceName, setSourceName] = useState([]);
  const [selectedFollowUpForName, setselectedFollowUpForName] = useState("");
  const [openMenuModal, setOpenMenuModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const [showTable, setShowTable] = useState(false);
  console.log(showTable, "showTableshowTableshowTable");
  console.log("selectedFollowUpFor:", selectedFollowUpFor);
  console.log("selectedFollowUpStatus:", selectedFollowUpStatus);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // reset to first page
  };

  const fetchFollowUpFor = async () => {
    try {
      const res = await axios.get(`${Port}/Screening/followupfor_get/`);
      if (res.status === 200) {
        setFollowUpFor(res.data);
      }
    } catch (error) {
      console.error("Error fetching follow-up for:", error);
    }
  };

  useEffect(() => {
    fetchFollowUpFor();
  }, []);

  //////////// FollowUp Status
  useEffect(() => {
    const fetchFollowUpValue = async () => {
      try {
        const response = await fetch(
          `${Port}/Screening/follow_up_dropdown_list/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        if (response.ok) {
          const data = await response.json();
          setFollowUpStatusOptions(data);
        } else {
          throw new Error("Failed to fetch follow up status options");
        }
      } catch (error) {
        console.error("Error Fetching Data:", error);
      }
    };
    fetchFollowUpValue();
  }, [Port]);

  //////////// FollowUp For
  useEffect(() => {
    const fetchFollowForValue = async () => {
      try {
        const response = await fetch(`${Port}/Screening/follow_up_for/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setFollowUpFor(data);
        } else {
          throw new Error("Failed to fetch follow up status options");
        }
      } catch (error) {
        console.error("Error Fetching Data:", error);
      }
    };
    fetchFollowForValue();
  }, [Port]);

  //////////// source Name
  const [workshop, setWorkshop] = useState([]);
  const [selectedWorkshop, setSelectedWorkshop] = useState("");
  const getworkshop = async () => {
    try {
      const response = await fetch(`${Port}/Screening/Workshop_Get/`, {
        headers: {
          Authorization: `Bearer ${accessToken || newToken}`,
        },
      });
      const result = await response.json();
      setWorkshop(result || []); // ✅ FIX
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getworkshop();
  }, []);

  // Doctor List
  const [doctor, setDoctor] = useState([]);
  console.log("doctor", doctor);

  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  // Function to filter table data based on search query
  const filterTableData = (data, searchQuery, selectedFollowUpStatus) => {
    if (!data || data.length === 0) return [];

    const query = (searchQuery || "").toString().toLowerCase().trim();

    return data.filter((item) => {
      // Filter by follow-up status if selected
      if (selectedFollowUpStatus && item.follow_up !== selectedFollowUpStatus) {
        return false;
      }

      // If no search query, include all
      if (!query) return true;

      // Safely convert to string and trim for comparisons
      const citizenName = (item.citizen_name || "")
        .toString()
        .toLowerCase()
        .trim();
      const citizenId = (item.citizen_id || "").toString().toLowerCase().trim();
      const mobileNumber = (item.mobile_number || "")
        .toString()
        .toLowerCase()
        .trim();
      const doctorName = (item.doctor_name || "")
        .toString()
        .toLowerCase()
        .trim();

      return (
        citizenName.includes(query) ||
        citizenId.includes(query) ||
        mobileNumber.includes(query) ||
        doctorName.includes(query)
      );
    });
  };

  const getdoctor = async () => {
    try {
      const response = await fetch(`${Port}/Screening/Doctor_List/`, {
        headers: {
          Authorization: `Bearer ${accessToken || newToken}`,
        },
      });
      const data = await response.json();
      setDoctor(data);
      console.log(data, "123456789");
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getdoctor();
  }, []);

  const handleDoctorChange = (event) => {
    setSelectedDoctor(event.target.value);
  };
  const handleFollowUpStatusChange = (event) => {
    // store as number for reliable comparisons
    setSelectedFollowUpStatus(Number(event.target.value));
  };

  const handleFollowUpForChange = (event) => {
    setSelectedFollowUpFor(Number(event.target.value));
  };

  const handleSourceNameChange = (event) => {
    setSelectedWorkshop(event.target.value);
  };

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const handleSearch = async () => {
    const hasAnyFilter =
      Boolean(selectedFollowUpStatus) ||
      Boolean(selectedFollowUpFor) ||
      Boolean(selectedWorkshop) ||
      Boolean(selectedDoctor);

    if (!hasAnyFilter) {
      setShowTable(false); // ⛔ table hide
      setTableData([]); // ⛔ clear data

      setSnackbar({
        open: true,
        message: "Please select at least one filter",
        severity: "warning",
      });
      return; // 🔴 VERY IMPORTANT
    }

    try {
      const data = await fetchData(); // will run ONLY if filter exists
      setTableData(data || []);
      setShowTable(true);
    } catch (err) {
      console.error("Search failed:", err);
      setTableData([]);
      setShowTable(true);
    }
  };

  const [tableData, setTableData] = useState([]);
  console.log("tableData:", tableData);

  const fetchData = async () => {
    try {
      let url = `${Port}/Screening/follow_up_refer_citizen/?`;
      let queryParams = [];

      // FollowUp Status
      if (selectedFollowUpStatus) {
        queryParams.push(`follow_up=${selectedFollowUpStatus}`);
      }

      // 🔥 Followup For (DYNAMIC KEY)
      if (selectedFollowUpFor) {
        const selectedObj = followUpFor.find(
          (item) => item.followupfor_pk_id === selectedFollowUpFor,
        );

        if (selectedObj?.follow_up_for) {
          queryParams.push(`${selectedObj.follow_up_for}=1`);
        }
      }

      // Workshop
      if (selectedWorkshop) {
        queryParams.push(`workshop_id=${selectedWorkshop}`);
      }

      // Doctor
      if (selectedDoctor) {
        queryParams.push(`refer_doctor=${selectedDoctor}`);
      }

      url += queryParams.join("&");

      console.log("FINAL URL:", url);

      console.log("followUpFor options:", followUpFor);
      const tokenToUse = accessToken || newToken;
      console.log("Using token (accessToken || newToken):", !!tokenToUse);
      const response = await fetch(url, {
        headers: tokenToUse
          ? {
              Authorization: `Bearer ${tokenToUse}`,
            }
          : {},
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      console.log("FetchedData", data);
      return data || [];
    } catch (error) {
      console.error("Error Fetching Data:", error);
      throw error;
    }
  };

  const bodyCellSx = {
    color: "#000",
    fontSize: "0.85rem",
    whiteSpace: "nowrap",
    borderRight: "1px solid #e0e0e0",
  };

  const lastBodyCellSx = {
    color: "#000",
    textAlign: "center",
  };

  const handleSubmitFollowUp = async () => {
  try {
    const payload = {
      citizen_id: selectedCitizen?.citizen_pk_id,           // 👈 citizen
      screening_citizen_id: selectedCitizen?.screening_citizen_id,
      call_status:
        callStatus === 1 ? "Connected" : "Not Connected",
      conversational_remarks: conversationalRemark || "",
      visit_status:
        status === 1 ? "Visited" : status === 2 ? "Not Visited" : "",
       follow_up:
    followUp === "Follow Up Continued" ? 1 : 2, // ✅ PK only
      remark: conversationalRemark || "",
      added_by: userID, // or userID
    };

    const response = await axios.post(
      `${Port}/Screening/followup_save/${selectedCitizen.follow_up_pk_id}/`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200 || response.status === 201) {
      setSnackbar({
        open: true,
        message: "Follow up saved successfully",
        severity: "success",
      });

      setOpenFollowUpModal(false);
      handleSearch(); // 🔥 refresh table
    }
  } catch (error) {
    console.error("Follow-up save error:", error);

    setSnackbar({
      open: true,
      message: "Failed to save follow up",
      severity: "error",
    });
  }
};


  return (
    <div>
      <Box
        sx={{
          p: { xs: 1, sm: 2, md: 3 },
          m: { xs: "0 0 0 0.5em", md: "0em 0em 0 1.5em" },
        }}
      >
        {/* Filter Card */}
        <Box
          sx={{
            background: "#fff",
            color: "#000",
            borderRadius: 2,
            boxShadow: 1,
            p: { xs: 1, sm: 2 },
            m: 1,
            width: "100%",
            overflow: "hidden",
          }}
        >
          {/* Filter Card Header and Filters */}
          <Box>
            <Typography
              sx={{
                mb: 2,
                fontWeight: 600,
                fontSize: { xs: "16px", sm: "18px", md: "16px" },
                fontFamily: "Roboto, sans-serif",
                textAlign: "left",
                color: "black",
                px: 1,
                // py: 0.5,
              }}
            >
              FollowUp Desk
            </Typography>

            <Box sx={{ mb: 1 }}>
              <Grid container spacing={1} alignItems="center">
                {/* FollowUp Status */}
                <Grid item xs={12} md={2.5} sm={6}>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    label="FollowUp Status"
                    value={selectedFollowUpStatus}
                    onChange={handleFollowUpStatusChange}
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
                    {followUpStatusOptions.map((option) => (
                      <MenuItem
                        key={option.followup_pk_id}
                        value={option.followup_pk_id}
                      >
                        {option.follow_up}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* Followup For */}
                <Grid item xs={12} md={2.5} sm={6}>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    label="FollowUp For"
                    value={selectedFollowUpFor}
                    onChange={handleFollowUpForChange}
                    InputLabelProps={{
                      // shrink: Boolean(selectedFollowUpFor),   // ✅ IMPORTANT

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
                    {followUpFor.map((option) => (
                      <MenuItem
                        key={option.followupfor_pk_id}
                        value={option.followupfor_pk_id}
                      >
                        {option.follow_up_for}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* Source Name */}
                <Grid item xs={12} md={2.5} sm={6}>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    label="Workshop Name"
                    value={selectedWorkshop}
                    onChange={handleSourceNameChange}
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
                      width: "100%",
                    }}
                  >
                    <MenuItem value="" disabled>
                      Select WorkShop Name
                    </MenuItem>
                    {workshop.map((opt) => (
                      <MenuItem key={opt.ws_pk_id} value={opt.ws_pk_id}>
                        {opt.Workshop_name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} md={2.5} sm={6}>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    label="Doctor List"
                    value={selectedDoctor}
                    onChange={handleDoctorChange}
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
                    <MenuItem value="" disabled>
                      Select Doctor
                    </MenuItem>
                    {doctor.map((opt) => (
                      <MenuItem key={opt.doctor_pk_id} value={opt.doctor_pk_id}>
                        {opt.doctor_name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                {/* Search Button */}
                <Grid item xs={12} md={2} display="flex" alignItems="center">
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleSearch}
                    sx={{
                      background:
                        "linear-gradient(135deg, #2B7FFF 0%, #0092B8 100%)",
                      color: "#fff",
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #2B7FFF 0%, #0092B8 100%)",
                      },
                    }}
                  >
                    Search
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Box>

        {/* Search input moved outside filter card */}
        <Box sx={{ display: "flex", justifyContent: "flex-start", px: 1 }}>
          <TextField
            size="small"
            variant="outlined"
            placeholder="Search by Name, or doctor name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ minWidth: { xs: 160, sm: 270 } }}
          />
        </Box>

        {/* Table Card (separate from filters) */}
        <Box sx={{ mt: 2, px: 1 }}>
          <Box sx={{ borderRadius: 2, mb: 2 }}>
            {showTable && (
              <TableContainer
                sx={{
                  borderRadius: "10px",
                  overflowX: "auto", // 🔥 REQUIRED
                  overflowY: "hidden",
                }}
              >
                <Table
                  size="small"
                  sx={{
                    borderCollapse: "separate",
                    borderSpacing: "0 8px", // 👈 header & rows ke beech gap
                  }}
                >
                  <TableHead>
                    <TableRow
                      sx={{
                        background:
                          "linear-gradient(90deg, #2FB3F5 0%, #1439A4 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        height: "35px",
                        borderRadius: "20px",
                        textAlign: "center",
                      }}
                    >
                      <CardContent sx={{ flex: 0.5 }}>
                        <Typography
                          sx={{
                            fontSize: "14px",
                            fontWeight: 600,
                            fontFamily: "Roboto",
                            color: "#fff",
                            borderRight: "1px solid #e0e0e0",
                          }}
                        >
                          Sr.No
                        </Typography>
                      </CardContent>
                      <CardContent sx={{ flex: 2 }}>
                        <Typography
                          sx={{
                            fontFamily: "Roboto,sans-serif",
                            fontSize: "13px",
                            fontWeight: 550,
                            color: "#fff",
                            borderRight: "1px solid #e0e0e0",
                          }}
                        >
                          Citizen ID
                        </Typography>
                      </CardContent>
                      <CardContent sx={{ flex: 1.5 }}>
                        <Typography
                          sx={{
                            fontFamily: "Roboto,sans-serif",
                            fontSize: "13px",
                            fontWeight: 550,
                            color: "#fff",
                            whiteSpace: "nowrap",
                            borderRight: "1px solid #e0e0e0",
                          }}
                        >
                          Citizen Name
                        </Typography>
                      </CardContent>
                      <CardContent sx={{ flex: 1.5 }}>
                        <Typography
                          sx={{
                            fontFamily: "Roboto,sans-serif",
                            fontSize: "13px",
                            fontWeight: 550,
                            color: "#fff",
                            whiteSpace: "nowrap",
                            borderRight: "1px solid #e0e0e0",
                          }}
                        >
                          Doctor Name
                        </Typography>
                      </CardContent>
                      <CardContent sx={{ flex: 1.2 }}>
                        <Typography
                          sx={{
                            fontFamily: "Roboto,sans-serif",
                            fontSize: "13px",
                            fontWeight: 550,
                            color: "#fff",
                            whiteSpace: "nowrap",
                            borderRight: "1px solid #e0e0e0",
                          }}
                        >
                          Mobile Number
                        </Typography>
                      </CardContent>
                      <CardContent sx={{ flex: 1 }}>
                        <Typography
                          sx={{
                            fontFamily: "Roboto,sans-serif",
                            fontSize: "13px",
                            fontWeight: 550,
                            color: "#fff",
                            whiteSpace: "nowrap",
                            borderRight: "1px solid #e0e0e0",
                          }}
                        >
                          DOB
                        </Typography>
                      </CardContent>
                      <CardContent sx={{ flex: 1 }}>
                        <Typography
                          sx={{
                            fontFamily: "Roboto,sans-serif",
                            fontSize: "13px",
                            fontWeight: 550,
                            color: "#fff",
                            whiteSpace: "nowrap",
                            borderRight: "1px solid #e0e0e0",
                          }}
                        >
                          Blood Group
                        </Typography>
                      </CardContent>
                      <CardContent sx={{ flex: 0.5, textAlign: "center" }}>
                        <Typography
                          sx={{
                            fontSize: "15px",
                            fontWeight: 600,
                            fontFamily: "Roboto",
                            color: "#fff",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Action
                        </Typography>
                      </CardContent>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {(() => {
                      // 1️⃣ Filter the data first
                      const filteredData = filterTableData(
                        tableData,
                        searchQuery,
                        selectedFollowUpStatus,
                      );

                      // 2️⃣ Apply pagination (slice based on page and rowsPerPage)
                      const paginatedData = filteredData.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage,
                      );

                      // 3️⃣ Check if there’s data to display
                      if (paginatedData.length === 0) {
                        return (
                          <TableRow>
                            <TableCell align="center">
                              <Typography>No records found</Typography>
                            </TableCell>
                          </TableRow>
                        );
                      }

                      // 4️⃣ Render paginated data
                      return paginatedData.map((item, index) => (
                        <TableRow
                          key={item.follow_up_pk_id}
                          sx={{
                            backgroundColor: "#fff",
                            "&:hover": { backgroundColor: "#f9f9f9" },
                          }}
                        >
                          <TableCell>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                px: 1,
                                textAlign: "center",
                              }}
                            >
                              <Typography
                                sx={{
                                  flex: 0.5,
                                  fontSize: "14px",
                                  fontFamily: "Roboto, sans-serif",
                                  fontWeight: 500,
                                  textAlign: "center",
                                }}
                              >
                                {/* Correct serial number across pages */}
                                {page * rowsPerPage + index + 1}
                              </Typography>

                              <Typography
                                sx={{
                                  flex: 2,
                                  fontSize: "14px",
                                  fontFamily: "Roboto, sans-serif",
                                  fontWeight: 500,
                                  textAlign: "center",
                                }}
                              >
                                {item.citizen_id}
                              </Typography>

                              <Typography
                                sx={{
                                  flex: 1.5,
                                  fontSize: "14px",
                                  fontFamily: "Roboto, sans-serif",
                                  fontWeight: 500,
                                  textAlign: "center",
                                }}
                              >
                                {item.citizen_name}
                              </Typography>

                              <Typography
                                sx={{
                                  flex: 1.5,
                                  fontSize: "14px",
                                  fontFamily: "Roboto, sans-serif",
                                  fontWeight: 500,
                                  textAlign: "center",
                                }}
                              >
                                {item.doctor_name || "N/A"}
                              </Typography>

                              <Typography
                                sx={{
                                  flex: 1.2,
                                  fontSize: "14px",
                                  fontFamily: "Roboto, sans-serif",
                                  fontWeight: 500,
                                  textAlign: "center",
                                }}
                              >
                                {item.mobile_number}
                              </Typography>

                              <Typography
                                sx={{
                                  flex: 1.2,
                                  fontSize: "14px",
                                  fontFamily: "Roboto, sans-serif",
                                  fontWeight: 500,
                                  textAlign: "center",
                                }}
                              >
                                {item.dob || "N/A"}
                              </Typography>

                              <Typography
                                sx={{
                                  flex: 1.2,
                                  fontSize: "14px",
                                  fontFamily: "Roboto, sans-serif",
                                  fontWeight: 500,
                                  textAlign: "center",
                                }}
                              >
                                {item.blood_group || "N/A"}
                              </Typography>

                              <Box
                                sx={{
                                  flex: 0.5,
                                  textAlign: "center",
                                  fontSize: "14px",
                                  fontFamily: "Roboto, sans-serif",
                                  fontWeight: 500,
                                }}
                              >
                                {canView && (
                                  // <IconButton
                                  //   component={Link}
                                  //   to={`/mainscreen/Follow-Up/viewFollowup/${item.citizen_id}`}
                                  //   size="small"
                                  // >
                                  <IconButton
                                    size="small"
                                    onClick={() => {
                                      setSelectedCitizen(item);
                                      setOpenFollowUpModal(true);
                                    }}
                                  >
                                    <RemoveRedEyeOutlinedIcon
                                      sx={{ color: "#000" }}
                                    />
                                  </IconButton>
                                )}
                              </Box>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ));
                    })()}
                  </TableBody>
                </Table>

                <TablePagination
                  component="div"
                  count={
                    filterTableData(
                      tableData,
                      searchQuery,
                      selectedFollowUpStatus,
                    ).length
                  } // filtered total
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  rowsPerPageOptions={[5, 25, 50]}
                  labelDisplayedRows={({ from, to, count }) =>
                    `${from}–${to}  (Page ${page + 1})`
                  }
                  sx={{
                    "& .MuiTablePagination-toolbar": {
                      flexWrap: { xs: "wrap", sm: "nowrap" },
                    },
                    "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
                      {
                        fontSize: "0.875rem",
                      },
                    "& .MuiTablePagination-select": {
                      minWidth: "60px",
                    },
                  }}
                />
              </TableContainer>
            )}
          </Box>

          <Dialog
            open={openFollowUpModal}
            fullWidth
            maxWidth="md"
            fullScreen={fullScreen}
            disableEnforceFocus
            disableAutoFocus
            disableRestoreFocus
          >
            {/* HEADER */}
            <DialogTitle sx={{ background: "linear-gradient(90deg, #2FB3F5 0%, #1439A4 100%)",
color: "#fff" }}>
  <Typography sx={{ fontWeight: 600,fontSize: "15px", fontFamily: "Roboto, sans-serif" }}>
              Add Follow Up Details

  </Typography>
            </DialogTitle>

            <DialogContent sx={{ mt: 2 }}>
              {/* CITIZEN DETAILS */}
              <Box sx={{                 background: "linear-gradient(90deg, #2FB3F5 0%, #1439A4 100%)",
 color: "#fff", p: 2, mb: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography sx={{ fontWeight: 500,fontSize: "15px", fontFamily: "Roboto, sans-serif" }}>
                      Citizen ID: {selectedCitizen?.citizen_id}
                    </Typography>
                    <Typography sx={{ fontWeight: 500,fontSize: "15px", fontFamily: "Roboto, sans-serif" }}>
                      Name: {selectedCitizen?.citizen_name}
                    </Typography>
                    <Typography sx={{ fontWeight: 500,fontSize: "15px", fontFamily: "Roboto, sans-serif" }}>
                      DOB: {selectedCitizen?.dob || "N/A"}
                    </Typography>
                    <Typography sx={{ fontWeight: 500,fontSize: "15px", fontFamily: "Roboto, sans-serif" }}>
                      District: {selectedCitizen?.district}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography sx={{ fontWeight: 500,fontSize: "15px", fontFamily: "Roboto, sans-serif" }}>
                      Screening Count: {selectedCitizen?.screening_count}
                    </Typography>
                    <Typography sx={{ fontWeight: 500,fontSize: "15px", fontFamily: "Roboto, sans-serif" }}>
                      Mobile: {selectedCitizen?.mobile_number}
                    </Typography>
                    <Typography sx={{ fontWeight: 500,fontSize: "15px", fontFamily: "Roboto, sans-serif" }}>
                      State: {selectedCitizen?.state}
                    </Typography>
                    <Typography sx={{ fontWeight: 500,fontSize: "15px", fontFamily: "Roboto, sans-serif" }}>
                      Tehsil: {selectedCitizen?.tehsil}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>

              <Typography fontWeight={600} mb={1}>
                Conversation Status
              </Typography>

              <Grid container spacing={2}>
                {/* CALL STATUS */}
                <Grid item xs={12} md={4}>
                  <TextField
                    select
                    size="small"
                    fullWidth
                    label="Call Status"
                    value={callStatus}
                    onChange={(e) => setCallStatus(e.target.value)}
                    sx={{
                      color: "#000",
                      "& .MuiSelect-select": { color: "#000 !important" },
                    }}
                  >
                    <MenuItem value={1}>Connected</MenuItem>
                    <MenuItem value={2}>Not Connected</MenuItem>
                  </TextField>
                </Grid>

                {/* CONNECTED FLOW */}
                {/* {callStatus === 1 && ( */}
                  <>
                    <Grid item xs={12} md={4}>
                      <TextField
                        select
                        size="small"
                        fullWidth
                        label="Conversational Remarks"
                        value={conversationalRemark}
                        onChange={(e) =>
                          setConversationalRemark(e.target.value)
                        }
                        sx={{
                          color: "#000",
                          "& .MuiSelect-select": { color: "#000 !important" },
                        }}
                      >
                        <MenuItem value="Answered">Answered</MenuItem>
                        <MenuItem value="Reschedule Call">
                          Reschedule Call
                        </MenuItem>
                      </TextField>
                    </Grid>

                    {/* ANSWERED */}
                    {conversationalRemark === "Answered" && (
                      <>
                        <Grid item xs={12} md={4}>
                          <TextField
                            select
                            size="small"
                            fullWidth
                            label="Status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            sx={{
                              color: "#000",
                              "& .MuiSelect-select": {
                                color: "#000 !important",
                              },
                            }}
                          >
                            <MenuItem value={1}>Visited</MenuItem>
                            <MenuItem value={2}>Not Visited</MenuItem>
                          </TextField>
                        </Grid>

                        {/* VISITED */}
                        {status === 1 && (
                          <>
                            {[
                              "Condition Improved",
                              "Weight Gain Status",
                              "Forward To",
                              "Priority",
                            ].map((label) => (
                              <Grid item xs={12} md={3} key={label}>
                                <Typography>{label}</Typography>
                                <RadioGroup row>
                                  <FormControlLabel
                                    value="Yes"
                                    control={<Radio />}
                                    label="Yes"
                                  />
                                  <FormControlLabel
                                    value="No"
                                    control={<Radio />}
                                    label="No"
                                  />
                                </RadioGroup>
                              </Grid>
                            ))}

                            <Grid item xs={12} md={4}>
                              <TextField
                                label="Visited"
                                select
                                size="small"
                                fullWidth
                                sx={{
                                  color: "#000",
                                  "& .MuiSelect-select": {
                                    color: "#000 !important",
                                  },
                                }}
                              >
                                <MenuItem value="DOA">DOA</MenuItem>
                              </TextField>
                            </Grid>
                          </>
                        )}

                        {/* NOT VISITED */}
                        {status === 2 && (
                          <>
                            {[
                              "Condition Improved",
                              "Weight Gain Status",
                              "Forward To",
                              "Priority",
                            ].map((label) => (
                              <Grid item xs={12} md={3} key={label}>
                                <Typography>{label}</Typography>
                                <RadioGroup row>
                                  <FormControlLabel
                                    value="Yes"
                                    control={<Radio />}
                                    label="Yes"
                                  />
                                  <FormControlLabel
                                    value="No"
                                    control={<Radio />}
                                    label="No"
                                  />
                                </RadioGroup>
                              </Grid>
                            ))} 
                          <Grid item xs={12} md={4}>
                            <TextField
                              label="Not Visited Reason"
                              select
                              size="small"
                              fullWidth
                              sx={{
                                color: "#000",
                                "& .MuiSelect-select": {
                                  color: "#000 !important",
                                },
                              }}
                            >
                              <MenuItem value="Reschedule Call">
                                Reschedule Call
                              </MenuItem>
                            </TextField>
                          </Grid>
                          </>
                        )}
                      </>
                 )} 

                    {/* RESCHEDULE */}
                    {conversationalRemark === "Reschedule Call" && (
                      <Grid item xs={12} md={4}>
                        <TextField
                          type="datetime-local"
                          label="Schedule Date"
                          InputLabelProps={{ shrink: true }}
                          fullWidth
                          size="small"
                          sx={{
                            color: "#000",
                            "& .MuiSelect-select": { color: "#000 !important" },
                          }}
                        />
                      </Grid>
                    )} 
                  </>
                {/* // )} */}

                {/* NOT CONNECTED FLOW */}
                {callStatus === 2 && (
                  <Grid item xs={12} md={4}>
                    <TextField
                      label="Not Connected Reason"
                      select
                      size="small"
                      fullWidth
                      sx={{
                        color: "#000",
                        "& .MuiSelect-select": { color: "#000 !important" },
                      }}
                    >
                      <MenuItem value={1}>Answered</MenuItem>
                      <MenuItem value={2}>Not Answered</MenuItem>
                      <MenuItem value={3}>Not Reachable</MenuItem>
                      <MenuItem value={4}>Out of Network</MenuItem>
                    </TextField>
                  </Grid>
                )}

                {/* FOLLOW UP (COMMON) */}
                {callStatus && (
                  <>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        size="small"
                        select
                        label="Follow Up"
                        value={followUp}
                        onChange={(e) => setFollowUp(e.target.value)}
                        sx={{
                          color: "#000",
                          "& .MuiSelect-select": { color: "#000 !important" },
                        }}
                      >
                        <MenuItem value="Reschedule Call">
                          Reschedule Call
                        </MenuItem>
                        <MenuItem value="Follow Up Closed">
                          Follow Up Closed
                        </MenuItem>
                        <MenuItem value="Follow Up Continued">
                          Follow Up Continued
                        </MenuItem>
                      </TextField>
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Remark"
                        sx={{
                          color: "#000",
                          "& .MuiSelect-select": { color: "#000 !important" },
                        }}
                      />
                    </Grid>
                  </>
                )}
              </Grid>
            </DialogContent>

            <DialogActions>
              <Button onClick={() => setOpenFollowUpModal(false)}>
                Cancel
              </Button>
              <Button variant="contained"
                  onClick={handleSubmitFollowUp}
             >Submit</Button>
            </DialogActions>
          </Dialog>

          
          {/* ---------------------------------------------- */}
          <Dialog
            open={openMenuModal}
            onClose={() => setOpenMenuModal(false)}
            fullWidth
            maxWidth="xs"
          >
            <DialogTitle>Actions</DialogTitle>

            <DialogContent>
              <Typography>Citizen Name: {selectedRow?.citizen_name}</Typography>
              <Typography>Citizen ID: {selectedRow?.citizen_id}</Typography>
            </DialogContent>

            <DialogActions>
              <Button onClick={() => setOpenMenuModal(false)}>Close</Button>
            </DialogActions>
          </Dialog>

          {/* )} */}
          {/* {canView && ( */}

          {/* // )}  */}
        </Box>
      </Box>
    </div>
  );
};

export default Desk;
