import React, { useState, useEffect } from 'react'
import './Vital.css'
import greenheart from '../../../../../Images/Greenheart.png'
import blueheart from '../../../../../Images/Blueheart.png'
import darkgreeneheart from '../../../../../Images/Darkgreenheart.png'
import temperature from '../../../../../Images/temperature.png'
import blueheartline from '../../../../../Images/blueheartline.png'
import redheart from '../../../../../Images/RedHeart.png'
import { Modal, Button } from 'react-bootstrap';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton, CircularProgress } from "@mui/material";
import NotStartedIcon from '@mui/icons-material/NotStarted';
const Vital = ({ year, pkid, citizensPkId, gender, selectedId, fetchVital, selectedName, onAcceptClick }) => {

    //_________________________________START
    console.log(selectedName, 'Present name');
    console.log(fetchVital, 'Overall GET API');
    const [nextName, setNextName] = useState('');

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
    console.log(selectedId, 'selected id fetching..............');

    useEffect(() => {
        console.log('Fetched Vital Data:', fetchVital);
    }, [fetchVital]);

    console.log(userID);
    const accessToken = localStorage.getItem('token');

    const Port = process.env.REACT_APP_API_KEY;
    //////// pulse
    const [pulseValue, setPulseValue] = useState(null);
    const [pulseResponse, setPulseResponse] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    /////// sys 
    const [sys, setSys] = useState(null);
    const [sysResponse, setSysResponse] = useState('');
    const [showErrorSys, setShowErrorSys] = useState(false);
    /////// dys 
    const [dys, setDys] = useState(null);
    const [dysResponse, setDysResponse] = useState('');
    const [showErrorDys, setShowErrorDys] = useState(false);
    /////// rr 
    const [rr, setRr] = useState(null);
    const [rrResponse, setRrResponse] = useState('');
    const [showErrorRr, setShowErrorRr] = useState(false);
    /////// sats 
    const [sats, setSats] = useState(null);
    const [satsResponse, setSatsResponse] = useState('');
    const [showErrorSats, setShowErrorSats] = useState(false);
    /////// temp 
    const [temp, setTemp] = useState(null);
    console.log(temp, 'temptemptemptemptemp');

    const [tempResponse, setTempResponse] = useState('');
    const [showErrorTemp, setShowErrorTemp] = useState(false);
    /////// hb 
    const [hb, setHb] = useState(null);
    const [hbResponse, setHbResponse] = useState('');
    const [showErrorHb, setShowErrorHb] = useState(false);
    ///////// vital from
    const [showVitalForm, setShowVitalForm] = useState(false);

    ////pulse 
    useEffect(() => {
        if (pulseValue !== '') {
            const fetchData = async () => {
                try {
                    const response = await fetch(`${Port}/Screening/pulse_get_api/${year}/${pulseValue}/`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${accessToken}`, // Include the authorization header
                        },
                    });

                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }

                    const data = await response.json();
                    setPulseResponse(data.message);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };
            fetchData()
        }
    }, [pulseValue]);

    ///// sys
    useEffect(() => {
        if (sys !== '') {
            const fetchData = async () => {
                try {
                    const response = await fetch(`${Port}/Screening/sys_get_api/${year}/${sys}/`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${accessToken}`, // Include the authorization header
                        },
                    });

                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }

                    const data = await response.json();
                    setSysResponse(data.message);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };
            fetchData()
        }
    }, [sys]);

    ///// dys
    useEffect(() => {
        if (dys !== '') {
            const fetchData = async () => {
                try {
                    const response = await fetch(`${Port}/Screening/dys_get_api/${year}/${dys}/`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${accessToken}`, // Include the authorization header
                        },
                    });

                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }

                    const data = await response.json();
                    setDysResponse(data.message);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };
            fetchData()
        }
    }, [dys]);

    ///// rr
    useEffect(() => {
        if (rr !== '') {
            const fetchData = async () => {
                try {
                    const response = await fetch(`${Port}/Screening/rr_get_api/${year}/${rr}/`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${accessToken}`, // Include the authorization header
                        },
                    });

                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }

                    const data = await response.json();
                    setRrResponse(data.message);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };
            fetchData()
        }
    }, [rr]);

    ///// sats
    useEffect(() => {
        if (sats !== '') {
            const fetchData = async () => {
                try {
                    const response = await fetch(`${Port}/Screening/o2sat_get_api/${year}/${sats}/`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${accessToken}`, // Include the authorization header
                        },
                    });

                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }

                    const data = await response.json();
                    setSatsResponse(data.message);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };
            fetchData()
        }
    }, [sats]);

    ///// temp
    useEffect(() => {
        if (temp !== '') {
            const fetchData = async () => {
                try {
                    const response = await fetch(`${Port}/Screening/temp_get_api/${year}/${temp}/`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${accessToken}`,
                        },
                    });

                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }

                    const data = await response.json();
                    setTempResponse(data.message);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };
            fetchData()
        }
    }, [temp]);

    ///// hb
    useEffect(() => {
        if (hb !== '') {
            const fetchData = async () => {
                try {
                    const response = await fetch(`${Port}/Screening/hb_get_api/${gender}/${year}/${hb}/`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${accessToken}`, // Include the authorization header
                        },
                    });

                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }

                    const data = await response.json();
                    setHbResponse(data.message);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };
            fetchData()
        }
    }, [hb]);

    const handlePulseInputChange = (event) => {
        const inputValue = event.target.value.replace(/[^0-9]/g, '');

        setPulseValue(inputValue); // Update the state with the cleaned numeric value

        if (inputValue !== '') {
            const numericValue = parseInt(inputValue, 10);

            if (!isNaN(numericValue) && numericValue <= 160) {
                setShowErrorModal(false); // Clear error when the input is valid
                setPulseResponse(''); // Clear the response when the input is cleared
            } else {
                setShowErrorModal(true);
                setPulseResponse(''); // Clear the response when the input is cleared
            }
        } else {
            setShowErrorModal(false); // Clear error when the input is cleared
            setPulseResponse(''); // Clear the response when the input is cleared
        }
    };

    const handleCloseErrorModal = () => {
        setShowErrorModal(false);
    };

    ////sys 
    const handleSysInputChange = (event) => {
        const inputValue = event.target.value.replace(/[^0-9]/g, '');

        setSys(inputValue); // Update the state with the cleaned numeric value

        if (inputValue !== '') {
            const numericValue = parseInt(inputValue, 10);

            if (!isNaN(numericValue) && numericValue <= 160) {
                setShowErrorSys(false); // Clear error when the input is valid
                setSysResponse(''); // Clear the response when the input is cleared
            } else {
                setShowErrorSys(true);
                setSysResponse(''); // Clear the response when the input is cleared
            }
        } else {
            setShowErrorSys(false); // Clear error when the input is cleared
            setSysResponse(''); // Clear the response when the input is cleared
        }
    };

    const handleCloseErrorSys = () => {
        setShowErrorSys(false);
    };

    const handleDysInputChange = (event) => {
        const inputValue = event.target.value;

        if (inputValue !== '') {
            if (inputValue <= 160) {
                setDys(inputValue);
                setShowErrorDys(false); // Clear error when the input is valid
                // validateDys(inputValue);
            } else {
                setShowErrorDys(true);
                setDys(''); // Clear the input field
                setDysResponse(''); // Clear the response when the input is cleared
            }
        } else {
            setDys(''); // Clear the input field
            setShowErrorDys(false); // Clear error when the input is cleared
            setDysResponse(''); // Clear the response when the input is cleared
        }
    };

    const handleCloseErrorDys = () => {
        setShowErrorDys(false);
    };

    // RR
    const handleRrInputChange = (event) => {
        const inputValue = event.target.value;

        if (inputValue !== '') {
            if (inputValue <= 160) {
                setRr(inputValue);
                setShowErrorRr(false); // Clear error when the input is valid
                // validateRr(inputValue);
            } else {
                setShowErrorRr(true);
                setRr(''); // Clear the input field
                setRrResponse(''); // Clear the response when the input is cleared
            }
        } else {
            setRr(''); // Clear the input field
            setShowErrorRr(false); // Clear error when the input is cleared
            setRrResponse(''); // Clear the response when the input is cleared
        }
    };

    const handleCloseErrorRr = () => {
        setShowErrorRr(false);
    };

    // Sats
    const handleSatsInputChange = (event) => {
        const inputValue = event.target.value;

        if (inputValue !== '') {
            if (inputValue <= 160) {
                setSats(inputValue);
                setShowErrorSats(false); // Clear error when the input is valid
                // validateSats(inputValue);
            } else {
                setShowErrorSats(true);
                setSats(''); // Clear the input field
                setSatsResponse(''); // Clear the response when the input is cleared
            }
        } else {
            setSats(''); // Clear the input field
            setShowErrorSats(false); // Clear error when the input is cleared
            setSatsResponse(''); // Clear the response when the input is cleared
        }
    };

    const handleCloseErrorSats = () => {
        setShowErrorSats(false);
    };

    // Temp
    const [loading, setLoading] = useState(false);

    // const fetchDataTemp = async (paramValue) => {
    //     setLoading(true);
    //     try {
    //         const response = await fetch(`${Port}/Screening/device_data/?type=${paramValue}`);
    //         if (!response.ok) {
    //             throw new Error("Network response was not ok");
    //         }
    //         const data = await response.json();
    //         const tempValue = Math.floor(data.temperature);
    //         const sys = Math.floor(data.systolicPressure);
    //         const SPO2 = Math.floor(data.spo2);
    //         const pulse = Math.floor(data.heartRate);
    //         setTemp(tempValue)
    //         setSys(sys)
    //         setSats(SPO2)
    //         setPulseValue(pulse)
    //     } catch (error) {
    //         setTemp("Error fetching data");
    //     }
    //     setLoading(false);
    // };

    const fetchDatapulse = async (paramValue) => {
        setLoading(true);
        try {
            const response = await fetch(`${Port}/Screening/device_data/?type=${paramValue}`);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            const pulse = Math.floor(data.heartRate);
            setPulseValue(pulse)
        } catch (error) {
            setTemp("Error fetching data");
        }
        setLoading(false);
    };

    const fetchDataTemp = async (paramValue) => {
        setLoading(true);
        try {
            const response = await fetch(`${Port}/Screening/device_data/?type=${paramValue}`);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            const temp = Math.floor(data.temperature);
            setTemp(temp)
        } catch (error) {
            setTemp("Error fetching data");
        }
        setLoading(false);
    };

    const fetchDatadys = async (paramValue) => {
        setLoading(true);
        try {
            const response = await fetch(`${Port}/Screening/device_data/?type=${paramValue}`);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            const dys = Math.floor(data.diastolicPressure);
            setDys(dys)
        } catch (error) {
            setTemp("Error fetching data");
        }
        setLoading(false);
    };

    const fetchDatasys = async (paramValue) => {
        setLoading(true);
        try {
            const response = await fetch(`${Port}/Screening/device_data/?type=${paramValue}`);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            const sys = Math.floor(data.systolicPressure);
            setSys(sys)
        } catch (error) {
            setTemp("Error fetching data");
        }
        setLoading(false);
    };

    const fetchDataspo2 = async (paramValue) => {
        setLoading(true);
        try {
            const response = await fetch(`${Port}/Screening/device_data/?type=${paramValue}`);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            const SPO2 = Math.floor(data.spo2);
            setSats(SPO2)
        } catch (error) {
            setTemp("Error fetching data");
        }
        setLoading(false);
    };

    const handleTempInputChange = (event) => {
        const inputValue = event.target.value;

        if (inputValue !== '') {
            if (inputValue <= 170) {
                setTemp(inputValue);
                setShowErrorTemp(false);
            } else {
                setShowErrorTemp(true);
                setTemp('');
                setTempResponse('');
            }
        } else {
            setTemp('');
            setShowErrorTemp(false);
            setTempResponse('');
        }
    };

    const handleCloseErrorTemp = () => {
        setShowErrorTemp(false);
    };

    // Hb
    const handleHbInputChange = (event) => {
        const inputValue = event.target.value;

        if (inputValue !== '') {
            if (inputValue <= 20) {
                setHb(inputValue);
                setShowErrorHb(false); // Clear error when the input is valid
                // validateHb(inputValue);
            } else {
                setShowErrorHb(true);
                setHb(''); // Clear the input field
                setHbResponse(''); // Clear the response when the input is cleared
            }
        } else {
            setHb(''); // Clear the input field
            setShowErrorHb(false); // Clear error when the input is cleared
            setHbResponse(''); // Clear the response when the input is cleared
        }
    };

    const handleCloseErrorHb = () => {
        setShowErrorHb(false);
    };

    //////////// vital from
    const handleVitalForm = () => {
        setShowVitalForm(false);
    };

    const [referredToSpecialist, setReferredToSpecialist] = useState(null);

    const handleSubmit = () => {
        const isConfirmed = window.confirm('Submit Vital Form');
        const confirmationStatus = isConfirmed ? 'True' : 'False';

        const formData = {
            pulse: pulseValue !== '' ? pulseValue : null,
            pulse_conditions: pulseResponse,
            sys_mm: sys !== '' ? sys : null,
            sys_mm_conditions: sysResponse,
            dys_mm: dys !== '' ? dys : null,
            dys_mm_conditions: dysResponse,
            hb: hb !== '' ? hb : null,
            hb_conditions: hbResponse,
            oxygen_saturation: sats !== '' ? sats : null,
            oxygen_saturation_conditions: satsResponse,
            rr: rr !== '' ? rr : null,
            rr_conditions: rrResponse,
            temp: temp !== '' ? temp : null,
            temp_conditions: tempResponse,
            citizen_pk_id: citizensPkId,
            form_submit: confirmationStatus,
            added_by: userID,
            modify_by: userID,
            reffered_to_specialist: referredToSpecialist
        };


        console.log('Form Data:', formData);

        if (confirmationStatus === 'True') {
            fetch(`${Port}/Screening/citizen_vital_info_post/${pkid}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify(formData),
            })
                .then((response) => {
                    if (response.status === 201) {
                        setShowVitalForm(true);
                        onAcceptClick(nextName);
                        return response.json();
                    } else if (response.status === 400) {
                        alert('Fill the * marked Field');
                    } else if (response.status === 500) {
                        alert('Error');
                    } else if (response.status === 200) {
                        onAcceptClick(nextName);
                    }
                })
                .then((data) => {
                    console.log('Success:', data);
                })
                .catch((error) => {
                    console.error('Error:', error.message);
                });
        } else {
            // The user clicked "Cancel," do nothing or handle it as needed
            console.log('Form submission canceled');
        }
    };

    const fetchCitizenVitalInfo = () => {
        fetch(`${Port}/Screening/citizen_vital_info_get/${pkid}/`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`, // Include the authorization header
                'Content-Type': 'application/json', // Ensure correct content type
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }

                return response.json();
            })
            .then(data => {
                if (data && data.length > 0) {
                    const firstRecord = data[0];

                    if (firstRecord.reffered_to_specialist !== undefined && firstRecord.reffered_to_specialist !== null) {
                        setReferredToSpecialist(firstRecord.reffered_to_specialist);
                        console.log("Referred to Specialist:", firstRecord.reffered_to_specialist);
                    } else {
                        console.log("Referred to Specialist is undefined or null");
                    }

                    // Log all fields in the console
                    Object.keys(firstRecord).forEach(field => {
                        console.log(`${field}:`, firstRecord[field]);
                    });

                    // Set state variables for each field
                    setPulseValue(firstRecord.pulse !== null ? String(firstRecord.pulse) : '');
                    setPulseResponse(firstRecord.pulse_conditions !== null ? firstRecord.pulse_conditions : '');
                    setSys(firstRecord.sys_mm !== null ? String(firstRecord.sys_mm) : '');
                    setSysResponse(firstRecord.sys_mm_conditions !== null ? firstRecord.sys_mm_conditions : '');
                    setDys(firstRecord.dys_mm !== null ? String(firstRecord.dys_mm) : '');
                    setDysResponse(firstRecord.dys_mm_mm_conditions !== null ? firstRecord.dys_mm_mm_conditions : '');
                    setHb(firstRecord.hb !== null ? String(firstRecord.hb) : '');
                    setHbResponse(firstRecord.hb_conditions !== null ? firstRecord.hb_conditions : '');
                    setSats(firstRecord.oxygen_saturation !== null ? String(firstRecord.oxygen_saturation) : '');
                    setSatsResponse(firstRecord.oxygen_saturation_conditions !== null ? firstRecord.oxygen_saturation_conditions : '');
                    setRr(firstRecord.rr !== null ? String(firstRecord.rr) : '');
                    setRrResponse(firstRecord.rr_conditions !== null ? firstRecord.rr_conditions : '');
                    setTemp(firstRecord.temp !== null ? String(firstRecord.temp) : '');
                    setTempResponse(firstRecord.temp_conditions !== null ? firstRecord.temp_conditions : '');
                } else {
                    console.warn('Data is empty or not in the expected format.');
                }
            })
            .catch(error => console.error('Error:', error.message));
    };

    useEffect(() => {
        if (pkid) {
            fetchCitizenVitalInfo();
        }
    }, [pkid]);

    return (
        <div>
            <div className="row">
                <div className="col-md-12">
                    <div className="card vitalcard">
                        <h5 className="vitaltitle">Vital</h5>
                        {/* <EditIcon onClick={handleEditClick} className="editvitalheader" /> Edit icon from Material-UI */}
                    </div>
                </div>

                <div className="col-md-12">
                    <div className="card vitalinfocard">
                        <h5 className="vitalinfotitle">Vital Information</h5>
                        <div className="elementvital"></div>

                        <div className="row vcard">
                            <div className="col-md-4">
                                <div className={`card vitalbodycard`}>
                                    <div className="row">
                                        <div className="col-md-3">
                                            <div className="card cardvital1">
                                                <img className='redherats' src={redheart} />
                                            </div>
                                        </div>
                                        <div className="col-md-9 vitalsubheading">Pulse- beats/min</div>
                                        <div className="col-md-12">
                                            <input
                                                className={`form-control fromcontrolinputfield`}
                                                value={pulseValue || null}
                                                onChange={handlePulseInputChange}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <div className='card reporfromcard1'>
                                                <h6 className='pulseResponse'>{pulseResponse}</h6>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <IconButton onClick={() => fetchDatapulse("SPO2")} disabled={loading}>
                                                <NotStartedIcon sx={{ fontSize: 32, fontWeight: "bold", color: "black" }} />
                                            </IconButton>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <div className="card vitalbodycard">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <div className="card cardvital1">
                                                <img src={greenheart} />
                                            </div>
                                        </div>
                                        <div className="col-md-9 vitalsubheading">BP-mm Hg(sys)</div>
                                        <div className="col-md-12">
                                            <input
                                                className='form-control fromcontrolinputfield'
                                                value={sys || null}
                                                onChange={handleSysInputChange}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <div className='card reporfromcard2'>
                                                <h6 className='pulseResponse'>{sysResponse}</h6>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <IconButton onClick={() => fetchDatasys("BP")} disabled={loading}>
                                                <NotStartedIcon sx={{ fontSize: 32, fontWeight: "bold", color: "black" }} />
                                            </IconButton>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <div className="card vitalbodycard">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <div className="card cardvital2">
                                                <img src={greenheart} />
                                            </div>
                                        </div>
                                        <div className="col-md-9 vitalsubheading">BP-mm Hg(dys)</div>
                                        <div className="col-md-12">
                                            <input className='form-control fromcontrolinputfield'
                                                value={dys || null}
                                                onChange={handleDysInputChange}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <div className='card reporfromcard3'>
                                                <h6 className='pulseResponse'>{dysResponse}</h6>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <IconButton onClick={() => fetchDatadys("BP")} disabled={loading}>
                                                <NotStartedIcon sx={{ fontSize: 32, fontWeight: "bold", color: "black" }} />
                                            </IconButton>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row mt-3 vcard">
                            <div className="col-md-4">
                                <div className="card vitalbodycard">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <div className="card cardvital3">
                                                <img src={blueheart} />
                                            </div>
                                        </div>
                                        <div className="col-md-9 vitalsubheading">RR- per min</div>
                                        <div className="col-md-12">
                                            <input className='form-control fromcontrolinputfield'
                                                value={rr || null}
                                                onChange={handleRrInputChange}
                                            />
                                        </div>
                                        <div className="col-md-12">
                                            <div className='card reporfromcard4'>
                                                <h6 className='pulseResponse'>{rrResponse}</h6>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <div className="card vitalbodycard">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <div className="card cardvital1">
                                                <img src={darkgreeneheart} />
                                            </div>
                                        </div>
                                        <div className="col-md-9 vitalsubheading">O2 Sats</div>
                                        <div className="col-md-12">
                                            <input className='form-control fromcontrolinputfield'
                                                value={sats || null}
                                                onChange={handleSatsInputChange}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <div className='card reporfromcard5'>
                                                <h6 className='pulseResponse'>{satsResponse}</h6>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <IconButton onClick={() => fetchDataspo2("SPO2")} disabled={loading}>
                                                <NotStartedIcon sx={{ fontSize: 32, fontWeight: "bold", color: "black" }} />
                                            </IconButton>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <div className="card vitalbodycard">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <div className="card cardvital1">
                                                <img src={temperature} />
                                            </div>
                                        </div>
                                        <div className="col-md-9 vitalsubheading">Temperature</div>
                                        <div className="col-md-12">
                                            <input className='form-control fromcontrolinputfield'
                                                value={temp || ''}
                                                onChange={handleTempInputChange}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <div className="card reporfromcard6">
                                                <h6 className="pulseResponse">{tempResponse}</h6>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <IconButton onClick={() => fetchDataTemp("TEMPERATURE")} disabled={loading}>
                                                <NotStartedIcon sx={{ fontSize: 32, fontWeight: "bold", color: "black" }} />
                                            </IconButton>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* <div className="row mt-3 mb-3 vcard">
                            <div className="col-md-4">
                                <div className="card vitalbodycard">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <div className="card cardvital1">
                                                <img src={blueheartline} />
                                            </div>
                                        </div>
                                        <div className="col-md-9 vitalsubheading">HB</div>
                                        <div className="col-md-12">
                                            <input
                                                className='form-control fromcontrolinputfield'
                                                value={hb || null}
                                                onChange={handleHbInputChange}
                                            />
                                        </div>
                                        <div className="col-md-12">
                                            <div className='card reporfromcard7'>
                                                <h6 className='pulseResponse'>{hbResponse}</h6>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> */}

                        <div className="row mb-3 mt-4 ml-1">
                            <div className="col-md-4">
                                <h6 className="specialistedrefrresedd">Reffered To Specialist</h6>
                            </div>

                            <div className="col-md-1">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    id="yes"
                                    name="referred_to_specialist"
                                    value={1}
                                    checked={referredToSpecialist === 1} // Compare with string values
                                    onChange={() => setReferredToSpecialist(1)}
                                />
                                <label className="form-check-label" htmlFor="yes">
                                    Yes
                                </label>
                            </div>

                            <div className="col-md-1">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    id="no"
                                    name="referred_to_specialist"
                                    value={2}
                                    checked={referredToSpecialist === 2}
                                    onChange={() => setReferredToSpecialist(2)}
                                />
                                <label className="form-check-label" htmlFor="no">
                                    No
                                </label>
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div type="submit"
                                className="btn btn-sm submitvital"
                                onClick={handleSubmit}>Accept
                            </div>
                        </div>
                    </div>


                    {/* pulse */}
                    <Modal show={showErrorModal} onHide={handleCloseErrorModal}>
                        <Modal.Header>
                            <Modal.Title>Error</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>Enter the Valid Pulse Value</Modal.Body>
                        <Modal.Footer>
                            <Button variant="danger" onClick={handleCloseErrorModal}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    {/* bp sys  */}
                    <Modal show={showErrorSys} onHide={handleCloseErrorSys}>
                        <Modal.Header>
                            <Modal.Title></Modal.Title>
                        </Modal.Header>
                        <Modal.Body>Enter the Bp Value</Modal.Body>
                        <Modal.Footer>
                            <Button variant="danger" onClick={handleCloseErrorSys}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    {/* bp dys  */}
                    <Modal show={showErrorDys} onHide={handleCloseErrorDys}>
                        <Modal.Header>
                            <Modal.Title></Modal.Title>
                        </Modal.Header>
                        <Modal.Body>Enter the Bp value</Modal.Body>
                        <Modal.Footer>
                            <Button variant="danger" onClick={handleCloseErrorDys}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    {/* rr  */}
                    <Modal show={showErrorRr} onHide={handleCloseErrorRr}>
                        <Modal.Header>
                            <Modal.Title></Modal.Title>
                        </Modal.Header>
                        <Modal.Body>Enter the Valid RR Value</Modal.Body>
                        <Modal.Footer>
                            <Button variant="danger" onClick={handleCloseErrorRr}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    {/* Sats  */}
                    <Modal show={showErrorSats} onHide={handleCloseErrorSats}>
                        <Modal.Header>
                            <Modal.Title></Modal.Title>
                        </Modal.Header>
                        <Modal.Body>Enter the Valid Saturation</Modal.Body>
                        <Modal.Footer>
                            <Button variant="danger" onClick={handleCloseErrorSats}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    {/* Temperature  */}
                    <Modal show={showErrorTemp} onHide={handleCloseErrorTemp}>
                        <Modal.Header>
                            <Modal.Title></Modal.Title>
                        </Modal.Header>
                        <Modal.Body>Enter the Temp Value</Modal.Body>
                        <Modal.Footer>
                            <Button variant="danger" onClick={handleCloseErrorTemp}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    {/* HB  */}
                    <Modal show={showErrorHb} onHide={handleCloseErrorHb}>
                        <Modal.Header>
                            <Modal.Title></Modal.Title>
                        </Modal.Header>
                        <Modal.Body>Enter the Valid Hb Value</Modal.Body>
                        <Modal.Footer>
                            <Button variant="danger" onClick={handleCloseErrorHb}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    {/* form submittsion */}
                    <Modal show={showVitalForm} onHide={handleVitalForm}>
                        <Modal.Body>Vital Form Submitted Successfully.</Modal.Body>
                        <Modal.Footer>
                            <Button variant="success" onClick={handleVitalForm}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        </div>
    )
}

export default Vital
