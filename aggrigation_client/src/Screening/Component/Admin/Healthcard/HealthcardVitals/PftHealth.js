import React from 'react';
import './BasicScreenVital.css';

const PftHealth = ({ pft }) => {

    console.log('pft of pft Info.......', pft);

    // Extract medical history from the first item in the array
    const pftdetails = pft[0]?.pft_reading || [];
    const pftRemark = pft[0]?.observations || [];

    return (
        <div>
            <h6 className="basichealthcarddddd">Pulmonary Function Tests</h6>
            <div className="elementbasicscreengrowthhhh"></div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', marginLeft: '1em', marginTop: '1em' }}>
                <h6 style={{ marginRight: '10px', fontFamily: 'Roboto' }}>Reading:</h6>
                <h6 style={{ marginLeft: '10px', flex: 1, fontFamily: 'Roboto' }}>{pftdetails}</h6>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', marginLeft: '1em', marginTop: '1em' }}>
                <h6 style={{ marginRight: '10px', fontFamily: 'Roboto' }}>Remark:</h6>
                <h6 style={{ marginLeft: '10px', flex: 1, fontFamily: 'Roboto' }}>{pftRemark}</h6>
            </div>
        </div>
    );
}

export default PftHealth;
