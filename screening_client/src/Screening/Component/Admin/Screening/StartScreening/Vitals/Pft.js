import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Box,
    Grid,
    Card,
    Typography,
    TextField,
    Button,
    LinearProgress,
} from "@mui/material";

const Pft = ({ citizensPkId, pkid, fetchVital, selectedName, onAcceptClick }) => {
    //_______________________ State Handling _______________________
    const [nextName, setNextName] = useState("");
    const [pftReading, setPftReading] = useState("");
    const [pftRemark, setPftRemark] = useState("");
    const accessToken = localStorage.getItem("token");
    const userID = localStorage.getItem("userID");
    const Port = process.env.REACT_APP_API_KEY;

    //_______________________ Determine Next Screening _______________________
    useEffect(() => {
        if (fetchVital && selectedName) {
            const currentIndex = fetchVital.findIndex(
                (item) => item.screening_list === selectedName
            );
            if (currentIndex !== -1 && currentIndex < fetchVital.length - 1) {
                const nextItem = fetchVital[currentIndex + 1];
                setNextName(nextItem.screening_list);
            } else {
                setNextName("");
            }
        }
    }, [selectedName, fetchVital]);

    //_______________________ Fetch PFT Remark on Reading Change _______________________
    useEffect(() => {
        if (pftReading) {
            const fetchData = async () => {
                try {
                    const response = await axios.get(`${Port}/Screening/pft/${pftReading}/`, {
                        headers: { Authorization: `Bearer ${accessToken}` },
                    });
                    setPftRemark(response.data);
                } catch (error) {
                    console.error("Error fetching remark:", error);
                }
            };
            fetchData();
        }
    }, [pftReading]);

    //_______________________ Fetch Existing PFT Data _______________________
    useEffect(() => {
        const fetchFormData = async () => {
            try {
                const response = await axios.get(`${Port}/Screening/pft_info_get/${pkid}`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                if (response.data.length > 0) {
                    setPftReading(response.data[0].pft_reading);
                    setPftRemark(response.data[0].observations);
                } else {
                    setPftReading("");
                    setPftRemark("");
                }
            } catch (error) {
                console.error("Error fetching form data:", error);
            }
        };
        fetchFormData();
    }, [pkid, accessToken, Port]);

    //_______________________ Handle Reading Input _______________________
    const handleReadingChange = (event) => {
        const newReading = event.target.value;
        if (!isNaN(newReading) && newReading >= 0 && newReading <= 800) {
            setPftReading(newReading);
            if (newReading === "") setPftRemark("");
        } else {
            alert("PFT Reading should not be greater than 800");
            setPftReading("");
            setPftRemark("");
        }
    };

    //_______________________ Handle Submit _______________________
    const handleSubmit = async () => {
        const isConfirmed = window.confirm("Submit PFT Form");
        const confirmationStatus = isConfirmed ? "True" : "False";

        try {
            const response = await axios.post(
                `${Port}/Screening/citizen_pft_info/${pkid}`,
                {
                    citizen_pk_id: citizensPkId,
                    pft_reading: pftReading,
                    observations: pftRemark.message,
                    added_by: userID,
                    modify_by: userID,
                    form_submit: confirmationStatus,
                },
                {
                    headers: { Authorization: `Bearer ${accessToken}` },
                }
            );
            console.log("Response from POST API:", response.data);
            onAcceptClick(nextName);
        } catch (error) {
            console.error("Error submitting PFT data:", error);
        }
    };

    const getRemarkColor = (remark) => {
        const msg = remark?.message?.trim();
        switch (msg) {
            case "Danger":
                return "red";
            case "Caution":
                return "yellow";
            case "Stable":
                return "green";
            case "Out Of Range":
                return "brown";
            default:
                return "white";
        }
    };

    return (
        <Box sx={{ p: 2 }}>
            <Card sx={{ borderRadius: "20px", p: 1, mb: 1, background: "linear-gradient(90deg, #039BEF 0%, #1439A4 100%)" }}>
                <Typography sx={{ fontWeight: 600, fontFamily: "Roboto", fontSize: "16px", color: "white" }}>
                    PFT
                </Typography>
            </Card>

            <Card sx={{ p: 2, borderRadius: "20px" }}>
                <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            label="PFT Reading"
                            type="number"
                            value={pftReading}
                            onChange={handleReadingChange}
                            inputProps={{ min: 0, max: 800 }}
                            variant="outlined"
                            size="small"
                        />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            label="PFT Remarks"
                            value={pftRemark ? pftRemark.message || "" : ""}
                            variant="outlined"
                            size="small"
                            InputProps={{
                                readOnly: true,
                                style: {
                                    backgroundColor: getRemarkColor(pftRemark),
                                    color: "black",
                                    fontWeight: 600,
                                },
                            }}
                        />
                    </Grid>
                </Grid>

                <Box textAlign="center" mt={1} mb={1}>
                    <Button
                        variant="contained"
                        size="small"
                        sx={{ bgcolor: "#1439A4", textTransform: "none" }}
                        onClick={handleSubmit}
                    >
                        Submit
                    </Button>
                </Box>
            </Card>
        </Box>
    );
};

export default Pft;
