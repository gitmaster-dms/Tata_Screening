import React, { useState, useEffect } from 'react'

const Bodymass = ({ selectedSource, selctedType, selectedClassType, selectedScreenID }) => {

    const Port = process.env.REACT_APP_API_KEY;
    const [bmi, setBmi] = useState([])
    const accessToken = localStorage.getItem('token');

    //// access the source name from local storage
    const SourceNameUrlId = localStorage.getItem('SourceNameFetched');

    console.log(selectedSource, selctedType, selectedClassType);

    const fetchData = async () => {
        try {
            let url = `${Port}/Screening/Bmi_count/?`;

            if (selectedSource) {
                url += `source_id=${selectedSource}&`;
            }

            if (selctedType) {
                url += `type_id=${selctedType}&`;
            }

            if (selectedClassType) {
                url += `Class_id=${selectedClassType}&`;
            }

            if (SourceNameUrlId) {
                url += `source_name_id=${SourceNameUrlId}`;
            }

            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setBmi(data); // Update referredData state with fetched data
            } else {
                throw new Error('Failed to fetch data');
            }
        } catch (error) {
            console.error('Error Fetching Data:', error);
        }
    };

    useEffect(() => {
        if (selectedSource || selctedType || selectedClassType || selectedScreenID) {
            fetchData();
        }
    }, [selectedSource, selctedType, selectedClassType]);


    // useEffect(() => {
    //     if (selectedSource && selctedType && selectedClassType) {
    //         axios
    //             .get(`${Port}/Screening/NEW_bmi_count/?source_id=${selectedSource}&type_id=${selctedType}&class_id=${selectedClassType}&source_name_id=${SourceNameUrlId}`,
    //                 {
    //                     headers: {
    //                         Authorization: `Bearer ${accessToken}`
    //                     }
    //                 })
    //             .then((response) => {
    //                 setBmi(response.data);
    //             })
    //             .catch((error) => {
    //                 console.error('Error fetching data:', error);
    //             });
    //     } else if (selectedSource && selctedType) {
    //         axios
    //             .get(`${Port}/Screening/NEW_bmi_count/?source_id=${selectedSource}&type_id=${selctedType}&source_name_id=${SourceNameUrlId}`,
    //                 {
    //                     headers: {
    //                         Authorization: `Bearer ${accessToken}`
    //                     }
    //                 })
    //             .then((response) => {
    //                 setBmi(response.data);
    //             })
    //             .catch((error) => {
    //                 console.error('Error fetching data:', error);
    //             });
    //     }
    //     // Add additional else if conditions if needed for other combinations of filters
    // }, [selectedSource, selctedType, selectedClassType, Port]);


    return (
        <div>
            <div className="row">
                <div className="col-md-12 p-2">
                    <h6 className='bmidashtitle'>Body Mass Index(BMI)</h6>

                    <div className='row abovecountdash'>
                        <div className="countdash">
                            <span className="label-countdash">{bmi.underweight}</span>
                            <span className="label-countdash">{bmi.normal}</span>
                            <span className="label-countdash">{bmi.overweight}</span>
                            <span className="label-countdash">{bmi.obese}</span>
                        </div>
                    </div>

                    <div className="progress multi-color-progress">
                        <div className="progress-bar bg-success" style={{ width: '35%', background: 'linear-gradient(to right, orange, #00A35E)' }}>
                        </div>
                        <div className="progress-bar bg-danger" style={{ width: '45%', background: 'linear-gradient(to right, #00A35E, #FF0000)' }}>
                        </div>
                        <div className="progress-bar bg-brown" style={{ width: '20%', background: 'linear-gradient(to right, #FF0000, #FF0000)' }}>
                        </div>
                        <div className="progress-bar bg-warning" style={{ width: '10%', background: 'linear-gradient(to right, #FF0000, brown)' }}>
                        </div>
                    </div>

                    <div className='row belowheadingdash'>
                        <div className="labelsdash">
                            <span className="label-reddashboard">Underweight</span>
                            <span className="label-reddashboard">Normal</span>
                            <span className="label-reddashboard">Overweight</span>
                            <span className="label-reddashboard">Obesity</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Bodymass
