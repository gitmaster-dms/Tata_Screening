import React from 'react';
import './BasicScreenVital.css';

const Medicalhistory = ({ medical }) => {
    console.log('medical of medical Info.......', medical);
    
    // Extract medical history from the first item in the array
    const medicalHistory = medical[0]?.medical_history || [];

    // Format medical history for display
    const formattedMedicalHistory = medicalHistory.length > 0
        ? medicalHistory.join(', ')
        : '-';

    return (
        <div>
            <h6 className="basichealthcarddddd">Citizen Information</h6>
            <div className="elementbasicscreengrowthhhh"></div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', marginLeft: '1em', marginTop: '1em' }}>
                <h6 style={{ marginRight: '10px', fontFamily: 'Roboto' }}>Medical History:</h6>
                <h6 style={{ marginLeft: '10px', flex: 1, fontFamily: 'Roboto' }}>{formattedMedicalHistory}</h6>
            </div>
        </div>
    );
}

export default Medicalhistory;
