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
  const [selectedFollowUpFor, setSelectedFollowUpFor] = useState("");

  const [sourceName, setSourceName] = useState([]);
  const [selectedFollowUpForName, setselectedFollowUpForName] = useState("");

  const [showTable, setShowTable] = useState(false);
  console.log(selectedFollowUpFor, "jjjjjjjjjjjjjjjjjjjjjjjj");
  console.log(selectedFollowUpForName, "nnnnnnnnnnnnnnnnnnnnnnnn");
  console.log(selectedFollowUpStatus, "kkkkkkkkkkkkkkkkkkkkkkk");

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
  const handleFollowUpStatusChange = (event) => {
    setSelectedFollowUpStatus(event.target.value);
  };

  const handleFollowUpForChange = (event) => {
    setSelectedFollowUpFor(event.target.value);
  };

  const handleSourceNameChange = (event) => {
    setSelectedWorkshop(event.target.value);
  };

  const handleSearch = () => {
    setShowTable(true); // Show the table
    fetchData();
  };

  const [tableData, setTableData] = useState([]);

  const fetchData = async () => {
    try {
      let url = `${Port}/Screening/follow-up/`;

      if (selectedFollowUpStatus) {
        url += `${selectedFollowUpStatus}/`;
      }

      if (selectedFollowUpFor) {
        url += `${selectedFollowUpFor}/`;
      }

      if (selectedWorkshop) {
        url += `${selectedWorkshop}/`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setTableData(data);
      } else {
        throw new Error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error Fetching Data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedFollowUpStatus, selectedFollowUpFor, selectedFollowUpForName]);

  return (
    <div>
      <div className="content-wrapper" style={{ marginTop: "1em" }}>
        <div
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
            <Grid container spacing={2}>
              {/* FollowUp Status */}
              <Grid item xs={12} md={3}>
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
              <Grid item xs={12} md={3}>
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
                  label="Source Name"
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
                  }}
                >
                  <MenuItem value="">Select Source Name</MenuItem>
                  {workshop.map((opt) => (
                    <MenuItem key={opt.ws_pk_id} value={opt.ws_pk_id}>
                      {opt.Workshop_name}
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

          {/* <div className="row table-container tabledatadesk"> */}
          {showTable && (
            <div>
              {selectedFollowUpStatus === 1 && (
                <Box mt={2}>
                  {/* =============== FOLLOWUP FOR = 4 =============== */}
                  {selectedFollowUpFor === 4 && (
                    <TableContainer
                      component={Paper}
                      sx={{ backgroundColor: "#313774" }}
                    >
                      <Table size="small">
                        <TableHead>
                          <TableRow
                            sx={{
                              background:
                                "linear-gradient(90deg, #2FB3F5 0%, #1439A4 100%)",
                            }}
                          >
                            {[
                              "Sr No.",
                              "Citizen ID",
                              "Screening ID",
                              "Citizen Name",
                              "Vital",
                              "Basic Screening",
                              "Auditory",
                              "Dental",
                              "Vision",
                              "Psychological",
                              "Action",
                            ].map((col, i) => (
                              <TableCell
                                key={i}
                                sx={{
                                  color: "#ffffff",
                                  fontWeight: 600,
                                  fontSize: "14px",
                                }}
                              >
                                {col}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>

                        <TableBody>
                          {tableData.map((item, index) => (
                            <TableRow
                              key={index}
                              sx={{
                                backgroundColor: "#3E4C8F",
                                "&:hover": { backgroundColor: "#4c5bb0" },
                              }}
                            >
                              <TableCell sx={{ color: "white" }}>
                                {index + 1}
                              </TableCell>
                              <TableCell sx={{ color: "white" }}>
                                {item.citizen_id}
                              </TableCell>
                              <TableCell sx={{ color: "white" }}>
                                {item.schedule_id}
                              </TableCell>
                              <TableCell sx={{ color: "white" }}>
                                {item.citizen_name}
                              </TableCell>
                              <TableCell sx={{ color: "white" }}>
                                {item.vital_refer === 1 ? "Yes" : "No"}
                              </TableCell>
                              <TableCell sx={{ color: "white" }}>
                                {item.basic_screening_refer === 1
                                  ? "Yes"
                                  : "No"}
                              </TableCell>
                              <TableCell sx={{ color: "white" }}>
                                {item.auditory_refer === 1 ? "Yes" : "No"}
                              </TableCell>
                              <TableCell sx={{ color: "white" }}>
                                {item.dental_refer === 1 ? "Yes" : "No"}
                              </TableCell>
                              <TableCell sx={{ color: "white" }}>
                                {item.vision_refer === 1 ? "Yes" : "No"}
                              </TableCell>
                              <TableCell sx={{ color: "white" }}>
                                {item.pycho_refer === 1 ? "Yes" : "No"}
                              </TableCell>

                              <TableCell sx={{ color: "white" }}>
                                {canView && (
                                  <Link
                                    to={`/mainscreen/Follow-Up/viewFollowup/${item.citizen_id}/`}
                                  >
                                    <RemoveRedEyeOutlinedIcon
                                      sx={{ color: "white", cursor: "pointer" }}
                                    />
                                  </Link>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}

                  {/* =============== FOLLOWUP FOR = 1 (SAM) =============== */}
                  {selectedFollowUpFor === 1 && (
                    <TableContainer
                      component={Paper}
                      sx={{ backgroundColor: "#313774" }}
                    >
                      <Table size="small">
                        <TableHead>
                          <TableRow
                            sx={{
                              background:
                                "linear-gradient(90deg, #2FB3F5 0%, #1439A4 100%)",
                            }}
                          >
                            {[
                              "Sr No.",
                              "Citizen ID",
                              "Screening ID",
                              "Citizen Name",
                              "SAM",
                              "Action",
                            ].map((col, i) => (
                              <TableCell
                                key={i}
                                sx={{
                                  color: "white",
                                  fontWeight: 600,
                                  fontSize: "14px",
                                }}
                              >
                                {col}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>

                        <TableBody>
                          {tableData.map((item, index) => (
                            <TableRow
                              key={index}
                              sx={{
                                backgroundColor: "#3E4C8F",
                                "&:hover": { backgroundColor: "#4c5bb0" },
                              }}
                            >
                              <TableCell sx={{ color: "white" }}>
                                {index + 1}
                              </TableCell>
                              <TableCell sx={{ color: "white" }}>
                                {item.citizen_id}
                              </TableCell>
                              <TableCell sx={{ color: "white" }}>
                                {item.schedule_id}
                              </TableCell>
                              <TableCell sx={{ color: "white" }}>
                                {item.citizen_name}
                              </TableCell>
                              <TableCell sx={{ color: "white" }}>SAM</TableCell>
                              <TableCell sx={{ color: "white" }}>
                                {canView && (
                                  <Link
                                    to={`/mainscreen/Follow-Up/viewFollowup/${item.citizen_id}/`}
                                  >
                                    <RemoveRedEyeOutlinedIcon
                                      sx={{ color: "white", cursor: "pointer" }}
                                    />
                                  </Link>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}

                  {/* =============== FOLLOWUP FOR = 2 (MAM) =============== */}
                  {selectedFollowUpFor === 2 && (
                    <TableContainer
                      component={Paper}
                      sx={{
                        background:
                          "linear-gradient(90deg, #2FB3F5 0%, #1439A4 100%)",
                      }}
                    >
                      <Table size="small">
                        <TableHead>
                          <TableRow
                            sx={{
                              backgroundColor:
                                "linear-gradient(90deg, #2FB3F5 0%, #1439A4 100%)",
                            }}
                          >
                            {[
                              "Sr No.",
                              "Citizen ID",
                              "Screening ID",
                              "Citizen Name",
                              "MAM",
                              "Action",
                            ].map((col, i) => (
                              <TableCell
                                key={i}
                                sx={{
                                  color: "white",
                                  fontWeight: 600,
                                  fontSize: "14px",
                                }}
                              >
                                {col}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>

                        <TableBody>
                          {tableData.map((item, index) => (
                            <TableRow
                              key={index}
                              sx={{
                                backgroundColor: "#ffffff",
                                "&:hover": { backgroundColor: "#ffffff" },
                              }}
                            >
                              <TableCell sx={{ color: "white" }}>
                                {index + 1}
                              </TableCell>
                              <TableCell sx={{ color: "white" }}>
                                {item.childId}
                              </TableCell>
                              <TableCell sx={{ color: "white" }}>
                                {item.screeningId}
                              </TableCell>
                              <TableCell sx={{ color: "white" }}>
                                {item.citizenName}
                              </TableCell>
                              <TableCell sx={{ color: "white" }}>MAM</TableCell>
                              <TableCell sx={{ color: "white" }}>
                                {canView && (
                                  <Link
                                    to={`/mainscreen/Follow-Up/viewFollowup/${item.citizen_id}/`}
                                  >
                                    <RemoveRedEyeOutlinedIcon
                                      sx={{ color: "white", cursor: "pointer" }}
                                    />
                                  </Link>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </Box>
              )}

              {selectedFollowUpStatus === 3 && (
                <>
                  {/* -------------------- SAM -------------------- */}
                  {selectedFollowUpFor === 1 && (
                    <TableContainer
                      elevation={1}
                      sx={{
                        borderRadius: "10px",
                        background:
                          "linear-gradient(90deg, #2FB3F5 0%, #1439A4 100%)", // gradient background
                        overflow: "hidden",
                      }}
                    >
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell
                              sx={{
                                fontWeight: "bold",
                                color: "#fff",
                                // width: "80px",
                              }}
                            >
                              Sr No.
                            </TableCell>
                            <TableCell
                              sx={{ fontWeight: "bold", color: "#fff" }}
                            >
                              Citizen ID
                            </TableCell>
                            <TableCell
                              sx={{ fontWeight: "bold", color: "#fff" }}
                            >
                              Screening ID
                            </TableCell>
                            <TableCell
                              sx={{ fontWeight: "bold", color: "#fff" }}
                            >
                              Citizen Name
                            </TableCell>
                            <TableCell
                              sx={{ fontWeight: "bold", color: "#fff" }}
                            >
                              SAM
                            </TableCell>
                            <TableCell
                              sx={{ fontWeight: "bold", color: "#fff" }}
                            >
                              Action
                            </TableCell>
                          </TableRow>
                        </TableHead>

                        <TableBody>
                          {tableData?.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>{item.citizen_id}</TableCell>
                              <TableCell>{item.schedule_id}</TableCell>
                              <TableCell>{item.citizen_name}</TableCell>
                              <TableCell>
                                {item.weight_for_height === "SAM"
                                  ? "Yes"
                                  : "No"}
                              </TableCell>
                              <TableCell>
                                {canEdit && (
                                  <IconButton
                                    component={Link}
                                    to={`/mainscreen/Follow-Up/addFollowup/${item.citizen_id}/${item.schedule_id}/${item.follow_up_ctzn_pk}`}
                                  >
                                    <AddIcon sx={{ color: "#313774" }} />
                                  </IconButton>
                                )}
                                {canView && (
                                  <IconButton
                                    component={Link}
                                    to={`/mainscreen/Follow-Up/viewFollowup/${item.citizen_id}/`}
                                  >
                                    <RemoveRedEyeOutlinedIcon
                                      sx={{ color: "#313774" }}
                                    />
                                  </IconButton>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}

                  {/* -------------------- MAM -------------------- */}
                  {selectedFollowUpFor === 2 && (
                    <TableContainer
                      component={Paper}
                      elevation={1}
                      sx={{ borderRadius: "10px", overflow: "hidden", mt: 1 }}
                    >
                      <Table size="small">
                        <TableHead>
                          <TableRow
                            sx={{
                              background:
                                "linear-gradient(90deg, #2FB3F5 0%, #1439A4 100%)",
                            }}
                          >
                            <TableCell
                              sx={{
                                fontWeight: "bold",
                                // width: "80px",
                                color: "#fff",
                              }}
                            >
                              Sr No.
                            </TableCell>
                            <TableCell
                              sx={{ fontWeight: "bold", color: "#fff" }}
                            >
                              Citizen ID
                            </TableCell>
                            <TableCell
                              sx={{ fontWeight: "bold", color: "#fff" }}
                            >
                              Screening ID
                            </TableCell>
                            <TableCell
                              sx={{ fontWeight: "bold", color: "#fff" }}
                            >
                              Citizen Name
                            </TableCell>
                            <TableCell
                              sx={{ fontWeight: "bold", color: "#fff" }}
                            >
                              MAM
                            </TableCell>
                            <TableCell
                              sx={{ fontWeight: "bold", color: "#fff" }}
                            >
                              Action
                            </TableCell>
                          </TableRow>
                        </TableHead>

                        <TableBody>
                          {tableData?.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>{item.citizen_id}</TableCell>
                              <TableCell>{item.schedule_id}</TableCell>
                              <TableCell>{item.citizen_name}</TableCell>
                              <TableCell>
                                {item.weight_for_height === "MAM"
                                  ? "Yes"
                                  : "No"}
                              </TableCell>
                              <TableCell>
                                {canEdit && (
                                  <IconButton
                                    component={Link}
                                    to={`/mainscreen/Follow-Up/addFollowup/${item.citizen_id}/${item.schedule_id}/${item.follow_up_ctzn_pk}`}
                                  >
                                    <AddIcon sx={{ color: "#313774" }} />
                                  </IconButton>
                                )}
                                {canView && (
                                  <IconButton
                                    component={Link}
                                    to={`/mainscreen/Follow-Up/viewFollowup/${item.citizen_id}/`}
                                  >
                                    <RemoveRedEyeOutlinedIcon
                                      sx={{ color: "#313774" }}
                                    />
                                  </IconButton>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}

                  {/* -------------------- Full Screening -------------------- */}
                  {selectedFollowUpFor === 4 && (
                    <TableContainer
                      component={Paper}
                      elevation={1}
                      sx={{
                        borderRadius: "10px",
                        overflow: "hidden",
                        mt: 1,
                        background:
                          "linear-gradient(90deg, #2FB3F5 0%, #1439A4 100%)",
                      }}
                    >
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell
                              sx={{ fontWeight: "bold", color: "#fff" }}
                            >
                              Sr No.
                            </TableCell>
                            <TableCell
                              sx={{ fontWeight: "bold", color: "#fff" }}
                            >
                              Citizen ID
                            </TableCell>
                            <TableCell
                              sx={{ fontWeight: "bold", color: "#fff" }}
                            >
                              Screening ID
                            </TableCell>
                            <TableCell
                              sx={{ fontWeight: "bold", color: "#fff" }}
                            >
                              Citizen Name
                            </TableCell>
                            <TableCell
                              sx={{ fontWeight: "bold", color: "#fff" }}
                            >
                              Vital
                            </TableCell>
                            <TableCell
                              sx={{ fontWeight: "bold", color: "#fff" }}
                            >
                              Basic Screening
                            </TableCell>
                            <TableCell
                              sx={{ fontWeight: "bold", color: "#fff" }}
                            >
                              Auditory
                            </TableCell>
                            <TableCell
                              sx={{ fontWeight: "bold", color: "#fff" }}
                            >
                              Dental
                            </TableCell>
                            <TableCell
                              sx={{ fontWeight: "bold", color: "#fff" }}
                            >
                              Vision
                            </TableCell>
                            <TableCell
                              sx={{ fontWeight: "bold", color: "#fff" }}
                            >
                              Psychological
                            </TableCell>
                            <TableCell
                              sx={{ fontWeight: "bold", color: "#fff" }}
                            >
                              Action
                            </TableCell>
                          </TableRow>
                        </TableHead>

                        <TableBody>
                          {tableData?.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>{item.citizen_id}</TableCell>
                              <TableCell>{item.schedule_id}</TableCell>
                              <TableCell>{item.citizen_name}</TableCell>
                              <TableCell>
                                {item.vital_refer === 1 ? "Yes" : "No"}
                              </TableCell>
                              <TableCell>
                                {item.basic_screening_refer === 1
                                  ? "Yes"
                                  : "No"}
                              </TableCell>
                              <TableCell>
                                {item.auditory_refer === 1 ? "Yes" : "No"}
                              </TableCell>
                              <TableCell>
                                {item.dental_refer === 1 ? "Yes" : "No"}
                              </TableCell>
                              <TableCell>
                                {item.vision_refer === 1 ? "Yes" : "No"}
                              </TableCell>
                              <TableCell>
                                {item.pycho_refer === 1 ? "Yes" : "No"}
                              </TableCell>
                              <TableCell>
                                {canEdit && (
                                  <IconButton
                                    component={Link}
                                    to={`/mainscreen/Follow-Up/addFollowup/${item.citizen_id}/${item.schedule_id}/${item.follow_up_ctzn_pk}`}
                                  >
                                    <AddIcon sx={{ color: "#313774" }} />
                                  </IconButton>
                                )}
                                {canView && (
                                  <IconButton
                                    component={Link}
                                    to={`/mainscreen/Follow-Up/viewFollowup/${item.citizen_id}/`}
                                  >
                                    <RemoveRedEyeOutlinedIcon
                                      sx={{ color: "#313774" }}
                                    />
                                  </IconButton>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </>
              )}

              {selectedFollowUpStatus === 2 && (
                <>
                  {/* -------------------- SAM -------------------- */}
                  {selectedFollowUpFor === 1 && (
                    <TableContainer
                      component={Paper}
                      elevation={1}
                      sx={{ borderRadius: "10px", overflow: "hidden", mt: 1 }}
                    >
                      <Table size="small">
                        <TableHead
                          sx={{
                            background:
                              "linear-gradient(90deg, #2FB3F5 0%, #1439A4 100%)",
                          }}
                        >
                          <TableRow>
                            <TableCell
                              sx={{
                                fontWeight: "bold",
                                // width: "80px",
                                color: "#fff",
                              }}
                            >
                              Sr No.
                            </TableCell>
                            <TableCell
                              sx={{ fontWeight: "bold", color: "#fff" }}
                            >
                              Citizen ID
                            </TableCell>
                            <TableCell
                              sx={{ fontWeight: "bold", color: "#fff" }}
                            >
                              Screening ID
                            </TableCell>
                            <TableCell
                              sx={{ fontWeight: "bold", color: "#fff" }}
                            >
                              Citizen Name
                            </TableCell>
                            <TableCell
                              sx={{ fontWeight: "bold", color: "#fff" }}
                            >
                              SAM
                            </TableCell>
                            <TableCell
                              sx={{ fontWeight: "bold", color: "#fff" }}
                            >
                              Action
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {tableData?.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>{item.citizen_id}</TableCell>
                              <TableCell>{item.schedule_id}</TableCell>
                              <TableCell>{item.citizen_name}</TableCell>
                              <TableCell>
                                {item.weight_for_height === "SAM"
                                  ? "Yes"
                                  : "No"}
                              </TableCell>
                              <TableCell>
                                {canEdit && (
                                  <IconButton
                                    component={Link}
                                    to={`/mainscreen/Follow-Up/addFollowup/${item.citizen_id}/${item.schedule_id}/${item.follow_up_ctzn_pk}`}
                                  >
                                    <AddIcon sx={{ color: "#313774" }} />
                                  </IconButton>
                                )}
                                {canView && (
                                  <IconButton
                                    component={Link}
                                    to={`/mainscreen/Follow-Up/viewFollowup/${item.citizen_id}/`}
                                  >
                                    <RemoveRedEyeOutlinedIcon
                                      sx={{ color: "#313774" }}
                                    />
                                  </IconButton>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}

                  {/* -------------------- MAM -------------------- */}
                  {selectedFollowUpFor === 2 && (
                    <TableContainer
                      component={Paper}
                      elevation={1}
                      sx={{ borderRadius: "10px", overflow: "hidden", mt: 1 }}
                    >
                      <Table size="small">
                        <TableHead
                          sx={{
                            background:
                              "linear-gradient(90deg, #2FB3F5 0%, #1439A4 100%)",
                          }}
                        >
                          <TableRow>
                            <TableCell
                              sx={{ fontWeight: "bold", color: "#fff" }}
                            >
                              Sr No.
                            </TableCell>
                            <TableCell
                              sx={{ fontWeight: "bold", color: "#fff" }}
                            >
                              Citizen ID
                            </TableCell>
                            <TableCell
                              sx={{ fontWeight: "bold", color: "#fff" }}
                            >
                              Screening ID
                            </TableCell>
                            <TableCell
                              sx={{ fontWeight: "bold", color: "#fff" }}
                            >
                              Citizen Name
                            </TableCell>
                            <TableCell
                              sx={{ fontWeight: "bold", color: "#fff" }}
                            >
                              MAM
                            </TableCell>
                            <TableCell
                              sx={{ fontWeight: "bold", color: "#fff" }}
                            >
                              Action
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {tableData?.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>{item.citizen_id}</TableCell>
                              <TableCell>{item.schedule_id}</TableCell>
                              <TableCell>{item.citizen_name}</TableCell>
                              <TableCell>
                                {item.weight_for_height === "MAM"
                                  ? "Yes"
                                  : "No"}
                              </TableCell>
                              <TableCell>
                                {canEdit && (
                                  <IconButton
                                    component={Link}
                                    to={`/mainscreen/Follow-Up/addFollowup/${item.citizen_id}/${item.schedule_id}/${item.follow_up_ctzn_pk}`}
                                  >
                                    <AddIcon sx={{ color: "#313774" }} />
                                  </IconButton>
                                )}
                                {canView && (
                                  <IconButton
                                    component={Link}
                                    to={`/mainscreen/Follow-Up/viewFollowup/${item.citizen_id}/`}
                                  >
                                    <RemoveRedEyeOutlinedIcon
                                      sx={{ color: "#313774" }}
                                    />
                                  </IconButton>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}

                  {/* -------------------- Full Screening -------------------- */}
                  {selectedFollowUpFor === 4 && (
                    <TableContainer
                      component={Paper}
                      elevation={1}
                      sx={{ borderRadius: "10px", overflow: "hidden", mt: 1 }}
                    >
                      <Table size="small">
                        <TableHead
                          sx={{
                            background:
                              "linear-gradient(90deg, #2FB3F5 0%, #1439A4 100%)",
                          }}
                        >
                          <TableRow>
                            <TableCell
                              sx={{ fontWeight: "bold", color: "#fff" }}
                            >
                              Sr No.
                            </TableCell>
                            <TableCell
                              sx={{ fontWeight: "bold", color: "#fff" }}
                            >
                              Citizen ID
                            </TableCell>
                            <TableCell
                              sx={{ fontWeight: "bold", color: "#fff" }}
                            >
                              Screening ID
                            </TableCell>
                            <TableCell
                              sx={{ fontWeight: "bold", color: "#fff" }}
                            >
                              Citizen Name
                            </TableCell>
                            <TableCell
                              sx={{ fontWeight: "bold", color: "#fff" }}
                            >
                              Vital
                            </TableCell>
                            <TableCell
                              sx={{ fontWeight: "bold", color: "#fff" }}
                            >
                              Basic Screening
                            </TableCell>
                            <TableCell
                              sx={{ fontWeight: "bold", color: "#fff" }}
                            >
                              Auditory
                            </TableCell>
                            <TableCell
                              sx={{ fontWeight: "bold", color: "#fff" }}
                            >
                              Dental
                            </TableCell>
                            <TableCell
                              sx={{ fontWeight: "bold", color: "#fff" }}
                            >
                              Vision
                            </TableCell>
                            <TableCell
                              sx={{ fontWeight: "bold", color: "#fff" }}
                            >
                              Psychological
                            </TableCell>
                            <TableCell
                              sx={{ fontWeight: "bold", color: "#fff" }}
                            >
                              Action
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {tableData?.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>{item.citizen_id}</TableCell>
                              <TableCell>{item.schedule_id}</TableCell>
                              <TableCell>{item.citizen_name}</TableCell>
                              <TableCell>
                                {item.vital_refer === 1 ? "Yes" : "No"}
                              </TableCell>
                              <TableCell>
                                {item.basic_screening_refer === 1
                                  ? "Yes"
                                  : "No"}
                              </TableCell>
                              <TableCell>
                                {item.auditory_refer === 1 ? "Yes" : "No"}
                              </TableCell>
                              <TableCell>
                                {item.dental_refer === 1 ? "Yes" : "No"}
                              </TableCell>
                              <TableCell>
                                {item.vision_refer === 1 ? "Yes" : "No"}
                              </TableCell>
                              <TableCell>
                                {item.pycho_refer === 1 ? "Yes" : "No"}
                              </TableCell>
                              <TableCell>
                                {canEdit && (
                                  <IconButton
                                    component={Link}
                                    to={`/mainscreen/Follow-Up/addFollowup/${item.citizen_id}/${item.schedule_id}/${item.follow_up_ctzn_pk}`}
                                  >
                                    <AddIcon sx={{ color: "#313774" }} />
                                  </IconButton>
                                )}
                                {/* View button commented as in original code */}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
    // </div>
  );
};

export default Desk;
