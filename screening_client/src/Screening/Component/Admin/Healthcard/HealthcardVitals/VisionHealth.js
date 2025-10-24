import React from 'react';
import './BasicScreenVital.css';
import psycho from '../../../../Images/image-removebg-preview (46) 1.png';
import { Grid, Card, CardContent, Typography } from '@mui/material';

const PsychologicalHealth = ({ visionData, vision }) => {
    console.log(visionData);
    console.log('vvvvvvvvvvvvvvvvvvvvvvvv', visionData);

    //// access the source from local storage
    const SourceUrlId = localStorage.getItem('loginSource');

    //// access the source name from local storage
    const SourceNameUrlId = localStorage.getItem('SourceNameFetched');
    //_______________Near Without
    const rightNearwithout = vision[0]?.re_near_without_glasses || [];
    const leftNearWithout = vision[0]?.le_near_without_glasses || [];

    //______________Far Without
    const rightFarWithout = vision[0]?.re_far_without_glasses || [];
    const leftFarWithouyt = vision[0]?.le_far_without_glasses || [];

    //_______________Near With
    const rightNearwith = vision[0]?.re_near_with_glasses || [];
    const leftNearWith = vision[0]?.le_near_with_glasses || [];

    //______________Far With
    const rightFarWith = vision[0]?.re_far_with_glasses || [];
    const leftFarWith = vision[0]?.le_far_with_glasses || [];


    return (
        <div>
            <h6 className="basicpsychohealthvital">Vision</h6>
            <div className="elementbasicscreenpsychohealth"></div>
            <div className="row">
                <div className="col-md-4">
                    {/* <img src={psycho} className='psycholabel' alt="Vision" /> */}
                </div>

                <div className="col-md-5">
                    {Array.isArray(visionData) ? (
                        <div>
                            {/* <h6 className="conditionpsycho1">Vision Condition</h6> */}
                            <div className="row">
                                {/* /////////////////// with glasses */}
                                <div className="col-md-8">
                                    <h6 className="conditionpsycho2">
                                        Vision With Glasses:
                                    </h6>
                                </div>
                                <div className="col-md-4">
                                    <h5 className="conditionpsycho3">
                                        {visionData[0]?.vision_with_glasses === '2' ? 'Good' : (visionData[0]?.vision_with_glasses === '1' ? 'Poor' : 'NA')}
                                    </h5>
                                </div>

                                {/* ////////// without glasses */}
                                <div className="col-md-8">
                                    <h6 className="conditionpsycho2">
                                        Vision Without Glasses:
                                    </h6>
                                </div>
                                <div className="col-md-4">
                                    <h5 className="conditionpsycho3">
                                        {visionData[0]?.vision_without_glasses === '1' ? 'Good' : (visionData[0]?.vision_without_glasses === '2' ? 'Poor' : 'NA')}
                                    </h5>
                                </div>

                                {/* ////////// color blindness */}
                                <div className="col-md-8">
                                    <h6 className="conditionpsycho2">
                                        Colour Blindness:
                                    </h6>
                                </div>
                                <div className="col-md-4">
                                    <h5 className="conditionpsycho3">
                                        {visionData[0]?.color_blindness === '1' ? 'Yes' : 'No'}
                                    </h5>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p>No vision data available</p>
                    )}
                </div>

                {/* {
                    SourceUrlId === 5 && ( */}
                <>
                    <Grid container spacing={2} style={{ marginLeft: '14.6em' }}>
                        <Grid item xs={12} md={12}>
                            <Typography variant="h6" align="left" color="black"
                                style={{
                                    fontFamily: 'Poppins',
                                    fontSize: '17px',
                                    fontWeight: 'bold',
                                    marginTop: '1em'
                                }}
                            >
                                Vision Without Glasses

                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={4}
                            style={{
                                fontFamily: 'Poppins',
                                fontSize: '17px',
                            }}
                        >
                            Near
                        </Grid>

                        <Grid item xs={12} md={4}
                            style={{
                                marginTop: '-5px'
                            }}>
                            Right:{rightNearwithout}
                        </Grid>

                        <Grid item xs={12} md={4}
                            style={{
                                marginTop: '-5px'
                            }}>
                            Left:{leftNearWithout}
                        </Grid>

                        <Grid item xs={12} md={4}
                            style={{
                                fontFamily: 'Poppins',
                                fontSize: '17px',
                            }}
                        >
                            FAR:
                        </Grid>

                        <Grid item xs={12} md={4}
                            style={{
                                marginTop: '-5px'
                            }}>
                            Right:{rightFarWithout}
                        </Grid>

                        <Grid item xs={12} md={4}
                            style={{
                                marginTop: '-5px'
                            }}>
                            Left:{leftFarWithouyt}
                        </Grid>

                        {/* WIth Glass */}
                        <Grid item xs={12} md={12}>
                            <Typography variant="h6" align="left" color="black"
                                style={{
                                    fontFamily: 'Poppins',
                                    fontSize: '17px',
                                    fontWeight: 'bold',
                                    marginTop: '1em'
                                }}
                            >
                                Vision With Glasses

                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={4}
                            style={{
                                fontFamily: 'Poppins',
                                fontSize: '17px',
                            }}
                        >
                            Near
                        </Grid>

                        <Grid item xs={12} md={4}
                            style={{
                                marginTop: '-5px'
                            }}>
                            Right:{rightNearwith}
                        </Grid>

                        <Grid item xs={12} md={4}
                            style={{
                                marginTop: '-5px'
                            }}>
                            Left:{leftNearWith}
                        </Grid>

                        <Grid item xs={12} md={4}
                            style={{
                                fontFamily: 'Poppins',
                                fontSize: '17px',
                            }}
                        >
                            FAR:
                        </Grid>

                        <Grid item xs={12} md={4}
                            style={{
                                marginTop: '-5px'
                            }}>
                            Right:{rightFarWith}
                        </Grid>

                        <Grid item xs={12} md={4}
                            style={{
                                marginTop: '-5px'
                            }}>
                            Left:{leftFarWith}
                        </Grid>
                    </Grid>
                </>
                {/* )
                } */}
            </div>
        </div>
    );
};

export default PsychologicalHealth;
