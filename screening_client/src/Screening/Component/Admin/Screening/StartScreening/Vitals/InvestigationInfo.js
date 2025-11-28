import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';
import {
    Grid,
    Card,
    Typography,
    TextField,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    Button,
    Box,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions, Checkbox,
    Snackbar,
    Alert
} from "@mui/material";

const InvestigationInfo = ({ citizensPkId, pkid, fetchVital, selectedName, onAcceptClick }) => {

    //_________________________________START
    console.log(selectedName, 'Present name');
    console.log(fetchVital, 'Overall GET API');
    const [nextName, setNextName] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedChecks, setSelectedChecks] = useState([]);

const [snackbar, setSnackbar] = useState({
  open: false,
  message: "",
  severity: "success",
});

const showSnackbar = (msg, type = "success") => {
  setSnackbar({
    open: true,
    message: msg,
    severity: type,
  });
};

const handleSnackbarClose = () => {
  setSnackbar({ ...snackbar, open: false });
};

    useEffect(() => {
        if (fetchVital && selectedName) {
            const currentIndex = fetchVital.findIndex(item => item.screening_list === selectedName);

            console.log('Current Indexxxx:', currentIndex);

            if (currentIndex !== -1 && currentIndex < fetchVital.length - 1) {
                const nextItem = fetchVital[currentIndex + 1];
                const nextName = nextItem.screening_list;
                setNextName(nextName);
                console.log('Next Name Setttt:', nextName);
            } else {
                setNextName('');
                console.log('No next item or selectedName not found');
            }
        }
    }, [selectedName, fetchVital]);
    //_________________________________END

    const userID = localStorage.getItem('userID');
    const investtData = JSON.parse(localStorage.getItem('investiData'));
    console.log("investtttttData....", investtData)

    /////////// Roshni's Code Start ///////////////////// 
    const [viewInvestigation, setViewInvestigation] = useState(false);
    const viewInvest = localStorage.getItem('investiData');
    console.log("View Invest....", viewInvest);

    useEffect(() => {
        const storedPermissions = localStorage.getItem('permissions');
        console.log('Stored Permissions:', storedPermissions);
        const parsedPermissions = storedPermissions ? JSON.parse(storedPermissions) : [];
        console.log('parsedPermissions Permissions:', parsedPermissions);
        ////// roshni code start
        const investigationModules = parsedPermissions.map(permission => {
            const modules = permission.modules_submodule.find(module => module.moduleName === 'Investigation');
            if (modules) {
                return {
                    moduleId: modules.moduleId,
                    moduleName: modules.moduleName,
                    selectedSubmodules: modules.selectedSubmodules
                };
            } else {
                return null;
            }
        }).filter(module => module !== null);

        console.log("investigationModules", investigationModules);

        if (investigationModules.length > 0) {
            setViewInvestigation(investigationModules[0].selectedSubmodules);
            localStorage.setItem('investiData', JSON.stringify(investigationModules[0].selectedSubmodules));
        } else {
            // Handle the case when investigationModules is empty
            setViewInvestigation([]);
            localStorage.setItem('investiData', JSON.stringify([]));
        }


        ////// roshni code end
    }, []);
    /////////// Roshni's Code End //////////////////////////

    const Port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');
const [investData, setInvestData] = useState({
    investigation_report: "",
    urine_report: "",
    ecg_report: "",
    x_ray_report: "",
});


    const [imgUrl, setImgUrl] = useState('');

    function formatSubmoduleName(submoduleName) {
        switch (submoduleName) {
            case 'cbc_report':
                return 'CBC Report';
            case 'cholesterol_report':
                return 'Cholesterol Report';
            case 'rbs_random_blood_sugar_report':
                return 'RBS Random Blood Sugar Report';
            case 'urea_report':
                return 'Urea Report';
            case 'urine_routine_report':
                return 'Urine Routine Report';
            case 'creatinine_report':
                return 'Creatinine Report';
            default:
                return submoduleName;
        }
    }

    // const handleFileChange = (e, fieldName) => {
    //     const { files } = e.target;
    //     setInvestData({
    //         ...investData,
    //         // [fieldName]: e.target.files[0].name,
    //         [fieldName]: files[0]
    //     });
    // };

    const handleFileChange = (e, fieldName) => {
        const { files } = e.target;
        setInvestData({
            ...investData,
            [fieldName]: e.target.files[0],
        });
    };
const handleDialogCancel = () => {
  setOpenDialog(false);
};

    const handleSubmit = (e) => {
  e.preventDefault();
  setOpenDialog(true);   // open confirmation dialog
};
const handleDialogConfirm = async () => {
  console.log("👉 handleDialogConfirm CALLED");   // Check 1

  setOpenDialog(false);

  const formData = new FormData();
  const dataObj = investData;

  console.log("📁 Sending Data Object:", dataObj); // Check 2

  const fileFields = ["investigation_report", "urine_report", "ecg_report", "x_ray_report"];
  fileFields.forEach((field) => {
    if (dataObj[field] instanceof File) {
      formData.append(field, dataObj[field]);
    }
  });

//   formData.append("citizen_id", citizensPkId.toString());
formData.append("selected_submodules", JSON.stringify(selectedChecks));
  formData.append("form_submit", "True");
  formData.append("added_by", userID);
  formData.append("modify_by", userID);

  // 🔥 Print FormData values
  for (let pair of formData.entries()) {
    console.log("📝 FORM DATA:", pair[0], "=>", pair[1]);
  }

  try {
    console.log("🚀 API CALL FIRING...");   // Check 3

    const response = await axios.post(
      `${Port}/Screening/investigation_post_api/${pkid}/`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("✅ API SUCCESS RESPONSE:", response); // Check 4

    showSnackbar("Investigation submitted successfully!", "success");
    onAcceptClick(nextName);

  } catch (error) {
    console.error("❌ API ERROR:", error.response?.data || error.message); // Check 5
    showSnackbar("Failed to submit investigation!", "error");
  }
};






    useEffect(() => {
        const fetchDataById = async (pkid) => {
            console.error('Citizens Pk Id...', pkid);
            try {
                const response = await fetch(`${Port}/Screening/investigation_get_api/${pkid}/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('These are selected files.', data);
                    setInvestData(data);
                    // setImgUrl(data[0].investigation_report)

                    // if (data && data.length > 0) {
                    //     switch (data[0].submoduleName) {
                    //         case 'Blood Report':
                    //             setImgUrl(data[0].investigation_report);
                    //             break;
                    //         case 'Urine Report':
                    //             setImgUrl(data[0].urine_report);
                    //             break;
                    //         case 'ECG Report':
                    //             setImgUrl(data[0].ecg_report);
                    //             break;
                    //         case 'X-Ray Report':
                    //             setImgUrl(data[0].x_ray_report);
                    //             break;
                    //         default:
                    //             break;
                    //     }
                    // }
                } else {
                    console.error('Server Error:', response.status, response.statusText);
                }
            } catch (error) {
                console.error('Error fetching data:', error.message);
            }
        };

        fetchDataById(pkid);
    }, [pkid]);

    const downloadFile = async (fileUrl) => {
        console.log('imgUrl...', fileUrl);
        try {
            const response = await fetch(`${Port}${fileUrl}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/pdf',
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            console.log('response:', response.url);
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'InvestigationReport.pdf');
                document.body.appendChild(link);

                link.click();
                link.parentNode.removeChild(link);
                window.URL.revokeObjectURL(url);
            } else {
                console.error('Server Error:', response.status);
            }
        } catch (error) {
            console.error('Error fetching data:', error.message);
        }
    };

    return (
        <Box>


            <Dialog open={openDialog} onClose={handleDialogCancel}>
  <DialogTitle>Confirm Submission</DialogTitle>
  <DialogContent>
    <Typography>
      Are you sure you want to submit the investigation reports?
    </Typography>
  </DialogContent>

  <DialogActions>
    <Button onClick={handleDialogCancel} color="secondary">Cancel</Button>
    <Button onClick={handleDialogConfirm} variant="contained" color="primary">
      Confirm
    </Button>
  </DialogActions>
</Dialog>

{/* --- Snackbar --- */}
<Snackbar
  open={snackbar.open}
  autoHideDuration={3000}
  onClose={handleSnackbarClose}
  anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
>
  <Alert onClose={handleSnackbarClose} severity={snackbar.severity} variant="filled">
    {snackbar.message}
  </Alert>
</Snackbar>
            <Card sx={{ borderRadius: "20px", p: 1, mb: 1, background: "linear-gradient(90deg, #039BEF 0%, #1439A4 100%)" }}>
                <Typography sx={{ fontWeight: 600, fontFamily: "Roboto", fontSize: "16px", color: "white" }}>
                    Investigation Report
                </Typography>
            </Card>

            <Box
                sx={{
                    maxHeight: "70vh",
                    overflowY: "auto",
                    pr: 2,
                }}
            >
                <Card sx={{ p: 2, mb: 2, borderRadius: "20px", }}>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                        {investtData && investtData.map((data, i) => (
                            <FormControlLabel
                                key={i}
                              control={
  <Checkbox
    checked={selectedChecks.includes(data.submoduleName)}
    onChange={(e) => {
      if (e.target.checked) {
        setSelectedChecks([...selectedChecks, data.submoduleName]);
      } else {
        setSelectedChecks(
          selectedChecks.filter(item => item !== data.submoduleName)
        );
      }
    }}
  />
}
                                label={
                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                        {data.submoduleName}
                                    </Typography>
                                }
                                sx={{ mr: 2 }}
                            />
                        ))}
                    </Box>

                    <Box sx={{ display: "flex", flexWrap: "wrap", p: 3, ml: 5 }}>
                        {investtData && investtData.map((data, i) => (
                            <Grid container spacing={2} sx={{ mb: 3 }} key={i}>
                                {data.submoduleName === "Blood Report" && (
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={4}>
                                            <Typography variant="body2" sx={{ mb: 1 }}>Upload Blood Report</Typography>
                                            <input
                                                type="file"
                                                className="form-control"
                                                onChange={(e) => handleFileChange(e, 'investigation_report')}
                                                style={{ width: '100%' }}
                                            />
                                        </Grid>
                                        {Array.isArray(investData) && investData.length > 0 && investData[0].investigation_report !== '/media/undefined' && (
                                            <Grid item xs={12} md={4} display="flex" alignItems="center">
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: "#F77C00",
                                                        borderRadius: '6px',
                                                        '&:hover': { backgroundColor: "#F77C00" },
                                                    }}
                                                    startIcon={<CloudDownloadOutlinedIcon />}
                                                    onClick={() => downloadFile(investData[0]?.investigation_report)}
                                                >
                                                    Download
                                                </Button>
                                            </Grid>
                                        )}
                                    </Grid>
                                )}

                                {data.submoduleName === "Urine Report" && (
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={4}>
                                            <Typography variant="body2" sx={{ mb: 1 }}>Upload Urine Report</Typography>
                                            <input
                                                type="file"
                                                className="form-control"
                                                onChange={(e) => handleFileChange(e, 'urine_report')}
                                                style={{ width: '100%' }}
                                            />
                                        </Grid>
                                        {Array.isArray(investData) && investData.length > 0 && investData[0].urine_report !== '/media/undefined' && (
                                            <Grid item xs={12} md={4} display="flex" alignItems="center">
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: "#F77C00",
                                                        borderRadius: '6px',
                                                        '&:hover': { backgroundColor: "#F77C00" },
                                                    }}
                                                    startIcon={<CloudDownloadOutlinedIcon />}
                                                    onClick={() => downloadFile(investData[0]?.urine_report)}
                                                >
                                                    Download
                                                </Button>
                                            </Grid>
                                        )}
                                    </Grid>
                                )}

                                {data.submoduleName === "ECG Report" && (
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={4}>
                                            <Typography variant="body2" sx={{ mb: 1 }}>Upload ECG Report</Typography>
                                            <input
                                                type="file"
                                                className="form-control"
                                                onChange={(e) => handleFileChange(e, 'ecg_report')}
                                                style={{ width: '100%' }}
                                            />
                                        </Grid>
                                        {Array.isArray(investData) && investData.length > 0 && investData[0].ecg_report !== '/media/undefined' && (
                                            <Grid item xs={12} md={4} display="flex" alignItems="center">
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: "#F77C00",
                                                        borderRadius: '6px',
                                                        '&:hover': { backgroundColor: "#F77C00" },
                                                    }}
                                                    startIcon={<CloudDownloadOutlinedIcon />}
                                                    onClick={() => downloadFile(investData[0]?.ecg_report)}
                                                >
                                                    Download
                                                </Button>
                                            </Grid>
                                        )}
                                    </Grid>
                                )}

                                {data.submoduleName === "X-Ray Report" && (
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={4}>
                                            <Typography variant="body2" sx={{ mb: 1 }}>Upload X-Ray Report</Typography>
                                            <input
                                                type="file"
                                                className="form-control"
                                                onChange={(e) => handleFileChange(e, 'x_ray_report')}
                                                style={{ width: '100%' }}
                                            />
                                        </Grid>
                                        {Array.isArray(investData) && investData.length > 0 && investData[0].x_ray_report !== '/media/undefined' && (
                                            <Grid item xs={12} md={4} display="flex" alignItems="center">
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: "#F77C00",
                                                        borderRadius: '6px',
                                                        '&:hover': { backgroundColor: "#F77C00" },
                                                    }}
                                                    startIcon={<CloudDownloadOutlinedIcon />}
                                                    onClick={() => downloadFile(investData[0]?.x_ray_report)}
                                                >
                                                    Download
                                                </Button>
                                            </Grid>
                                        )}
                                    </Grid>
                                )}
                            </Grid>
                        ))}
                    </Box>
                </Card>
            </Box>

            <Box textAlign="center" mt={1} mb={2}>
                <Button
                    variant="contained"
                    size="small"
                    sx={{ bgcolor: "#1439A4", textTransform: "none" }}
                    onClick={handleSubmit}
                >
                    Submit
                </Button>
            </Box>
        </Box>
    )
}

export default InvestigationInfo
