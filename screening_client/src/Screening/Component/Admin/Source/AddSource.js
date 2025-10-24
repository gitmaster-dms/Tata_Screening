import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './AddSource.css'
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { Modal, Button } from 'react-bootstrap';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Checkbox, Grid } from '@mui/material';

const AddSource = () => {

    const userID = localStorage.getItem('userID');
    console.log(userID);
    //// access the source from local storage
    const SourceUrlId = localStorage.getItem('loginSource');
    const SourceNameUrlId = localStorage.getItem('SourceNameFetched');
    /// State District Tehsil
    const State = localStorage.getItem('StateLogin');
    const District = localStorage.getItem('DistrictLogin');
    const Tehsil = localStorage.getItem('TehsilLogin');

    //permission code start
    const [canAddSource, setCanAddSource] = useState(false);
    const [canDelete, setCanDelete] = useState(false);
    const [canEdit, setCanEdit] = useState(false);

    useEffect(() => {
        const storedPermissions = localStorage.getItem('permissions');
        console.log('Stored Permissions:', storedPermissions);
        const parsedPermissions = storedPermissions ? JSON.parse(storedPermissions) : [];
        console.log('parsedPermissions Permissions:', parsedPermissions);
        // Check if the user has permission to add a citizen with 'Edit' submodule
        const hasAddCitizenPermission = parsedPermissions.some((p) =>
            p.modules_submodule.some(
                (m) =>
                    m.moduleName === 'Source' &&
                    m.selectedSubmodules.some((s) => s.submoduleName === 'Add')
            )
        );
        setCanAddSource(hasAddCitizenPermission);
        // Check if the user has permission for the "Delete" submodule
        const hasDeletePermission = parsedPermissions.some((p) =>
            p.modules_submodule.some((m) => m.moduleName === 'Source' && m.selectedSubmodules.some((s) => s.submoduleName === 'Delete'))
        );
        setCanDelete(hasDeletePermission);

        // Check if the user has permission for the "edit" submodule

        const hasEditPermission = parsedPermissions.some((p) =>
            p.modules_submodule.some((m) => m.moduleName === 'Source' && m.selectedSubmodules.some((s) => s.submoduleName === 'Edit'))
        );
        setCanEdit(hasEditPermission);

    }, []);
    //permission code end

    const Port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');

    const [showModal, setShowModal] = useState(false); /////// model 
    const [showModalExist, setShowModalExist] = useState(false); /////// model 
    const [tableinfo, setTableInfo] = useState([]); /// data in table variable
    const [searchQuery, setSearchQuery] = useState('');
    ////////////////////// Form Dropdown /////////////////
    const [dropdownSource, setDropdownSource] = useState([])
    const [stateOptions, setStateOptions] = useState([]);
    const [districtOptions, setDistrictOptions] = useState([]);
    const [talukaOptions, setTalukaOptions] = useState([])
    const [selectedState, setSelectedState] = useState('')
    const [selectedDistrict, setSelectedDistrict] = useState('')
    const [selectedTahsil, setSelectedTahsil] = useState('');
    ////////////////////////////////////////////////////////////

    const [isFormEnabled, setFormEnabled] = useState(false);  //Form Disable
    //////////////////////////// Nav Dropdown //////////////////////////
    const [sourceNav, setSourceNav] = useState([]); // State for source options
    const [selectedSource, setSelectedSource] = useState(SourceUrlId || ''); // State to store selected source

    const [sourceStateNav, setSourceStateNav] = useState([]); // State for source state options
    const [selectedStateNav, setSelectedStateNav] = useState(State || '');

    const [sourceDistrictNav, setSourceDistrictNav] = useState([]); // State for source district options
    const [selectedDistrictNav, setSelectedDistrictNav] = useState(District || '')

    const [sourceTehsilNav, setSourceTehsilNav] = useState([]); // District for source Tehsil options
    const [selectedTehsilNav, setSelectedTehsilNav] = useState(Tehsil || '')

    const [sourceName, setSourceName] = useState([]);
    const [selectedName, setSelectedName] = useState('');

    console.log(selectedSource, selectedStateNav, selectedDistrictNav, selectedTehsilNav, selectedName);

    const [updateSrc, setUpdateSrc] = useState(true);
    const [deleteSrc, setDeleteSrc] = useState(true);

    const [updateModel, setUpdateModel] = useState(false); /////// model 
    const [deleteModel, setDeleteModel] = useState(false); /////// model 
    const [showModalMissing, setShowModalMissing] = useState(false); /////// model 

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [loading, setLoading] = useState(true)

    //_____________________________________VITALS API OF DROPDOWN_______________________________
    const [screeningVitals, setScreeningVitals] = useState([]);
    const [subScreening, setSubScreening] = useState([]);
    const [selectedVitals, setSelectedVitals] = useState([]);
    console.log(selectedVitals, 'vitals name fetching......');

    const [selectedSubVitals, setSelectedSubVitals] = useState([]);
    console.log(selectedSubVitals, 'selected sub vitals name');
    const [selectedVitalId, setSelectedVitalId] = useState(null);

    // Fetching screening vitals
    useEffect(() => {
        const fetchScreeningVitals = async () => {
            try {
                const response = await axios.get(`${Port}/Screening/GET_Screening_List/`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                const data = response.data;
                setScreeningVitals(data);
            } catch (error) {
                console.error('Error fetching screening vitals:', error);
            }
        };

        fetchScreeningVitals();
    }, []);

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
                    const response = await axios.get(`${Port}/Screening/Screening_sub_list/?screening_list=${selectedVitalId}`, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    });
                    const data = response.data;
                    console.log('Fetching Sub Vitals....', data);
                    setSubScreening(data);
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

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const displayedData = tableinfo.filter((data) =>
        Object.values(data)
            .join(' ')
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
    );

    const [selectedFile, setSelectedFile] = useState(null);

    const [errors, setErrors] = useState({
        source: '',
        source_names: '',
        registration_no: '',
        mobile_no: '',
        email_id: '',
        // Registration_details: '',
        source_pincode: '',
        source_address: '',
        // source_state: '',
        // source_district: '',
        // source_taluka: '',
    });

    const validateForm = () => {
        const newErrors = {};

        if (!selectData.source) {
            newErrors.source = 'Source is required';
        }

        if (!selectData.source_names) {
            newErrors.source_names = 'Source Name is required';
        }

        if (!selectData.registration_no) {
            newErrors.registration_no = 'Registration Number is required';
        }

        if (!selectData.mobile_no) {
            newErrors.mobile_no = 'Mobile Number is required';
        } else if (!/^\d{10,13}$/.test(selectData.mobile_no)) {
            newErrors.mobile_no = 'Invalid Contact Number';
        }

        if (!selectData.email_id) {
            newErrors.email_id = 'Email address is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(selectData.email_id)) {
            newErrors.email_id = 'Invalid email address format';
        }

        // if (!selectData.Registration_details) {
        //     newErrors.Registration_details = 'Registration Details are required';
        // }

        // if (!selectData.source_pincode) {
        //     newErrors.source_pincode = 'Pin Code is required';
        // }

        if (!selectData.source_pincode) {
            newErrors.source_pincode = 'Pincode is required';
        } else if (!/^\d{6}$/.test(selectData.source_pincode)) {
            newErrors.source_pincode = 'Invalid Pincode';
        }

        // else if (!/^\d{6}$/.test(selectData.source_pincode)) {
        //     newErrors.source_pincode = 'Invalid pin code format.';
        // }

        if (!selectData.source_address) {
            newErrors.source_address = 'Address is required';
        }
        setErrors(newErrors);
        return true;
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === 'screening_vitals') {
            setSelectedVitals(e.target.value);
        }
        if (name === 'sub_screening_vitals') {
            setSelectedSubVitals(e.target.value);
        }

        if (name === 'Registration_details') {
            setSelectedFile(files.length > 0 ? files[0] : null);
        }
        else {
            setSelectData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const resetForm = () => {
        setSelectData({
            source: "",
            source_names: "",
            registration_no: "",
            mobile_no: "",
            email_id: "",
            Registration_details: "",
            source_pincode: "",
            source_address: "",
            source_state: "",
            source_district: "",
            source_taluka: "",
        });

        setSelectedSource("");
        setSelectedState("");
        setSelectedDistrict("");
        setSelectedTahsil("");
    };

    //////// POST API for source /////////////
    const [selectData, setSelectData] = useState(
        {
            source: "",
            source_names: "",
            registration_no: "",
            mobile_no: "",
            email_id: "",
            // Registration_details: null, // Assuming Registration_details is a File object
            source_pincode: "",
            source_address: "",
            pk_id: '',
            added_by: userID,
            add_source_id: '',
            add_state_id: '',
            add_district_id: '',
            add_tehsil_id: '',
            source_state: "",
            source_district: "",
            source_taluka: "",
            Registration_details: null
        }
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isValid = validateForm();

        if (isValid) {
            if (selectData.mobile_no.length < 10) {
                console.log('Contact number must be at least 10 characters long.');
                alert("Contact number must be at least 10 digits long.");
                return;
            }

            // Create FormData
            const formData = new FormData();
            formData.append('source', selectData.source || '');
            formData.append('source_names', selectData.source_names || '');
            formData.append('registration_no', selectData.registration_no || '');
            formData.append('mobile_no', selectData.mobile_no || '');
            formData.append('email_id', selectData.email_id || '');

            if (selectedFile) {
                formData.append('Registration_details', selectedFile);
            }

            formData.append('source_pincode', selectData.source_pincode || '');
            formData.append('source_address', selectData.source_address || '');
            formData.append('pk_id', selectData.pk_id || '');

            // Check for null values before appending
            if (selectedState) {
                formData.append('source_state', selectedState);
            }
            if (selectedDistrict) {
                formData.append('source_district', selectedDistrict);
            }
            if (selectedTahsil) {
                formData.append('source_taluka', selectedTahsil);
            }

            // Append selected vitals
            formData.append('screening_vitals', JSON.stringify(selectedVitals) || '[]');
            formData.append('sub_screening_vitals', JSON.stringify(selectedSubVitals) || '[]');

            const userID = localStorage.getItem('userID');
            console.log('UserID:', userID);

            if (updateSrc) {
                try {
                    formData.append('added_by', userID);

                    const response = await fetch(`${Port}/Screening/add_new_source_POST/`, {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                        },
                    });

                    if (response.status === 201) {
                        const data = await response.json();
                        setShowModal(true);
                        setTableInfo([...tableinfo, data]);
                        console.log('Data sent successfully:', data);
                        resetForm();
                        setSelectData({
                            source: "",
                            source_names: "",
                            registration_no: "",
                            mobile_no: "",
                            email_id: "",
                            Registration_details: "",
                            source_pincode: "",
                            source_address: "",
                            source_state: "",
                            source_district: "",
                            source_taluka: "",
                        });
                    } else if (response.status === 400) {
                        setShowModalMissing(true);
                    } else if (response.status === 409) {
                        setShowModalExist(true);
                    } else {
                        console.error('Error sending data. Unexpected response:', response);
                    }
                } catch (error) {
                    console.error('Error sending data:', error);
                }
            } else {
                try {
                    formData.append('modify_by', userID);

                    const response = await fetch(`${Port}/Screening/add_new_source_PUT/${selectData.pk_id}/`, {
                        method: 'PUT',
                        body: formData,
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                        },
                    });

                    if (response.status === 200) {
                        console.log('Source updated successfully:', response);
                        setUpdateModel(true);
                        setTableInfo([...tableinfo]);
                        resetForm();
                    } else {
                        console.error(`Error updating source. Status: ${response.status}`);
                    }
                } catch (error) {
                    console.error('Error updating source:', error);
                }
            }
        } else {
            console.log('Form has errors, please correct them.');
        }
    };

    /////////////// modal
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

    ////////////// Update  missing
    const handleUpdate = () => {
        setUpdateModel(false);
    };

    ////////////// Delete  missing
    const handleDeleteModel = () => {
        setDeleteModel(false);
    };

    ///////// get API for Table //////////////
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${Port}/Screening/add_new_source_GET/?source=${SourceUrlId}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });
                const data = await response.json();
                setTableInfo(data);
                setLoading(false)
            } catch (error) {
                console.log('Error fetching source data', error);
                setLoading(false)
            }
        };
        fetchData();
    }, []);

    //////////////////// Delete
    const handleDelete = async () => {
        const confirmDelete = window.confirm('Are you sure you want to delete this data?');

        if (!confirmDelete) {
            return;
        }

        console.log('Received sourceId:', selectData.pk_id);

        const userID = localStorage.getItem('userID');
        console.log(userID);

        try {
            await axios.delete(`${Port}/Screening/add_new_source_DELETE/${selectData.pk_id}/${userID}/`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            console.log('Data Deleted successfully');

            console.log('Before delete:', tableinfo);

            setTableInfo(prevTableInfo =>
                prevTableInfo.filter(item => item.source_pk_id !== selectData.source_pk_id)
            );

            console.log('After delete:', tableinfo);

            setDeleteModel(true);
        } catch (error) {
            console.error('Error deleting data:', error);
        }
    };

    //////////////// Form Disable ////////////////
    const handleClicked = () => {
        setFormEnabled(true);
        setUpdateSrc(true);
    }

    ////////////// Source Dropdown //////////////
    useEffect(() => {
        const fetchSource = async () => {
            try {
                const response = await axios.get(`${Port}/Screening/source_GET/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });
                const options = response.data;
                setDropdownSource(options);
            } catch (error) {
                console.log('Error While Fetching Data', error);
            }
        };
        fetchSource();
    }, []);

    ////////////////////////////// navbar value dropdown get ///////////////////////////////
    ///// source Dropdown
    useEffect(() => {
        fetch(`${Port}/Screening/Source_Get/?source_pk_id=${SourceUrlId}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        })
            .then(response => response.json())
            .then(data => {
                setSourceNav(data);
            })
            .catch(error => {
                console.error('Error fetching sources:', error);
            });
    }, []);

    //// Soure State against selected source
    useEffect(() => {
        const fetchStateNavOptions = async () => {
            if (selectedSource) {
                try {
                    const res = await fetch(`${Port}/Screening/source_and_pass_state_Get/${selectedSource}`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                        },
                    });
                    const data = await res.json();
                    setSourceStateNav(data);
                } catch (error) {
                    console.error("Error fetching state against source data:", error);
                }
            }
        };
        fetchStateNavOptions();
    }, [selectedSource]);

    //// Soure District against selected source state/////////
    useEffect(() => {
        const fetchDistrictNavOptions = async () => {
            if (selectedStateNav) {
                try {
                    const res = await fetch(`${Port}/Screening/state_and_pass_district_Get/${selectedSource}/${selectedStateNav}/`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                        },
                    });
                    const data = await res.json();
                    setSourceDistrictNav(data);
                } catch (error) {
                    console.error("Error fetching districts against state data:", error);
                }
            }
        };
        fetchDistrictNavOptions();
    }, [selectedStateNav]);

    //// Soure Tehsil against selected source District/////////
    useEffect(() => {
        const fetchTehsilNavOptions = async () => {
            if (selectedDistrictNav) {
                try {
                    const res = await fetch(`${Port}/Screening/district_and_pass_taluka_Get/${selectedSource}/${selectedDistrictNav}/`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                        },
                    });
                    const data = await res.json();
                    setSourceTehsilNav(data);
                } catch (error) {
                    console.error("Error fetching Tehsil against District data:", error);
                }
            }
        };
        fetchTehsilNavOptions();
    }, [selectedDistrictNav]);

    //// Soure Name against selected source district
    useEffect(() => {
        const fetchSourceNameOptions = async () => {
            if (selectedSource && selectedStateNav && selectedDistrictNav && selectedTehsilNav) {
                try {
                    const res = await fetch(`${Port}/Screening/taluka_SourceName_Get/${selectedSource}/${selectedStateNav}/${selectedDistrictNav}/${selectedTehsilNav}`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                        },
                    });
                    const data = await res.json();
                    setSourceName(data);
                } catch (error) {
                    console.error("Error fetching Source Name against Tehsil data:", error);
                }
            }
        };
        fetchSourceNameOptions();
    }, [selectedTehsilNav, selectedStateNav, selectedDistrictNav, selectedTehsilNav]);

    ///////// State, District, Tehsil Form Dropdown /////////////
    useEffect(() => {
        const fetchStateOptions = async () => {
            try {
                const response = await axios.get(`${Port}/Screening/agg_state_info_get/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });
                const options = response.data;
                setStateOptions(options);
            } catch (error) {
                console.log('Error While Fetching Data', error);
            }
        };
        fetchStateOptions();
    }, []);

    useEffect(() => {
        const fetchDistrictOptions = async () => {
            if (selectedState) {
                try {
                    const res = await fetch(`${Port}/Screening/agg_district_info_get/${selectedState}`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                        },
                    });
                    const data = await res.json();
                    setDistrictOptions(data);
                } catch (error) {
                    console.error("Error fetching District data:", error);
                }
            }
        };
        fetchDistrictOptions();
    }, [selectedState]);

    useEffect(() => {
        const fetchTalukaOptions = async () => {
            if (selectedDistrict) {
                try {
                    const res = await fetch(`${Port}/Screening/agg_tahsil_get_api/${selectedDistrict}`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                        },
                    });
                    const data = await res.json();
                    setTalukaOptions(data);
                } catch (error) {
                    console.error("Error fetching Taluka data:", error);
                }
            }
        };
        fetchTalukaOptions();
    }, [selectedDistrict]);

    ////////////////////// search Filter
    useEffect(() => {
        handleSearch()
    }, [])

    const handleSearch = async (e) => {
        try {
            let apiUrl = `${Port}/Screening/filter-Source/?`;

            if (selectedSource) apiUrl += `source=${selectedSource}&`;
            if (selectedStateNav) apiUrl += `source_state=${selectedStateNav}&`;
            if (selectedDistrictNav) apiUrl += `source_district=${selectedDistrictNav}&`;
            if (selectedTehsilNav) apiUrl += `source_taluka=${selectedTehsilNav}&`;
            if (selectedName) apiUrl += `source_pk_id=${selectedName}&`;

            const accessToken = localStorage.getItem('token');

            const response = await axios.get(apiUrl, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            setTableInfo(response.data);
            console.log(response.data);
        } catch (error) {
            console.log('Error while fetching data', error);
        }
    };

    const [selectedSourceId, setSelectedSourceId] = useState('');
    const [selectedRow, setSelectedRow] = useState(null);

    const handleTableRowClick = (info) => {
        setSelectedSourceId(info.source_pk_id);
        setSelectedRow(info.source_pk_id);
    };

    useEffect(() => {
        console.log('id getting here:', selectedSourceId);
    }, [selectedSourceId]);

    const fetchData1 = async () => {
        try {
            if (selectedSourceId !== '') {
                const response = await fetch(`${Port}/Screening/add_new_source_GET_ID_WISE/${selectedSourceId}/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });
                console.log("Response from API:", response);

                const data = await response.json();
                console.log("JSON data from API:", data);

                const fullImageURL = `${Port}${data.Registration_details}`;
                console.log("Full Image URL:", fullImageURL);

                console.log('source_pk_id:', data.source.source_pk_id);
                console.log('Source Name:', data.source_names);
                console.log('Registration No:', data.registration_no);
                console.log('Mobile No:', data.mobile_no);
                console.log('Email ID:', data.email_id);
                console.log('Source State:', data.source_state.state_name);
                console.log('Source District:', data.source_district.dist_name);
                console.log('Source Taluka:', data.source_taluka.tahsil_name);
                console.log('Source Pincode:', data.source_pincode);
                console.log('Source Address:', data.source_address);
                console.log('Vitals :', data.screening_vitals);
                console.log('Sub Vitals :', data.sub_screening_vitals);

                console.log('source_pk_id:', data.source.source_pk_id);

                if (response.headers.get('content-type') === 'application/json') {
                    console.log("Handling JSON response");
                    setSelectData(prevState => ({
                        add_source_id: data.source?.source || '',
                        source: data.source?.source_pk_id || '',

                        add_state_id: data.source_state?.state_name || '',
                        source_state: data.source_state?.state_id || '',

                        add_district_id: data.source_district?.dist_name || '',
                        source_district: data.source_district?.dist_id || '',
                        add_tehsil_id: data.source_taluka?.tahsil_name || '',

                        source_taluka: data.source_taluka?.tal_id || '',
                        source_names: data.source_names || '',

                        registration_no: data.registration_no || '',
                        mobile_no: data.mobile_no || '',
                        email_id: data.email_id || '',
                        source_pincode: data.source_pincode || '',
                        source_address: data.source_address || '',
                        screening_vitals: data.screening_vitals || [],
                        sub_screening_vitals: data.sub_screening_vitals || [],
                        pk_id: data.source_pk_id || '',
                        Registration_details: fullImageURL,

                    }));
                    console.log("Registration Details (Image URL):", selectData.Registration_details);
                } else {
                    console.log("Handling non-JSON response");
                    const fileResponse = await fetch(`${Port}/Screening/add_new_source_PUT/${selectedSourceId}/`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json', // Adjust content type as needed
                            'Authorization': `Bearer ${accessToken}`,
                        },
                    });

                    // Assuming the file is a blob, you can set it in the state
                    const fileBlob = await fileResponse.blob();

                    setSelectData(prevState => ({
                        add_source_id: data.source?.source || '',
                        source: data.source?.source_pk_id || '',
                        add_state_id: data.source_state?.state_name || '',
                        source_state: data.source_state?.state_id || '',
                        add_district_id: data.source_district?.dist_name || '',
                        source_district: data.source_district?.dist_id || '',
                        add_tehsil_id: data.source_taluka?.tahsil_name || '',
                        source_taluka: data.source_taluka?.tal_id || '',
                        source_names: data.source_names || '',
                        registration_no: data.registration_no || '',
                        mobile_no: data.mobile_no || '',
                        email_id: data.email_id || '',
                        source_pincode: data.source_pincode || '',
                        source_address: data.source_address || '',
                        screening_vitals: data.screening_vitals || [],
                        sub_screening_vitals: data.sub_screening_vitals || [],
                        pk_id: data.source_pk_id || '',
                        Registration_details: fileBlob,
                    }));
                    // Set the selectedVitals and selectedSubVitals based on the API response

                    setSelectedVitals(data.screening_vitals || []);
                    setSelectedSubVitals(data.sub_screening_vitals || []);
                }
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData1();
    }, [selectedSourceId]);

    return (
        <div>
            <div class="content-wrapper">
                <div class="content-header">
                    <div class="container-fluid">
                        <div className="card sourcecard">
                            <div className="row sourcename">
                                <h5 className='nameeeeeee mt-1'>Source List</h5>
                            </div>

                            <div className="row">
                                <Box>
                                    <div class="container text-center">
                                        <div class="row dropdownrowtextfield">
                                            <div class="col" style={{ color: "white" }}>
                                                <TextField
                                                    style={{ color: 'white' }}
                                                    select
                                                    className="addsourcenavfields"
                                                    size="small"
                                                    label="Source"
                                                    id="select-small"
                                                    variant="outlined"
                                                    value={selectedSource}
                                                    onChange={event => setSelectedSource(event.target.value)}
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
                                                    <MenuItem value="">Select Source</MenuItem>
                                                    {sourceNav.map(drop => (
                                                        <MenuItem key={drop.source_pk_id} value={drop.source_pk_id}>
                                                            {drop.source}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            </div>

                                            <div class="col" style={{ color: "white" }}>
                                                <TextField
                                                    select
                                                    className="addsourcenavfields"
                                                    size="small"
                                                    label="Source State"
                                                    id="select-small"
                                                    name="source_state"
                                                    variant="outlined"
                                                    value={selectedStateNav}
                                                    onChange={event => setSelectedStateNav(event.target.value)}
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
                                                >
                                                    <MenuItem value="">Source State</MenuItem>
                                                    {sourceStateNav.map(drop => (
                                                        <MenuItem key={drop.source_state} value={drop.source_state}>
                                                            {drop.state_name}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            </div>

                                            <div class="col" style={{ color: "white" }}>
                                                <TextField
                                                    select
                                                    className="addsourcenavfields"
                                                    size="small"
                                                    label="Source District"
                                                    id="select-small"
                                                    variant="outlined"
                                                    name='source_district'
                                                    value={selectedDistrictNav}
                                                    onChange={event => setSelectedDistrictNav(event.target.value)}
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
                                                    <MenuItem value="">Select District</MenuItem>
                                                    {sourceDistrictNav.map(drop => (
                                                        <MenuItem key={drop.source_district} value={drop.source_district}>
                                                            {drop.dist_name}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            </div>

                                            <div class="col" style={{ color: "white" }}>
                                                <TextField
                                                    select
                                                    className="addsourcenavfields"
                                                    size="small"
                                                    label="Source Tehsil"
                                                    id="select-small"
                                                    variant="outlined"
                                                    name='source_taluka'
                                                    value={selectedTehsilNav}
                                                    onChange={event => setSelectedTehsilNav(event.target.value)}
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
                                                    <MenuItem value="">Select Tehsil</MenuItem>
                                                    {sourceTehsilNav.map(drop => (
                                                        <MenuItem key={drop.source_taluka} value={drop.source_taluka}>
                                                            {drop.tahsil_name}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            </div>

                                            <div class="col" style={{ color: "white" }}>
                                                <TextField
                                                    select
                                                    className="addsourcenavfields"
                                                    size="small"
                                                    label="Source Name"
                                                    id="select-small"
                                                    name="source_names"
                                                    variant="outlined"
                                                    value={selectedName}
                                                    onChange={event => setSelectedName(event.target.value)}
                                                    InputLabelProps={{
                                                        style: {
                                                            fontWeight: '50',
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
                                                >
                                                    <MenuItem value="">Source Name</MenuItem>
                                                    {sourceName.map(drop => (
                                                        <MenuItem key={drop.source_pk_id} value={drop.source_pk_id}>
                                                            {drop.source_names}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            </div>

                                            <div className='col searchbutton'>
                                                <button
                                                    type='button'
                                                    className='btn btn-sm searchsource'
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

            <div class="content-wrapper cardbelowsource">
                <div class="content-header">
                    <div class="container-fluid">
                        <div className="row">
                            <div className='col tablebackground' >
                                <div className={`card formcard`}>
                                    <div className="row">
                                        <h5
                                            className={`Sourcetitle ${isFormEnabled ? '' : 'disabled'}`}
                                        >
                                            Add Source
                                        </h5>
                                        <div class="elementsource"></div>

                                        <div className="ml-auto mr-3">
                                            {canEdit && <DriveFileRenameOutlineOutlinedIcon className={`editicon mr-2`} onClick={() => {
                                                setFormEnabled(true);
                                                setUpdateSrc(false);
                                            }} />}
                                            {canDelete && <DeleteOutlineOutlinedIcon className={`deleteicon`}
                                                onClick={() => {
                                                    setDeleteSrc(false);
                                                    handleDelete();
                                                }} />}
                                        </div>
                                    </div>

                                    {/* <div className="row pr-3"> */}
                                    <div className="row">
                                        <div className="col">
                                            <form onSubmit={handleSubmit} encType="multipart/form-data">
                                                <div className={`row ml-2 ${isFormEnabled ? '' : 'disabled'}`}>
                                                    <div className="col">
                                                        <label htmlFor="select" className="visually-hidden forminputs1" id="newcal">
                                                            Source<span className="text-danger">*</span>
                                                        </label>
                                                        <select
                                                            as='select'
                                                            className={`form-control inputfiledssouce ${errors.source ? 'is-invalid' : ''}`}
                                                            disabled={!isFormEnabled}
                                                            name="source"
                                                            value={selectData.source} onChange={handleChange}
                                                        >
                                                            <option value="">{selectData.add_source_id ? selectData.add_source_id : 'Select Source'}</option>
                                                            {dropdownSource.map((option) => (
                                                                <option key={option.source_pk_id} value={option.source_pk_id}>
                                                                    {option.source}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        {errors.source && <div className="invalid-feedback">{errors.source}</div>}
                                                    </div>

                                                    {/* <Grid container spacing={2}>
                                                        <Grid item xs={6}>
                                                            <Box sx={{ minWidth: 120 }}>
                                                                <FormControl fullWidth size="small">
                                                                    <InputLabel id="demo-simple-select-label">Source</InputLabel>
                                                                    <Select
                                                                        labelId="demo-simple-select-label"
                                                                        id="demo-simple-select"
                                                                        label="Source"
                                                                        name="source"
                                                                        value={selectData.source}
                                                                        onChange={handleChange}
                                                                        sx={{
                                                                            color: 'black',
                                                                            '& .MuiSelect-icon': { color: 'black' }
                                                                        }}
                                                                    >
                                                                        {dropdownSource.map((option) => (
                                                                            <MenuItem key={option.source_pk_id} value={option.source_pk_id}>
                                                                                {option.source}
                                                                            </MenuItem>
                                                                        ))}
                                                                    </Select>
                                                                </FormControl>
                                                            </Box>
                                                        </Grid>
                                                    </Grid> */}

                                                    <div className="col-md-6">
                                                        <label className="visually-hidden forminputs2" id="newcal">Source Name<span className="text-danger">*</span></label>
                                                        <input
                                                            type="text"
                                                            className={`form-control inputfiledssouce ${errors.source_names ? 'is-invalid' : ''}`}
                                                            id="source_names"
                                                            value={selectData.source_names}
                                                            onChange={handleChange}
                                                            disabled={!isFormEnabled}
                                                            name="source_names"
                                                            placeholder="Enter Name"
                                                        />
                                                        {errors.source_names && <div className="invalid-feedback">{errors.source_names}</div>}
                                                    </div>
                                                    {/* </div> */}

                                                    {/* <div className={`row ml-2 mt-2 ${isFormEnabled ? '' : 'disabled'}`}> */}
                                                    <div className="col-md-6">
                                                        <label htmlFor="registration" className="visually-hidden forminputs2"
                                                            id="newcal" >
                                                            Registration Number<span className="text-danger">*</span>
                                                        </label>
                                                        <input type="text"
                                                            className={`form-control inputfiledssouce ${errors.registration_no ? 'is-invalid' : ''}`}
                                                            id="registration_no"
                                                            value={selectData.registration_no} onChange={handleChange}
                                                            disabled={!isFormEnabled} name="registration_no"
                                                            placeholder="Enter" maxLength="30"
                                                        />
                                                        {errors.registration_no && <div className="invalid-feedback">{errors.registration_no}</div>}
                                                    </div>

                                                    <div className="col-md-6">
                                                        <label htmlFor="mobile" className="visually-hidden forminputs2" id="newcal">
                                                            Contact Number <span className="text-danger">*</span>
                                                        </label>
                                                        <input
                                                            type="number"
                                                            className={`form-control inputfiledssouce ${errors.mobile_no ? 'is-invalid' : ''}`}
                                                            id="mobile_no"
                                                            value={selectData.mobile_no}
                                                            onChange={handleChange}
                                                            disabled={!isFormEnabled}
                                                            name="mobile_no"
                                                            placeholder="+91"
                                                            onInput={(e) => {
                                                                let inputValue = e.target.value.replace(/[^0-9]/g, '');
                                                                if (inputValue.length > 13) {
                                                                    inputValue = inputValue.slice(0, 13);
                                                                }
                                                                e.target.value = inputValue;
                                                            }}
                                                        />
                                                        {errors.mobile_no && errors.mobile_no !== 'Verified' && (
                                                            <span className="invalid-feedback text-danger">{errors.mobile_no}</span>
                                                        )}
                                                    </div>

                                                    <div className="col-md-6 input3">
                                                        <label for="email" className="visually-hidden forminputs2" id="newcal">
                                                            Email ID<span className="text-danger">*</span>
                                                        </label>
                                                        <input type="email" className={`form-control inputfiledssouce ${errors.email_id ? 'is-invalid' : ''}`}
                                                            id="email_id"
                                                            value={selectData.email_id} onChange={handleChange}
                                                            disabled={!isFormEnabled} name="email_id" placeholder="Enter Mail" />
                                                        {errors.email_id && errors.email_id !== 'Verified' && (
                                                            <span className="invalid-feedback text-danger">{errors.email_id}</span>
                                                        )}
                                                        {errors.email_id === 'Verified' && (
                                                            <span className="invalid-feedback text-success">{errors.email_id}</span>
                                                        )}

                                                    </div>

                                                    <div className="col-md-6 input3">
                                                        <label htmlFor="Details" className="visually-hidden forminputs2" id="newcal" >
                                                            Source Logo
                                                        </label>
                                                        <input type="file" id="Registration_details"
                                                            className={`form-control inputfiledssouce`}
                                                            onChange={handleChange}
                                                            disabled={!isFormEnabled} name="Registration_details" placeholder=""
                                                        />
                                                    </div>

                                                    <div className={`col-md-6 ${isFormEnabled ? '' : 'disabled'}`}>
                                                        <Grid item xs={6} md={6} className={isFormEnabled ? '' : 'disabled'}>
                                                            <FormControl variant="outlined" disabled={!isFormEnabled}>
                                                                <label htmlFor="select" className={`visually-hidden forminputs2 ${isFormEnabled ? '' : 'disabled'}`}>
                                                                    Vitals<span className="text-danger">*</span>
                                                                </label>
                                                                <Select
                                                                    id="outlined-select"
                                                                    name="screening_vitals"
                                                                    multiple
                                                                    value={selectedVitals}
                                                                    onChange={handleChange}
                                                                    renderValue={(selected) => (
                                                                        <div style={{
                                                                            overflow: 'hidden',
                                                                            textOverflow: 'ellipsis',
                                                                            whiteSpace: 'nowrap'
                                                                        }}>
                                                                            {selected.map((value) => {
                                                                                const vital = screeningVitals.find(v => v.sc_list_pk_id === value);
                                                                                return vital ? vital.screening_list : '';
                                                                            }).join(', ')}
                                                                        </div>
                                                                    )}
                                                                    size="small"
                                                                    className='inputfiledssouce'
                                                                    MenuProps={{
                                                                        PaperProps: {
                                                                            style: {
                                                                                maxHeight: 150,
                                                                            },
                                                                        },
                                                                    }}
                                                                    style={{ width: '260px' }}
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
                                                    </div>

                                                    {selectedVitalId === 5 && (
                                                        <div className={`col-md-6 ${isFormEnabled ? '' : 'disabled'}`}>
                                                            <FormControl fullWidth variant="outlined" disabled={!isFormEnabled}>
                                                                <label htmlFor="text" className={`visually-hidden forminputs2 ${isFormEnabled ? '' : 'disabled'}`} id="newcal">
                                                                    Sub Vitals<span className="text-danger">*</span>
                                                                </label>
                                                                <Select
                                                                    className='inputfiledssouce'
                                                                    id="outlined-select"
                                                                    name="sub_screening_vitals"
                                                                    size="small"
                                                                    multiple
                                                                    value={selectedSubVitals}
                                                                    onChange={handleChange}
                                                                    renderValue={(selected) => (
                                                                        <div style={{
                                                                            overflow: 'hidden',
                                                                            textOverflow: 'ellipsis',
                                                                            whiteSpace: 'nowrap'
                                                                        }}>
                                                                            {selected.map((value) => {
                                                                                const subVital = subScreening.find(v => v.sc_sub_list_pk_id === value);
                                                                                return subVital ? subVital.sub_list : '';
                                                                            }).join(', ')}
                                                                        </div>
                                                                    )}
                                                                    MenuProps={{
                                                                        PaperProps: {
                                                                            style: {
                                                                                maxHeight: 150,
                                                                            },
                                                                        },
                                                                    }}
                                                                    style={{ width: '260px' }}
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
                                                    )}

                                                    {/* <div className={`col-md-6 ${isFormEnabled ? '' : 'disabled'}`}>
                                                        <label htmlFor="select" className={`visually-hidden forminputs1 ${isFormEnabled ? '' : 'disabled'}`}>
                                                            Vitals<span className="text-danger">*</span>
                                                        </label>
                                                        <Select
                                                            className={`form-control inputfiledssouce`}
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
                                                    </div>

                                                    {selectedVitalId === 5 && (
                                                        <div className={`col-md-6 ${isFormEnabled ? '' : 'disabled'}`}>
                                                            <label htmlFor="select" className={`visually-hidden forminputs1 ${isFormEnabled ? '' : 'disabled'}`}>
                                                                Sub Vitals<span className="text-danger">*</span>
                                                            </label>
                                                            <Select
                                                                className={`form-control inputfiledssouce`}
                                                                id="outlined-select"
                                                                name="sub_screening_vitals"
                                                                multiple
                                                                value={selectedSubVitals}
                                                                onChange={handleChange}
                                                                renderValue={(selected) => (
                                                                    <div>
                                                                        {selected.map((value) => {
                                                                            const subVital = subScreening.find(v => v.sc_sub_list_pk_id === value);
                                                                            return subVital ? subVital.sub_list : '';
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
                                                        </div>
                                                    )} */}
                                                    {/* </div> */}

                                                    {/* <div className={`row ml-2 ${isFormEnabled ? '' : 'disabled'}`}> */}
                                                    <div className="col-md-6">
                                                        <label htmlFor="select" className="visually-hidden forminputs1" id="newcal">
                                                            State<span className="text-danger">*</span>
                                                        </label>
                                                        <select
                                                            className={`form-control inputfiledssouce`}
                                                            onChange={(e) => setSelectedState(e.target.value)}
                                                        >
                                                            <option value="">{selectData.add_state_id ? selectData.add_state_id : 'Select State'}</option>
                                                            {stateOptions.map((state) => (
                                                                <option key={state.state_id} value={state.state_id}
                                                                >
                                                                    {state.state_name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        {/* {errors.source_state && <div className="invalid-feedback">{errors.source_state}</div>} */}
                                                    </div>

                                                    <div className="col-md-6">
                                                        <label htmlFor="select" className="visually-hidden forminputs1" id="newcal">
                                                            District<span className="text-danger">*</span>
                                                        </label>
                                                        <select
                                                            className={`form-control inputfiledssouce`}
                                                            onChange={(e) => setSelectedDistrict(e.target.value)}>
                                                            <option value="">{selectData.add_district_id ? selectData.add_district_id : 'Select District'}</option>
                                                            {districtOptions.map((district) => (
                                                                <option key={district.dist_id} value={district.dist_id}>
                                                                    {district.dist_name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    <div className="col-md-6">
                                                        <label htmlFor="select" className="visually-hidden forminputs1" id="newcal">
                                                            Tehsil<span className="text-danger">*</span>
                                                        </label>
                                                        <select
                                                            className={`form-control inputfiledssouce`}
                                                            onChange={(e) => setSelectedTahsil(e.target.value)}>
                                                            <option value="">{selectData.add_tehsil_id ? selectData.add_tehsil_id : 'Select Taluka'}</option>
                                                            {talukaOptions.map((taluka) => (
                                                                <option key={taluka.tal_id} value={taluka.tal_id}>
                                                                    {taluka.tahsil_name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    <div className="col-md-6 input4">
                                                        <label for="pin" className="visually-hidden forminputs3" id="newcal">
                                                            Pin Code<span className="text-danger">*</span>
                                                        </label>
                                                        <input type="text" className={`form-control inputfiledssouce ${errors.source_pincode ? 'is-invalid' : ''}`}
                                                            id="pincode" maxLength="6"
                                                            value={selectData.source_pincode} onChange={handleChange}
                                                            disabled={!isFormEnabled} name="source_pincode" placeholder="Pin Code"
                                                            onInput={(e) => {
                                                                let inputValue = e.target.value.replace(/[^0-9]/g, '');
                                                                if (inputValue.length > 6) {
                                                                    inputValue = inputValue.slice(0, 6);
                                                                }
                                                                e.target.value = inputValue;
                                                            }} />
                                                        {errors.source_pincode && <div className="invalid-feedback">{errors.source_pincode}</div>}
                                                    </div>

                                                    <div className='col-md-6'>
                                                        <label for="address" className="visually-hidden forminputs4" id="newcal">
                                                            Address<span className="text-danger">*</span>
                                                        </label>
                                                        <input type="text"
                                                            className={`form-control inputfiledssouce ${errors.source_address ? 'is-invalid' : ''}`}
                                                            id="address" value={selectData.source_address} onChange={handleChange}
                                                            disabled={!isFormEnabled} name="source_address" placeholder="Enter address" />
                                                    </div>
                                                </div>

                                                <div className="row">
                                                    <button type="submit" className={`btn btn-sm submitbutton ${!isFormEnabled ? 'disabled' : ''}`}
                                                        disabled={!isFormEnabled}>Submit</button>
                                                </div>
                                            </form>

                                            <Modal show={showModal} onHide={handleCloseModal}>
                                                <Modal.Header closeButton>
                                                    <Modal.Title></Modal.Title>
                                                </Modal.Header>
                                                <Modal.Body>
                                                    Source Registered successfully.
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
                                                    Fill the * Mark Fields.
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
                                                    Source Already Exist.
                                                </Modal.Body>
                                                <Modal.Footer>
                                                    <Button variant="danger" className="btn btn-sm" onClick={handleExist}>
                                                        Close
                                                    </Button>
                                                </Modal.Footer>
                                            </Modal>

                                            <Modal show={updateModel} onHide={handleUpdate}>
                                                <Modal.Header>
                                                    <Modal.Title></Modal.Title>
                                                </Modal.Header>
                                                <Modal.Body>
                                                    Source Updated Successfully
                                                </Modal.Body>
                                                <Modal.Footer>
                                                    <Button variant="success" className="btn btn-sm" onClick={handleUpdate}>
                                                        Close
                                                    </Button>
                                                </Modal.Footer>
                                            </Modal>

                                            <Modal show={deleteModel} onHide={handleDeleteModel}>
                                                <Modal.Header>
                                                    <Modal.Title></Modal.Title>
                                                </Modal.Header>
                                                <Modal.Body>
                                                    Source Deleted Successfully
                                                </Modal.Body>
                                                <Modal.Footer>
                                                    <Button variant="success" className="btn btn-sm" onClick={handleDeleteModel}>
                                                        Close
                                                    </Button>
                                                </Modal.Footer>
                                            </Modal>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='col addsourcetablepart'>
                                <div className="row">
                                    {canAddSource && <div className="col-md-4">
                                        <button type="button" className="btn btn-sm addsources"
                                            onClick={() => {
                                                handleClicked();
                                                resetForm();
                                            }}
                                        >+ Add New Source</button>
                                    </div>}
                                    <div className="col-md-7">
                                        <input className="form-control searchaddsource"
                                            placeholder='Search Source'
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)} />
                                        <SearchOutlinedIcon className='searchiconsource' />
                                    </div>
                                </div>

                                <div className="row ml-2" style={{ height: '100%' }}>
                                    <table class="table table-borderless addsourcetable">
                                        <thead className="belowtable">
                                            <tr class="card cardheadsource">
                                                <th className="col-md-2 headnamess text-left">Sr No</th>
                                                <th className="col-md-5 headnamess text-left">Source Name</th>
                                                <th className="col-md-5 headnamess text-left">Registration Number</th>
                                                {/* <th className="col headnamess text-left">Modify By</th> */}
                                            </tr>
                                        </thead>

                                        <tbody>
                                            <div>
                                                {
                                                    loading ? (
                                                        <tr>
                                                            <td colSpan="7" className="text-center">
                                                                <CircularProgress className='circular-progress-containersource' style={{ margin: 'auto' }} />
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        displayedData.length === 0 ? (
                                                            <tr>
                                                                <td colSpan="3">No results found</td>
                                                            </tr>
                                                        ) : (
                                                            displayedData
                                                                .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
                                                                .map((info, index) => {
                                                                    const serialNumber = index + 1 + page * rowsPerPage; // Updated calculation for serial number
                                                                    return (
                                                                        <tr
                                                                            style={{ height: '3.5em' }}
                                                                            key={info.source_pk_id}
                                                                            className={`card cardbody ${selectedRow === info.source_pk_id ? 'selected' : ''
                                                                                }`}
                                                                            onClick={() => handleTableRowClick(info)}
                                                                        >
                                                                            <td className="col-md-2 text-left">{serialNumber}</td>
                                                                            <td className="col-md-5 text-left">{info.source_names}</td>
                                                                            <td className="col-md-5 text-left">{info.registration_no}</td>
                                                                        </tr>
                                                                    );
                                                                })
                                                        )
                                                    )
                                                }
                                            </div>
                                        </tbody>
                                    </table>

                                    <div className="paginationsource" style={{ marginTop: '-5%' }}>
                                        <TablePagination
                                            component="div"
                                            count={displayedData.length}
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
            </div >
        </div >
    )
}

export default AddSource
