import React from 'react';
import './BasicScreenVital.css';

const CitizenInfoHealth = ({ citizenData }) => {

    console.log('citizen of Citizen Info.....................:', citizenData);
    // Assuming citizenData is an array and we need the first item
    const name = citizenData[0]?.name || '-';
    const gender = citizenData[0]?.gender || '-';
    const citizenId = citizenData[0]?.citizen_id || '-';
    const scheduleId = citizenData[0]?.schedule_id || '-';
    const adharId = citizenData[0]?.aadhar_id || '-';

    return (
        <div>
            <h6 className="basichealthcarddddd">Citizen Information</h6>
            <div className="elementbasicscreengrowthhhh"></div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', marginLeft: '1em', marginTop: '1em' }}>
                <h6 style={{ marginRight: '10px', fontFamily: 'Roboto' }}>Citizen Name:</h6>
                <h6 style={{ marginLeft: '10px', flex: 1, fontFamily: 'Roboto' }}>{name}</h6>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', marginLeft: '1em', marginTop: '1em' }}>
                <h6 style={{ marginRight: '10px', fontFamily: 'Roboto' }}>Gender:</h6>
                <h6 style={{ marginLeft: '10px', flex: 1, fontFamily: 'Roboto' }}>{gender}</h6>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', marginLeft: '1em', marginTop: '1em' }}>
                <h6 style={{ marginRight: '10px', fontFamily: 'Roboto' }}>Citizen ID:</h6>
                <h6 style={{ marginLeft: '10px', flex: 1, fontFamily: 'Roboto' }}>{citizenId}</h6>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', marginLeft: '1em', marginTop: '1em' }}>
                <h6 style={{ marginRight: '10px', fontFamily: 'Roboto' }}>Schedule ID:</h6>
                <h6 style={{ marginLeft: '10px', flex: 1, fontFamily: 'Roboto' }}>{scheduleId}</h6>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', marginLeft: '1em', marginTop: '1em' }}>
                <h6 style={{ marginRight: '10px', fontFamily: 'Roboto' }}>Aadhar ID:</h6>
                <h6 style={{ marginLeft: '10px', flex: 1, fontFamily: 'Roboto' }}>{adharId}</h6>
            </div>
        </div>
    );
}

export default CitizenInfoHealth;
