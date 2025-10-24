import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { Link } from 'react-router-dom'
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import './AddUser.css'
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import CircularProgress from '@mui/material/CircularProgress';
import TablePagination from '@mui/material/TablePagination';

const AddUser = () => {
  //permission code start
  const [canAddUser, setCanAddUser] = useState(false);
  const [canDelete, setCanDelete] = useState(false);
  const [canView, setCanView] = useState(false);
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
          m.moduleName === 'System User' &&
          m.selectedSubmodules.some((s) => s.submoduleName === 'Add')
      )
    );
    setCanAddUser(hasAddCitizenPermission);
    // Check if the user has permission for the "Delete" submodule
    const hasDeletePermission = parsedPermissions.some((p) =>
      p.modules_submodule.some((m) => m.moduleName === 'System User' && m.selectedSubmodules.some((s) => s.submoduleName === 'Delete'))
    );
    setCanDelete(hasDeletePermission);

    // Check if the user has permission for the "edit" submodule
    const hasEditPermission = parsedPermissions.some((p) =>
      p.modules_submodule.some((m) => m.moduleName === 'System User' && m.selectedSubmodules.some((s) => s.submoduleName === 'Edit'))
    );
    setCanEdit(hasEditPermission);

    // Check if the user has permission for the "edit" submodule
    const hasViewPermission = parsedPermissions.some((p) =>
      p.modules_submodule.some((m) => m.moduleName === 'System User' && m.selectedSubmodules.some((s) => s.submoduleName === 'View'))
    );
    setCanView(hasViewPermission);
  }, []);

  //permission code end
  const Port = process.env.REACT_APP_API_KEY
  const accessToken = localStorage.getItem('token');

  const [showForm, setShowForm] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  const [gender, setGender] = useState([])
  const [tableData, setTableData] = useState([])
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);

  ///////////////////// Navbar
  /// State District Tehsil
  const State = localStorage.getItem('StateLogin');
  const District = localStorage.getItem('DistrictLogin');
  const Tehsil = localStorage.getItem('TehsilLogin');

  const userID = localStorage.getItem('userID');

  //// access the source from local storage
  const SourceUrlId = localStorage.getItem('loginSource');

  //// access the source name from local storage
  const SourceNameUrlId = localStorage.getItem('SourceNameFetched');
  // console.log(userID);


  const [sourceOptionNav, setSourceOptionNav] = useState([]);
  const [selectedSourceeNav, setSelectedSourceeNav] = useState(SourceUrlId || '');

  const [stateOptionsNav, setStateOptionsNav] = useState([]);
  const [selectedStateNav, setSelectedStateNav] = useState(State || '')

  const [districtOptionsNav, setDistrictOptionsNav] = useState([]);
  const [selectedDistrictNav, setSelectedDistrictNav] = useState(District || '')

  const [talukaOptionsNav, setTalukaOptionsNav] = useState([])
  const [selectedTalukaNav, setSelectedTalukaNav] = useState(Tehsil || '')

  const [sourceNameOptionsNav, setSourceNameNav] = useState([])
  const [selectedNameNav, setSelectedNameNav] = useState('')

  //////////////// form state district tehsil and source name useState
  const [sourceOption, setSourceOption] = useState([]);
  const [selectedSourcee, setSelectedSourcee] = useState('');

  const [stateOptions, setStateOptions] = useState([]);
  const [selectedState, setSelectedState] = useState('')

  const [districtOptions, setDistrictOptions] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState('')

  const [talukaOptions, setTalukaOptions] = useState([])
  const [selectedTaluka, setSelectedTaluka] = useState('')

  const [sourceNameOptions, setSourceName] = useState([])
  const [selectedName, setSelectedName] = useState('')

  const [roleForm, setRoleForm] = useState([])
  const [selectedRole, setSelectedRole] = useState('')
  const [updateSrc, setUpdateSrc] = useState(true); /////////// update user form
  const [deleteSrc, setDeleteSrc] = useState(true); ///////delete user
  const [deleteModel, setDeleteModel] = useState(false); /////// model Delete
  const [showModal, setShowModal] = useState(false); /////// model Registered
  const [mandotoryModel, setMandotoryModel] = useState(false); ////////////// Mandotory Fields
  const [updateModel, setUpdateModel] = useState(false); ////////////// Mandotory Fields
  const [existModel, setExistModel] = useState(false); ////////////// ExistFields
  const [formEnabled, setFormEnabled] = useState(false); ////////// disabled
  const [loading, setLoading] = useState(true)

  ////////////// navbar useState 
  useEffect(() => {
    // Fetch source options
    axios.get(`${Port}/Screening/Source_Get/?source_pk_id=${SourceUrlId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      .then(response => {
        setSourceOptionNav(response.data);
      })
      .catch(error => {
        console.error('Error fetching sources:', error);
      });
  }, []);

  //// Soure State against selected source
  useEffect(() => {
    if (selectedSourceeNav) {
      axios.get(`${Port}/Screening/source_and_pass_state_Get/${selectedSourceeNav}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })
        .then(response => {
          setStateOptionsNav(response.data);
        })
        .catch(error => {
          console.log('Error while fetching state data:', error);
        });
    }
  }, [selectedSourceeNav]);

  //// Soure District against selected source state
  useEffect(() => {
    if (selectedStateNav) {
      axios.get(`${Port}/Screening/state_and_pass_district_Get/${selectedSourceeNav}/${selectedStateNav}/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })
        .then(response => {
          setDistrictOptionsNav(response.data);
        })
        .catch(error => {
          console.error("Error fetching districts against state data:", error);
        });
    }
  }, [selectedStateNav]);

  //// Soure Taluka against selected source district
  useEffect(() => {
    if (selectedDistrictNav) {
      axios.get(`${Port}/Screening/district_and_pass_taluka_Get/${selectedSourceeNav}/${selectedDistrictNav}/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })
        .then(response => {
          setTalukaOptionsNav(response.data);
        })
        .catch(error => {
          console.error("Error fetching taluka data:", error);
        });
    }
  }, [selectedDistrictNav]);

  //// Soure Name against selected source Taluka
  useEffect(() => {
    if (selectedTalukaNav) {
      axios.get(`${Port}/Screening/taluka_and_pass_SourceName_Get/?SNid=${selectedTalukaNav}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })
        .then(response => {
          setSourceNameNav(response.data);
        })
        .catch(error => {
          console.error("Error fetching Source Name against Taluka data:", error);
        });
    }
  }, [selectedTalukaNav]);

  ////////////// modal Registered 
  const handleRegisterModel = () => {
    setShowModal(false);
  };

  ////////////// Delete Model
  const handleDeleteModel = () => {
    setDeleteModel(false);
  };

  ////////////// Mandotory Model
  const handleMandotoryModel = () => {
    setMandotoryModel(false);
  };

  ////////////// Mandotory Model
  const handleUpdateModel = () => {
    setUpdateModel(false);
  };

  ////////////// Exist Model
  const handleExistModel = () => {
    setExistModel(false);
  };

  ////////////////////////// Form value dropdown get ///////////////////////////////
  console.log(selectedSourcee,);
  useEffect(() => {
    // Fetch source options
    axios.get(`${Port}/Screening/Source_Get/`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      .then(response => {
        setSourceOption(response.data);
      })
      .catch(error => {
        console.error('Error fetching sources:', error);
      });
  }, []);

  //// Soure State against selected source
  useEffect(() => {
    if (selectedSourcee) {
      axios.get(`${Port}/Screening/source_and_pass_state_Get/${selectedSourcee}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
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
      axios.get(`${Port}/Screening/state_and_pass_district_Get/${selectedSourcee}/${selectedState}/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
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
      axios.get(`${Port}/Screening/district_and_pass_taluka_Get/${selectedSourcee}/${selectedDistrict}/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
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
      // axios.get(`${Port}/Screening/taluka_and_pass_SourceName_Get/${selectedSourcee}/${selectedTaluka}/`,
      axios.get(`${Port}/Screening/taluka_and_pass_SourceName_Get/?SNid=${selectedTaluka}&So=${selectedSourcee}&source_pk_id=${SourceNameUrlId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
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

  /////////// role
  useEffect(() => {
    if (selectedSourcee) {
      axios.get(`${Port}/Screening/agg_role_info_get/${selectedSourcee}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })
        .then(response => {
          setRoleForm(response.data);
        })
        .catch(error => {
          console.error("Error fetching Source Name against Taluka data:", error);
        });
    }
  }, [selectedSourcee]);

  /////////////////// completed
  //// Table Get
  useEffect(() => {
    const fetchTable = async () => {
      try {
        const response = await axios.get(`${Port}/Screening/User_GET/?clg_source=${SourceUrlId}&clg_source_name_id=${SourceNameUrlId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          })
        setTableData(response.data)
        // console.log(tableData);
        setLoading(false)
      }
      catch (error) {
        console.log('Error Fetching Data', error);
        setLoading(false)
      }
    }
    fetchTable();
  }, [])

  //// Gender Get Dropdown
  useEffect(() => {
    const fetchGender = async () => {
      try {
        const response = await axios.get(`${Port}/Screening/Gender_GET/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          })
        setGender(response.data)
        console.log(gender);
      }
      catch (error) {
        console.log('Error Fetching Gender', error)
      }
    }
    fetchGender();
  }, [])

  const toggleForm = () => {
    setShowForm(!showForm);
    setTransitioning(true);

    setTimeout(() => {
      setTransitioning(false);
    }, 400);
  };

  const [formData, setFormData] = useState({
    clg_ref_id: "",
    clg_gender: "",
    clg_Date_of_birth: "",
    clg_mobile_no: "",
    clg_email: "",
    clg_address: "",
    password: "1234",
    password2: "1234",
    pk: '',
    clg_source_id: '',
    clg_states_id: '',
    clg_district_id: '',
    clg_tehsil_id: '',
    clg_source_name_id: '',
    clg_grppp_id: '',
    clg_genderr_id: ''
  });

  const resetForm = () => {
    setFormData({
      clg_ref_id: "",
      clg_gender: "",
      clg_Date_of_birth: "",
      clg_mobile_no: "",
      clg_email: "",
      clg_address: "",
      password: "1234",
      password2: "1234",
      pk: '',
    });

    setSelectedSourcee("");
    setSelectedState("");
    setSelectedDistrict("");
    setSelectedTaluka("");
    setSelectedName("")
    setSelectedRole("")
  }

  const [errors, setErrors] = useState({
    clg_source: "",
    clg_state: "",
    clg_district: "",
    clg_tahsil: "",
    clg_source_name: "",
    Group_id: "",
    clg_ref_id: "",
    clg_gender: "",
    clg_Date_of_birth: "",
    clg_mobile_no: "",
    clg_email: "",
    clg_address: "",
  });

  const validateForm = () => {
    const newErrors = {};

    if (!formData.clg_source) {
      newErrors.clg_source = 'Source is required';
    }

    if (!formData.clg_state) {
      newErrors.clg_state = 'Source State is required';
    }

    if (!formData.clg_district) {
      newErrors.clg_district = 'Source Districtr is required';
    }

    if (!formData.clg_tahsil) {
      newErrors.clg_tahsil = 'Source Tehsil is required';
    }

    if (!formData.clg_source_name) {
      newErrors.clg_source_name = 'Source Name is required';
    }

    if (!formData.Group_id) {
      newErrors.Group_id = 'Role is required';
    }

    if (!formData.clg_ref_id) {
      newErrors.clg_ref_id = 'Name is required';
    }

    if (!formData.clg_gender) {
      newErrors.clg_gender = 'Gender is required';
    }

    if (!formData.clg_Date_of_birth) {
      newErrors.clg_Date_of_birth = 'DOB is required';
    }

    if (!formData.clg_mobile_no) {
      setErrors.clg_mobile_no = 'Mobile no is required';
    }

    if (!formData.clg_email) {
      newErrors.clg_email = 'Email is required';
    }

    if (!formData.clg_address) {
      newErrors.clg_address = 'Address is required';
    }
    setErrors(newErrors);
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    console.log('formmmmmmmmmmmm', formData);

    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === 'clg_source') {
      setSelectedSourcee(value);
    } else if (name === 'clg_state') {
      setSelectedState(value);
    } else if (name === 'clg_district') {
      setSelectedDistrict(value);
    } else if (name === 'clg_tahsil') {
      setSelectedTaluka(value);
    } else if (name === 'clg_source_name') {
      setSelectedName(value);
    } else if (name === 'grp_id') {
      setSelectedRole(value);
    }

    setErrors({ ...errors, [name]: '' });

    if (name === 'clg_mobile_no') {
      // Mobile number validation
      const indianMobilePattern = /^[6-9]\d{9}$/;
      if (value === '') {
        setErrors({ ...errors, clg_mobile_no: 'Mobile Number is required' });
      } else if (!indianMobilePattern.test(value)) {
        setErrors({ ...errors, clg_mobile_no: 'Invalid Mobile Number' });
      } else {
        setErrors({ ...errors, clg_mobile_no: 'Verified' });
      }
    } else if (name === 'clg_ref_id') {
      // Name validation
      if (value === '') {
        setErrors({ ...errors, clg_ref_id: 'Name is required' });
      } else {
        const words = value.trim().split(' ');
        if (words.length > 3) {
          setErrors({ ...errors, clg_ref_id: 'Name cannot contain more than three words' });
        } else {
          setErrors({ ...errors, clg_ref_id: '' });
        }
      }
    } else if (name === 'clg_email') {
      // Email validation
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (value === '') {
        setErrors({ ...errors, clg_email: 'Email is required' });
      } else if (!emailPattern.test(value)) {
        setErrors({ ...errors, clg_email: 'Invalid Email Address' });
      } else {
        setErrors({ ...errors, clg_email: '' });
      }
    } else if (name === 'clg_Date_of_birth') {
      // Date of birth validation
      const dob = new Date(value);
      const eighteenYearsAgo = new Date();
      eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

      if (dob > eighteenYearsAgo) {
        setErrors({ ...errors, clg_Date_of_birth: 'Must be 18 years or older' });
      } else {
        setErrors({ ...errors, clg_Date_of_birth: '' });
      }
    } else {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm();

    if (formData.clg_mobile_no.length < 10) {
      console.log('Contact number must be at least 10 characters long.');
      alert("Contact number must be at least 10 digit long.");
      return;
    }

    if (isValid) {
      const userData = {
        ...formData,
        password: "1234",
        password2: "1234",
        clg_source: formData.clg_source,
        clg_state: formData.clg_state,
        clg_district: formData.clg_district,
        clg_tahsil: formData.clg_tahsil,
        clg_source_name: formData.clg_source_name,
        clg_added_by: userID,
      };

      if (updateSrc) {
        userData.clg_modify_by = userID;
      }

      try {
        if (!updateSrc) {
          const response = await fetch(`${Port}/Screening/register/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify(userData),
          });

          if (response.status === 200) {
            const data = await response.json();
            setShowModal(true);
            setTableData(prevTableData => [...prevTableData, data]); // Update table data immediately
            console.log('Data sent successfully:', data);
            resetForm();
          } else {
            console.error('User Registered Successfully:', response.statusText);
            alert('User Registered Successfully:', response.statusText);
          }
        } else {
          const response = await fetch(`${Port}/Screening/User_PUT/${formData.pk}/`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
          });

          if (response.ok) {
            console.log('Request successful:', response);
            alert('User Updated Successfully');
            const updatedUser = await response.json();

            // Find the index of the updated user in tableData
            const index = tableData.findIndex(user => user.pk === updatedUser.pk);

            // If the user exists in tableData, update it, otherwise, do nothing
            if (index !== -1) {
              setTableData(prevTableData => {
                const updatedTableData = [...prevTableData];
                updatedTableData[index] = updatedUser;
                return updatedTableData;
              });
            }
          } else if (response.status === 400) {
            alert('Fill the * mark Field');
          } else if (response.status === 409) {
            console.error('Conflict. The resource already exists.');
            alert('User Already Exists');
          } else {
            console.error('Error:', response.statusText);
            alert('Error:', response.statusText);
          }
        }
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      console.log('Form has errors, please correct them.');
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const isValid = validateForm();

  //   if (formData.clg_mobile_no.length < 10) {
  //     console.log('Contact number must be at least 10 characters long.');
  //     alert("Contact number must be at least 10 digit long.");
  //     return;
  //   }

  //   if (isValid) {
  //     const userData = {
  //       ...formData,
  //       password: "1234",
  //       password2: "1234",
  //       clg_source: formData.clg_source,
  //       clg_state: formData.clg_state,
  //       clg_district: formData.clg_district,
  //       clg_tahsil: formData.clg_tahsil,
  //       clg_source_name: formData.clg_source_name,
  //       clg_added_by: userID,
  //     };

  //     if (updateSrc) {
  //       userData.clg_modify_by = userID;  // Add clg_modify_by for PUT request
  //     }

  //     try {
  //       if (!updateSrc) {
  //         const response = await fetch(`${Port}/Screening/register/`, {
  //           method: 'POST',
  //           headers: {
  //             'Content-Type': 'application/json',
  //           },
  //           body: JSON.stringify(userData),
  //         });

  //         // Handle POST response

  //       }
  //       else {
  //         const response = await fetch(`${Port}/Screening/User_PUT/${formData.pk}/`, {
  //           method: 'PUT',
  //           headers: {
  //             'Content-Type': 'application/json',
  //           },
  //           body: JSON.stringify(userData),
  //         });

  //         console.log('hhhhhhhhhhhhhhhh', userData);

  //         if (response.status === 200) {
  //           console.log('Updated successfully:', response);
  //           setUpdateModel(true);
  //         } else {
  //           console.error('Error updating user. Unexpected response:', response);
  //         }
  //       }
  //     } catch (error) {
  //       console.error('Error:', error);
  //     }
  //   } else {
  //     console.log('Form has errors, please correct them.');
  //   }
  // };

  ////// table row click

  const handleTableRowClick = async (pk) => {
    try {
      const response = await fetch(`${Port}/Screening/User_GET_ID/${pk}/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
      const data = await response.json();

      console.log('Fetched Data:', data);
      console.log(data.source_id, 'hhhhhhhhhhhhhhhhhhhhhhhhhhhhh');

      setFormData((prevState) => ({
        ...prevState,
        clg_source_id: data.clg_source,
        clg_source: data.source_id,

        clg_states_id: data.clg_state,
        clg_state: data.state_id,

        // clg_district: data.clg_district,
        clg_district_id: data.clg_district,
        clg_district: data.district_id,

        // clg_tahsil: data.clg_tahsil,
        clg_tehsil_id: data.clg_tahsil,
        clg_tahsil: data.tehsil_id,

        // clg_source_name: data.clg_source_name,
        clg_source_name_id: data.clg_source_name,
        clg_source_name: data.source_name_id,

        // grp_id: data.grp_id,

        clg_grppp_id: data.grp_id,
        grp_id: data.group_id,

        clg_genderr_id: data.clg_gender,
        clg_gender: data.gender_id,

        // clg_gender: data.clg_gender,
        clg_email: data.clg_email,
        clg_Date_of_birth: data.clg_Date_of_birth,
        clg_mobile_no: data.clg_mobile_no,
        clg_address: data.clg_address,
        clg_ref_id: data.clg_ref_id,
        pk: data.pk,
      }));

    } catch (error) {
      console.error('Error fetching detailed information:', error);
    }

    setSelectedRowIndex(pk);
  };

  const handleSearch = async () => {
    let apiUrl = `${Port}/Screening/filter-User/?`;

    if (selectedSourceeNav) {
      apiUrl += `clg_source=${selectedSourceeNav}&`;
    }

    if (selectedStateNav) {
      apiUrl += `clg_state=${selectedStateNav}&`;
    }

    if (selectedDistrictNav) {
      apiUrl += `clg_district=${selectedDistrictNav}&`;
    }

    if (selectedTalukaNav) {
      apiUrl += `clg_tahsil=${selectedTalukaNav}&`;
    }

    if (selectedName) {
      apiUrl += `clg_source_name=${selectedName}&`;
    }

    try {
      const response = await axios.get(apiUrl,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
      setTableData(response.data);
      console.log(response.data);
    } catch (error) {
      console.log('Error while fetching data', error);
    }
  };

  ////////////// Delete
  const handleDelete = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');

    if (!confirmDelete) {
      // User clicked Cancel, do nothing
      return;
    }

    console.log('Received sourceId:', formData.pk);

    try {
      const deleteUrl = `${Port}/Screening/User_DELETE/${formData.pk}/${userID}/`;
      await axios.delete(deleteUrl,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });

      console.log('Data Deleted successfully');

      // Assuming tableData and setTableData are your state variables for the table
      setTableData(prevTableData =>
        prevTableData.filter(item => item.pk !== formData.pk)
      );

      setDeleteModel(true);
      setFormData({});
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  const handleClicked = () => {
    setFormEnabled(true);
    setUpdateSrc(false); // Set to false to indicate updating an existing user
  }

  const handleClickCombined = () => {
    toggleForm();
    handleClicked();
  };

  // console.log('userData in table', formData);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page when changing rows per page
  };

  ////// button condition
  const [formAction, setFormAction] = useState('');

  return (
    <div className="backgrounduser">
      <div class="content-wrapper">
        <div class="content-header">
          <div class="container-fluid">
            <div className="card userlistcard">
              <div class="row">
                <div class="col">
                  <h5 className='name'>User List</h5>
                </div>
              </div>

              <div className="dropdownall mb-3">
                <Box>
                  <div class="container text-center">
                    <div class="row" style={{ display: 'flex', justifyContent: 'center' }}>
                      <div class="col textfiledcol" style={{ color: 'white' }}>
                        <TextField
                          select
                          className="Adduserformfieldssss"
                          size="small"
                          label="Source"
                          id="select-small"
                          variant="outlined"
                          value={selectedSourceeNav}
                          onChange={(e) => setSelectedSourceeNav(e.target.value)}
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
                          {sourceOptionNav.map(drop => (
                            <MenuItem key={drop.clg_source}
                              value={drop.source_pk_id}
                            >
                              {drop.source}
                            </MenuItem>
                          ))}
                        </TextField>
                      </div>

                      <div class="col textfiledcol" style={{ color: 'white' }}>
                        <TextField
                          select
                          className="Adduserformfieldssss"
                          size="small"
                          label="Source State"
                          id="select-small"
                          variant="outlined"
                          value={selectedStateNav}
                          onChange={(e) => setSelectedStateNav(e.target.value)}
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
                          <MenuItem value="">Select State</MenuItem>
                          {stateOptionsNav.map(drop => (
                            <MenuItem key={drop.source_state}
                              value={drop.source_state}
                            >
                              {drop.state_name}
                            </MenuItem>
                          ))}
                        </TextField>
                      </div>

                      <div class="col textfiledcol" style={{ color: 'white' }}>
                        <TextField
                          select
                          className="Adduserformfieldssss"
                          size="small"
                          label="Source District"
                          id="select-small"
                          variant="outlined"
                          value={selectedDistrictNav}
                          onChange={(e) => setSelectedDistrictNav(e.target.value)}
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
                          <MenuItem value="">Select District</MenuItem>
                          {districtOptionsNav.map(drop => (
                            <MenuItem key={drop.source_district}
                              value={drop.source_district}
                            >
                              {drop.dist_name}
                            </MenuItem>
                          ))}
                        </TextField>
                      </div>

                      <div class="col textfiledcol" style={{ color: 'white' }}>
                        <TextField
                          select
                          className="Adduserformfieldssss"
                          size="small"
                          label="Select Tehsil"
                          value={selectedTalukaNav}
                          onChange={(e) => setSelectedTalukaNav(e.target.value)}
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
                        >
                          <MenuItem value="">Select Tehsil</MenuItem>
                          {talukaOptionsNav.map(drop => (
                            <MenuItem key={drop.source_taluka}
                              value={drop.source_taluka}
                            >
                              {drop.tahsil_name}
                            </MenuItem>
                          ))}
                        </TextField>

                      </div>

                      <div class="col textfiledcol" style={{ color: 'white' }}>
                        <TextField
                          select
                          className="Adduserformfieldssss"
                          value={selectedNameNav}
                          onChange={(e) => setSelectedNameNav(e.target.value)}
                          size="small"
                          label="Source Name"
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
                        >
                          <MenuItem value="">Select Source Name</MenuItem>
                          {sourceNameOptionsNav.map(drop => (
                            <MenuItem key={drop.source_pk_id}
                              value={drop.source_pk_id}
                            >
                              {drop.source_names}
                            </MenuItem>
                          ))}
                        </TextField>

                      </div>

                      <div className='col'>
                        <button
                          type='button'
                          className='btn btn-sm searchcitizen'
                          onClick={handleSearch}
                        >
                          Search
                        </button>
                      </div>

                      {canAddUser && <div>
                        <Link to=''>
                          <button type='button' className='btn addicon'>
                            <PersonAddAltIcon className='personaddicon'
                              // onClick={handleClickCombined}
                              onClick={() => {
                                handleClickCombined();
                                resetForm();
                                setFormAction('add');//// button 
                              }}
                            />
                          </button>
                        </Link>
                      </div>
                      }
                    </div>
                  </div>
                </Box>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="belowdrop">
        <div class="container">
          <div class="row">
            <div className={`col ${showForm ? 'col-md-6' : 'd-none'}${transitioning ? ' sliding-out' : ''}`}>
              <div className="card ml-3">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <h5 className='userheadername'>Register New User</h5>
                    <div class="elementregisteruser"></div>

                    <div className="ml-auto mr-3">
                      <DriveFileRenameOutlineOutlinedIcon
                        className={`editiconuser mr-2 ${updateSrc ? '' : 'disabled-icon'}`}
                        onClick={() => {
                          setUpdateSrc(true);
                          setFormEnabled(true);
                          setFormAction('update'); //// button 
                        }}
                        disabled={!formEnabled}
                      />
                      <DeleteOutlineOutlinedIcon
                        className={`deleteiconuser ${formEnabled ? '' : 'disabled-icon'}`}
                        onClick={() => {
                          setDeleteSrc(false);
                          handleDelete();
                        }}
                        disabled={!formEnabled}
                      />
                    </div>
                  </div>

                  {/* <div className="row form"> */}
                  <div className="row form">
                    <div className="col-md-6" style={{ marginTop: '2px' }}>
                      <label htmlFor="select" class="visually-hidden labelnameuser">
                        Source<span className="text-danger">*</span>
                      </label>
                      <select
                        as="select"
                        className={`form-control inputuser`}
                        name="clg_source"
                        id="outlined-select"
                        onChange={handleChange}
                        value={selectedSourcee}
                      >
                        <option value="">{formData.clg_source_id ? formData.clg_source_id : 'Select Source'}</option>
                        {sourceOption.map((source) => (
                          <option key={source.source_pk_id} value={source.source_pk_id}>
                            {source.source}
                          </option>
                        ))}
                      </select>
                      {errors.clg_source && <div className="invalid-feedback">{errors.clg_source}</div>}
                    </div>

                    <div className="col-md-6 mt-1">
                      <label htmlFor="select" className={`visually-hidden labelnameuser`} id="newcal">
                        Source State<span className="text-danger">*</span>
                      </label>
                      <select
                        as="select"
                        className={`form-control inputuser`}
                        name="clg_state"
                        id="outlined-select"
                        onChange={handleChange}
                        value={selectedState}
                      >
                        <option value="">{formData.clg_states_id ? formData.clg_states_id : 'Select State'}</option>
                        {stateOptions.map((state) => (
                          <option key={state.source_state} value={state.source_state}>
                            {state.state_name}
                          </option>
                        ))}
                      </select>
                      {errors.clg_state && <div className="invalid-feedback">{errors.clg_state}</div>}
                    </div>
                  </div>

                  <div className="row form">
                    <div className="col-md-6">
                      <label htmlFor="select" className={`visually-hidden labelnameuser`} id="newcal">
                        Source District<span className="text-danger">*</span>
                      </label>
                      <select
                        as='select'
                        className={`form-control inputuser`}
                        name='clg_district'
                        id='outlined-select'
                        onChange={handleChange}
                        value={selectedDistrict}
                      >
                        <option value="">{formData.clg_district_id ? formData.clg_district_id : 'Select District'}</option>
                        {districtOptions.map((district) => (
                          <option key={district.source_district} value={district.source_district}>
                            {district.dist_name}
                          </option>
                        ))}
                      </select>
                      {errors.clg_district && <div className="invalid-feedback">{errors.clg_district}</div>}
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="select"
                        className={`visually-hidden labelnameuser`}
                        id="newcal">Source Tehsil<span className="text-danger">*</span></label>
                      <select
                        as='select'
                        className={`form-control inputuser`}
                        name='clg_tahsil'
                        id='outlined-select'
                        onChange={handleChange}
                        value={selectedTaluka}
                      >
                        <option value="">{formData.clg_tehsil_id ? formData.clg_tehsil_id : 'Select Tehsil'}</option>
                        {talukaOptions.map((taluka) => (
                          <option key={taluka.source_taluka} value={taluka.source_taluka}>
                            {taluka.tahsil_name}
                          </option>
                        ))}
                      </select>
                      {errors.clg_tahsil && <div className="invalid-feedback">{errors.clg_tahsil}</div>}
                    </div>
                  </div>

                  <div className="row form">
                    <div className="col-md-6">
                      <label htmlFor="select"
                        className={`visually-hidden labelnameuser`}
                        id="newcal">Source Name<span className="text-danger">*</span></label>
                      <select
                        as='select'
                        className={`form-control inputuser`}
                        name='clg_source_name'
                        id='outlined-select'
                        onChange={handleChange}
                        value={selectedName}
                      >
                        <option value="">{formData.clg_source_name_id ? formData.clg_source_name_id : 'Select Source Name'}</option>
                        {sourceNameOptions.map((source) => (
                          <option key={source.source_pk_id} value={source.source_pk_id}>
                            {source.source_names}
                          </option>
                        ))}
                      </select>
                      {errors.clg_source_name && <div className="invalid-feedback">{errors.clg_source_name}</div>}
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="select"
                        className={`visually-hidden labelnameuser`}
                        id="newcal">Role<span className="text-danger">*</span></label>
                      <select
                        as='select'
                        className={`form-control inputuser`}
                        name='grp_id'
                        id='outlined-select'
                        onChange={handleChange}
                        value={selectedRole}
                      >
                        <option value="">{formData.clg_grppp_id ? formData.clg_grppp_id : 'Select Role'}</option>
                        {roleForm.map((source) => (
                          <option key={source.Group_id} value={source.Group_id}>
                            {source.grp_name}
                          </option>
                        ))}
                      </select>
                      {errors.clg_source_name && <div className="invalid-feedback">{errors.clg_source_name}</div>}
                    </div>
                  </div>

                  <div className="row form1">
                    <div className="col-md-6">
                      <label for="Name" class="visually-hidden labelnameuser">Name<span className="text-danger">*</span></label>
                      <input type="text"
                        className={`form-control inputuser`}
                        placeholder="Enter Name"
                        name="clg_ref_id"
                        value={formData.clg_ref_id}
                        onChange={handleChange}
                        onInput={(e) => {
                          e.target.value = e.target.value.replace(/[^0-9a-zA-Z]/g, '');
                        }}
                      />
                      {errors.clg_ref_id && <span className="text-danger">{errors.clg_ref_id}</span>}
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="Gender" className="visually-hidden labelnameuser">Gender<span className="text-danger">*</span></label>
                      <select className={`form-control inputuser ${errors.clg_gender ? 'is-invalid' : ''}`}
                        aria-label="Default select example"
                        value={formData.clg_gender}
                        onChange={handleChange}
                        name='clg_gender'
                      >
                        <option value="">{formData.clg_genderr_id ? formData.clg_genderr_id : 'Select Gender'}</option>
                        {gender.map((dropdown) => (
                          <option key={dropdown.gender_pk_id} value={dropdown.gender_pk_id}>
                            {dropdown.gender}
                          </option>
                        ))}
                      </select>
                      {errors.clg_gender && <div className="invalid-feedback">{errors.clg_gender}</div>}
                    </div>
                  </div>

                  <div className="row form1">
                    <div className="col-md-6">
                      <label for="Name" class="visually-hidden labelnameuser">DOB<span className="text-danger">*</span></label>
                      <input type="date"
                        className={`form-control inputuser`}
                        placeholder="Enter Name"
                        name="clg_Date_of_birth"
                        value={formData.clg_Date_of_birth}
                        onChange={handleChange}
                        max={new Date().toISOString().split('T')[0]}
                      />
                      {errors.clg_Date_of_birth && <span className="text-danger">{errors.clg_Date_of_birth}</span>}
                    </div>

                    <div className="col-md-6">
                      <label for="phone number" class="visually-hidden labelnameuser">Mobile Number<span className="text-danger">*</span></label>
                      <input type="number"
                        className={`form-control inputuser`}
                        placeholder="Enter number"
                        name="clg_mobile_no"
                        value={formData.clg_mobile_no}
                        onChange={handleChange}
                        onInput={(e) => {
                          let inputValue = e.target.value.replace(/[^0-9]/g, '');
                          if (inputValue.length > 10) {
                            inputValue = inputValue.slice(0, 10);
                          }
                          e.target.value = inputValue;
                        }}
                      />
                      {errors.clg_mobile_no && errors.clg_mobile_no !== 'Verified' && (
                        <span className="text-danger">{errors.clg_mobile_no}</span>
                      )}
                      {errors.clg_mobile_no === 'Verified' && (
                        <span className="text-success">{errors.clg_mobile_no}</span>
                      )}
                    </div>
                  </div>

                  <div className="row form1 mb-3">
                    <div className="col-md-6">
                      <label for="mail" class="visually-hidden labelnameuser">Email ID<span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className={`form-control inputuser`}
                        placeholder="Enter Email Id"
                        name="clg_email"
                        value={formData.clg_email}
                        onChange={handleChange}
                      />
                      {errors.clg_email && <span className="text-danger">{errors.clg_email}</span>}
                    </div>

                    <div className="col-md-6">
                      <label for="Address" class="visually-hidden labelnameuser">Address<span className="text-danger">*</span></label>
                      <input type="text"
                        className={`form-control inputuser`}
                        placeholder="Enter Address"
                        name="clg_address"
                        value={formData.clg_address}
                        onChange={handleChange}
                      />
                      {errors.clg_address && <span className="text-danger">{errors.clg_address}</span>}
                    </div>
                  </div>

                  {/* <div className="row">
                    <button type="submit" className={`btn btn-sm useraddbtn`}>Submit</button>
                  </div> */}
                  <div className="row">
                    {formAction === 'add' && (
                      <button type="submit" className={`btn btn-sm useraddbtn`}>Submit</button>
                    )}
                    {formAction === 'update' && (
                      <button type="submit" className={`btn btn-sm useraddbtn`}>Update</button>
                    )}
                    {formAction === 'view' && (
                      null
                    )}
                  </div>
                </form>

                {/* regitered model */}
                <Modal show={showModal} onHide={handleRegisterModel}>
                  <Modal.Header>
                    <Modal.Title></Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    User Registered successfully.
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="success" onClick={handleRegisterModel}>
                      Close
                    </Button>
                  </Modal.Footer>
                </Modal>

                {/* delete model */}
                <Modal show={deleteModel} onHide={handleDeleteModel}>
                  <Modal.Header>
                    <Modal.Title></Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    User Deleted Successfully
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="success" className="btn btn-sm" onClick={handleDeleteModel}>
                      Close
                    </Button>
                  </Modal.Footer>
                </Modal>

                {/* mandotory model */}
                <Modal show={mandotoryModel} onHide={handleMandotoryModel}>
                  <Modal.Header>
                    <Modal.Title></Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    Fill the Mandotory Fields
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="danger" className="btn btn-sm" onClick={handleMandotoryModel}>
                      Close
                    </Button>
                  </Modal.Footer>
                </Modal>

                {/* update model */}
                <Modal show={updateModel} onHide={handleUpdateModel}>
                  <Modal.Header>
                    <Modal.Title></Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    User Details Updated Successfully
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="success" className="btn btn-sm" onClick={handleUpdateModel}>
                      Close
                    </Button>
                  </Modal.Footer>
                </Modal>

                {/* exist model */}
                <Modal show={existModel} onHide={handleExistModel}>
                  <Modal.Header>
                    <Modal.Title></Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    User Already Exist
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="danger" className="btn btn-sm" onClick={handleExistModel}>
                      Close
                    </Button>
                  </Modal.Footer>
                </Modal>
              </div>
            </div>

            <div className={`col ${showForm ? 'col-md-6' : 'col-md-12'}`}>
              <div className="row">
                <div className='col-md-2 ml-3'>
                  <input className="form-control newsearchuser"
                    placeholder='Search User'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <table className="table table-borderless">
                <thead>
                  <tr className="card cardheaduser11">
                    <th className="col-md-1 haedtitle">Sr No</th>
                    <th className="col-md-2 haedtitle">User Name</th>
                    <th className="col-md-3 haedtitle">Mobile No</th>
                    <th className="col-md-3 haedtitle">Group</th>
                    <th className="col-md-2 haedtitle">Email Id</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="text-center">
                        <CircularProgress className='circular-progress-containeruser' style={{ margin: 'auto' }} />
                      </td>
                    </tr>
                  ) : (
                    <>
                      {tableData
                        .filter((data) =>
                          Object.values(data).some((value) =>
                            value !== null &&
                            value !== undefined &&
                            value.toString().toLowerCase().includes(searchQuery.toLowerCase())
                          )
                        )
                        .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
                        .map((item, index) => {
                          const serialNumber = index + 1 + page * rowsPerPage;
                          const isSelected = selectedRowIndex === item.pk;

                          return (
                            <tr
                              key={index}
                              className={`card cardbodyuser22 ${isSelected ? 'selected-row' : ''}`}
                              // onClick={() => handleTableRowClick(item.pk)}
                              onClick={() => {
                                handleTableRowClick(item.pk)
                                setFormAction('view'); //// button 
                              }}
                            >
                              <td className="col-md-1">{serialNumber}</td>
                              <td className="col-md-2">{item.clg_ref_id}</td>
                              <td className="col-md-3">{item.clg_mobile_no}</td>
                              <td className="col-md-3">{item.grp_name}</td>
                              <td className="col-md-2">{item.clg_email}</td>
                            </tr>
                          );
                        })}
                      {tableData.length === 0 && (
                        <tr>
                          <td colSpan="5">No data found</td>
                        </tr>
                      )}
                    </>
                  )}
                </tbody>
              </table>

              <div className="userpaginationnn">
                <TablePagination
                  component="div"
                  count={tableData.length}
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

export default AddUser
