import React from 'react';
import './BasicScreenVital.css';

const BasicScreenVital = ({ basicScreenData }) => {
    console.log('basicScreenData:', basicScreenData);

    // Check if basicScreenData is an array and not empty
    const hasValidData = Array.isArray(basicScreenData) && basicScreenData.length > 0;
    console.log('hasValidData:', hasValidData);

    // Determine if the birth defect is "NAD" or null, implying 'good'
    const isGood = hasValidData && (basicScreenData[0] === 'NAD' || basicScreenData[0] === null);
    console.log('isGood:', isGood);

    return (
        <div>
            <h6 className="basic">Basic Screening</h6>
            <div className="row">
                <div className="col-md-6">
                    <h6 className="basicccc">Birth Defect:</h6>
                </div>
                <div className="col-md-5 mt-2">
                    {hasValidData ? (
                        isGood ? (
                            <>
                                <p>Yes</p>
                                {console.log('Displayed Message:', 'Yes')}
                            </>
                        ) : (
                            <>
                                <p>No</p>
                                {console.log('Displayed Message:', 'No')}
                            </>
                        )
                    ) : (
                        console.log('No valid data, no message displayed')
                    )}
                </div>
            </div>
        </div>
    );
}

export default BasicScreenVital;
