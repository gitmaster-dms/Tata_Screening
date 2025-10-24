import React, { useState, useEffect } from 'react'
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import './Citizenlist.css'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Link } from 'react-router-dom';
import Childupdate from './Childupdate';
import { useParams } from 'react-router-dom';
import CorporateUpdate from './CorporateUpdate';

const Updatecitizen = () => {

    const accessToken = localStorage.getItem('token');
    const userID = localStorage.getItem('userID');
    console.log(userID);

    const Port = process.env.REACT_APP_API_KEY;
    const [sourceStateNav, setSourceStateNav] = useState([]);

    let { id } = useParams();
    const [data1, setData1] = useState([]);

    let { sourceId } = useParams();
    console.log(sourceId, 'sourceIdddddddddddddddddddddd');

    const [selectedAge1, setSelectedAge1] = useState({
        age: {
            id: data1.age_id || '',
            name: data1.age || '',
        },
        gender: {
            id: data1.gender_id || '',
            name: data1.gender || '',
        },
        source: {
            id: data1.source_id || '',
            name: data1.source || '',
        },
        type: {
            id: data1.type_id || '',
            name: data1.type || '',
        },
        disease: {
            id: data1.disease_id || '',
            name: data1.disease || '',
        },
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        const selectedOption = {
            id: '',
            name: value,
        };

        switch (name) {
            case 'age':
                selectedOption.id = AgeNav.find(option => option.age === value)?.age_pk_id || '';
                break;
            case 'gender':
                selectedOption.id = GenderNav.find(option => option.gender === value)?.gender_pk_id || '';
                break;
            case 'source':
                selectedOption.id = SourceNav.find(option => option.source === value)?.source_pk_id || '';
                break;
            case 'type':
                selectedOption.id = screeningFor.find(option => option.type === value)?.type_id || '';
                break;
            case 'disease':
                selectedOption.id = DiseaseNav.find(option => option.disease === value)?.disease_pk_id || '';
                break;
            default:
                break;
        }

        console.log(selectedOption, 'sooooooooo');
        setSelectedAge1((prevSelectedAge1) => ({
            ...prevSelectedAge1,
            [name]: { id: selectedOption.id, name: value }
        }));

        if (name == 'source') {
            axios
                .get(`${Port}/Screening/screening_for_type_get/${selectedOption.id}`)
                .then((response) => {
                    setScreeningFor(response.data);
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                });
        }
        console.log(selectedAge1, "oooooooooooo");

    };

    useEffect(() => {
        let apiUrl;
        if (sourceId === 'School' || sourceId === 'Community') {
            apiUrl = `${Port}/Screening/add_citizen_get/${id}/`;
        } else if (sourceId === 'Corporate') {
            apiUrl = `${Port}/Screening/add_employee_get/${id}/`;
        } else {
            return;
        }

        const accessToken = localStorage.getItem('token'); // Retrieve access token

        axios.get(apiUrl, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        })
            .then((response) => {
                console.log('API response:', response.data);
                setData1(response.data);
                console.log(data1.type, 'kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk');

                setSelectedAge1({
                    age: { id: response.data.age || '', name: response.data.age_name || '' },
                    gender: { id: response.data.gender || '', name: response.data.gender_name || '' },
                    source: { id: response.data.source || '', name: response.data.source_id_name || '' },
                    type: { id: response.data.type || '', name: response.data.type_name || '' },
                    disease: { id: response.data.disease || '', name: response.data.disease_name || '' }
                });

                axios.get(`${Port}/Screening/source_and_pass_state_Get/${response.data.source}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                })
                    .then((anotherResponse) => {
                        console.log('Another API response:', anotherResponse.data);
                        setSourceStateNav(anotherResponse.data);
                    })
                    .catch((anotherError) => {
                        console.error('Error in the second API call:', anotherError);
                    });
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }, []);

    //////////// nav dropdown usestate /////////////////
    const [AgeNav, setAgeNav] = useState([]);
    const [GenderNav, setGenderNav] = useState([]);
    const [SourceNav, setSourceNav] = useState([]);
    const [screeningFor, setScreeningFor] = useState([]);
    const [DiseaseNav, setDiseaseNav] = useState([]);

    /////////////////// Validation error
    const [ageError, setAgeError] = useState('');
    const [genderError, setGenderError] = useState('');
    const [sourceError, setSourceError] = useState('');

    ///////////////////////  AGE Dropdown /////////////////////
    useEffect(() => {
        const fetchAgeDropdown = async () => {
            try {
                const response = await axios.get(`${Port}/Screening/Age_GET/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                });
                setAgeNav(response.data);
                console.log(AgeNav);
            } catch (error) {
                console.log('Error while fetching data', error);
            }
        };
        fetchAgeDropdown();
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
                const response = await axios.get(`${Port}/Screening/source_GET/`, {
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

    //////////////////// type
    useEffect(() => {
        if (data1.source) {
            axios
                .get(`${Port}/Screening/screening_for_type_get/${data1.source}`, {
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
    }, [data1.source]);

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
                console.log(response.data, "kkkkkkkkkkkkkkkkkk")
            }
            catch (error) {
                console.log('Error while fetching data', error)
            }
        }
        fetchDiseaseDropdown()
    }, []);

    useEffect(() => {
        console.log('Selected Age:', selectedAge1);
    }, [selectedAge1]);

    return (

        <div>
            <div>
                <div class="content-wrapper backgroundadd">
                    <div class="content-header">
                        <div class="container-fluid">
                            <div className="card citizencard">
                                <div className="row ml-2">
                                    <div className="">
                                        <Link to="/mainscreen/Citizen">
                                            <ArrowBackIosIcon className='signupdate pl-1' />
                                        </Link>
                                    </div>
                                    <h5 className='namecitizen ml-1'>Update Citizen</h5>
                                </div>

                                {/* <div className="row mb-3 dropdownall">
                                    <Box>
                                        <div class="container text-center">
                                            <div class="row headerupdatecitizen">
                                                <div class="col">
                                                    <TextField
                                                        select
                                                        name='age'
                                                        className="UpdateCitizenDropdown"
                                                        value={selectedAge1.age.name}
                                                        onChange={handleChange}
                                                        size="small"
                                                        error={!!ageError}
                                                        helperText={ageError}
                                                        label={
                                                            <span>
                                                                Age<span className="required-star" style={{ color: 'red' }}>*</span>
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

                                                            renderValue: (selected) => (
                                                                <span style={{ color: 'white' }}>{selected}</span>
                                                            ),
                                                        }}
                                                    >
                                                        {AgeNav.map(drop => (
                                                            <MenuItem key={drop.age} value={drop.age}>
                                                                {drop.age}
                                                            </MenuItem>
                                                        ))}
                                                    </TextField>
                                                </div>

                                                <div class="col">
                                                    <TextField
                                                        select
                                                        name='gender'
                                                        className="UpdateCitizenDropdown"
                                                        value={selectedAge1.gender.name}
                                                        onChange={handleChange}
                                                        size="small"
                                                        error={!!genderError}
                                                        helperText={genderError}
                                                        label={
                                                            <span>
                                                                Gender<span className="required-star" style={{ color: 'red' }}>*</span>
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
                                                            renderValue: (selected) => (
                                                                <span style={{ color: 'white' }}>{selected}</span>
                                                            ),
                                                        }}
                                                    >
                                                        {GenderNav.map(drop => (
                                                            <MenuItem key={drop.gender_pk_id} value={drop.gender}>
                                                                {drop.gender}
                                                            </MenuItem>
                                                        ))}
                                                    </TextField>
                                                </div>

                                                <div class="col">
                                                    <TextField
                                                        select
                                                        name='source'
                                                        className="UpdateCitizenDropdown"

                                                        value={selectedAge1.source.name}
                                                        onChange={handleChange}
                                                        size="small"
                                                        error={!!sourceError}
                                                        helperText={sourceError}
                                                        label={
                                                            <span>
                                                                Source<span className="required-star" style={{ color: 'red' }}>*</span>
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
                                                            renderValue: (selected) => (
                                                                <span style={{ color: 'white' }}>{selected}</span>
                                                            ),
                                                        }}
                                                    >
                                                        {SourceNav.map(drop => (
                                                            <MenuItem key={drop.source_pk_id} value={drop.source}>
                                                                {drop.source}
                                                            </MenuItem>
                                                        ))}
                                                    </TextField>
                                                </div>

                                                <div className="col">
                                                    <TextField
                                                        select
                                                        name='type'
                                                        className="UpdateCitizenDropdown"
                                                        size="small"
                                                        value={selectedAge1.type.name}
                                                        onChange={handleChange}
                                                        label={
                                                            <span>
                                                                Type<span className="required-star" style={{ color: 'red' }}>*</span>
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
                                                            renderValue: (selected) => (
                                                                <span style={{ color: 'white' }}>{selected}</span>
                                                            ),
                                                        }}
                                                    >
                                                        <MenuItem>Select The Type</MenuItem>
                                                        {screeningFor.map((drop) => (
                                                            <MenuItem key={drop.type_id} value={drop.type}>
                                                                {drop.type}
                                                            </MenuItem>
                                                        ))}
                                                    </TextField>
                                                </div>

                                                <div class="col">
                                                    <TextField
                                                        select
                                                        name='disease'
                                                        className="UpdateCitizenDropdown"

                                                        value={selectedAge1.disease.name}
                                                        onChange={handleChange}
                                                        size="small"
                                                        error={!!sourceError}
                                                        helperText={sourceError}
                                                        label={
                                                            <span>
                                                                Disease<span className="required-star" style={{ color: 'red' }}>*</span>
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
                                                            renderValue: (selected) => (
                                                                <span style={{ color: 'white' }}>{selected}</span>
                                                            ),
                                                        }}
                                                    >
                                                        {DiseaseNav.map(drop => (
                                                            <MenuItem key={drop.disease} value={drop.disease}>
                                                                {drop.disease}
                                                            </MenuItem>
                                                        ))}
                                                    </TextField>
                                                </div>
                                            </div>
                                        </div>
                                    </Box>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* <div className='container'>
                <Childupdate
                    data={data1}
                    main={selectedAge1}
                    state={sourceStateNav}
                />
            </div>

            <div className='container'>
                {currentForm === 'Form2' && 'HEYyyyyyyyyyyyyyyyyyyyyy'}
            </div> */}

            <div className='container'>
                {/* {sourceId === 'School' && (
                    <Childupdate
                        data={data1}
                        main={selectedAge1}
                        state={sourceStateNav}
                    />
                )} */}
                {sourceId === 'Community' && (
                    <Childupdate
                        data={data1}
                        main={selectedAge1}
                        state={sourceStateNav}
                    />
                )}
                {sourceId === 'Corporate' && (
                    <CorporateUpdate
                        data={data1}
                        main={selectedAge1}
                        state={sourceStateNav}
                    />
                )}
            </div>

        </div>
    )
}

export default Updatecitizen
