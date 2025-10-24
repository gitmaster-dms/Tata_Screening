import React from 'react'
import './BasicScreenVital.css'
import immuimage from '../../../../Images/image-removebg-preview (47) 1.png'

const ImmunisationHealth = ({ immunizationData }) => {

    console.log('immuu Data:', immunizationData);

    return (
        <div>
            <h6 className="basichealthcarddddd">Immunization</h6>
            <div className="elementbasicscreen"></div>

            <div className="row">
                <div className="col-md-4">
                    <img src={immuimage} className='immuimagsize' />
                </div>
                <div className="col-md-8">
                    {Array.isArray(immunizationData) && immunizationData.length > 0 && (
                        <div>
                            {immunizationData.map((immunization, index) => (
                                <div key={index}>
                                    <ul>
                                        {immunization.vaccines.map((vaccine, i) => (
                                            <li key={i} className="vaccine-item">
                                                <strong className="vaccine-label">Vaccine:</strong> <span className="vaccine-name">{vaccine.immunization}</span>
                                                <br />
                                                <strong className="vaccine-label">Given:</strong> <span className="vaccine-name">{vaccine.givenYesNo === '1' ? 'Yes' : 'No'}</span>
                                                <br /><hr />
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ImmunisationHealth
