import React from 'react';
import './BasicScreenVital.css';
import psycho from '../../../../Images/image-removebg-preview (46) 1.png';

const PsychologicalHealth = ({ psychoData }) => {
    console.log(psychoData);

    return (
        <div>
            <h6 className="basicpsychohealthvital">Psychological</h6>
            <div className="elementbasicscreenpsychohealth"></div>
            <div className="row">
                <div className="col-md-4">
                    <img src={psycho} className='psycholabel' />
                </div>
                <div className="col-md-5">
                    {Array.isArray(psychoData) && psychoData.length > 0 ? (
                        <div>
                            <h6 className="conditionpsycho1">PsychoLogial Condition</h6>
                            {psychoData.map((condition, index) => (
                                <h5 className="conditionpsycho" key={index}>{condition}</h5>
                            ))}
                        </div>
                    ) : (
                        <p>No data found</p>
                    )}
                </div>

            </div>
        </div>
    );
};

export default PsychologicalHealth;
