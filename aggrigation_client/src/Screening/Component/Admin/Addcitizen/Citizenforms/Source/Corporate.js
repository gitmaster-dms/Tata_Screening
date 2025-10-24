import React, { useState, useEffect, useRef } from 'react';
import './Corporate.css'
import { useSourceContext } from '../../../../../../../src/contexts/SourceContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import { Modal, Button, IconButton } from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  backgroundColor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  padding: '16px 32px 24px',
};

const Corporate = (props) => {

  const Port = process.env.REACT_APP_API_KEY;
  const userID = localStorage.getItem('userID');
  console.log(userID);
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('token');

  /// State District Tehsil
  const State = localStorage.getItem('StateLogin');
  const District = localStorage.getItem('DistrictLogin');
  const Tehsil = localStorage.getItem('TehsilLogin');

  /////////// image capturing
  const webcamRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setImageSrc(null);  // Reset imageSrc if modal is closed without saving
  };

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImageSrc(imageSrc);
  };
  /////////// image capturing end

  //// access the source from local storage
  const SourceUrlId = localStorage.getItem('loginSource');

  //// access the source name from local storage
  const SourceNameUrlId = localStorage.getItem('SourceNameFetched');

  const [maritalStatus, setMaritalStatus] = useState('');
  const { sourceState, district, tehsil, SourceName, height,
    setHeight, weight, setWeight, age, setAge, bmi, gender,
    selectedScheduleType, selectedSource, selectedAge, selectedDisease } = useSourceContext();

  const [department, setDepartment] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedDesignation, setSelectedDesignation] = useState('');
  const [designation, setDesignation] = useState([]);
  const [siblingsCount, setSiblingsCount] = useState("");
  const [childrenCount, setChildrenCount] = useState("");
  const [dob, setDOB] = useState('');

  console.log(selectedAge, 'Fetched Age for Corporate');

  const handleSiblingsCountChange = (e) => {
    setSiblingsCount(e.target.value);
  };

  const handleChildrenCountChange = (e) => {
    setChildrenCount(e.target.value);
  };

  //////////// depeendency Mapping
  const { selectedState, setSelectedState } = useSourceContext();
  const [selectedStateId, setSelectedStateId] = useState(State || '');

  const handleStateChange = (event) => {
    const stateId = event.target.value;
    setSelectedState(stateId);
    setSelectedStateId(stateId);

    // Clear error message for state if it exists
    if (errorMessages.state) {
      setErrorMessages((prevErrors) => ({
        ...prevErrors,
        state: '',
      }));
    }
  };

  ///// district
  const { selectedDistrict, setSelectedDistrict } = useSourceContext();
  const [selectedDistrictId, setSelectedDistrictId] = useState(District || '');

  const handleDistrictChange = (event) => {
    const districtId = event.target.value;
    setSelectedDistrict(districtId);
    setSelectedDistrictId(districtId);

    // Clear error message for state if it exists
    if (errorMessages.district) {
      setErrorMessages((prevErrors) => ({
        ...prevErrors,
        district: '',
      }));
    }
  }

  ///// tehsil
  const { selectedTehsil, setSelectedTehsil } = useSourceContext();
  const [selectedTehsilId, setSelectedTehsilId] = useState(Tehsil || '');

  const handleTehsilChange = (event) => {
    const tehsilId = event.target.value;
    setSelectedTehsil(tehsilId);
    setSelectedTehsilId(tehsilId);

    // Clear error message for state if it exists
    if (errorMessages.tehsil) {
      setErrorMessages((prevErrors) => ({
        ...prevErrors,
        tehsil: '',
      }));
    }
  }

  //////// source Name 
  const { selectedName, setSelectedName } = useSourceContext();
  const [selectedNameId, setSelectedNameId] = useState('');

  const handleSOurceNameChange = (event) => {
    const nameId = event.target.value;
    setSelectedName(nameId);
    setSelectedNameId(nameId);

    // Clear error message for state if it exists
    if (errorMessages.source_name) {
      setErrorMessages((prevErrors) => ({
        ...prevErrors,
        source_name: '',
      }));
    }
  }

  ////////// BMI
  const [heightValue, setHeightValue] = useState('');
  const [weightValue, setWeightValue] = useState('');

  const handleHeightChange = (event) => {
    const { value } = event.target;
    setHeightValue(value);
    setHeight(value);
  };

  const handleWeightChange = (event) => {
    const { value } = event.target;
    setWeightValue(value);
    setWeight(value);
  };

  const handlestatus = (event) => {
    setMaritalStatus(event.target.value);
  }

  const calculateAge = (selectedDOB) => {
    if (!selectedDOB) {
      // Clear age values when DOB is null or undefined
      setAge({ year: '', months: '', days: '' });
      return;
    }

    const currentDate = new Date();
    const ageInMilliseconds = currentDate - selectedDOB;

    const years = Math.floor(ageInMilliseconds / (365.25 * 24 * 60 * 60 * 1000));
    const months = Math.floor(
      (ageInMilliseconds % (365.25 * 24 * 60 * 60 * 1000)) / (30.44 * 24 * 60 * 60 * 1000)
    );
    const days = Math.floor(
      ((ageInMilliseconds % (365.25 * 24 * 60 * 60 * 1000)) % (30.44 * 24 * 60 * 60 * 1000)) / (24 * 60 * 60 * 1000)
    );

    setAge({ year: years, months: months, days: days });
  };

  const handleDOBChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const maxAllowedDate = new Date();
    const minAllowedDate = new Date();

    // Adjust minAllowedDate based on the age restriction
    if (props.age === 2) {
      minAllowedDate.setFullYear(minAllowedDate.getFullYear() - 19);
    }

    if (selectedDate >= minAllowedDate && selectedDate <= maxAllowedDate) {
      if (props.age === 2 && selectedDate >= minAllowedDate) {
        setErrorMessages((prevErrors) => ({
          ...prevErrors,
          dob: 'Invalid date. Please select a date outside the last 19 years.',
        }));
        return;
      }
    }

    setDOB(e.target.value);
    calculateAge(selectedDate);

    // Clear error message
    setErrorMessages((prevErrors) => ({
      ...prevErrors,
      dob: '',
    }));
  };

  useEffect(() => {
    setHeight(heightValue);
  }, [heightValue]);

  useEffect(() => {
    setWeight(weightValue);
  }, [weightValue]);

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const response = await fetch(`${Port}/Screening/get_department/${SourceUrlId}/${SourceNameUrlId}/`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        setDepartment(data);
      }
      catch (error) {
        console.log('Error Fetching Data');
      }
    }
    fetchDepartment();
  }, []);

  const handleDepartmentChange = (e) => {
    setSelectedDepartment(e.target.value);

    // Clear error message for state if it exists
    if (errorMessages.department) {
      setErrorMessages((prevErrors) => ({
        ...prevErrors,
        department: '',
      }));
    }
  }

  const handleDesignationChange = (e) => {
    setSelectedDesignation(e.target.value);

    // Clear error message for state if it exists
    if (errorMessages.designation) {
      setErrorMessages((prevErrors) => ({
        ...prevErrors,
        designation: '',
      }));
    }
  };

  useEffect(() => {
    const fetchDesignation = async () => {
      if (selectedDepartment) {
        try {
          const response = await fetch(`${Port}/Screening/get_designation/${selectedDepartment}/${SourceUrlId}/${SourceNameUrlId}/`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            }
          });
          const data = await response.json();
          setDesignation(data);
        }
        catch (error) {
          console.log('Error Fetching Data');
        }
      }
      else {
        console.log('Error Fetching Data');
      }
    }
    fetchDesignation()
  }, [selectedDepartment])

  ////////////// POST API
  // const [corporateForm, setCorporateForm] = useState({
  //   name: "",
  //   blood_groups: "",
  //   aadhar_id: null,
  //   email_id: "",
  //   emp_mobile_no: "",
  //   employee_id: "",

  //   father_name: "",
  //   mother_name: "",
  //   occupation_of_father: "",
  //   occupation_of_mother: "",
  //   marital_status: "",
  //   parents_mobile: "",
  //   spouse_name: "",
  //   sibling_count: "",
  //   arm_size: null,
  //   symptoms: "",

  //   pincode: "",
  //   address: "",
  //   prefix: "",
  //   permanant_address: "",
  //   photo: null,

  //   source: selectedSource,
  //   state: selectedStateId,
  //   district: selectedDistrictId,
  //   tehsil: selectedTehsilId,
  //   source_name: selectedName,
  //   gender: gender,
  //   type: selectedScheduleType,
  //   age: selectedAge,
  //   disease: selectedDisease,
  // })

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setCorporateForm((prevState) => ({
  //     ...prevState,
  //     [name]: value
  //   }));
  // };

  // const handleChange = (e) => {
  //   const { name, value, files } = e.target;
  //   if (name === 'photo') {
  //     setCorporateForm((prevState) => ({
  //       ...prevState,
  //       [name]: files[0] // Assuming only one file is expected
  //     }));
  //   } else {
  //     setCorporateForm((prevState) => ({
  //       ...prevState,
  //       [name]: value
  //     }));
  //   }
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   const confirmed = window.confirm('Are you sure you want to submit the form?');

  //   if (confirmed) {
  //     const formData = {
  //       ...corporateForm,
  //       dob: dob ? dob : null,
  //       year: age.year,
  //       months: age.months,
  //       days: age.days,
  //       department: selectedDepartment,
  //       designation: selectedDesignation,
  //       marital_status: maritalStatus,
  //       sibling_count: siblingsCount,
  //       child_count: (maritalStatus === 'Widow' || maritalStatus === 'Married') ? childrenCount : null,
  //       height: heightValue || null,
  //       weight: weightValue || null,
  //       bmi: bmi || null,
  //       state: selectedStateId,
  //       district: selectedDistrictId,
  //       tehsil: selectedTehsilId,
  //       source_name: selectedName,
  //       gender: gender,
  //       type: selectedScheduleType,
  //       source: selectedSource,
  //       age: selectedAge,
  //       disease: selectedDisease,
  //       added_by: userID
  //     };

  //     try {
  //       const response = await fetch(`${Port}/Screening/add_employee_post/`, {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'Authorization': `Bearer ${accessToken}`,
  //         },
  //         body: JSON.stringify(formData)
  //       });

  //       if (response.status === 201) {
  //         navigate('/mainscreen/Citizen');
  //       }
  //       else if (response.status === 400) {
  //         alert('Error Submitting the Form');
  //       }
  //       else if (response.status === 409) {
  //         alert('Employee already Exists with given Aadhar ID');
  //       }
  //     } catch (error) {
  //       console.error('Error:', error);
  //     }
  //   } else {
  //     console.log('Form submission cancelled.');
  //   }
  // };

  const [errorMessages, setErrorMessages] = useState({
    prefix: '',
    name: '',
    blood_groups: '',
    employee_id: '',
    emp_mobile_no: '',
    state: '',
    district: '',
    tehsil: '',
    source_name: '',
    department: '',
    designation: ''
  });

  const [corporateForm, setCorporateForm] = useState({
    name: '',
    blood_groups: '',
    aadhar_id: null,
    email_id: '',
    emp_mobile_no: '',
    employee_id: '',
    father_name: '',
    mother_name: '',
    occupation_of_father: '',
    occupation_of_mother: '',
    parents_mobile: '',
    spouse_name: '',
    arm_size: null,
    symptoms: '',
    pincode: '',
    address: '',
    prefix: '',
    permanant_address: '',
    photo: null,

    source: selectedSource,
    state: selectedStateId,
    district: selectedDistrictId,
    tehsil: selectedTehsilId,
    source_name: selectedName,
    gender: gender,
    type: selectedScheduleType,
    age: selectedAge,
    added_by: userID,

    // Newly added fields for corporate 
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

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'photo') {
      setCorporateForm((prevState) => ({
        ...prevState,
        [name]: files[0]
      }));
    } else {
      setCorporateForm((prevState) => ({
        ...prevState,
        [name]: value
      }));
    }

    //// clear error message
    if (errorMessages[name]) {
      setErrorMessages((prevErrors) => ({
        ...prevErrors,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const confirmed = window.confirm('Are you sure you want to submit the form?');

    if (confirmed) {
      const formData = new FormData();

      // Append all fields from corporateForm
      Object.entries(corporateForm).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });

      formData.append('year', age.year);
      formData.append('months', age.months);
      formData.append('days', age.days);
      formData.append('department', selectedDepartment);
      formData.append('designation', selectedDesignation);
      formData.append('marital_status', maritalStatus);
      formData.append('sibling_count', siblingsCount);
      formData.append('state', selectedStateId);
      formData.append('district', selectedDistrictId);
      formData.append('tehsil', selectedTehsilId);
      formData.append('source_name', selectedName);
      formData.append('gender', gender);
      formData.append('type', selectedScheduleType);
      formData.append('source', selectedSource);
      formData.append('age', selectedAge);
      formData.append('disease', selectedDisease);
      formData.append('added_by', userID);

      formData.append('height', heightValue);
      formData.append('weight', weight);
      formData.append('dob', dob);
      formData.append('bmi', bmi !== null ? bmi : '');
      formData.append('child_count', (maritalStatus === 'Widow' || maritalStatus === 'Married') ? childrenCount : null);

      const newErrorMessages = {};

      if (!corporateForm.prefix || corporateForm.prefix === 'Select') {
        newErrorMessages.prefix = 'Prefix is required.';
      }

      if (!corporateForm.name) {
        newErrorMessages.name = 'Name is required.';
      }

      if (!corporateForm.blood_groups) {
        newErrorMessages.blood_groups = 'Blood Group is required.';
      }

      if (!corporateForm.employee_id) {
        newErrorMessages.employee_id = 'ID is required.';
      }

      if (!corporateForm.emp_mobile_no) {
        newErrorMessages.emp_mobile_no = 'Mobile Number is required.';
      }

      if (!dob) {
        newErrorMessages.dob = 'Date of Birth is required.';
      }

      if (!selectedStateId) {
        newErrorMessages.state = 'State is required.';
      }

      if (!selectedDistrictId) {
        newErrorMessages.district = 'District is required.';
      }

      if (!selectedTehsilId) {
        newErrorMessages.tehsil = 'Tehsil is required.';
      }

      if (!selectedNameId) {
        newErrorMessages.source_name = 'Source Name is required.';
      }

      if (!selectedDepartment) {
        newErrorMessages.department = 'Department is required.';
      }

      if (!selectedDesignation) {
        newErrorMessages.designation = 'Designation is required.';
      }

      if (Object.keys(newErrorMessages).length > 0) {
        setErrorMessages(newErrorMessages);
        return;
      }

      try {
        const response = await fetch(`${Port}/Screening/add_employee_post/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`
          },
          body: formData // Sending formData with all fields
        });

        if (response.status === 201) {
          navigate('/mainscreen/Citizen');
        } else if (response.status === 400) {
          alert('Error Submitting the Form');
        } else if (response.status === 409) {
          alert('Employee already exists with the given employee ID.');
        } else {
          alert('Unexpected error occurred.');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      console.log('Form submission cancelled.');
    }
  };

  ////// DOB Validation
  // const getMaxAllowedDate = () => {
  //   const currentDate = new Date();
  //   const maxAllowedDate = new Date();

  //   // Calculate 18 years before the current date
  //   maxAllowedDate.setFullYear(currentDate.getFullYear() - 18);

  //   return maxAllowedDate.toISOString().split('T')[0];
  // };

  // const getMinAllowedDate = () => {
  //   const currentDate = new Date();
  //   const minAllowedDate = new Date();

  //   // Calculate 99 years before the current date
  //   minAllowedDate.setFullYear(currentDate.getFullYear() - 99);

  //   // Format the minAllowedDate to be compatible with input[type='date']
  //   return minAllowedDate.toISOString().split('T')[0];
  // };

  const getMaxAllowedDate = (selectedAge) => {
    const currentDate = new Date();
    const maxAllowedDate = new Date();

    let maxAge;
    if (selectedAge === 5) {
      maxAge = selectedAge + 13;
    } else if (selectedAge === 6) {
      maxAge = selectedAge + 25;
    } else if (selectedAge === 7) {
      maxAge = selectedAge + 44;
    } else if (selectedAge === 8) {
      maxAge = selectedAge + 52;
    }

    // Calculate the maximum allowed date
    maxAllowedDate.setFullYear(currentDate.getFullYear() - maxAge);

    // Format the maxAllowedDate to be compatible with input[type='date']
    return maxAllowedDate.toISOString().split('T')[0];
  };

  const getMinAllowedDate = (selectedAge) => {
    const currentDate = new Date();
    const minAllowedDate = new Date();

    let minAge;
    if (selectedAge === 5) {
      minAge = selectedAge + 25;
    } else if (selectedAge === 6) {
      minAge = selectedAge + 44;
    } else if (selectedAge === 7) {
      minAge = selectedAge + 52;
    } else if (selectedAge === 8) {
      minAge = selectedAge + 91;
    }

    // Calculate the minimum allowed date
    minAllowedDate.setFullYear(currentDate.getFullYear() - minAge);

    // Format the minAllowedDate to be compatible with input[type='date']
    return minAllowedDate.toISOString().split('T')[0];
  };

  return (
    <div className="container ml-2">
      {/* <form onSubmit={handleSubmit}> */}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="row cardsetup">
          <div className="col-md-6">
            <div className="card card1corporate">
              <div className="row">
                <h5 className='employeetitle'>Employee Details</h5>
                <div className="elementemployee1"></div>
              </div>

              <div className="row formspaceemployee">
                <div className="col-md-2">
                  <label className="form-label corporatelabel">Prefix</label>
                  <select className="form-control corporateinput"
                    value={corporateForm.prefix}
                    onChange={handleChange}
                    name='prefix'
                  >
                    <option>Select</option>
                    <option value="Mr">Mr.</option>
                    <option value="Ms">Ms.</option>
                    <option value="Mrs">Mrs.</option>
                    <option value="Adv">Adv.</option>
                    <option value="Col">Col.</option>
                    <option value="Dr">Dr.</option>
                  </select>
                  {errorMessages.prefix && (
                    <label variant="caption" color="error" style={{ fontSize: '12px', color: 'red', fontWeight: 'normal' }}>
                      {errorMessages.prefix}
                    </label>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label corporatelabel">Employee Name</label>
                  <input className="form-control corporateinput" type="text"
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[0-9]/, '');
                    }}
                    name='name'
                    value={corporateForm.name}
                    onChange={handleChange}
                  />
                  {errorMessages.name && (
                    <label variant="caption" color="error" style={{ fontSize: '12px', color: 'red', fontWeight: 'normal' }}>
                      {errorMessages.name}
                    </label>
                  )}
                </div>

                <div className="col-md-4">
                  <label className="form-label corporatelabel">Blood Group</label>
                  <select className="form-control corporateinput"
                    value={corporateForm.blood_groups}
                    onChange={handleChange}
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
                  {errorMessages.blood_groups && (
                    <label variant="caption" color="error" style={{ fontSize: '12px', color: 'red', fontWeight: 'normal' }}>
                      {errorMessages.blood_groups}
                    </label>
                  )}
                </div>

                <div className="col-md-2">
                  <label className="form-label corporatelabel">EMP ID</label>
                  <input type="text" className="form-control corporateinput"
                    name='employee_id'
                    value={corporateForm.employee_id}
                    onChange={handleChange}
                  />
                  {errorMessages.employee_id && (
                    <label variant="caption" color="error" style={{ fontSize: '12px', color: 'red', fontWeight: 'normal' }}>
                      {errorMessages.employee_id}
                    </label>
                  )}
                </div>

                <div className="col-md-4">
                  <label className="form-label corporatelabel">Date of Birth</label>
                  <input
                    type="date"
                    className="form-control corporateinput"
                    onChange={handleDOBChange}
                    name="dob"
                    max={getMaxAllowedDate(selectedAge)}
                    min={getMinAllowedDate(selectedAge)}
                  />
                  {errorMessages.dob && (
                    <div className="error-message" style={{ fontSize: '12px', marginTop: '5px', color: 'red', fontWeight: 'normal' }}>{errorMessages.dob}</div>
                  )}
                </div>

                <div className="col-md-2">
                  <label className="form-label corporatelabel">Year</label>
                  <input className="form-control corporateinput" value={age.year} readOnly
                  />
                </div>

                <div className="col-md-2">
                  <label className="form-label corporatelabel">Month</label>
                  <input className="form-control corporateinput" value={age.months} readOnly />
                </div>

                <div className="col-md-2">
                  <label className="form-label corporatelabel">Days</label>
                  <input className="form-control corporateinput" value={age.days} readOnly />
                </div>

                <div className="col-md-4">
                  <label className="form-label corporatelabel">Aadhar ID</label>
                  <input type="number" className="form-control corporateinput"
                    name='aadhar_id'
                    value={corporateForm.aadhar_id}
                    onChange={handleChange}
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
                  <input type="email" className="form-control corporateinput"
                    name='email_id'
                    value={corporateForm.email_id}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label corporatelabel">Employee Mobile Number</label>
                  <input type="number" className="form-control corporateinput"
                    name='emp_mobile_no'
                    value={corporateForm.emp_mobile_no}
                    onChange={handleChange}
                    onInput={(e) => {
                      if (e.target.value < 0) {
                        e.target.value = 0;
                      }

                      if (e.target.value.length > 10) {
                        e.target.value = e.target.value.slice(0, 10);
                      }
                    }}
                  />
                  {errorMessages.emp_mobile_no && (
                    <label variant="caption" color="error" style={{ fontSize: '12px', color: 'red', fontWeight: 'normal' }}>
                      {errorMessages.emp_mobile_no}
                    </label>
                  )}
                </div>

                <div className="col-md-4">
                  <label className="form-label corporatelabel">Department</label>
                  <select className="form-control corporateinput" value={selectedDepartment} onChange={handleDepartmentChange}>
                    <option>Select</option>
                    {
                      department.map((dept) => (
                        <option key={dept.department_id} value={dept.department_id}>
                          {dept.department}
                        </option>
                      ))
                    }
                  </select>
                  {errorMessages.department && (
                    <label variant="caption" color="error" style={{ fontSize: '12px', color: 'red', fontWeight: 'normal' }}>
                      {errorMessages.department}
                    </label>
                  )}
                </div>

                <div className="col-md-4">
                  <label className="form-label corporatelabel">Designation</label>
                  <select className="form-control corporateinput" value={selectedDesignation} onChange={handleDesignationChange}>
                    <option>Select</option>
                    {
                      designation.map((design) => (
                        <option key={design.designation_id} value={design.designation_id}>
                          {design.designation}
                        </option>
                      ))
                    }
                  </select>
                  {errorMessages.designation && (
                    <label variant="caption" color="error" style={{ fontSize: '12px', color: 'red', fontWeight: 'normal' }}>
                      {errorMessages.designation}
                    </label>
                  )}
                </div>

                <div className="col-md-4">
                  <label className="form-label corporatelabel">Employee Photo</label>
                  <input type="file" className="form-control corporateinput"
                    name='photo'
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label corporatelabel">DOJ</label>
                  <input type="date" className="form-control corporateinput"
                    name='doj'
                    onChange={handleChange}
                  />
                  {errorMessages.doj && (
                    <label variant="caption" color="error" style={{ fontSize: '12px', color: 'red', fontWeight: 'normal' }}>
                      {errorMessages.doj}
                    </label>
                  )}
                </div>

                {/* <div className="col-md-4">
                  <label className="form-label corporatelabel">Photo</label>
                  {imageSrc ? (
                    <div>
                      <img src={imageSrc} alt="Captured" className="form-control corporateinput" style={{ height: '8em' }} />
                      <Button variant="contained" onClick={() => setImageSrc(null)}>
                        Retake Photo
                      </Button>
                    </div>
                  ) : (
                    <>
                      <IconButton onClick={handleOpen}>
                        <CameraAltIcon fontSize="large" />
                      </IconButton>
                    </>
                  )}

                  <Modal open={open} onClose={handleClose} aria-labelledby="modal-title" aria-describedby="modal-description">
                    <div style={modalStyle}>
                      {imageSrc ? (
                        <div>
                          <img src={imageSrc} alt="Captured" style={{ height: '8em', width: '100%' }} />
                          <Button variant="contained" onClick={handleClose}>
                            Save Photo
                          </Button>
                        </div>
                      ) : (
                        <>
                          <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" style={{ width: '100%' }} />
                          <Button variant="contained" onClick={capture}>
                            Capture Photo
                          </Button>
                        </>
                      )}
                    </div>
                  </Modal>
                </div> */}

                {/* <div className="col-md-4">
                  <label className="form-label corporatelabel">Employee Photo</label>
                  <input type="file" className="form-control corporateinput"
                    name='employee_id'
                    value={corporateForm.employee_id}
                    onChange={handleChange}
                  />
                </div> */}
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card card2corporate ml-3" style={{ height: '365px' }}>
              <div className="row">
                <h5 className='employeetitle'>Emergency Contact</h5>
                <div className="elementemployee2"></div>
              </div>

              {/* /////// Current Sheet Wise Changes Start ///// */}
              <div className="row formspaceemployee">
                <div className="col-md-3">
                  <label className="form-label corporatelabel">Prefix</label>
                  <select className="form-control corporateinput"
                    value={corporateForm.emergency_prefix}
                    onChange={handleChange}
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
                    value={corporateForm.emergency_fullname}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-3">
                  <label className="form-label corporatelabel">Gender</label>
                  <select className="form-control corporateinput"
                    value={corporateForm.emergency_gender}
                    onChange={handleChange}
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

                      if (e.target.value.length > 10) {
                        e.target.value = e.target.value.slice(0, 10);
                      }
                    }}
                    name='emergency_contact'
                    value={corporateForm.emergency_contact}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label corporatelabel">Email ID</label>
                  <input type="email" className="form-control corporateinput"
                    name='emergency_email'
                    value={corporateForm.emergency_email}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label corporatelabel">Relationship with Employee</label>
                  <select className="form-control corporateinput"
                    value={corporateForm.relationship_with_employee}
                    onChange={handleChange}
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
                    value={corporateForm.emergency_address}
                    onChange={handleChange}
                  />
                </div>
              </div>
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
                    value={heightValue}
                    onChange={handleHeightChange}
                    name='height'
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label corporatelabel">Weight</label>
                  <input type="number" className="form-control corporateinput"
                    value={weightValue}
                    onChange={handleWeightChange} name='weight'
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label corporatelabel">BMI</label>
                  <input type="text" className="form-control corporateinput" value={bmi} readOnly
                    style={{
                      backgroundColor:
                        bmi === null ? 'white' :
                          bmi < 18.5 ? 'orange' :
                            bmi < 25 ? 'green' :
                              bmi < 30 ? 'red' : 'darkred',
                      color:
                        bmi === null || bmi > 30 ? 'black' : 'white'
                    }}
                  />
                </div>

                {/* <div className="col-md-4">
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
                    value={corporateForm.arm_size}
                    onChange={handleChange}
                  />
                </div> */}

                <div className="col-md-8">
                  <label className="form-label corporatelabel">Symptoms if any</label>
                  <input type="text" className="form-control corporateinput"
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[0-9]/, '');
                    }}
                    name='symptoms'
                    value={corporateForm.symptoms}
                    onChange={handleChange}
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
                  <select className="form-control corporateinput" value={selectedStateId} onChange={handleStateChange}>
                    <option>Select State</option>
                    {sourceState.map((stateOption) => (
                      <option key={stateOption.source_state} value={stateOption.source_state}>
                        {stateOption.state_name}
                      </option>
                    ))}
                  </select>
                  {errorMessages.state && (
                    <label variant="caption" color="error" style={{ fontSize: '12px', color: 'red', fontWeight: 'normal' }}>
                      {errorMessages.state}
                    </label>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label corporatelabel">District</label>
                  <select className="form-control corporateinput" value={selectedDistrictId} onChange={handleDistrictChange}>
                    <option>Select District</option>
                    {district.map((districtOption) => (
                      <option key={districtOption.source_district} value={districtOption.source_district}>
                        {districtOption.dist_name}
                      </option>
                    ))}
                  </select>
                  {errorMessages.district && (
                    <label variant="caption" color="error" style={{ fontSize: '12px', color: 'red', fontWeight: 'normal' }}>
                      {errorMessages.district}
                    </label>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label corporatelabel">Tehsil</label>
                  <select className="form-control corporateinput" value={selectedTehsilId} onChange={handleTehsilChange}>
                    <option>Select Tehsil</option>
                    {tehsil.map((TehsilOption) => (
                      <option key={TehsilOption.source_taluka} value={TehsilOption.source_taluka}>
                        {TehsilOption.tahsil_name}
                      </option>
                    ))}
                  </select>
                  {errorMessages.district && (
                    <label variant="caption" color="error" style={{ fontSize: '12px', color: 'red', fontWeight: 'normal' }}>
                      {errorMessages.district}
                    </label>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label corporatelabel">Source Name</label>
                  <select className="form-control corporateinput" value={selectedNameId} onChange={handleSOurceNameChange}>
                    <option>Select Source Name</option>
                    {SourceName.map((NameOption) => (
                      <option key={NameOption.source_pk_id} value={NameOption.source_pk_id}>
                        {NameOption.source_names}
                      </option>
                    ))}
                  </select>
                  {errorMessages.source_name && (
                    <label variant="caption" color="error" style={{ fontSize: '12px', color: 'red', fontWeight: 'normal' }}>
                      {errorMessages.source_name}
                    </label>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label corporatelabel">Residential Address</label>
                  <input className="form-control corporateinput"
                    name='address'
                    value={corporateForm.address}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label corporatelabel">Permanent Address</label>
                  <input className="form-control corporateinput"
                    name='permanant_address'
                    value={corporateForm.permanant_address}
                    onChange={handleChange}
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
                    value={corporateForm.pincode}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label corporatelabel">Site Plant</label>
                  <input type="text" className="form-control corporateinput"
                    name='site_plant'
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row buttoncorporate">
          <button type="submit" className="corporatesubmit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default Corporate;
