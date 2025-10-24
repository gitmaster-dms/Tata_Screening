import React, { useState, useEffect } from 'react';
import { Modal, Card, CardContent, Button } from '@mui/material';
import backgroundImage from '../../../Images/Group 427318866 (2).png';
import { Grid } from '@mui/material';
import html2pdf from 'html2pdf.js'; // Import html2pdf library

const Healthcarddownload = ({ selectedCitizenId, selectedScheduleCount, imageShows }) => {
    const Port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');
    const [healthData, setHealthData] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    console.log(imageShows,'imageShowsimageShowsimageShowsimageShowsimageShowsimageShowsimageShowsimageShows');

    const handleDownloadClick = async () => {
        if (selectedCitizenId && selectedScheduleCount) {
            try {
                const response = await fetch(`${Port}/Screening/citizen-download/${selectedCitizenId}/${selectedScheduleCount}/`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                const data = await response.json();
                setHealthData(data);
                setModalOpen(true); // Open modal after data is fetched
            } catch (error) {
                console.error("Error fetching Source Name against Tehsil data:", error);
            }
        }
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleDownloadPDF = () => {
        console.log("Downloading PDF...");
        const element = document.getElementById('modal-content');

        if (element) {
            html2pdf().from(element).save();
        } else {
            console.error("Element 'modal-content' not found or is empty.");
        }
    };

    return (
        <div>
            <button className="downloadhealthcardddddddddddddddddddddddddddd" onClick={handleDownloadClick}>
                Download
            </button>
            <Modal
                open={modalOpen}
                onClose={handleCloseModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Card
                    style={{
                        width: 800, height: 550,
                        backgroundImage: `url(${backgroundImage})`,
                        backgroundSize: 'cover',
                        overflowY: 'auto'
                    }}
                    id="modal-content">
                    <CardContent style={{ textAlign: 'center', fontFamily: 'Roboto', color: 'white' }}>
                        {healthData.basic_info && healthData.basic_info.length > 0 && (
                            <h3 style={{ marginBottom: '25px', fontWeight: 'normal' }}>{healthData.basic_info[0].source_name}</h3>
                        )}

                        <Grid container spacing={2} style={{ marginBottom: '50px' }}>
                            <Grid item xs={7}>
                                <Grid container spacing={2}>
                                    <Grid item md={5}>
                                        hey
                                    </Grid>

                                    <Grid item md={7}>
                                        <Grid container style={{ gap: 0 }}>
                                            <Grid item xs={12}>
                                                {healthData.basic_info && healthData.basic_info.length > 0 && (
                                                    <>
                                                        <Grid item xs={12} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                            <p style={{ fontWeight: 400, margin: '0' }}>{healthData.basic_info[0].name}</p>
                                                            <p style={{ fontWeight: 400, margin: '0' }}>{healthData.basic_info[0].gender}</p>
                                                            <p style={{ fontWeight: 400, margin: '0' }}>{healthData.basic_info[0].year}</p>
                                                        </Grid>
                                                    </>
                                                )}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item xs={5}>
                                <Grid container style={{ gap: 0 }}>
                                    <Grid item xs={12}>
                                        {healthData.basic_info && healthData.basic_info.length > 0 && (
                                            <>
                                                <Grid item xs={12} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left', marginLeft: '40px' }}>
                                                    <p style={{ margin: '0' }}>Citizen ID: {healthData.basic_info[0].citizen_id}</p>
                                                    <p style={{ margin: '0' }}>Schedule ID: {healthData.basic_info[0].schedule_id}</p>
                                                    <p style={{ margin: '0' }}>Screening:  {healthData.basic_info[0].schedule_count}</p>
                                                </Grid>
                                            </>
                                        )}
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid container spacing={2} style={{ color: 'black' }}>
                            <Grid item xs={6}>
                                <Card style={{ backgroundColor: '#F4F5FA', boxShadow: 'none', borderRadius: '25px', height: '100%' }}>
                                    <CardContent>
                                        <Grid container spacing={2}>
                                            <Grid item md={7}>
                                                <Grid container style={{ gap: 0 }}>
                                                    <Grid item xs={12}>
                                                        {healthData.basic_info && healthData.basic_info.length > 0 && (
                                                            <>
                                                                <h6 style={{ marginBottom: '25px', fontWeight: 'normal', color: '#313774', textDecoration: 'underline' }}>BMI SCREENING</h6>
                                                                <Grid container spacing={2}>
                                                                    <Grid item xs={9} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left', margin: 0 }}>
                                                                        <p style={{ fontWeight: 400, margin: '0' }}>Height :</p>
                                                                    </Grid>
                                                                    <Grid item xs={3} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left', margin: 0 }}>
                                                                        <p style={{ fontWeight: 'bold', margin: '0' }}>{healthData.bmi_info[0].height}</p>
                                                                    </Grid>

                                                                    <Grid item xs={9} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left', margin: 0 }}>
                                                                        <p style={{ fontWeight: 400, margin: '0' }}>Weight :</p>
                                                                    </Grid>
                                                                    <Grid item xs={3} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left', margin: 0 }}>
                                                                        <p style={{ fontWeight: 'bold', margin: '0' }}>{healthData.bmi_info[0].height}</p>
                                                                    </Grid>

                                                                    <Grid item xs={9} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 400, margin: '0' }}>Weight for Age :</p>
                                                                    </Grid>
                                                                    <Grid item xs={3} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 'bold', margin: '0' }}>{healthData.bmi_info[0].height}</p>
                                                                    </Grid>

                                                                    <Grid item xs={9} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 400, margin: '0' }}>Height for Age :</p>
                                                                    </Grid>
                                                                    <Grid item xs={3} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 'bold', margin: '0' }}>{healthData.bmi_info[0].height}</p>
                                                                    </Grid>

                                                                    <Grid item xs={9} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 400, margin: '0' }}>Weight for Height :</p>
                                                                    </Grid>
                                                                    <Grid item xs={3} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 'bold', margin: '0' }}>{healthData.bmi_info[0].height}</p>
                                                                    </Grid>

                                                                    <Grid item xs={9} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 400, margin: '0' }}>BMI :</p>
                                                                    </Grid>
                                                                    <Grid item xs={3} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 'bold', margin: '0' }}>{healthData.bmi_info[0].height}</p>
                                                                    </Grid>

                                                                    <Grid item xs={9} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 400, margin: '0' }}>Arm :</p>
                                                                    </Grid>
                                                                    <Grid item xs={3} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 'bold', margin: '0' }}>{healthData.bmi_info[0].height}</p>
                                                                    </Grid>
                                                                </Grid>
                                                            </>
                                                        )}
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={6}>
                                <Card style={{ backgroundColor: '#F4F5FA', boxShadow: 'none', borderRadius: '25px', height: '100%' }}>
                                    <CardContent>
                                        <Grid container spacing={2}>
                                            <Grid item md={7}>
                                                <Grid container style={{ gap: 0 }}>
                                                    <Grid item xs={12}>
                                                        {healthData.basic_info && healthData.basic_info.length > 0 && (
                                                            <>
                                                                <h6 style={{ marginBottom: '25px', fontWeight: 'normal', color: '#313774', textDecoration: 'underline' }}>BASIC SCREENING</h6>
                                                                <Grid container spacing={2}>
                                                                    <Grid item xs={9} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left', margin: 0 }}>
                                                                        <p style={{ fontWeight: 400, margin: '0' }}>Head :</p>
                                                                    </Grid>
                                                                    <Grid item xs={3} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left', margin: 0 }}>
                                                                        <p style={{ fontWeight: 'bold', margin: '0' }}>{healthData.basic_info[0].head || '-'}</p>
                                                                    </Grid>

                                                                    <Grid item xs={9} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left', margin: 0 }}>
                                                                        <p style={{ fontWeight: 400, margin: '0' }}>Neck :</p>
                                                                    </Grid>
                                                                    <Grid item xs={3} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left', margin: 0 }}>
                                                                        <p style={{ fontWeight: 'bold', margin: '0' }}>{healthData.basic_info[0].neck || '-'}</p>
                                                                    </Grid>

                                                                    <Grid item xs={9} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 400, margin: '0' }}>Skin Texture  :</p>
                                                                    </Grid>
                                                                    <Grid item xs={3} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 'bold', margin: '0' }}>{healthData.basic_info[0].skin_texture || '-'}</p>
                                                                    </Grid>

                                                                    <Grid item xs={9} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 400, margin: '0' }}>Lips :</p>
                                                                    </Grid>
                                                                    <Grid item xs={3} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 'bold', margin: '0' }}>{healthData.basic_info[0].lips || '-'}</p>
                                                                    </Grid>

                                                                    <Grid item xs={9} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 400, margin: '0' }}>Mouth Tongue :</p>
                                                                    </Grid>
                                                                    <Grid item xs={3} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 'bold', margin: '0' }}>{healthData.basic_info[0].tongue || '-'}</p>
                                                                    </Grid>

                                                                    <Grid item xs={9} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 400, margin: '0' }}>Hair Density :</p>
                                                                    </Grid>
                                                                    <Grid item xs={3} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 'bold', margin: '0' }}>{healthData.basic_info[0].hair_density || '-'}</p>
                                                                    </Grid>

                                                                    <Grid item xs={9} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 400, margin: '0' }}>Skin colour :</p>
                                                                    </Grid>
                                                                    <Grid item xs={3} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 'bold', margin: '0' }}>{healthData.basic_info[0].skin_color || '-'}</p>
                                                                    </Grid>

                                                                    <Grid item xs={9} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 400, margin: '0' }}>Gums :</p>
                                                                    </Grid>
                                                                    <Grid item xs={3} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 'bold', margin: '0' }}>{healthData.basic_info[0].gums || '-'}</p>
                                                                    </Grid>


                                                                    <Grid item xs={9} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 400, margin: '0' }}>Dention :</p>
                                                                    </Grid>
                                                                    <Grid item xs={3} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 'bold', margin: '0' }}>{healthData.basic_info[0].dention || '-'}</p>
                                                                    </Grid>


                                                                    <Grid item xs={9} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 400, margin: '0' }}>Extremity :</p>
                                                                    </Grid>
                                                                    <Grid item xs={3} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 'bold', margin: '0' }}>{healthData.basic_info[0].extremity || '-'}</p>
                                                                    </Grid>
                                                                </Grid>
                                                            </>
                                                        )}
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={6}>
                                <Card style={{ backgroundColor: '#F4F5FA', boxShadow: 'none', borderRadius: '25px', height: '100%' }}>
                                    <CardContent>
                                        <Grid container spacing={2}>
                                            <Grid item md={7}>
                                                <Grid container style={{ gap: 0 }}>
                                                    <Grid item xs={12}>
                                                        {healthData.vital_info && healthData.vital_info.length > 0 && (
                                                            <>
                                                                <h6 style={{ marginBottom: '25px', fontWeight: 'normal', color: '#313774', textDecoration: 'underline' }}>VITALS</h6>
                                                                <Grid container spacing={2}>
                                                                    <Grid item xs={9} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 400, margin: '0' }}>Pulse  :</p>
                                                                    </Grid>
                                                                    <Grid item xs={3} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 'bold', margin: '0' }}>{healthData.vital_info[0].pulse || '-'}</p>
                                                                    </Grid>

                                                                    <Grid item xs={9} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 400, margin: '0' }}>Sys(mm) :</p>
                                                                    </Grid>
                                                                    <Grid item xs={3} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 'bold', margin: '0' }}>{healthData.vital_info[0].sys_mm || '-'}</p>
                                                                    </Grid>

                                                                    <Grid item xs={9} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 400, margin: '0' }}>Dys(mm) :</p>
                                                                    </Grid>
                                                                    <Grid item xs={3} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 'bold', margin: '0' }}>{healthData.vital_info[0].dys_mm || '-'}</p>
                                                                    </Grid>

                                                                    <Grid item xs={9} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 400, margin: '0' }}>HB :</p>
                                                                    </Grid>
                                                                    <Grid item xs={3} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 'bold', margin: '0' }}>{healthData.vital_info[0].hb || '-'}</p>
                                                                    </Grid>

                                                                    <Grid item xs={9} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 400, margin: '0' }}>O2 :</p>
                                                                    </Grid>
                                                                    <Grid item xs={3} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 'bold', margin: '0' }}>{healthData.vital_info[0].oxygen_saturation || '-'}</p>
                                                                    </Grid>

                                                                    <Grid item xs={9} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 400, margin: '0' }}>RR :</p>
                                                                    </Grid>
                                                                    <Grid item xs={3} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 'bold', margin: '0' }}>{healthData.vital_info[0].rr || '-'}</p>
                                                                    </Grid>

                                                                    <Grid item xs={9} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 400, margin: '0' }}>Temperature :</p>
                                                                    </Grid>
                                                                    <Grid item xs={3} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 'bold', margin: '0' }}>{healthData.vital_info[0].temp || '-'}</p>
                                                                    </Grid>
                                                                </Grid>
                                                            </>
                                                        )}
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* /// Audit  */}
                            <Grid item xs={6}>
                                <Card style={{ backgroundColor: '#F4F5FA', boxShadow: 'none', borderRadius: '25px', height: '100%' }}>
                                    <CardContent>
                                        <Grid container spacing={2}>
                                            <Grid item md={7}>
                                                <Grid container style={{ gap: 0 }}>
                                                    <Grid item xs={12}>
                                                        {healthData.audit_info && healthData.audit_info.length > 0 && (
                                                            <>
                                                                <h6 style={{ marginBottom: '25px', fontWeight: 'normal', color: '#313774', textDecoration: 'underline' }}>AUDIT INFORMATION</h6>
                                                                <Grid container spacing={2}>
                                                                    <Grid item xs={9} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 400, margin: '0' }}>Right  :</p>
                                                                    </Grid>
                                                                    <Grid item xs={3} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 'bold', margin: '0' }}>{healthData.audit_info[0].right || '-'}</p>
                                                                    </Grid>

                                                                    <Grid item xs={9} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 400, margin: '0' }}>Left :</p>
                                                                    </Grid>
                                                                    <Grid item xs={3} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 'bold', margin: '0' }}>{healthData.audit_info[0].left || '-'}</p>
                                                                    </Grid>

                                                                    <Grid item xs={9} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 400, margin: '0' }}>Treatment Given :</p>
                                                                    </Grid>
                                                                    <Grid item xs={3} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 'bold', margin: '0' }}>{healthData.audit_info[0].tratement_given || '-'}</p>
                                                                    </Grid>

                                                                    <Grid item xs={9} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 400, margin: '0' }}>Remark :</p>
                                                                    </Grid>
                                                                    <Grid item xs={3} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 'bold', margin: '0' }}>{healthData.audit_info[0].remark || '-'}</p>
                                                                    </Grid>
                                                                </Grid>
                                                            </>
                                                        )}
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* /// psycho */}
                            <Grid item xs={6}>
                                <Card style={{ backgroundColor: '#F4F5FA', boxShadow: 'none', borderRadius: '25px', height: '100%' }}>
                                    <CardContent>
                                        <Grid container spacing={2}>
                                            <Grid item md={7}>
                                                <Grid container style={{ gap: 0 }}>
                                                    <Grid item xs={12}>
                                                        {healthData.psycho_info && healthData.psycho_info.length > 0 && (
                                                            <>
                                                                <h6 style={{ marginBottom: '25px', fontWeight: 'normal', color: '#313774', textDecoration: 'underline' }}>PSYCHOLOGICAL</h6>
                                                                <Grid container spacing={2}>
                                                                    <Grid item xs={10} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 400, margin: '0' }}>Difficulty In Reading  :</p>
                                                                    </Grid>
                                                                    <Grid item xs={2} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 'bold', margin: '0' }}>{healthData.psycho_info[0].diff_in_read === 2 ? 'Yes' : 'No'}</p>
                                                                    </Grid>

                                                                    <Grid item xs={10} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 400, margin: '0' }}>Difficulty In Writing :</p>
                                                                    </Grid>
                                                                    <Grid item xs={2} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 'bold', margin: '0' }}>{healthData.psycho_info[0].diff_in_write === 2 ? 'Yes' : 'No'}</p>
                                                                    </Grid>

                                                                    <Grid item xs={10} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 400, margin: '0' }}>Hyper Reactive :</p>
                                                                    </Grid>
                                                                    <Grid item xs={2} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 'bold', margin: '0' }}>{healthData.psycho_info[0].hyper_reactive === 2 ? 'Yes' : 'No'}</p>
                                                                    </Grid>

                                                                    <Grid item xs={10} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 400, margin: '0' }}>Aggresive :</p>
                                                                    </Grid>
                                                                    <Grid item xs={2} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 'bold', margin: '0' }}>{healthData.psycho_info[0].aggresive === 2 ? 'Yes' : 'No'}</p>
                                                                    </Grid>

                                                                    <Grid item xs={10} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 400, margin: '0' }}>Urine Tool :</p>
                                                                    </Grid>
                                                                    <Grid item xs={2} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 'bold', margin: '0' }}>{healthData.psycho_info[0].urine_stool === 2 ? 'Yes' : 'No'}</p>
                                                                    </Grid>
                                                                </Grid>
                                                            </>
                                                        )}
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* /// Vision  */}
                            <Grid item xs={6}>
                                <Card style={{ backgroundColor: '#F4F5FA', boxShadow: 'none', borderRadius: '25px', height: '100%' }}>
                                    <CardContent>
                                        <Grid container spacing={2}>
                                            <Grid item md={7}>
                                                <Grid container style={{ gap: 0 }}>
                                                    <Grid item xs={12}>
                                                        {healthData.vision_info && healthData.vision_info.length > 0 && (
                                                            <>
                                                                <h6 style={{ marginBottom: '25px', fontWeight: 'normal', color: '#313774', textDecoration: 'underline' }}>VISION INFORMATION</h6>
                                                                <Grid container spacing={2}>
                                                                    <Grid item xs={9} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 400, margin: '0' }}>Eye  :</p>
                                                                    </Grid>
                                                                    <Grid item xs={3} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 'bold', margin: '0' }}>{healthData.vision_info[0].eye === '1' ? 'Good' : 'Poor'}</p>
                                                                    </Grid>

                                                                    <Grid item xs={9} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 400, margin: '0' }}>Vision with Glasses :</p>
                                                                    </Grid>
                                                                    <Grid item xs={3} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 'bold', margin: '0' }}>{healthData.vision_info[0].vision_with_glasses === '2' ? 'Good' : 'Poor'}</p>
                                                                    </Grid>

                                                                    <Grid item xs={9} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 400, margin: '0' }}>Vision without glasses :</p>
                                                                    </Grid>
                                                                    <Grid item xs={3} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 'bold', margin: '0' }}>{healthData.vision_info[0].vision_without_glasses === '1' ? 'Good' : 'Poor'}</p>
                                                                    </Grid>

                                                                    <Grid item xs={9} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 400, margin: '0' }}>Refractive Error :</p>
                                                                    </Grid>
                                                                    <Grid item xs={3} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 'bold', margin: '0' }}>{healthData.vision_info[0].refractive_error === '1' ? 'Yes' : 'No'}</p>
                                                                    </Grid>

                                                                    <Grid item xs={9} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 400, margin: '0' }}>Visual Perimetry :</p>
                                                                    </Grid>
                                                                    <Grid item xs={3} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 'bold', margin: '0' }}>{healthData.vision_info[0].visual_perimetry || '-'}</p>
                                                                    </Grid>
                                                                </Grid>
                                                            </>
                                                        )}
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* /// Dental  */}
                            <Grid item xs={6}>
                                <Card style={{ backgroundColor: '#F4F5FA', boxShadow: 'none', borderRadius: '25px', height: '100%' }}>
                                    <CardContent>
                                        <Grid container spacing={2}>
                                            <Grid item md={7}>
                                                <Grid container style={{ gap: 0 }}>
                                                    <Grid item xs={12}>
                                                        {healthData.dental_info && healthData.dental_info.length > 0 && (
                                                            <>
                                                                <h6 style={{ marginBottom: '25px', fontWeight: 'normal', color: '#313774', textDecoration: 'underline' }}>DENTAL INFORMATION</h6>
                                                                <Grid container spacing={2}>
                                                                    <Grid item xs={9} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 400, margin: '0' }}>Oral Hygiene :</p>
                                                                    </Grid>
                                                                    <Grid item xs={3} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 'bold', margin: '0' }}>{healthData.dental_info[0].oral_hygiene === '1' ? 'Good' : 'Poor'}</p>
                                                                    </Grid>

                                                                    <Grid item xs={9} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 400, margin: '0' }}>Gum Condition :</p>
                                                                    </Grid>
                                                                    <Grid item xs={3} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 'bold', margin: '0' }}>{healthData.dental_info[0].gum_condition === '1' ? 'Good' : 'Poor'}</p>
                                                                    </Grid>

                                                                    <Grid item xs={9} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 400, margin: '0' }}>Oral Ulcer :</p>
                                                                    </Grid>
                                                                    <Grid item xs={3} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 'bold', margin: '0' }}>{healthData.dental_info[0].oral_ulcers === '2' ? 'Yes' : 'No'}</p>
                                                                    </Grid>

                                                                    <Grid item xs={9} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 400, margin: '0' }}>Gum Bleeding :</p>
                                                                    </Grid>
                                                                    <Grid item xs={3} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 'bold', margin: '0' }}>{healthData.dental_info[0].gum_bleeding === '2' ? 'Yes' : 'No'}</p>
                                                                    </Grid>

                                                                    <Grid item xs={9} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 400, margin: '0' }}>Teeth Discoloration :</p>
                                                                    </Grid>
                                                                    <Grid item xs={3} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 'bold', margin: '0' }}>{healthData.dental_info[0].discoloration_of_teeth === 2 ? 'Yes' : 'No'}</p>
                                                                    </Grid>

                                                                    <Grid item xs={9} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 400, margin: '0' }}>Food Impaction :</p>
                                                                    </Grid>
                                                                    <Grid item xs={3} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 'bold', margin: '0' }}>{healthData.dental_info[0].food_impaction === 2 ? 'Yes' : 'No'}</p>
                                                                    </Grid>

                                                                    <Grid item xs={9} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 400, margin: '0' }}>Carious Teeth :</p>
                                                                    </Grid>
                                                                    <Grid item xs={3} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 'bold', margin: '0' }}>{healthData.dental_info[0].carious_teeth === 2 ? 'Yes' : 'No'}</p>
                                                                    </Grid>

                                                                    <Grid item xs={9} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 400, margin: '0' }}>Extraction Done :</p>
                                                                    </Grid>
                                                                    <Grid item xs={3} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 'bold', margin: '0' }}>{healthData.dental_info[0].extraction_done === 2 ? 'Yes' : 'No'}</p>
                                                                    </Grid>

                                                                    <Grid item xs={9} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 400, margin: '0' }}>Tooth Brushing :</p>
                                                                    </Grid>
                                                                    <Grid item xs={3} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 'bold', margin: '0' }}>{healthData.dental_info[0].tooth_brushing_frequency || '-'}</p>
                                                                    </Grid>

                                                                    <Grid item xs={9} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 400, margin: '0' }}>Treatment Given: :</p>
                                                                    </Grid>
                                                                    <Grid item xs={3} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 'bold', margin: '0' }}>{healthData.dental_info[0].treatment_given || '-'}</p>
                                                                    </Grid>
                                                                </Grid>
                                                            </>
                                                        )}
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* /// Immu  */}
                            <Grid item xs={6}>
                                <Card style={{ backgroundColor: '#F4F5FA', boxShadow: 'none', borderRadius: '25px', height: '100%' }}>
                                    <CardContent>
                                        <Grid container spacing={2}>
                                            <Grid item md={7}>
                                                <Grid container style={{ gap: 0 }}>
                                                    <Grid item xs={12}>
                                                        {healthData.immunization_info && healthData.immunization_info.length > 0 && (
                                                            <>
                                                                <h6 style={{ marginBottom: '25px', fontWeight: 'normal', color: '#313774', textDecoration: 'underline' }}>IMMUNISATION</h6>
                                                                <Grid container spacing={2}>
                                                                    <Grid item xs={9} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 400, margin: '0' }}>Oral Ulcer :</p>
                                                                    </Grid>
                                                                    <Grid item xs={3} style={{ fontWeight: 100, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                                        <p style={{ fontWeight: 'bold', margin: '0' }}>{healthData.immunization_info[0].oral_ulcers === '2' ? 'Yes' : 'No'}</p>
                                                                    </Grid>
                                                                </Grid>
                                                            </>
                                                        )}
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>

                        <Button onClick={handleCloseModal}>Close</Button>
                        <Button onClick={handleDownloadPDF}>Download PDF</Button>
                    </CardContent>
                </Card>
            </Modal>
        </div>
    );
};

export default Healthcarddownload;
