import React, { useState, useEffect } from "react";
import {
    Grid,
    Card,
    Typography,
    TextField,
    Select,
    MenuItem,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Snackbar,
    Alert,
} from "@mui/material";

const FamilyInfo = ({ citizensPkId, pkid, fetchVital, selectedName, onAcceptClick }) => {
    const [nextName, setNextName] = useState("");
    const [updateId, setUpdateId] = useState("");
    const [familyData, setFamilyData] = useState({});
    const [openConfirm, setOpenConfirm] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    const userID = localStorage.getItem("userID");
    const accessToken = localStorage.getItem("token");
    const source = localStorage.getItem("source");
    const Port = process.env.REACT_APP_API_KEY;

    // get next name logic
    useEffect(() => {
        if (fetchVital && selectedName) {
            const currentIndex = fetchVital.findIndex((item) => item.screening_list === selectedName);
            if (currentIndex !== -1 && currentIndex < fetchVital.length - 1) {
                setNextName(fetchVital[currentIndex + 1].screening_list);
            } else {
                setNextName("");
            }
        }
    }, [selectedName, fetchVital]);

    // fetch data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${Port}/Screening/citizen_family_info_get/${pkid}/`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                if (!response.ok) throw new Error(`Failed to fetch. Status: ${response.status}`);
                const data = await response.json();
                const familyData = data[0];
                setFamilyData(familyData);
                setUpdateId(familyData?.citizen_id);
            } catch (error) {
                console.error("Error fetching family data:", error);
            }
        };
        fetchData();
    }, [citizensPkId]);

    // update data
    const updateDataInDatabase = async (citizen_id) => {
        try {
            const response = await fetch(`${Port}/Screening/citizen_family_info_put/${citizen_id}/`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...familyData.citizen_info,
                    citizen_id: familyData.citizen_id,
                    schedule_id: familyData.schedule_id,
                    added_by: userID,
                    modify_by: userID,
                    form_submit: "True",
                }),
            });

            if (response.ok) {
                setSnackbar({ open: true, message: "Data updated successfully", severity: "success" });
                if (nextName) onAcceptClick(nextName);
            } else {
                setSnackbar({ open: true, message: "Update failed. Try again.", severity: "error" });
            }
        } catch (error) {
            console.error("Error updating:", error);
            setSnackbar({ open: true, message: "Something went wrong", severity: "error" });
        }
    };

    const handleSubmit = () => setOpenConfirm(true);
    const handleConfirm = async () => {
        setOpenConfirm(false);
        if (updateId) await updateDataInDatabase(updateId);
    };

    return (
        <Grid container justifyContent="center" sx={{ mt: 1 }}>
            <Grid item xs={12} md={12}>
                <Card sx={{ borderRadius: "20px", p: 1, mb: 1, background: "linear-gradient(90deg, #039BEF 0%, #1439A4 100%)" }}>
                    <Grid container alignItems="center" justifyContent="space-between">
                        <Typography sx={{ fontWeight: 600, fontFamily: "Roboto", fontSize: "16px", color: "white" }}>
                            {source === "5" ? "Emergency Information" : "Family Information"}
                        </Typography>
                    </Grid>
                </Card>

                <Card sx={{ p: 2, borderRadius: 3, boxShadow: 3,borderRadius: "20px",  }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Father Name"
                                size="small"
                                value={familyData?.citizen_info?.father_name || ""}
                                onChange={(e) =>
                                    setFamilyData({
                                        ...familyData,
                                        citizen_info: { ...familyData.citizen_info, father_name: e.target.value.replace(/[0-9]/g, "") },
                                    })
                                }
                            />
                        </Grid>

                        {/* Mother Name */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Mother Name"
                                size="small"
                                value={familyData?.citizen_info?.mother_name || ""}
                                onChange={(e) =>
                                    setFamilyData({
                                        ...familyData,
                                        citizen_info: { ...familyData.citizen_info, mother_name: e.target.value.replace(/[0-9]/g, "") },
                                    })
                                }
                            />
                        </Grid>

                        {/* Occupations */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Occupation of Father"
                                size="small"
                                value={familyData?.citizen_info?.occupation_of_father || ""}
                                onChange={(e) =>
                                    setFamilyData({
                                        ...familyData,
                                        citizen_info: { ...familyData.citizen_info, occupation_of_father: e.target.value },
                                    })
                                }
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Occupation of Mother"
                                size="small"
                                value={familyData?.citizen_info?.occupation_of_mother || ""}
                                onChange={(e) =>
                                    setFamilyData({
                                        ...familyData,
                                        citizen_info: { ...familyData.citizen_info, occupation_of_mother: e.target.value },
                                    })
                                }
                            />
                        </Grid>

                        {/* Parents Mobile */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Parents Mobile"
                                size="small"
                                type="tel"
                                inputProps={{ maxLength: 13 }}
                                value={familyData?.citizen_info?.parents_mobile || ""}
                                onChange={(e) =>
                                    setFamilyData({
                                        ...familyData,
                                        citizen_info: { ...familyData.citizen_info, parents_mobile: e.target.value },
                                    })
                                }
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Select sx={{
                                "& .MuiInputBase-input.MuiSelect-select": {
                                    color: "#000 !important",
                                },
                                "& .MuiSvgIcon-root": {
                                    color: "#000",
                                },
                            }}
                                fullWidth
                                size="small"
                                value={familyData?.citizen_info?.sibling_count || ""}
                                onChange={(e) =>
                                    setFamilyData({
                                        ...familyData,
                                        citizen_info: { ...familyData.citizen_info, sibling_count: e.target.value },
                                    })
                                }
                            >
                                <MenuItem value="">Select</MenuItem>
                                {[0, 1, 2, 3, 4].map((num) => (
                                    <MenuItem key={num} value={num}>
                                        {num}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>

                        {/* Marital Status */}
                        <Grid item xs={12} sm={6}>
                            <Select sx={{
                                "& .MuiInputBase-input.MuiSelect-select": {
                                    color: "#000 !important",
                                },
                                "& .MuiSvgIcon-root": {
                                    color: "#000",
                                },
                            }}
                                fullWidth
                                size="small"
                                value={familyData?.citizen_info?.marital_status || ""}
                                onChange={(e) =>
                                    setFamilyData({
                                        ...familyData,
                                        citizen_info: { ...familyData.citizen_info, marital_status: e.target.value },
                                    })
                                }
                            >
                                <MenuItem value="">Select</MenuItem>
                                <MenuItem value="Married">Married</MenuItem>
                                <MenuItem value="Unmarried">Unmarried</MenuItem>
                                <MenuItem value="Widow">Widow/Widower</MenuItem>
                            </Select>
                        </Grid>

                        {/* Child Count */}
                        <Grid item xs={12} sm={6}>
                            <Select sx={{
                                "& .MuiInputBase-input.MuiSelect-select": {
                                    color: "#000 !important",
                                },
                                "& .MuiSvgIcon-root": {
                                    color: "#000",
                                },
                            }}
                                fullWidth
                                size="small"
                                value={familyData?.citizen_info?.child_count || ""}
                                onChange={(e) =>
                                    setFamilyData({
                                        ...familyData,
                                        citizen_info: { ...familyData.citizen_info, child_count: e.target.value },
                                    })
                                }
                            >
                                <MenuItem value="">Select</MenuItem>
                                {[0, 1, 2, 3, 4].map((num) => (
                                    <MenuItem key={num} value={num}>
                                        {num}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>

                        {/* Spouse Name */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Spouse Name"
                                size="small"
                                value={familyData?.citizen_info?.spouse_name || ""}
                                onChange={(e) =>
                                    setFamilyData({
                                        ...familyData,
                                        citizen_info: { ...familyData.citizen_info, spouse_name: e.target.value },
                                    })
                                }
                            />
                        </Grid>

                        {/* Accept Button */}
                        <Grid item xs={12} sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{ textTransform: "none", borderRadius: 2, px: 4 }}
                                onClick={handleSubmit}
                            >
                                Accept
                            </Button>
                        </Grid>
                    </Grid>
                </Card>
            </Grid>

            <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
                <DialogTitle>Confirm Submission</DialogTitle>
                <DialogContent>Are you sure you want to submit the Family Info Form?</DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenConfirm(false)}>Cancel</Button>
                    <Button onClick={handleConfirm} variant="contained" color="primary">
                        Yes, Submit
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
            </Snackbar>
        </Grid>
    );
};

export default FamilyInfo;
