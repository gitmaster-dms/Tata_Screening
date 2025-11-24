import React, { useState } from "react";
import {
  Box,
  Grid,
  Card,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";

const CitizenView = ({ data }) => {
  const citizendata = data || {};
  console.log("citizendata", citizendata?.state_name);
  const [formData, setFormData] = useState({
    state: citizendata.state || "",
  });
  const citizendata1 = {
    name: "Sneha Patil",
    blood_groups: "B+",
    dob: "2015-06-15",
    year: "8",
    months: "5",
    days: "12",
    aadhar_id: "1234 5678 9012",
    class_name: "5th",
    division_name: "A",
    father_name: "Rajesh Patil",
    mother_name: "Sunita Patil",
    occupation_of_father: "Engineer",
    occupation_of_mother: "Teacher",
    parents_mobile: "9876543210",
    sibling_count: "1",
    height: "120 cm",
    weight: "25 kg",
    weight_for_age: "Normal",
    height_for_age: "Normal",
    bmi: "17.3",
    weight_for_height: "Normal",
    arm_size: "15 cm",
    symptoms: "None",
    state_name: "Maharashtra",
    district_name: "Pune",
    tehsil_name: "Haveli",
    source_name_name: "Hospital",
    pincode: "411001",
    address: "123, Main Street, Pune",
  };
  console.log(formData, "formData");

  // Handle select change

  const handleSelectChange = (event) => {
    const value = event.target.value;
    setFormData({ ...formData, state: value });
    console.log("Selected state:", value); // logs correctly
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ maxWidth: "1300px", margin: "auto" }}>
        <Grid container spacing={2}>
          {/* ------------------ CITIZEN DETAILS ------------------ */}
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 2 }}>
              <Typography variant="h6" fontWeight="bold">
                CITIZEN DETAILS
              </Typography>

              <Grid container spacing={2} mt={1}>
                <Grid item xs={12} md={8}>
                  <TextField
                    size="small"
                    fullWidth
                    label="Citizen Name"
                    value={citizendata.name || ""}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <Select
                    size="small"
                    fullWidth
                    value={citizendata.blood_groups || ""}
                     sx={{
                        bgcolor: "#fff", // background color
                        color: "#c2da10ff !important", // selected text color
                        "& .MuiOutlinedInput-input": {
                          // targets displayed text
                          color: "#000 !important",
                        },
                      }}
                  >
                    <MenuItem value={citizendata.blood_groups || ""}>
                      {citizendata.blood_groups}
                    </MenuItem>
                  </Select>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    size="small"
                    fullWidth
                    label="Date of Birth"
                    type="date"
                    value={citizendata.dob || ""}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={4} md={2}>
                  <TextField
                    size="small"
                    fullWidth
                    label="Year"
                    value={citizendata.year || ""}
                  />
                </Grid>

                <Grid item xs={4} md={2}>
                  <TextField
                    size="small"
                    fullWidth
                    label="Months"
                    value={citizendata.months || ""}
                  />
                </Grid>

                <Grid item xs={4} md={2}>
                  <TextField
                    size="small"
                    fullWidth
                    label="Days"
                    value={citizendata.days || ""}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    size="small"
                    fullWidth
                    label="Aadhar ID"
                    value={citizendata.aadhar_id || ""}
                  />
                </Grid>

                <Grid item xs={6} md={3}>
                  <Select
                    size="small"
                    fullWidth
                    value={citizendata.class || ""}
                     sx={{
                        bgcolor: "#fff", // background color
                        color: "#c2da10ff !important", // selected text color
                        "& .MuiOutlinedInput-input": {
                          // targets displayed text
                          color: "#000 !important",
                        },
                      }}
                  >
                    <MenuItem value={citizendata.class || ""}>
                      {citizendata.class_name}
                    </MenuItem>
                  </Select>
                </Grid>

                <Grid item xs={6} md={3}>
                  <Select
                    size="small"
                    fullWidth
                    value={citizendata.division || ""}
                     sx={{
                        bgcolor: "#fff", // background color
                        color: "#c2da10ff !important", // selected text color
                        "& .MuiOutlinedInput-input": {
                          // targets displayed text
                          color: "#000 !important",
                        },
                      }}
                  >
                    <MenuItem value={citizendata.division || ""}>
                      {citizendata.division_name}
                    </MenuItem>
                  </Select>
                </Grid>
              </Grid>
            </Card>
          </Grid>

          {/* ------------------ FAMILY INFORMATION ------------------ */}
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 2 }}>
              <Typography variant="h6" fontWeight="bold">
                FAMILY INFORMATION
              </Typography>

              <Grid container spacing={2} mt={1}>
                <Grid item xs={12} md={6}>
                  <TextField
                    size="small"
                    fullWidth
                    label="Father Name"
                    value={citizendata.father_name || ""}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    size="small"
                    fullWidth
                    label="Mother Name"
                    value={citizendata.mother_name || ""}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    size="small"
                    fullWidth
                    label="Occupation (Father)"
                    value={citizendata.occupation_of_father || ""}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    size="small"
                    fullWidth
                    label="Occupation (Mother)"
                    value={citizendata.occupation_of_mother || ""}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    size="small"
                    fullWidth
                    label="Contact Number"
                    value={citizendata.parents_mobile || ""}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Select
                    size="small"
                    fullWidth
                    value={citizendata.sibling_count || ""}
                  >
                    <MenuItem value={citizendata.sibling_count || ""}>
                      {citizendata.sibling_count}
                    </MenuItem>
                  </Select>
                </Grid>
              </Grid>
            </Card>
          </Grid>

          {/* ------------------ GROWTH MONITORING ------------------ */}
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 2 }}>
              <Typography variant="h6" fontWeight="bold">
                GROWTH MONITORING
              </Typography>

              <Grid container spacing={2} mt={1}>
                <Grid item xs={12} md={4}>
                  <TextField
                    size="small"
                    fullWidth
                    label="Height"
                    value={citizendata.height || ""}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    size="small"
                    fullWidth
                    label="Weight"
                    value={citizendata.weight || ""}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    size="small"
                    fullWidth
                    label="Weight for Age"
                    value={citizendata.weight_for_age || ""}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    size="small"
                    fullWidth
                    label="Height for Age"
                    value={citizendata.height_for_age || ""}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    size="small"
                    fullWidth
                    label="BMI"
                    value={citizendata.bmi || ""}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    size="small"
                    fullWidth
                    label="Weight for Height"
                    value={citizendata.weight_for_height || ""}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    size="small"
                    fullWidth
                    label="Arm Size"
                    value={citizendata.arm_size || ""}
                  />
                </Grid>

                <Grid item xs={12} md={8}>
                  <TextField
                    size="small"
                    fullWidth
                    label="Symptoms"
                    value={citizendata.symptoms || ""}
                  />
                </Grid>
              </Grid>
            </Card>
          </Grid>

          {/* ------------------ ADDRESS ------------------ */}
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 2.5 }}>
              <Typography variant="h6" fontWeight="bold">
                ADDRESS
              </Typography>

              <Grid container spacing={1} mt={2.5}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth size="small">
                    <Select
                      value={citizendata.state_name || ""}
                      sx={{
                        bgcolor: "#fff", // background color
                        color: "#c2da10ff !important", // selected text color
                        "& .MuiOutlinedInput-input": {
                          // targets displayed text
                          color: "#000 !important",
                        },
                      }}
                    >
                      <MenuItem value={citizendata.state_name}>
                        {citizendata.state_name || "Select State"}
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Select
                    fullWidth
                    size="small"
                    value={citizendata.district || ""}
                    displayEmpty
                    renderValue={() => citizendata.district_name}
                     sx={{
                        bgcolor: "#fff", // background color
                        color: "#c2da10ff !important", // selected text color
                        "& .MuiOutlinedInput-input": {
                          // targets displayed text
                          color: "#000 !important",
                        },
                      }}
                  >
                    <MenuItem value=""></MenuItem>
                    <MenuItem value={citizendata.district}>
                      {citizendata.district_name}
                    </MenuItem>
                  </Select>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Select
                    fullWidth
                    size="small"
                    value={citizendata.tehsil || ""}
                    displayEmpty
                    renderValue={() => citizendata.tehsil_name}
                     sx={{
                        bgcolor: "#fff", // background color
                        color: "#c2da10ff !important", // selected text color
                        "& .MuiOutlinedInput-input": {
                          // targets displayed text
                          color: "#000 !important",
                        },
                      }}
                  >
                    <MenuItem value=""></MenuItem>
                    <MenuItem value={citizendata.tehsil}>
                      {citizendata.tehsil_name}
                    </MenuItem>
                  </Select>
                </Grid>

                {/* <Grid item xs={12} md={6}>
                  <Select
                    fullWidth
                    size="small"
                    value={citizendata.source || ""}
                    displayEmpty
                    renderValue={() => citizendata.source_name_name}
                  >
                    <MenuItem value=""></MenuItem>
                    <MenuItem value={citizendata.source}>
                      {citizendata.source_name_name}
                    </MenuItem>
                  </Select>
                </Grid> */}

                <Grid item xs={12} md={6}>
                  <TextField
                    size="small"
                    fullWidth
                    label="Pincode"
                    value={citizendata.pincode || ""}
                  />
                </Grid>

                <Grid item xs={12} md={8}>
                  <TextField
                    size="small"
                    fullWidth
                    label="Address"
                    value={citizendata.address || ""}
                  />
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default CitizenView;
