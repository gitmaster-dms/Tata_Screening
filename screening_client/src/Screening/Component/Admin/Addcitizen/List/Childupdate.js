import React, { useState, useEffect } from 'react'
import './Child.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const Childupdate = (props) => {

    const Port = process.env.REACT_APP_API_KEY;
    const navigate = useNavigate();
    const accessToken = localStorage.getItem('token');

    const userID = localStorage.getItem('userID');
    console.log(userID);

    const SourceNameUrlId = localStorage.getItem('SourceNameFetched');

    /////////////////// header section data
    const main = props.main;
    console.log(main, "main");

    ///////////// blood group
    const bg = ["A", "B", "A-", "A+", "AB+", "O+", 'a']

    ////////////////Overall citizen data passed by parent component///////////////////
    const citizendata1 = props.data;
    const [citizendata, setCitizendata] = useState({ ...citizendata1 });

    const stateNav = props.state;
    console.log(stateNav, "stateNav");

    const [state, setState] = useState([]);
    const [district, setDistrict] = useState([]);
    const [tehsil, setTehsil] = useState([]);
    const [sourceName, setSourceName] = useState([]);

    useEffect(() => {
        const fetchState = async () => {
            if (citizendata.source) {
                const apiUrl = `${Port}/Screening/source_and_pass_state_Get/${citizendata.source}`;
                console.log(apiUrl, 'satettttttttt');
                try {
                    const response = await fetch(apiUrl, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    const data = await response.json();
                    console.log(data);
                    setState(data);
                } catch (error) {
                    console.log('Error Fetching Data');
                }
            } else {
                console.log('Error Fetching Data');
            }
        };
        fetchState();
    }, [citizendata.source]);

    useEffect(() => {
        const fetchDistrict = async () => {
            if (citizendata.source && citizendata.state) {
                const apiUrl = `${Port}/Screening/state_and_pass_district_Get/${citizendata.source}/${citizendata.state}/`;
                console.log(apiUrl, 'mlophhhhhhhhhhhhhhhhh');
                try {
                    const response = await fetch(apiUrl, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    const data = await response.json();
                    console.log(data);
                    setDistrict(data);
                } catch (error) {
                    console.log('Error Fetching Data');
                }
            } else {
                console.log('Error Fetching Data');
            }
        };
        fetchDistrict();
    }, [citizendata.source, citizendata.state]);

    useEffect(() => {
        const fetchTehsil = async () => {
            if (citizendata.source && citizendata.district) {
                const apiUrl = `${Port}/Screening/district_and_pass_taluka_Get/${citizendata.source}/${citizendata.district}/`;
                console.log(apiUrl);
                try {
                    const response = await fetch(apiUrl, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    const data = await response.json();
                    console.log(data);
                    setTehsil(data);
                } catch (error) {
                    console.log('Error Fetching Data');
                }
            } else {
                console.log('Error Fetching Data');
            }
        };
        fetchTehsil();
    }, [citizendata.source, citizendata.district]);

    useEffect(() => {
        const fetchName = async () => {
            if (citizendata.source && citizendata.tehsil) {
                // const apiUrl = `${Port}/Screening/taluka_and_pass_SourceName_Get/${citizendata.source}/${citizendata.tehsil}/`;
                const apiUrl = `${Port}/Screening/taluka_and_pass_SourceName_Get/?SNid=${citizendata.tehsil}&So=${citizendata.source}&source_pk_id=${SourceNameUrlId}`;
                console.log(apiUrl);
                try {
                    const response = await fetch(apiUrl, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    const data = await response.json();
                    console.log(data);
                    setSourceName(data);
                } catch (error) {
                    console.log('Error Fetching Data');
                }
            } else {
                console.log('Error Fetching Data');
            }
        };
        fetchName();
    }, [citizendata.source, citizendata.tehsil]);

    const [dob, setDOB] = useState([])
    const [age, setAge] = useState({ year: '', months: '', days: '' })

    useEffect(() => {
        setCitizendata(citizendata1);
        setAge({ year: props.data.year, months: props.data.months, days: props.data.days });
    }, [props.data]);

    const handleChange = async (e) => {
        const { name, value } = e.target;
        setCitizendata({
            ...citizendata,
            [name]: value,
        });
    };

    const calculateAge = selectedDOB => {
        const currentDate = new Date()
        const selectedDate = new Date(selectedDOB)
        const timeDiff = Math.abs(currentDate - selectedDate)

        // Calculate age in year, months, and days
        const year = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 365))
        const months = Math.floor(
            (timeDiff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30)
        )
        const days = Math.floor(
            (timeDiff % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24)
        )

        setAge({ year: year, months: months, days: days, })

        const updatedCitizenData1 = {
            ...citizendata,
            dob: selectedDOB,
            year: year,
            months: months,
            days: days
        };
        setCitizendata(updatedCitizenData1);
    }

    const handleDOBChange = event => {
        const { name, value } = event.target;
        const selectedDOB = event.target.value;
        setDOB(selectedDOB)
        calculateAge(selectedDOB)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!citizendata.aadhar_id || citizendata.aadhar_id.toString().length !== 12) {
            alert("Please enter a valid 12-digit Aadhar ID.");
            return;
        }

        if (!citizendata.parents_mobile || citizendata.parents_mobile.replace(/[^0-9]/g, '').length !== 10) {
            alert("Please enter a valid 10-digit Contact Number.");
            return;
        }

        if (!citizendata.pincode || citizendata.pincode.replace(/[^0-9]/g, '').length !== 6) {
            alert("Please enter a valid 6-digit Pincode.");
            return;
        }

        if (!citizendata.height || citizendata.height < 0 || citizendata.height.toString().length > 5) {
            alert("Please enter a valid Height.");
            return; // Stop form submission
        }

        if (!citizendata.weight || citizendata.weight < 0 || citizendata.weight.toString().length > 5) {
            alert("Please enter a valid Weight.");
            return; // Stop form submission
        }

        const userID = localStorage.getItem('userID');
        const updatedCitizendata = {
            ...citizendata,
            modify_by: userID,
            age: main.age.id,
            gender: main.gender.id,
            source: main.source.id,
            type: main.type.id,
            disease: main.disease.id
        };

        console.log('Form Data:', updatedCitizendata);

        axios.put(`${Port}/Screening/add_citizen_put/${updatedCitizendata.citizens_pk_id}/`, updatedCitizendata, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        })
            .then((response) => {
                console.log('API response:', response.data);
                alert("Citizen Updated Successfully..!");
                navigate('/mainscreen/Citizen');
            })
            .catch((error) => {
                console.error('Error:', error);
            });

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
                    // BMI API
                    const bmiResponse = await fetch(
                        `${Port}/Screening/SAM_MAM_BMI/${age.year || '0'}/${age.months || '0'}/${citizendata.gender}/${citizendata.height}/${citizendata.weight}/`,
                        {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${accessToken}`,
                            }
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
                        setCitizendata((prevData) => ({ ...prevData, bmi: bmiValue }));
                        setCitizendata((prevData) => ({ ...prevData, weight_for_age: '' }));
                    } else {
                        console.error('BMI API: BMI not found in the response.');
                    }

                    // SAM MAM API
                    const samMamResponse = await fetch(
                        `${Port}/Screening/SAM_MAM_BMI/${age.year || '0'}/${age.months || '0'}/${citizendata.gender}/${citizendata.height}/${citizendata.weight}/`,
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
                        setCitizendata((prevData) => ({
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
            }
        };

        fetchData();
    }, [age.year, age.months, citizendata.gender, citizendata.height, citizendata.weight]);

    //class list
    const [classList, setClassList] = useState([]);
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
            } catch (error) {
                console.log(error, 'Error fetching Class');
            }
        };
        fetchClass()
    }, [])

    //division list
    const [divisionList, setDivisionList] = useState([]);
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
                                                <label for="childName" class="visually-hidden inputfiledss">Citizen Name</label>
                                                <input type="text" class="form-control inputtype"
                                                    placeholder="Enter Name"
                                                    name="name"
                                                    value={citizendata.name}
                                                    onChange={handleChange}
                                                    onInput={(e) => {
                                                        e.target.value = e.target.value.replace(/[0-9]/, '');
                                                    }}
                                                />
                                            </div>

                                            <div class="col-md-4">
                                                <label for="blood_groups" class="visually-hidden inputfiledss">Blood Group</label>
                                                <select
                                                    class='form-control inputtype'
                                                    name='blood_groups'
                                                    id='outlined-select'
                                                    onChange={handleChange}
                                                >
                                                    <option value="">Select</option>

                                                    {bg.map((bloodg) => (<option
                                                        key={bloodg.id}
                                                        value={bloodg.name}
                                                        selected={bloodg === citizendata.blood_groups ? 'selected' : ''}>{bloodg}</option>))}
                                                </select>
                                            </div>
                                        </div>

                                        <div class="row contentincard">
                                            <div class="col-md-6">
                                                <label class="visually-hidden inputfiledss" id="age">Date of Birth</label>
                                                <input type="date"
                                                    class="form-control inputtype"
                                                    id="dob"
                                                    name="dob"
                                                    placeholder="Password"
                                                    value={citizendata.dob}
                                                    onChange={handleDOBChange}
                                                    max={(new Date()).toISOString().split('T')[0]}
                                                />
                                            </div>

                                            <div class="col-md-2">
                                                <label for="year" class='visually-hidden inputfiledss'>Year</label>
                                                <input class="form-control inputtype date" id="year" placeholder="Year" name="year" value={age.year} />
                                            </div>

                                            <div class="col-md-2">
                                                <label for="months" class='visually-hidden inputfiledss'>Months</label>
                                                <input class="form-control inputtype date" id="months" placeholder="months" name="months" value={age.months} />
                                            </div>

                                            <div class="col-md-2">
                                                <label for="days" class='visually-hidden inputfiledss'>Days</label>
                                                <input class="form-control inputtype date" id="days" placeholder="days" name="days" value={age.days} />
                                            </div>
                                        </div>

                                        <div className='row contentincard'>
                                            <div className='col-md-6 mb-3'>
                                                <label for="aadhar_id" class="visually-hidden inputfiledss">Aadhar ID Number</label>
                                                <input type="number" class="form-control inputtype" id="aadhar_id"
                                                    placeholder="Enter Aadhar"
                                                    name="aadhar_id"
                                                    onChange={handleChange}
                                                    value={citizendata.aadhar_id}
                                                    onInput={(e) => {
                                                        if (e.target.value < 0) {
                                                            e.target.value = 0;
                                                        }

                                                        if (e.target.value.length > 12) {
                                                            e.target.value = e.target.value.slice(0, 12);
                                                        }
                                                    }}
                                                />
                                            </div>

                                            {main.type.id === 1 && (
                                                <div className='col-md-3 mb-3'>
                                                    <label class="visually-hidden inputfiledss">Class</label>
                                                    <select className={`form-control citizeninput`}
                                                        name='Class'
                                                        onChange={handleChange}
                                                        value={citizendata.Class}
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

                                            {main.type.id === 1 && (
                                                <div className='col-md-3 mb-3'>
                                                    <label class="visually-hidden inputfiledss">Division</label>
                                                    <select className={`form-control citizeninput`}
                                                        name='division'
                                                        onChange={handleChange}
                                                        value={citizendata.division}
                                                    >
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
                                    <div className="card carddetailing1">
                                        <div className='row'>
                                            <h5 className='childdetails'>FAMILY INFORMATION</h5>
                                            <div className="element1"></div>
                                        </div>

                                        <div className='row contentincard'>
                                            <div className='col-md-6'>
                                                <label for="Father" class="visually-hidden inputfiledss">Father Name</label>
                                                <input type="text"
                                                    class="form-control inputtype"
                                                    id="Father"
                                                    placeholder="Enter Name"
                                                    name="father_name"
                                                    onChange={handleChange}
                                                    value={citizendata.father_name}
                                                    onInput={(e) => {
                                                        e.target.value = e.target.value.replace(/[0-9]/, '');
                                                    }}
                                                />
                                            </div>

                                            <div className='col-md-6'>
                                                <label for="Mother" class="visually-hidden inputfiledss">Mother Name</label>
                                                <input type="text"
                                                    class="form-control inputtype"
                                                    id="Mother"
                                                    placeholder="Enter Name"
                                                    name="mother_name"
                                                    onChange={handleChange}
                                                    value={citizendata.mother_name}
                                                    onInput={(e) => {
                                                        e.target.value = e.target.value.replace(/[0-9]/, '');
                                                    }}
                                                />
                                            </div>

                                            <div className='col-md-6'>
                                                <label for="Occupation" class="visually-hidden inputfiledss">Occupation of Father</label>
                                                <input type="text"
                                                    class="form-control inputtype"
                                                    id="Occupation"
                                                    placeholder="Enter Occupation"
                                                    name="occupation_of_father"
                                                    onChange={handleChange}
                                                    value={citizendata.occupation_of_father} />
                                            </div>

                                            <div className='col-md-6'>
                                                <label for="Occupation" class="visually-hidden inputfiledss">Occupation of Mother</label>
                                                <input type="text"
                                                    class="form-control inputtype"
                                                    id="Occupation"
                                                    placeholder="Enter Occupation"
                                                    name="occupation_of_mother"
                                                    onChange={handleChange}
                                                    value={citizendata.occupation_of_mother} />
                                            </div>

                                            <div className='col-md-6 mb-3'>
                                                <label for="child" class="visually-hidden inputfiledss">Contact Number</label>
                                                <input type="number" class="form-control inputtype"
                                                    id="child" placeholder="Enter Mobile Number"
                                                    name="parents_mobile"
                                                    onChange={handleChange}
                                                    value={citizendata.parents_mobile}
                                                    onInput={(e) => {
                                                        let inputValue = e.target.value.replace(/[^0-9]/g, '');
                                                        if (inputValue.length > 10) {
                                                            inputValue = inputValue.slice(0, 10);
                                                        }
                                                        e.target.value = inputValue;
                                                    }} />
                                            </div>

                                            <div className='col-md-6 mb-3'>
                                                <label for="Gender" class="visually-hidden inputfiledss">Siblings Count</label>
                                                <select
                                                    class='form-control inputtype'
                                                    name='sibling_count'
                                                    id='outlined-select'
                                                    onChange={handleChange}
                                                    value={citizendata.sibling_count}
                                                >
                                                    <option value="">Select</option>
                                                    <option>{citizendata.sibling_count}</option>
                                                    <option>0</option>
                                                    <option>1</option>
                                                    <option>2</option>
                                                    <option>3</option>
                                                    <option>4</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="card carddetailing" style={{ height: '95%' }}>

                                        <div className='row'>
                                            <h5 className='childdetails'>GROWTH MONITORING</h5>
                                            <div className="element3"></div>
                                        </div>

                                        <div className='row contentincard'>
                                            <div className='col-md-4'>
                                                <label for="Height" class="visually-hidden inputfiledss">Height</label>
                                                <input type="number" class="form-control inputtype" id="Height"
                                                    placeholder="Enter Height"
                                                    name="height"
                                                    onChange={handleChange}
                                                    value={citizendata.height}
                                                    onInput={(e) => {
                                                        if (e.target.value < 0) {
                                                            e.target.value = 0;
                                                        }

                                                        if (e.target.value.length > 5) {
                                                            e.target.value = e.target.value.slice(0, 5);
                                                        }
                                                    }} />
                                            </div>

                                            <div className='col-md-4'>
                                                <label for="Weight" class="visually-hidden inputfiledss">Weight</label>
                                                <input type="number" class="form-control inputtype"
                                                    id="Weight"
                                                    placeholder="Enter Weight"
                                                    name="weight"
                                                    onChange={handleChange}
                                                    value={citizendata.weight}
                                                    onInput={(e) => {
                                                        if (e.target.value < 0) {
                                                            e.target.value = 0;
                                                        }

                                                        if (e.target.value.length > 5) {
                                                            e.target.value = e.target.value.slice(0, 5);
                                                        }
                                                    }} />
                                            </div>

                                            <div className='col-md-4'>
                                                <label for="arm" class="visually-hidden inputfiledss">Arm Size</label>
                                                <input type="number"
                                                    class="form-control inputtype"
                                                    id="arm"
                                                    placeholder="Enter Arm Size"
                                                    name="arm_size"
                                                    onChange={handleChange}
                                                    value={citizendata.arm_size}
                                                    onInput={(e) => {
                                                        if (e.target.value < 0) {
                                                            e.target.value = 0;
                                                        }

                                                        if (e.target.value.length > 3) {
                                                            e.target.value = e.target.value.slice(0, 3);
                                                        }
                                                    }} />
                                            </div>

                                            {
                                                main.age.id === 1 ? (
                                                    <div className="row p-1">
                                                        <div className='col-md-4'>
                                                            <label for="wt" class="visually-hidden inputfiledss">Weight for Age</label>
                                                            <input type="text" class="form-control inputtype"
                                                                id="weight for age"
                                                                placeholder="Weight for Age"
                                                                name="weight_for_age"
                                                                onChange={handleChange}
                                                                value={citizendata.weight_for_age}
                                                                readOnly />
                                                        </div>

                                                        <div className='col-md-4'>
                                                            <label for="ht" class="visually-hidden inputfiledss">Height for Age</label>
                                                            <input type="text" class="form-control inputtype"
                                                                id="height for age"
                                                                placeholder="height for age"
                                                                name="height_for_age"
                                                                onChange={handleChange}
                                                                value={citizendata.height_for_age}
                                                                readOnly />
                                                        </div>

                                                        <div className='col-md-4'>
                                                            <label for="wt ht" class="visually-hidden inputfiledss">Weight for Height</label>
                                                            <input type="text"
                                                                class="form-control inputtype"
                                                                id="weight for height"
                                                                placeholder="Weight for height"
                                                                name="weight_for_height"
                                                                onChange={handleChange}
                                                                value={citizendata.weight_for_height}
                                                                readOnly />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className='col-md-4'>
                                                        <label for="sam" class="visually-hidden inputfiledss">BMI</label>
                                                        <input type="text"
                                                            class="form-control inputtype"
                                                            id="bmi"
                                                            name="bmi"
                                                            onChange={handleChange}
                                                            value={citizendata.bmi}
                                                            readOnly />
                                                    </div>
                                                )
                                            }

                                            <div className='col-md-8 mb-3'>
                                                <label for="symtoms" class="visually-hidden inputfiledss">Symptoms if any</label>
                                                <input type="text"
                                                    class="form-control inputtype"
                                                    id="symtoms"
                                                    placeholder="Add symptoms"
                                                    name="symptoms"
                                                    onChange={handleChange}
                                                    value={citizendata.symptoms}
                                                    onInput={(e) => {
                                                        e.target.value = e.target.value.replace(/[0-9]/, '');
                                                    }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="card carddetailing1" style={{ height: '95% ' }}>
                                        <div className='row'>
                                            <h5 className='childdetails'>ADDRESS</h5>
                                            <div className="element4"></div>

                                        </div>

                                        <div className='row contentincard'>
                                            <div className='col-md-6'>
                                                <label htmlFor="state" className="visually-hidden inputfiledss">State</label>
                                                <select className="form-control corporateinput"
                                                    value={citizendata.state}
                                                    onChange={(e) => setCitizendata({ ...citizendata, state: e.target.value })}>
                                                    <option>Select State</option>
                                                    {state.map((stateOption) => (
                                                        <option key={stateOption.source_state} value={stateOption.source_state}>
                                                            {stateOption.state_name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className='col-md-6'>
                                                <label for="district" class="visually-hidden inputfiledss">District</label>
                                                <select
                                                    class='form-control inputtype'
                                                    name='district'
                                                    id='outlined-select'
                                                    value={citizendata.district}
                                                    onChange={(e) => setCitizendata({ ...citizendata, district: e.target.value })}
                                                >
                                                    <option>Select District</option>
                                                    {district.map((district) => (
                                                        <option key={district.source_district} value={district.source_district}
                                                        >
                                                            {district.dist_name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className='col-md-6'>
                                                <label for="Gender" class="visually-hidden inputfiledss">Tehsil</label>
                                                <select
                                                    class='form-control inputtype'
                                                    name='tehsil'
                                                    id='outlined-select'
                                                    value={citizendata.tehsil}
                                                    onChange={(e) => setCitizendata({ ...citizendata, tehsil: e.target.value })}
                                                >
                                                    <option value=''>Select Tehsil</option>
                                                    {tehsil.map((Tehsil) => (
                                                        <option key={Tehsil.source_taluka} value={Tehsil.source_taluka}
                                                        >
                                                            {Tehsil.tahsil_name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className='col-md-6'>
                                                <label htmlFor="source_name" className="visually-hidden inputfiledss">Source Name</label>
                                                <select
                                                    className='form-control inputtype'
                                                    name='source_name'
                                                    id='outlined-select'
                                                    value={citizendata.source_name}
                                                    onChange={(e) => setCitizendata({ ...citizendata, source_name: e.target.value })}
                                                >
                                                    <option value="">Select Source_Name</option>
                                                    {sourceName.map((source) => (
                                                        <option key={source.source_pk_id} value={source.source_pk_id}
                                                        >
                                                            {source.source_names}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className='col-md-4'>
                                                <label for="Pincode" class="visually-hidden inputfiledss">Pincode</label>
                                                <input type="text" class="form-control inputtype"
                                                    id="Pincode" placeholder="Enter Pincode"
                                                    name="pincode"
                                                    onChange={handleChange}
                                                    value={citizendata.pincode}
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
                                                <label for="address" class="visually-hidden inputfiledss">Address</label>
                                                <input type="text" class="form-control inputtype"
                                                    id="address" placeholder="Enter address"
                                                    name="address"
                                                    onChange={handleChange}
                                                    value={citizendata.address} />

                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button type="submit" class="btn btn-sm childadd">Update</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Childupdate


