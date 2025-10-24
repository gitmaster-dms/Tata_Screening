import React, { useState, useEffect } from 'react'
import './Report.css'
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import axios from 'axios'
import './Report.css'
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

const Report = () => {

    const Port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');
    const [sourceOption, setSourceOption] = useState([]);
    const [screeningForNav, setScreeningForNav] = useState([]);
    const [classList, setClassList] = useState([]);

    /////////// Navbar API
    const [selectedSourceNav, setSelectedSourceNav] = useState('')
    const [selectedTypeNav, setSelectedTypeNav] = useState('')
    const [selectedClassNav, setSelectedClassNav] = useState('')
    const [selectedCount, setSelectedCount] = useState('')

    /////// table start
    const [showTable, setShowTable] = useState(false);

    const [data, setData] = useState([
        {
            'citizenName': 'Anjali Batale',
            'citizenDetails': '1',
            'familyInformation': '1',
            'bmi': '2',
            'basicScreening': '2',
            'immunization': '2',
            'auditory': '1',
            'dentalCheckUp': '1',
            'vision': '1',
            'psychological': '1',
            'medical': '1',
            'investigation': '1'
        }
    ])

    const handleSearch = () => {
        setShowTable(true);
    }

    /////// table end

    ////////////////////////// Form value dropdown get ///////////////////////////////
    useEffect(() => {
        axios.get(`${Port}/Screening/Source_Get/`, {
            headers: {
                Authorization: `Bearer ${accessToken}` // Include the token in the Authorization header
            }
        })
            .then(response => {
                setSourceOption(response.data);
            })
            .catch(error => {
                console.error('Error fetching sources:', error);
            });
    }, []);

    ///// Screening Type Nav 
    useEffect(() => {
        if (selectedSourceNav) {
            axios.get(`${Port}/Screening/screening_for_type_get/${selectedSourceNav}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
                .then(response => {
                    setScreeningForNav(response.data);
                })
                .catch(error => {
                    console.error("Error fetching data:", error);
                });
        }
    }, [selectedSourceNav]);

    ///// Screening Type Nav 
    useEffect(() => {
        axios.get(`${Port}/Screening/get_class/`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
            .then(response => {
                setClassList(response.data);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
    }, []);

    ///// modal openeing 
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState('');

    const handleIconClick = (content) => {
        setModalContent(content);
        setShowModal(true);
    };

    return (
        <div>
            <div class="content-wrapper backgroundschedule">
                <div class="content-header">
                    <div class="container-fluid">
                        <div className="card Schedulecard">
                            <div class="row">
                                <div class="col">
                                    <h5 className='Schedulelisttitle'>Report List</h5>
                                </div>
                            </div>

                            <div className="row ml-3 mt-1 pb-3">
                                <Box>
                                    <div class="container text-center">
                                        <div class="row">
                                            <div class="col">
                                                <TextField
                                                    select
                                                    className="reportinputfield"
                                                    size="small"
                                                    label=" Screening Source"
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
                                                    value={selectedSourceNav}
                                                    onChange={(e) => setSelectedSourceNav(e.target.value)}
                                                >
                                                    <MenuItem value="">Select Source</MenuItem>
                                                    {sourceOption.map(drop => (
                                                        <MenuItem key={drop.source_pk_id} value={drop.source_pk_id}>
                                                            {drop.source}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            </div>

                                            <div class="col">
                                                <TextField
                                                    select
                                                    className="reportinputfield"
                                                    size="small"
                                                    label="Type"
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
                                                    value={selectedTypeNav}
                                                    onChange={(e) => setSelectedTypeNav(e.target.value)}
                                                >
                                                    <MenuItem>Select Type</MenuItem>
                                                    {screeningForNav.map((drop) => (
                                                        <MenuItem key={drop.type_id} value={drop.type_id}>
                                                            {drop.type}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            </div>

                                            {selectedSourceNav === '1' && ( // Render if source is '1'
                                                <div class="col">
                                                    <TextField
                                                        select
                                                        className="reportinputfield"
                                                        size="small"
                                                        label="Class"
                                                        id="select-small"
                                                        variant="outlined"
                                                        InputLabelProps={{
                                                            style: {
                                                                fontWeight: '100',
                                                                fontSize: '14px', // Set the desired font size for the label
                                                            },
                                                        }}
                                                        SelectProps={{
                                                            MenuProps: {
                                                                classes: {
                                                                    paper: 'custom-menu-paper',
                                                                },
                                                            },
                                                        }}
                                                        value={selectedClassNav}
                                                        onChange={(e) => setSelectedClassNav(e.target.value)}
                                                    >
                                                        <MenuItem value="">Select Class</MenuItem>
                                                        {classList.map((drop) => (
                                                            <MenuItem key={drop.class_id} value={drop.class_id}>
                                                                {drop.class_name}
                                                            </MenuItem>
                                                        ))}

                                                    </TextField>
                                                </div>
                                            )}

                                            <div class="col">
                                                <TextField
                                                    select
                                                    className="reportinputfield"
                                                    size="small"
                                                    label="Screening ID"
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
                                                    value={selectedCount}
                                                    onChange={(e) => setSelectedCount(e.target.value)}
                                                >
                                                    <MenuItem>Select ID</MenuItem>
                                                    <MenuItem value="1">1</MenuItem>
                                                    <MenuItem value="2">2</MenuItem>
                                                    <MenuItem value="3">3</MenuItem>

                                                </TextField>
                                            </div>

                                            <div className='col'>
                                                <button
                                                    type='button'
                                                    className='btn btn-sm addschedule'
                                                    onClick={handleSearch}
                                                >
                                                    Search
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </Box>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {selectedSourceNav === 1 && showTable && (
                <div class="content-wrapper">
                    <div class="content-header">
                        <div className="row table-container">
                            <table className="table table-borderless">
                                <thead className="">
                                    <tr className="card reportheadeuser">
                                        <th className="col">Sr No.</th>
                                        <th className="col">Citizen Name</th>
                                        <th className="col">Citizen Details</th>
                                        <th className="col">Family Information</th>
                                        <th className="col">BMI</th>
                                        <th className="col">Basic Screening</th>
                                        <th className="col">Immunization</th>
                                        <th className="col">Auditory</th>
                                        <th className="col">Dental CheckUp</th>
                                        <th className="col">Vision</th>
                                        <th className="col">Psychological</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {data.map((row, index) => (
                                        <tr key={index} className="card cardbodyuser">
                                            <td className="col">{index + 1}</td>
                                            <td className="col">{row.citizenName}</td>
                                            <td className="col" onClick={() => handleIconClick(row.citizenDetails)}>{row.citizenDetails === '1' ? <CheckIcon /> : <CloseIcon />}</td>
                                            <td className="col">{row.familyInformation === '1' ? <CheckIcon /> : <CloseIcon />}</td>
                                            <td className="col">{row.bmi === '1' ? <CheckIcon /> : <CloseIcon />}</td>
                                            <td className="col">{row.basicScreening === '1' ? <CheckIcon /> : <CloseIcon />}</td>
                                            <td className="col">{row.immunization === '1' ? <CheckIcon /> : <CloseIcon />}</td>
                                            <td className="col">{row.auditory === '1' ? <CheckIcon /> : <CloseIcon />}</td>
                                            <td className="col">{row.dentalCheckUp === '1' ? <CheckIcon /> : <CloseIcon />}</td>
                                            <td className="col">{row.vision === '1' ? <CheckIcon /> : <CloseIcon />}</td>
                                            <td className="col">{row.psychological === '1' ? <CheckIcon /> : <CloseIcon />}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* /// corporate */}
            {selectedSourceNav === 5 && showTable && (
                <div class="content-wrapper">
                    <div class="content-header">
                        <div className="row table-container">
                            <table className="table table-borderless">
                                <thead className="">
                                    <tr className="card reportheadeuser">
                                        <th className="col">Sr No.</th>
                                        <th className="col">Citizen Name</th>
                                        <th className="col">Citizen Details</th>
                                        <th className="col">Family Information</th>
                                        <th className="col">BMI</th>
                                        <th className="col">Basic Screening</th>
                                        <th className="col">Immunization</th>
                                        <th className="col">Auditory</th>
                                        <th className="col">Dental CheckUp</th>
                                        <th className="col">Vision</th>
                                        <th className="col">Medical History</th>
                                        <th className="col">Investigation</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {data.map((row, index) => (
                                        <tr key={index} className="card cardbodyuser">
                                            <td className="col">{index + 1}</td>
                                            <td className="col">{row.citizenName}</td>
                                            <td className="col">{row.citizenDetails === '1' ? <CheckIcon /> : <CloseIcon />}</td>
                                            <td className="col">{row.familyInformation === '1' ? <CheckIcon /> : <CloseIcon />}</td>
                                            <td className="col">{row.bmi === '1' ? <CheckIcon /> : <CloseIcon />}</td>
                                            <td className="col">{row.basicScreening === '1' ? <CheckIcon /> : <CloseIcon />}</td>
                                            <td className="col">{row.immunization === '1' ? <CheckIcon /> : <CloseIcon />}</td>
                                            <td className="col">{row.auditory === '1' ? <CheckIcon /> : <CloseIcon />}</td>
                                            <td className="col">{row.dentalCheckUp === '1' ? <CheckIcon /> : <CloseIcon />}</td>
                                            <td className="col">{row.vision === '1' ? <CheckIcon /> : <CloseIcon />}</td>
                                            <td className="col">{row.medical === '1' ? <CheckIcon /> : <CloseIcon />}</td>
                                            <td className="col">{row.investigation === '1' ? <CheckIcon /> : <CloseIcon />}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {showModal && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'fixed', left: 0, top: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '5px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)' }}>
                        <span style={{ color: '#aaa', float: 'right', fontSize: '28px', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => setShowModal(false)}>&times;</span>
                        Heyyyyyy
                        {modalContent}
                    </div>
                </div>
            )}

        </div>
    )
}

export default Report;
