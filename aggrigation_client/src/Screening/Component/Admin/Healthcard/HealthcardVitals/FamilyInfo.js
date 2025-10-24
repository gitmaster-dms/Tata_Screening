import React from 'react';
import './BasicScreenVital.css';

const FamilyInfo = ({ family }) => {

    console.log('family of family Info.......', family);
    const fathername = family[0]?.father_name || '-';
    const mothername = family[0]?.mother_name || '-';
    const emerContact = family[0]?.emergency_contact || '-';
    const rltnshipwithemployee = family[0]?.relationship_with_employee || '-';

    return (
        <div>
            <h6 className="basichealthcarddddd">Citizen Information</h6>
            <div className="elementbasicscreengrowthhhh"></div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', marginLeft: '1em', marginTop: '1em' }}>
                <h6 style={{ marginRight: '10px', fontFamily: 'Roboto' }}>Father Name:</h6>
                <h6 style={{ marginLeft: '10px', flex: 1, fontFamily: 'Roboto' }}>{fathername}</h6>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', marginLeft: '1em', marginTop: '1em' }}>
                <h6 style={{ marginRight: '10px', fontFamily: 'Roboto' }}>Mother Name::</h6>
                <h6 style={{ marginLeft: '10px', flex: 1, fontFamily: 'Roboto' }}>{mothername}</h6>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', marginLeft: '1em', marginTop: '1em' }}>
                <h6 style={{ marginRight: '10px', fontFamily: 'Roboto' }}>Emergency Details:</h6>
                <h6 style={{ marginLeft: '10px', flex: 1, fontFamily: 'Roboto' }}>{emerContact}</h6>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', marginLeft: '1em', marginTop: '1em' }}>
                <h6 style={{ marginRight: '10px', fontFamily: 'Roboto' }}>Relationship With Employee:</h6>
                <h6 style={{ marginLeft: '10px', flex: 1, fontFamily: 'Roboto' }}>{rltnshipwithemployee}</h6>
            </div>
        </div>
    );
}

export default FamilyInfo;
