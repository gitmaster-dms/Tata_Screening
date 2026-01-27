import { useState, useEffect, useRef } from "react";
import "./Corporate.css";
import { useSourceContext } from "../../../../../../../src/contexts/SourceContext";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  Button,
  Card,
  FormHelperText,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";

import axios from "axios";

const Corporate = (props) => {
  const Port = process.env.REACT_APP_API_KEY;
  const userID = localStorage.getItem("userID");
  console.log(userID);
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("token");
  const [openConfirm, setOpenConfirm] = useState(false);

  /// State District Tehsil
  const State = localStorage.getItem("StateLogin");
  const District = localStorage.getItem("DistrictLogin");
  const Tehsil = localStorage.getItem("TehsilLogin");

  /////////// image capturing
  const webcamRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setImageSrc(null); // Reset imageSrc if modal is closed without saving
  };

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImageSrc(imageSrc);
  };
  /////////// image capturing end

  //// access the source from local storage
  const SourceUrlId = localStorage.getItem("loginSource");
  console.log(SourceUrlId, "SourceUrlId");

  //// access the source name from local storage
  const SourceNameUrlId = localStorage.getItem("SourceNameFetched");
  console.log(SourceNameUrlId, "SourceNameUrlId");

  const [maritalStatus, setMaritalStatus] = useState("");
  const {
    sourceState,
    district,
    tehsil,
    SourceName,
    height,
    setHeight,
    weight,
    setWeight,
    age,
    setAge,
    bmi,
    gender,
    selectedScheduleType,

    selectedAge,
    selectedDisease,
  } = useSourceContext();
  console.log(selectedScheduleType, "selectedScheduleType");

  const [department, setDepartment] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedDesignation, setSelectedDesignation] = useState("");
  const [designation, setDesignation] = useState([]);
  const [siblingsCount, setSiblingsCount] = useState("");
  const [childrenCount, setChildrenCount] = useState("");
  const [dob, setDOB] = useState("");

  const [dropdownSource, setDropdownSource] = useState([]);

  const [stateOptions, setStateOptions] = useState([]);
  const [selectedState, setSelectedState] = useState("");

  const [districtOptions, setDistrictOptions] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");

  const [talukaOptions, setTalukaOptions] = useState([]);
  const [selectedTahsil, setSelectedTahsil] = useState("");
  const [errors, setErrors] = useState({});

  console.log(selectedAge, "Fetched Age for Corporate");

  const validateForm = () => {
    let temp = {};
    if (!corporateForm.prefix) temp.prefix = "Prefix is required";
    if (!corporateForm.name || corporateForm.name.trim() === "")
      temp.name = "Name is required";
    if (!corporateForm.blood_groups)
      temp.blood_groups = "Blood Group is required";

    if (!corporateForm.aadhar_id || !/^\d{12}$/.test(corporateForm.aadhar_id)) {
      temp.aadhar_id = "Valid 12-digit Aadhar ID is required";
    }
    // Date of Birth
    // if (!corporateForm.dob) temp.dob = "Date of Birth is required";

    // Mobile Number
    if (!corporateForm.mobile_no || !/^\d{10}$/.test(corporateForm.mobile_no))
      temp.mobile_no = "Valid 10-digit Mobile Number is required";
    if (!selectedState) temp.state = "State is required";
    if (!selectedDistrict) temp.district = "District is required";
    if (!selectedTahsil) temp.tehsil = "Tehsil is required";
    if (!corporateForm.Workshop_name)
      temp.Workshop_name = "Workshop Name is required";
    // if (!corporateForm.address)
    //   temp.address = "Residential Address is required";
    // if (!corporateForm.permanant_address)
    //   temp.permanant_address = "Permanent Address is required";
    if (!corporateForm.pincode || corporateForm.pincode.length !== 6)
      temp.pincode = "Valid 6-digit pincode required";

    setErrors(temp);

    return Object.keys(temp).length === 0; // true if no errors
  };

  const handleSiblingsCountChange = (e) => {
    setSiblingsCount(e.target.value);
  };

  const handleChildrenCountChange = (e) => {
    setChildrenCount(e.target.value);
  };

  //////////// depeendency Mapping
  useEffect(() => {
    const fetchStateOptions = async () => {
      try {
        const response = await axios.get(`${Port}/Screening/State_Get/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const options = response.data;
        setStateOptions(options);
      } catch (error) {
        console.log("Error While Fetching Data", error);
      }
    };
    fetchStateOptions();
  }, []);

  useEffect(() => {
    const fetchDistrictOptions = async () => {
      if (selectedState) {
        try {
          const res = await fetch(
            `${Port}/Screening/District_Get/${selectedState}/`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            },
          );
          const data = await res.json();
          setDistrictOptions(data);
        } catch (error) {
          console.error("Error fetching District data:", error);
        }
      }
    };
    fetchDistrictOptions();
  }, [selectedState]);

  useEffect(() => {
    const fetchTalukaOptions = async () => {
      if (selectedDistrict) {
        try {
          const res = await fetch(
            `${Port}/Screening/Tehsil_Get/${selectedDistrict}/`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            },
          );
          const data = await res.json();
          setTalukaOptions(data);
        } catch (error) {
          console.error("Error fetching Taluka data:", error);
        }
      }
    };
    fetchTalukaOptions();
  }, [selectedDistrict]);

  useEffect(() => {
    const fetchSource = async () => {
      try {
        const response = await axios.get(`${Port}/Screening/source_GET/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const options = response.data;
        setDropdownSource(options);
      } catch (error) {
        console.log("Error While Fetching Data", error);
      }
    };
    fetchSource();
  }, []);

 
  const { selectedName, setSelectedName } = useSourceContext();
  const [selectedNameId, setSelectedNameId] = useState("");
  const { selectedSource, setSelectedSource } = useSourceContext();

  const handleSourceChange = (e) => {
    const selectedId = e.target.value;
    const selectedOption = dropdownSource.find(
      (opt) => opt.source_pk_id === selectedId,
    );

    setCorporateForm((prev) => ({
      ...prev,
      source: selectedId,
      source_name: selectedOption?.source || "",
    }));

    setSelectedSource(selectedId);
    setSelectedName(selectedOption?.source || "");
  };

  ////////// BMI
  const [heightValue, setHeightValue] = useState("");
  const [weightValue, setWeightValue] = useState("");

  const handleHeightChange = (event) => {
    const { value } = event.target;
    setHeightValue(value);
    setHeight(value);
  };

  const handleWeightChange = (event) => {
    const { value } = event.target;
    setWeightValue(value);
    setWeight(value);
  };

  const handlestatus = (event) => {
    setMaritalStatus(event.target.value);
  };

  const calculateAge = (selectedDOB) => {
    if (!selectedDOB) {
      // Clear age values when DOB is null or undefined
      setAge({ year: "", months: "", days: "" });
      return;
    }

    const currentDate = new Date();
    const ageInMilliseconds = currentDate - selectedDOB;

    const years = Math.floor(
      ageInMilliseconds / (365.25 * 24 * 60 * 60 * 1000),
    );
    const months = Math.floor(
      (ageInMilliseconds % (365.25 * 24 * 60 * 60 * 1000)) /
        (30.44 * 24 * 60 * 60 * 1000),
    );
    const days = Math.floor(
      ((ageInMilliseconds % (365.25 * 24 * 60 * 60 * 1000)) %
        (30.44 * 24 * 60 * 60 * 1000)) /
        (24 * 60 * 60 * 1000),
    );

    setAge({ year: years, months: months, days: days });
  };

  const handleDOBChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const maxAllowedDate = new Date();
    const minAllowedDate = new Date();

    // Adjust minAllowedDate based on the age restriction
    if (props.age === 2) {
      minAllowedDate.setFullYear(minAllowedDate.getFullYear() - 19);
    }

    if (selectedDate >= minAllowedDate && selectedDate <= maxAllowedDate) {
      if (props.age === 2 && selectedDate >= minAllowedDate) {
        setErrorMessages((prevErrors) => ({
          ...prevErrors,
          dob: "Invalid date. Please select a date outside the last 19 years.",
        }));
        return;
      }
    }

    setDOB(e.target.value);
    calculateAge(selectedDate);

    // Clear error message
    setErrorMessages((prevErrors) => ({
      ...prevErrors,
      dob: "",
    }));
  };

  useEffect(() => {
    setHeight(heightValue);
  }, [heightValue]);

  useEffect(() => {
    setWeight(weightValue);
  }, [weightValue]);

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const response = await fetch(
          `${Port}/Screening/get_department/${SourceUrlId}/${SourceNameUrlId}/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          },
        );
        const data = await response.json();
        setDepartment(data);
      } catch (error) {
        console.log("Error Fetching Data");
      }
    };
    fetchDepartment();
  }, []);

  const handleDepartmentChange = (e) => {
    setSelectedDepartment(e.target.value);

    // Clear error message for state if it exists
    if (errorMessages.department) {
      setErrorMessages((prevErrors) => ({
        ...prevErrors,
        department: "",
      }));
    }
  };

  const handleDesignationChange = (e) => {
    setSelectedDesignation(e.target.value);

    // Clear error message for state if it exists
    if (errorMessages.designation) {
      setErrorMessages((prevErrors) => ({
        ...prevErrors,
        designation: "",
      }));
    }
  };

  useEffect(() => {
    const fetchDesignation = async () => {
      if (selectedDepartment) {
        try {
          const response = await fetch(
            `${Port}/Screening/get_designation/${selectedDepartment}/${SourceUrlId}/${SourceNameUrlId}/`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
            },
          );
          const data = await response.json();
          setDesignation(data);
        } catch (error) {
          console.log("Error Fetching Data");
        }
      } else {
        console.log("Error Fetching Data");
      }
    };
    fetchDesignation();
  }, [selectedDepartment]);

  const [errorMessages, setErrorMessages] = useState({
    prefix: "",
    name: "",
    blood_groups: "",
    employee_id: "",
    mobile_no: "",
    state: "",
    district: "",
    tehsil: "",
    source: "",
    // department: "",
    designation: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const [corporateForm, setCorporateForm] = useState({
    prefix: "",
    name: "",
    vehicle_number: "",
    blood_groups: "",
    aadhar_id: "",
    mobile_no: "",
    category: "",
    employee_id: "",
    Workshop_name: "",
    pincode: "",
    address: "",
    arm_size: "",
    symptoms: "",

    source: selectedSource || "", // source ID
    source_name: selectedName || "", // source label
    state: selectedState || "",
    district: selectedDistrict || "",
    tehsil: selectedTahsil || "",
    gender: gender || "",
    added_by: userID,
    modify_by: userID,

    emergency_prefix: "",
    emergency_fullname: "",
    emergency_gender: "",
    emergency_contact: "",
    relationship_with_employee: "",
    emergency_address: "",

    site_plant: "",
    doj: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo") {
      setCorporateForm((prevState) => ({
        ...prevState,
        [name]: files[0],
      }));
    } else {
      setCorporateForm((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }

    //// clear error message
    if (errorMessages[name]) {
      setErrorMessages((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };

  const showError = (message) => {
    setSnackbar({
      open: true,
      message,
      severity: "error",
    });
  };

  const [workshop, setWorkshop] = useState([]);
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const getworkshop = async () => {
    if (!selectedTahsil) return;
    try {
      const response = await fetch(
        `${Port}/Screening/Workshop_list_get/${selectedTahsil}/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      const data = await response.json();
      setWorkshop(data);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getworkshop();
  }, [selectedTahsil]);

  const handleSubmit = async (e, confirmed = false) => {
    e.preventDefault();

    if (!validateForm()) {
      setSnackbar({
        open: true,
        message: "Please fill all required fields.",
        severity: "error",
      });
      return;
    }

    if (!confirmed) {
      setOpenConfirm(true);
      return;
    }

    if (confirmed) {
      const formData = new FormData();

      // Append all fields from corporateForm
      Object.entries(corporateForm).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });

      formData.append("year", age.year);
      formData.append("months", age.months);
      formData.append("days", age.days);
      formData.append("workshop_id", corporateForm.Workshop_name);

      formData.append("department", selectedDepartment);
      formData.append("designation", selectedDesignation);
      formData.append("marital_status", maritalStatus);
      formData.append("sibling_count", siblingsCount);
      formData.append("state", selectedState);
      formData.append("district", selectedDistrict);
      formData.append("tehsil", selectedTahsil);
      formData.append("source_name", SourceUrlId);
      formData.append("gender", gender);
      formData.append("category", selectedScheduleType);
      formData.append("source", SourceUrlId);
      formData.append("age", selectedAge);
      formData.append("disease", selectedDisease);
      formData.append("added_by", userID);

      formData.append("height", heightValue);
      formData.append("weight", weight);
      formData.append("dob", dob);
      formData.append("bmi", bmi !== null ? bmi : "");
      formData.append(
        "child_count",
        maritalStatus === "Widow" || maritalStatus === "Married"
          ? childrenCount
          : null,
      );

      const newErrorMessages = {};

      if (!corporateForm.prefix || corporateForm.prefix === "Select") {
        newErrorMessages.prefix = "Prefix is required.";
      }

      if (!corporateForm.name) {
        newErrorMessages.name = "Name is required.";
      }

      if (!corporateForm.blood_groups) {
        newErrorMessages.blood_groups = "Blood Group is required.";
      }

      // if (!corporateForm.employee_id) {
      //   newErrorMessages.employee_id = "ID is required.";
      // }

      if (!corporateForm.mobile_no) {
        newErrorMessages.mobile_no = "Mobile Number is required.";
      }

      // if (!dob) {
      //   newErrorMessages.dob = "Date of Birth is required.";
      // }

      if (!selectedState) {
        newErrorMessages.state = "State is required.";
      }

      if (!selectedDistrict) {
        newErrorMessages.district = "District is required.";
      }

      if (!selectedTahsil) {
        newErrorMessages.tehsil = "Tehsil is required.";
      }
      // if (!corporateForm.source || !corporateForm.source_name) {
      //   newErrorMessages.source = "Source and Source Name are required.";
      // }

      // if (!selectedDepartment) {
      //   newErrorMessages.department = "Department is required.";
      // }

      // if (!selectedDesignation) {
      //   newErrorMessages.designation = "Designation is required.";
      // }

      if (Object.keys(newErrorMessages).length > 0) {
        console.log("❌ Validation errors:", newErrorMessages);
        setErrorMessages(newErrorMessages);
        return;
      }
      console.log("Validation passed, calling API...");

      try {
        const response = await fetch(`${Port}/Screening/Citizen_Post/`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData, // Sending formData with all fields
        });

        if (response.status === 201) {
          navigate("/mainscreen/Citizen");
        } else if (response.status === 400) {
          setSnackbar({
            open: true,
            message: "Error Submitting the Form",
            severity: "error",
          });
        } else if (response.status === 409) {
          setSnackbar({
            open: true,
            message: "Employee already exists with the given employee ID.",
            severity: "warning",
          });
        } else {
          setSnackbar({
            open: true,
            message: "Unexpected error occurred.",
            severity: "error",
          });
        }
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      console.log("Form submission cancelled.");
    }
  };

  ////// DOB Validation
  // const getMaxAllowedDate = () => {
  //   const currentDate = new Date();
  //   const maxAllowedDate = new Date();

  //   // Calculate 18 years before the current date
  //   maxAllowedDate.setFullYear(currentDate.getFullYear() - 18);

  //   return maxAllowedDate.toISOString().split('T')[0];
  // };

  // const getMinAllowedDate = () => {
  //   const currentDate = new Date();
  //   const minAllowedDate = new Date();

  //   // Calculate 99 years before the current date
  //   minAllowedDate.setFullYear(currentDate.getFullYear() - 99);

  //   // Format the minAllowedDate to be compatible with input[type='date']
  //   return minAllowedDate.toISOString().split('T')[0];
  // };

  // const getMaxAllowedDate = (selectedAge) => {
  //   const currentDate = new Date();
  //   const maxAllowedDate = new Date();

  //   let maxAge;
  //   if (selectedAge === 5) {
  //     maxAge = selectedAge + 13;
  //   } else if (selectedAge === 6) {
  //     maxAge = selectedAge + 25;
  //   } else if (selectedAge === 7) {
  //     maxAge = selectedAge + 44;
  //   } else if (selectedAge === 8) {
  //     maxAge = selectedAge + 52;
  //   }

  //   // Calculate the maximum allowed date
  //   maxAllowedDate.setFullYear(currentDate.getFullYear() - maxAge);

  //   // Format the maxAllowedDate to be compatible with input[type='date']
  //   return maxAllowedDate.toISOString().split('T')[0];
  // };

  // const getMinAllowedDate = (selectedAge) => {
  //   const currentDate = new Date();
  //   const minAllowedDate = new Date();

  //   let minAge;
  //   if (selectedAge === 5) {
  //     minAge = selectedAge + 25;
  //   } else if (selectedAge === 6) {
  //     minAge = selectedAge + 44;
  //   } else if (selectedAge === 7) {
  //     minAge = selectedAge + 52;
  //   } else if (selectedAge === 8) {
  //     minAge = selectedAge + 91;
  //   }

  //   // Calculate the minimum allowed date
  //   minAllowedDate.setFullYear(currentDate.getFullYear() - minAge);

  //   // Format the minAllowedDate to be compatible with input[type='date']
  //   return minAllowedDate.toISOString().split('T')[0];
  // };

  return (
    <Box component="form" onSubmit={handleSubmit} encType="multipart/form-data">
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Grid container spacing={1}>
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              p: 2,
              borderRadius: 3,
              height: "100%",
              boxShadow: 3,
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                fontWeight: 500,
                color: "#1A237E",
                fontFamily: "Roboto",
              }}
            >
              Citizen Details
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={4} md={3}>
                <FormControl
                  fullWidth
                  size="small"
                  // required
                  variant="outlined"
                  error={!!errorMessages.prefix}
                  helperText={!!errors.prefix}
                >
                  <InputLabel id="prefix-label">Prefix</InputLabel>
                  <Select
                    sx={{
                      "& .MuiInputBase-input.MuiSelect-select": {
                        color: "#000 !important",
                      },
                      "& .MuiSvgIcon-root": {
                        color: "#000",
                      },
                    }}
                    labelId="prefix-label"
                    name="prefix"
                    value={corporateForm.prefix}
                    onChange={handleChange}
                    label="Prefix"
                  >
                    <MenuItem value="">Select</MenuItem>
                    {["Mr", "Ms", "Mrs", "Adv", "Col", "Dr"].map((item) => (
                      <MenuItem key={item} value={item}>
                        {item}.
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={8} md={6}>
                <TextField
                  size="small"
                  fullWidth
                  label="Name *"
                  name="name"
                  value={corporateForm.name}
                  onChange={handleChange}
                  onInput={(e) =>
                    (e.target.value = e.target.value.replace(/[0-9]/g, ""))
                  }
                  error={!!errors.name}
                  helperText={!!errors.name}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                
                  <TextField
                    size="small"
                    fullWidth
                    label="Blood Group *"
                    select
                    sx={{
                      "& .MuiInputBase-input.MuiSelect-select": {
                        color: "#000 !important",
                      },
                      "& .MuiSvgIcon-root": {
                        color: "#000",
                      },
                    }}
                    labelId="blood-group-label"
                    name="blood_groups"
                    value={corporateForm.blood_groups}
                    onChange={handleChange}
                    error={!!errors.blood_groups}
                    helperText={errors.blood_groups}
                  >
                    <MenuItem value="">Select Group</MenuItem>
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                      (grp) => (
                        <MenuItem key={grp} value={grp}>
                          {grp}
                        </MenuItem>
                      ),
                    )}
                  </TextField>

                  {/* Error message display */}
              </Grid>

              {/* Date of Birth */}
              <Grid item xs={12} sm={6} md={6}>
                <TextField
                  size="small"
                  fullWidth
                  type="date"
                  label="Date of Birth"
                  name="dob"
                  onChange={handleDOBChange}
                  InputLabelProps={{ shrink: true }}
                  // inputProps={{
                  //   max: getMaxAllowedDate(selectedAge),
                  //   min: getMinAllowedDate(selectedAge),
                  // }}
                  // error={!!errors.dob}
                  // helperText={!!errors.dob}
                />
              </Grid>

              <Grid item xs={4} sm={2}>
                <TextField
                  size="small"
                  fullWidth
                  label="Year"
                  value={age.year}
                  InputProps={{ readOnly: true }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={4} sm={2}>
                <TextField
                  size="small"
                  fullWidth
                  label="Month"
                  value={age.months}
                  InputProps={{ readOnly: true }}
                />
              </Grid>

              <Grid item xs={4} sm={2}>
                <TextField
                  size="small"
                  fullWidth
                  label="Days"
                  value={age.days}
                  InputProps={{ readOnly: true }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  size="small"
                  fullWidth
                  label="Aadhar ID *"
                  name="aadhar_id"
                  value={corporateForm.aadhar_id || ""}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, ""); // only digits
                    if (value.length <= 12) {
                      setCorporateForm((prev) => ({
                        ...prev,
                        aadhar_id: value,
                      }));
                    }
                  }}
                  inputProps={{
                    maxLength: 12,
                    inputMode: "numeric", // mobile numeric keypad
                    pattern: "[0-9]*",
                  }}
                  error={!!errors.aadhar_id}
                  helperText={errors.aadhar_id}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  size="small"
                  fullWidth
                  label="Email ID"
                  type="email"
                  name="email_id"
                  value={corporateForm.email_id}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  size="small"
                  fullWidth
                  label="Mobile Number *"
                  name="mobile_no"
                  value={corporateForm.mobile_no}
                  onChange={handleChange}
                  onInput={(e) => {
                    if (e.target.value < 0) e.target.value = 0;
                    if (e.target.value.length > 10)
                      e.target.value = e.target.value.slice(0, 10);
                  }}
                  error={!!errors.mobile_no}
                  helperText={errors.mobile_no}
                />
              </Grid>

              {/* <Grid item xs={12} sm={6} md={4}>
                <TextField
                  size="small"
                  fullWidth
                  label="EMP ID"
                  name="employee_id"
                  value={corporateForm.employee_id}
                  onChange={handleChange}
                  error={!!errorMessages.employee_id}
                  helperText={errorMessages.employee_id}
                />
              </Grid> */}

              {/* <Grid item xs={12} sm={6} md={4}>
                <FormControl
                  fullWidth
                  size="small"
                  variant="outlined"
                  error={!!errorMessages.department}
                >
                  <InputLabel id="department-label">Department</InputLabel>
                  <Select
                    sx={{
                      "& .MuiInputBase-input.MuiSelect-select": {
                        color: "#000 !important",
                      },
                      "& .MuiSvgIcon-root": {
                        color: "#000",
                      },
                    }}
                    labelId="department-label"
                    name="department"
                    value={selectedDepartment}
                    onChange={handleDepartmentChange}
                    label="Department"
                  >
                    <MenuItem value="">Select</MenuItem>
                    {department.map((dept) => (
                      <MenuItem
                        key={dept.department_id}
                        value={dept.department_id}
                      >
                        {dept.department}
                      </MenuItem>
                    ))}
                  </Select>

                  {errorMessages.department && (
                    <Typography
                      variant="caption"
                      color="error"
                      sx={{ mt: 0.5, fontSize: "0.75rem" }}
                    >
                      {errorMessages.department}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <FormControl
                  fullWidth
                  size="small"
                  variant="outlined"
                  error={!!errorMessages.designation}
                >
                  <InputLabel id="designation-label">Designation</InputLabel>
                  <Select
                    sx={{
                      "& .MuiInputBase-input.MuiSelect-select": {
                        color: "#000 !important",
                      },
                      "& .MuiSvgIcon-root": {
                        color: "#000",
                      },
                    }}
                    labelId="designation-label"
                    name="designation"
                    value={selectedDesignation}
                    onChange={handleDesignationChange}
                    label="Designation"
                  >
                    <MenuItem value="">Select</MenuItem>
                    {designation.map((design) => (
                      <MenuItem
                        key={design.designation_id}
                        value={design.designation_id}
                      >
                        {design.designation}
                      </MenuItem>
                    ))}
                  </Select>

                  {errorMessages.designation && (
                    <Typography
                      variant="caption"
                      color="error"
                      sx={{ mt: 0.5, fontSize: "0.75rem" }}
                    >
                      {errorMessages.designation}
                    </Typography>
                  )}
                </FormControl>
              </Grid> */}

              {/* Upload Photo */}
              <Grid item xs={12} sm={6} md={4}>
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  sx={{
                    textTransform: "none",
                    borderColor: "#1A237E",
                    color: "#1A237E",
                    "&:hover": { borderColor: "#1A237E" },
                  }}
                >
                  Upload Photo
                  <input
                    type="file"
                    hidden
                    name="photo"
                    onChange={handleChange}
                  />
                </Button>
              </Grid>

              {/* DOJ */}
              {/* <Grid item xs={12} sm={6} md={4}>
                <TextField
                  size="small"
                  fullWidth
                  type="date"
                  label="Date of Joining"
                  name="doj"
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  error={!!errorMessages.doj}
                  helperText={errorMessages.doj}
                />
              </Grid> */}
            </Grid>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card
            sx={{
              p: 2,
              borderRadius: 3,
              height: "100%",
              boxShadow: 3,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                fontWeight: 500,
                color: "#1A237E",
                fontFamily: "Roboto",
              }}
            >
              Emergency Contact
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <FormControl
                  fullWidth
                  size="small"
                  variant="outlined"
                  error={!!errorMessages.emergency_prefix}
                >
                  <InputLabel id="emergency-prefix-label">Prefix</InputLabel>
                  <Select
                    sx={{
                      "& .MuiInputBase-input.MuiSelect-select": {
                        color: "#000 !important",
                      },
                      "& .MuiSvgIcon-root": {
                        color: "#000",
                      },
                    }}
                    labelId="emergency-prefix-label"
                    name="emergency_prefix"
                    value={corporateForm.emergency_prefix || ""}
                    onChange={handleChange}
                    label="Prefix"
                  >
                    <MenuItem value="">Select</MenuItem>
                    {["Mr", "Ms", "Mrs", "Adv", "Col", "Dr"].map((item) => (
                      <MenuItem key={item} value={item}>
                        {item}.
                      </MenuItem>
                    ))}
                  </Select>

                  {/* Error Message */}
                  {errorMessages.emergency_prefix && (
                    <Typography
                      color="error"
                      variant="caption"
                      sx={{ mt: 0.5, fontSize: "0.75rem" }}
                    >
                      {errorMessages.emergency_prefix}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={8}>
                <TextField
                  size="small"
                  fullWidth
                  label="Full Name"
                  name="emergency_fullname"
                  value={corporateForm.emergency_fullname || ""}
                  onChange={handleChange}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[0-9]/g, "");
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl
                  fullWidth
                  size="small"
                  variant="outlined"
                  error={!!errorMessages.emergency_gender}
                >
                  <InputLabel id="emergency-gender-label">Gender</InputLabel>
                  <Select
                    sx={{
                      "& .MuiInputBase-input.MuiSelect-select": {
                        color: "#000 !important",
                      },
                      "& .MuiSvgIcon-root": {
                        color: "#000",
                      },
                    }}
                    labelId="emergency-gender-label"
                    name="emergency_gender"
                    value={corporateForm.emergency_gender || ""}
                    onChange={handleChange}
                    label="Gender"
                  >
                    <MenuItem value="">Select</MenuItem>
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>

                  {errorMessages.emergency_gender && (
                    <Typography
                      color="error"
                      variant="caption"
                      sx={{ mt: 0.5, fontSize: "0.75rem" }}
                    >
                      {errorMessages.emergency_gender}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={8}>
                <TextField
                  size="small"
                  fullWidth
                  label="Emergency Contact Number"
                  name="emergency_contact"
                  type="number"
                  value={corporateForm.emergency_contact || ""}
                  onChange={handleChange}
                  onInput={(e) => {
                    if (e.target.value < 0) e.target.value = 0;
                    if (e.target.value.length > 10)
                      e.target.value = e.target.value.slice(0, 10);
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  size="small"
                  fullWidth
                  label="Email ID"
                  name="emergency_email"
                  type="email"
                  value={corporateForm.emergency_email || ""}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl
                  fullWidth
                  size="small"
                  variant="outlined"
                  error={!!errorMessages.relationship_with_employee}
                >
                  <InputLabel id="relationship-label">
                    Relationship with Citizen
                  </InputLabel>
                  <Select
                    sx={{
                      "& .MuiInputBase-input.MuiSelect-select": {
                        color: "#000 !important",
                      },
                      "& .MuiSvgIcon-root": {
                        color: "#000",
                      },
                    }}
                    labelId="relationship-label"
                    name="relationship_with_employee"
                    value={corporateForm.relationship_with_employee || ""}
                    onChange={handleChange}
                    label="Relationship with Employee"
                  >
                    <MenuItem value="">Select Relationship</MenuItem>
                    <MenuItem value="father">Father</MenuItem>
                    <MenuItem value="mother">Mother</MenuItem>
                    <MenuItem value="brother">Brother</MenuItem>
                    <MenuItem value="sister">Sister</MenuItem>
                    <MenuItem value="spouse">Spouse</MenuItem>
                    <MenuItem value="son">Son</MenuItem>
                    <MenuItem value="daughter">Daughter</MenuItem>
                  </Select>

                  {errorMessages.relationship_with_employee && (
                    <Typography
                      color="error"
                      variant="caption"
                      sx={{ mt: 0.5, fontSize: "0.75rem" }}
                    >
                      {errorMessages.relationship_with_employee}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  size="small"
                  fullWidth
                  label="Present Address"
                  name="emergency_address"
                  value={corporateForm.emergency_address || ""}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card
            sx={{
              p: 2,
              borderRadius: 3,
              height: "100%",
              boxShadow: 3,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                fontWeight: 500,
                color: "#1A237E",
                fontFamily: "Roboto",
              }}
            >
              Growth Monitoring
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  size="small"
                  fullWidth
                  label="Height"
                  name="height"
                  type="number"
                  value={heightValue}
                  onChange={handleHeightChange}
                  inputProps={{ min: 0,minLength:2 }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  size="small"
                  fullWidth
                  label="Weight"
                  name="weight"
                  type="number"
                  value={weightValue}
                  onChange={handleWeightChange}
                  inputProps={{ min: 0 }}
                  minLength={2}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  size="small"
                  fullWidth
                  label="BMI"
                  name="bmi"
                  value={bmi ?? ""}
                  InputProps={{
                    readOnly: true,
                    sx: {
                      backgroundColor:
                        bmi === null
                          ? "white"
                          : bmi < 18.5
                            ? "orange"
                            : bmi < 25
                              ? "green"
                              : bmi < 30
                                ? "red"
                                : "darkred",
                      color: bmi === null || bmi > 30 ? "black" : "white",
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={8}>
                <TextField
                  size="small"
                  fullWidth
                  label="Symptoms (if any)"
                  name="symptoms"
                  value={corporateForm.symptoms || ""}
                  onChange={handleChange}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[0-9]/g, "");
                  }}
                />
              </Grid>
            </Grid>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card
            sx={{
              p: 2,
              height: "100%",
              borderRadius: 3,
              boxShadow: 3,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 500,
                mb: 2,
                color: "#1A237E",
                fontFamily: "Roboto",
              }}
            >
              Address
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  size="small"
                  fullWidth
                  label="State *"
                  name="state"
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  sx={{
                    "& .MuiInputBase-input.MuiSelect-select": {
                      color: "#000 !important",
                    },
                    "& .MuiSvgIcon-root": {
                      color: "#000",
                    },
                  }}
                  error={!!errors.state}
                  helperText={errors.state}
                >
                  <MenuItem value="">
                    {corporateForm.state || "Select State"}
                  </MenuItem>
                  {stateOptions.map((state) => (
                    <MenuItem key={state.state_id} value={state.state_id}>
                      {state.state_name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  name="district"
                  label="District *"
                  value={selectedDistrict}
                  size="small"
                  fullWidth
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  sx={{
                    "& .MuiInputBase-input.MuiSelect-select": {
                      color: "#000 !important",
                    },
                    "& .MuiSvgIcon-root": {
                      color: "#000",
                    },
                  }}
                  error={!!errors.district}
                  helperText={errors.district}
                >
                  <MenuItem value="">
                    {corporateForm.district || "Select District"}
                  </MenuItem>
                  {districtOptions.map((district) => (
                    <MenuItem key={district.dist_id} value={district.dist_id}>
                      {district.dist_name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  name="taluka "
                  value={selectedTahsil}
                  size="small"
                  label="Tehsil *"
                  fullWidth
                  onChange={(e) => setSelectedTahsil(e.target.value)}
                  sx={{
                    "& .MuiInputBase-input.MuiSelect-select": {
                      color: "#000 !important",
                    },
                    "& .MuiSvgIcon-root": {
                      color: "#000",
                    },
                  }}
                  error={!!errors.tehsil}
                  helperText={errors.tehsil}
                >
                  <MenuItem value="">
                    {corporateForm.tehsil || "Select Tehsil"}
                  </MenuItem>
                  {talukaOptions.map((taluka) => (
                    <MenuItem key={taluka.tal_id} value={taluka.tal_id}>
                      {taluka.tahsil_name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* <Grid item xs={12} sm={6}>
                <FormControl
                  fullWidth
                  size="small"
                  error={!!errorMessages.source}
                >
                  <InputLabel>WorkShop Name *</InputLabel>
                  <Select
                    name="source"
                    value={corporateForm.Workshop_name}
                    onChange={handleSourceChange}
                    label="Source"
                    sx={{
                      "& .MuiInputBase-input.MuiSelect-select": {
                        color: "#000 !important",
                      },
                      "& .MuiSvgIcon-root": { color: "#000" },
                    }}
                  >
                    <MenuItem value="">Select Source</MenuItem>
                    {dropdownSource.map((option) => (
                      <MenuItem
                        key={option.source_pk_id}
                        value={option.source_pk_id}
                      >
                        {option.source}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid> */}

              <Grid item xs={12} sm={6}>
               
                  <TextField
                    select
                    size="small"
                    fullWidth
                    label="Workshop Name *"
                    name="Workshop_name"
                    value={corporateForm.Workshop_name}
                    onChange={(e) =>
                      setCorporateForm({
                        ...corporateForm,
                        Workshop_name: e.target.value, // store workshop ID
                      })
                    }
                    sx={{
                      "& .MuiInputBase-input.MuiSelect-select": {
                        color: "#000 !important",
                      },
                      "& .MuiSvgIcon-root": { color: "#000" },
                    }}
                    error={!!errors.Workshop_name}
                    helperText={errors.Workshop_name}
                  >
                    <MenuItem value="">Select Workshop</MenuItem>

                    {workshop.map((ws) => (
                      <MenuItem key={ws.ws_pk_id} value={ws.ws_pk_id}>
                        {ws.Workshop_name || "Unnamed Workshop"}
                      </MenuItem>
                    ))}
                  </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  size="small"
                  fullWidth
                  label="Residential Address"
                  name="address"
                  value={corporateForm.address}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  size="small"
                  fullWidth
                  label="Permanent Address"
                  name="permanant_address"
                  value={corporateForm.permanant_address}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  size="small"
                  fullWidth
                  // type="number"
                  label="Pincode *"
                  name="pincode"
                  value={corporateForm.pincode}
                  onChange={handleChange}
                  inputProps={{
                    maxLength: 6,
                    onInput: (e) => {
                      if (e.target.value < 0) e.target.value = 0;
                      if (e.target.value.length > 6)
                        e.target.value = e.target.value.slice(0, 6);
                    },
                  }}
                  error={!!errors.pincode}
                  helperText={errors.pincode}
                />
              </Grid>

              {/* <Grid item xs={12} sm={6}>
                <TextField
                  size="small"
                  fullWidth
                  label="Site Plant"
                  name="site_plant"
                  value={corporateForm.site_plant}
                  onChange={handleChange}
                />
              </Grid> */}
            </Grid>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Box textAlign="center" sx={{ mb: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ px: 5, py: 1.2 }}
            >
              Submit
            </Button>
          </Box>
        </Grid>
      </Grid>
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Confirm Submission</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to submit the form?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={(e) => {
              setOpenConfirm(false);
              handleSubmit(e, true); // pass a flag to indicate confirmation
            }}
            color="primary"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Corporate;
