import React, { useState, useEffect } from 'react'
import './School.css'
import axios from 'axios'
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import MenuItem from '@mui/material/MenuItem';

const School = (props) => {

    /// State District Tehsil
    const State = localStorage.getItem('StateLogin');
    const District = localStorage.getItem('DistrictLogin');
    const Tehsil = localStorage.getItem('TehsilLogin');

    const Port = process.env.REACT_APP_API_KEY;
    const [GenderNav, setGenderNav] = useState([]);
    const [selectedGender, setSelectedGender] = useState('');
    const [genderError, setGenderError] = useState('');

    const handleGenderChange = (e) => {
        setSelectedGender(e.target.value);
        setGenderError('');
    };

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

    const userID = localStorage.getItem('userID');
    console.log(userID);
    const accessToken = localStorage.getItem('token');

    const navigate = useNavigate();
    const [bmiBgColor, setBmiBgColor] = useState('');
    const selectedAge = props.age;
    const selectedSource = props.source;
    const selectedDisease = props.disease;
    const selectedTypeValue = props.type;

    const [dob, setDOB] = useState([])
    const [age, setAge] = useState({ year: 0, months: 0, days: 0 })
    ///////// state district tehsil API
    const [sourceState, setSourceState] = useState([]);
    const [sourceDistrict, setSourceDistrict] = useState([]);
    const [sourceTehsil, setSourceTehsil] = useState([]);
    const [sourceName, setSourceName] = useState([]);
    const [location, setLocation] = useState([]);

    const [classList, setClassList] = useState([]); //// class API
    const [divisionList, setDivisionList] = useState([]); //

    const [selectedState, setSelectedState] = useState(State || '');
    console.log(selectedState, 'selectedStateselectedStateselectedStateselectedState');

    const [selectedDistrict, setSelectedDistrict] = useState(District || '');
    console.log(selectedDistrict, 'selectedDistrictselectedDistrict');

    const [selectedTehsil, setSelectedTehsil] = useState(Tehsil || '');
    const [selectedSourceName, setSelectedSourceName] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedDivision, setSelectedDivision] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
    const [showModal, setShowModal] = useState(false); /////// model 
    const [showModalMissing, setShowModalMissing] = useState(false); /////// model missinmg data
    const [showModalExist, setShowModalExist] = useState(false); /////// model missinmg data
    const [fetchingData, setFetchingData] = useState(false);

    const SourceNameUrlId = localStorage.getItem('SourceNameFetched');

    const [errors, setErrors] = useState({
        name: "",
        blood_groups: "",
        // aadhar_id: "",
        dob: '',
        year: '',
        months: '',
        days: '',

        height: "",
        weight: "",

        father_name: "",
        mother_name: "",
        parents_mobile: "",

        state: "",
        // pincode: "",
        address: "",
    });

    const validateForm = () => {
        const newErrors = {};

        if (!selectData.name) {
            newErrors.name = 'Name is required';
        }

        // if (!selectData.aadhar_id) {
        //     newErrors.aadhar_id = 'Adhar Id is required';
        // }

        if (!selectData.father_name) {
            newErrors.father_name = 'Father Name is required';
        }

        if (!selectData.mother_name) {
            newErrors.mother_name = 'Mother Name is required';
        }

        if (!selectData.parents_mobile) {
            newErrors.parents_mobile = 'Contact Number is required';
        }

        // Validate Height
        if (!selectData.height || parseInt(selectData.height, 10) >= 221) {
            newErrors.height = 'Height must below 221cm';
        }

        if (!selectData.weight || parseInt(selectData.weight, 10) >= 400) {
            newErrors.weight = 'Weight must below 400Kg';
        }

        // if (!selectData.pincode) {
        //     newErrors.pincode = 'Pincode is required';
        // }

        if (!selectData.state) {
            newErrors.state = 'state is required';
        }

        if (!selectData.blood_groups) {
            newErrors.blood_groups = 'Blood Group is required';
        }

        // Validate Date of Birth
        if (!selectData.dob) {
            newErrors.dob = 'Date of Birth is required';
        }

        // Validate Date of Birth
        if (!selectData.year) {
            newErrors.doyearb = 'Year is required';
        }

        if (!selectData.address) {
            newErrors.address = 'Address is required';
        }

        setErrors(newErrors);
        return true;
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        // Validate Height input
        if (name === 'height') {
            const numericValue = parseFloat(value);

            if (isNaN(numericValue) || numericValue <= 1.5 || numericValue < 45 || numericValue > 221) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    [name]: 'Enter a valid height between 45cm and 221cm.',
                }));
            } else {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    [name]: '',
                }));
            }
        }

        // Validate weight input
        if (name === 'weight') {
            const numericValue = parseFloat(value);

            if (isNaN(numericValue) || numericValue <= 1.5 || numericValue <= 1 || numericValue > 400) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    [name]: 'Enter a valid weight between 1kg and 400kg.',
                }));
            } else {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    [name]: '',
                }));
            }
        }

        // Validate State
        if (name === 'state') {
            if (!value) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    [name]: 'State is required',
                }));
            } else {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    [name]: '',
                }));
            }
            setSelectedState(value);
        }

        else if (name === 'district') {
            setSelectedDistrict(value)
        }
        else if (name === 'tehsil') {
            setSelectedTehsil(value)
            console.log();
        }
        else if (name === 'source_names') {
            setSelectedSourceName(value)
        }
        else if (name === 'location') {
            setSelectedLocation(value)
        }
        else if (name === 'Class') {
            setSelectedClass(value)
        }
        else if (name === 'division') {
            setSelectedDivision(value)
        }
        else {
            setSelectData((prevState) => ({ ...prevState, [name]: value }));
        }

        validateForm(name, value);
    };

    ////////////// modal
    const handleCloseModal = () => {
        setShowModal(false);
    };

    ////////////// modal  missing
    const handleMissing = () => {
        setShowModalMissing(false);
    };

    ////////////// modal  exist
    const handleExist = () => {
        setShowModalExist(false);
    };

    /////////////////////// POST API ///////////////
    const [selectData, setSelectData] = useState(
        {
            name: "",
            blood_groups: "",
            aadhar_id: "123456789012",

            height: "",
            weight: "",
            weight_for_age: "",
            height_for_age: "",
            weight_for_height: "",

            bmi: null,
            arm_size: null,
            symptoms: "",

            father_name: "",
            mother_name: "",
            occupation_of_father: "",
            occupation_of_mother: "",
            parents_mobile: "",
            sibling_count: "",

            pincode: "123456",
            address: "",
            added_by: userID
        }
    )

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isValid = validateForm();

        // Validate Aadhar ID
        // if (!selectData.aadhar_id || selectData.aadhar_id.toString().length !== 12) {
        //     // Set error message or take appropriate action
        //     if (!selectData.aadhar_id) {
        //         setErrors({ aadhar_id: 'Aadhar ID is required' });
        //         alert('adhar id required')
        //     } else {
        //         setErrors({ aadhar_id: 'Aadhar ID should be exactly 12 digits' });
        //         alert('Aadhar ID should be exactly 12 digits')
        //     }

        //     // Form should not submit if there are errors
        //     console.log('Form has errors, please correct them.');
        //     return;
        // }

        // if (!selectData.pincode || selectData.pincode.toString().length !== 6) {
        //     // Set error message or take appropriate action
        //     if (!selectData.pincode) {
        //         setErrors({ pincode: 'Pincode is required' });
        //         alert('Pincode required')
        //     } else {
        //         setErrors({ pincode: 'Pincode should be exactly 6 digits' });
        //         alert('Pincode should be exactly 6 digits')
        //     }

        //     // Form should not submit if there are errors
        //     console.log('Form has errors, please correct them.');
        //     return;
        // }

        // if (!selectData.parents_mobile || selectData.parents_mobile.toString().length !== 10) {
        //     if (!selectData.parents_mobile) {
        //         setErrors({ parents_mobile: 'Phone Number is required' });
        //         alert('Phone Number required')
        //     } else {
        //         setErrors({ parents_mobile: 'Phone Number should be exactly 10 digits' });
        //         alert('Phone Number should be exactly 10 digits')
        //     }

        //     console.log('Form has errors, please correct them.');
        //     return;
        // }

        if (isValid) {
            const formData = {
                ...selectData,
                age: selectedAge,
                gender: selectedGender,
                source: selectedSource,
                disease: selectedDisease,
                state: selectedState,
                district: selectedDistrict,
                tehsil: selectedTehsil,
                source_name: selectedSourceName,
                location: selectedLocation,
                type: selectedTypeValue,
                dob: dob,
                days: age.days,
                months: age.months,
                year: age.year,
                Class: selectedClass,
                division: selectedDivision,
            };

            console.log('ghgjhgjh', formData);

            try {
                const response = await fetch(`${Port}/Screening/add_citizen_post/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify(formData)
                });

                if (response.status === 201 || response.json === 200) {
                    const data = await response.json();
                    setShowModal(true);
                    console.log('Data sent successfully:', data);
                    navigate('/mainscreen/Citizen');
                }
                else if (response.status === 400) {
                    setShowModalMissing(true);
                }
                else if (response.status === 409) {
                    alert("Citizen is already registered with the given Aadhar ID")
                }
                else if (response.status === 500) {
                    // setShowModalExist(true);
                    alert('Internal Server Error')
                }
                else {
                    console.error('Error sending data. Unexpected response:', response);
                }
            } catch (error) {
                console.error('Error sending data:', error);
            }
        } else {
            console.log('Form has errors, please correct them.');
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (
                    age.year !== undefined ||
                    age.months !== undefined ||
                    age.days !== undefined ||
                    (age.year === 0 && age.months === 0 && age.days === 0)
                ) {
                    setFetchingData(true);

                    // BMI API
                    const bmiResponse = await fetch(
                        `${Port}/Screening/SAM_MAM_BMI/${age.year || '0'}/${age.months || '0'}/${selectedGender}/${selectData.height}/${selectData.weight}/`,
                        {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${accessToken}`,
                            },
                        }
                    );

                    if (!bmiResponse.ok) {
                        throw new Error('BMI API: Network response was not ok');
                    }

                    const bmiData = await bmiResponse.json();
                    console.log('BMI API Response:', bmiData.bmi);


                    if (bmiData.bmi) {
                        const bmiValue = bmiData.bmi;
                        console.log('BMI Value:', bmiValue);

                        setResponseMessage(bmiValue);

                        // Determine color and background color based on BMI value
                        let textColor, bgColor;
                        if (bmiValue < 18.5) {
                            textColor = 'orange'; // Underweight
                            bgColor = 'lightyellow'; // Set the background color for underweight
                        } else if (bmiValue < 25) {
                            textColor = 'green'; // Normal weight
                            bgColor = 'lightgreen'; // Set the background color for normal weight
                        } else if (bmiValue < 30) {
                            textColor = 'red'; // Overweight
                            bgColor = 'lightcoral'; // Set the background color for overweight
                        } else {
                            bgColor = 'darkred'; // Set the background color for obese
                        }

                        setBmiBgColor(bgColor); // Add a state variable for background color
                        setSelectData((prevData) => ({ ...prevData, bmi: bmiValue }));
                        setSelectData((prevData) => ({ ...prevData, weight_for_age: '' }));
                    } else {
                        console.error('BMI API: BMI not found in the response.');
                    }

                    // SAM MAM API
                    const samMamResponse = await fetch(
                        `${Port}/Screening/SAM_MAM_BMI/${age.year || '0'}/${age.months || '0'}/${selectedGender}/${selectData.height}/${selectData.weight}/`,
                        {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${accessToken}`,
                            },
                        }
                    );

                    if (!samMamResponse.ok) {
                        throw new Error('SAM MAM API: Network response was not ok');
                    }

                    const samMamData = await samMamResponse.json();
                    console.log('SAM MAM API Response:', samMamData);

                    if (
                        samMamData.weight_for_age1 &&
                        samMamData.height_for_age2 &&
                        samMamData.height_for_weight3
                    ) {
                        setSelectData((prevData) => ({
                            ...prevData,
                            weight_for_age: samMamData.weight_for_age1,
                            height_for_age: samMamData.height_for_age2,
                            weight_for_height: samMamData.height_for_weight3,
                        }));
                    } else {
                        console.error('SAM MAM API: Required data not found in the response.');
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setFetchingData(false);
            }
        };

        fetchData();
    }, [age.year, age.months, selectedGender, selectData.height, selectData.weight]);

    //// Source State against selected source ////////
    useEffect(() => {
        const fetchStateOptions = async () => {
            if (selectedSource) {
                try {
                    const accessToken = localStorage.getItem('token'); // Retrieve access token
                    const response = await axios.get(`${Port}/Screening/source_and_pass_state_Get/${selectedSource}`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    const options = response.data;
                    setSourceState(options);
                    console.log(sourceState);
                } catch (error) {
                    console.log('Error While Fetching State', error);
                }
            }
        };
        fetchStateOptions();
    }, [selectedSource]);

    //// Source district against selected state
    useEffect(() => {
        const fetchDistrictOptions = async () => {
            if (selectedState) {
                try {
                    const accessToken = localStorage.getItem('token'); // Retrieve access token
                    const res = await fetch(`${Port}/Screening/state_and_pass_district_Get/${selectedSource}/${selectedState}/`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    const data = await res.json();
                    setSourceDistrict(data);
                    console.log(data);
                } catch (error) {
                    console.error("Error fetching districts against state data:", error);
                }
            }
        };
        fetchDistrictOptions();
    }, [selectedState]);

    //// Source tehsil against selected district
    useEffect(() => {
        const fetchSourceTehsilOptions = async () => {
            if (selectedDistrict) {
                try {
                    const accessToken = localStorage.getItem('token'); // Retrieve access token
                    const res = await fetch(`${Port}/Screening/district_and_pass_taluka_Get/${selectedSource}/${selectedDistrict}/`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    const data = await res.json();
                    setSourceTehsil(data);
                    console.log(data);
                } catch (error) {
                    console.error("Error fetching tehsils against district data:", error);
                }
            }
        };
        fetchSourceTehsilOptions();
    }, [selectedDistrict]);

    //// Source Name against selected tehsil
    useEffect(() => {
        const fetchSourceNameOptions = async () => {
            if (selectedTehsil) {
                try {
                    const accessToken = localStorage.getItem('token'); // Retrieve access token
                    const res = await fetch(`${Port}/Screening/taluka_and_pass_SourceName_Get/?SNid=${selectedTehsil}&So=${selectedSource}&source_pk_id=${SourceNameUrlId}`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    const data = await res.json();
                    setSourceName(data);
                    console.log(data);
                } catch (error) {
                    console.error("Error fetching Institution Name against tehsil data:", error);
                }
            }
        };
        fetchSourceNameOptions();
    }, [selectedTehsil]);

    //// Location against selected SourceName
    useEffect(() => {
        const fetchLocation = async () => {
            if (selectedSourceName) {
                try {
                    // const accessToken = localStorage.getItem('token');
 
                    const res = await fetch(`${Port}/Screening/location_get_api/?wrd_inst=${selectedSourceName}`, {
                        headers: {
                            // 'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    const data = await res.json();
                    setLocation(data);
                    console.log(data,'llllllll');
                } catch (error) {
                    console.error("Error fetching Location:", error);
                }
            }
        };
        fetchLocation();
    }, [selectedSourceName]);

    /////// Class GET API 
    useEffect(() => {
        const fetchClass = async () => {
            try {
                const accessToken = localStorage.getItem('token'); // Retrieve access token
                const response = await axios.get(`${Port}/Screening/get_class/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                });
                setClassList(response.data);
            }
            catch (error) {
                console.log(error, 'Error fetching Class');
            }
        };
        fetchClass();
    }, [])

    /////// Division GET API 
    useEffect(() => {
        const fetchDivision = async () => {
            try {
                const accessToken = localStorage.getItem('token'); // Retrieve access token
                const response = await axios.get(`${Port}/Screening/get_division/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                });
                setDivisionList(response.data);
            } catch (error) {
                console.log(error, 'Error fetching Division');
            }
        };
        fetchDivision();
    }, []);

    const calculateAge = (selectedDOB) => {
        const currentDate = new Date();
        const selectedDate = new Date(selectedDOB);
        const ageInMilliseconds = currentDate - selectedDate;

        const years = Math.floor(ageInMilliseconds / (365.25 * 24 * 60 * 60 * 1000));
        const months = Math.floor(
            (ageInMilliseconds % (365.25 * 24 * 60 * 60 * 1000)) / (30.44 * 24 * 60 * 60 * 1000)
        );
        const days = Math.floor(
            (ageInMilliseconds % (30.44 * 24 * 60 * 60 * 1000)) / (24 * 60 * 60 * 1000)
        );

        setAge({ year: years, months: months, days: days });
    };

    // const handleDOBChange = event => {
    //     const selectedDOB = event.target.value
    //     setDOB(selectedDOB)
    //     calculateAge(selectedDOB)
    // }

    const handleDOBChange = (e) => {
        const selectedDate = new Date(e.target.value);
        const maxAllowedDate = new Date();

        if (selectedAge === 1) {
            // If selected age is 1, set max date to 9 years ago
            maxAllowedDate.setFullYear(maxAllowedDate.getFullYear() - 10);

            // Check if the selected date is greater than the current date or less than the max allowed date
            if (selectedDate > new Date() || selectedDate < maxAllowedDate) {
                setErrors({ dob: 'Invalid date. Please select a date within the last 10 years.' });
                alert('Invalid date. Please select a date within the last 10 years.')
                return;
            } else {
                setErrors({});
            }
        } else {
            // If selected age is not 1, set max date to today and min date to 10 years ago
            maxAllowedDate.setFullYear(maxAllowedDate.getFullYear());
            const minAllowedDate = new Date();
            minAllowedDate.setFullYear(minAllowedDate.getFullYear() - 11);

            // Check if the selected date is within the last 10 years
            if (selectedDate >= minAllowedDate && selectedDate <= new Date()) {
                setErrors({ dob: 'Invalid date. Please select a date outside the last 11 years.' });
                alert('Invalid date. Please select a date outside the last 11 years.')
                return;
            } else {
                setErrors({});
            }
        }

        // Update the state with the selected date
        setDOB(e.target.value);

        // Calculate the age based on the selected date
        calculateAge(selectedDate);
    };

    useEffect(() => {
        setDOB("");
        setErrors({});
    }, [selectedAge]);

    //////////////////// colour code 
    const getBackgroundColor = (value, conditions) => {
        const condition = conditions.find((cond) => cond.value === value);
        return condition ? condition.color : 'white';
    };

    // Use the function to determine the background color for each input
    // const heightForAgeConditions = [
    //     { value: 'Normal', color: 'green' },
    //     { value: 'SS', color: 'lightred' },
    //     { value: 'MS', color: 'orange' },
    //     { value: 'Very Tall', color: 'grey' },
    //     { value: 'Not Considered', color: 'grey' },
    // ];

    // const weightForAgeConditions = [
    //     { value: 'Normal', color: 'lightgreen' },
    //     { value: 'SUW', color: 'red' },
    //     { value: 'MUW', color: 'orange' },
    //     { value: 'Not Considered', color: 'grey' },
    // ];

    // const weightForHeightConditions = [
    //     { value: 'Normal', color: 'lightgreen' },
    //     { value: 'SAM', color: 'red' },
    //     { value: 'MAM', color: 'orange' },
    //     { value: 'Overweight', color: 'firebrick' },
    //     { value: 'Obese', color: 'grey' },
    //     { value: 'Possible Risk of Overweight', color: 'grey' },
    //     { value: 'Not Considered', color: 'grey' },
    // ];

    return (
        <div className="backcolor">
            <div class="content">
                <div class="content-header">
                    <div class="container">
                        <form onSubmit={handleSubmit}>
                            <div className="row wholebody">
                                <div className="col-md-6">
                                    <div className="card carddetailing">
                                        <div className='row'>
                                            <h5 className='childdetails'>CITIZEN DETAILS</h5>
                                            <div className="element"></div>
                                        </div>

                                        <div className='row contentincard'>
                                            <div className='col-md-8'>
                                                <label for="childName" class="visually-hidden citizenlabel">Citizen Name<span className="text-danger">*</span></label>
                                                <input type="text"
                                                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                                    placeholder="Enter Name"
                                                    name="name"
                                                    value={selectData.name}
                                                    onChange={handleChange}
                                                    onInput={(e) => {
                                                        e.target.value = e.target.value.replace(/[0-9]/, '');
                                                    }}
                                                />
                                                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                                            </div>

                                            <div class="col-md-4">
                                                <label class="visually-hidden citizenlabel">Blood Group<span className="text-danger">*</span></label>
                                                <select
                                                    className={`form-control ${errors.blood_groups && 'is-invalid'}`}
                                                    name='blood_groups'
                                                    onChange={handleChange}
                                                    value={selectData.blood_groups}
                                                >
                                                    <option value="">Select</option>
                                                    <option>A+</option>
                                                    <option>A-</option>
                                                    <option>B+</option>
                                                    <option>B-</option>
                                                    <option>AB+</option>
                                                    <option>AB-</option>
                                                    <option>O+</option>
                                                    <option>O-</option>
                                                </select>
                                                {errors.blood_groups && <div className="invalid-feedback">{errors.blood_groups}</div>}
                                            </div>
                                        </div>

                                        <div class="row contentincard">
                                            <div className="col-md-6">
                                                <label className="visually-hidden citizenlabel" id="age">
                                                    Date of Birth<span className="text-danger">*</span>
                                                </label>
                                                <input
                                                    type="date"
                                                    className={`form-control`}
                                                    id="dob"
                                                    name="dob"
                                                    value={selectData.dob}
                                                    onChange={handleDOBChange}
                                                    max={(new Date()).toISOString().split('T')[0]}
                                                />
                                                {/* {errors.dob && <div className="invalid-feedback">{errors.dob}</div>} */}
                                            </div>

                                            <div class="col-md-2 mobiledatedevice">
                                                <label for="year" class='visually-hidden citizenlabel'>Year</label>
                                                <input className={`form-control dat${errors.year ? 'is-invalid' : ''}`}
                                                    id="year" placeholder="Year" name="year" value={age.year} />
                                                {errors.year && <div className="invalid-feedback">{errors.year}</div>}
                                            </div>

                                            <div class="col-md-2 mobiledatedevice">
                                                <label for="months" class='visually-hidden citizenlabel'>Months</label>
                                                <input className={`form-control dat${errors.months ? 'is-invalid' : ''}`}
                                                    id="months" placeholder="months" name="months" value={age.months} />
                                                {errors.months && <div className="invalid-feedback">{errors.months}</div>}
                                            </div>

                                            <div class="col-md-2 mobiledatedevice">
                                                <label for="days" class='visually-hidden citizenlabel'>Days</label>
                                                <input className={`form-control dat${errors.days ? 'is-invalid' : ''}`}
                                                    id="days" placeholder="days" name="days" value={age.days} />
                                                {errors.days && <div className="invalid-feedback">{errors.days}</div>}
                                            </div>
                                        </div>

                                        <div className='row contentincard'>
                                            <div className='col-md-6 mb-3'>
                                                <label htmlFor="aadhar_id" className="visually-hidden citizenlabel">Aadhar ID Number
                                                    {/* <span className="text-danger">*</span> */}
                                                </label>
                                                <input
                                                    type="number"
                                                    id="aadhar_id"
                                                    placeholder="Enter Aadhar"
                                                    className={`form-control mb-2 ${errors.aadhar_id ? 'is-invalid' : ''}`}
                                                    name="aadhar_id"
                                                    onChange={handleChange}
                                                    value={selectData.aadhar_id}
                                                    onInput={(e) => {
                                                        if (e.target.value < 0) {
                                                            e.target.value = 0;
                                                        }

                                                        if (e.target.value.length > 12) {
                                                            e.target.value = e.target.value.slice(0, 12);
                                                        }
                                                    }}
                                                />
                                                {/* {errors.aadhar_id && <div className="invalid-feedback">{errors.aadhar_id}</div>} */}
                                            </div>

                                            <div className="col-md-4">
                                                <label className="visually-hidden citizenlabel">
                                                    Gender<span className="text-danger">*</span>
                                                </label>
                                                <select
                                                    className={`form-control ${errors.blood_groups && 'is-invalid'}`}
                                                    name="blood_groups"
                                                    value={selectedGender}
                                                    onChange={handleGenderChange}
                                                >
                                                    <option value="">Select Gender</option>
                                                    {GenderNav.map(drop => (
                                                        <option key={drop.gender_pk_id} value={drop.gender_pk_id}>
                                                            {drop.gender}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.blood_groups && (
                                                    <div className="invalid-feedback">{errors.blood_groups}</div>
                                                )}
                                            </div>

                                            {selectedTypeValue === 1 && (
                                                <div className='col-md-3 mb-3'>
                                                    <label class="visually-hidden citizenlabel">Class</label>
                                                    <select className={`form-control`}
                                                        name='Class'
                                                        onChange={handleChange}
                                                        value={selectedClass}
                                                        aria-label="Default select example">
                                                        <option>Select Class</option>
                                                        {classList.map(cls => (
                                                            <option key={cls.class_id} value={cls.class_id}>
                                                                {cls.class_name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}

                                            {selectedTypeValue === 1 && (
                                                <div className='col-md-3 mb-3'>
                                                    <label class="visually-hidden citizenlabel">Division</label>
                                                    <select className={`form-control`}
                                                        name='division'
                                                        onChange={handleChange}
                                                        value={selectedDivision}
                                                        aria-label="Default select example">
                                                        <option selected>Select Division</option>
                                                        {divisionList.map(cls => (
                                                            <option key={cls.division_id} value={cls.division_id}>
                                                                {cls.division_name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}

                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="card carddetailing1" style={{ height: '94.5%' }}>
                                        <div className='row'>
                                            <h5 className='childdetails'>FAMILY INFORMATION</h5>
                                            <div className="element1"></div>
                                        </div>

                                        <div className='row contentincard'>
                                            <div className='col-md-6'>
                                                <label for="Father" class="visually-hidden citizenlabel">Father Name<span className="text-danger">*</span></label>
                                                <input type="text"
                                                    className={`form-control ${errors.father_name ? 'is-invalid' : ''}`}
                                                    id="Father"
                                                    placeholder="Enter Name"
                                                    name="father_name"
                                                    onChange={handleChange}
                                                    value={selectData.father_name}
                                                    onInput={(e) => {
                                                        e.target.value = e.target.value.replace(/[0-9]/, '');
                                                    }}
                                                />
                                                {errors.father_name && <div className="invalid-feedback">{errors.father_name}</div>}
                                            </div>

                                            <div className='col-md-6'>
                                                <label for="Mother" class="visually-hidden citizenlabel">Mother Name<span className="text-danger">*</span></label>
                                                <input type="text"
                                                    className={`form-control  ${errors.mother_name ? 'is-invalid' : ''}`}
                                                    id="Mother"
                                                    placeholder="Enter Name"
                                                    name="mother_name"
                                                    onChange={handleChange}
                                                    value={selectData.mother_name}
                                                    onInput={(e) => {
                                                        e.target.value = e.target.value.replace(/[0-9]/, '');
                                                    }}
                                                />
                                                {errors.mother_name && <div className="invalid-feedback">{errors.mother_name}</div>}
                                            </div>

                                            <div className='col-md-6'>
                                                <label for="Occupation" class="visually-hidden citizenlabel">Occupation of Father</label>
                                                <input type="text"
                                                    class="form-control"
                                                    id="Occupation"
                                                    placeholder="Enter Occupation"
                                                    name="occupation_of_father"
                                                    onChange={handleChange}
                                                    value={selectData.occupation_of_father}
                                                    onInput={(e) => {
                                                        e.target.value = e.target.value.replace(/[0-9]/, '');
                                                    }}
                                                />
                                            </div>

                                            <div className='col-md-6'>
                                                <label for="Occupation" class="visually-hidden citizenlabel">Occupation of Mother</label>
                                                <input type="text"
                                                    class="form-control"
                                                    id="Occupation"
                                                    placeholder="Enter Occupation"
                                                    name="occupation_of_mother"
                                                    onChange={handleChange}
                                                    value={selectData.occupation_of_mother}
                                                    onInput={(e) => {
                                                        e.target.value = e.target.value.replace(/[0-9]/, '');
                                                    }}
                                                />
                                            </div>

                                            <div className='col-md-6 mb-3'>
                                                <label for="child" class="visually-hidden citizenlabel">Contact Number<span className="text-danger">*</span></label>
                                                <input type="number" id="child" placeholder="Enter Mobile Number"
                                                    className={`form-control ${errors.parents_mobile ? 'is-invalid' : ''}`}
                                                    name="parents_mobile"
                                                    onChange={handleChange}
                                                    value={selectData.parents_mobile}
                                                    onInput={(e) => {
                                                        let inputValue = e.target.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
                                                        if (inputValue.length > 10) {
                                                            inputValue = inputValue.slice(0, 10);
                                                        }
                                                        e.target.value = inputValue;
                                                    }}
                                                />
                                                {errors.parents_mobile && <div className="invalid-feedback">{errors.parents_mobile}</div>}
                                            </div>

                                            {/* <div className='col-md-6 mb-3'>
                                                <label for="Gender" class="visually-hidden citizenlabel">Siblings Count</label>
                                                <select
                                                    class='form-control'
                                                    name='sibling_count'
                                                    id='outlined-select'
                                                    onChange={handleChange}
                                                    value={selectData.sibling_count}
                                                >
                                                    <option value="">Select</option>
                                                    <option>0</option>
                                                    <option>1</option>
                                                    <option>2</option>
                                                    <option>3</option>
                                                    <option>4</option>
                                                </select>
                                            </div> */}
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="card carddetailing" style={{ height: '93%' }}>
                                        <div className='row'>
                                            <h5 className='childdetails'>GROWTH MONITORING</h5>
                                            <div className="element3"></div>
                                        </div>

                                        <div className='row contentincard'>
                                            <div className='col-md-4'>
                                                <label for="Height" class="visually-hidden citizenlabel">Height<span className="text-danger">*</span></label>
                                                <input type="number" id="Height"
                                                    className={`form-control ${errors.height ? 'is-invalid' : ''}`}
                                                    placeholder="Enter Height" name="height"
                                                    onChange={handleChange}
                                                    value={selectData.height}
                                                    onInput={(e) => {
                                                        if (e.target.value < 0) {
                                                            e.target.value = 0;
                                                        }

                                                        if (e.target.value.length > 5) {
                                                            e.target.value = e.target.value.slice(0, 5);
                                                        }
                                                    }}
                                                />
                                                {errors.height && <div className="invalid-feedback">{errors.height}</div>}
                                            </div>

                                            <div className='col-md-4'>
                                                <label for="Weight" class="visually-hidden citizenlabel">Weight<span className="text-danger">*</span></label>
                                                <input type="number" id="Weight"
                                                    className={`form-control ${errors.weight ? 'is-invalid' : ''}`}
                                                    placeholder="Enter Weight"
                                                    name="weight"
                                                    onChange={handleChange}
                                                    value={selectData.weight}
                                                    onInput={(e) => {
                                                        if (e.target.value < 0) {
                                                            e.target.value = 0;
                                                        }

                                                        if (e.target.value.length > 5) {
                                                            e.target.value = e.target.value.slice(0, 5);
                                                        }
                                                    }}
                                                />
                                                {errors.weight && <div className="invalid-feedback">{errors.weight}</div>}
                                            </div>

                                            <div className='col-md-4 mb-1'>
                                                <label for="arm" class="visually-hidden citizenlabel">Arm Size</label>
                                                <input type="number"
                                                    // class="form-control citizeninput"
                                                    class="form-control"
                                                    id="arm"
                                                    placeholder="Enter Arm Size"
                                                    name="arm_size"
                                                    onChange={handleChange}
                                                    value={selectData.arm_size}
                                                    onInput={(e) => {
                                                        if (e.target.value < 1) {
                                                            e.target.value = 1;
                                                        }

                                                        if (e.target.value.length > 3) {
                                                            e.target.value = e.target.value.slice(0, 3);
                                                        }
                                                    }} />
                                            </div>

                                            {
                                                selectedAge === 1 ? (
                                                    <div className="row sammambmi">
                                                        <div className='col-md-4'>
                                                            <label htmlFor="wt" className="visually-hidden citizenlabel">Weight for Age</label>
                                                            <input
                                                                type="text"
                                                                className={`form-control`}
                                                                id="weight_for_age"
                                                                placeholder="Weight for Age"
                                                                name="weight_for_age"
                                                                onChange={handleChange}
                                                                value={selectData.weight_for_age}
                                                                readOnly
                                                            // style={{
                                                            //     backgroundColor: getBackgroundColor(selectData.weight_for_age, weightForAgeConditions),
                                                            // }}
                                                            />
                                                        </div>

                                                        <div className='col-md-4'>
                                                            <label htmlFor="ht" className="visually-hidden citizenlabel">Height for Age</label>
                                                            <input
                                                                type="text"
                                                                className={`form-control`}
                                                                id="height_for_age"
                                                                placeholder="Height for Age"
                                                                name="height_for_age"
                                                                onChange={handleChange}
                                                                value={selectData.height_for_age}
                                                                readOnly
                                                            // style={{
                                                            //     backgroundColor: getBackgroundColor(selectData.height_for_age, heightForAgeConditions),
                                                            // }}
                                                            />
                                                        </div>

                                                        <div className='col-md-4'>
                                                            <label htmlFor="wt ht" className="visually-hidden citizenlabel">Weight for Height</label>
                                                            <input
                                                                type="text"
                                                                className={`form-control`}
                                                                id="weight_for_height"
                                                                placeholder="Weight for Height"
                                                                name="weight_for_height"
                                                                onChange={handleChange}
                                                                value={selectData.weight_for_height}
                                                                readOnly
                                                            // style={{
                                                            //     backgroundColor: getBackgroundColor(selectData.weight_for_height, weightForHeightConditions),
                                                            // }}
                                                            />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className='col-md-4'>
                                                        <label htmlFor="sam" className="visually-hidden citizenlabel">
                                                            BMI
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className={`form-control`}
                                                            id="bmi"
                                                            onChange={handleChange}
                                                            name="bmi"
                                                            value={selectData.age < 1 ? '' : responseMessage}
                                                            readOnly
                                                            style={{ backgroundColor: bmiBgColor }}
                                                        />
                                                    </div>
                                                )
                                            }

                                            <div className='col-md-8 mb-3'>
                                                <label for="symtoms" class="visually-hidden citizenlabel">Symptoms if any</label>
                                                <input type="text"
                                                    class="form-control"
                                                    id="symtoms"
                                                    placeholder="Add symptoms"
                                                    name="symptoms"
                                                    onChange={handleChange}
                                                    value={selectData.symptoms}
                                                    onInput={(e) => {
                                                        e.target.value = e.target.value.replace(/[0-9]/, '');
                                                    }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="card carddetailing1">
                                        <div className='row'>
                                            <h5 className='childdetails'>ADDRESS</h5>
                                            <div className="element4"></div>
                                        </div>

                                        <div className='row contentincard'>
                                            <div className='col-md-6'>
                                                <label htmlFor="state" className="visually-hidden citizenlabel">State<span className="text-danger">*</span></label>
                                                <select
                                                    className={`form-control`}
                                                    name='state'
                                                    onChange={handleChange}
                                                    value={selectedState}
                                                >
                                                    <option value="">Select State</option>
                                                    {sourceState
                                                        .filter(state => state && state.state_name !== null) // Filter out null values
                                                        .sort((a, b) => a.state_name.localeCompare(b.state_name)) // Sort the states alphabetically
                                                        .map((state) => (
                                                            <option key={state.source_state} value={state.source_state}>
                                                                {state.state_name}
                                                            </option>
                                                        ))}
                                                </select>
                                                {errors.state && <div className="invalid-feedback">{errors.state}</div>}
                                            </div>

                                            <div className='col-md-6'>
                                                <label htmlFor="district" className="visually-hidden citizenlabel">District<span className="text-danger">*</span></label>
                                                <select
                                                    className='form-control'
                                                    name='district'
                                                    id='outlined-select'
                                                    value={selectedDistrict}
                                                    onChange={handleChange}
                                                >
                                                    <option value="">Select a district</option>
                                                    {sourceDistrict
                                                        .filter(district => district && district.dist_name !== null) // Filter out null values
                                                        .sort((a, b) => a.dist_name.localeCompare(b.dist_name)) // Sort the districts alphabetically
                                                        .map((district) => (
                                                            <option key={district.source_district} value={district.source_district}>
                                                                {district.dist_name}
                                                            </option>
                                                        ))}
                                                </select>
                                            </div>

                                            <div className='col-md-6'>
                                                <label htmlFor="Gender" className="visually-hidden citizenlabel">Block<span className="text-danger">*</span></label>
                                                <select
                                                    className='form-control'
                                                    name='tehsil'
                                                    id='outlined-select'
                                                    value={selectedTehsil}
                                                    onChange={handleChange}
                                                >
                                                    <option value="">Select</option>
                                                    {sourceTehsil
                                                        .filter(tehsil => tehsil && tehsil.tahsil_name !== null) // Filter out null values
                                                        .sort((a, b) => a.tahsil_name.localeCompare(b.tahsil_name)) // Sort the tehsils alphabetically
                                                        .map((Tehsil) => (
                                                            <option key={Tehsil.source_taluka} value={Tehsil.source_taluka}>
                                                                {Tehsil.tahsil_name}
                                                            </option>
                                                        ))}
                                                </select>
                                            </div>

                                            <div className='col-md-6'>
                                                <label className="visually-hidden citizenlabel">Institution Name<span className="text-danger">*</span></label>
                                                <select
                                                    className='form-control'
                                                    name='source_names'
                                                    id='outlined-select'
                                                    onChange={handleChange}
                                                >
                                                    <option value="">Select</option>
                                                    {sourceName.map((source) => (
                                                        <option key={source.source_pk_id} value={source.source_pk_id}>
                                                            {source.source_names}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className='col-md-6 mb-3'>
                                                <label className="visually-hidden citizenlabel">Location<span className="text-danger">*</span></label>
                                                <select
                                                    className='form-control'
                                                    name='location'
                                                    id='outlined-select'
                                                    onChange={handleChange}
                                                >
                                                    <option value="">Select</option>
                                                    {location.map((source) => (
                                                        <option key={source.ward_id} value={source.ward_id}>
                                                            {source.ward_name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* <div className='col-md-4'>
                                                <label htmlFor="Pincode" className="visually-hidden citizenlabel">Pincode
                                                </label>
                                                <input
                                                    type="number"
                                                    className={`form-control ${errors.pincode ? 'is-invalid' : ''}`}
                                                    id="Pincode"
                                                    placeholder="Enter Pincode"
                                                    name="pincode"
                                                    onChange={handleChange}
                                                    value={selectData.pincode}
                                                    onInput={(e) => {
                                                        let inputValue = e.target.value.replace(/[^0-9]/g, '');
                                                        if (inputValue.length > 6) {
                                                            inputValue = inputValue.slice(0, 6);
                                                        }
                                                        e.target.value = inputValue;
                                                    }}
                                                />
                                            </div>

                                            <div className='col-md-8 mb-3'>
                                                <label for="address" class="visually-hidden citizenlabel">Address<span className="text-danger">*</span></label>
                                                <input type="text"
                                                    className={`form-control ${errors.pincode ? 'is-invalid' : ''}`}
                                                    id="address" placeholder="Enter address"
                                                    name="address"
                                                    onChange={handleChange}
                                                    value={selectData.address}
                                                />
                                                {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                                            </div> */}
                                        </div>
                                    </div>
                                </div>
                                <button type="submit" class="btn btn-sm childadd">Submit</button>
                            </div>
                        </form>

                        <Modal show={showModal} onHide={handleCloseModal}>
                            <Modal.Header>
                                <Modal.Title></Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                Add Citizen Form Submitted successfully.
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="success" className="btn btn-sm" onClick={handleCloseModal}>
                                    Close
                                </Button>
                            </Modal.Footer>
                        </Modal>

                        <Modal show={showModalMissing} onHide={handleMissing}>
                            <Modal.Header>
                                <Modal.Title></Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                Fill the * Mandatory Fields.
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="danger" className="btn btn-sm" onClick={handleMissing}>
                                    Close
                                </Button>
                            </Modal.Footer>
                        </Modal>

                        <Modal show={showModalExist} onHide={handleExist}>
                            <Modal.Header>
                                <Modal.Title></Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                Fill the * Mark Field
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="danger" className="btn btn-sm" onClick={handleExist}>
                                    Close
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default School


