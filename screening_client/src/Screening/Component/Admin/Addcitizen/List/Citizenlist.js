import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import SearchIcon from '@mui/icons-material/Search';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import {
    Box,
    Grid,
    Card,
    Typography,
    Button,
    TextField,
    IconButton,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableContainer,
    TablePagination,
    Paper,
    MenuItem,
    CardContent
} from "@mui/material";

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
    const SourceUrlId = localStorage.getItem('loginSource');

    //// access the source name from local storage
    const SourceNameUrlId = localStorage.getItem('SourceNameFetched');
    console.log('fetched sourcename in citizen', SourceNameUrlId);

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

        // const investigationModules = parsedPermissions.map(permission => {
        //     const modules = permission.modules_submodule.find(module => module.moduleName === 'Investigation');
        //     if (modules) {
        //         return {
        //             moduleId: modules.moduleId,
        //             moduleName: modules.moduleName,
        //             selectedSubmodules: modules.selectedSubmodules
        //         };
        //     } else {
        //         return null;
        //     }
        // }).filter(module => module !== null);
        // console.log("investigationModules", investigationModules);
        // setViewInvestigation(investigationModules[0].selectedSubmodules);
        // localStorage.setItem('investiData', JSON.stringify(investigationModules[0].selectedSubmodules));

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

        if (investigationModules.length > 0) {
            setViewInvestigation(investigationModules[0].selectedSubmodules);
            localStorage.setItem('investiData', JSON.stringify(investigationModules[0].selectedSubmodules));
        } else {
            // Handle the case when investigationModules is empty
            setViewInvestigation([]);
            localStorage.setItem('investiData', JSON.stringify([]));
        }


        ////// roshni code end
    }, []);

    //permission code end
    const Port = process.env.REACT_APP_API_KEY;
    const [active, setActive] = useState('today');  // today filter
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedAge, setSelectedAge] = useState('');
    const [selectedGender, setSelectedGender] = useState('');
    const [selectedSource, setSelectedSource] = useState(SourceUrlId || '');
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
            const response = await axios.get(`${Port}/Screening/filter-citizens/?date_filter=${type}&source=${SourceUrlId}&source_name=${SourceNameUrlId}`, {
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
            sourceurl_id: SourceUrlId,
            source_name: SourceNameUrlId,
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


    /////////////DELETE API
    const handleDeleteClick = (citizenID) => {
        // const confirmDelete = window.confirm('Are you sure you want to delete this citizen?');

        // if (!confirmDelete) {
        //     return;
        // }

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
                const response = await axios.get(`${Port}/Screening/Age_GET/?source_id=${SourceUrlId}`, {
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
                const response = await axios.get(`${Port}/Screening/source_GET/?source_pk_id=${SourceUrlId}`, {
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
        <div>
            <Card
                sx={{
                    p: 1,
                    borderRadius: 2,
                    boxShadow: 1,
                    backgroundColor: "#fff",
                    m: "0.1em 1em 0 4.5em",
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        mb: 2,
                        fontWeight: 600,
                        color: "#1A237E",
                    }}
                >
                    Search Citizen
                </Typography>

                <Grid
                    container
                    spacing={2}
                    alignItems="center"
                    justifyContent="center"
                >
                    {/* Age */}
                    <Grid item xs={12} sm={6} md="auto">
                        <TextField
                            select
                            size="small"
                            label="Age"
                            value={selectedAge}
                            onChange={(e) => setSelectedAge(e.target.value)}
                            sx={{
                                minWidth: 150,
                                "& .MuiInputBase-input.MuiSelect-select": {
                                    color: "#000 !important",
                                },
                                "& .MuiSvgIcon-root": {
                                    color: "#000",
                                },
                            }}
                        >
                            <MenuItem value="">Select Age</MenuItem>
                            {ListAgeNav.map((drop) => (
                                <MenuItem key={drop.age_pk_id} value={drop.age_pk_id}>
                                    {drop.age}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    {/* Gender */}
                    <Grid item xs={12} sm={6} md="auto">
                        <TextField
                            select
                            size="small"
                            label="Gender"
                            value={selectedGender}
                            onChange={(e) => setSelectedGender(e.target.value)}
                            sx={{
                                minWidth: 150,
                                "& .MuiInputBase-input.MuiSelect-select": {
                                    color: "#000 !important",
                                },
                                "& .MuiSvgIcon-root": {
                                    color: "#000",
                                },
                            }}
                        >
                            <MenuItem value="">Select Gender</MenuItem>
                            {ListGenderNav.map((drop) => (
                                <MenuItem key={drop.gender_pk_id} value={drop.gender_pk_id}>
                                    {drop.gender}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    {/* Source */}
                    <Grid item xs={12} sm={6} md="auto">
                        <TextField
                            select
                            size="small"
                            label="Source"
                            value={selectedSource}
                            onChange={(e) => setSelectedSource(e.target.value)}
                            sx={{
                                minWidth: 150,
                                "& .MuiInputBase-input.MuiSelect-select": {
                                    color: "#000 !important",
                                },
                                "& .MuiSvgIcon-root": {
                                    color: "#000",
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
                    </Grid>

                    {/* Type */}
                    <Grid item xs={12} sm={6} md="auto">
                        <TextField
                            select
                            size="small"
                            label="Type"
                            value={selectedScheduleType}
                            onChange={(e) => setSelectedScheduleType(e.target.value)}
                            sx={{
                                minWidth: 150,
                                "& .MuiInputBase-input.MuiSelect-select": {
                                    color: "#000 !important",
                                },
                                "& .MuiSvgIcon-root": {
                                    color: "#000",
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
                    </Grid>

                    {/* Disease */}
                    <Grid item xs={12} sm={6} md="auto">
                        <TextField
                            select
                            size="small"
                            label="Disease"
                            value={selectedDisease}
                            onChange={(e) => setSelectedDisease(e.target.value)}
                            sx={{
                                minWidth: 150,
                                "& .MuiInputBase-input.MuiSelect-select": {
                                    color: "#000 !important",
                                },
                                "& .MuiSvgIcon-root": {
                                    color: "#000",
                                },
                            }}
                        >
                            <MenuItem value="">Select Disease</MenuItem>
                            {ListDiseaseNav.map((drop) => (
                                <MenuItem key={drop.disease_pk_id} value={drop.disease_pk_id}>
                                    {drop.disease}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    {/* Search Button */}
                    <Grid item xs={12} sm={6} md="auto">
                        <Button
                            variant="contained"
                            size="small"
                            onClick={handlesubmit}
                            sx={{
                                background: "linear-gradient(90deg, #2FB3F5 0%, #1439A4 100%)",
                                color: "white",
                                textTransform: "none",
                                fontWeight: 500,
                                px: 3,
                                "&:hover": {
                                    background:
                                        "linear-gradient(90deg, #2FB3F5 0%, #1439A4 100%)",
                                },
                            }}
                        >
                            Search
                        </Button>
                    </Grid>

                    {/* Add Citizen Button */}
                    {canAddCitizen && (
                        <Grid item xs={12} sm={6} md="auto">
                            <Link to="/mainscreen/Citizenheader" style={{ textDecoration: "none" }}>
                                <IconButton
                                    sx={{
                                        backgroundColor: "#1976D2",
                                        color: "white",
                                        "&:hover": { backgroundColor: "#1565C0" },
                                    }}
                                >
                                    <PersonAddAltIcon />
                                </IconButton>
                            </Link>
                        </Grid>
                    )}
                </Grid>
            </Card>

            <Box sx={{ p: 1, m: "0.1em 0em 0 4.5em", }}>
                <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card
                            sx={{
                                p: 0.1,
                                borderRadius: 2,
                                boxShadow: 2,
                                display: "flex",
                                justifyContent: "space-between",
                            }}
                        >
                            {["today", "month", "date"].map((key) => (
                                <Button
                                    key={key}
                                    variant={active === key ? "contained" : "outlined"}
                                    onClick={() => handleActive(key)}
                                    sx={{
                                        flex: 1,
                                        mx: 0.5,
                                        my: 0.5,
                                        textTransform: "none",
                                        fontWeight: active === key ? 400 : 400,
                                        background:
                                            active === key
                                                ? "linear-gradient(90deg, #2FB3F5 0%, #1439A4 100%)"
                                                : "transparent",
                                        color: active === key ? "white" : "black",
                                        "&:hover": {
                                            background:
                                                active === key
                                                    ? "linear-gradient(90deg, #2FB3F5 0%, #1439A4 100%)"
                                                    : "#E3F2FD",
                                        },
                                    }}
                                >
                                    {key === "today"
                                        ? "Today"
                                        : key === "month"
                                            ? "Month"
                                            : "Till Date"}
                                </Button>
                            ))}
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Box sx={{ position: "relative", width: "100%" }}>
                            <TextField
                                size="small"
                                fullWidth
                                placeholder="Search Citizen"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <SearchIcon
                                sx={{
                                    position: "absolute",
                                    right: 10,
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    color: "#1565C0",
                                }}
                            />
                        </Box>
                    </Grid>
                </Grid>

                <TableContainer>
                    <Table>
                        <TableHead
                            sx={{
                                background: "linear-gradient(90deg, #2FB3F5 0%, #1439A4 100%)",
                                mb: 2, // ✅ margin bottom added after header
                            }}
                        >
                            <TableRow
                                sx={{
                                    background: "linear-gradient(90deg, #2FB3F5 0%, #1439A4 100%)",
                                    height: "40px",
                                    marginBottom: "35px",
                                    "& th": {
                                        color: "white",
                                        fontWeight: 600,
                                        fontSize: "0.8rem",
                                        border: "none",
                                        py: 0.5,
                                        px: 1,
                                    },
                                    "& th:first-of-type": {
                                        borderTopLeftRadius: "40px",
                                        borderBottomLeftRadius: "40px",
                                    },
                                    "& th:last-of-type": {
                                        borderTopRightRadius: "40px",
                                        borderBottomRightRadius: "40px",
                                    },
                                }}
                            >
                                <TableCell>Sr No.</TableCell>
                                <TableCell>Citizen Name</TableCell>
                                <TableCell>Age</TableCell>
                                <TableCell>Source Name</TableCell>
                                <TableCell>Added By</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        <CircularProgress sx={{ my: 1, color: "#1439A4" }} size={30} />
                                    </TableCell>
                                </TableRow>
                            ) : tableFetch.length > 0 ? (
                                tableFetch
                                    .filter((data) =>
                                        Object.values(data).some(
                                            (value) =>
                                                value &&
                                                value.toString().toLowerCase().includes(searchQuery.toLowerCase())
                                        )
                                    )
                                    .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
                                    .map((data, index) => {
                                        const serialNumber = index + 1 + page * rowsPerPage;
                                        return (
                                            <TableRow
                                                key={data.citizens_pk_id}
                                                sx={{
                                                    height: "25px",
                                                    "& td": {
                                                        py: 0.4,
                                                        fontSize: "15px", // ✅ increased font size
                                                        verticalAlign: "middle", // ✅ align vertically
                                                    },
                                                }}
                                            >
                                                <TableCell colSpan={6} sx={{ border: "none", p: 0.5 }}>
                                                    <Card
                                                        sx={{
                                                            borderRadius: 2,
                                                            boxShadow: 2,
                                                            "&:hover": { boxShadow: 4 },
                                                            transition: "0.3s",
                                                        }}
                                                    >
                                                        <CardContent
                                                            sx={{
                                                                p: 1,
                                                                height: "45px",
                                                                display: "flex", // ✅ align items in one line
                                                                alignItems: "center",
                                                                justifyContent: "space-between",
                                                            }}
                                                        >
                                                            <Table size="small" sx={{ width: "100%" }}>
                                                                <TableBody
                                                                    sx={{
                                                                        "& td, & th": {
                                                                            borderBottom: "none",
                                                                            fontSize: "13px", 
                                                                            verticalAlign: "middle",
                                                                        },
                                                                    }}
                                                                >
                                                                    <TableRow>
                                                                        <TableCell sx={{ width: "5%" }}>{serialNumber}</TableCell>
                                                                        <TableCell sx={{ width: "25%" }}>{data.name || "-"}</TableCell>
                                                                        <TableCell sx={{ width: "10%" }}>
                                                                            {data.year ? `${data.year} Year` : "-"}
                                                                        </TableCell>
                                                                        <TableCell sx={{ width: "25%" }}>
                                                                            {data.source_name_name || "-"}
                                                                        </TableCell>
                                                                        <TableCell sx={{ width: "15%" }}>
                                                                            {data.added_by ? data.added_by.clg_ref_id : "-"}
                                                                        </TableCell>
                                                                        <TableCell sx={{ width: "15%" }}>
                                                                            {canEdit && (
                                                                                <Link
                                                                                    to={`/mainscreen/updatecitizen/${data.citizens_pk_id}/${data.source}`}
                                                                                >
                                                                                    <DriveFileRenameOutlineOutlinedIcon
                                                                                        sx={{
                                                                                            color: "#1565C0",
                                                                                            cursor: "pointer",
                                                                                            mr: 1,
                                                                                            fontSize: 18,
                                                                                        }}
                                                                                    />
                                                                                </Link>
                                                                            )}
                                                                            {canView && (
                                                                                <Link
                                                                                    to={`/mainscreen/viewcitizen/${data.citizens_pk_id}/${data.source}`}
                                                                                >
                                                                                    <RemoveRedEyeOutlinedIcon
                                                                                        sx={{
                                                                                            color: "#1976D2",
                                                                                            cursor: "pointer",
                                                                                            mr: 1,
                                                                                            fontSize: 18,
                                                                                        }}
                                                                                    />
                                                                                </Link>
                                                                            )}
                                                                            {canDelete && (
                                                                                <DeleteOutlineOutlinedIcon
                                                                                    onClick={() =>
                                                                                        handleDeleteClick(data.citizens_pk_id)
                                                                                    }
                                                                                    sx={{
                                                                                        color: "#D32F2F",
                                                                                        cursor: "pointer",
                                                                                        fontSize: 18,
                                                                                    }}
                                                                                />
                                                                            )}
                                                                        </TableCell>
                                                                    </TableRow>
                                                                </TableBody>
                                                            </Table>
                                                        </CardContent>
                                                    </Card>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        <Typography variant="subtitle2" color="text.secondary">
                                            No Data Found
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                    <TablePagination
                        component="div"
                        count={tableFetch.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[5, 10, 20]}
                    />
                </Box>
            </Box>
        </div>

    )
}

export default Citizenlist
