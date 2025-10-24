import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Citizenlist.css'
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import axios from 'axios'
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import SearchIcon from '@mui/icons-material/Search';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';

const Citizenlist = () => {
    //permission code start
    const [canAddCitizen, setCanAddCitizen] = useState(false);
    const [canDelete, setCanDelete] = useState(false);
    const [canView, setCanView] = useState(false);
    const [canEdit, setCanEdit] = useState(false);
    const userID = localStorage.getItem('userID');
    console.log(userID);
    const accessToken = localStorage.getItem('token');
    
    //// access the source from local storage
    const source = localStorage.getItem('source');

    /////////// Roshni's Code Start /////////////////////
    const [viewInvestigation, setViewInvestigation] = useState(false);
    const viewInvest = localStorage.getItem('investiData');
    console.log("View Invest....", viewInvest);
    /////////// Roshni's Code End //////////////////////////

    useEffect(() => {
        const storedPermissions = localStorage.getItem('permissions');
        console.log('Stored Permissions:', storedPermissions);
        const parsedPermissions = storedPermissions ? JSON.parse(storedPermissions) : [];
        console.log('parsedPermissions Permissions:', parsedPermissions);
        // Check if the user has permission to add a citizen with 'Edit' submodule
        const hasAddCitizenPermission = parsedPermissions.some((p) =>
            p.modules_submodule.some(
                (m) =>
                    m.moduleName === 'Citizen' &&
                    m.selectedSubmodules.some((s) => s.submoduleName.toLowerCase() === 'add')
            )
        );
        setCanAddCitizen(hasAddCitizenPermission);
        // Check if the user has permission for the "Delete" submodule
        const hasDeletePermission = parsedPermissions.some((p) =>
            p.modules_submodule.some((m) => m.moduleName === 'Citizen' && m.selectedSubmodules.some((s) => s.submoduleName === 'Delete'))
        );
        setCanDelete(hasDeletePermission);

        // Check if the user has permission for the "edit" submodule

        const hasEditPermission = parsedPermissions.some((p) =>
            p.modules_submodule.some((m) => m.moduleName === 'Citizen' && m.selectedSubmodules.some((s) => s.submoduleName === 'Edit'))
        );
        setCanEdit(hasEditPermission);

        // Check if the user has permission for the "view" submodule

        const hasViewPermission = parsedPermissions.some((p) =>
            p.modules_submodule.some((m) => m.moduleName === 'Citizen' && m.selectedSubmodules.some((s) => s.submoduleName === 'View'))
        );
        setCanView(hasViewPermission);

        ////// roshni code start

        const investigationModules = parsedPermissions.map(permission => {
            const modules = permission.modules_submodule.find(module => module.moduleName === 'Investigation');
            if (modules) {
                return {
                    moduleId: modules.moduleId,
                    moduleName: modules.moduleName,
                    selectedSubmodules: modules.selectedSubmodules
                };
            } else {
                return null;
            }
        }).filter(module => module !== null);
        console.log("investigationModules", investigationModules);
        setViewInvestigation(investigationModules[0].selectedSubmodules);
        localStorage.setItem('investiData', JSON.stringify(investigationModules[0].selectedSubmodules));

        ////// roshni code end
    }, []);

    //permission code end
    const Port = process.env.REACT_APP_API_KEY;
    const [active, setActive] = useState('today');  // today filter
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedAge, setSelectedAge] = useState('');
    const [selectedGender, setSelectedGender] = useState('');
    const [selectedSource, setSelectedSource] = useState('');
    const [selectedDisease, setSelectedDisease] = useState('');
    const [selectedClassNav, setSelectedClassNav] = useState('');
    const [selectedDivision, setSelectedDivision] = useState('');
    /////////////// user nav API  /////////////////
    const [ListAgeNav, setListAgeNav] = useState([]);
    const [ListGenderNav, setListGenderNav] = useState([]);
    const [ListSourceNav, setListSourceNav] = useState([]);
    const [ListDiseaseNav, setListDiseaseNav] = useState([]);

    const [screeningFor, setScreeningFor] = useState([]);
    const [selectedScheduleType, setSelectedScheduleType] = useState('');

    const [classList, setClassList] = useState([]); //// class API
    const [divisionList, setDivisionList] = useState([]); //// class API

    const [tableFetch, setTableFetch] = useState([]); ///////////////// table Data
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    ///////// Loader
    const [loading, setLoading] = useState(true);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    useEffect(() => {
        handleActive('today');
    }, []);

    //today till filter
    const handleActive = async (type) => {
        setLoading(true); // Set loading to true when starting the data fetching

        try {
            const accessToken = localStorage.getItem('token'); // Retrieve access token
            const response = await axios.get(`${Port}/Screening/filter-citizens/?date_filter=${type}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            setTableFetch(response.data);
            console.log(response.data);
        } catch (error) {
            console.log('Error while fetching data', error);
        } finally {
            setLoading(false); // Set loading to false when the data fetching is complete (either success or error)
        }
        setActive(type);
    };

    const handlesubmit = async () => {
        setLoading(true);

        const filters = {
            age: selectedAge,
            gender: selectedGender,
            source: selectedSource,
            type: selectedScheduleType,
            disease: selectedDisease,
            Class: selectedClassNav,
            division: selectedDivision,
        };

        const accessToken = localStorage.getItem('token'); // Retrieve access token

        const url = `${Port}/Screening/filter-citizens/?${Object.entries(filters)
            .filter(([key, value]) => value !== null && value !== undefined)
            .map(([key, value]) => `${key}=${value}`)
            .join("&")}`;

        try {
            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            setTableFetch(response.data);
        } catch (error) {
            console.log('Error while fetching data', error);
        } finally {
            setLoading(false);
        }
    };

    ///////////// Citizen get API
    // useEffect(() => {
    //     const fetchTableData = async () => {
    //         try {
    //             const response = await axios.get(`${Port}/Screening/add_citizen_get/`)
    //             setTableFetch(response.data)
    //             console.log(tableFetch);
    //             setLoading(false);
    //         }
    //         catch (error) {
    //             console.log('Error while fetching data', error)
    //             setLoading(false)
    //         }
    //     }
    //     fetchTableData()
    // }, []);

    /////////////DELETE API
    const handleDeleteClick = (citizenID) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this citizen?');

        if (!confirmDelete) {
            return;
        }

        const userID = localStorage.getItem('userID');
        console.log(userID);

        fetch(`${Port}/Screening/add_citizen_delete/${citizenID}/${userID}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        })
            .then((response) => {
                if (response.ok) {
                    console.log('Record deleted successfully');
                    // alert('Deleted Successfully');
                    setTableFetch(prevTableFetch => prevTableFetch.filter(record => record.citizens_pk_id !== citizenID));
                } else {
                    console.error('Failed to delete record');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    /////////////Citizen Age nav API
    useEffect(() => {
        const fetchUserAgeDropdown = async () => {
            try {
                const response = await axios.get(`${Port}/Screening/Age_GET/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                });
                setListAgeNav(response.data)
                console.log(ListAgeNav)
            }
            catch (error) {
                console.log('Error while fetching data', error)
            }
        }
        fetchUserAgeDropdown()
    }, []);

    /////////////Citizen Gender nav API
    useEffect(() => {
        const fetchUserGenderDropdown = async () => {
            try {
                const response = await axios.get(`${Port}/Screening/Gender_GET/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                })
                setListGenderNav(response.data)
                console.log(ListGenderNav)
            }
            catch (error) {
                console.log('Error while fetching data', error)
            }
        }
        fetchUserGenderDropdown()
    }, []);

    /////////////Citizen Source nav API
    useEffect(() => {
        const fetchUserSourceDropdown = async () => {
            try {
                const response = await axios.get(`${Port}/Screening/source_GET/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                })
                setListSourceNav(response.data)
                console.log(ListSourceNav)
            }
            catch (error) {
                console.log('Error while fetching data', error)
            }
        }
        fetchUserSourceDropdown()
    }, []);

    /////////////Citizen Disease nav API
    useEffect(() => {
        const fetchUserDiseaseDropdown = async () => {
            try {
                const response = await axios.get(`${Port}/Screening/child_disease_info_get/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                })
                setListDiseaseNav(response.data)
                console.log(ListDiseaseNav)
            }
            catch (error) {
                console.log('Error while fetching data', error)
            }
        }
        fetchUserDiseaseDropdown()
    }, []);

    ////// Screening For ///////
    useEffect(() => {
        if (selectedSource) {
            axios
                .get(`${Port}/Screening/screening_for_type_get/${selectedSource}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                })
                .then((response) => {
                    setScreeningFor(response.data);
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                });
        }
    }, [selectedSource]);

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

    /////// Division GET API 
    useEffect(() => {
        const fetchDivision = async () => {
            try {
                const response = await axios.get(`${Port}/Screening/get_division/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                })
                setDivisionList(response.data)
            }
            catch (error) {
                console.log(error, 'Error fetching Division');
            }
        }
        fetchDivision()
    }, [])

    return (
        <div className="backgrounduser">
            <div>
                <div class="content-wrapper">
                    <div class="content-header">
                        <div class="container-fluid">
                            <div className="card userlistcard">
                                <div class="row">
                                    <div class="col">
                                        <h5 className='name'>Search Citizen</h5>
                                    </div>
                                </div>

                                <div className="dropdownall mb-3">
                                    <Box>
                                        <div class="container text-center">
                                            <div class="row" style={{ display: 'flex', justifyContent: 'center' }}>
                                                <div class="col textfiledcol" style={{ color: "white" }}>
                                                    <TextField
                                                        select
                                                        className="citizenlistdropdownfield"
                                                        size="small"
                                                        label="Age"
                                                        id="select-small"
                                                        variant="outlined"
                                                        value={selectedAge}
                                                        onChange={(e) => setSelectedAge(e.target.value)}
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
                                                        <MenuItem value="">Select Age</MenuItem>
                                                        {ListAgeNav.map(drop => (
                                                            <MenuItem key={drop.age_pk_id}
                                                                value={drop.age_pk_id}
                                                                className={selectedAge === drop.age ? 'selected-item' : ''}
                                                            >
                                                                {drop.age}
                                                            </MenuItem>
                                                        ))}
                                                    </TextField>
                                                </div>

                                                <div class="col textfiledcol" style={{ color: "white" }}>
                                                    <TextField
                                                        select
                                                        className="citizenlistdropdownfield"
                                                        size="small"
                                                        label="Gender"
                                                        id="select-small"
                                                        variant="outlined"
                                                        value={selectedGender}
                                                        onChange={(e) => setSelectedGender(e.target.value)}
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
                                                        <MenuItem value="">Select Gender</MenuItem>
                                                        {ListGenderNav.map(drop => (
                                                            <MenuItem key={drop.gender_pk_id} value={drop.gender_pk_id}>
                                                                {drop.gender}
                                                            </MenuItem>
                                                        ))}
                                                    </TextField>
                                                </div>

                                                <div className="col textfiledcol" style={{ color: "white" }}>
                                                    <TextField
                                                        select
                                                        className="citizenlistdropdownfield"
                                                        size="small"
                                                        label="Source"
                                                        id="select-small-source"
                                                        variant="outlined"
                                                        value={selectedSource}
                                                        onChange={(e) => setSelectedSource(e.target.value)}
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
                                                        {ListSourceNav.map((drop) => (
                                                            <MenuItem key={drop.source_pk_id} value={drop.source_pk_id}>
                                                                {drop.source}
                                                            </MenuItem>
                                                        ))}
                                                    </TextField>
                                                </div>

                                                <div className="col textfiledcol" style={{ color: "white" }}>
                                                    <TextField
                                                        select
                                                        className="citizenlistdropdownfield"
                                                        size="small"
                                                        label="Type"
                                                        id="select-small-type"
                                                        variant="outlined"
                                                        value={selectedScheduleType}
                                                        onChange={(e) => setSelectedScheduleType(e.target.value)}
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
                                                        <MenuItem value="">Select Type</MenuItem>
                                                        {screeningFor.map((drop) => (
                                                            <MenuItem key={drop.type_id} value={drop.type_id}>
                                                                {drop.type}
                                                            </MenuItem>
                                                        ))}
                                                    </TextField>
                                                </div>

                                                <div class="col textfiledcol" style={{ color: "white" }}>
                                                    <TextField
                                                        select
                                                        className="citizenlistdropdownfield"
                                                        size="small"
                                                        label="Disease"
                                                        id="select-small"
                                                        variant="outlined"
                                                        value={selectedDisease}
                                                        onChange={(e) => setSelectedDisease(e.target.value)}
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
                                                        <MenuItem value="">Select Disease</MenuItem>
                                                        {ListDiseaseNav.map(drop => (
                                                            <MenuItem key={drop.disease_pk_id} value={drop.disease_pk_id}>
                                                                {drop.disease}
                                                            </MenuItem>
                                                        ))}
                                                    </TextField>
                                                </div>

                                                <div className='col'>
                                                    <button
                                                        type='button'
                                                        className='btn btn-sm searchcitizen'
                                                        onClick={handlesubmit}
                                                    >
                                                        Search
                                                    </button>
                                                </div>

                                                {canAddCitizen && (<Link to='/mainscreen/Citizenheader'>
                                                    <div>
                                                        <button type='button' className='btn addicon'>
                                                            <PersonAddAltIcon className='personaddicon' />
                                                        </button>
                                                    </div>
                                                </Link>)}
                                            </div>
                                        </div>
                                    </Box>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="content-wrapper">
                <div class="content-header">
                    <div className="row filterrow">
                        <div className="col-md-3">
                            <div className="cardfilter">
                                <div className="row">
                                    <div
                                        className={`col today ${active === 'today' ? 'active' : ''}`}
                                        onClick={() => handleActive('today')}
                                    >
                                        Today
                                    </div>
                                    <div
                                        className={`col month ${active === 'month' ? 'active' : ''}`}
                                        onClick={() => handleActive('month')}
                                    >
                                        Month
                                    </div>
                                    <div
                                        className={`col date ${active === 'date' ? 'active' : ''}`}
                                        onClick={() => handleActive('date')}
                                    >
                                        Till Date
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-7">
                            {
                                selectedScheduleType === 1 && (
                                    <div className="row listtype">
                                        <div className="col-md-4">
                                            <select className="form-control form-control-sm"
                                                value={selectedClassNav}
                                                onChange={(e) => setSelectedClassNav(e.target.value)}>
                                                <option>Select Class</option>
                                                {classList.map(cls => (
                                                    <option key={cls.class_id} value={cls.class_id}>
                                                        {cls.class_name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-md-4">
                                            <select className="form-control form-control-sm"
                                                value={selectedDivision}
                                                onChange={(e) => setSelectedDivision(e.target.value)}>
                                                <option>Select Division</option>
                                                {divisionList.map(cls => (
                                                    <option key={cls.division_id} value={cls.division_id}>
                                                        {cls.division_name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                )
                            }
                        </div>

                        <div className='col-md-2'>
                            <input className="form-control newsearch"
                                placeholder='Search Citizen'
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <SearchIcon className="searchiconnew" />
                        </div>
                    </div>

                    <div className="row table-container">
                        <table className="table table-borderless ">
                            <thead className="">
                                <tr className="card cardheaduser">
                                    <th className="col-md-1 haedtitle">Sr No.</th>
                                    <th className="col-md-3 haedtitle">Citizen Name</th>
                                    <th className="col-md-2 haedtitle">Age</th>
                                    <th className="col-md-3 haedtitle">Source Name</th>
                                    <th className="col-md-1 haedtitle">Added By</th>
                                    {/* <th className="col haedtitle">Disease</th> */}
                                    <th className="col haedtitle">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                <div className="cardbodycontent">
                                    {
                                        loading ?
                                            (
                                                <tr>
                                                    <td colSpan="7" className="text-center">
                                                        <CircularProgress className='circular-progress-containercitizenlist' style={{ margin: 'auto' }} />
                                                    </td>
                                                </tr>
                                            ) : (
                                                tableFetch.length > 0 ? (
                                                    tableFetch
                                                        .filter((data) =>
                                                            Object.values(data).some((value) =>
                                                                value !== null && value !== undefined && value.toString().toLowerCase().includes(searchQuery.toLowerCase())
                                                            )
                                                        )
                                                        .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
                                                        .map((data, index) => {
                                                            const serialNumber = index + 1 + page * rowsPerPage;
                                                            return (
                                                                <tr key={data.srNo} className="card cardbodyuser">
                                                                    <td className="col-md-1">{serialNumber}</td>
                                                                    <td className="col-md-3 headbody">{data.name ? data.name.toLowerCase().charAt(0).toUpperCase() + data.name.toLowerCase().slice(1) : '-'}</td>
                                                                    <td className="col-md-2 headbody">{data.year} Year</td>
                                                                    <td className="col-md-3 headbody">{data.source_name_name}</td>
                                                                    <td className="col-md-1 headbody">{data.added_by ? data.added_by.clg_ref_id : '-'}</td>
                                                                    <td className="col headbody">
                                                                        {canEdit && (
                                                                            <Link to={`/mainscreen/updatecitizen/${data.citizens_pk_id}/${data.source}`}>
                                                                                <DriveFileRenameOutlineOutlinedIcon className="ml-3 iconuser" />
                                                                            </Link>
                                                                        )}
                                                                        {canView && (
                                                                            <Link to={`/mainscreen/viewcitizen/${data.citizens_pk_id}/${data.source}`}>
                                                                                <RemoveRedEyeOutlinedIcon className="ml-1 iconuser" />
                                                                            </Link>
                                                                        )}
                                                                        {canDelete && (
                                                                            <DeleteOutlineOutlinedIcon
                                                                                className="ml-1 iconuser"
                                                                                onClick={(e) => handleDeleteClick(data.citizens_pk_id)}
                                                                            />
                                                                        )}
                                                                    </td>
                                                                </tr>

                                                            );
                                                        })
                                                ) : (
                                                    <tr style={{ marginLeft: '440px' }}>
                                                        <td colSpan="6" className="text-center" style={{ marginLeft: '440px' }}>
                                                            <h4 style={{ marginLeft: '440px' }}>No Data Found</h4>
                                                        </td>
                                                    </tr>
                                                )
                                            )
                                    }
                                </div>
                            </tbody>
                        </table>

                        <div className="paginationnew" style={{ marginTop: '0%' }}>
                            <TablePagination
                                component="div"
                                count={tableFetch.length}
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

    )
}

export default Citizenlist
