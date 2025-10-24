import React, { useState, useEffect } from 'react'
import './ChildVital.css'

const Childvital = ({ citizensPkId, pkid, sourceID, fetchVital, selectedName, onAcceptClick }) => {

    const SourceUrlId = localStorage.getItem('loginSource');
    const SourceNameUrlId = localStorage.getItem('SourceNameFetched');
    const source = localStorage.getItem('source');
    const Port = process.env.REACT_APP_API_KEY;
    const userID = localStorage.getItem('userID');
    const accessToken = localStorage.getItem('token');
    const [department, setDepartment] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [designation, setDesignation] = useState([]);
    //_________________________________START
    console.log(selectedName, 'Present name');
    console.log(fetchVital, 'Overall GET API');
    const [nextName, setNextName] = useState('');

    useEffect(() => {
        if (fetchVital && selectedName) {
            const currentIndex = fetchVital.findIndex(item => item.screening_list === selectedName);

            console.log('Current Index:', currentIndex);

            if (currentIndex !== -1 && currentIndex < fetchVital.length - 1) {
                const nextItem = fetchVital[currentIndex + 1];
                const nextName = nextItem.screening_list;
                setNextName(nextName);
                console.log('Next Name Set:', nextName);
            } else {
                setNextName('');
                console.log('No next item or selectedName not found');
            }
        }
    }, [selectedName, fetchVital]);
    //__________________________________END

    const handleDepartmentChange = (e) => {
        setSelectedDepartment(e.target.value);
    };

    useEffect(() => {
        const fetchDepartment = async () => {
            try {
                const response = await fetch(`${Port}/Screening/get_department/${SourceUrlId}/${SourceNameUrlId}/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                })
                const data = await response.json()
                setDepartment(data)
            }
            catch (error) {
                console.log('error found fecthing Data');
            }
        }
        fetchDepartment();
    }, [])

    useEffect(() => {
        const fetchDesignation = async () => {
            if (selectedDepartment) {
                try {
                    const response = await fetch(`${Port}/Screening/get_designation/${selectedDepartment}/${SourceUrlId}/${SourceNameUrlId}/`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                        },
                    });
                    console.log(response, 'responseeeeeeeee');
                    if (!response.ok) {
                        throw new Error(`Failed to fetch data. Status: ${response.status}`);
                    }
                    const data = await response.json();
                    console.log(data, 'datadata');
                    setDesignation(data);
                } catch (error) {
                    console.log('Error fetching Data:', error);
                }
            }
        };

        fetchDesignation();
    }, [selectedDepartment]);

    const [childData, setChildData] = useState({
        citizen_id: '',
        schedule_id: '',
        name: '',
        gender: '',
        blood_groups: '',
        dob: '',
        year: '',
        months: '',
        days: '',
        aadhar_id: '',
        email_id: '',
        emp_mobile_no: null,
        employee_id: "",
        department: "",
        designation: "",
        doj: ''
    });

    const [updateId, setUpdateId] = useState("") ////// PUT Store Variable

    ////////GET API Integrated
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${Port}/Screening/citizen_basic_info_get/${pkid}/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });
                if (!response.ok) {
                    throw new Error(`Failed to fetch data. Status: ${response.status}`);
                }

                const childDataFromApi = await response.json();
                const childData = childDataFromApi[0];
                console.log(childData, 'childddataaaaaaaaaaaaaaaaaaaaaaaaaaa');
                setChildData(childData);
                setSelectedDepartment(childData?.citizen_info?.department)
                console.log('Citizen Idddddd:', childData?.citizen_id);
                setUpdateId(childData?.citizen_id)

                ////gender
                console.log('genderrrrr child vital:', childData?.citizen_info?.gender);
                localStorage.setItem('citizenGender', childData?.citizen_info?.gender)

            } catch (error) {
                console.error('Error fetching child data', error);
            }
        };
        fetchData();
    }, [citizensPkId]);

    useEffect(() => {
        if (updateId) {
            updateFormWithId(updateId);
        }
    }, [updateId]);

    const updateFormWithId = (citizen_id) => {
        console.log('Updating form with ID:', citizen_id);
    };

    const updateDataInDatabase = async (citizen_id, confirmationStatus) => {
        try {
            const response = await fetch(`${Port}/Screening/citizen_basic_info_put/${citizen_id}/`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json', // Ensure correct content type
                },
                body: JSON.stringify({
                    citizen_id: childData.citizen_id,
                    schedule_id: childData.schedule_id,
                    name: childData.citizen_info.name,
                    doj: childData.citizen_info.doj,
                    gender: childData.citizen_info.gender,
                    blood_groups: childData.citizen_info.blood_groups,
                    dob: childData.citizen_info.dob,
                    year: childData.citizen_info.year,
                    months: childData.citizen_info.months,
                    days: childData.citizen_info.days,
                    aadhar_id: childData.citizen_info.aadhar_id,
                    emp_mobile_no: childData.citizen_info.emp_mobile_no,
                    email_id: childData.citizen_info.email_id,
                    employee_id: childData.citizen_info.employee_id,
                    department: childData.citizen_info.department,
                    designation: childData.citizen_info.designation,
                    form_submit: confirmationStatus,
                    added_by: userID,
                    modify_by: userID
                }),
            });

            if (response.status === 200) {
                const updatedChildData = { ...childData };
                setChildData(updatedChildData);
                console.log(updatedChildData, 'Updated Child Data');
                onAcceptClick(nextName);
            } else if (response.status === 400) {
                alert('Bad request. Please check your data and try again.');
            } else if (response.status === 500) {
                alert('Internal Server Error. Please try again later.');
            } else {
                alert(`Failed to update data. Status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error updating data', error);
        }
    };

    const handleSubmit = async () => {
        const isConfirmed = window.confirm('Submit Child Info Form');
        const confirmationStatus = isConfirmed ? 'True' : 'False';

        if (updateId) {
            if (isConfirmed) {
                await updateDataInDatabase(updateId, confirmationStatus);
            } else {
                console.log('Form submission cancelled');
            }
        }
    };

    return (
        <div>
            <div className="row backdesign">
                <div className="col-md-12">
                    <div className="card bmicard">
                        <div className="row">
                            <div className="col-md-4">
                                <h6 className='mt-1'>
                                    {
                                        source === '1' ? 'Citizen Details' : 'Employee Details'
                                    }
                                </h6>
                            </div>
                            <div className="col-md-5 ml-auto">
                                <div class="progress-barbmi"></div>
                            </div>
                        </div>
                    </div>

                    <div className="card grothcardmonitor">
                        <div className="row">
                            <div className="col-md-12">
                                <h6 className="BMITitle">
                                    {
                                        source === '1' ? 'Citizen Information' : 'Employee Information'
                                    }
                                </h6>
                                <div className="childdetailelement"></div>
                            </div>
                        </div>

                        <div className="row paddingwhole">

                            <div className="col-md-2">
                                <label for="childName" class="visually-hidden childvitaldetails">Prefix</label>
                                <select class="form-control childvitalinput" aria-label="Default select example"
                                    value={childData?.citizen_info?.prefix}
                                    onChange={(e) => setChildData({ ...childData, citizen_info: { ...childData.citizen_info, prefix: e.target.value } })}
                                >
                                    <option selected>select</option>
                                    <option value="Mr">Mr.</option>
                                    <option value="Ms">Ms.</option>
                                    <option value="Mrs">Mrs.</option>
                                    <option value="Adv">Adv.</option>
                                    <option value="Col">Col.</option>
                                    <option value="Dr">Dr.</option>
                                </select>
                            </div>

                            <div className="col-md-5">
                                <label for="childName" class="visually-hidden childvitaldetails">
                                    Citizen ID
                                </label>
                                <input type="text" class="form-control childvitalinput" placeholder="Enter ID" readOnly
                                    value={childData?.citizen_id}
                                />
                            </div>

                            <div className="col-md-5">
                                <label for="childName" class="visually-hidden childvitaldetails">Schedule ID</label>
                                <input type="text" class="form-control childvitalinput" placeholder="Enter ID" readOnly
                                    value={childData?.schedule_id} />
                            </div>
                        </div>

                        <div className="row paddingwhole">
                            <div className="col-md-6">
                                <label for="childName" class="visually-hidden childvitaldetails">
                                    {
                                        source === '1' ? 'Citizen Name' : 'Employee Name'
                                    }
                                </label>
                                <input
                                    type="text"
                                    className="form-control childvitalinput"
                                    placeholder="Enter Name"
                                    value={childData?.citizen_info?.name}
                                    onInput={(e) => {
                                        e.target.value = e.target.value.replace(/[0-9]/, '');
                                    }}
                                    onChange={(e) => setChildData({ ...childData, citizen_info: { ...childData.citizen_info, name: e.target.value } })}
                                />
                            </div>

                            <div className="col-md-3">
                                <label for="childName" class="visually-hidden childvitaldetails">Gender</label>
                                <select class="form-control childvitalinput" aria-label="Default select example"
                                    value={childData?.citizen_info?.gender}
                                    onChange={(e) => setChildData({ ...childData, citizen_info: { ...childData.citizen_info, gender: e.target.value } })}
                                >
                                    <option selected>select</option>
                                    <option value="2">Female</option>
                                    <option value="1">Male</option>
                                    <option value="3">Other</option>
                                </select>
                            </div>

                            <div className="col-md-3">
                                <label for="childName" class="visually-hidden childvitaldetails">Blood Group</label>
                                <select class="form-control childvitalinput" aria-label="Default select example"
                                    value={childData?.citizen_info?.blood_groups}
                                    onChange={(e) => setChildData({ ...childData, citizen_info: { ...childData.blood_groups, blood_groups: e.target.value } })}
                                >
                                    <option selected>select</option>
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
                        </div>

                        <div className="row paddingwhole mb-3">
                            <div className="col-md-6">
                                <label for="adhar" class="visually-hidden childvitaldetails">Aadhar ID</label>
                                <input
                                    type="number"
                                    className="form-control childvitalinput"
                                    placeholder="Enter ID"
                                    onChange={(e) => {
                                        const inputValue = Math.max(0, parseInt(e.target.value, 10)); // Ensures non-negative value
                                        setChildData({ ...childData, citizen_info: { ...childData.citizen_info, aadhar_id: inputValue } });
                                    }}
                                    value={childData?.citizen_info?.aadhar_id}
                                    onInput={(e) => {
                                        if (e.target.value.length > 12) {
                                            e.target.value = e.target.value.slice(0, 12);
                                        }
                                    }}
                                />
                            </div>

                            <div className="col-md-6">
                                <label for="abha" class="visually-hidden childvitaldetails">Abha ID</label>
                                <input type="text" class="form-control childvitalinput" placeholder="Enter ID" readOnly />
                            </div>
                        </div>

                        {
                            sourceID === 5 && (
                                <div className="row paddingwhole mb-4">
                                    <div className="col-md-4">
                                        <label htmlFor="email" className="visually-hidden childvitaldetails">Email ID</label>
                                        <input
                                            type="text"
                                            className="form-control childvitalinput"
                                            id="email"
                                            placeholder="Enter Email ID"
                                            value={childData?.citizen_info?.email_id}
                                            onChange={(e) =>
                                                setChildData({
                                                    ...childData,
                                                    citizen_info: { ...childData.citizen_info, email_id: e.target.value },
                                                })
                                            }
                                        />
                                    </div>

                                    <div className="col-md-4">
                                        <label htmlFor="empMobile" className="visually-hidden childvitaldetails">Employee Mobile Number</label>
                                        <input
                                            type="text"
                                            className="form-control childvitalinput"
                                            id="empMobile"
                                            placeholder="Enter Employee Mobile Number"
                                            value={childData?.citizen_info?.emp_mobile_no}
                                            onChange={(e) =>
                                                setChildData({
                                                    ...childData,
                                                    citizen_info: { ...childData.citizen_info, emp_mobile_no: e.target.value },
                                                })
                                            }
                                        />
                                    </div>

                                    <div className="col-md-4">
                                        <label htmlFor="department" className="visually-hidden childvitaldetails">Department</label>
                                        <select class="form-control childvitalinput" aria-label="Default select example"
                                            value={selectedDepartment}
                                            onChange={handleDepartmentChange}
                                        >
                                            <option selected>select</option>
                                            {
                                                department.map((department) => (
                                                    <option key={department.department_id} value={department.department_id}>
                                                        {department.department}
                                                    </option>
                                                ))
                                            }
                                        </select>
                                    </div>

                                    <div className="col-md-4">
                                        <label htmlFor="designation" className="visually-hidden childvitaldetails">Designation</label>
                                        <select
                                            className="form-control childvitalinput"
                                            id="designation"
                                            aria-label="Default select example"
                                            value={childData?.citizen_info?.designation}
                                            onChange={(e) =>
                                                setChildData({
                                                    ...childData,
                                                    citizen_info: { ...childData.citizen_info, designation: e.target.value },
                                                })
                                            }
                                        >
                                            <option>Select Designation</option>
                                            {designation.map((desig) => (
                                                <option key={desig.designation_id} value={desig.designation_id}>
                                                    {desig.designation}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-md-4">
                                        <label htmlFor="empId" className="visually-hidden childvitaldetails">Employee ID</label>
                                        <input
                                            type="text"
                                            className="form-control childvitalinput"
                                            id="empId"
                                            placeholder="Enter Employee ID"
                                            value={childData?.citizen_info?.employee_id}
                                            onChange={(e) =>
                                                setChildData({
                                                    ...childData,
                                                    citizen_info: { ...childData.citizen_info, employee_id: e.target.value },
                                                })
                                            }
                                        />
                                    </div>

                                    <div className="col-md-4">
                                        <label htmlFor="empId" className="visually-hidden childvitaldetails">DOJ</label>
                                        <input
                                            type="date"
                                            className="form-control childvitalinput"
                                            value={childData?.citizen_info?.doj}
                                            onChange={(e) =>
                                                setChildData({
                                                    ...childData,
                                                    citizen_info: { ...childData.citizen_info, doj: e.target.value },
                                                })
                                            }
                                        />
                                    </div>
                                </div>
                            )
                        }

                    </div>

                    <div type="submit" className="btn btn-sm submitvital" onClick={handleSubmit}>
                        Accept
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Childvital
