import React from 'react';
import './BasicScreenVital.css';
import Auditory from '../../../../Images/ear (2).png';

const AuditoryHealth = ({ auditoryData, auditory }) => {

    console.log('AuditoryDataaaa', auditoryData);
    console.log('auditory........', auditory);

    //// access the source from local storage
    const SourceUrlId = localStorage.getItem('loginSource');
    console.log(SourceUrlId, 'SourceUrlIdSourceUrlIdSourceUrlId');

    //// access the source name from local storage
    const SourceNameUrlId = localStorage.getItem('SourceNameFetched');

    const leftobservation = auditory[0]?.left_ear_observations_remarks || [];
    const righearobservation = auditory[0]?.right_ear_observations_remarks || [];

    const isNADPresent = Array.isArray(auditoryData) && auditoryData.some(checkboxes => Array.isArray(checkboxes) && checkboxes.includes('NAD'));

    return (
        <div>
            <h6 className="basicpsychohealthvital">Auditory</h6>
            <div className="elementbasicscreenpsychohealth"></div>
            <div className="row">
                <div className="col-md-4">
                    <img src={Auditory} className='psycholabel' alt="Auditory Icon" />
                </div>

                <div className="col-md-5">
                    {Array.isArray(auditoryData) && auditoryData.length > 0 ? (
                        <div>
                            <h5 className="conditionpsycho">
                                Ear Condition:   {isNADPresent ? 'Good' : 'Bad'}
                            </h5>
                        </div>
                    ) : (
                        <p>No Auditory Data Found</p>
                    )}
                </div>

                <div className="col-md-12">
                    {
                        SourceUrlId === '5' &&
                        (
                            <div className="row" style={{ marginLeft: '11em', marginTop: '-3em' }}>
                                <div className="col-md-12">
                                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', marginLeft: '1em' }}>
                                        <h6 style={{ marginRight: '10px', fontFamily: 'Roboto' }}>Left Ear Observation:</h6>
                                        <h6 style={{ marginLeft: '10px', flex: 1, fontFamily: 'Roboto' }}>{leftobservation}</h6>
                                    </div>
                                </div>

                                <div className="col">
                                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', marginLeft: '1em' }}>
                                        <h6 style={{ marginRight: '10px', fontFamily: 'Roboto' }}>Right Ear Observation:</h6>
                                        <h6 style={{ marginLeft: '10px', flex: 1, fontFamily: 'Roboto' }}>{righearobservation}</h6>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
};

export default AuditoryHealth;

