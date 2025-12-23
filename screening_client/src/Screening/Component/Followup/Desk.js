import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import "./Desk.css";
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
} from "@mui/material";

const Desk = () => {
  const Port = process.env.REACT_APP_API_KEY;
  const accessToken = localStorage.getItem("token");
  const newToken = localStorage.getItem("refreshToken");

  const [canView, setCanView] = useState(false);
  const [canEdit, setCanEdit] = useState(false);

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
          m.selectedSubmodules.some((s) => s.submoduleName === "Edit")
      )
    );
    setCanEdit(hasEditPermission);

    const hasViewPermission = parsedPermissions.some((p) =>
      p.modules_submodule.some(
        (m) =>
          m.moduleName === "Follow-Up" &&
          m.selectedSubmodules.some((s) => s.submoduleName === "View")
      )
    );
    setCanView(hasViewPermission);
  }, []);

  const [followUpStatusOptions, setFollowUpStatusOptions] = useState([]);
  const [selectedFollowUpStatus, setSelectedFollowUpStatus] = useState("");
  console.log(selectedFollowUpStatus, "selectedFollowUpStatus");

  const [followUpFor, setFollowUpFor] = useState([]);
  const [selectedFollowUpFor, setSelectedFollowUpFor] = useState(4);
  console.log(selectedFollowUpFor, "selectedFollowUpFor");

  const [sourceName, setSourceName] = useState([]);
  const [selectedFollowUpForName, setselectedFollowUpForName] = useState("");

  const [showTable, setShowTable] = useState(false);
  console.log(showTable, "showTableshowTableshowTable");
  console.log("selectedFollowUpFor:", selectedFollowUpFor);
  console.log("selectedFollowUpStatus:", selectedFollowUpStatus);

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
          }
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
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const getworkshop = async () => {
    try {
      const response = await fetch(`${Port}/Screening/Workshop_Get/`, {
        headers: {
          Authorization: `Bearer ${accessToken || newToken}`,
        },
      });
      const data = await response.json();
      setWorkshop(data);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getworkshop();
  }, []);

  // Doctor List
  const [doctor, setDoctor] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
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
          (item) => item.followupfor_pk_id === selectedFollowUpFor
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

  return (
    <div>
      <Box sx={{ p: 2, m: "0em 0em 0 2em" }}>
        <Box
          className="card deskcard m-2"
          style={{
            background: "#fff",
            color: "white",
          }}
        >
          <div class="row">
            <div class="col">
              <h5
                className="desktitle"
                style={{
                  color: "black",
                  fontWeight: "550",
                  fontFamily: "Roboto",
                }}
              >
                FollowUp Desk
              </h5>
            </div>
          </div>

          <Box className="dropdowndesk">
            <Grid container spacing={1} alignItems="center">
              {/* FollowUp Status */}
              <Grid item xs={12} md={2}>
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
              <Grid item xs={12} md={2}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Followup For"
                  value={selectedFollowUpFor}
                  onChange={handleFollowUpForChange}
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
              <Grid item xs={12} md={3}>
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

              <Grid item xs={12} md={2}>
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
              <Grid item xs={12} md={3} display="flex" alignItems="center">
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

          <div className="row inputdeskkk">
            <div className="ml-2 d-flex justify-content-end">
              <input
                className="form-control form-control-sm"
                placeholder="Search"
              />
            </div>
          </div>

          <div>
            {showTable && (
              <TableContainer
                sx={{ borderRadius: "10px", overflow: "hidden", mt: 0.7 }}
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
                        height: "40px",
                        borderRadius: "20px",
                        textAlign: "center",
                      }}
                    >
                      <CardContent
                        sx={{ flex: 0.5, borderRight: "1px solid #e0e0e0" }}
                      >
                        <Typography
                          sx={{
                            fontSize: "14px",
                            fontWeight: 600,
                            fontFamily: "Roboto",
                            color: "#fff",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Sr.No
                        </Typography>
                      </CardContent>
                      <CardContent sx={{ flex: 2 ,borderRight: "1px solid #e0e0e0"}}>
                        <Typography
                          sx={{
                            fontSize: "14px",
                            fontWeight: 600,
                            fontFamily: "Roboto",
                            color: "#fff",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Citizen ID
                        </Typography>
                      </CardContent>
                      <CardContent sx={{ flex: 1.5 ,borderRight: "1px solid #e0e0e0"}}>
                        <Typography
                          sx={{
                            fontSize: "14px",
                            fontWeight: 600,
                            fontFamily: "Roboto",
                            color: "#fff",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Citizen Name
                        </Typography>
                      </CardContent>
                      <CardContent sx={{ flex: 1.5 ,borderRight: "1px solid #e0e0e0"}}>
                        <Typography
                          sx={{
                            fontSize: "14px",
                            fontWeight: 600,
                            fontFamily: "Roboto",
                            color: "#fff",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Doctor Name
                        </Typography>
                      </CardContent>
                      <CardContent sx={{ flex: 1 ,borderRight: "1px solid #e0e0e0"}}>
                        <Typography
                          sx={{
                            fontSize: "14px",
                            fontWeight: 600,
                            fontFamily: "Roboto",
                            color: "#fff",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Mobile Number
                        </Typography>
                      </CardContent>
                      <CardContent sx={{ flex: 1 ,borderRight: "1px solid #e0e0e0"}}>
                        <Typography
                          sx={{
                            fontSize: "14px",
                            fontWeight: 600,
                            fontFamily: "Roboto",
                            color: "#fff",
                            whiteSpace: "nowrap",
                          }}
                        >
                          DOB
                        </Typography>
                      </CardContent>
                      <CardContent sx={{ flex: 1 ,borderRight: "1px solid #e0e0e0" }}>
                        <Typography
                          sx={{
                            fontSize: "14px",
                            fontWeight: 600,
                            fontFamily: "Roboto",
                            color: "#fff",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Blood Group
                        </Typography>
                      </CardContent>
                      <CardContent sx={{ flex: 0.5, textAlign: "center" }}>
                        <Typography>Action</Typography>
                      </CardContent>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {tableData && tableData.length > 0 ? (
                      tableData
                        .filter((item) => {
                          if (!selectedFollowUpStatus) return true;
                          return item.follow_up === selectedFollowUpStatus;
                        })
                        .map((item, index) => (
                          <TableRow
                            key={item.follow_up_pk_id}
                            sx={{
                              backgroundColor: "#fff",
                              "&:hover": { backgroundColor: "#f9f9f9" },
                            }}
                          >
                            {/* 🔹 SINGLE TABLE CELL */}
                            <TableCell  sx={{ p: 0 ,py:1}}>
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
                                  sx={{ flex: 0.5, fontSize: "0.8rem" }}
                                >
                                  {index + 1}
                                </Typography>

                                <Typography
                                  sx={{ flex: 2, fontSize: "0.8rem" }}
                                >
                                  {item.citizen_id}
                                </Typography>

                                <Typography
                                  sx={{ flex: 1.5, fontSize: "0.8rem" }}
                                >
                                  {item.citizen_name}
                                </Typography>

                                <Typography
                                  sx={{ flex: 1.5, fontSize: "0.8rem" }}
                                >
                                  {item.doctor_name || "N/A"}
                                </Typography>

                                <Typography
                                  sx={{ flex: 1.2, fontSize: "0.8rem" }}
                                >
                                  {item.mobile_number}
                                </Typography>

                                <Typography
                                  sx={{ flex: 1.2, fontSize: "0.8rem" }}
                                >
                                  {item.dob || "N/A"}
                                </Typography>

                                <Typography
                                  sx={{ flex: 1.2, fontSize: "0.8rem" }}
                                >
                                  {item.blood_group || "N/A"}
                                </Typography>

                                <Box sx={{ flex: 0.5, textAlign: "center" }}>
                                  {canView && (
                                    <IconButton
                                      component={Link}
                                      to={`/mainscreen/Follow-Up/viewFollowup/${item.citizen_id}`}
                                      size="small"
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
                        ))
                    ) : (
                      <TableRow>
                        <TableCell align="center">
                          <Typography>No records found</Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </div>
          {/* )} */}
          {/* {canView && ( */}

          {/* // )}  */}
        </Box>
      </Box>
    </div>
    // </div>
  );
};

export default Desk;
