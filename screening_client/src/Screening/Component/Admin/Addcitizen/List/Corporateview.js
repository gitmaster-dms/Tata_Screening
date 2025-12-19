import React from "react";
import {
    Grid,
    Box,
    Typography,
    TextField,
    Select,
    MenuItem,
    Paper,
    FormControl,
    InputLabel,
    Card
} from "@mui/material";

const Corporate = ({ data }) => {
    const d = data || {};

    return (
        <Box sx={{ p: 1 }}>
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
                        <Typography variant="h6" fontWeight={500} sx={{ fontFamily: "Roboto", mb: 2 }}>
                            Employee Details
                        </Typography>

                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={3}>
                                <FormControl fullWidth>
                                    <InputLabel>Prefix</InputLabel>
                                    <Select size="small" value={d.prefix } >
                                        <MenuItem value="Mr. ">Mr.</MenuItem>
                                        <MenuItem value="Ms">Ms.</MenuItem>
                                        <MenuItem value="Mrs">Mrs.</MenuItem>
                                        <MenuItem value="Adv">Adv.</MenuItem>
                                        <MenuItem value="Col">Col.</MenuItem>
                                        <MenuItem value="Dr">Dr.</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={5}>
                                <TextField size="small"
                                    label="Employee Name"
                                    fullWidth
                                    value={d.name || ""}
                                    // InputProps={{ readOnly: true }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <FormControl fullWidth variant="outlined" size="small">
                                    <InputLabel shrink>Blood Group</InputLabel>
                                    <Select
                                        value={d.blood_groups || ""}
                                        disabled
                                        label="Blood Group"
                                        displayEmpty
                                        renderValue={(value) => value || " "}
                                    >
                                        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                                            <MenuItem key={bg} value={bg}>
                                                {bg}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField size="small"
                                    label="Date of Birth"
                                    type="date"
                                    fullWidth
                                    value={d.dob || ""}
                                    InputLabelProps={{ shrink: true }}
                                    InputProps={{ readOnly: true }}
                                />
                            </Grid>

                            <Grid item xs={4} sm={2}>
                                <TextField size="small"
                                    label="Year"
                                    fullWidth
                                    value={d.year || ""}
                                    InputProps={{ readOnly: true }}
                                />
                            </Grid>
                            <Grid item xs={4} sm={2}>
                                <TextField size="small"
                                    label="Month"
                                    fullWidth
                                    value={d.months || ""}
                                    InputProps={{ readOnly: true }}
                                />
                            </Grid>
                            <Grid item xs={4} sm={2}>
                                <TextField size="small"
                                    label="Days"
                                    fullWidth
                                    value={d.days || ""}
                                    InputProps={{ readOnly: true }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <TextField size="small"
                                    label="Aadhar ID"
                                    fullWidth
                                    value={d.aadhar_id || ""}
                                    InputProps={{ readOnly: true }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField size="small"
                                    label="Email ID"
                                    fullWidth
                                    value={d.email_id || ""}
                                    InputProps={{ readOnly: true }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField size="small"
                                    label="Mobile Number"
                                    fullWidth
                                    value={d.emp_mobile_no || ""}
                                    InputProps={{ readOnly: true }}
                                />
                            </Grid>

                            {/* <Grid item xs={12} sm={4}>
                                <TextField size="small"
                                    label="Department"
                                    fullWidth
                                    value={d.department_name || ""}
                                    InputProps={{ readOnly: true }}
                                />
                            </Grid> */}
                            {/* <Grid item xs={12} sm={4}>
                                <TextField size="small"
                                    label="Designation"
                                    fullWidth
                                    value={d.designation_name || ""}
                                    InputProps={{ readOnly: true }}
                                />
                            </Grid> */}
                            {/* <Grid item xs={12} sm={4}>
                                <TextField size="small"
                                    label="Employee ID"
                                    fullWidth
                                    value={d.employee_id || ""}
                                    InputProps={{ readOnly: true }}
                                />
                            </Grid> */}
                            {/* <Grid item xs={12} sm={4}>
                                <TextField size="small"
                                    label="DOJ"
                                    type="date"
                                    fullWidth
                                    value={d.doj || ""}
                                    InputLabelProps={{ shrink: true }}
                                    InputProps={{ readOnly: true }}
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
                        <Typography variant="h6" fontWeight={500} sx={{ fontFamily: "Roboto", mb: 2 }}>
                            Emergency Information
                        </Typography>

                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={3}>
                                <FormControl fullWidth>
                                    <InputLabel>Prefix</InputLabel>
                                    <Select size="small" value={d.emergency_prefix || ""} disabled  renderValue={(value) => value || " "}>
                                        {["Mr", "Ms", "Mrs", "Adv", "Col", "Dr"].map((p) => (
                                            <MenuItem key={p} value={p}>
                                                {p}.
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField size="small"
                                    label="Full Name"
                                    fullWidth
                                    value={d.emergency_fullname || ""}
                                    InputProps={{ readOnly: true }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <FormControl fullWidth>
                                    <InputLabel>Gender</InputLabel>
                                    <Select size="small" value={d.gender_name || ""} disabled>
                                        <MenuItem value="Male">Male</MenuItem>
                                        <MenuItem value="Female">Female</MenuItem>
                                        <MenuItem value="Other">Other</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField size="small"
                                    label="Emergency Contact"
                                    fullWidth
                                    value={d.emergency_contact || ""}
                                    InputProps={{ readOnly: true }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField size="small"
                                    label="Email ID"
                                    fullWidth
                                    value={d.emergency_email || ""}
                                    InputProps={{ readOnly: true }}
                                />
                            </Grid>

                            {/* <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Relationship</InputLabel>
                                    <Select size="small"
                                        value={d.relationship_with_employee || ""}
                                        disabled
                                    >
                                        {[
                                            "father",
                                            "mother",
                                            "brother",
                                            "sister",
                                            "spouse",
                                            "son",
                                            "daughter",
                                        ].map((r) => (
                                            <MenuItem key={r} value={r}>
                                                {r.charAt(0).toUpperCase() + r.slice(1)}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid> */}

                            <Grid item xs={12} sm={6}>
                                <TextField size="small"
                                    label="Present Address"
                                    fullWidth
                                    value={d.emergency_address || ""}
                                    InputProps={{ readOnly: true }}
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
                        <Typography variant="h6" fontWeight={500} sx={{ fontFamily: "Roboto", mb: 2 }}>
                            Growth Monitoring
                        </Typography>

                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                                <TextField size="small"
                                    label="Height"
                                    fullWidth
                                    value={d.height || ""}
                                    InputProps={{ readOnly: true }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField size="small"
                                    label="Weight"
                                    fullWidth
                                    value={d.weight || ""}
                                    InputProps={{ readOnly: true }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField size="small"
                                    label="BMI"
                                    fullWidth
                                    value={d.bmi || ""}
                                    InputProps={{ readOnly: true }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField size="small"
                                    label="Arm Size"
                                    fullWidth
                                    value={d.arm_size || ""}
                                    InputProps={{ readOnly: true }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={8}>
                                <TextField size="small"
                                    label="Symptoms (if any)"
                                    fullWidth
                                    value={d.symptoms || ""}
                                    InputProps={{ readOnly: true }}
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
                        <Typography variant="h6" fontWeight={500} sx={{ fontFamily: "Roboto", mb: 2 }}>
                            Address
                        </Typography>

                        <Grid container spacing={2}>
                            {[
                                ["State", d.state_name],
                                ["District", d.district_name],
                                ["Tehsil", d.tehsil_name],
                                ["WorkShop Name", d.source_name_id],
                            ].map(([label, value]) => (
                                <Grid key={label} item xs={12} sm={6}>
                                    <TextField size="small"
                                        label={label}
                                        fullWidth
                                        value={value || ""}
                                        InputProps={{ readOnly: true }}
                                    />
                                </Grid>
                            ))}

                            <Grid item xs={12} sm={6}>
                                <TextField size="small"
                                    label="Address"
                                    fullWidth
                                    value={d.address || ""}
                                    InputProps={{ readOnly: true }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField size="small"
                                    label="Permanent Address"
                                    fullWidth
                                    value={d.permanant_address || ""}
                                    InputProps={{ readOnly: true }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField size="small"
                                    label="Pincode"
                                    fullWidth
                                    value={d.pincode || ""}
                                    InputProps={{ readOnly: true }}
                                />
                            </Grid>
                            {/* <Grid item xs={12} sm={6}>
                                <TextField size="small"
                                    label="Site Plant"
                                    fullWidth
                                    value={d.site_plant || ""}
                                    InputProps={{ readOnly: true }}
                                />
                            </Grid> */}
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Corporate;
