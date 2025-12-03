import React, { useState, useEffect } from "react";
import "./Permission.css";
// import Navbar from './Navbar';
// import Sidebarnew from './Sidebar';
import axios from "axios";

import MuiAlert from "@mui/material/Alert";
import { styled } from "@mui/system";
import Sidebarnew from "../Sidebar";
import {
  Box,
  Grid,
  Typography,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Snackbar,
  Alert,
  Paper,
  Button,
  Card,
} from "@mui/material";
import { API_URL } from "../../../../Config/api";

const CustomSnackbar = styled(Snackbar)(({ theme }) => ({
  "& .MuiAlert-filledSuccess": {
    backgroundColor: "#4CAF50",
  },
  top: theme.spacing(2),
  right: theme.spacing(2),
}));

const Permission = () => {
  const permission = localStorage.getItem("permissions");
  const usergrp = localStorage.getItem("usergrp");
  console.log(usergrp, "gggggg");
  console.log(permission, "ppppppppppppppppeeeeeeeeeee");
  const classes = CustomSnackbar;
  // const Port = process.env.REACT_APP_API_KEY;
  const [source, setSource] = useState([]);
  const [role, setRole] = useState([]);
  const [moduleSubmodule, setModuleSubmodule] = useState([]);
  const [allPermissionChecked, setAllPermissionChecked] = useState(false);
  const [moduleCheckboxes, setModuleCheckboxes] = useState({});
  const [submoduleCheckboxes, setSubmoduleCheckboxes] = useState({});
  const [sourceid, setSourceid] = useState("");
  const [roleid, setRoleid] = useState("");
  const [permission_list, setPermission_list] = useState([]);
  const [perId, setPerId] = useState("");
  const accessToken = localStorage.getItem("token");

  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Function to handle Snackbar close
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };
  //get source api
