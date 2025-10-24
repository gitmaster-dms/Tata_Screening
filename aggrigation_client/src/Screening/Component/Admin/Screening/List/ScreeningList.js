import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import './ScreeningList.css';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import axios from 'axios'
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';
import Modal from '@mui/material/Modal';

const ScreeningList = () => {

  const accessToken = localStorage.getItem('token');
  console.log(accessToken);
  const Port = process.env.REACT_APP_API_KEY;
  const userID = localStorage.getItem('userID');

  const SourceUrlId = localStorage.getItem('loginSource');
  const SourceNameUrlId = localStorage.getItem('SourceNameFetched');

  console.log(userID);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [sourceNav, setSourceNav] = useState([]);
  const [selectedSource, setSelectedSource] = useState(SourceUrlId);
  const [sourceType, setSourceType] = useState([]);
  const [selectedType, setSelectedType] = useState(3);
  const [sourceClass, setSourceClass] = useState([]);
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedCount, setSelectedCount] = useState('');
  const [open, setOpen] = useState(false);
  const [cardData, setCardData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [loading, setLoading] = useState(true)
  const handleClose = () => setOpen(false);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  //////////////// Navbar Dropdown Value
  useEffect(() => {
    fetch(`${Port}/Screening/source_GET/`, {
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

  //// Soure Type against selected source
  useEffect(() => {
    const fetchTypeNavOptions = async () => {
      if (selectedSource) {
        try {
          const res = await fetch(`${Port}/Screening/screening_for_type_get/${selectedSource}`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          });
          const data = await res.json();
          setSourceType(data);
        } catch (error) {
          console.error("Error fetching type against source data:", error);
        }
      }
    };
    fetchTypeNavOptions();
  }, [selectedSource]);

  //// Class against selected source Type
  useEffect(() => {
    const fetchClass = async () => {
      try {
        const res = await fetch(`${Port}/Screening/get_class/`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });
        const data = await res.json();
        setSourceClass(data);
      } catch (error) {
        console.error("Error fetching class against type data:", error);
      }
    }
    fetchClass();
  }, []);

  const handleStartScreening = (filteredIndex) => {
    const citizensPkId = filteredCardData[filteredIndex]?.citizen_info?.citizens_pk_id;
    const citizenidddddddd = filteredCardData[filteredIndex]?.citizen_id;
    const pkid = filteredCardData[filteredIndex]?.pk_id;
    const year = filteredCardData[filteredIndex]?.citizen_info?.year;
    const dob = filteredCardData[filteredIndex]?.citizen_info?.dob;
    const gender = filteredCardData[filteredIndex]?.citizen_info?.gender;
    const ScreeningCount = filteredCardData[filteredIndex]?.schedule_count;
    const citizenId = filteredCardData[filteredIndex]?.citizen_id;
    const scheduleID = filteredCardData[filteredIndex]?.schedule_id;
    const sourceID = filteredCardData[filteredIndex]?.citizen_info.source;

    console.log('Citizens PK ID:', citizensPkId);
    console.log('PK ID:', pkid);
    console.log('Year:', year);
    console.log('Gender:', gender);
    console.log('Citizen ID:', citizenId);
    console.log('Screening Count:', ScreeningCount);
    console.log('Citizens id:', citizenidddddddd);
    console.log('schedule id:', scheduleID);
    console.log('source id:', sourceID);

    navigate('/mainscreen/body', {
      state: {
        citizensPkId,
        pkid,
        year,
        dob,
        gender,
        citizenId,
        ScreeningCount,
        citizenidddddddd,
        scheduleID,
        sourceID
      },
    });
  };

  const filteredCardData = cardData.filter((card) => {
    const citizenName = card.citizen_info && card.citizen_info.name ? card.citizen_info.name.toLowerCase() : '';
    const citizenId = card.citizen_id ? card.citizen_id.toLowerCase() : '';
    const scheduleId = card.schedule_id ? card.schedule_id.toLowerCase() : '';
    const parentsMobile = card.citizen_info && card.citizen_info.parents_mobile ? card.citizen_info.parents_mobile.toLowerCase() : '';

    return (
      citizenName.includes(searchQuery.toLowerCase()) ||
      citizenId.includes(searchQuery.toLowerCase()) ||
      scheduleId.includes(searchQuery.toLowerCase()) ||
      parentsMobile.includes(searchQuery.toLowerCase())
    );
  });

  const handleSearch = async () => {
    try {
      let apiUrl = `${Port}/Screening/start_screening_info/?`;
      apiUrl += `source=${SourceUrlId}&source_name=${SourceNameUrlId}&`;
      if (selectedSource) {
        apiUrl += `source_id=${selectedSource}`;
      }
      // if (selectedType) {
      //   apiUrl += `type_id=${selectedType}&`;
      // }
      // if (selectedClass) {
      //   apiUrl += `class_id=${selectedClass}&`;
      // }
      // if (selectedCount) {
      //   apiUrl += `schedule_count=${selectedCount}&`;
      // }
      // if (selectedDepartment) {
      //   apiUrl += `department_id=${selectedDepartment}&`;
      // }

      setLoading(true);

      const accessToken = localStorage.getItem('token');
      const response = await axios.get(apiUrl, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      setCardData(response.data);

      response.data.forEach(item => {
        console.log(item.citizen_info.source, 'source fetched from response');
        localStorage.setItem('source', item.citizen_info.source);
      });


      console.log('Server Response:', response.data);
    } catch (error) {
      console.error('Error while fetching data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [selectedSource, selectedType, selectedClass, selectedCount]);

  const [department, setDepartmenet] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('')

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const response = await axios.get(`${Port}/Screening/get_department/${SourceUrlId}/${SourceNameUrlId}/`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        })
        setDepartmenet(response.data)
      }
      catch (error) {
        console.log(error, 'Error fetching Class');
      }
    }
    fetchDepartment()
  }, [])

  return (
    <div>
      <div class="content-wrapper">
        <div class="content-header">
          {/*
          <div class="container-fluid">
            <div className="card screenlistcard">
              <div class="row">
                <h5 className='screeninglisname'>Screening List</h5>
              </div>

              <div className="row ml-1 pb-3">
                <Box>
                  <div class="container text-center">
                    <div class="row dropdownrow ml-4">
                      {
                        SourceUrlId === 1 && (
                          <div class="col" style={{ color: 'white' }}>
                            <TextField
                              select
                              className="screeningfielddropdown"
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
                                  paddingLeft: 0,
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
                        )
                      }

                      <div class="col" style={{ color: 'white' }}>
                        <TextField
                          select
                          className="screeningfielddropdown"
                          size="small"
                          label="Source Type"
                          id="select-small"
                          variant="outlined"
                          value={selectedType}
                          onChange={event => setSelectedType(event.target.value)}
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
                          {sourceType.map(drop => (
                            <MenuItem key={drop.type_id} value={drop.type_id}>
                              {drop.type}
                            </MenuItem>
                          ))}
                        </TextField>
                      </div>

                      {
                        selectedSource === 1 && selectedType === 1 && (
                          <div class="col" style={{ color: 'white' }}>
                            <TextField
                              select
                              className="screeningfielddropdown"
                              size="small"
                              label="Class"
                              id="select-small"
                              variant="outlined"
                              value={selectedClass}
                              onChange={event => setSelectedClass(event.target.value)}
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
                              <MenuItem value="">Select Class</MenuItem>
                              {sourceClass.map(drop => (
                                <MenuItem key={drop.class_id} value={drop.class_id}>
                                  {drop.class_name}
                                </MenuItem>
                              ))}
                            </TextField>
                          </div>
                        )
                      }

                      {
                        selectedSource === '5' && selectedType === 3 && (
                          <div class="col" style={{ color: 'white' }}>
                            <TextField
                              select
                              className="screeningfielddropdown"
                              size="small"
                              label="Department"
                              id="select-small"
                              variant="outlined"
                              value={selectedDepartment}
                              onChange={event => setSelectedDepartment(event.target.value)}
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
                              <MenuItem value="">Select Department</MenuItem>
                              {department.map(drop => (
                                <MenuItem key={drop.department_id} value={drop.department_id}>
                                  {drop.department}
                                </MenuItem>
                              ))}
                            </TextField>
                          </div>
                        )
                      }

                      {
                        SourceUrlId === '1' && (
                          <div class="col" style={{ color: 'white' }}>
                            <TextField
                              select
                              className="screeningfielddropdown"
                              size="small"
                              label="Schedule Count"
                              id="select-small"
                              variant="outlined"
                              value={selectedCount}
                              onChange={(event) => setSelectedCount(event.target.value)}
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
                              <MenuItem value="">Select Count</MenuItem>
                              <MenuItem value="1">1</MenuItem>
                              <MenuItem value="2">2</MenuItem>
                              <MenuItem value="3">3</MenuItem>
                              <MenuItem value="4">4</MenuItem>
                              <MenuItem value="5">5</MenuItem>
                            </TextField>

                          </div>
                        )
                      }

                      <div className='col'>
                        <button
                          type='button'
                          className='btn btn-sm addscreen'
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
*/}
        </div>
      </div>
      <div class="content-wrapper">
        <div class="content-header">
          <div class="container-fluid">
            <div className="row cardlistrow">
              <div className="col-md-3 searchfiledss">
                <input
                  placeholder='Search'
                  className="form-control searchscreenlist1"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <SearchIcon className="searchiconnew1111" />
              </div>

              <div className="col paginationnew">
                <TablePagination
                  component="div"
                  count={filteredCardData.length}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  rowsPerPageOptions={[6, 10, 20, 50, 75, 100]}
                />
              </div>
            </div>

            <div className="row">
              {
                loading ?
                  (
                    <tr>
                      <td colSpan="7" className="text-center">
                        <CircularProgress className='circular-progress-containerscreeninglist' style={{ margin: 'auto' }} />
                      </td>
                    </tr>
                  )
                  : (
                    filteredCardData.length === 0 ? (
                      <div className="col">
                        <h2 className="recordsfound">No records found.</h2>
                      </div>
                    ) :
                      (
                        filteredCardData
                          .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
                          .map((card, index) => {
                            const completeForms = card.form_counts?.complete_forms || 0;
                            const totalTables = card.form_counts?.total_tables || 1; // Avoid division by zero
                            const progressValue = (completeForms / totalTables) * 100;

                            return (
                              <div className="col-md-4 carddddds" key={card.pk_id}>
                                <div className="card card-spacing">
                                  <div className="card-body">
                                    <div className="row">
                                      <div className="mb-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                                        <PersonOutlineOutlinedIcon className="outlineperson" style={{ marginRight: '8px' }} />
                                        <h5 className='citizennamehealth'>
                                          {card.citizen_info && card.citizen_info.prefix ?
                                            (card.citizen_info.prefix.toLowerCase().charAt(0).toUpperCase() + card.citizen_info.prefix.toLowerCase().slice(1) + ".")
                                            :
                                            ""
                                          }
                                          {card.citizen_info && card.citizen_info.name ? card.citizen_info.name : ""}
                                        </h5>
                                      </div>

                                      <div className="ml-auto" style={{ display: 'flex' }}>
                                        <h6 className='screeningcountcard' style={{ marginLeft: 0, marginRight: '20px' }}>
                                          Screening: {card ? card.schedule_count : ""}
                                        </h6>
                                        {/* <h6
                                          className='screeningcountcard'
                                          style={{ marginLeft: '0.5em', position: 'relative', cursor: 'pointer' }}
                                          onClick={handleOpen}
                                        >
                                          <CircularProgress
                                            variant="determinate"
                                            value={100}
                                            size={40}
                                            thickness={2}
                                            style={{ color: 'rgba(49, 55, 116, 1)' }}
                                          />
                                          <span
                                            style={{
                                              position: 'absolute',
                                              top: '50%',
                                              left: '50%',
                                              transform: 'translate(-50%, -50%)',
                                              fontSize: '12px',
                                              color: '#000',
                                              textAlign: 'center'
                                            }}
                                          >
                                            {`${completeForms}/${totalTables}`}
                                          </span>
                                        </h6> */}

                                        <Modal
                                          open={open}
                                          onClose={handleClose}
                                          aria-labelledby="modal-title"
                                          aria-describedby="modal-description"
                                          style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                          }}
                                          BackdropProps={{
                                            style: {
                                              backgroundColor: 'transparent',
                                            },
                                          }}
                                        >
                                          <Box
                                            sx={{
                                              width: 300,
                                              padding: 2,
                                              backgroundColor: 'white',
                                            }}
                                          >
                                            <h2 id="modal-title">Modal Title</h2>
                                            <p id="modal-description">This is the content of the modal.</p>
                                          </Box>
                                        </Modal>
                                      </div>
                                    </div>

                                    <div className="row spaceinrow">
                                      <div className="col textstyle">Citizen Id </div>
                                      <div className="col valuestyle">{card ? card.citizen_id : ""}</div>
                                    </div>

                                    <div className="row spaceinrow">
                                      <div className="col textstyle">Schedule Id </div>
                                      <div className="col valuestyle"> {card ? card.schedule_id : ""}</div>
                                    </div>

                                    {
                                      SourceUrlId === '1' ?
                                        (
                                          <div className="row ">
                                            <div className="col textstyle">Phone Number</div>
                                            <div className="col valuestyle">{card.citizen_info ? card.citizen_info.parents_mobile : ""}</div>
                                          </div>
                                        )
                                        :
                                        (
                                          <>
                                            <div className="row ">
                                              <div className="col textstyle">Phone Number</div>
                                              <div className="col valuestyle">{card.citizen_info ? card.citizen_info.emp_mobile_no : ""}</div>
                                            </div>
                                          </>
                                        )
                                    }

                                    <button
                                      className="btn btn-sm start"
                                      onClick={() => handleStartScreening(page * rowsPerPage + index)}
                                    >
                                      Start Screening
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                      )
                  )
              }
              {/* filteredCardData
                        .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
                        .map((card, index) => (
                          <div className="col-md-4 carddddds" key={card.pk_id}>
                            <div className="card card-spacing">
                              <div className="card-body">
                                <div className="row">
                                  <div className="mb-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                                    <PersonOutlineOutlinedIcon className="outlineperson" style={{ marginRight: '8px' }} />
                                    <h5 className='citizennamehealth'>
                                      {card.citizen_info ?
                                        card.citizen_info.name.toLowerCase().charAt(0).toUpperCase() + card.citizen_info.name.toLowerCase().slice(1)
                                        :
                                        ""}
                                    </h5>
                                  </div>

                                  <div className="ml-auto">
                                    <h6 className='screeningcountcard'>Screening: {card ? card.schedule_count : ""}</h6>
                                  </div>
                                </div>

                                <div className="row spaceinrow">
                                  <div className="col textstyle">Citizen Id </div>
                                  <div className="col valuestyle">{card ? card.citizen_id : ""}</div>
                                </div>

                                <div className="row spaceinrow">
                                  <div className="col textstyle">Schedule Id </div>
                                  <div className="col valuestyle"> {card ? card.schedule_id : ""}</div>
                                </div>

                                <div className="row ">
                                  <div className="col textstyle">Phone Number</div>
                                  <div className="col valuestyle">{card.citizen_info ? card.citizen_info.parents_mobile : ""}</div>
                                </div>

                                <button
                                  className="btn btn-sm start"
                                  onClick={() => handleStartScreening(page * rowsPerPage + index)}
                                >
                                  Start Screening
                                </button>
                              </div>
                            </div>
                          </div>
                        )) */}
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};

export default ScreeningList;
