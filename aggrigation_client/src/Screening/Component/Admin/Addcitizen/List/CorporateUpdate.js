import React, { useState, useEffect } from 'react';
import '../Citizenforms/Source/Corporate.css'
import { useSourceContext } from '../../../../../contexts/SourceContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CorporateUpdate = (props) => {

    const Port = process.env.REACT_APP_API_KEY;
    const userID = localStorage.getItem('userID');
    console.log(userID);
    const navigate = useNavigate();
    const accessToken = localStorage.getItem('token');

    //// access the source from local storage
    const SourceUrlId = localStorage.getItem('loginSource');

    //// access the source name from local storage
    const SourceNameUrlId = localStorage.getItem('SourceNameFetched');
    ///////////////// overall Data using GET API 
    const corporateData = props.data;
    console.log(corporateData, 'coooooooooooooooooooo');
    console.log(corporateData.designation_name, 'id corporate');

    ///////////////////// Header Section Data using GET API
    const mainCorporate = props.main
    console.log(mainCorporate, 'mmmmmmoooooooooooooooooooo');
    console.log(mainCorporate.gender.id, 'mmmmmmoooooooooooooooooooo');

    ///////////////////// passed Source and State id name
    const stateCorporate = props.state
    console.log(stateCorporate, 'sssssssssssssssssssssssssssoooooooooooooooooo');

    /////////////////////////////// UPDATE FORM
    const [updatedData, setUpdatedData] = useState({
        name: '',
        blood_groups: '',
        dob: '',
        year: '',
        months: '',
        days: '',
        aadhar_id: '',
        email_id: '',
        emp_mobile_no: '',
        employee_id: '',

        father_name: "",
        mother_name: "",
        occupation_of_father: "",
        occupation_of_mother: "",
        marital_status: "",
        spouse_name: "",
        child_count: "",
        parents_mobile: "",
        sibling_count: "",

        height: null,
        weight: null,
        arm_size: "",
        symptoms: "",
        bmi: "",

        address: "",
        pincode: "",

        /////// new Fields Added 
        emergency_prefix: '',
        emergency_fullname: '',
        emergency_gender: '',
        emergency_contact: '',
        emergency_email: '',
        relationship_with_employee: '',
        emergency_address: '',
        doj: '',
        site_plant: '',
    });

    const [bmi, setBmi] = useState([]);
    console.log(bmi);

    //////// bmi value storage 
    useEffect(() => {
        const fetchStateOptions = async () => {
            if (updatedData.height && updatedData.weight && updatedData.gender && updatedData.year && updatedData.months) {
                try {
                    const response = await axios.get(`${Port}/Screening/SAM_MAM_BMI/${updatedData.year}/${updatedData.months}/${updatedData.gender}/${updatedData.height}/${updatedData.weight}/`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    const options = response.data;
                    setUpdatedData(prevState => ({
                        ...prevState,
                        bmi: options.bmi
                    }));
                    console.log('BMI Response:', options);
                } catch (error) {
                    console.error('Error Fetching Response:', error);
                }
            }
        };
        console.log('Height:', updatedData.height, 'Weight:', updatedData.weight, 'Gender:', updatedData.gender, 'Age:', updatedData.year, 'Months:', updatedData.months);
        fetchStateOptions();
    }, [updatedData.height, updatedData.weight, updatedData.gender, updatedData.year, updatedData.months]);


    useEffect(() => {
        setUpdatedData(props.data);
    }, [props.data]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        if (name === 'dob') {
            const selectedDOB = new Date(value);
            const currentDate = new Date();
            const ageInMilliseconds = currentDate - selectedDOB;

            const years = Math.floor(ageInMilliseconds / (365.25 * 24 * 60 * 60 * 1000));
            const months = Math.floor(
                (ageInMilliseconds % (365.25 * 24 * 60 * 60 * 1000)) / (30.44 * 24 * 60 * 60 * 1000)
            );
            const days = Math.floor(
                (ageInMilliseconds % (30.44 * 24 * 60 * 60 * 1000)) / (24 * 60 * 60 * 1000)
            );

            // Set the updated data with year, months, and days
            setUpdatedData({
                ...updatedData,
                [name]: value,
                year: years,
                months: months,
                days: days
            });
        } else {
            // If the changed input field is not dob, update only its value
            setUpdatedData({
                ...updatedData,
                [name]: value
            });
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        const isConfirmed = window.confirm('Are you sure you want to update employee details?');
        if (isConfirmed) {
            try {
                const updatedDataWithDepartment = {
                    ...updatedData,
                    department_id: selectedDepartmentId,
                    age: mainCorporate.age.id,
                    gender: mainCorporate.gender.id,
                    source: mainCorporate.source.id,
                    type: mainCorporate.type.id,
                    disease: mainCorporate.disease.id,
                    modify_by: userID
                };

                const response = await axios.put(`${Port}/Screening/add_employee_put/${corporateData.citizens_pk_id}/`, updatedDataWithDepartment, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.status === 200) {
                    navigate('/mainscreen/Citizen');
                    console.log('Data updated successfully:', response.data);
                } else {
                    console.error('Unexpected response status:', response.status);
                }
            } catch (error) {
                if (error.response && error.response.status === 409) {
                    alert('Employee already registered with the same employee ID.');
                } else {
                    console.error('Error updating data:', error);
                    alert('An error occurred while updating the data.');
                }
            }
        } else {
            console.log('Update cancelled by user.');
        }
    };

    // const handleUpdate = async (e) => {
    //     e.preventDefault();

    //     const isConfirmed = window.confirm('Are you sure you want to update employee details?');
    //     if (isConfirmed) {
    //         try {
    //             const updatedDataWithDepartment = {
    //                 ...updatedData,
    //                 department_id: selectedDepartmentId,
    //                 age: mainCorporate.age.id,
    //                 gender: mainCorporate.gender.id,
    //                 source: mainCorporate.source.id,
    //                 type: mainCorporate.type.id,
    //                 disease: mainCorporate.disease.id,
    //                 modify_by: userID
    //             };

    //             const response = await axios.put(`${Port}/Screening/add_employee_put/${corporateData.citizens_pk_id}/`, updatedDataWithDepartment, {
    //                 headers: {
    //                     'Authorization': `Bearer ${accessToken}`,
    //                     'Content-Type': 'application/json'
    //                 }
    //             });
    //             navigate('/mainscreen/Citizen');
    //             console.log('Data updated successfully:', response.data);
    //         } catch (error) {
    //             console.error('Error updating data:', error);
    //         }
    //     } else {
    //         console.log('Update cancelled by user.');
    //     }
    // };

    ////////////////////////////////// GET API 
    const [departments, setDepartments] = useState([]);
    const [selectedDepartmentId, setSelectedDepartmentId] = useState('');

    console.log(updatedData.department_id, 'departmentcorporateiddddddddddddddddddddddd');

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const accessToken = localStorage.getItem('token'); // Retrieve access token
                const response = await axios.get(`${Port}/Screening/get_department/${SourceUrlId}/${SourceNameUrlId}/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                });
                setDepartments(response.data);
            } catch (error) {
                console.error('Error fetching departments:', error);
            }
        };
        fetchDepartments();
    }, []);

    const handleDepartmentChange = (e) => {
        setSelectedDepartmentId(e.target.value);
        setUpdatedData({
            ...updatedData,
            department: e.target.value
        });
    };

    const [designation, setDesignation] = useState([]);

    useEffect(() => {
        const fetchDesignation = async () => {
            if (updatedData.department) {
                const apiUrl = `${Port}/Screening/get_designation/${updatedData.department}/${SourceUrlId}/${SourceNameUrlId}/`;
                console.log(apiUrl); // Log the API URL
                try {
                    const response = await fetch(apiUrl, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    const data = await response.json();
                    console.log(data); // Log the fetched data
                    setDesignation(data);
                } catch (error) {
                    console.log('Error Fetching Data');
                }
            } else {
                console.log('Error Fetching Data');
            }
        };
        fetchDesignation();
    }, [updatedData.department]);

    const [state, setState] = useState([]);
    const [district, setDistrict] = useState([]);
    const [tehsil, setTehsil] = useState([]);
    const [sourceName, setSourceName] = useState([]);

    useEffect(() => {
        const fetchState = async () => {
            if (updatedData.source) {
                const apiUrl = `${Port}/Screening/source_and_pass_state_Get/${updatedData.source}`;
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
                    setState(data);
                } catch (error) {
                    console.log('Error Fetching Data');
                }
            } else {
                console.log('Error Fetching Data');
            }
        };
        fetchState();
    }, [updatedData.source]);

    useEffect(() => {
        const fetchState = async () => {
            if (updatedData.source && updatedData.state) {
                const apiUrl = `${Port}/Screening/state_and_pass_district_Get/${updatedData.source}/${updatedData.state}/`;
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
                    setDistrict(data);
                } catch (error) {
                    console.log('Error Fetching Data');
                }
            } else {
                console.log('Error Fetching Data');
            }
        };
        fetchState();
    }, [updatedData.source, updatedData.state]);

    useEffect(() => {
        const fetchTehsil = async () => {
            if (updatedData.source && updatedData.district) {
                const apiUrl = `${Port}/Screening/district_and_pass_taluka_Get/${updatedData.source}/${updatedData.district}/`;
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
    }, [updatedData.source, updatedData.district]);

    useEffect(() => {
        const fetchName = async () => {
            if (updatedData.source && updatedData.tehsil) {
                // const apiUrl = `${Port}/Screening/taluka_and_pass_SourceName_Get/${updatedData.source}/${updatedData.tehsil}/`;
                const apiUrl = `${Port}/Screening/taluka_and_pass_SourceName_Get/?SNid=${updatedData.tehsil}&So=${updatedData.source}&source_pk_id=${SourceNameUrlId}`;
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
    }, [updatedData.source, updatedData.tehsil]);

    return (
        <div className="container ml-2">
            <form onSubmit={handleUpdate}>
                <div className="row cardsetup">
                    <div className="col-md-6">
                        <div className="card card1corporate">
                            <div className="row">
                                <h5 className='employeetitle'>Employee Details</h5>
                                <div className="elementemployee1"></div>
                            </div>

                            <div className="row formspaceemployee">
                                <div className="col-md-3">
                                    <label className="form-label corporatelabel">Prefix</label>
                                    <select className="form-control corporateinput"
                                        value={updatedData.prefix}
                                        onChange={handleInputChange}
                                        name='prefix'
                                    >
                                        <option>Prefix</option>
                                        <option value="Mr">Mr.</option>
                                        <option value="Ms">Ms.</option>
                                        <option value="Mrs">Mrs.</option>
                                        <option value="Adv">Adv.</option>
                                        <option value="Col">Col.</option>
                                        <option value="Dr">Dr.</option>
                                    </select>
                                </div>

                                <div className="col-md-5">
                                    <label className="form-label corporatelabel">Employee Name</label>
                                    <input
                                        className="form-control corporateinput"
                                        type="text"
                                        value={updatedData.name}
                                        onChange={handleInputChange}
                                        name="name"
                                    />
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label corporatelabel">Blood Group</label>
                                    <select className="form-control corporateinput"
                                        value={updatedData.blood_groups}
                                        onChange={handleInputChange}
                                        name='blood_groups'
                                    >
                                        <option>Select Group</option>
                                        <option>A+</option>
                                        <option>A-</option>
                                        <option>B+</option>
                                        <option>B-</option>
                                        <option>AB+</option>
                                        <option>AB-</option>
                                        <option>O+</option>
                                        <option>O-</option>
                                    </select>
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label corporatelabel">Date of Birth</label>
                                    <input
                                        type="date"
                                        className="form-control corporateinput"
                                        value={updatedData.dob}
                                        onChange={handleInputChange}
                                        name='dob'
                                        max={(new Date()).toISOString().split('T')[0]}
                                    />
                                </div>

                                <div className="col-md-2">
                                    <label className="form-label corporatelabel">Year</label>
                                    <input className="form-control corporateinput" readOnly value={updatedData.year}
                                    />
                                </div>

                                <div className="col-md-2">
                                    <label className="form-label corporatelabel">Month</label>
                                    <input className="form-control corporateinput" readOnly value={updatedData.months} />
                                </div>

                                <div className="col-md-2">
                                    <label className="form-label corporatelabel">days</label>
                                    <input className="form-control corporateinput" readOnly value={updatedData.days} />
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label corporatelabel">Aadhar ID</label>
                                    <input
                                        type="number"
                                        className="form-control corporateinput"
                                        name='aadhar_id'
                                        value={updatedData.aadhar_id}
                                        onChange={handleInputChange}
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

                                <div className="col-md-4">
                                    <label className="form-label corporatelabel">Email ID</label>
                                    <input
                                        type="email"
                                        className="form-control corporateinput"
                                        name='email_id'
                                        value={updatedData.email_id}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label corporatelabel">Employee Mobile Number</label>
                                    <input
                                        type="number"
                                        className="form-control corporateinput"
                                        name='emp_mobile_no'
                                        value={updatedData.emp_mobile_no}
                                        onChange={handleInputChange}
                                        onInput={(e) => {
                                            if (e.target.value < 0) {
                                                e.target.value = 0;
                                            }

                                            if (e.target.value.length > 10) {
                                                e.target.value = e.target.value.slice(0, 10);
                                            }
                                        }}
                                    />
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label corporatelabel">Department</label>
                                    <select
                                        className="form-control corporateinput"
                                        value={updatedData.department}
                                        onChange={handleDepartmentChange}
                                    >
                                        <option value="">Select</option>
                                        {departments.map((dept) => (
                                            <option key={dept.department_id} value={dept.department_id}>
                                                {dept.department}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label corporatelabel">Designation</label>
                                    <select className="form-control corporateinput"
                                        value={updatedData.designation}
                                        onChange={(e) => setUpdatedData({ ...updatedData, designation: e.target.value })}>
                                        <option>Select</option>
                                        {
                                            designation.map((design) => (
                                                <option key={design.designation_id} value={design.designation_id}>
                                                    {design.designation}
                                                </option>
                                            ))
                                        }
                                    </select>
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label corporatelabel">Employee ID</label>
                                    <input type="text" className="form-control corporateinput"
                                        name='employee_id'
                                        value={updatedData.employee_id}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label corporatelabel">DOJ</label>
                                    <input type="text" className="form-control corporateinput"
                                        name='doj'
                                        value={updatedData.doj}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="card card2corporate ml-3" style={{ height: '365px' }}>

                            <div className="row">
                                <h5 className='employeetitle'>Family Information</h5>
                                <div className="elementemployee2"></div>
                            </div>

                            {/* //// previous code start*/}
                            {/* <div className="row formspaceemployee">

                                <div className="col-md-6">
                                    <label className="form-label corporatelabel">Father Name</label>
                                    <input className="form-control corporateinput" type="text"
                                        onInput={(e) => {
                                            e.target.value = e.target.value.replace(/[0-9]/, '');
                                        }}
                                        name='father_name'
                                        value={updatedData.father_name}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label corporatelabel">Mother Name</label>
                                    <input className="form-control corporateinput" type="text"
                                        onInput={(e) => {
                                            e.target.value = e.target.value.replace(/[0-9]/, '');
                                        }}
                                        name='mother_name'
                                        value={updatedData.mother_name}
                                        onChange={handleInputChange}

                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label corporatelabel">Occupation of Father</label>
                                    <input className="form-control corporateinput"
                                        name='occupation_of_father'
                                        value={updatedData.occupation_of_father}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label corporatelabel">Occupation of Mother</label>
                                    <input className="form-control corporateinput"
                                        name='occupation_of_mother'
                                        value={updatedData.occupation_of_mother}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label corporatelabel">Employee's Marital Status</label>
                                    <select className="form-control corporateinput"
                                        name='marital_status'
                                        value={updatedData.marital_status}
                                        onChange={handleInputChange}>
                                        <option>Select</option>
                                        <option value='Married'>Married</option>
                                        <option value='Unmarried'>Unmarried</option>
                                        <option value='Widow'>Widow/Widower</option>
                                    </select>
                                </div>

                                {
                                    updatedData.marital_status === 'Married' && (
                                        <div className="col-md-6">
                                            <label className="form-label corporatelabel">Employee's Spouse Name</label>
                                            <input className="form-control corporateinput" type='text'
                                                onInput={(e) => {
                                                    e.target.value = e.target.value.replace(/[0-9]/, '');
                                                }}
                                                name='spouse_name'
                                                value={updatedData.spouse_name}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    )
                                }

                                {
                                    updatedData.marital_status === 'Unmarried' && (
                                        <div className="col-md-6">
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <label className="form-label corporatelabel">Siblings Count</label>
                                                    <select className="form-control corporateinput"
                                                        name="sibling_count"
                                                        value={updatedData.spouse_name}
                                                        onChange={handleInputChange}>
                                                        <option>Select</option>
                                                        <option value='0'>0</option>
                                                        <option value='1'>1</option>
                                                        <option value='2'>2</option>
                                                        <option value='3'>3</option>
                                                    </select>
                                                </div>

                                            </div>
                                        </div>
                                    )
                                }

                                {
                                    (updatedData.marital_status === 'Widow' || updatedData.marital_status === 'Married') && (
                                        <div className="col-md-6">
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <label className="form-label corporatelabel">Children Count</label>
                                                    <select className="form-control corporateinput"
                                                        name="child_count"
                                                        value={updatedData.child_count}
                                                        onChange={handleInputChange}
                                                    >
                                                        <option>Select</option>
                                                        <option value='0'>0</option>
                                                        <option value='1'>1</option>
                                                        <option value='2'>2</option>
                                                        <option value='3'>3</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }

                                <div className="col-md-6">
                                    <label className="form-label corporatelabel">Contact Number</label>
                                    <input type="number" className="form-control corporateinput"
                                        onInput={(e) => {
                                            if (e.target.value < 0) {
                                                e.target.value = 0;
                                            }

                                            if (e.target.value.length > 12) {
                                                e.target.value = e.target.value.slice(0, 10);
                                            }
                                        }}
                                        name='parents_mobile'
                                        value={updatedData.parents_mobile}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div> */}
                            {/* //// previous code end*/}

                            {/* ////excel sheet wise changes start*/}
                            <div className="row formspaceemployee">

                                <div className="col-md-3">
                                    <label className="form-label corporatelabel">Prefix</label>
                                    <select className="form-control corporateinput"
                                        value={updatedData.emergency_prefix}
                                        onChange={handleInputChange}
                                        name='emergency_prefix'
                                    >
                                        <option>Prefix</option>
                                        <option value="Mr">Mr.</option>
                                        <option value="Ms">Ms.</option>
                                        <option value="Mrs">Mrs.</option>
                                        <option value="Adv">Adv.</option>
                                        <option value="Col">Col.</option>
                                        <option value="Dr">Dr.</option>
                                    </select>
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label corporatelabel">Full Name</label>
                                    <input className="form-control corporateinput" type="text"
                                        onInput={(e) => {
                                            e.target.value = e.target.value.replace(/[0-9]/, '');
                                        }}
                                        name='emergency_fullname'
                                        value={updatedData.emergency_fullname}
                                        onChange={handleInputChange}

                                    />
                                </div>

                                <div className="col-md-3">
                                    <label className="form-label corporatelabel">Gender</label>
                                    <select className="form-control corporateinput"
                                        value={updatedData.emergency_gender}
                                        onChange={handleInputChange}
                                        name='emergency_gender'
                                    >
                                        <option>Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label corporatelabel">Emergency Contact Number</label>
                                    <input type="number" className="form-control corporateinput"
                                        onInput={(e) => {
                                            if (e.target.value < 0) {
                                                e.target.value = 0;
                                            }

                                            if (e.target.value.length > 12) {
                                                e.target.value = e.target.value.slice(0, 10);
                                            }
                                        }}
                                        name='emergency_contact'
                                        value={updatedData.emergency_contact}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label corporatelabel">Email ID</label>
                                    <input type="number" className="form-control corporateinput"
                                        onInput={(e) => {
                                            if (e.target.value < 0) {
                                                e.target.value = 0;
                                            }

                                            if (e.target.value.length > 12) {
                                                e.target.value = e.target.value.slice(0, 10);
                                            }
                                        }}
                                        name='emergency_email'
                                        value={updatedData.emergency_email}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label corporatelabel">Relationship With Employee</label>
                                    <select className="form-control corporateinput"
                                        value={updatedData.relationship_with_employee}
                                        onChange={handleInputChange}
                                        name='relationship_with_employee'
                                    >
                                        <option>Relationship with Employee</option>
                                        <option value="father">Father</option>
                                        <option value="mother">Mother</option>
                                        <option value="brother">Brother</option>
                                        <option value="sister">Sister</option>
                                        <option value="spouse">Spouse</option>
                                        <option value="son">Son</option>
                                        <option value="daughter">Daughter</option>
                                    </select>
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label corporatelabel">Present Address</label>
                                    <input type="text" className="form-control corporateinput"
                                        name='emergency_address'
                                        value={updatedData.emergency_address}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            {/* ////excel sheet wise changes end*/}

                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="card card1corporate" style={{ height: '93%' }}>

                            <div className="row">
                                <h5 className='employeetitle'>Growth Monitoring</h5>
                                <div className="elementemployee3"></div>
                            </div>

                            <div className="row formspaceemployee">
                                <div className="col-md-4">
                                    <label className="form-label corporatelabel">Height</label>
                                    <input type="number" className="form-control corporateinput"
                                        name='height'
                                        value={updatedData.height}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label corporatelabel">Weight</label>
                                    <input type="number" className="form-control corporateinput"
                                        name='weight'
                                        value={updatedData.weight}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label corporatelabel">BMI</label>
                                    <input type="text" className="form-control corporateinput" readOnly
                                        name='bmi'
                                        value={updatedData.bmi}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label corporatelabel">Arm Size</label>
                                    <input type="number" className="form-control corporateinput"
                                        onInput={(e) => {
                                            if (e.target.value < 0) {
                                                e.target.value = 0;
                                            }

                                            if (e.target.value.length > 3) {
                                                e.target.value = e.target.value.slice(0, 3);
                                            }
                                        }}
                                        name='arm_size'
                                        value={updatedData.arm_size}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="col-md-8">
                                    <label className="form-label corporatelabel">Symptoms if any</label>
                                    <input type="text" className="form-control corporateinput"
                                        onInput={(e) => {
                                            e.target.value = e.target.value.replace(/[0-9]/, '');
                                        }}
                                        name='symptoms'
                                        value={updatedData.symptoms}
                                        onChange={handleInputChange}
                                    />
                                </div>

                            </div>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="card card2corporate ml-3">

                            <div className="row">
                                <h5 className='employeetitle'>Address</h5>
                                <div className="elementemployee4"></div>
                            </div>

                            <div className="row formspaceemployee">
                                <div className="col-md-6">
                                    <label className="form-label corporatelabel">State</label>
                                    <select className="form-control corporateinput"
                                        value={updatedData.state}
                                        onChange={(e) => setUpdatedData({ ...updatedData, state: e.target.value })}>
                                        <option>Select State</option>
                                        {state.map((stateOption) => (
                                            <option key={stateOption.source_state} value={stateOption.source_state}>
                                                {stateOption.state_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label corporatelabel">District</label>
                                    <select className="form-control corporateinput"
                                        value={updatedData.district}
                                        onChange={(e) => setUpdatedData({ ...updatedData, district: e.target.value })}
                                    >
                                        <option>Select District</option>
                                        {district.map((districtOption) => (
                                            <option key={districtOption.source_district} value={districtOption.source_district}>
                                                {districtOption.dist_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label corporatelabel">Tehsil</label>
                                    <select className="form-control corporateinput"
                                        value={updatedData.tehsil}
                                        onChange={(e) => setUpdatedData({ ...updatedData, tehsil: e.target.value })}>
                                        <option>Select Tehsil</option>
                                        {tehsil.map((TehsilOption) => (
                                            <option key={TehsilOption.source_taluka} value={TehsilOption.source_taluka}>
                                                {TehsilOption.tahsil_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label corporatelabel">Source Name</label>
                                    <select className="form-control corporateinput"
                                        value={updatedData.source_name}
                                        onChange={(e) => setUpdatedData({ ...updatedData, source_name: e.target.value })}>
                                        <option>Select Source Name</option>
                                        {sourceName.map((NameOption) => (
                                            <option key={NameOption.source_pk_id} value={NameOption.source_pk_id}>
                                                {NameOption.source_names}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label corporatelabel">Address</label>
                                    <input className="form-control corporateinput"
                                        name='address'
                                        value={updatedData.address}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label corporatelabel">Permanant Address</label>
                                    <input className="form-control corporateinput"
                                        name='permanant_address'
                                        value={updatedData.permanant_address}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label corporatelabel">Pincode</label>
                                    <input type="number" className="form-control corporateinput"
                                        onInput={(e) => {
                                            if (e.target.value < 0) {
                                                e.target.value = 0;
                                            }

                                            if (e.target.value.length > 6) {
                                                e.target.value = e.target.value.slice(0, 6);
                                            }
                                        }}
                                        name='pincode'
                                        value={updatedData.pincode}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label corporatelabel">Site Plant</label>
                                    <input className="form-control corporateinput"
                                        name='site_plant'
                                        value={updatedData.site_plant}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row buttoncorporate">
                    <button type="submit" className="corporatesubmit">Update</button>
                </div>
            </form>
        </div>
    );
};

export default CorporateUpdate;