useEffect(() => {
  const fetchUserSourceDropdown = async () => {
    try {
      const response = await axios.get(`${API_URL}/Screening/source_GET/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const sources = response.data;
      setSource(sources);

      // 🔥 Auto-select default source
      if (sources.length > 0) {
        const defaultSource = sources[0].source_pk_id;
        setSourceid(defaultSource);

        // Auto-fetch role based on this source
        fetchRole(defaultSource);
      }

    } catch (error) {
      console.log("Error while fetching data", error);
    }
  };

  fetchModuleSubmodule();
  fetchUserSourceDropdown();
}, []);



  //fetch Role API
  // const fetchRole = async (id) => {
  //     try {
  //         const response = await axios.get(`${Port}/Screening/agg_role_info_get/${id}`)
  //         setRole(response.data)
  //         console.log(role, response.data)
  //     }
  //     catch (error) {
  //         console.log('Error while fetching data', error)
  //     }
  // }

  const fetchRole = async (id) => {
    try {
      let rolesResponse;

      // Check if the logged-in user is an admin
      if (usergrp === "UG-ADMIN") {
        // If admin, fetch roles excluding the admin role
        rolesResponse = await axios.get(
          `${API_URL}/Screening/agg_role_info_get/${id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        console.log(rolesResponse, "hhhhhhhhhhhhhh");
        const filteredRoles = rolesResponse.data.filter(
          (role) =>
            role.grp_name !== "UG-ADMIN" && role.grp_name !== "UG-SUPERADMIN"
        );
        setRole(filteredRoles);
      } else {
        // If superadmin or other role, fetch all roles
        const response = await axios.get(
          `${API_URL}/Screening/agg_role_info_get/${id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setRole(response.data);
      }
    } catch (error) {
      console.log("Error while fetching data", error);
    }
  };

  //Fetch module/submodule API
  const fetchModuleSubmodule = async (id) => {
    setSourceid(id);
    try {
      const response = await axios.get(`${API_URL}/Screening/combined/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setModuleSubmodule(response.data);
      console.log(role, response.data);
    } catch (error) {
      console.log("Error while fetching data", error);
    }
  };

  const fetchRoleid = async (id) => {
    setRoleid(id);
    try {
      const response = await axios.get(
        `${API_URL}/Screening/permissions/${sourceid}/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log("Role Permissions Response:", response.data);

      if (response.data.length === 0) {
        // Handle the case when the permission response is empty
        // You can reset or clear the relevant state here
        setPermission_list([]);
        setModuleCheckboxes({});
        setSubmoduleCheckboxes({});
        // Additional logic if needed...
        return;
      }

      setPermission_list(response.data);
      console.log(response.data[0].id, "jjjjjjjjjjjjjj");
      setPerId(response.data[0].id);
      const updatedModuleCheckboxes = {};
      const updatedSubmoduleCheckboxes = {};

      response.data.forEach((roleData) => {
        const { modules_submodule } = roleData;

        modules_submodule.forEach((moduleData) => {
          const { moduleId, selectedSubmodules } = moduleData;

          // Update module checkbox
          updatedModuleCheckboxes[moduleId] = true;

          // Update submodule checkboxes
          selectedSubmodules.forEach((submodule) => {
            updatedSubmoduleCheckboxes[submodule.submoduleId] = true;
          });
        });
      });

      setModuleCheckboxes(updatedModuleCheckboxes);
      setSubmoduleCheckboxes(updatedSubmoduleCheckboxes);
    } catch (error) {
      console.log("Error while fetching role permissions", error);
    }
  };

  const handleAllPermissionChange = (event) => {
    const checked = event.target.checked;
    setAllPermissionChecked(checked);

    const updatedModuleCheckboxes = {};
    const updatedSubmoduleCheckboxes = {};

    moduleSubmodule.forEach((module) => {
      updatedModuleCheckboxes[module.module_id] = checked;

      module.submodules.forEach((submodule) => {
        updatedSubmoduleCheckboxes[submodule.Permission_id] = checked;
      });
    });

    setModuleCheckboxes(updatedModuleCheckboxes);
    setSubmoduleCheckboxes(updatedSubmoduleCheckboxes);
  };

  const handleModuleChange = (moduleId, checked) => {
    const updatedModuleCheckboxes = {
      ...moduleCheckboxes,
      [moduleId]: checked,
    };
    setModuleCheckboxes(updatedModuleCheckboxes);

    const moduleToUpdate = moduleSubmodule.find(
      (module) => module.module_id === moduleId
    );

    if (moduleToUpdate) {
      moduleToUpdate.submodules.forEach((submodule) => {
        setSubmoduleCheckboxes((prevSubmoduleCheckboxes) => ({
          ...prevSubmoduleCheckboxes,
          [submodule.Permission_id]: checked,
        }));
      });
    }
  };

  const handleSubmoduleChange = (submoduleId, checked) => {
    const updatedSubmoduleCheckboxes = {
      ...submoduleCheckboxes,
      [submoduleId]: checked,
    };
    setSubmoduleCheckboxes(updatedSubmoduleCheckboxes);

    let moduleChanged = false;

    moduleSubmodule.forEach((module) => {
      const allSubmodulesChecked = module.submodules.every(
        (submodule) => updatedSubmoduleCheckboxes[submodule.Permission_id]
      );

      if (allSubmodulesChecked) {
        setModuleCheckboxes((prevModuleCheckboxes) => ({
          ...prevModuleCheckboxes,
          [module.module_id]: true,
        }));
        moduleChanged = true;
      } else if (
        module.submodules.every(
          (submodule) => !updatedSubmoduleCheckboxes[submodule.Permission_id]
        )
      ) {
        setModuleCheckboxes((prevModuleCheckboxes) => ({
          ...prevModuleCheckboxes,
          [module.module_id]: false,
        }));
      }
    });

    if (!moduleChanged) {
      const parentModule = moduleSubmodule.find((module) =>
        module.submodules.some(
          (submodule) => submodule.Permission_id === submoduleId
        )
      );

      if (parentModule) {
        setModuleCheckboxes((prevModuleCheckboxes) => ({
          ...prevModuleCheckboxes,
          [parentModule.id]: true,
        }));
      }
    }
  };

  //handlesubmit to POST PUT API

  const handleSubmit = () => {
  const selectedData = {
    source: sourceid,
    role: roleid,
    modules_submodule: [], // Initialize as an empty array
    permission_status: 1,
  };

  moduleSubmodule.forEach((module) => {
    const selectedModule = {
      moduleId: module.module_id,
      moduleName: module.name,
      selectedSubmodules: [],
    };

    if (moduleCheckboxes[module.module_id]) {
      module.submodules.forEach((submodule) => {
        if (submoduleCheckboxes[submodule.Permission_id]) {
          selectedModule.selectedSubmodules.push({
            submoduleId: submodule.Permission_id,
            submoduleName: submodule.name,
          });
        }
      });

      if (selectedModule.selectedSubmodules.length > 0) {
        selectedData.modules_submodule.push(selectedModule);
      }
    }
  });

  console.log(selectedData, "dddddddddddddd");

  const resetForm = () => {
    // setSourceid("");
    setRoleid("");
    setModuleCheckboxes({});
    setSubmoduleCheckboxes({});
    setAllPermissionChecked(false);
    setPermission_list([]);
  };

  if (permission_list == "") {
    if (selectedData.modules_submodule.length > 0) {
      axios
        .post(`${API_URL}/Screening/permissions/`, selectedData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => {
          console.log("Data posted successfully", response.data);
          setSnackbarOpen(true);

          // Reset dropdowns and checkboxes
          resetForm();
        })
        .catch((error) => {
          console.error("Error while posting data", error);
        });
    } else {
      console.error(
        "modules_submodule cannot be empty. Please select at least one module and submodule."
      );
    }
  } else {
    axios
      .put(`${API_URL}/Screening/permissions/${perId}/`, selectedData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        console.log("Data Updated successfully", response.data);
        setSnackbarOpen(true);

        // Reset dropdowns and checkboxes
        resetForm();
      })
      .catch((error) => {
        console.error("Error while posting data", error);
      });
  }
};


  return (
    <Box>
      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          elevation={6}
          variant="filled"
          onClose={handleSnackbarClose}
          severity="success"
        >
          Data posted successfully!
        </Alert>
      </Snackbar>

      <Box sx={{ backgroundColor: "#f5f5f5", py: 3 }}>
        <Box sx={{ width: "90%", mx: "auto" }}>
          {/* =========================== */}
          {/* DROPDOWN CARD */}
          {/* =========================== */}
          <Card
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 2,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 500,
                color: "#1A237E",
                fontFamily: "Roboto",
                mb: 2,
              }}
            >
              Permission
            </Typography>

            <Grid container spacing={2}>
              {/* Source */}
              <Grid item xs={12} md={4}>
                <FormControl fullWidth sx={{ mb: 3 }}   size="small">
                  <InputLabel id="source-label">WorkShop Name</InputLabel>
                  <Select
                    labelId="source-label"
                    value={sourceid}
                    label="WorkShop Name"
                    onChange={(e) => {
                      const id = e.target.value;
                      setSourceid(id);

                      fetchRole(id);
                      setRoleid("");
                      setModuleCheckboxes({});
                      setSubmoduleCheckboxes({});
                      setPermission_list([]);
                    }}
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
                    {source.map((item) => (
                      <MenuItem
                        key={item.source_pk_id}
                        value={item.source_pk_id}
                      >
                        {item.source}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Roles */}
              <Grid item xs={12} md={4}>
                <FormControl fullWidth sx={{ mb: 3 }}   size="small">
                  <InputLabel id="role-label">Select Role</InputLabel>
                  <Select
                    labelId="role-label"
                    value={roleid}
                    label="Select Role"
                    onChange={(e) => {
                      const id = e.target.value;
                      setRoleid(id);
                      fetchRoleid(id);
                      setAllPermissionChecked(false);
                    }}
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
                    {role.map((item) => (
                      <MenuItem key={item.Group_id} value={item.Group_id}>
                        {item.grp_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* All Permission */}
              <Grid item xs={12} md={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={allPermissionChecked}
                      onChange={handleAllPermissionChange}
                    />
                  }
                  label="All Permission"
                />
              </Grid>
            </Grid>
          </Card>

          {/* =========================== */}
          {/* PERMISSION CARD */}
          {/* =========================== */}
          <Card
            sx={{
              p: 0,
              mt: 3,
              borderRadius: 2,
              overflow: "hidden",
              boxShadow: "0 3px 10px rgba(0,0,0,0.12)",
            }}
          >
            {/* Sticky Header */}
            <Grid
              container
              spacing={2}
              sx={{
                position: "sticky",
                top: 0,
                zIndex: 20,
                background: "linear-gradient(90deg, #2FB3F5 0%, #1439A4 100%)",
                py: 1,
                px: 2,
                borderBottom: "1px solid rgba(255,255,255,0.25)",
              }}
            >
              <Grid item xs={12} md={3}>
                <Paper
                  sx={{
                    p: 1,
                    textAlign: "left",
                    fontWeight: "bold",
                    background: "transparent",
                    color: "#fff",
                    boxShadow: "none",
                    fontFamily: "Roboto",
                  }}
                  elevation={0}
                >
                  Modules
                </Paper>
              </Grid>

              <Grid item xs={12} md={8}>
                <Paper
                  sx={{
                    p: 1,
                    textAlign: "left",
                    fontWeight: "bold",
                    background: "transparent",
                    color: "#fff",
                    boxShadow: "none",
                    fontFamily: "Roboto",
                  }}
                  elevation={0}
                >
                  Sub Modules
                </Paper>
              </Grid>
            </Grid>

            {/* Scrollable List */}
            <Box sx={{ maxHeight: 450, overflowY: "auto", p: 2 }}>
              {moduleSubmodule.map((module) => (
                <Grid
                  container
                  spacing={2}
                  sx={{
                    mt: 1,
                    borderBottom: "1px solid #eee",
                    pb: 1,
                  }}
                  key={module.module_id}
                >
                  {/* Module */}
                  <Grid item xs={12} md={3}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={moduleCheckboxes[module.module_id] || false}
                          onChange={(e) =>
                            handleModuleChange(
                              module.module_id,
                              e.target.checked
                            )
                          }
                        />
                      }
                      label={module.name}
                    />
                  </Grid>

                  {/* Submodules */}
                  <Grid
                    item
                    xs={12}
                    md={8}
                    container
                    spacing={1}
                    sx={{ display: "flex", flexWrap: "wrap" }}
                  >
                    {module.submodules.map((submodule) => (
                      <Grid item key={submodule.Permission_id}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={
                                submoduleCheckboxes[submodule.Permission_id] ||
                                false
                              }
                              onChange={(e) =>
                                handleSubmoduleChange(
                                  submodule.Permission_id,
                                  e.target.checked
                                )
                              }
                            />
                          }
                          label={submodule.name}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              ))}
            </Box>

            {/* Submit */}
            <Box sx={{ textAlign: "center", p: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </Box>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default Permission;
