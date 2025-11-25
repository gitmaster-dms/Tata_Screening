import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  InputLabel,
  FormControl,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";

const Childvital = ({
  citizensPkId,
  pkid,
  sourceID,
  fetchVital,
  selectedName,
  onAcceptClick,
}) => {
  const SourceUrlId = localStorage.getItem("loginSource");
  const SourceNameUrlId = localStorage.getItem("SourceNameFetched");
  const source = localStorage.getItem("source");
  const Port = process.env.REACT_APP_API_KEY;
  const userID = localStorage.getItem("userID");
  const accessToken = localStorage.getItem("token");

  const [department, setDepartment] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [designation, setDesignation] = useState([]);
  const [nextName, setNextName] = useState("");
  const [updateId, setUpdateId] = useState("");
  const [childData, setChildData] = useState({
    citizen_id: "",
    schedule_id: "",
    name: "",
    gender: "",
    blood_groups: "",
    dob: "",
    year: "",
    months: "",
    days: "",
    aadhar_id: "",
    email_id: "",
    emp_mobile_no: null,
    employee_id: "",
    department: "",
    designation: "",
    doj: "",
  });

  useEffect(() => {
    if (fetchVital && selectedName) {
      const currentIndex = fetchVital.findIndex(
        (item) => item.screening_list === selectedName
      );

      if (currentIndex !== -1 && currentIndex < fetchVital.length - 1) {
        const nextItem = fetchVital[currentIndex + 1];
        const nextName = nextItem.screening_list;
        setNextName(nextName);
      } else {
        setNextName("");
      }
    }
  }, [selectedName, fetchVital]);

  const handleDepartmentChange = (e) => {
    setSelectedDepartment(e.target.value);
  };

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const response = await fetch(
          `${Port}/Screening/get_department/${SourceUrlId}/${SourceNameUrlId}/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const data = await response.json();
        setDepartment(data);
      } catch (error) {
        console.log("Error fetching department data");
      }
    };
    fetchDepartment();
  }, []);

  useEffect(() => {
    const fetchDesignation = async () => {
      if (selectedDepartment) {
        try {
          const response = await fetch(
            `${Port}/Screening/get_designation/${selectedDepartment}/${SourceUrlId}/${SourceNameUrlId}/`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          const data = await response.json();
          setDesignation(data);
        } catch (error) {
          console.log("Error fetching designation data:", error);
        }
      }
    };
    fetchDesignation();
  }, [selectedDepartment]);

  const fetchData = async () => {
    try {
      const response = await fetch(`${Port}/Screening/SaveBasicInfo/${pkid}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          pkid: pkid,
          // send anything required by backend
        }),
      });

      const res = await response.json();

      if (res?.data) {
        const childData = res.data;
        setChildData(childData);
        setSelectedDepartment(childData?.citizen_info?.department);
        setUpdateId(childData?.basic_pk_id);

        localStorage.setItem("citizenGender", childData?.citizen_info?.gender);
      }
    } catch (error) {
      console.error("Error fetching child data", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pkid]);

  const updateDataInDatabase = async ( confirmationStatus) => {
    try {
      const response = await fetch(
        `${Port}/Screening/CitizenBasicInfo/${childData?.basic_pk_id}/`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            citizen_id: childData.citizen_id,
            schedule_id: childData.schedule_id,
            name: childData.citizen_info.name,
            doj: childData.citizen_info.doj,
            gender: childData.citizen_info.gender,
            blood_groups: childData.citizen_info.blood_groups,
            dob: childData.citizen_info.dob,
            year: childData.citizen_info.year,
            months: childData.citizen_info.months,
            days: childData.citizen_info.days,
            aadhar_id: childData.citizen_info.aadhar_id,
            emp_mobile_no: childData.citizen_info.emp_mobile_no,
            email_id: childData.citizen_info.email_id,
            employee_id: childData.citizen_info.employee_id,
            department: childData.citizen_info.department,
            designation: childData.citizen_info.designation,
            form_submit: confirmationStatus,
            added_by: userID,
            modify_by: userID,
          }),
        }
      );

      if (response.status === 200) {
        setChildData({ ...childData });
        onAcceptClick(nextName);
      } else {
        alert(`Failed to update data. Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error updating data", error);
    }
  };

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleConfirmSubmit = async () => {
    setOpenConfirmDialog(false);
    if (updateId) {
      await updateDataInDatabase(updateId, "True");
      setSnackbar({
        open: true,
        message: "Child Info Form Submitted Successfully!",
        severity: "success",
      });
    }
  };

  const handleSubmit = async () => {
    // const isConfirmed = window.confirm("Submit Child Info Form");
    // const confirmationStatus = isConfirmed ? "True" : "False";

    // if (updateId && isConfirmed) {
    //     await updateDataInDatabase(updateId, confirmationStatus);
    // }
    setOpenConfirmDialog(true);
  };

  return (
    <div>
      <Dialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
      >
        <DialogContent>
          <Typography>
            Are you sure you want to submit the Citizen Form?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenConfirmDialog(false)}
            color="secondary"
            variant="outlined"
          >
            Cancel
          </Button>

          <Button
            onClick={handleConfirmSubmit}
            color="primary"
            variant="contained"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

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

      <Card
        sx={{
          borderRadius: "20px",
          p: 1,
          mb: 1,
          background: "linear-gradient(90deg, #039BEF 0%, #1439A4 100%)",
        }}
      >
        <Grid item xs={12}>
          <Typography
            sx={{
              fontWeight: 600,
              fontFamily: "Roboto",
              fontSize: "16px",
              color: "white",
            }}
          >
            {/* {source === "1" ? "Citizen Details" : "Employee Details"} */}
            Citizen Details
          </Typography>
        </Grid>
      </Card>

      <Card sx={{ borderRadius: "20px" }}>
        <CardContent>
          <Grid container spacing={2} sx={{ p: 1 }}>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={2}>
  <FormControl fullWidth size="small">
    <InputLabel>Prefix</InputLabel>
    <Select
      sx={{
        "& .MuiInputBase-input.MuiSelect-select": {
          color: "#000 !important",
        },
        "& .MuiSvgIcon-root": {
          color: "#000",
        },
      }}
      label="Prefix"
      value={childData?.prefix || ""}
      onChange={(e) =>
        setChildData((prev) => ({
          ...prev,
          prefix: e.target.value,
        }))
      }
    >
      <MenuItem value="">Select</MenuItem>
      <MenuItem value="Mr.">Mr.</MenuItem>
      <MenuItem value="Ms.">Ms.</MenuItem>
      <MenuItem value="Mrs.">Mrs.</MenuItem>
      <MenuItem value="Adv.">Adv.</MenuItem>
      <MenuItem value="Col.">Col.</MenuItem>
      <MenuItem value="Dr.">Dr.</MenuItem>
    </Select>
  </FormControl>
</Grid>


                <Grid item xs={12} sm={10}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Citizen ID"
                    value={childData?.citizen_id || ""}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>

                {/* <Grid item xs={12} sm={5}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Schedule ID"
                                        value={childData?.schedule_id || ""}
                                        InputProps={{ readOnly: true }}
                                    />
                                </Grid> */}

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label={source === "1" ? "Citizen Name" : "Citizen Name"}
                    value={childData?.name || ""}
                    onChange={(e) =>
                      setChildData({
                        ...childData,
                        citizen_info: {
                          ...childData.citizen_info,
                          name: e.target.value.replace(/[0-9]/g, ""),
                        },
                      })
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Gender</InputLabel>
                    <Select
                      sx={{
                        "& .MuiInputBase-input.MuiSelect-select": {
                          color: "#000 !important",
                        },
                        "& .MuiSvgIcon-root": {
                          color: "#000",
                        },
                      }}
                      label="Gender"
                      value={childData?.gender || ""}
                      onChange={(e) =>
                        setChildData({
                          ...childData,
                          citizen_info: {
                            ...childData.citizen_info,
                            gender: e.target.value,
                          },
                        })
                      }
                    >
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value="1">Male</MenuItem>
                      <MenuItem value="2">Female</MenuItem>
                      <MenuItem value="3">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Blood Group</InputLabel>
                    <Select
                      sx={{
                        "& .MuiInputBase-input.MuiSelect-select": {
                          color: "#000 !important",
                        },
                        "& .MuiSvgIcon-root": {
                          color: "#000",
                        },
                      }}
                      label="Blood Group"
                      value={childData?.blood_group || ""}
                      onChange={(e) =>
                        setChildData({
                          ...childData,
                          citizen_info: {
                            ...childData.citizen_info,
                            blood_groups: e.target.value,
                          },
                        })
                      }
                    >
                      <MenuItem value="">Select</MenuItem>
                      {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                        (group) => (
                          <MenuItem key={group} value={group}>
                            {group}
                          </MenuItem>
                        )
                      )}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Aadhar ID"
                    type="number"
                    inputProps={{ maxLength: 12 }}
                    value={childData?.aadhar_id || ""}
                    onChange={(e) =>
                      setChildData({
                        ...childData,
                        citizen_info: {
                          ...childData.citizen_info,
                          aadhar_id: e.target.value.slice(0, 12),
                        },
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Phone Number"
                    value={childData?.phone_no || ""}
                    onChange={(e) =>
                      setChildData((prev) => ({
                        ...prev,
                        citizen_info: {
                          ...prev.citizen_info,
                          emp_mobile_no: e.target.value,
                        },
                      }))
                    }
                  />
                </Grid>

                {/* <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Abha ID"
                                        value=""
                                        InputProps={{ readOnly: true }}
                                    />
                                </Grid> */}

                {sourceID === 5 && (
                  <>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Email ID"
                        value={childData?.citizen_info?.email_id || ""}
                        onChange={(e) =>
                          setChildData({
                            ...childData,
                            citizen_info: {
                              ...childData.citizen_info,
                              email_id: e.target.value,
                            },
                          })
                        }
                      />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Mobile Number"
                        value={childData?.citizen_info?.emp_mobile_no || ""}
                        onChange={(e) =>
                          setChildData({
                            ...childData,
                            citizen_info: {
                              ...childData.citizen_info,
                              emp_mobile_no: e.target.value,
                            },
                          })
                        }
                      />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Citizen ID"
                        value={childData?.citizen_info?.employee_id || ""}
                        onChange={(e) =>
                          setChildData({
                            ...childData,
                            citizen_info: {
                              ...childData.citizen_info,
                              employee_id: e.target.value,
                            },
                          })
                        }
                      />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Date of Joining"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={childData?.citizen_info?.doj || ""}
                        onChange={(e) =>
                          setChildData({
                            ...childData,
                            citizen_info: {
                              ...childData.citizen_info,
                              doj: e.target.value,
                            },
                          })
                        }
                      />
                    </Grid>
                  </>
                )}
              </Grid>
            </Grid>

            <Grid
              item
              xs={12}
              sx={{
                mt: 2,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Button
                variant="contained"
                color="primary"
                size="medium"
                onClick={handleSubmit}
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                }}
              >
                Accept
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
};

export default Childvital;
