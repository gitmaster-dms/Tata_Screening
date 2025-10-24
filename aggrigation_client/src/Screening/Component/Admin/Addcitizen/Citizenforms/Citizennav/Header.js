import React, { useState, useEffect } from 'react'
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import './Header.css'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Link } from 'react-router-dom';
import School from '../Source/School';
import Corporate from '../Source/Corporate'
import { Modal, Button } from 'react-bootstrap';
import { useSourceContext } from '../../../../../../../src/contexts/SourceContext';

const Header = () => {

    const userID = localStorage.getItem('userID');
    console.log(userID);
    const Port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');

    //// access the source from local storage
    const SourceUrlId = localStorage.getItem('loginSource');

    //// access the source name from local storage
    const SourceNameUrlId = localStorage.getItem('SourceNameFetched');

    //////////// Selected dropdown usestate /////////////////
    //////////// Age
    const [selectedAge, setSelectedAgeLocal] = useState('');
    const { setSelectedAge } = useSourceContext();
    const [ageError, setAgeError] = useState('');

    const handleAgeChange = (event) => {
        const ageId = event.target.value;
        setSelectedAgeLocal(ageId);
        setSelectedAge(ageId);
    };

    //////////// gender
    const { setGender } = useSourceContext();
    const [selectedGender, setSelectedGender] = useState('');
    const [genderError, setGenderError] = useState('');

    const handleGenderChange = (e) => {
        setSelectedGender(e.target.value);
        setGenderError('');
        setGender(e.target.value);
    };

    //////////// source
    const { setSelectedSource } = useSourceContext();
    const [selectedSource, setSelectedSourceLocal] = useState(SourceUrlId || '');
    const [sourceError, setSourceError] = useState('');

    const handleSourceChange = (event) => {
        const sourceId = event.target.value;
        setSelectedSourceLocal(sourceId);
        setSelectedSource(sourceId);
    };

    //////////// Schedule For
    const [screeningFor, setScreeningFor] = useState([]);
    const [selectedScheduleType, setSelectedScheduleLocal] = useState('');
    const { setSelectedScheduleType } = useSourceContext();
    const [screeningForError, setScreeningForError] = useState('');

    const handleScheduleTypeChange = (event) => {
        const scheduleId = event.target.value;
        setSelectedScheduleLocal(scheduleId);
        setSelectedScheduleType(scheduleId);
    };

    const [selectedDisease, setSelectedDiseaseLocal] = useState('')
    const { setSelectedDisease } = useSourceContext();

    const handleDiseaseChange = (event) => {
        const diseaseId = event.target.value;
        setSelectedDiseaseLocal(diseaseId);
        setSelectedDisease(diseaseId);
    };

    //////////// nav dropdown usestate /////////////////
    const [AgeNav, setAgeNav] = useState([]);
    const [GenderNav, setGenderNav] = useState([]);
    const [SourceNav, setSourceNav] = useState([]);
    const [DiseaseNav, setDiseaseNav] = useState([]);
    const [currentForm, setCurrentForm] = useState();

    //////////////// screening
    const [showModal, setShowModal] = useState('')
    console.log(selectedAge, selectedGender, selectedSource, selectedScheduleType);

    //////////////////// Render form based on selected value //////////////////
    const handlesubmit = () => {
        // if (selectedAge === 1 && selectedScheduleType === 2) {
        //     setScreeningForError('Select the Valid Age');
        //     return; // Stop further validation
        // }
        // if (selectedAge === 1 && selectedSource === 5) {
        //     setScreeningForError('Select the Valid Age as per Source');
        //     return; // Stop further validation
        // }

        const errors = {
            age: !selectedAge ? 'Age is required' : '',
            gender: !selectedGender ? 'Gender is required' : '',
            source: !selectedSource ? 'Source is required' : '',
            // screeningFor: !selectedScheduleType ? 'Type is required' : '',
        };

        // Set errors for other fields
        setAgeError(errors.age);
        setGenderError(errors.gender);
        setSourceError(errors.source);
        // setScreeningForError(errors.screeningFor);

        if (!errors.age && !errors.gender && !errors.source) {
            setAgeError('');
            setGenderError('');
            setSourceError('');
            // setScreeningForError('');

            const formMappings = {
                '1_1_1_1': 'school',
                '1_2_1_1': 'school',
                '1_3_1_1': 'school',
                '1_1_2_1': 'school',
                '2_1_1_1': 'school',
                '2_1_1_2': 'school',
                '2_2_1_2': 'school',
                '2_2_1_1': 'school',

                '9_1_6': 'school',
                '9_2_6': 'school',
                '9_3_6': 'school',
                '9_1_2': 'school',
                '2_1_1': 'school',
                '2_2_1': 'school',

                '5_1_5_3': 'corporate',
                '5_2_5_3': 'corporate',
                '6_1_5_3': 'corporate',
                '6_2_5_3': 'corporate',
                '7_1_5_3': 'corporate',
                '7_2_5_3': 'corporate',
                '8_1_5_3': 'corporate',
                '8_2_5_3': 'corporate',

                '2_2_4': 'corporate',
                '60 To 120_OTHER_School_cancer': 'Form4',
                default: 'AnotherForm',
            };

            const key = `${selectedAge}_${selectedGender}_${selectedSource}`;
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

    const handleExist = () => {
        setShowModal(false);
    };

    ///////////////////////  AGE Dropdown ////////////////////////
    useEffect(() => {
        const fetchAgeDropdown = async () => {
            try {
                const response = await axios.get(`${Port}/Screening/Age_GET/?source_id=${SourceUrlId}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
                )
                setAgeNav(response.data)
                console.log(AgeNav)
            }
            catch (error) {
                console.log('Error while fetching data', error)
            }
        }
        fetchAgeDropdown()
    }, []);

    ///////////////////////  Gender Dropdown /////////////////////
    useEffect(() => {
        const fetchGenderDropdown = async () => {
            try {
                const response = await axios.get(`${Port}/Screening/Gender_GET/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                })
                setGenderNav(response.data)
                console.log(GenderNav)
            }
            catch (error) {
                console.log('Error while fetching data', error)
            }
        }
        fetchGenderDropdown()
    }, []);

    ///////////////////////  Source Dropdown /////////////////////
    useEffect(() => {
        const fetchSourceDropdown = async () => {
            try {
                const response = await axios.get(`${Port}/Screening/source_GET/?source_pk_id=${SourceUrlId}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                })
                setSourceNav(response.data)
                console.log(SourceNav)
            }
            catch (error) {
                console.log('Error while fetching data', error)
            }
        }
        fetchSourceDropdown()
    }, []);

    /////////////////// Screening For ///////////////////////////
    useEffect(() => {
        if (selectedSource) {
            axios
                .get(`${Port}/Screening/screening_for_type_get/${selectedSource}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                })
                .then((response) => {
                    setScreeningFor(response.data);
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                });
        }
    }, [selectedSource]);

    ///////////////////////  Disease Dropdown /////////////////////
    useEffect(() => {
        const fetchDiseaseDropdown = async () => {
            try {
                const response = await axios.get(`${Port}/Screening/child_disease_info_get/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                })
                setDiseaseNav(response.data)
                console.log(DiseaseNav)
            }
            catch (error) {
                console.log('Error while fetching data', error)
            }
        }
        fetchDiseaseDropdown()
    }, []);

    return (
        <div>
            <div class="content-wrapper backgroundadd">
                <div class="content-header">
                    <div class="container-fluid">
                        <div className="card citizencard">
                            <div className="row ml-2">
                                <div className="back">
                                    <Link to="/mainscreen/Citizen">
                                        <ArrowBackIosIcon className='sign' />
                                    </Link>
                                </div>
                                <h5 className='namecitizen mt-2'>Add New Citizen</h5>
                            </div>

                            {/* <div className="row ">
                                <Box>
                                    <div class="container text-center">
                                        <div class="row headercitizen">
                                            <div class="col" style={{ color: "white" }} >
                                                <TextField
                                                    select
                                                    className="addcitizenheaderdropdown"
                                                    value={selectedAge}
                                                    onChange={handleAgeChange}
                                                    size="small"
                                                    error={!!ageError}
                                                    helperText={ageError}
                                                    label={
                                                        <span>
                                                            Age<span className="required-star" style={{ color: 'white' }}>*</span>
                                                        </span>
                                                    }
                                                    id="select-small"
                                                    variant="outlined"
                                                    InputLabelProps={{
                                                        style: {
                                                            fontWeight: '100',
                                                            fontSize: '14px',
                                                        },
                                                    }}
                                                    SelectProps={{
                                                        MenuProps: {
                                                            classes: {
                                                                paper: 'custom-menu-paper',
                                                            },
                                                        },
                                                    }}
                                                >
                                                    {AgeNav.map(drop => (
                                                        <MenuItem key={drop.age_pk_id} value={drop.age_pk_id}>
                                                            {drop.age}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            </div>

                                            <div class="col" style={{ color: "white" }} >
                                                <TextField
                                                    select
                                                    value={selectedGender}
                                                    // onChange={(e) => {
                                                    //     setSelectedGender(e.target.value)
                                                    //     setGenderError('')
                                                    // }}
                                                    onChange={handleGenderChange}
                                                    size="small"
                                                    error={!!genderError}
                                                    helperText={genderError}
                                                    label={
                                                        <span>
                                                            Gender<span className="required-star" style={{ color: 'white' }}>*</span>
                                                        </span>
                                                    }
                                                    id="select-small"
                                                    variant="outlined"
                                                    className=" addcitizenheaderdropdown"
                                                    InputLabelProps={{
                                                        style: {
                                                            fontWeight: '100',
                                                            fontSize: '14px',
                                                        },
                                                    }}
                                                    SelectProps={{
                                                        MenuProps: {
                                                            classes: {
                                                                paper: 'custom-menu-paper',
                                                            },
                                                        },
                                                    }}
                                                >
                                                    {GenderNav.map(drop => (
                                                        <MenuItem key={drop.gender_pk_id} value={drop.gender_pk_id}>
                                                            {drop.gender}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            </div>

                                            <div class="col" style={{ color: "white" }} >
                                                <TextField
                                                    select
                                                    className="addcitizenheaderdropdown"
                                                    value={selectedSource}
                                                    onChange={handleSourceChange}
                                                    size="small"
                                                    error={!!sourceError}
                                                    helperText={sourceError}
                                                    label={
                                                        <span>
                                                            Source<span className="required-star" style={{ color: 'white' }}>*</span>
                                                        </span>
                                                    }
                                                    id="select-small"
                                                    variant="outlined"
                                                    InputLabelProps={{
                                                        style: {
                                                            fontWeight: '100',
                                                            fontSize: '14px',
                                                        },
                                                    }}
                                                    SelectProps={{
                                                        MenuProps: {
                                                            classes: {
                                                                paper: 'custom-menu-paper',
                                                            },
                                                        },
                                                    }}
                                                >
                                                    {SourceNav.map(drop => (
                                                        <MenuItem key={drop.source_pk_id} value={drop.source_pk_id}>
                                                            {drop.source}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            </div>

                                            <div class="col" style={{ color: "white" }} >
                                                <TextField
                                                    select
                                                    className=" addcitizenheaderdropdown"
                                                    size="small"
                                                    value={selectedScheduleType}
                                                    onChange={handleScheduleTypeChange}
                                                    error={!!screeningForError}
                                                    helperText={screeningForError}
                                                    label={
                                                        <span>
                                                            Type<span className="required-star" style={{ color: 'white' }}>*</span>
                                                        </span>
                                                    }
                                                    id="select-small"
                                                    variant="outlined"
                                                    InputLabelProps={{
                                                        style: {
                                                            fontWeight: '100',
                                                            fontSize: '14px',
                                                        },
                                                    }}
                                                    SelectProps={{
                                                        MenuProps: {
                                                            classes: {
                                                                paper: 'custom-menu-paper',
                                                            },
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
                                            </div>

                                            <div class="col" style={{ color: "white" }} >
                                                <TextField
                                                    select
                                                    className=" addcitizenheaderdropdown"
                                                    value={selectedDisease}
                                                    onChange={handleDiseaseChange}
                                                    size="small"
                                                    label="Disease"
                                                    id="select-small"
                                                    variant="outlined"
                                                    InputLabelProps={{
                                                        style: {
                                                            fontWeight: '100',
                                                            fontSize: '14px',
                                                        },
                                                    }}
                                                    SelectProps={{
                                                        MenuProps: {
                                                            classes: {
                                                                paper: 'custom-menu-paper'
                                                            },
                                                        },
                                                    }}
                                                >
                                                    {DiseaseNav.map(drop => (
                                                        <MenuItem key={drop.disease_pk_id} value={drop.disease_pk_id}>
                                                            {drop.disease}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            </div>

                                            <div className='col'>
                                                <button
                                                    type='button'
                                                    className='btn addcitizensubmit btn-sm'
                                                    onClick={handlesubmit}
                                                >
                                                    Submit
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </Box>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header>
                    <Modal.Title></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    There is No form For Selected Options
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" className="btn btn-sm" onClick={handleExist}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            <div className='container'>
                {/* {currentForm === 'school' && <School
                    age={selectedAge}
                    gender={selectedGender}
                    source={selectedSource}
                    disease={selectedDisease}
                    type={selectedScheduleType} />}

                {currentForm === 'corporate' && <Corporate
                    age={selectedAge}
                    gender={selectedGender}
                    source={selectedSource}
                    disease={selectedDisease}
                    type={selectedScheduleType} />} */}
                <School
                    // age={selectedAge}
                    gender={selectedGender}
                    source={selectedSource}
                // disease={selectedDisease}
                // type={selectedScheduleType} 
                />
            </div>
        </div>
    )
}

export default Header
