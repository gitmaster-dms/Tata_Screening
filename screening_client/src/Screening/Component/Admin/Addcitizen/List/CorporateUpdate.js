import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  TextField,
  MenuItem,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  Box,
  Card,
  Snackbar,
  Alert,
} from "@mui/material";

const CorporateUpdate = (props) => {
  const Port = process.env.REACT_APP_API_KEY;
  const userID = localStorage.getItem("userID");
  console.log(userID);
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("token");
  const [open, setOpen] = useState(false);
  //// access the source from local storage
  const SourceUrlId = localStorage.getItem("loginSource");

  //// access the source name from local storage
  const SourceNameUrlId = localStorage.getItem("SourceNameFetched");
  ///////////////// overall Data using GET API
  const corporateData = props.data;
  console.log(corporateData, "coooooooooooooooooooo");
  console.log(corporateData.designation_name, "id corporate");

  ///////////////////// Header Section Data using GET API
  const mainCorporate = props.main;
  console.log(mainCorporate, "mmmmmmoooooooooooooooooooo");
  console.log(mainCorporate.gender.id, "mmmmmmoooooooooooooooooooo");

  ///////////////////// passed Source and State id name
  const stateCorporate = props.state;
  console.log(stateCorporate, "sssssssssssssssssssssssssssoooooooooooooooooo");

  /////////////////////////////// UPDATE FORM
  const [updatedData, setUpdatedData] = useState({
    name: "",
    blood_groups: "",
    dob: "",
    year: "",
    months: "",
    days: "",
    aadhar_id: "",
    email_id: "",
    emp_mobile_no: "",
    employee_id: "",

    father_name: "",
    mother_name: "",
    occupation_of_father: "",
    occupation_of_mother: "",
    marital_status: "",
    spouse_name: "",
    child_count: "",
    parents_mobile: "",
    sibling_count: "",

    height: null,
    weight: null,
    arm_size: "",
    symptoms: "",
    bmi: "",

    address: "",
    pincode: "",

    /////// new Fields Added
    emergency_prefix: "",
    emergency_fullname: "",
    emergency_gender: "",
    emergency_contact: "",
    emergency_email: "",
    relationship_with_employee: "",
    emergency_address: "",
    doj: "",
    site_plant: "",
  });

  const [bmi, setBmi] = useState([]);
  console.log(bmi);

  //////// bmi value storage
  useEffect(() => {
    const fetchStateOptions = async () => {
      if (
        updatedData.height &&
        updatedData.weight &&
        updatedData.gender &&
        updatedData.year &&
        updatedData.months
      ) {
        try {
          const response = await axios.get(
            `${Port}/Screening/SAM_MAM_BMI/${updatedData.year}/${updatedData.months}/${updatedData.gender}/${updatedData.height}/${updatedData.weight}/`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
            }
          );
          const options = response.data;
          setUpdatedData((prevState) => ({
            ...prevState,
            bmi: options.bmi,
          }));
          console.log("BMI Response:", options);
        } catch (error) {
          console.error("Error Fetching Response:", error);
        }
      }
    };
    console.log(
      "Height:",
      updatedData.height,
      "Weight:",
      updatedData.weight,
      "Gender:",
      updatedData.gender,
      "Age:",
      updatedData.year,
      "Months:",
      updatedData.months
    );
    fetchStateOptions();
  }, [
    updatedData.height,
    updatedData.weight,
    updatedData.gender,
    updatedData.year,
    updatedData.months,
  ]);

  useEffect(() => {
    setUpdatedData(props.data);
  }, [props.data]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name === "dob") {
      const selectedDOB = new Date(value);
      const currentDate = new Date();
      const ageInMilliseconds = currentDate - selectedDOB;

      const years = Math.floor(
        ageInMilliseconds / (365.25 * 24 * 60 * 60 * 1000)
      );
      const months = Math.floor(
        (ageInMilliseconds % (365.25 * 24 * 60 * 60 * 1000)) /
          (30.44 * 24 * 60 * 60 * 1000)
      );
      const days = Math.floor(
        (ageInMilliseconds % (30.44 * 24 * 60 * 60 * 1000)) /
          (24 * 60 * 60 * 1000)
      );

      // Set the updated data with year, months, and days
      setUpdatedData({
        ...updatedData,
        [name]: value,
        year: years,
        months: months,
        days: days,
      });
    } else {
      // If the changed input field is not dob, update only its value
      setUpdatedData({
        ...updatedData,
        [name]: value,
      });
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    // const isConfirmed = window.confirm(
    //   "Are you sure you want to update employee details?"
    // );
    if (true) {
      try {
        const updatedDataWithDepartment = {
          ...updatedData,
          age: mainCorporate.age.id,
          gender: mainCorporate.gender.id,
          source: mainCorporate.source.id,
          type: mainCorporate.type.id,
          disease: mainCorporate.disease.id,
          modify_by: userID,
          Workshop_name: updatedData.ws_pk_id,
          tehsil: updatedData.tehsil,
        };

        const response = await axios.put(
          `${Port}/Screening/Citizen_Put_api/${corporateData.citizens_pk_id}/`,
          updatedDataWithDepartment,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          navigate("/mainscreen/Citizen");
          console.log("Data updated successfully:", response.data);
        } else {
          console.error("Unexpected response status:", response.status);
        }
      } catch (error) {
        if (error.response && error.response.status === 409) {
          alert("Employee already registered with the same employee ID.");
        } else {
          console.error("Error updating data:", error);
          alert("An error occurred while updating the data.");
        }
      }
    } else {
      console.log("Update cancelled by user.");
    }
  };

  // const handleUpdate = async (e) => {
  //     e.preventDefault();

  //     const isConfirmed = window.confirm('Are you sure you want to update employee details?');
  //     if (isConfirmed) {
  //         try {
  //             const updatedDataWithDepartment = {
  //                 ...updatedData,
  //                 department_id: selectedDepartmentId,
  //                 age: mainCorporate.age.id,
  //                 gender: mainCorporate.gender.id,
  //                 source: mainCorporate.source.id,
  //                 type: mainCorporate.type.id,
  //                 disease: mainCorporate.disease.id,
  //                 modify_by: userID
  //             };

  //             const response = await axios.put(`${Port}/Screening/add_employee_put/${corporateData.citizens_pk_id}/`, updatedDataWithDepartment, {
  //                 headers: {
  //                     'Authorization': `Bearer ${accessToken}`,
  //                     'Content-Type': 'application/json'
  //                 }
  //             });
  //             navigate('/mainscreen/Citizen');
  //             console.log('Data updated successfully:', response.data);
  //         } catch (error) {
  //             console.error('Error updating data:', error);
  //         }
  //     } else {
  //         console.log('Update cancelled by user.');
  //     }
  // };

  ////////////////////////////////// GET API
  const [departments, setDepartments] = useState([]);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState("");

  console.log(
    updatedData.department_id,
    "departmentcorporateiddddddddddddddddddddddd"
  );

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const accessToken = localStorage.getItem("token"); // Retrieve access token
        const response = await axios.get(
          `${Port}/Screening/get_department/${SourceUrlId}/${SourceNameUrlId}/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        setDepartments(response.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };
    fetchDepartments();
  }, []);

  const handleDepartmentChange = (e) => {
    setSelectedDepartmentId(e.target.value);
    setUpdatedData({
      ...updatedData,
      department: e.target.value,
    });
  };

  const [designation, setDesignation] = useState([]);

  useEffect(() => {
    const fetchDesignation = async () => {
      if (updatedData.department) {
        const apiUrl = `${Port}/Screening/get_designation/${updatedData.department}/${SourceUrlId}/${SourceNameUrlId}/`;
        console.log(apiUrl); // Log the API URL
        try {
          const response = await fetch(apiUrl, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          });
          const data = await response.json();
          console.log(data); // Log the fetched data
          setDesignation(data);
        } catch (error) {
          console.log("Error Fetching Data");
        }
      } else {
        console.log("Error Fetching Data");
      }
    };
    fetchDesignation();
  }, [updatedData.department]);

  const [state, setState] = useState([]);
  console.log("state", state);

  const [district, setDistrict] = useState([]);
  const [tehsil, setTehsil] = useState([]);
  const [sourceName, setSourceName] = useState([]);
  console.log(sourceName, "sourceName");

  // useEffect(() => {
  //     const fetchState = async () => {
  //         if (updatedData.source) {
  //             const apiUrl = `${Port}/Screening/State_Get/`;
  //             console.log(apiUrl);
  //             try {
  //                 const response = await fetch(apiUrl, {
  //                     headers: {
  //                         'Authorization': `Bearer ${accessToken}`,
  //                         'Content-Type': 'application/json'
  //                     }
  //                 });
  //                 const data = await response.json();
  //                 console.log(data, 'fetchStatefetchState');
  //                 setState(data);
  //             } catch (error) {
  //                 console.log('Error Fetching Data');
  //             }
  //         } else {
  //             console.log('Error Fetching Data');
  //         }
  //     };
  //     fetchState();
  // }, [updatedData.source]);

  // useEffect(() => {
  //     const fetchState = async () => {
  //         if (updatedData.source && updatedData.state) {
  //             const apiUrl = `${Port}/Screening/state_and_pass_district_Get/${updatedData.state}/${updatedData.state}/`;
  //             console.log(apiUrl);
  //             try {
  //                 const response = await fetch(apiUrl, {
  //                     headers: {
  //                         'Authorization': `Bearer ${accessToken}`,
  //                         'Content-Type': 'application/json'
  //                     }
  //                 });
  //                 const data = await response.json();
  //                 console.log(data);
  //                 setDistrict(data);
  //             } catch (error) {
  //                 console.log('Error Fetching Data');
  //             }
  //         } else {
  //             console.log('Error Fetching Data');
  //         }
  //     };
  //     fetchState();
  // }, [updatedData.source, updatedData.state]);

  // useEffect(() => {
  //     const fetchTehsil = async () => {
  //         if (updatedData.source && updatedData.district) {
  //             const apiUrl = `${Port}/Screening/district_and_pass_taluka_Get/${updatedData.source}/${updatedData.district}/`;
  //             console.log(apiUrl);
  //             try {
  //                 const response = await fetch(apiUrl, {
  //                     headers: {
  //                         'Authorization': `Bearer ${accessToken}`,
  //                         'Content-Type': 'application/json'
  //                     }
  //                 });
  //                 const data = await response.json();
  //                 console.log(data);
  //                 setTehsil(data);
  //             } catch (error) {
  //                 console.log('Error Fetching Data');
  //             }
  //         } else {
  //             console.log('Error Fetching Data');
  //         }
  //     };
  //     fetchTehsil();
  // }, [updatedData.source, updatedData.district]);

  // useEffect(() => {
  //     const fetchName = async () => {
  //         if (updatedData.source && updatedData.tehsil) {
  //             // const apiUrl = `${Port}/Screening/taluka_and_pass_SourceName_Get/${updatedData.source}/${updatedData.tehsil}/`;
  //             const apiUrl = `${Port}/Screening/taluka_and_pass_SourceName_Get/?SNid=${updatedData.tehsil}&So=${updatedData.source}&source_pk_id=${SourceNameUrlId}`;
  //             console.log(apiUrl);
  //             try {
  //                 const response = await fetch(apiUrl, {
  //                     headers: {
  //                         'Authorization': `Bearer ${accessToken}`,
  //                         'Content-Type': 'application/json'
  //                     }
  //                 });
  //                 const data = await response.json();
  //                 console.log(data);
  //                 setSourceName(data);
  //             } catch (error) {
  //                 console.log('Error Fetching Data');
  //             }
  //         } else {
  //             console.log('Error Fetching Data');
  //         }
  //     };
  //     fetchName();
  // }, [updatedData.source, updatedData.tehsil]);

  useEffect(() => {
    const fetchState = async () => {
      try {
        const apiUrl = `${Port}/Screening/State_Get/`;
        console.log(apiUrl);

        const response = await fetch(apiUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        console.log("State Data:", data);
        setState(data);
      } catch (error) {
        console.log("Error Fetching State");
      }
    };

    fetchState();
  }, []);

  useEffect(() => {
    const fetchDistrict = async () => {
      if (!updatedData.state) return;

      try {
        const apiUrl = `${Port}/Screening/District_Get/${updatedData.state}/`;
        console.log(apiUrl);

        const response = await fetch(apiUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        console.log("District Data:", data);
        setDistrict(data);
      } catch (error) {
        console.log("Error Fetching District");
      }
    };

    fetchDistrict();
  }, [updatedData.state]);

  useEffect(() => {
    const fetchTehsil = async () => {
      if (!updatedData.district) return;

      try {
        const apiUrl = `${Port}/Screening/Tehsil_Get/${updatedData.district}/`;
        console.log(apiUrl);

        const response = await fetch(apiUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        console.log("Tehsil Data:", data);
        setTehsil(data);
      } catch (error) {
        console.log("Error Fetching Tehsil");
      }
    };

    fetchTehsil();
  }, [updatedData.district]);

  useEffect(() => {
    const fetchWorkshop = async () => {
      if (!updatedData.tehsil) return; // wait until tehsil selected

      try {
        const apiUrl = `${Port}/Screening/Workshop_list_get/${updatedData.tehsil}/`;
        console.log(apiUrl);

        const response = await fetch(apiUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        console.log("Workshop List:", data);
        setSourceName(data);
      } catch (error) {
        console.log("Error fetching Workshop list");
      }
    };

    fetchWorkshop();
  }, [updatedData.tehsil]);

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Box component="form" onSubmit={handleUpdate}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              p: 2,
              borderRadius: 3,
              height: "100%",
              boxShadow: 3,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Employee Details
            </Typography>

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
                    name="prefix"
                    value={updatedData.prefix || ""}
                    onChange={handleInputChange}
                    label="Prefix"
                  >
                    <MenuItem value="">Prefix</MenuItem>
                    <MenuItem value="Mr">Mr.</MenuItem>
                    <MenuItem value="Ms">Ms.</MenuItem>
                    <MenuItem value="Mrs">Mrs.</MenuItem>
                    <MenuItem value="Adv">Adv.</MenuItem>
                    <MenuItem value="Col">Col.</MenuItem>
                    <MenuItem value="Dr">Dr.</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={7}>
                <TextField
                  fullWidth
                  size="small"
                  label="Employee Name"
                  name="name"
                  value={updatedData.name || ""}
                  onChange={handleInputChange}
                />
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
                    name="blood_groups"
                    value={updatedData.blood_groups || ""}
                    onChange={handleInputChange}
                    label="Blood Group"
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
                  label="Date of Birth"
                  type="date"
                  name="dob"
                  value={updatedData.dob || ""}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{
                    max: new Date().toISOString().split("T")[0],
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={2}>
                <TextField
                  fullWidth
                  size="small"
                  label="Year"
                  value={updatedData.year || ""}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <TextField
                  fullWidth
                  size="small"
                  label="Month"
                  value={updatedData.months || ""}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <TextField
                  fullWidth
                  size="small"
                  label="Days"
                  value={updatedData.days || ""}
                  InputProps={{ readOnly: true }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Aadhar ID"
                  type="number"
                  name="aadhar_id"
                  value={updatedData.aadhar_id || ""}
                  onChange={handleInputChange}
                  inputProps={{ maxLength: 12 }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Email ID"
                  type="email"
                  name="email_id"
                  value={updatedData.email_id || ""}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  size="small"
                  label="Mobile Number"
                  type="number"
                  name="emp_mobile_no"
                  value={updatedData.emp_mobile_no || ""}
                  onChange={handleInputChange}
                  inputProps={{ maxLength: 10 }}
                />
              </Grid>

              {/* <Grid item xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Department</InputLabel>
                                    <Select sx={{
                                        "& .MuiInputBase-input.MuiSelect-select": {
                                            color: "#000 !important",
                                        },
                                        "& .MuiSvgIcon-root": {
                                            color: "#000",
                                        },
                                    }}
                                        value={updatedData.department || ""}
                                        onChange={handleDepartmentChange}
                                        label="Department"
                                    >
                                        <MenuItem value="">Select</MenuItem>
                                        {departments.map((dept) => (
                                            <MenuItem
                                                key={dept.department_id}
                                                value={dept.department_id}
                                            >
                                                {dept.department}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Designation</InputLabel>
                                    <Select sx={{
                                        "& .MuiInputBase-input.MuiSelect-select": {
                                            color: "#000 !important",
                                        },
                                        "& .MuiSvgIcon-root": {
                                            color: "#000",
                                        },
                                    }}
                                        value={updatedData.designation || ""}
                                        onChange={(e) =>
                                            handleInputChange({
                                                target: {
                                                    name: "designation",
                                                    value: e.target.value,
                                                },
                                            })
                                        }
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
                                </FormControl>
                            </Grid> */}

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  size="small"
                  label="Employee ID"
                  name="employee_id"
                  value={updatedData.employee_id || ""}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  size="small"
                  label="DOJ"
                  name="doj"
                  value={updatedData.doj || ""}
                  onChange={handleInputChange}
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
            <Typography variant="h6" gutterBottom>
              Family Information
            </Typography>

            <Grid container spacing={2}>
              {/* Prefix */}
              <Grid item xs={12} sm={4}>
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
                    name="emergency_prefix"
                    value={updatedData.emergency_prefix || ""}
                    onChange={handleInputChange}
                    label="Prefix"
                  >
                    <MenuItem value="">Prefix</MenuItem>
                    <MenuItem value="Mr">Mr.</MenuItem>
                    <MenuItem value="Ms">Ms.</MenuItem>
                    <MenuItem value="Mrs">Mrs.</MenuItem>
                    <MenuItem value="Dr">Dr.</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Full Name */}
              <Grid item xs={12} sm={8}>
                <TextField
                  fullWidth
                  size="small"
                  label="Full Name"
                  name="emergency_fullname"
                  value={updatedData.emergency_fullname || ""}
                  onChange={handleInputChange}
                />
              </Grid>

              {/* Gender */}
              <Grid item xs={12} sm={4}>
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
                    name="emergency_gender"
                    value={updatedData.emergency_gender || ""}
                    onChange={handleInputChange}
                    label="Gender"
                  >
                    <MenuItem value="">Select</MenuItem>
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Emergency Contact */}
              <Grid item xs={12} sm={8}>
                <TextField
                  fullWidth
                  size="small"
                  label="Emergency Contact Number"
                  type="number"
                  name="emergency_contact"
                  value={updatedData.emergency_contact || ""}
                  onChange={handleInputChange}
                />
              </Grid>

              {/* Email */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Email ID"
                  type="email"
                  name="emergency_email"
                  value={updatedData.emergency_email || ""}
                  onChange={handleInputChange}
                />
              </Grid>

              {/* Relationship */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Relationship With Employee</InputLabel>
                  <Select
                    sx={{
                      "& .MuiInputBase-input.MuiSelect-select": {
                        color: "#000 !important",
                      },
                      "& .MuiSvgIcon-root": {
                        color: "#000",
                      },
                    }}
                    name="relationship_with_employee"
                    value={updatedData.relationship_with_employee || ""}
                    onChange={handleInputChange}
                    label="Relationship With Employee"
                  >
                    <MenuItem value="">Select</MenuItem>
                    {[
                      "Father",
                      "Mother",
                      "Brother",
                      "Sister",
                      "Spouse",
                      "Son",
                      "Daughter",
                    ].map((relation) => (
                      <MenuItem key={relation} value={relation.toLowerCase()}>
                        {relation}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Address */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Present Address"
                  name="emergency_address"
                  value={updatedData.emergency_address || ""}
                  onChange={handleInputChange}
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
            <Typography variant="h6" gutterBottom>
              Growth Monitoring
            </Typography>

            <Grid container spacing={2}>
              {/* Height */}
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  size="small"
                  label="Height"
                  type="number"
                  name="height"
                  value={updatedData.height || ""}
                  onChange={handleInputChange}
                />
              </Grid>

              {/* Weight */}
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  size="small"
                  label="Weight"
                  type="number"
                  name="weight"
                  value={updatedData.weight || ""}
                  onChange={handleInputChange}
                />
              </Grid>

              {/* BMI */}
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  size="small"
                  label="BMI"
                  name="bmi"
                  value={updatedData.bmi || ""}
                  onChange={handleInputChange}
                  InputProps={{ readOnly: true }}
                />
              </Grid>

              {/* Arm Size */}
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  size="small"
                  label="Arm Size"
                  type="number"
                  name="arm_size"
                  value={updatedData.arm_size || ""}
                  onChange={handleInputChange}
                  onInput={(e) => {
                    if (e.target.value < 0) e.target.value = 0;
                    if (e.target.value.length > 3)
                      e.target.value = e.target.value.slice(0, 3);
                  }}
                />
              </Grid>

              {/* Symptoms */}
              <Grid item xs={12} sm={8}>
                <TextField
                  fullWidth
                  size="small"
                  label="Symptoms (if any)"
                  name="symptoms"
                  value={updatedData.symptoms || ""}
                  onChange={handleInputChange}
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
              borderRadius: 3,
              height: "100%",
              boxShadow: 3,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Address
            </Typography>

            <Grid container spacing={2}>
              {/* State */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>State</InputLabel>
                  <Select
                    sx={{
                      "& .MuiInputBase-input.MuiSelect-select": {
                        color: "#000 !important",
                      },
                      "& .MuiSvgIcon-root": {
                        color: "#000",
                      },
                    }}
                    value={updatedData.state || ""}
                    label="State"
                    onChange={(e) =>
                      setUpdatedData({ ...updatedData, state: e.target.value })
                    }
                  >
                    <MenuItem value="">Select State</MenuItem>
                    {state.map((s) => (
                      <MenuItem key={s.state_id} value={s.state_id}>
                        {s.state_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* District */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>District</InputLabel>
                  <Select
                    sx={{
                      "& .MuiInputBase-input.MuiSelect-select": {
                        color: "#000 !important",
                      },
                      "& .MuiSvgIcon-root": {
                        color: "#000",
                      },
                    }}
                    value={updatedData.district || ""}
                    label="District"
                    onChange={(e) =>
                      setUpdatedData({
                        ...updatedData,
                        district: e.target.value,
                      })
                    }
                  >
                    <MenuItem value="">Select District</MenuItem>
                    {district.map((d) => (
                      <MenuItem key={d.dist_id} value={d.dist_id}>
                        {d.dist_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Tehsil */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Tehsil</InputLabel>
                  <Select
                    sx={{
                      "& .MuiInputBase-input.MuiSelect-select": {
                        color: "#000 !important",
                      },
                      "& .MuiSvgIcon-root": {
                        color: "#000",
                      },
                    }}
                    value={updatedData.tehsil || ""}
                    label="Tehsil"
                    onChange={(e) =>
                      setUpdatedData({ ...updatedData, tehsil: e.target.value })
                    }
                  >
                    <MenuItem value="">Select Tehsil</MenuItem>
                    {tehsil.map((t) => (
                      <MenuItem key={t.tal_id} value={t.tal_id}>
                        {t.tahsil_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Source Name */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Workshop Name</InputLabel>
                  <Select
                    sx={{
                      "& .MuiInputBase-input.MuiSelect-select": {
                        color: "#000 !important",
                      },
                      "& .MuiSvgIcon-root": {
                        color: "#000",
                      },
                    }}
                    value={updatedData.Workshop_name || ""}
                    label="Source Name"
                    onChange={(e) =>
                      setUpdatedData({
                        ...updatedData,
                        Workshop_name: e.target.value,
                      })
                    }
                  >
                    <MenuItem value="">Select Source Name</MenuItem>
                    {sourceName.map((src) => (
                      <MenuItem key={src.ws_pk_id} value={src.ws_pk_id}>
                        {src.Workshop_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Address */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Address"
                  name="address"
                  value={updatedData.address || ""}
                  onChange={handleInputChange}
                />
              </Grid>

              {/* Permanent Address */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Permanent Address"
                  name="permanant_address"
                  value={updatedData.permanant_address || ""}
                  onChange={handleInputChange}
                />
              </Grid>

              {/* Pincode */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Pincode"
                  type="number"
                  name="pincode"
                  value={updatedData.pincode || ""}
                  onChange={handleInputChange}
                  onInput={(e) => {
                    if (e.target.value < 0) e.target.value = 0;
                    if (e.target.value.length > 6)
                      e.target.value = e.target.value.slice(0, 6);
                  }}
                />
              </Grid>

              {/* <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Site Plant"
                                    name="site_plant"
                                    value={updatedData.site_plant || ""}
                                    onChange={handleInputChange}
                                />
                            </Grid> */}
            </Grid>
          </Card>
        </Grid>

        <Grid item xs={12} textAlign="center">
          <Button
            variant="contained"
            color="primary"
            size="small"
            type="submit"
            // onSubmit={handleUpdate}
          >
            Update
          </Button>
        </Grid>
        <Snackbar
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={handleClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            Updated Successfully
          </Alert>
        </Snackbar>
      </Grid>
    </Box>
  );
};

export default CorporateUpdate;
