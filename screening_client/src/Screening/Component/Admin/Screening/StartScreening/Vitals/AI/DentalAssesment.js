import React, { useState, useRef, useEffect } from "react";
import { Card, Snackbar, CardContent, Typography, Button, Grid, Box, Alert, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { useLocation } from 'react-router-dom';

const DentalAssessment = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);

    const scheduleId = params.get('schedule_id');
    const citizenId = params.get('citizen_id');
    const citizenPkId = params.get('citizen_pk_id');

    const Port = process.env.REACT_APP_API_KEY;
    const [imageSrc, setImageSrc] = useState(null);
    const [error, setError] = useState("");
    const canvasRef = useRef(null);
    const [selectedValues, setSelectedValues] = useState({});
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    const handleChange = (key, event) => {
        setSelectedValues((prevState) => ({
            ...prevState,
            [key]: event.target.value,
        }));
    };

    const formatKeyForDisplay = (key) => {
        return key.replace(/_/g, " ");
    };

    const handleCapturePhoto = (event) => {
        const file = event.target.files[0];
        if (file) {
            setUploadedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageSrc(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setError("No image captured.");
        }
    };

    const [responseText, setResponseText] = useState('');
    console.log(responseText, 'responseTextresponseText');

    const [uploadedFile, setUploadedFile] = useState(null);
    console.log(uploadedFile, 'uploadedFile');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [loadingText, setLoadingText] = useState(false);
    const [textResult, setTextResult] = useState(null);

    const handleSubmit = async () => {
        if (!uploadedFile && !imageSrc) {
            console.error('No image to submit');
            return;
        }

        const formData = new FormData();
        formData.append('image', uploadedFile ? uploadedFile : imageSrc);
        formData.append('schedule_id', scheduleId);
        formData.append('citizen_id', citizenId);
        formData.append('citizen_pk_id', citizenPkId);
        setLoading(true);

        try {
            const response = await fetch(`${Port}/Screening/Saved_image/?`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                setLoadingText(true);
                const imagePath = `${Port}${result.image}`;
                const imageResponse = await fetch(imagePath);

                if (imageResponse.ok) {
                    const imageBlob = await imageResponse.blob();
                    const secondFormData = new FormData();
                    secondFormData.append('image', imageBlob, 'image.jpg');

                    const secondResponse = await fetch(`${Port}/Screening/dental_image_analyse/`, {
                        method: 'POST',
                        body: secondFormData,
                    });

                    if (secondResponse.ok) {
                        const secondResult = await secondResponse.json();
                        setTextResult(secondResult.result[0]);
                    } else {
                        console.error('Text analysis failed:', secondResponse.statusText);
                        setErrorMessage('Text analysis failed.');
                    }
                }
            } else {
                console.error('Upload failed:', response.statusText);
                setErrorMessage('Upload failed. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
            setLoadingText(false);
        }
    };

    const handleSave = async () => {
        try {
            const payload = {
                schedule_id: scheduleId,
                citizen_id: citizenId,
                citizen_pk_id: citizenPkId,
                english: textResult?.english,
                marathi: textResult?.marathi,
                ...selectedValues,
            };

            console.log("Sending Data:", payload);

            const response = await fetch(`${Port}/Screening/img_analyse_data_save/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error("Failed to save data");

            setSnackbar({ open: true, message: "Data saved successfully!", severity: "success" });
        } catch (error) {
            setSnackbar({ open: true, message: "Error saving data", severity: "error" });
        }
    };


    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: 20, padding: 2, m: 2 }}>
            <Card sx={{ width: 'auto', position: "relative", padding: 2 }}>
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <input
                                type="file"
                                accept="image/*"
                                capture="camera"
                                style={{ display: "none" }}
                                id="cameraInput"
                                onChange={handleCapturePhoto}
                            />
                            <Box sx={{ display: "flex", gap: 2, marginTop: 2, fontFamily: 'Roboto' }}>
                                <div style={{ marginTop: '3px' }}>Capture Dental Image</div>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => document.getElementById("cameraInput").click()}
                                >
                                    <CameraAltIcon />
                                </Button>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            {imageSrc ? (
                                <>
                                    <Box display="flex" flexDirection="column" alignItems="center" width="100%">
                                        <img
                                            src={imageSrc}
                                            alt="Captured"
                                            style={{ width: "100%", maxWidth: "400px", height: "auto", marginBottom: '1em' }}
                                        />
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={handleSubmit}
                                            sx={{
                                                width: { xs: "90%", sm: "80%", md: "200px" },
                                                textAlign: 'center',
                                                mb: 2
                                            }}
                                        >
                                            Submit
                                        </Button>
                                    </Box>

                                    <Grid container spacing={2} justifyContent="center">
                                        {errorMessage && (
                                            <Grid item xs={12}>
                                                <Typography color="error" align="center">
                                                    {errorMessage}
                                                </Typography>
                                            </Grid>
                                        )}
                                        {loadingText && (
                                            <Grid item xs={12}>
                                                <Typography variant="body2" color="textSecondary" align="center">
                                                    Processing the result, please wait...
                                                </Typography>
                                            </Grid>
                                        )}
                                    </Grid>

                                    {textResult && (
                                        <Box
                                            mt={2} p={2}
                                            border="1px solid #ccc"
                                            borderRadius="8px"
                                            sx={{ width: { xs: "100%", sm: "80%", md: "70%" }, mx: "auto" }}
                                        >
                                            <Typography variant="h6" color="textPrimary" align="center">
                                                Analysis Result:
                                            </Typography>
                                            <Typography variant="body1" color="textSecondary" mt={1} align="center">
                                                {textResult.english}
                                            </Typography>
                                            <Typography variant="body1" color="textSecondary" mt={1} align="center">
                                                {textResult.marathi}
                                            </Typography>

                                            <Grid container spacing={2} mt={2}>
                                                {Object.entries(textResult.conditions).map(([key, value]) => (
                                                    <Grid item xs={12} key={key}>
                                                        <Card sx={{ borderRadius: 2, border: "1px solid #ccc" }}>
                                                            <CardContent>
                                                                <Typography variant="body2" color="textSecondary">
                                                                    <strong>{formatKeyForDisplay(key)}:</strong>
                                                                </Typography>
                                                                <RadioGroup value={selectedValues[key] || value} onChange={(event) => handleChange(key, event)} row>
                                                                    {value === "GOOD" && (
                                                                        <>
                                                                            <FormControlLabel value="GOOD" control={<Radio />} label="Good" />
                                                                            <FormControlLabel value="FAIR" control={<Radio />} label="Fair" />
                                                                            <FormControlLabel value="POOR" control={<Radio />} label="Poor" />
                                                                        </>
                                                                    )}
                                                                    {["YES", "NO"].includes(value) && (
                                                                        <>
                                                                            <FormControlLabel value="YES" control={<Radio />} label="Yes" />
                                                                            <FormControlLabel value="NO" control={<Radio />} label="No" />
                                                                        </>
                                                                    )}
                                                                </RadioGroup>
                                                            </CardContent>
                                                        </Card>
                                                    </Grid>
                                                ))}

                                                <Grid item xs={12}>
                                                    <Button
                                                        variant="contained"
                                                        color="secondary"
                                                        onClick={handleSave}
                                                        sx={{ width: { xs: "90%", sm: "80%", md: "200px" }, textAlign: "center", mb: 2 }}
                                                    >
                                                        Save
                                                    </Button>
                                                </Grid>
                                                <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                                                    <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                                                        {snackbar.message}
                                                    </Alert>
                                                </Snackbar>
                                            </Grid>
                                        </Box>
                                    )}
                                </>
                            ) : (
                                <Typography variant="body2" color="textSecondary" align="center">
                                    No image captured yet.
                                </Typography>
                            )}
                        </Grid>
                    </Grid>

                    {error && (
                        <Alert severity="error" sx={{ marginTop: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <canvas
                        ref={canvasRef}
                        style={{ display: "none" }}
                        width={640}
                        height={480}
                    ></canvas>
                </CardContent>
            </Card>
        </div>
    );
};

export default DentalAssessment;
