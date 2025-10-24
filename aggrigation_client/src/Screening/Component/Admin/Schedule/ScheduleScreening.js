import React, { useState, useEffect } from 'react'
import './ScheduleScreening.css'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import axios from 'axios'
import SearchIcon from '@mui/icons-material/Search';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { Modal, Button } from 'react-bootstrap';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';
import CloseIcon from '@mui/icons-material/Close';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel, FormHelperText, Grid } from '@mui/material';

const ScheduleScreening = () => {
    // ------p---------
    const [canAddSchedule, setCanAddSchedule] = useState(false);

    useEffect(() => {
        const storedPermissions = localStorage.getItem('permissions');
        console.log('Stored Permissions:', storedPermissions);
        const parsedPermissions = storedPermissions ? JSON.parse(storedPermissions) : [];
        console.log('parsedPermissions Permissions:', parsedPermissions);
        // Check if the user has permission to download
        const hasAddSchedulePermission = parsedPermissions.some((p) =>
            p.modules_submodule.some(
                (m) =>
                    m.moduleName === 'Schedule Screening' &&
                    m.selectedSubmodules.some((s) => s.submoduleName === 'Add')
            )
        );
        // console.log(hasDownloadPermission,'kkkkkkkkk');
        setCanAddSchedule(hasAddSchedulePermission);
    }, []);
    // ep-----------

    //// access the source from local storage
    const SourceUrlId = localStorage.getItem('loginSource');

    //// access the source name from local storage
    const SourceNameUrlId = localStorage.getItem('SourceNameFetched');
    const userID = localStorage.getItem('userID');
    console.log(userID);
    const accessToken = localStorage.getItem('token');
    const Port = process.env.REACT_APP_API_KEY;
    const [showModal, setShowModal] = useState(false); /////// model 
    const [showModalExist, setShowModalExist] = useState(false); /////// model missing
    const [showModalMissing, setShowModalMissing] = useState(false); /////// model 

    ////////////////// Progress bar /////////////////////
    const [active, setActive] = useState('date');  // today filter
    /////////// Navbar API
    const [selectedSourceNav, setSelectedSourceNav] = useState('')
    const [selectedTypeNav, setSelectedTypeNav] = useState('')
    const [selectedClassNav, setSelectedClassNav] = useState('')
    const [selectedDiseaseNav, setSelectedDiseaseNav] = useState('')
    const [selectedDepartmentNav, setSelectedDepartmentNav] = useState('')

    console.log(selectedTypeNav);

    const [screeningForNav, setScreeningForNav] = useState([]);

    //////////// DROPDOWN FILTER ////////////////

    /// State District Tehsil
    const State = localStorage.getItem('StateLogin');
    const District = localStorage.getItem('DistrictLogin');
    const Tehsil = localStorage.getItem('TehsilLogin');

    const [diseaseOption, setDiseaseOption] = useState([])
    //////////////// form state district tehsil and source name useState
    const [sourceOption, setSourceOption] = useState([]);
    // const [selectedSourcee, setSelectedSourcee] = useState(SourceUrlId || '');
    const [selectedSourcee, setSelectedSourcee] = useState('6');

    const [stateOptions, setStateOptions] = useState([]);
    const [selectedState, setSelectedState] = useState('')

    const [districtOptions, setDistrictOptions] = useState([]);
    const [selectedDistrict, setSelectedDistrict] = useState('')

    const [talukaOptions, setTalukaOptions] = useState([])
    const [selectedTaluka, setSelectedTaluka] = useState('')

    const [sourceNameOptions, setSourceName] = useState([])
    const [selectedName, setSelectedName] = useState('')

    const [selectedDisease, setSelectedDisease] = useState(""); // State for selected tehsil

    ////////////////  Form Disable ////////////////
    const [isFormEnabled, setFormEnabled] = useState(false);
    const [isFormVisible, setIsFormVisible] = useState(false);

    //**********************************************************************************************************
    const [screeningFor, setScreeningFor] = useState([]);
    const [selectedScheduleType, setSelectedScheduleType] = useState('');
    const [selectedClass, setSelectedClass] = useState('');

    //_____________________________________VITALS API OF DROPDOWN START_______________________________
    const [screeningVitals, setScreeningVitals] = useState([]);
    const [selectedVitals, setSelectedVitals] = useState([]);
    const [subScreening, setSubScreening] = useState([]);

    const [selectedSubVitals, setSelectedSubVitals] = useState([]);
    const [selectedVitalId, setSelectedVitalId] = useState(null);

    useEffect(() => {
        const fetchScreeningVitals = async () => {
            try {
                const response = await axios.get(
                    `${Port}/Screening/screening_vitals/?source=${SourceUrlId}&source_pk_id=${SourceNameUrlId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );

                // Log the entire response object
                console.log('API Response:', response);

                // Log the response data specifically
                console.log('Response Data:', response.data);

                // const data = response.data;
                // setScreeningVitals(data[0].screening_list);

                //__________________CHECKBOX
                const data = response.data;
                const vitalsList = data[0].screening_list;

                // Set both screeningVitals and selectedVitals
                setScreeningVitals(vitalsList);
                setSelectedVitals(vitalsList.map(vital => vital.sc_list_pk_id));
            } catch (error) {
                console.error('Error fetching screening vitals:', error);
            }
        };

        fetchScreeningVitals();
    }, [SourceUrlId]);

    // Handling the change in selected vitals
    useEffect(() => {
        if (selectedVitals.includes(5)) {
            const selectedVital = screeningVitals.find(vital => vital.sc_list_pk_id === 5);
            if (selectedVital) {
                setSelectedVitalId(selectedVital.sc_list_pk_id);
            } else {
                setSelectedVitalId(null);
            }
        } else {
            setSelectedVitalId(null);
        }
    }, [selectedVitals, screeningVitals]);

    useEffect(() => {
        const fetchSubVitals = async () => {
            if (selectedVitalId === 5) {
                try {
                    const response = await axios.get(`${Port}/Screening/screening_sub_vitals/?source=${SourceUrlId}&source_pk_id=${SourceNameUrlId}`, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    });
                    // const data = response.data[0]; // Assuming the response is an array with one object
                    // console.log('Fetching Sub Vitals....', data);
                    // setSubScreening(data.sub_list); // Set the sub_list to state
                    const data = response.data[0]; // Assuming the response is an array with one object

                    //____________________CHECKBOX 
                    console.log('Fetching Sub Vitals....', data);

                    // Set both subScreening and selectedSubVitals
                    setSubScreening(data.sub_list);
                    setSelectedSubVitals(data.sub_list.map(sub => sub.sc_sub_list_pk_id));
                } catch (error) {
                    console.error('Error fetching screening sub-vitals:', error);
                }
            } else {
                setSubScreening([]); // Clear subScreening if selectedVitalId is not 5
            }
        };

        fetchSubVitals();
    }, [selectedVitalId]);

    //_____________________________________VITALS API OF DROPDOWN END_______________________________

    ////// Form class and Division
    const [classList, setClassList] = useState([]); //// class API

    // Function to handle page change
    const [loading, setLoading] = useState(true)
    const [tableinfo, setTableInfo] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selectedRow, setSelectedRow] = useState(null);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const [scheduleform, setScheduleform] = useState({
        from_date: "",
        to_date: "",
        source_name: "",
        screening_person_name: "",
        mobile_number: "",
        added_by: userID,
        modify_by: userID,
        schedule_screening_pk_id: '',

        schedule_source_id: '',
        schedule_state_id: '',
        schedule_district_id: '',
        schedule_tehsil_id: '',
        schedule_sourcename_id: '',
        schedule_type_id: '',
        schedule_class_id: '',
        schedule_disease_id: '',
        screening_vitals: '',
        sub_screening_vitals: '',
    });

    const handleDelete = async () => {
        const confirmDelete = window.confirm('Are you sure you want to delete this data?');

        if (!confirmDelete) {
            // User clicked Cancel, do nothing
            return;
        }

        console.log('Received sourceId:', scheduleform.schedule_screening_pk_id);

        const userID = localStorage.getItem('userID');
        console.log(userID);

        try {
            await axios.delete(`${Port}/Screening/close_schedule_screening/${scheduleform.schedule_screening_pk_id}/${userID}/`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log('Data Deleted successfully');

            console.log('Before delete:', tableinfo);

            setTableInfo(prevTableInfo =>
                prevTableInfo.filter(item => item.schedule_screening_pk_id !== scheduleform.schedule_screening_pk_id)
            );

            console.log('After delete:', tableinfo);

        } catch (error) {
            console.error('Error deleting data:', error);
        }
    };

    const [errors, setErrors] = useState({
        from_date: "",
        to_date: "",
        source: "",
        source_name: "",
        state: "",
        district: "",
        Disease: "",
        screening_person_name: "",
        mobile_number: "",
        screening_for: "",
        // division: ""
    });

    const validateForm = () => {
        const newErrors = {};

        if (!scheduleform.source) {
            newErrors.source = 'Source is required';
        }

        if (!scheduleform.mobile_number) {
            newErrors.mobile_number = 'Mobile Number is required';
        }

        if (!scheduleform.from_date) {
            newErrors.from_date = 'From Date is required';
        }

        if (!scheduleform.to_date) {
            newErrors.to_date = 'To Date is required';
        }

        // if (!scheduleform.source_name) {
        //     newErrors.source_name = 'Source Name is required';
        // }

        // if (!scheduleform.source_state) {
        //     newErrors.source_state = 'Source State is required';
        // }

        // if (!scheduleform.source_district) {
        //     newErrors.source_district = 'Source District is required';
        // }

        // if (!scheduleform.source_taluka) {
        //     newErrors.source_taluka = 'Source Tehsil is required';
        // }

        // if (!scheduleform.source_name) {
        //     newErrors.source_name = 'Source Name is required';
        // }

        // if (!scheduleform.district) {
        //     newErrors.district = 'District is required';
        // }

        // if (!scheduleform.source_name) {
        //     newErrors.source_name = 'Source name is required';
        // }

        if (!scheduleform.screening_person_name) {
            newErrors.screening_person_name = 'Person Name is required';
        }

        if (!scheduleform.screening_for) {
            newErrors.screening_for = 'Screening For Required'
        }

        if (!scheduleform.type) {
            newErrors.type = 'Screening For is required';
        }

        // if (scheduleform.type === '1' && !scheduleform.Class) {
        //     newErrors.Class = 'Class is required';
        // }

        if (!updateSrc) {
            // Add validation for additional fields during update
            if (!scheduleform.district) {
                newErrors.district = 'District is required';
            }

            if (!scheduleform.source_name) {
                newErrors.source_name = 'Source name is required';
            }

            if (!scheduleform.tehsil) {
                newErrors.tehsil = 'Source Tehsil is required';
            }

            if (!scheduleform.state) {
                newErrors.state = 'Source State is required';
            }

            // Add more validations here if needed
        }

        setErrors(newErrors);
        return true;
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        if (name === 'screening_vitals') {
            setSelectedVitals(event.target.value);
        }
        // if (name === 'sub_screening_vitals') {
        //     setSelectedSubVitals(event.target.value);
        // }
        if (name === 'sub_screening_vitals') {
            const generalExaminationId = 1; // Replace with the actual ID for "General Examination"

            // Ensure "General Examination" is always included
            if (value.indexOf(generalExaminationId) === -1) {
                // Add "General Examination" ID if it's not selected
                setSelectedSubVitals([generalExaminationId, ...value]);
            } else {
                // Set the selected values directly if "General Examination" is already selected
                setSelectedSubVitals(value);
            }
        }
        else {
            setScheduleform(prevState => ({
                ...prevState,
                [name]: value,
            }));

            if (name === 'source') {
                setSelectedSourcee(value);
            } else if (name === 'source_state') {
                setSelectedState(value);
            } else if (name === 'source_district') {
                setSelectedDistrict(value);
            } else if (name === 'source_taluka') {
                setSelectedTaluka(value);
            } else if (name === 'source_name') {
                setSelectedName(value);
            } else if (name === 'Disease') {
                setSelectedDisease(value);
            } else if (name === 'type') {
                setSelectedScheduleType(value);
            } else if (name === 'Class') {
                setSelectedClass(value);
            } else if (name === 'department') {
                setSelectedDepartment(value);
            }

            setErrors(prevErrors => ({
                ...prevErrors,
                [name]: '',
            }));
        }
    };

    const resetForm = () => {
        setScheduleform({
            from_date: "",
            to_date: "",
            source_name: "",
            screening_person_name: "",
            mobile_number: "",
            source: "", // Add the reset for source field
            source_state: "", // Add the reset for source_state field
            source_district: "", // Add the reset for source_district field
            source_taluka: "", // Add the reset for source_taluka field
            Disease: "",
            type: "",
            class: "",
        });

        setSelectedName("");
        setSelectedDisease("");
        setSelectedTaluka("");
        setSelectedScheduleType("");
    };

    const handleTableRowClick = async (info) => {
        const scheduleId = info.schedule_screening_pk_id;
        if (scheduleId !== '') {
            try {
                const response = await fetch(`${Port}/Screening/add_schedule_screening_GET_ID/${scheduleId}/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                });
                console.log('fetched table API', response);
                const data = await response.json();

                console.log('Fetched Data:', data);

                setScheduleform((prevState) => ({
                    ...prevState,
                    from_date: data.from_date,
                    to_date: data.to_date,
                    screening_vitals: data.screening_vitals,
                    sub_screening_vitals: data.sub_screening_vitals,
                    screening_person_name: data.screening_person_name,
                    mobile_number: data.mobile_number,

                    schedule_source_id: data.source,
                    source: data.source_id,

                    schedule_state_id: data.state,
                    state: data.state_id,

                    schedule_district_id: data.district,
                    district: data.district_id,

                    schedule_tehsil_id: data.tehsil,
                    tehsil: data.tehsil_id,

                    schedule_sourcename_id: data.source_name,
                    source_name: data.source_name_id,

                    schedule_type_id: data.type,
                    type: data.type_id,

                    schedule_class_id: data.Class,
                    Class: data.class_id,

                    schedule_disease_id: data.Disease,
                    Disease: data.disease_id,

                    // source: data.source,
                    // state: data.state,
                    // district: data.district,
                    // tehsil: data.tehsil,
                    // source_name: data.source_name,
                    // Disease: data.Disease,
                    // type: data.type,
                    // Class: data.Class,
                    schedule_screening_pk_id: data.schedule_screening_pk_id
                }));
                setSelectedVitals(data.screening_vitals);
                setSelectedSubVitals(data.sub_screening_vitals || []);
                // setSelectedSourcee(data.source); // Update the selected source state
            } catch (error) {
                console.error('Error fetching detailed information:', error);
            }
            setSelectedRow(info.schedule_screening_pk_id);
        }
    };

    //////////////// table API ///////////////////
    const fetchTableData = async () => {
        try {
            const accessToken = localStorage.getItem('token'); // Retrieve access token
            const response = await axios.get(`${Port}/Screening/add_schedule_screening_GET/?source_id=${SourceUrlId}&source_name_id=${SourceNameUrlId}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            setTableInfo(response.data);
            setLoading(false);
        } catch (error) {
            console.log('Error while fetching data', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTableData();
    }, []);

    const [updateSrc, setUpdateSrc] = useState(true); /////////// update user form

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isValid = validateForm();
        if (isValid) {
            const formData = {
                ...scheduleform,
                source: selectedSourcee,
                state: selectedState,
                district: selectedDistrict,
                tehsil: selectedTaluka,
                source_name: selectedName,
                Disease: selectedDisease,
                type: selectedScheduleType,
                class: selectedClass,
                added_by: userID,
                modify_by: userID,
                department: selectedDepartment,
                screening_vitals: selectedVitals,
                sub_screening_vitals: selectedSubVitals,
            };

            const formData1 = {
                ...scheduleform,
                screening_vitals: selectedVitals,
                sub_screening_vitals: selectedSubVitals,
            };

            console.log('FormData:', formData);

            try {
                const accessToken = localStorage.getItem('token'); // Retrieve access token
                if (updateSrc) {
                    const response = await fetch(`${Port}/Screening/add_schedule_screening_POST/`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(formData),
                    });
                    if (response.status === 201) {
                        const data = await response.json();
                        setShowModal(true);
                        setTableInfo([...tableinfo, data]);
                        console.log('Data sent successfully:', data);
                        resetForm()
                    }
                    else if (response.status === 400) {
                        setShowModalMissing(true);
                    }
                    else if (response.status === 409) {
                        setShowModalExist(true);
                    }
                }
                else {
                    formData.modify_by = userID;
                    const response = await fetch(`${Port}/Screening/add_schedule_screening_PUT/${selectedRow}/`, {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(formData1),
                    });

                    if (response.status === 200) {
                        console.log('Updated successfully:', response);
                        alert("Form Updated Succeessfully")
                        fetchTableData(); // Fetch updated table data
                    } else {
                        console.error('Error updating user. Unexpected response:', response);
                    }
                }
            } catch (error) {
                console.error('Error sending data:', error);

                if (error.response) {
                    console.error('Response data:', error.response.data);
                    console.error('Response status:', error.response.status);
                    console.error('Response headers:', error.response.headers);
                } else if (error.request) {
                    console.error('No response received:', error.request);
                } else {
                    console.error('Error setting up the request:', error.message);
                }
            }
        }
        else {
            console.log('Form has errors, please correct them.');
        }
    };

    ////////////// modal
    const handleCloseModal = () => {
        setShowModal(false);
    };

    ////////////// modal  missing
    const handleMissing = () => {
        setShowModalMissing(false);
    };

    ////////////// modal  Exist
    const handleExist = () => {
        setShowModalExist(false);
    };

    ////////////////////////// Form value dropdown get ///////////////////////////////
    useEffect(() => {
        const fetchSourceOptions = async () => {
            try {
                const response = await axios.get(`${Port}/Screening/Source_Get/?source_pk_id=${SourceUrlId}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                });
                setSourceOption(response.data);
            } catch (error) {
                console.error('Error fetching sources:', error);
            }
        };

        fetchSourceOptions();
    }, []);

    //// Soure State against selected source
    useEffect(() => {
        if (selectedSourcee) {
            axios.get(`${Port}/Screening/source_and_pass_state_Get/${selectedSourcee}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    setStateOptions(response.data);
                })
                .catch(error => {
                    console.log('Error while fetching state data:', error);
                });
        }
    }, [selectedSourcee]);

    //// Soure District against selected source state
    useEffect(() => {
        if (selectedState) {
            axios.get(`${Port}/Screening/state_and_pass_district_Get/${selectedSourcee}/${selectedState}/`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    setDistrictOptions(response.data);
                })
                .catch(error => {
                    console.error("Error fetching districts against state data:", error);
                });
        }
    }, [selectedState]);

    //// Soure Taluka against selected source district
    useEffect(() => {
        if (selectedDistrict) {
            axios.get(`${Port}/Screening/district_and_pass_taluka_Get/${selectedSourcee}/${selectedDistrict}/`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    setTalukaOptions(response.data);
                })
                .catch(error => {
                    console.error("Error fetching taluka data:", error);
                });
        }
    }, [selectedDistrict]);

    //// Soure Name against selected source Taluka
    useEffect(() => {
        if (selectedTaluka) {
            // axios.get(`${Port}/Screening/taluka_and_pass_SourceName_Get/${selectedSourcee}/${selectedTaluka}/`, {
            axios.get(`${Port}/Screening/taluka_and_pass_SourceName_Get/?SNid=${selectedTaluka}&So=${selectedSourcee}&source_pk_id=${SourceNameUrlId}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    setSourceName(response.data);
                })
                .catch(error => {
                    console.error("Error fetching Source Name against Taluka data:", error);
                });
        }
    }, [selectedTaluka]);

    ////// disease ///////
    useEffect(() => {
        const fetchDisease = async () => {
            try {
                const response = await axios.get(`${Port}/Screening/child_disease_info_get/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                })
                const options = response.data
                setDiseaseOption(options)
            }
            catch (error) {
                console.log('Error While Fetching Data', error)
            }
        }
        fetchDisease()
    }, [])

    ////// Screening For ///////
    useEffect(() => {
        if (selectedSourcee) {
            axios.get(`${Port}/Screening/screening_for_type_get/${selectedSourcee}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    setScreeningFor(response.data);
                })
                .catch(error => {
                    console.error("Error fetching data:", error);
                });
        }
    }, [selectedSourcee]);

    ///// Screening Type Nav 
    useEffect(() => {
        if (selectedSourceNav) {
            axios.get(`${Port}/Screening/screening_for_type_get/${selectedSourceNav}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
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

    const handleClick = () => {
        setIsFormVisible(!isFormVisible);
        setFormEnabled(true);
    }

    const [searchQuery, setSearchQuery] = useState('');
    ///////////////////// per page ///////////////////

    /////// Class GET API 
    useEffect(() => {
        const fetchClass = async () => {
            try {
                const response = await axios.get(`${Port}/Screening/get_class/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                })
                setClassList(response.data)
            }
            catch (error) {
                console.log(error, 'Error fetching Class');
            }
        }
        fetchClass()
    }, [])

    ////////// department 
    const [department, setDepartmenet] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('')

    useEffect(() => {
        const fetchDepartment = async () => {
            try {
                const response = await axios.get(`${Port}/Screening/get_department/${SourceUrlId}/${SourceNameUrlId}/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                })
                setDepartmenet(response.data)
            }
            catch (error) {
                console.log(error, 'Error fetching Class');
            }
        }
        fetchDepartment()
    }, [])

    const handleSearch = async () => {
        let apiUrl = `${Port}/Screening/filter-Schedule/?`;

        if (selectedSourceNav) {
            apiUrl += `source=${selectedSourceNav}&`;
        }

        if (selectedTypeNav) {
            apiUrl += `type=${selectedTypeNav}&`;
        }

        if (selectedClassNav) {
            apiUrl += `Class=${selectedClassNav}&`;
        }

        if (selectedDiseaseNav) {
            apiUrl += `disease=${selectedDiseaseNav}&`;
        }

        try {
            const accessToken = localStorage.getItem('token');
            const response = await axios.get(apiUrl, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            setTableInfo(response.data);
            console.log(response.data);
        } catch (error) {
            console.log('Error while fetching data', error);
        }
    };

    return (
        <div>
            {/* <div class="content-wrapper backgroundschedule">
                <div class="content-header">
                    <div class="container-fluid">
                        <div className="card Schedulecard">
                            <div class="row">
                                <div class="col">
                                    <h5 className='Schedulelisttitle'>Screening Schedule List</h5>
                                </div>
                            </div>

                            <div className="row ml-3 mt-1 pb-3">
                                <Box>
                                    <div class="container text-center">
                                        <div class="row">
                                            <div class="col" style={{ color: 'white' }}>
                                                <TextField
                                                    select
                                                    className="schedulecutsomfield"
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

                                            <div class="col" style={{ color: 'white' }}>
                                                <TextField
                                                    select
                                                    className="schedulecutsomfield"
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

                                            {
                                                selectedTypeNav === 1 && (
                                                    <div class="col" style={{ color: 'white' }}>
                                                        <TextField
                                                            select
                                                            className="schedulecutsomfield"
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
                                                )
                                            }

                                            {
                                                selectedTypeNav === 3 && (
                                                    <div class="col" style={{ color: 'white' }}>
                                                        <TextField
                                                            select
                                                            className="schedulecutsomfield"
                                                            size="small"
                                                            label="Department"
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
                                                            value={selectedDepartmentNav}
                                                            onChange={(e) => setSelectedDepartmentNav(e.target.value)}
                                                        >
                                                            <MenuItem value="">Select Class</MenuItem>
                                                            {department.map((drop) => (
                                                                <MenuItem key={drop.department_id} value={drop.department_id}>
                                                                    {drop.department}
                                                                </MenuItem>
                                                            ))}

                                                        </TextField>
                                                    </div>
                                                )
                                            }

                                            <div class="col" style={{ color: 'white' }}>
                                                <TextField
                                                    select
                                                    className="schedulecutsomfield"
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
                                                                paper: 'custom-menu-paper',
                                                            },
                                                        },
                                                    }}
                                                    value={selectedDiseaseNav}
                                                    onChange={(e) => setSelectedDiseaseNav(e.target.value)}
                                                >
                                                    <MenuItem value="">Select Disease</MenuItem>
                                                    {diseaseOption.map(drop => (
                                                        <MenuItem key={drop.disease_id} value={drop.disease_id}>
                                                            {drop.disease}
                                                        </MenuItem>
                                                    ))}
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
            </div> */}

            <div class="content-wrapper formsection mt-3">
                <div class="content-header">
                    <div className="row pb-3">
                        <div className="col-md-5 scheduleform">
                            <div className={`card scheduleform`}>
                                <div className="row">
                                    <h6 className='title1 p-1'
                                     style={{backgroundColor:'#313774',color:'#fff',borderRadius:'5px'}}
                                     >
                                        Schedule Screening Details
                                    </h6>
                                    {/* <div class="elementschedule"></div> */}

                                    {/* <div className="ml-auto mr-3">
                                        <DriveFileRenameOutlineOutlinedIcon
                                            className={`editiconschedule mr-2 ${updateSrc ? '' : 'disabled-icon'}`}
                                            onClick={() => {
                                                setUpdateSrc(false);
                                                setFormEnabled(true);
                                            }}
                                        />
                                        <DeleteOutlineOutlinedIcon className={`deleteiconnschedule`}
                                            onClick={() => {
                                                handleDelete();
                                            }}
                                        />
                                    </div> */}
                                </div>

                                <form onSubmit={handleSubmit}>
                                    <div className={`row m-1`}>
                                        <div className={`col-md-6 ${isFormEnabled ? '' : 'disabled'}`}>
                                            <label className={`visually-hidden formlabel1 ${isFormEnabled ? '' : 'disabled'}`} >
                                                From Date<span className="text-danger">*</span>
                                            </label>
                                            <input type="date" name="from_date"
                                                className={`form-control filedssss ${errors.from_date ? 'is-invalid' : ''}`}
                                                value={scheduleform.from_date} onChange={handleChange}
                                                disabled={!isFormEnabled}
                                                min={new Date().toISOString().split('T')[0]} />
                                            {errors.from_date && <div className="invalid-feedback">{errors.from_date}</div>}
                                        </div>

                                        <div className={`col-md-6 ${isFormEnabled ? '' : 'disabled'}`}>
                                            <label className={`visually-hidden formlabel ${isFormEnabled ? '' : 'disabled'}`} id="newcal">
                                                To Date<span className="text-danger">*</span>
                                            </label>
                                            <input type="date" className={`form-control filedssss ${errors.to_date ? 'is-invalid' : ''}`}
                                                name="to_date"
                                                value={scheduleform.to_date}
                                                onChange={handleChange}
                                                disabled={!isFormEnabled}
                                                min={scheduleform.from_date}
                                            />
                                            {errors.to_date && <div className="invalid-feedback">{errors.to_date}</div>}
                                        </div>

                                        {/* <div className={`col-md-6 ${isFormEnabled ? '' : 'disabled'}`}>
                                            <label htmlFor="select" className={`visually-hidden formlabel ${isFormEnabled ? '' : 'disabled'}`} id="newcal">
                                                Source<span className="text-danger">*</span>
                                            </label>
                                            <select
                                                as="select"
                                                className={`form-control filedssss ${errors.source ? 'is-invalid' : ''}`}
                                                name="source"
                                                id="outlined-select"
                                                disabled={!isFormEnabled}
                                                onChange={handleChange}
                                                // value={scheduleform.source}
                                                value={selectedSourcee}
                                            >
                                                <option value="">{scheduleform.schedule_source_id ? scheduleform.schedule_source_id : 'Select Source'}</option>
                                                {sourceOption.map((source) => (
                                                    <option key={source.source_pk_id} value={source.source_pk_id}>
                                                        {source.source}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.source && <div className="invalid-feedback">{errors.source}</div>}
                                        </div> */}

                                        <div className={`col-md-6 ${isFormEnabled ? '' : 'disabled'}`}>
                                            <label htmlFor="select" className={`visually-hidden formlabel ${isFormEnabled ? '' : 'disabled'}`} id="newcal">
                                                Source State<span className="text-danger">*</span>
                                            </label>
                                            <select
                                                as="select"
                                                className={`form-control filedssss ${errors.source_state ? 'is-invalid' : ''}`}
                                                name="source_state"
                                                id="outlined-select"
                                                disabled={!isFormEnabled}
                                                onChange={handleChange}
                                                // value={scheduleform.source_state}
                                                value={selectedState}
                                            >
                                                <option value="">{scheduleform.schedule_state_id ? scheduleform.schedule_state_id : 'Select State'}</option>
                                                {stateOptions.map((state) => (
                                                    <option key={state.source_state} value={state.source_state}>
                                                        {state.state_name}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.source_state && <div className="invalid-feedback">{errors.source_state}</div>}
                                        </div>

                                        <div className={`col-md-6 ${isFormEnabled ? '' : 'disabled'}`}>
                                            <label htmlFor="select" className={`visually-hidden formlabel ${isFormEnabled ? '' : 'disabled'}`} id="newcal">
                                                Source District<span className="text-danger">*</span>
                                            </label>
                                            <select
                                                as='select'
                                                className={`form-control filedssss ${errors.source_district ? 'is-invalid' : ''}`}
                                                name='source_district'
                                                id='outlined-select'
                                                disabled={!isFormEnabled}
                                                onChange={handleChange}
                                                // value={scheduleform.source_district}
                                                value={selectedDistrict}
                                            >
                                                <option value="">{scheduleform.schedule_district_id ? scheduleform.schedule_district_id : 'Select District'}</option>
                                                {districtOptions.map((district) => (
                                                    <option key={district.source_district} value={district.source_district}>
                                                        {district.dist_name}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.source_district && <div className="invalid-feedback">{errors.source_district}</div>}
                                        </div>

                                        <div className={`col-md-6 ${isFormEnabled ? '' : 'disabled'}`}>
                                            <label htmlFor="select" className={`visually-hidden formlabel ${isFormEnabled ? '' : 'disabled'}`} id="newcal">
                                                Source Block<span className="text-danger">*</span>
                                            </label>
                                            <select
                                                as='select'
                                                className={`form-control filedssss ${errors.source_taluka ? 'is-invalid' : ''}`}
                                                name='source_taluka'
                                                id='outlined-select'
                                                disabled={!isFormEnabled}
                                                onChange={handleChange}
                                                // value={scheduleform.source_taluka}
                                                value={selectedTaluka}
                                            >
                                                <option value="">{scheduleform.schedule_tehsil_id ? scheduleform.schedule_tehsil_id : 'Select Block'}</option>
                                                {talukaOptions.map((taluka) => (
                                                    <option key={taluka.source_taluka} value={taluka.source_taluka}>
                                                        {taluka.tahsil_name}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.source_taluka && <div className="invalid-feedback">{errors.source_taluka}</div>}
                                        </div>

                                        <div className={`col-md-6 ${isFormEnabled ? '' : 'disabled'}`}>
                                            <label htmlFor="select" className={`visually-hidden formlabel ${isFormEnabled ? '' : 'disabled'}`} id="newcal">
                                                Institution Name<span className="text-danger">*</span>
                                            </label>
                                            <select
                                                as='select'
                                                className={`form-control filedssss ${errors.source_name ? 'is-invalid' : ''}`}
                                                name='source_name'
                                                id='outlined-select'
                                                disabled={!isFormEnabled}
                                                onChange={handleChange}
                                                value={scheduleform.source_name}
                                            >
                                                <option value="">{scheduleform.schedule_sourcename_id ? scheduleform.schedule_sourcename_id : 'Select Institution Name'}</option>
                                                {sourceNameOptions.map((source) => (
                                                    <option key={source.source_pk_id} value={source.source_pk_id}>
                                                        {source.source_names}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.source_name && <div className="invalid-feedback">{errors.source_name}</div>}
                                        </div>

                                        {/* <div className={`col-md-6 ${isFormEnabled ? '' : 'disabled'}`}>
                                            <label htmlFor="select" className={`visually-hidden formlabel ${isFormEnabled ? '' : 'disabled'}`} id="newcal">
                                                Disease
                                            </label>
                                            <select
                                                as='select'
                                                className='form-control filedssss'
                                                name='Disease'
                                                id='outlined-select'
                                                disabled={!isFormEnabled}
                                                onChange={handleChange}
                                                value={selectedDisease}
                                            >
                                                <option value="">{scheduleform.schedule_disease_id ? scheduleform.schedule_disease_id : 'Select Disease'}</option>
                                                {diseaseOption.map((option) => (
                                                    <option key={option.disease_id} value={option.disease}>
                                                        {option.disease}
                                                    </option>
                                                ))}
                                            </select>
                                        </div> */}

                                        {/* <div className={`col-md-6 ${isFormEnabled ? '' : 'disabled'}`}>
                                            <label htmlFor="text" className={`visually-hidden formlabel ${isFormEnabled ? '' : 'disabled'}`} id="newcal">
                                                Screening Person Name<span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className={`form-control filedssss ${errors.screening_person_name ? 'is-invalid' : ''}`}
                                                id="screening_person_name"
                                                name="screening_person_name"
                                                value={scheduleform.screening_person_name}
                                                onChange={handleChange}
                                                placeholder="Enter Name"
                                                disabled={!isFormEnabled}
                                            />
                                            {errors.screening_person_name && <div className="invalid-feedback">{errors.screening_person_name}</div>}
                                        </div> */}

                                        <div className={`col-md-6 ${isFormEnabled ? '' : 'disabled'}`}>
                                            <label htmlFor="select" className={`visually-hidden formlabel ${isFormEnabled ? '' : 'disabled'}`} id="newcal">
                                                Location Name<span className="text-danger">*</span>
                                            </label>
                                            <select
                                                as='select'
                                                className={`form-control filedssss ${errors.source_name ? 'is-invalid' : ''}`}
                                                name='source_name'
                                                id='outlined-select'
                                                disabled={!isFormEnabled}
                                                onChange={handleChange}
                                                value={scheduleform.source_name}
                                            >
                                                <option value="">{scheduleform.schedule_sourcename_id ? scheduleform.schedule_sourcename_id : 'Select Location Name'}</option>
                                                {sourceNameOptions.map((source) => (
                                                    <option key={source.source_pk_id} value={source.source_pk_id}>
                                                        {source.source_names}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.source_name && <div className="invalid-feedback">{errors.source_name}</div>}
                                        </div>
                                         <div className={`col-md-6 ${isFormEnabled ? '' : 'disabled'}`}>
                                            <label htmlFor="select" className={`visually-hidden formlabel ${isFormEnabled ? '' : 'disabled'}`} id="newcal">
                                                Route<span className="text-danger">*</span>
                                            </label>
                                            <select
                                                as='select'
                                                className={`form-control filedssss ${errors.source_name ? 'is-invalid' : ''}`}
                                                name='source_name'
                                                id='outlined-select'
                                                disabled={!isFormEnabled}
                                                onChange={handleChange}
                                                value={scheduleform.source_name}
                                            >
                                                <option value="">{scheduleform.schedule_sourcename_id ? scheduleform.schedule_sourcename_id : 'Select Route'}</option>
                                                {sourceNameOptions.map((source) => (
                                                    <option key={source.source_pk_id} value={source.source_pk_id}>
                                                        {source.source_names}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.source_name && <div className="invalid-feedback">{errors.source_name}</div>}
                                        </div>
                                         <div className={`col-md-6 ${isFormEnabled ? '' : 'disabled'}`}>
                                            <label htmlFor="select" className={`visually-hidden formlabel ${isFormEnabled ? '' : 'disabled'}`} id="newcal">
                                                Ambulance No.<span className="text-danger">*</span>
                                            </label>
                                            <select
                                                as='select'
                                                className={`form-control filedssss ${errors.source_name ? 'is-invalid' : ''}`}
                                                name='source_name'
                                                id='outlined-select'
                                                disabled={!isFormEnabled}
                                                onChange={handleChange}
                                                value={scheduleform.source_name}
                                            >
                                                <option value="">{scheduleform.schedule_sourcename_id ? scheduleform.schedule_sourcename_id : 'Select Ambulance No.'}</option>
                                                {sourceNameOptions.map((source) => (
                                                    <option key={source.source_pk_id} value={source.source_pk_id}>
                                                        {source.source_names}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.source_name && <div className="invalid-feedback">{errors.source_name}</div>}
                                        </div>
                                         <div className={`col-md-6 ${isFormEnabled ? '' : 'disabled'}`}>
                                            <label htmlFor="select" className={`visually-hidden formlabel ${isFormEnabled ? '' : 'disabled'}`} id="newcal">
                                                Pilot Name<span className="text-danger">*</span>
                                            </label>
                                            <select
                                                as='select'
                                                className={`form-control filedssss ${errors.source_name ? 'is-invalid' : ''}`}
                                                name='source_name'
                                                id='outlined-select'
                                                disabled={!isFormEnabled}
                                                onChange={handleChange}
                                                value={scheduleform.source_name}
                                            >
                                                <option value="">{scheduleform.schedule_sourcename_id ? scheduleform.schedule_sourcename_id : 'Select Pilot Name'}</option>
                                                {sourceNameOptions.map((source) => (
                                                    <option key={source.source_pk_id} value={source.source_pk_id}>
                                                        {source.source_names}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.source_name && <div className="invalid-feedback">{errors.source_name}</div>}
                                        </div>
                                         <div className={`col-md-6 ${isFormEnabled ? '' : 'disabled'}`}>
                                            <label htmlFor="select" className={`visually-hidden formlabel ${isFormEnabled ? '' : 'disabled'}`} id="newcal">
                                                Doctor Name<span className="text-danger">*</span>
                                            </label>
                                            <select
                                                as='select'
                                                className={`form-control filedssss ${errors.source_name ? 'is-invalid' : ''}`}
                                                name='source_name'
                                                id='outlined-select'
                                                disabled={!isFormEnabled}
                                                onChange={handleChange}
                                                value={scheduleform.source_name}
                                            >
                                                <option value="">{scheduleform.schedule_sourcename_id ? scheduleform.schedule_sourcename_id : 'Select Doctor Name'}</option>
                                                {sourceNameOptions.map((source) => (
                                                    <option key={source.source_pk_id} value={source.source_pk_id}>
                                                        {source.source_names}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.source_name && <div className="invalid-feedback">{errors.source_name}</div>}
                                        </div>

                                        <div className={`col-md-6 ${isFormEnabled ? '' : 'disabled'}`}>
                                            <label for="text" className={`visually-hidden formlabel ${isFormEnabled ? '' : 'disabled'}`} id="newcal">
                                                Contact Number<span className="text-danger">*</span>
                                            </label>
                                            <input type="number" className={`form-control filedssss ${errors.mobile_number ? 'is-invalid' : ''}`}
                                                id="mobile_number" name="mobile_number"
                                                maxLength="10" value={scheduleform.mobile_number} onChange={handleChange} placeholder="Enter Name"
                                                disabled={!isFormEnabled}
                                                onInput={(e) => {
                                                    let inputValue = e.target.value.replace(/[^0-9]/g, '');
                                                    if (inputValue.length > 10) {
                                                        inputValue = inputValue.slice(0, 10);
                                                    }
                                                    e.target.value = inputValue;
                                                }}
                                            />
                                            {errors.mobile_number && <div className="invalid-feedback">{errors.mobile_number}</div>}
                                        </div>

                                        {/* <div className={`col-md-6 ${isFormEnabled ? '' : 'disabled'}`}>
                                            <Grid item xs={6} md={6} className={isFormEnabled ? '' : 'disabled'}>
                                                <FormControl fullWidth variant="outlined" disabled={!isFormEnabled}>
                                                    <label htmlFor="select" className={`visually-hidden formlabel ${isFormEnabled ? '' : 'disabled'}`}>
                                                        Vitals<span className="text-danger">*</span>
                                                    </label>
                                                    <Select
                                                        id="outlined-select"
                                                        name="screening_vitals"
                                                        multiple
                                                        value={selectedVitals}
                                                        onChange={handleChange}
                                                        renderValue={(selected) => (
                                                            <div>
                                                                {selected.map((value) => {
                                                                    const vital = screeningVitals.find(v => v.sc_list_pk_id === value);
                                                                    return vital ? vital.screening_list : '';
                                                                }).join(', ')}
                                                            </div>
                                                        )}
                                                        size="small"
                                                        MenuProps={{
                                                            PaperProps: {
                                                                style: {
                                                                    maxHeight: 150,
                                                                },
                                                            },
                                                        }}
                                                    >
                                                        {screeningVitals.map((vital) => (
                                                            <MenuItem key={vital.sc_list_pk_id} value={vital.sc_list_pk_id} style={{ padding: '0px 0px' }}>
                                                                <Checkbox
                                                                    checked={selectedVitals.indexOf(vital.sc_list_pk_id) > -1}
                                                                    disabled={!isFormEnabled}
                                                                    style={{ marginRight: '8px' }}
                                                                />
                                                                <span>{vital.screening_list}</span>
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                        </div> */}

                                        {/* {selectedVitalId === 5 && (
                                            <div className={`col-md-6 ${isFormEnabled ? '' : 'disabled'}`}>
                                                <FormControl fullWidth variant="outlined" disabled={!isFormEnabled}>
                                                    <label htmlFor="text" className={`visually-hidden formlabel ${isFormEnabled ? '' : 'disabled'}`} id="newcal">
                                                        Sub Vitals<span className="text-danger">*</span>
                                                    </label>
                                                    <Select
                                                        id="outlined-select"
                                                        name="sub_screening_vitals"
                                                        size="small"
                                                        multiple
                                                        value={selectedSubVitals}
                                                        onChange={handleChange}
                                                        renderValue={(selected) => {
                                                            const selectedSubVitalsList = selected.map((value) => {
                                                                const subVital = subScreening.find(v => v.sc_sub_list_pk_id === value);
                                                                return subVital ? subVital.sub_list : '';
                                                            });
                                                            return <div>{selectedSubVitalsList.join(', ')}</div>;
                                                        }}
                                                        MenuProps={{
                                                            PaperProps: {
                                                                style: {
                                                                    maxHeight: 150,
                                                                },
                                                            },
                                                        }}
                                                    >
                                                        {subScreening.map((subVital) => (
                                                            <MenuItem key={subVital.sc_sub_list_pk_id} value={subVital.sc_sub_list_pk_id} style={{ padding: '0px 0px' }}>
                                                                <Checkbox
                                                                    checked={selectedSubVitals.indexOf(subVital.sc_sub_list_pk_id) > -1}
                                                                    disabled={!isFormEnabled}
                                                                    style={{ marginRight: '8px' }}
                                                                />
                                                                <span>{subVital.sub_list}</span>
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </div>
                                        )} */}

                                        {/* <div className={`col-md-6 ${isFormEnabled ? '' : 'disabled'}`}>
                                            <label htmlFor="select" className={`visually-hidden formlabel ${isFormEnabled ? '' : 'disabled'}`}>
                                                Screening For<span className="text-danger">*</span>
                                            </label>
                                            <select
                                                as="select"
                                                name="type"
                                                className={`form-control filedssss ${errors.type ? 'is-invalid' : ''}`}
                                                id="outlined-select"
                                                disabled={!isFormEnabled}
                                                value={scheduleform.type}
                                                onChange={handleChange}
                                            >
                                                <option value="">{scheduleform.schedule_type_id ? scheduleform.schedule_type_id : 'Select Type'}</option>
                                                {screeningFor.map((Screening) => (
                                                    <option key={Screening.type_id} value={Screening.type_id}>
                                                        {Screening.type}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.type && <div className="invalid-feedback">{errors.type}</div>}
                                        </div> */}

                                        {/* {selectedScheduleType === '1' && ( */}
                                        {selectedSourcee === '1' && selectedScheduleType === '1' && (scheduleform.schedule_class_id === '1' || (
                                            <div className={`col-md-6 ${isFormEnabled ? '' : 'disabled'}`}>
                                                <label className={`visually-hidden formlabel ${isFormEnabled ? '' : 'disabled'}`}>Class</label>
                                                <select
                                                    as="select"
                                                    className={`form-control filedssss ${errors.Class ? 'is-invalid' : ''}`}
                                                    id="outlined-select"
                                                    disabled={!isFormEnabled}
                                                    value={scheduleform.Class}
                                                    name='Class'
                                                    onChange={handleChange}
                                                >
                                                    <option value="">{scheduleform.schedule_class_id ? scheduleform.schedule_class_id : 'Select Class'}</option>
                                                    {classList.map((cls) => (
                                                        <option key={cls.class_id} value={cls.class_id}>
                                                            {cls.class_name}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.Class && <div className="invalid-feedback">{errors.Class}</div>}
                                            </div>
                                        ))}

                                        {
                                            selectedSourcee === '5' && (
                                                <div className={`col-md-6 ${isFormEnabled ? '' : 'disabled'}`}>
                                                    <label className={`visually-hidden formlabel ${isFormEnabled ? '' : 'disabled'}`}>Department</label>
                                                    <select
                                                        as="select"
                                                        className={`form-control filedssss ${errors.department ? 'is-invalid' : ''}`}
                                                        id="outlined-select"
                                                        disabled={!isFormEnabled}
                                                        value={scheduleform.department}
                                                        name='department'
                                                        onChange={handleChange}
                                                    >
                                                        <option value="">{scheduleform.department_id ? scheduleform.department_id : 'Select Department'}</option>
                                                        {department.map((cls) => (
                                                            <option key={cls.department_id} value={cls.department_id}>
                                                                {cls.department}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {errors.department && <div className="invalid-feedback">{errors.department}</div>}
                                                </div>
                                            )
                                        }
                                    </div>

                                    <div className={`row ml-2 ${isFormEnabled ? '' : 'disabled'}`}>
                                        <button type="submit" className="btn btn-sm newsche" disabled={!isFormEnabled}>Submit</button>
                                    </div>
                                </form>

                                <Modal show={showModal} onHide={handleCloseModal}>
                                    <Modal.Header>
                                        <Modal.Title>Success</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        Your data has been submitted successfully.
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="success" onClick={handleCloseModal}>
                                            Close
                                        </Button>
                                    </Modal.Footer>
                                </Modal>

                                <Modal show={showModalMissing} onHide={handleMissing}>
                                    <Modal.Header>
                                        <Modal.Title></Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        Fill the * mark Fields
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
                                        Schedule Already Exist.
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="danger" className="btn btn-sm" onClick={handleExist}>
                                            Close
                                        </Button>
                                    </Modal.Footer>
                                </Modal>
                            </div>
                        </div>

                        <div className="col-md-7 scheduleform">
                            <div className="row">
                                {/* {canAddSchedule && <div className="col">
                                    <button className="button btn-sm scheduleadd"
                                        onClick={() => {
                                            handleClick();
                                            resetForm()
                                        }}
                                    >
                                        + Add New Schedule
                                    </button>
                                </div>
                                } */}

                                {/* <div className="col tabs">
                                    <div className="container text-center datefilterSchedule">
                                        <div className="row">
                                            <div
                                                className={`col todayscreen ${active === 'today' ? 'active' : ''}`}
                                                onClick={() => handleActive('today')}>
                                                Today
                                            </div>

                                            <div
                                                className={`col monthscreen ${active === 'month' ? 'active' : ''}`}
                                                onClick={() => handleActive('month')}
                                            >
                                                Month
                                            </div>
                                            <div
                                                className={`col datescreen ${active === 'date' ? 'active' : ''}`}
                                                onClick={() => handleActive('date')}
                                            >
                                                Till Date
                                            </div>
                                        </div>
                                    </div>
                                </div> */}
                                <div className="col-md-12 d-flex justify-content-end">

                                <div className="pr-2">
                                    <input placeholder="Search" className="form-control searchable"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <SearchIcon className="searchemoji" />
                                </div>
                                </div>
                            </div>

                            <table class="table table-borderless">
                                <thead className="belowtable">
                                    <tr class="card cardheadSchedule">
                                        <th className="col-md-2 ScheduleScreeninghead">Sr No</th>
                                        <th className="col-md-2 ScheduleScreeninghead">From Date</th>
                                        <th className="col-md-2 ScheduleScreeninghead">To Date</th>
                                        <th className="col-md-3 ScheduleScreeninghead">Source Name</th>
                                        <th className="col-md-3 ScheduleScreeninghead">Screening Person</th>
                                        {/* <th className="col-md-1 ScheduleScreeninghead">Close</th> */}
                                    </tr>
                                </thead>

                                <tbody>
                                    <div>
                                        {
                                            (loading ?
                                                (
                                                    <tr>
                                                        <td colSpan="7" className="text-center">
                                                            <CircularProgress className='circular-progress-containerschedule' style={{ margin: 'auto' }} />
                                                        </td>
                                                    </tr>
                                                )
                                                :
                                                (
                                                    tableinfo
                                                        .filter((data) =>
                                                            Object.values(data)
                                                                .join(' ')
                                                                .toLowerCase()
                                                                .includes(searchQuery.toLowerCase())
                                                        )
                                                        .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
                                                        .map((info, index) => {
                                                            const serialNumber = index + 1 + page * rowsPerPage;
                                                            return (
                                                                <tr
                                                                    className={`card cardbodyschedule ${selectedRow === info.schedule_screening_pk_id ? 'selected' : ''
                                                                        }`}
                                                                    key={info.schedule_screening_pk_id}
                                                                    onClick={(e) => handleTableRowClick(info)}
                                                                >
                                                                    <td className="col-md-2 claeender">{serialNumber}</td>
                                                                    <td className="col-md-2 claeender caliconicon">
                                                                        {/* <CalendarMonthIcon className="claender" /> */}
                                                                        {info.from_date}
                                                                    </td>
                                                                    <td className="col-md-2 claeender">{info.to_date}</td>
                                                                    <td className="col-md-3 claeender">{info.source_name}</td>
                                                                    <td className="col-md-3 claeender">{info.screening_person_name}</td>
                                                                    {/* <td className="col-md-1 claeender"><CloseIcon className="closeicon" /></td> */}
                                                                </tr>
                                                            );
                                                        })
                                                ))
                                        }
                                    </div>
                                </tbody>
                            </table>

                            <div style={{ marginTop: '6%' }}>
                                <TablePagination
                                    component="div"
                                    count={tableinfo.length}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    rowsPerPage={rowsPerPage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    rowsPerPageOptions={[5, 10, 20]}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ScheduleScreening
