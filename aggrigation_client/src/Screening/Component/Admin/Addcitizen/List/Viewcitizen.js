import React, { useState, useEffect } from 'react'
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import './Citizenlist.css'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import Childview from './Childview';
import Corporateview from './Corporateview';

const Viewcitizen = (props) => {

    let { id } = useParams();
    console.log(id, 'iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii');
    const accessToken = localStorage.getItem('token');
    console.log(accessToken);

    let { sourceId } = useParams();
    console.log(sourceId, 'sourceId')

    const [data1, setData1] = useState([]);
    const Port = process.env.REACT_APP_API_KEY;

    // useEffect(() => {
    //     axios.get(`${Port}/Screening/add_citizen_get/${id}/`)
    //         .then((response) => {
    //             console.log('API response:', response.data);
    //             setData1(response.data)
    //             console.log(response.data, 'dattttttttttttttttttttttttttttttttttt');
    //         })
    //         .catch((error) => {
    //             console.error('Error:', error);

    //         });
    // }, [])

    useEffect(() => {
        let apiUrl = '';
        if (sourceId === 'School' || sourceId === 'Community') {
            apiUrl = `${Port}/Screening/add_citizen_get/${id}/`;
            console.log(apiUrl);
        } else if (sourceId === 'Corporate') {
            apiUrl = `${Port}/Screening/add_employee_get/${id}/`;
            console.log(apiUrl);
        }

        if (apiUrl) {
            axios.get(apiUrl, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            })
                .then((response) => {
                    console.log('API response:', response.data);
                    setData1(response.data);
                    console.log(response.data, 'dattttttttttttttttttttttttttttttttttt');
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }
    }, [sourceId, id]);

    return (
        <div>
            <div class="content-wrapper backgroundadd">
                <div class="content-header">
                    <div class="container-fluid">
                        <div className="card citizencard">
                            <div className="row ml-2">
                                <div className="back">
                                    <Link to="/mainscreen/Citizen">
                                        <ArrowBackIosIcon className='signupdate pl-1' />
                                    </Link>
                                </div>
                                <h5 className='namecitizen ml-2'>View Citizen</h5>
                            </div>

                            <div className="dropdownall mb-3">
                                <Box>
                                    <div class="container text-center">
                                        <div class="row dropdownrow">
                                            <div class="col textfiledcol">
                                                <TextField
                                                    className={`citizenlistdropdownfield whiteText`}
                                                    style={{ color: 'white' }}
                                                    value={sourceId === 'School' ? data1.age_name : data1.age_name}
                                                    size="small"
                                                    id="select-small"
                                                    variant="outlined"
                                                    InputLabelProps={{
                                                        style: {
                                                            fontWeight: '100',
                                                            fontSize: '14px',
                                                            color: 'white', 
                                                        },
                                                    }}
                                                />
                                            </div>

                                            <div class="col">
                                                <TextField
                                                    className="citizenlistdropdownfield"
                                                    value={data1.gender_name}
                                                    size="small"
                                                    id="select-small"
                                                    variant="outlined"
                                                    InputLabelProps={{
                                                        style: {
                                                            fontWeight: '100',
                                                            fontSize: '14px',
                                                        },
                                                    }}
                                                >
                                                </TextField>
                                            </div>

                                            <div class="col">
                                                <TextField
                                                    className="citizenlistdropdownfield"
                                                    value={data1.source_id_name}
                                                    size="small"
                                                    id="select-small"
                                                    variant="outlined"
                                                    InputLabelProps={{
                                                        style: {
                                                            fontWeight: '100',
                                                            fontSize: '14px',
                                                        },
                                                    }}
                                                >
                                                </TextField>
                                            </div>

                                            {/* <div class="col">
                                                <TextField
                                                    className="citizenlistdropdownfield"
                                                    value={data1.type_name}
                                                    size="small"
                                                    id="select-small"
                                                    variant="outlined"
                                                    InputLabelProps={{
                                                        style: {
                                                            fontWeight: '100',
                                                            fontSize: '14px',
                                                        },
                                                    }}
                                                >
                                                </TextField>
                                            </div> */}

                                            {/* <div class="col">
                                                <TextField
                                                    className="citizenlistdropdownfield"
                                                    value={data1.disease_name}
                                                    size="small"
                                                    id="select-small"
                                                    variant="outlined"
                                                    InputLabelProps={{
                                                        style: {
                                                            fontWeight: '100',
                                                            fontSize: '14px',
                                                        },
                                                    }}
                                                >
                                                </TextField>
                                            </div> */}
                                        </div>
                                    </div>
                                </Box>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='container'>
                {sourceId === 'Community' && (
                    <Childview data={data1} />
                )}
                {sourceId === 'Corporate' && (
                    <Corporateview data={data1} />
                )}
            </div>
        </div>
    )
}

export default Viewcitizen;
