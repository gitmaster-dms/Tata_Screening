import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import './Desk.css'
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Link } from 'react-router-dom'
import AddIcon from '@mui/icons-material/Add';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import axios from 'axios'

const Desk = () => {
  const Port = process.env.REACT_APP_API_KEY;
  const accessToken = localStorage.getItem('token');

  const [canView, setCanView] = useState(false);
  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    const storedPermissions = localStorage.getItem('permissions');
    console.log('Stored Permissions:', storedPermissions);
    const parsedPermissions = storedPermissions ? JSON.parse(storedPermissions) : [];
    console.log('parsedPermissions Permissions:', parsedPermissions);

    const hasEditPermission = parsedPermissions.some((p) =>
      p.modules_submodule.some((m) => m.moduleName === 'Follow-Up' && m.selectedSubmodules.some((s) => s.submoduleName === 'Edit'))
    );
    setCanEdit(hasEditPermission);


    const hasViewPermission = parsedPermissions.some((p) =>
      p.modules_submodule.some((m) => m.moduleName === 'Follow-Up' && m.selectedSubmodules.some((s) => s.submoduleName === 'View'))
    );
    setCanView(hasViewPermission);
  }, []);

  const [followUpStatusOptions, setFollowUpStatusOptions] = useState([]);
  const [selectedFollowUpStatus, setSelectedFollowUpStatus] = useState('');

  const [followUpFor, setFollowUpFor] = useState([]);
  const [selectedFollowUpFor, setSelectedFollowUpFor] = useState('');

  const [sourceName, setSourceName] = useState([]);
  const [selectedFollowUpForName, setselectedFollowUpForName] = useState('');

  const [showTable, setShowTable] = useState(false);
  console.log(selectedFollowUpFor, 'jjjjjjjjjjjjjjjjjjjjjjjj');
  console.log(selectedFollowUpForName, 'nnnnnnnnnnnnnnnnnnnnnnnn');
  console.log(selectedFollowUpStatus, 'kkkkkkkkkkkkkkkkkkkkkkk')

  //////////// FollowUp Status
  useEffect(() => {
    const fetchFollowUpValue = async () => {
      try {
        const response = await fetch(`${Port}/Screening/follow_up_dropdown_list/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setFollowUpStatusOptions(data);
        } else {
          throw new Error('Failed to fetch follow up status options');
        }
      } catch (error) {
        console.error('Error Fetching Data:', error);
      }
    };
    fetchFollowUpValue();
  }, [Port]);

  //////////// FollowUp For
  useEffect(() => {
    const fetchFollowForValue = async () => {
      try {
        const response = await fetch(`${Port}/Screening/follow_up_for/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setFollowUpFor(data);
        } else {
          throw new Error('Failed to fetch follow up status options');
        }
      } catch (error) {
        console.error('Error Fetching Data:', error);
      }
    };
    fetchFollowForValue();
  }, [Port]);

  //////////// source Name
  useEffect(() => {
    const fetchSourceName = async () => {
      try {
        const response = await fetch(`${Port}/Screening/source_name_get/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setSourceName(data);
        } else {
          throw new Error('Failed to fetch follow up status options');
        }
      } catch (error) {
        console.error('Error Fetching Data:', error);
      }
    };
    fetchSourceName();
  }, [Port]);

  const handleFollowUpStatusChange = (event) => {
    setSelectedFollowUpStatus(event.target.value);
  };

  const handleFollowUpForChange = (event) => {
    setSelectedFollowUpFor(event.target.value);
  };

  const handleSourceNameChange = (event) => {
    setselectedFollowUpForName(event.target.value);
  };

  const handleSearch = () => {
    setShowTable(true); // Show the table
    fetchData(); 
  };

  const [tableData, setTableData] = useState([]);

  const fetchData = async () => {
    try {
      let url = `${Port}/Screening/follow-up/`;

      if (selectedFollowUpStatus) {
        url += `${selectedFollowUpStatus}/`;
      }

      if (selectedFollowUpFor) {
        url += `${selectedFollowUpFor}/`;
      }

      if (selectedFollowUpForName) {
        url += `${selectedFollowUpForName}/`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setTableData(data);
      } else {
        throw new Error('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error Fetching Data:', error);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, [selectedFollowUpStatus, selectedFollowUpFor, selectedFollowUpForName]);

  return (
    <div>
      <div className="content-wrapper" style={{ marginTop: '3.5em' }}>
        <div className="card deskcard m-2" style={{ backgroundColor: '#313774', color: 'white' }}>
          <div class="row">
            <div class="col">
              <h5 className='desktitle'>FollowUp Desk</h5>
            </div>
          </div>

          <div className="dropdowndesk">
            <Box>
              <div className="row">
                <div className="col">
                  <TextField
                    select
                    className="DeskdropDown"
                    size="small"
                    label="FollowUp Status"
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
                    value={selectedFollowUpStatus}
                    onChange={handleFollowUpStatusChange}
                  >
                    {followUpStatusOptions.map((option) => (
                      <MenuItem key={option.followup_pk_id} value={option.followup_pk_id}>
                        {option.follow_up}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>

                <div className="col">
                  <TextField
                    select
                    className="DeskdropDown"
                    size="small"
                    label="Followup For"
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
                    value={selectedFollowUpFor}
                    onChange={handleFollowUpForChange}
                  >
                    {
                      followUpFor.map((options) => (
                        <MenuItem key={options.followupfor_pk_id} value={options.followupfor_pk_id}>
                          {options.follow_up_for}
                        </MenuItem>
                      ))
                    }
                  </TextField>
                </div>

                <div className="col">
                  <TextField
                    select
                    className="DeskdropDown"
                    size="small"
                    label="Source Name"
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
                    value={selectedFollowUpForName}
                    onChange={handleSourceNameChange}
                  >
                    <MenuItem value="">Select Source Name</MenuItem>
                    {
                      sourceName.map((options) => (
                        <MenuItem key={options.source_names} value={options.source_pk_id}>
                          {options.source_names}
                        </MenuItem>
                      ))
                    }
                  </TextField>
                </div>

                <div className="col mt-1">
                  <Stack direction="row">
                    <Button size="small" style={{ color: '#313774', backgroundColor: 'white' }} onClick={handleSearch}>Search</Button>
                  </Stack>
                </div>
              </div>
            </Box>
          </div>

          <div className="row inputdeskkk">
            <div className="ml-2 d-flex justify-content-end">
              <input className='form-control form-control-sm' placeholder='Search' />
            </div>
          </div>

          {/* <div className="row table-container tabledatadesk"> */}
          {showTable && (
            <div>
              {selectedFollowUpStatus === 1 && (
                <div>
                  {selectedFollowUpFor === 4 && (
                    <table className="table table-borderless">
                      <thead className="">
                        <tr className="card cardheaduserdesk">
                          <th className="col haedtitledesk">Sr No.</th>
                          <th className="col haedtitledesk">Citizen ID</th>
                          <th className="col haedtitledesk">Screening ID</th>
                          <th className="col haedtitledesk">Citizen Name</th>
                          <th className="col haedtitledesk">Vital</th>
                          <th className="col haedtitledesk">Basic Screening</th>
                          <th className="col haedtitledesk">Auditory</th>
                          <th className="col haedtitledesk">Dental</th>
                          <th className="col haedtitledesk">Vision</th>
                          <th className="col haedtitledesk">Psychological</th>
                          <th className="col haedtitledesk">Action</th>
                        </tr>
                      </thead>

                      <tbody className="">
                        {tableData.map((item, index) => (
                          <tr key={index} className="card cardbodyuserdesk">
                            <td className="col headbodydesk">{index + 1}</td>
                            <td className="col headbodydesk">{item.citizen_id}</td>
                            <td className="col headbodydesk">{item.schedule_id}</td>
                            <td className="col headbodydesk">{item.citizen_name}</td>
                            <td className="col headbodydesk">{item.vital_refer === 1 ? 'Yes' : 'No'}</td>
                            <td className="col headbodydesk">{item.basic_screening_refer === 1 ? 'Yes' : 'No'}</td>
                            <td className="col headbodydesk">{item.auditory_refer === 1 ? 'Yes' : 'No'}</td>
                            <td className="col headbodydesk">{item.dental_refer === 1 ? 'Yes' : 'No'}</td>
                            <td className="col headbodydesk">{item.vision_refer === 1 ? 'Yes' : 'No'}</td>
                            <td className="col headbodydesk">{item.pycho_refer === 1 ? 'Yes' : 'No'}</td>
                            <td className="col headbody">
                              {/* {canEdit && (
                            <Link >
                              <AddIcon className="ml-3 iconfollowupdesk" />
                            </Link>
                          )} */}
                              {canView && (
                                <Link to={`/mainscreen/Follow-Up/viewFollowup/${item.citizen_id}/`}>
                                  <RemoveRedEyeOutlinedIcon className="ml-1 iconfollowupdesk" />
                                </Link>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {selectedFollowUpFor === 1 && (
                    <table className="table table-borderless">
                      <thead className="">
                        <tr className="card cardheaduserdesk">
                          <th className="col haedtitledesk">Sr No.</th>
                          <th className="col haedtitledesk">Citizen ID</th>
                          <th className="col haedtitledesk">Screening ID</th>
                          <th className="col haedtitledesk">Citizen Name</th>
                          <th className="col haedtitledesk">SAM</th>
                          <th className="col haedtitledesk">Action</th>
                        </tr>
                      </thead>

                      <tbody className="">
                        {tableData.map((item, index) => (
                          <tr key={index} className="card cardbodyuserdesk">
                            <td className="col headbodydesk">{index + 1}</td>
                            <td className="col headbodydesk">{item.citizen_id}</td>
                            <td className="col headbodydesk">{item.schedule_id}</td>
                            <td className="col headbodydesk">{item.citizen_name}</td>
                            <td className="col headbodydesk">SAM</td>
                            <td className="col headbody">
                              {canView && (
                                <Link to={`/mainscreen/Follow-Up/viewFollowup/${item.citizen_id}/`}>
                                  <RemoveRedEyeOutlinedIcon className="ml-1 iconfollowupdesk" />
                                </Link>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {selectedFollowUpFor === 2 && (
                    <table className="table table-borderless">
                      <thead className="">
                        <tr className="card cardheaduserdesk">
                          <th className="col haedtitledesk">Sr No.</th>
                          <th className="col haedtitledesk">Citizen ID</th>
                          <th className="col haedtitledesk">Screening ID</th>
                          <th className="col haedtitledesk">Citizen Name</th>
                          <th className="col haedtitledesk">MAM</th>
                          <th className="col haedtitledesk">Action</th>
                        </tr>
                      </thead>

                      <tbody className="">
                        {tableData.map((item, index) => (
                          <tr key={index} className="card cardbodyuserdesk">
                            <td className="col headbodydesk">{index + 1}</td>
                            <td className="col headbodydesk">{item.childId}</td>
                            <td className="col headbodydesk">{item.screeningId}</td>
                            <td className="col headbodydesk">{item.citizenName}</td>
                            <td className="col headbodydesk">MAM</td>
                            <td className="col headbody">
                              {canView && (
                                <Link to={`/mainscreen/Follow-Up/viewFollowup/${item.citizen_id}/`}>
                                  <RemoveRedEyeOutlinedIcon className="ml-1 iconfollowupdesk" />
                                </Link>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {selectedFollowUpStatus === 3 && (
                <div>
                  {selectedFollowUpFor === 1 && (
                    <table className="table table-borderless">
                      <thead className="">
                        <tr className="card cardheaduserdesk">
                          <th className="col-md-2 haedtitledesk">Sr No.</th>
                          <th className="col haedtitledesk">Citizen ID</th>
                          <th className="col haedtitledesk">Screening ID</th>
                          <th className="col haedtitledesk">Citizen Name</th>
                          <th className="col haedtitledesk">SAM</th>
                          <th className="col haedtitledesk">Action</th>
                        </tr>
                      </thead>

                      <tbody className="">
                        {tableData.map((item, index) => (
                          <tr key={index} className="card cardbodyuserdesk">
                            <td className="col-md-2  headbodydesk">{index + 1}</td>
                            <td className="col headbodydesk">{item.citizen_id}</td>
                            <td className="col headbodydesk">{item.schedule_id}</td>
                            <td className="col headbodydesk">{item.citizen_name}</td>
                            <td className="col headbodydesk">{item.weight_for_height === 'SAM' ? 'Yes' : 'No'}</td>
                            <td className="col headbody">
                              {canEdit && (
                                <Link to={`/mainscreen/Follow-Up/addFollowup/${item.citizen_id}/${item.schedule_id}/${item.follow_up_ctzn_pk}`}>
                                  <AddIcon className="ml-3 iconfollowupdesk" />
                                </Link>
                              )}
                              {canView && (
                                <Link to={`/mainscreen/Follow-Up/viewFollowup/${item.citizen_id}/`}>
                                  <RemoveRedEyeOutlinedIcon className="ml-1 iconfollowupdesk" />
                                </Link>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>

                    </table>
                  )}

                  {selectedFollowUpFor === 2 && (
                    <table className="table table-borderless">
                      <thead className="">
                        <tr className="card cardheaduserdesk">
                          <th className="col-md-2 haedtitledesk">Sr No.</th>
                          <th className="col haedtitledesk">Citizen ID</th>
                          <th className="col haedtitledesk">Screening ID</th>
                          <th className="col haedtitledesk">Citizen Name</th>
                          <th className="col haedtitledesk">MAM</th>
                          <th className="col haedtitledesk">Action</th>
                        </tr>
                      </thead>

                      <tbody className="">
                        {tableData.map((item, index) => (
                          <tr key={index} className="card cardbodyuserdesk">
                            <td className="col-md-2  headbodydesk">{index + 1}</td>
                            <td className="col headbodydesk">{item.citizen_id}</td>
                            <td className="col headbodydesk">{item.schedule_id}</td>
                            <td className="col headbodydesk">{item.citizen_name}</td>
                            <td className="col headbodydesk">{item.weight_for_height === 'MAM' ? 'Yes' : 'No'}</td>
                            <td className="col headbody">
                              {canEdit && (
                                <Link to={`/mainscreen/Follow-Up/addFollowup/${item.citizen_id}/${item.schedule_id}/${item.follow_up_ctzn_pk}`}>
                                  <AddIcon className="ml-3 iconfollowupdesk" />
                                </Link>
                              )}
                              {canView && (
                                <Link to={`/mainscreen/Follow-Up/viewFollowup/${item.citizen_id}/`}>
                                  <RemoveRedEyeOutlinedIcon className="ml-1 iconfollowupdesk" />
                                </Link>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>

                    </table>
                  )}

                  {selectedFollowUpFor === 4 && (
                    <table className="table table-borderless">
                      <thead className="">
                        <tr className="card cardheaduserdesk">
                          <th className="col-md-1 haedtitledesk">Sr No.</th>
                          <th className="col haedtitledesk">Citizen ID</th>
                          <th className="col haedtitledesk">Screening ID</th>
                          <th className="col haedtitledesk">Citizen Name</th>
                          <th className="col haedtitledesk">Vital</th>
                          <th className="col haedtitledesk">Basic Screening</th>
                          <th className="col haedtitledesk">Auditory</th>
                          <th className="col haedtitledesk">Dental</th>
                          <th className="col haedtitledesk">Vision</th>
                          <th className="col haedtitledesk">Psychological</th>
                          <th className="col haedtitledesk">Action</th>
                        </tr>
                      </thead>

                      <tbody className="">
                        {tableData.map((item, index) => (
                          <tr key={index} className="card cardbodyuserdesk">
                            <td className="col-md-1 headbodydesk">{index + 1}</td>
                            <td className="col headbodydesk">{item.citizen_id}</td>
                            <td className="col headbodydesk">{item.schedule_id}</td>
                            <td className="col headbodydesk">{item.citizen_name}</td>
                            <td className="col headbodydesk">{item.vital_refer === 1 ? 'Yes' : 'No'}</td>
                            <td className="col headbodydesk">{item.basic_screening_refer === 1 ? 'Yes' : 'No'}</td>
                            <td className="col headbodydesk">{item.auditory_refer === 1 ? 'Yes' : 'No'}</td>
                            <td className="col headbodydesk">{item.dental_refer === 1 ? 'Yes' : 'No'}</td>
                            <td className="col headbodydesk">{item.vision_refer === 1 ? 'Yes' : 'No'}</td>
                            <td className="col headbodydesk">{item.pycho_refer === 1 ? 'Yes' : 'No'}</td>
                            <td className="col headbody">
                              {canEdit && (
                                <Link to={`/mainscreen/Follow-Up/addFollowup/${item.citizen_id}/${item.schedule_id}/${item.follow_up_ctzn_pk}`}>
                                  <AddIcon className="ml-3 iconfollowupdesk" />
                                </Link>
                              )}
                              {canView && (
                                <Link to={`/mainscreen/Follow-Up/viewFollowup/${item.citizen_id}/`}>
                                  <RemoveRedEyeOutlinedIcon className="ml-1 iconfollowupdesk" />
                                </Link>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {selectedFollowUpStatus === 2 && (
                <div>
                  {selectedFollowUpFor === 1 && (
                    <table className="table table-borderless">
                      <thead className="">
                        <tr className="card cardheaduserdesk">
                          <th className="col-md-2 haedtitledesk">Sr No.</th>
                          <th className="col haedtitledesk">Citizen ID</th>
                          <th className="col haedtitledesk">Screening ID</th>
                          <th className="col haedtitledesk">Citizen Name</th>
                          <th className="col haedtitledesk">SAM</th>
                          <th className="col haedtitledesk">Action</th>
                        </tr>
                      </thead>

                      <tbody className="">
                        {tableData.map((item, index) => (
                          <tr key={index} className="card cardbodyuserdesk">
                            <td className="col-md-2  headbodydesk">{index + 1}</td>
                            <td className="col headbodydesk">{item.citizen_id}</td>
                            <td className="col headbodydesk">{item.schedule_id}</td>
                            <td className="col headbodydesk">{item.citizen_name}</td>
                            <td className="col headbodydesk">{item.weight_for_height === 'SAM' ? 'Yes' : 'No'}</td>
                            <td className="col headbody">
                              {canEdit && (
                                <Link to={`/mainscreen/Follow-Up/addFollowup/${item.citizen_id}/${item.schedule_id}/${item.follow_up_ctzn_pk}`}>
                                  <AddIcon className="ml-3 iconfollowupdesk" />
                                </Link>
                              )}
                              {canView && (
                                <Link to={`/mainscreen/Follow-Up/viewFollowup/${item.citizen_id}/`}>
                                  <RemoveRedEyeOutlinedIcon className="ml-1 iconfollowupdesk" />
                                </Link>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>

                    </table>
                  )}

                  {selectedFollowUpFor === 2 && (
                    <table className="table table-borderless">
                      <thead className="">
                        <tr className="card cardheaduserdesk">
                          <th className="col-md-2 haedtitledesk">Sr No.</th>
                          <th className="col haedtitledesk">Citizen ID</th>
                          <th className="col haedtitledesk">Screening ID</th>
                          <th className="col haedtitledesk">Citizen Name</th>
                          <th className="col haedtitledesk">MAM</th>
                          <th className="col haedtitledesk">Action</th>
                        </tr>
                      </thead>

                      <tbody className="">
                        {tableData.map((item, index) => (
                          <tr key={index} className="card cardbodyuserdesk">
                            <td className="col-md-2  headbodydesk">{index + 1}</td>
                            <td className="col headbodydesk">{item.citizen_id}</td>
                            <td className="col headbodydesk">{item.schedule_id}</td>
                            <td className="col headbodydesk">{item.citizen_name}</td>
                            <td className="col headbodydesk">{item.weight_for_height === 'MAM' ? 'Yes' : 'No'}</td>
                            <td className="col headbody">
                              {canEdit && (
                                <Link to={`/mainscreen/Follow-Up/addFollowup/${item.citizen_id}/${item.schedule_id}/${item.follow_up_ctzn_pk}`}>
                                  <AddIcon className="ml-3 iconfollowupdesk" />
                                </Link>
                              )}
                              {canView && (
                                <Link to={`/mainscreen/Follow-Up/viewFollowup/${item.citizen_id}/`}>
                                  <RemoveRedEyeOutlinedIcon className="ml-1 iconfollowupdesk" />
                                </Link>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>

                    </table>
                  )}

                  {selectedFollowUpFor === 4 && (
                    <table className="table table-borderless">
                      <thead className="">
                        <tr className="card cardheaduserdesk">
                          <th className="col-md-1 haedtitledesk">Sr No.</th>
                          <th className="col haedtitledesk">Citizen ID</th>
                          <th className="col haedtitledesk">Screening ID</th>
                          <th className="col haedtitledesk">Citizen Name</th>
                          <th className="col haedtitledesk">Vital</th>
                          <th className="col haedtitledesk">Basic Screening</th>
                          <th className="col haedtitledesk">Auditory</th>
                          <th className="col haedtitledesk">Dental</th>
                          <th className="col haedtitledesk">Vision</th>
                          <th className="col haedtitledesk">Psychological</th>
                          <th className="col haedtitledesk">Action</th>
                        </tr>
                      </thead>

                      <tbody className="">
                        {tableData.map((item, index) => (
                          <tr key={index} className="card cardbodyuserdesk">
                            <td className="col-md-1 headbodydesk">{index + 1}</td>
                            <td className="col headbodydesk">{item.citizen_id}</td>
                            <td className="col headbodydesk">{item.schedule_id}</td>
                            <td className="col headbodydesk">{item.citizen_name}</td>
                            <td className="col headbodydesk">{item.vital_refer === 1 ? 'Yes' : 'No'}</td>
                            <td className="col headbodydesk">{item.basic_screening_refer === 1 ? 'Yes' : 'No'}</td>
                            <td className="col headbodydesk">{item.auditory_refer === 1 ? 'Yes' : 'No'}</td>
                            <td className="col headbodydesk">{item.dental_refer === 1 ? 'Yes' : 'No'}</td>
                            <td className="col headbodydesk">{item.vision_refer === 1 ? 'Yes' : 'No'}</td>
                            <td className="col headbodydesk">{item.pycho_refer === 1 ? 'Yes' : 'No'}</td>
                            <td className="col headbody">
                              {canEdit && (
                                <Link to={`/mainscreen/Follow-Up/addFollowup/${item.citizen_id}/${item.schedule_id}/${item.follow_up_ctzn_pk}`}>
                                  <AddIcon className="ml-3 iconfollowupdesk" />
                                </Link>
                              )}
                              {/* {canView && (
                            <Link to={`/mainscreen/Follow-Up/viewFollowup/${item.citizen_id}/`}>
                              <RemoveRedEyeOutlinedIcon className="ml-1 iconfollowupdesk" />
                            </Link>
                          )} */}
                            </td>
                          </tr>
                        ))}
                      </tbody>

                    </table>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
    // </div>
  )
}

export default Desk
