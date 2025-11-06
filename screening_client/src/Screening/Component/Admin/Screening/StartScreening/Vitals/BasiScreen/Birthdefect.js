import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Box,
    Grid,
    Typography,
    Checkbox,
    FormControlLabel,
    Button,
    Paper,
} from "@mui/material";

const Birthdefect = ({ pkid, onAcceptClick, citizensPkId, selectedTab, subVitalList }) => {
    const [nextName, setNextName] = useState("");
    const [auditoryCheckBox, setAuditoryCheckBox] = useState([]);
    const [formData, setFormData] = useState({
        checkboxes: [],
        selectedNames: [],
        citizen_pk_id: citizensPkId,
        modify_by: localStorage.getItem("userID"),
    });

    const Port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem("token");
    const basicScreeningPkId = localStorage.getItem("basicScreeningId");

    // ✅ Compute Next Tab
    useEffect(() => {
        if (subVitalList && selectedTab) {
            const currentIndex = subVitalList.findIndex(
                (item) => item.screening_list === selectedTab
            );

            if (currentIndex !== -1 && currentIndex < subVitalList.length - 1) {
                const nextItem = subVitalList[currentIndex + 1];
                setNextName(nextItem.screening_list);
            } else {
                setNextName("");
            }
        }
    }, [selectedTab, subVitalList]);

    // ✅ Fetch Birth Defect Options
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${Port}/Screening/birth_defect/`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                setAuditoryCheckBox(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, [Port, accessToken]);

    // ✅ Fetch Existing Citizen Screening Info
    useEffect(() => {
        const fetchDataById = async (pkid) => {
            try {
                const response = await fetch(
                    `${Port}/Screening/citizen_basic_screening_info_get/${pkid}/`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    if (Array.isArray(data) && data.length > 0) {
                        const screeningInfo = data[0];
                        const birthDefectsData = screeningInfo.birth_defects || [];

                        const initialCheckboxes = auditoryCheckBox.map((item) =>
                            birthDefectsData.includes(item.birth_defects)
                        );

                        setFormData((prev) => ({
                            ...prev,
                            checkboxes: initialCheckboxes,
                            selectedNames: birthDefectsData,
                        }));
                    }
                } else {
                    console.error("Server Error:", response.status, response.statusText);
                }
            } catch (error) {
                console.error("Error fetching data:", error.message);
            }
        };

        fetchDataById(pkid);
    }, [pkid, auditoryCheckBox, Port, accessToken]);

    // ✅ Handle Checkbox Change
    const handleCheckboxChange = (index) => {
        const updatedCheckboxes = [...formData.checkboxes];
        updatedCheckboxes[index] = !updatedCheckboxes[index];

        const selectedNames = auditoryCheckBox
            .filter((item, i) => updatedCheckboxes[i])
            .map((item) => item.birth_defects);

        setFormData({
            ...formData,
            checkboxes: updatedCheckboxes,
            selectedNames,
        });
    };

    // ✅ Submit Handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        const postData = { birth_defects: formData.selectedNames };

        try {
            const response = await axios.put(
                `${Port}/Screening/birth_defect/${basicScreeningPkId}/`,
                postData,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (window.confirm("Submit Birth Defect Form") && response.status === 200) {
                const responseData = response.data;
                console.log("Form Submitted Successfully");
                onAcceptClick(nextName, responseData.basic_screening_pk_id);
            } else if (response.status === 400) {
                console.error("Bad Request:", response.data);
            }
        } catch (error) {
            console.error("Error posting data:", error);
        }
    };

    return (
        <Box>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, fontSize: '17px' }}>
                Birth Defects
            </Typography>

            <Grid container>
                {auditoryCheckBox.map((item, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={formData.checkboxes[index] || false}
                                    onChange={() => handleCheckboxChange(index)}
                                    sx={{
                                        color: "#1976d2",
                                        "&.Mui-checked": { color: "#1976d2" },
                                    }}
                                />
                            }
                            label={
                                <Typography variant="body2" sx={{ color: "#000" }}>
                                    {item.birth_defects}
                                </Typography>
                            }
                        />
                    </Grid>
                ))}

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
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="medium"
                        onClick={handleSubmit}
                        sx={{
                            textTransform: "none",
                            borderRadius: 2,
                        }}
                    >
                        Submit
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Birthdefect;
