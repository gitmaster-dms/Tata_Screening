import React from 'react'
import './BasicScreenVital.css'
import dentalimage from '../../../../Images/image-removebg-preview (44) 1.png'

const DentalHealth = ({ dentalData }) => {
    return (
        <div>
            <h6 className="basicpsychohealthvital">Dental</h6>
            <div className="elementbasicscreenpsychohealth"></div>
            <div className="row">
                <div className="col-md-4">
                    <img src={dentalimage} className='dentalimages' />
                </div>
                <div className="col-md-5">
                    {Array.isArray(dentalData) && (
                        <div>
                            <h6 className="conditionpsycho1">Dental Condition</h6>
                            {dentalData.map((condition, index) => (
                                <h5 className="conditionpsycho" key={index}>{condition}</h5>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default DentalHealth
