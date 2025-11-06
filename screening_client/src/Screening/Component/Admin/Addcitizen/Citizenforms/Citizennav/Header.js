import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    TextField,
    Box,
    MenuItem,
    Grid,
    Typography,
    Button,
    Modal,
    Paper,
} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Link } from 'react-router-dom';
import School from '../Source/School';
import Corporate from '../Source/Corporate';
import { useSourceContext } from '../../../../../../../src/contexts/SourceContext';

const Header = () => {
    const userID = localStorage.getItem('userID');
    const Port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');

    const SourceUrlId = localStorage.getItem('loginSource');
    const SourceNameUrlId = localStorage.getItem('SourceNameFetched');

    const [selectedAge, setSelectedAgeLocal] = useState('');
    const { setSelectedAge } = useSourceContext();
    const [ageError, setAgeError] = useState('');

    const handleAgeChange = (event) => {
        const ageId = event.target.value;
        setSelectedAgeLocal(ageId);
        setSelectedAge(ageId);
    };

    const { setGender } = useSourceContext();
    const [selectedGender, setSelectedGender] = useState('');
    const [genderError, setGenderError] = useState('');

    const handleGenderChange = (e) => {
        setSelectedGender(e.target.value);
        setGenderError('');
        setGender(e.target.value);
    };

    const { setSelectedSource } = useSourceContext();
    const [selectedSource, setSelectedSourceLocal] = useState(SourceUrlId || '');
    const [sourceError, setSourceError] = useState('');

    const handleSourceChange = (event) => {
        const sourceId = event.target.value;
        setSelectedSourceLocal(sourceId);
        setSelectedSource(sourceId);
    };

    const [screeningFor, setScreeningFor] = useState([]);
    const [selectedScheduleType, setSelectedScheduleLocal] = useState('');
    const { setSelectedScheduleType } = useSourceContext();
    const [screeningForError, setScreeningForError] = useState('');

    console.log(selectedGender,selectedScheduleType,'mmmmmmmmmmmmmmmmmm');
    
    const handleScheduleTypeChange = (event) => {
        const scheduleId = event.target.value;
        setSelectedScheduleLocal(scheduleId);
        setSelectedScheduleType(scheduleId);
    };

    const [selectedDisease, setSelectedDiseaseLocal] = useState('');
    const { setSelectedDisease } = useSourceContext();

    const handleDiseaseChange = (event) => {
        const diseaseId = event.target.value;
        setSelectedDiseaseLocal(diseaseId);
        setSelectedDisease(diseaseId);
    };

    const [AgeNav, setAgeNav] = useState([]);
    const [GenderNav, setGenderNav] = useState([]);
    const [SourceNav, setSourceNav] = useState([]);
    const [DiseaseNav, setDiseaseNav] = useState([]);
    const [currentForm, setCurrentForm] = useState();
    const [showModal, setShowModal] = useState(false);

    const handlesubmit = () => {
        // if (selectedAge === 1 && selectedScheduleType === 2) {
        //     setScreeningForError('Select the Valid Age');
        //     return;
        // }
        // if (selectedAge === 1 && selectedSource === 5) {
        //     setScreeningForError('Select the Valid Age as per Source');
        //     return;
        // }

        const errors = {
            // age: !selectedAge ? 'Age is required' : '',
            gender: !selectedGender ? 'Gender is required' : '',
            // source: !selectedSource ? 'Source is required' : '',
            screeningFor: !selectedScheduleType ? 'Type is required' : '',
        };

        // setAgeError(errors.age);
        setGenderError(errors.gender);
        // setSourceError(errors.source);
        setScreeningForError(errors.screeningFor);

        if ( !errors.gender && !errors.screeningFor) {
            // setAgeError('');
            setGenderError('');
            // setSourceError('');
            setScreeningForError('');

            const formMappings = {
                // '1_1_1_1': 'school',
                // '1_2_1_1': 'school',
                // '1_3_1_1': 'school',
                // '1_1_2_1': 'school',
                // '2_1_1_1': 'school',
                // '2_1_1_2': 'school',
                // '2_2_1_2': 'school',
                // '2_2_1_1': 'school',
                // '5_1_5_3': 'corporate',
                // '5_2_5_3': 'corporate',
                // '6_1_5_3': 'corporate',
                // '6_2_5_3': 'corporate',
                // '7_1_5_3': 'corporate',
                // '7_2_5_3': 'corporate',
                // '8_1_5_3': 'corporate',
                // '8_2_5_3': 'corporate',
                '1_5': 'corporate',
                '1_3': 'corporate',
                '2_3': 'corporate',
                '2_5': 'corporate',
                '3_3': 'corporate',
                '3_5': 'corporate',
                default: 'AnotherForm',
            };

            const key = `${selectedGender}_${selectedScheduleType}`;
            const currentForm = formMappings[key] || formMappings.default;

            if (currentForm === 'AnotherForm') {
                setShowModal(true);
            } else {
                setCurrentForm(currentForm);
            }
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    useEffect(() => {
        const fetchAgeDropdown = async () => {
            try {
                const response = await axios.get(`${Port}/Screening/Age_GET/?source_id=${SourceUrlId}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });
                setAgeNav(response.data);
            } catch (error) {
                console.log('Error while fetching data', error);
            }
        };
        fetchAgeDropdown();
    }, []);

    useEffect(() => {
        const fetchGenderDropdown = async () => {
            try {
                const response = await axios.get(`${Port}/Screening/Gender_GET/`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });
                setGenderNav(response.data);
            } catch (error) {
                console.log('Error while fetching data', error);
            }
        };
        fetchGenderDropdown();
    }, []);

    useEffect(() => {
        const fetchSourceDropdown = async () => {
            try {
                const response = await axios.get(`${Port}/Screening/source_GET/?source_pk_id=${SourceUrlId}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });
                setSourceNav(response.data);
            } catch (error) {
                console.log('Error while fetching data', error);
            }
        };
        fetchSourceDropdown();
    }, []);

    useEffect(() => {
        if (selectedSource) {
            axios
                .get(`${Port}/Screening/screening_for_type_get/${selectedSource}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                })
                .then((response) => setScreeningFor(response.data))
                .catch((error) => console.error('Error fetching data:', error));
        }
    }, [selectedSource]);

    useEffect(() => {
        const fetchDiseaseDropdown = async () => {
            try {
                const response = await axios.get(`${Port}/Screening/child_disease_info_get/`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });
                setDiseaseNav(response.data);
            } catch (error) {
                console.log('Error while fetching data', error);
            }
        };
        fetchDiseaseDropdown();
    }, []);

    return (
        <Box sx={{ p: 2, m: "0em 0em 0 3.5em" }}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
                <Grid container alignItems="center" spacing={1} sx={{ mb: 2 }}>
                    <Grid item>
                        <Link to="/mainscreen/Citizen" style={{ textDecoration: 'none', color: 'inherit' }}>
                            <ArrowBackIosIcon sx={{ color: '#1439A4', cursor: 'pointer' }} />
                        </Link>
                    </Grid>
                    <Grid item>
                        <Typography variant="h6" sx={{ fontWeight: 500, color: '#1439A4',fontFamily: 'Roboto'}}>
                            Add New Citizen
                        </Typography>
                    </Grid>
                </Grid>

                <Grid container spacing={2}>
                    {/* <Grid item xs={12} sm={6} md={2.4}>
                        <TextField
                            select
                            fullWidth
                            size="small"
                            value={selectedAge}
                            onChange={handleAgeChange}
                            error={!!ageError}
                            helperText={ageError}
                            label="Age *"
                            sx={{
                                minWidth: 120,
                                "& .MuiInputBase-input.MuiSelect-select": {
                                    color: "#000 !important",
                                },
                                "& .MuiSvgIcon-root": {
                                    color: "#000",
                                },
                            }}
                        >
                            {AgeNav.map((drop) => (
                                <MenuItem key={drop.age_pk_id} value={drop.age_pk_id}>
                                    {drop.age}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid> */}

                    <Grid item xs={12} sm={6} md={2.4}>
                        <TextField
                            select
                            fullWidth
                            size="small"
                            value={selectedGender}
                            onChange={handleGenderChange}
                            error={!!genderError}
                            helperText={genderError}
                            label="Gender *"
                            sx={{
                                minWidth: 120,
                                "& .MuiInputBase-input.MuiSelect-select": {
                                    color: "#000 !important",
                                },
                                "& .MuiSvgIcon-root": {
                                    color: "#000",
                                },
                            }}
                        >
                            {GenderNav.map((drop) => (
                                <MenuItem key={drop.gender_pk_id} value={drop.gender_pk_id}>
                                    {drop.gender}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    {/* <Grid item xs={12} sm={6} md={2.4}>
                        <TextField
                            select
                            fullWidth
                            size="small"
                            value={selectedSource}
                            onChange={handleSourceChange}
                            error={!!sourceError}
                            helperText={sourceError}
                            label="Source *"
                            sx={{
                                minWidth: 120,
                                "& .MuiInputBase-input.MuiSelect-select": {
                                    color: "#000 !important",
                                },
                                "& .MuiSvgIcon-root": {
                                    color: "#000",
                                },
                            }}
                        >
                            {SourceNav.map((drop) => (
                                <MenuItem key={drop.source_pk_id} value={drop.source_pk_id}>
                                    {drop.source}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid> */}

                    <Grid item xs={12} sm={6} md={2.4}>
                        <TextField
                            select
                            fullWidth
                            size="small"
                            value={selectedScheduleType}
                            onChange={handleScheduleTypeChange}
                            error={!!screeningForError}
                            helperText={screeningForError}
                            label="Category *"
                            sx={{
                                minWidth: 120,
                                "& .MuiInputBase-input.MuiSelect-select": {
                                    color: "#000 !important",
                                },
                                "& .MuiSvgIcon-root": {
                                    color: "#000",
                                },
                            }}
                        >
                            <MenuItem>Select The Type</MenuItem>
                            {screeningFor.map((drop) => (
                                <MenuItem key={drop.type_id} value={drop.type_id}>
                                    {drop.type}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    {/* <Grid item xs={12} sm={6} md={2.4}>
                        <TextField
                            select
                            fullWidth
                            size="small"
                            value={selectedDisease}
                            onChange={handleDiseaseChange}
                            label="Disease"
                            sx={{
                                minWidth: 120,
                                "& .MuiInputBase-input.MuiSelect-select": {
                                    color: "#000 !important",
                                },
                                "& .MuiSvgIcon-root": {
                                    color: "#000",
                                },
                            }}
                        >
                            {DiseaseNav.map((drop) => (
                                <MenuItem key={drop.disease_pk_id} value={drop.disease_pk_id}>
                                    {drop.disease}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid> */}

                    <Grid item xs={12} sm={6} md="auto">
                        <Button
                            variant="contained"
                            onClick={handlesubmit}
                            sx={{
                                bgcolor: '#1439A4',
                                textTransform: 'none',
                                fontWeight: 500,
                                '&:hover': { bgcolor: '#1439A4' },
                            }}
                        >
                            Submit
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Modal */}
            <Modal open={showModal} onClose={handleCloseModal}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        p: 4,
                        boxShadow: 24,
                        textAlign: 'center',
                    }}
                >
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        There is no form for selected options.
                    </Typography>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleCloseModal}
                        sx={{ textTransform: 'none' }}
                    >
                        Close
                    </Button>
                </Box>
            </Modal>

            <Box sx={{ mt: 2 }}>
                {currentForm === 'school' && (
                    <School
                        age={selectedAge}
                        gender={selectedGender}
                        source={selectedSource}
                        disease={selectedDisease}
                        type={selectedScheduleType}
                    />
                )}

                {currentForm === 'corporate' && (
                    <Corporate
                        // age={selectedAge}
                        gender={selectedGender}
                        // source={selectedSource}
                        // disease={selectedDisease}
                        type={selectedScheduleType}
                    />
                )}
            </Box>
        </Box>
    );
};

export default Header;
