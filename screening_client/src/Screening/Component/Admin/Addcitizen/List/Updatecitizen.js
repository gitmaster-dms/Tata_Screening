import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Grid,
    Typography,
    TextField,
    MenuItem,
    IconButton,
    Paper,
} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Link, useParams } from 'react-router-dom';
import Childupdate from './Childupdate';
import CorporateUpdate from './CorporateUpdate';

const Updatecitizen = () => {
    const accessToken = localStorage.getItem('token');
    const Port = process.env.REACT_APP_API_KEY;

    const { id, sourceId } = useParams();
    const [data1, setData1] = useState([]);
    const [sourceStateNav, setSourceStateNav] = useState([]);

    const [selectedAge1, setSelectedAge1] = useState({
        age: { id: '', name: '' },
        gender: { id: '', name: '' },
        source: { id: '', name: '' },
        type: { id: '', name: '' },
        disease: { id: '', name: '' },
    });

    const [AgeNav, setAgeNav] = useState([]);
    const [GenderNav, setGenderNav] = useState([]);
    const [SourceNav, setSourceNav] = useState([]);
    const [screeningFor, setScreeningFor] = useState([]);
    const [DiseaseNav, setDiseaseNav] = useState([]);

    const [ageError, setAgeError] = useState('');
    const [genderError, setGenderError] = useState('');
    const [sourceError, setSourceError] = useState('');

    // ------------------ FETCH DATA ------------------ //
    useEffect(() => {
        let apiUrl;
        if (sourceId === 'Community') {
            apiUrl = `${Port}/Screening/add_citizen_get/${id}/`;
        } else if (sourceId === 'Corporate') {
            apiUrl = `${Port}/Screening/add_employee_get/${id}/`;
        } else {
            return;
        }

        axios
            .get(apiUrl, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            })
            .then((response) => {
                setData1(response.data);
                setSelectedAge1({
                    age: { id: response.data.age || '', name: response.data.age_name || '' },
                    gender: { id: response.data.gender || '', name: response.data.gender_name || '' },
                    source: { id: response.data.source || '', name: response.data.source_id_name || '' },
                    type: { id: response.data.category || '', name: response.data.pk_id || '' },
                    disease: { id: response.data.disease || '', name: response.data.disease_name || '' },
                });

                axios
                    .get(`${Port}/Screening/source_and_pass_state_Get/${response.data.source}`, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    })
                    .then((res) => setSourceStateNav(res.data))
                    .catch((err) => console.error('Error second API:', err));
            })
            .catch((error) => console.error('Error:', error));
    }, [Port, accessToken, id, sourceId]);

    useEffect(() => {
        const fetchDropdown = async (url, setFn) => {
            try {
                const res = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });
                setFn(res.data);
            } catch (err) {
                console.error('Error fetching:', err);
            }
        };

        fetchDropdown(`${Port}/Screening/Age_GET/`, setAgeNav);
        fetchDropdown(`${Port}/Screening/Gender_GET/`, setGenderNav);
        fetchDropdown(`${Port}/Screening/source_GET/`, setSourceNav);
        fetchDropdown(`${Port}/Screening/child_disease_info_get/`, setDiseaseNav);
    }, [Port, accessToken]);

    useEffect(() => {
    if (selectedAge1.source.id) {
            axios
                .get(`${Port}/Screening/Category_Get/${selectedAge1.source.id}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                })
                .then((res) => setScreeningFor(res.data))
                .catch((err) => console.error('Error fetching type:', err));
        }
    }, [selectedAge1.source.id, Port, accessToken]);

    // ------------------ HANDLE CHANGE ------------------ //
    const handleChange = (e) => {
        const { name, value } = e.target;
        const selectedOption = { id: '', name: value };

        switch (name) {
            case 'age':
                selectedOption.id = AgeNav.find((opt) => opt.age === value)?.age_pk_id || '';
                break;
            case 'gender':
                selectedOption.id = GenderNav.find((opt) => opt.gender === value)?.gender_pk_id || '';
                break;
            case 'source':
                selectedOption.id = SourceNav.find((opt) => opt.source === value)?.source_pk_id || '';
                break;
            case 'type':
                selectedOption.id = screeningFor.find((opt) => opt.category === value)?.pk_id || '';
                break;
            case 'disease':
                selectedOption.id = DiseaseNav.find((opt) => opt.disease === value)?.disease_pk_id || '';
                break;
            default:
                break;
        }

        setSelectedAge1((prev) => ({
            ...prev,
            [name]: selectedOption,
        }));

        if (name === 'source') {
            axios
                .get(`${Port}/Screening/Category_Get/${selectedOption.id}`)
                .then((res) => setScreeningFor(res.data))
                .catch((err) => console.error('Error fetching type:', err));
        }
    };

   useEffect(() => {
    axios
        .get(`${Port}/Screening/Category_Get/`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        })
        .then((res) => {
            console.log("Category Loaded:", res.data);
            setScreeningFor(res.data);
        })
        .catch((err) =>
            console.error('Error fetching categories:', err)
        );
}, []);


const [citizenData, setCitizenData] = useState({});

  const fetchCitizenData = async () => {
    try {
      const response = await fetch(`${Port}/Screening/Citizen_Put_api/${id}/`);

      const data = await response.json();
      console.log("Citizen Data:", data);

      setCitizenData(data);
      setData1(data);
    } catch (error) {
      console.error("Error fetching citizen data:", error);
    }
  };

  useEffect(() => {
    fetchCitizenData();
  }, [id]);
    return (
        <Box sx={{ p: 3, minHeight: '100vh', m: "0.1em 0em 0em 3em", }}>
            <Paper elevation={2} sx={{ p: 1, borderRadius: 3 }}>
                <Grid container alignItems="center" spacing={1} sx={{ mb: 2 }}>
                    <Grid item>
                        <Link to="/mainscreen/Citizen" style={{ textDecoration: 'none', color: 'inherit' }}>
                            <IconButton>
                                <ArrowBackIosIcon sx={{ color: '#1A237E' }} />
                            </IconButton>
                        </Link>
                    </Grid>
                    <Grid item>
                        <Typography variant="h6" fontWeight="bold" color="#1A237E">
                            Update Citizen
                        </Typography>
                    </Grid>
                </Grid>

                <Grid container spacing={2}>
                    {/* <Grid item xs={12} sm={4} md={2.4}>
                        <TextField
                            select
                            name="age"
                            value={selectedAge1.age.name}
                            onChange={handleChange}
                            size="small"
                            fullWidth
                            error={!!ageError}
                            helperText={ageError}
                            label={
                                <span>
                                    Age<span style={{ color: 'red' }}>*</span>
                                </span>
                            }
                        >
                            {AgeNav.map((drop) => (
                                <MenuItem key={drop.age_pk_id} value={drop.age}>
                                    {drop.age}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid> */}

                    <Grid item xs={12} sm={4} md={2.4}>
                        <TextField
                            select
                            name="gender"
                            value={selectedAge1.gender.name}
                            onChange={handleChange}
                            size="small"
                            fullWidth
                            error={!!genderError}
                            helperText={genderError}
                            label={
                                <span>
                                    Gender<span style={{ color: 'red' }}>*</span>
                                </span>
                            }
                            sx={{
                                "& .MuiInputBase-input.MuiSelect-select": {
                                    color: "#000 !important",
                                },
                                "& .MuiSvgIcon-root": {
                                    color: "#000",
                                },
                            }}
                        >
                            {GenderNav.map((drop) => (
                                <MenuItem key={drop.gender_pk_id} value={drop.gender}>
                                    {drop.gender}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    {/* <Grid item xs={12} sm={4} md={2.4}>
                        <TextField
                            select
                            name="source"
                            value={selectedAge1.source.name}
                            onChange={handleChange}
                            size="small"
                            fullWidth
                            error={!!sourceError}
                            helperText={sourceError}
                            label={
                                <span>
                                    Source<span style={{ color: 'red' }}>*</span>
                                </span>
                            }
                        >
                            {SourceNav.map((drop) => (
                                <MenuItem key={drop.source_pk_id} value={drop.source}>
                                    {drop.source}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid> */}

                    <Grid item xs={12} sm={4} md={2.4}>
                        <TextField
                            select
                            name="type"
                            value={selectedAge1.type.name}
                            onChange={handleChange}
                            size="small"
                            fullWidth
                            label={
                                <span>
                                    Type<span style={{ color: 'red' }}>*</span>
                                </span>
                            }
                            sx={{
                                "& .MuiInputBase-input.MuiSelect-select": {
                                    color: "#000 !important",
                                },
                                "& .MuiSvgIcon-root": {
                                    color: "#000",
                                },
                            }}
                        >
                            {screeningFor.map((drop) => (
                                <MenuItem key={drop.pk_id} value={drop.category}>
                                    {drop.category}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    {/* <Grid item xs={12} sm={4} md={2.4}>
                        <TextField
                            select
                            name="disease"
                            value={selectedAge1.disease.name}
                            onChange={handleChange}
                            size="small"
                            fullWidth
                            label={
                                <span>
                                    Disease<span style={{ color: 'red' }}>*</span>
                                </span>
                            }
                        >
                            {DiseaseNav.map((drop) => (
                                <MenuItem key={drop.disease_pk_id} value={drop.disease}>
                                    {drop.disease}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid> */}
                </Grid>
            </Paper>

            <Box mt={2}>
                {citizenData?.source_id_name === 'Community' && (
                    <CorporateUpdate data={data1} main={selectedAge1} state={sourceStateNav} />
                )}
                {/* {sourceId === 'Corporate' && (
                    <CorporateUpdate data={data1} main={selectedAge1} state={sourceStateNav} />
                )} */}
            </Box>
        </Box>
    );
};

export default Updatecitizen;
