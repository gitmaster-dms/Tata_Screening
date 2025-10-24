import React, { useState, useEffect } from 'react';
import './Permission.css';
// import Navbar from './Navbar';
// import Sidebarnew from './Sidebar';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { styled } from '@mui/system';
import Sidebarnew from '../Sidebar';

const CustomSnackbar = styled(Snackbar)(({ theme }) => ({
    '& .MuiAlert-filledSuccess': {
        backgroundColor: '#4CAF50',
    },
    top: theme.spacing(2),
    right: theme.spacing(2),
}));


const Permission = () => {
    const permission = localStorage.getItem('permissions');
    const usergrp = localStorage.getItem('usergrp');
    console.log(usergrp, "gggggg");
    console.log(permission, "ppppppppppppppppeeeeeeeeeee");
    const classes = CustomSnackbar;
    const Port = process.env.REACT_APP_API_KEY;
    const [source, setSource] = useState([]);
    const [role, setRole] = useState([]);
    const [moduleSubmodule, setModuleSubmodule] = useState([]);
    const [allPermissionChecked, setAllPermissionChecked] = useState(false);
    const [moduleCheckboxes, setModuleCheckboxes] = useState({});
    const [submoduleCheckboxes, setSubmoduleCheckboxes] = useState({});
    const [sourceid, setSourceid] = useState("");
    const [roleid, setRoleid] = useState("");
    const [permission_list, setPermission_list] = useState([]);
    const [perId, setPerId] = useState("");
    const accessToken = localStorage.getItem('token');

    const [snackbarOpen, setSnackbarOpen] = useState(false);

    // Function to handle Snackbar close
    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };
    //get source api
    useEffect(() => {
        const fetchUserSourceDropdown = async () => {
            try {
                const response = await axios.get(`${Port}/Screening/source_GET/`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    })
                setSource(response.data)
                console.log(source);
            }
            catch (error) {
                console.log('Error while fetching data', error)
            }
        }
        fetchModuleSubmodule();
        fetchUserSourceDropdown()
    }, []);

    //fetch Role API
    // const fetchRole = async (id) => {
    //     try {
    //         const response = await axios.get(`${Port}/Screening/agg_role_info_get/${id}`)
    //         setRole(response.data)
    //         console.log(role, response.data)
    //     }
    //     catch (error) {
    //         console.log('Error while fetching data', error)
    //     }
    // }

    const fetchRole = async (id) => {
        try {
            let rolesResponse;

            // Check if the logged-in user is an admin
            if (usergrp === 'UG-ADMIN') {
                // If admin, fetch roles excluding the admin role
                rolesResponse = await axios.get(`${Port}/Screening/agg_role_info_get/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    });
                console.log(rolesResponse, "hhhhhhhhhhhhhh");
                const filteredRoles = rolesResponse.data.filter(role => role.grp_name !== 'UG-ADMIN' && role.grp_name !== 'UG-SUPERADMIN');
                setRole(filteredRoles);
            } else {
                // If superadmin or other role, fetch all roles
                const response = await axios.get(`${Port}/Screening/agg_role_info_get/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    });
                setRole(response.data);
            }
        } catch (error) {
            console.log('Error while fetching data', error);
        }
    };

    //Fetch module/submodule API
    const fetchModuleSubmodule = async (id) => {
        setSourceid(id);
        try {
            const response = await axios.get(`${Port}/Screening/combined/`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                })
            setModuleSubmodule(response.data)
            console.log(role, response.data)
        }
        catch (error) {
            console.log('Error while fetching data', error)
        }
    }

    const fetchRoleid = async (id) => {
        setRoleid(id);
        try {
            const response = await axios.get(`${Port}/Screening/permissions/${sourceid}/${id}/`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
            console.log('Role Permissions Response:', response.data);

            if (response.data.length === 0) {
                // Handle the case when the permission response is empty
                // You can reset or clear the relevant state here
                setPermission_list([]);
                setModuleCheckboxes({});
                setSubmoduleCheckboxes({});
                // Additional logic if needed...
                return;
            }

            setPermission_list(response.data);
            console.log(response.data[0].id, "jjjjjjjjjjjjjj");
            setPerId(response.data[0].id);
            const updatedModuleCheckboxes = {};
            const updatedSubmoduleCheckboxes = {};

            response.data.forEach((roleData) => {
                const { modules_submodule } = roleData;

                modules_submodule.forEach((moduleData) => {
                    const { moduleId, selectedSubmodules } = moduleData;

                    // Update module checkbox
                    updatedModuleCheckboxes[moduleId] = true;

                    // Update submodule checkboxes
                    selectedSubmodules.forEach((submodule) => {
                        updatedSubmoduleCheckboxes[submodule.submoduleId] = true;
                    });
                });
            });

            setModuleCheckboxes(updatedModuleCheckboxes);
            setSubmoduleCheckboxes(updatedSubmoduleCheckboxes);
        } catch (error) {
            console.log('Error while fetching role permissions', error);
        }
    };

    const handleAllPermissionChange = (event) => {
        const checked = event.target.checked;
        setAllPermissionChecked(checked);

        const updatedModuleCheckboxes = {};
        const updatedSubmoduleCheckboxes = {};

        moduleSubmodule.forEach((module) => {
            updatedModuleCheckboxes[module.module_id] = checked;

            module.submodules.forEach((submodule) => {
                updatedSubmoduleCheckboxes[submodule.Permission_id] = checked;
            });
        });

        setModuleCheckboxes(updatedModuleCheckboxes);
        setSubmoduleCheckboxes(updatedSubmoduleCheckboxes);
    };


    const handleModuleChange = (moduleId, checked) => {
        const updatedModuleCheckboxes = { ...moduleCheckboxes, [moduleId]: checked };
        setModuleCheckboxes(updatedModuleCheckboxes);

        const moduleToUpdate = moduleSubmodule.find((module) => module.module_id === moduleId);

        if (moduleToUpdate) {
            moduleToUpdate.submodules.forEach((submodule) => {
                setSubmoduleCheckboxes((prevSubmoduleCheckboxes) => ({
                    ...prevSubmoduleCheckboxes,
                    [submodule.Permission_id]: checked,
                }));
            });
        }
    };

    const handleSubmoduleChange = (submoduleId, checked) => {
        const updatedSubmoduleCheckboxes = { ...submoduleCheckboxes, [submoduleId]: checked };
        setSubmoduleCheckboxes(updatedSubmoduleCheckboxes);

        let moduleChanged = false;

        moduleSubmodule.forEach((module) => {
            const allSubmodulesChecked = module.submodules.every(
                (submodule) => updatedSubmoduleCheckboxes[submodule.Permission_id]
            );

            if (allSubmodulesChecked) {
                setModuleCheckboxes((prevModuleCheckboxes) => ({
                    ...prevModuleCheckboxes,
                    [module.module_id]: true,
                }));
                moduleChanged = true;
            } else if (module.submodules.every((submodule) => !updatedSubmoduleCheckboxes[submodule.Permission_id])) {
                setModuleCheckboxes((prevModuleCheckboxes) => ({
                    ...prevModuleCheckboxes,
                    [module.module_id]: false,
                }));
            }
        });

        if (!moduleChanged) {
            const parentModule = moduleSubmodule.find((module) =>
                module.submodules.some((submodule) => submodule.Permission_id === submoduleId)
            );

            if (parentModule) {
                setModuleCheckboxes((prevModuleCheckboxes) => ({
                    ...prevModuleCheckboxes,
                    [parentModule.id]: true,
                }));
            }
        }
    };

    //handlesubmit to POST PUT API 

    const handleSubmit = () => {
        const selectedData = {
            source: sourceid,
            role: roleid,
            modules_submodule: [], // Initialize as an empty array
            permission_status: 1,

        };

        moduleSubmodule.forEach((module) => {
            const selectedModule = {
                moduleId: module.module_id,
                moduleName: module.name,
                selectedSubmodules: [],
            };

            if (moduleCheckboxes[module.module_id]) {
                module.submodules.forEach((submodule) => {
                    if (submoduleCheckboxes[submodule.Permission_id]) {
                        selectedModule.selectedSubmodules.push({
                            submoduleId: submodule.Permission_id,
                            submoduleName: submodule.name,
                        });
                    }
                });

                if (selectedModule.selectedSubmodules.length > 0) {
                    selectedData.modules_submodule.push(selectedModule);
                }
            }
        });

        console.log(selectedData, "dddddddddddddd");

        // Check if modules_submodule is non-empty before making the API request
        if (permission_list == "") {
            if (selectedData.modules_submodule.length > 0) {
                axios.post(`${Port}/Screening/permissions/`, selectedData,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    })
                    .then((response) => {
                        console.log('Data posted successfully', response.data);
                        setSnackbarOpen(true);
                    })
                    .catch((error) => {
                        console.error('Error while posting data', error);
                    });
            } else {
                console.error('modules_submodule cannot be empty. Please select at least one module and submodule.');
            }
        }
        else {
            axios.put(`${Port}/Screening/permissions/${perId}/`, selectedData,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                })
                .then((response) => {
                    console.log('Data Updated successfully', response.data);
                    setSnackbarOpen(true);
                })
                .catch((error) => {
                    console.error('Error while posting data', error);
                });
        }
    };

    return (
        <div>
            {/* <Sidebarnew/> */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                className={classes.successSnackbar}
            >
                <MuiAlert
                    elevation={6}
                    variant="filled"
                    onClose={handleSnackbarClose}
                    severity="success"
                >
                    Data posted successfully!
                </MuiAlert>
            </Snackbar>
            <div class="content-wrapper backgroundadd">
                <div class="content-header">
                    <div class="container">
                        <div className='row'>
                            <div className='col-md-1'></div>
                            <div className='col-md-10 permission_list row'>
                                <div className='col-md-4'>
                                    <label class="visually-hidden inputfiledss p_lable">Source</label>
                                    <select
                                        class='form-control inputtype'
                                        name='sibling_count'
                                        id='outlined-select'
                                        onChange={e => {
                                            fetchRole(e.target.value)
                                            fetchModuleSubmodule(e.target.value)
                                        }}
                                    >
                                        <option value="">Select</option>
                                        {source.map(item => (
                                            <option key={item.source_code} value={item.source_pk_id}>{item.source}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className='col-md-4'>
                                    <label class="visually-hidden inputfiledss p_lable">User Roles:</label>
                                    <select
                                        class='form-control inputtype'
                                        name='sibling_count'
                                        id='outlined-select'
                                        onChange={e => fetchRoleid(e.target.value)}
                                    >
                                        <option value="">Select</option>
                                        {role.map(item => (
                                            <option key={item.Group_id} value={item.Group_id}>{item.grp_name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className='col-md-4'>
                                    <div className='all_permission'>
                                        <div class="form-check">
                                            <input class="form-check-input my-2" type="checkbox"
                                                value="" id="flexCheckDefault"
                                                checked={allPermissionChecked}
                                                onChange={handleAllPermissionChange}
                                            />
                                            <label class="form-check-label p_lable" for="flexCheckDefault">
                                                All Permission
                                            </label>
                                        </div>
                                    </div>
                                </div>

                            </div>

                        </div>

                        <div className='row mt-3'>
                            <div className='col-md-3 modules p-2'>
                                <p className='text-center my-auto'>Modules</p>
                            </div>
                            <div className='col-md-8 action p-2'>
                                <p className='text-center my-auto'>Sub Modules</p>
                            </div>
                        </div>

                        <div className='row'>
                            {moduleSubmodule.map(module => (<>
                                <div className='col-md-3 module-1 shadow-sm p-1 bg-body-tertiary rounded'>
                                    <div class="form-check mx-4">
                                        <input class="form-check-input my-2" type="checkbox"
                                            id={`module-${module.module_id}`}
                                            value={module.name}
                                            checked={moduleCheckboxes[module.module_id] || false}
                                            onChange={(e) => handleModuleChange(module.module_id, e.target.checked)}
                                        />
                                        <label class="form-check-label" for={`module-${module.module_id}`}>
                                            {module.name}
                                        </label>
                                    </div>
                                </div>

                                <div className='col-md-8 action-1 shadow-sm p-1 bg-body-tertiary rounded row'>
                                    {module.submodules.map(submodule => (
                                        <div className='col-'>
                                            <div class="form-check mx-2">
                                                <input class="form-check-input my-2" type="checkbox"
                                                    id={`submodule-${submodule.Permission_id}`}
                                                    value={submodule.name}
                                                    checked={submoduleCheckboxes[submodule.Permission_id] || false}
                                                    onChange={(e) =>
                                                        handleSubmoduleChange(submodule.Permission_id, e.target.checked)
                                                    }
                                                />
                                                <label class="form-check-label" for={`submodule-${submodule.Permission_id}`}>
                                                    {submodule.name}
                                                </label>
                                            </div>
                                        </div>))}
                                </div>
                            </>))}
                        </div>
                        <div className='col-md-12 d-flex justify-content-center my-2'>
                            <button className='btn permission-btn text-center' onClick={handleSubmit}>Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Permission
