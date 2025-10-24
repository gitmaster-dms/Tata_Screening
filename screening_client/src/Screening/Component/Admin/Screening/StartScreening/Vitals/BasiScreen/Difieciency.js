import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Difieciency = ({ pkid, onAcceptClick, citizensPkId, selectedTab, subVitalList }) => {

    //_________________________________START
    console.log(selectedTab, 'Present name');
    console.log(subVitalList, 'Overall GET API');
    const [nextName, setNextName] = useState('');

    useEffect(() => {
        if (subVitalList && selectedTab) {
            const currentIndex = subVitalList.findIndex(item => item.screening_list === selectedTab);

            console.log('Current Index:', currentIndex);

            if (currentIndex !== -1 && currentIndex < subVitalList.length - 1) {
                const nextItem = subVitalList[currentIndex + 1];
                const nextName = nextItem.screening_list;
                setNextName(nextName);
                console.log('Next Name Set:', nextName);
            } else {
                setNextName('');
                console.log('No next item or selectedTab not found');
            }
        }
    }, [selectedTab, subVitalList]);
    //_________________________________END

    const [deficiencies, setDeficiencies] = useState([])
    // console.log('Difieciency', basicScreeningPkId);
    const basicScreeningPkId = localStorage.getItem('basicScreeningId');
    console.log('Retrieved Basic Id from Local Storage:', basicScreeningPkId);
    const accessToken = localStorage.getItem('token');

    const userID = localStorage.getItem('userID');
    console.log(userID);

    const Port = process.env.REACT_APP_API_KEY;

    useEffect(() => {
        const fetchdeficiencyData = async () => {
            try {
                const response = await axios.get(`${Port}/Screening/deficiencies/`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });
                setDeficiencies(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchdeficiencyData();
    }, []);

    const [formData, setFormData] = useState({
        checkboxes: new Array(deficiencies.length).fill(0),
        selectedNames: [],
        citizen_pk_id: citizensPkId,
        modify_by: userID
    });

    const handleCheckboxChange = (index) => {
        const updatedCheckboxes = [...formData.checkboxes];
        updatedCheckboxes[index] = !updatedCheckboxes[index];

        const selectedNames = deficiencies
            .filter((item, i) => updatedCheckboxes[i])
            .map((item) => item.deficiencies);

        setFormData({
            ...formData,
            checkboxes: updatedCheckboxes,
            selectedNames: selectedNames, 
        });
    };

    useEffect(() => {
        const fetchDataById = async (pkid) => {
            try {
                const response = await fetch(`${Port}/Screening/citizen_basic_screening_info_get/${pkid}/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();

                    if (Array.isArray(data) && data.length > 0) {
                        const screeningInfo = data[0];
                        const difeciencyData = screeningInfo.deficiencies || [];

                        const initialCheckboxes = deficiencies.map(item =>
                            difeciencyData.includes(item.deficiencies)
                        );

                        setFormData((prevState) => ({
                            ...prevState,
                            checkboxes: initialCheckboxes,
                            selectedNames: difeciencyData,
                        }));
                    } else {
                        console.error('Empty or invalid data array.');
                    }
                } else {
                    console.error('Server Error:', response.status, response.statusText);
                }
            } catch (error) {
                console.error('Error fetching data:', error.message);
            }
        };

        fetchDataById(pkid);
    }, [pkid, deficiencies]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const postData = {
            deficiencies: formData.selectedNames,
        };

        try {
            const accessToken = localStorage.getItem('token');

            const response = await axios.put(
                `${Port}/Screening/deficiencies/${basicScreeningPkId}/`,
                postData,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (window.confirm('Submit Deficiencies Form') && response.status === 200) {
                const responseData = response.data;
                const basicScreeningPkId = responseData.basic_screening_pk_id;
                console.log('Deficiency Form Submitted Successfully');

                console.log('Skin Condition', basicScreeningPkId);
                onAcceptClick(nextName, basicScreeningPkId);
            } else if (response.status === 400) {
                console.error('Bad Request:', response.data);
            } else {
                console.error('Unhandled Status Code:', response.status);
            }
        } catch (error) {
            console.error('Error posting data:', error);
        }
    };

    return (
        <div>
            <h5 className="vitaltitlebasicscreen">Deficiencies</h5>
            <div className="elementvital"></div>

            <form onSubmit={handleSubmit}>
                <div className="row ml-1">
                    {/* {deficiencies.map((item) => (
                        <div key={item.id} className="col-md-4">
                            <div className="form-check">
                                <input className="form-check-input mt-2" type="checkbox" value={item.value} id={`flexCheck-${item.deficiencies_id}`} />
                                <label className="form-check-label basicscreeenlabel" htmlFor={`flexCheck-${item.deficiencies_id}`}>
                                    {item.deficiencies}
                                </label>
                            </div>
                        </div>
                    ))} */}

                    {deficiencies.map((item, index) => (
                        <div key={item.id} className="col-md-4">
                            <div className="form-check">

                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={formData.checkboxes[index]}
                                    onChange={() => handleCheckboxChange(index)}
                                />
                                <label className="form-check-label basicscreeenlabel" htmlFor={`flexCheck-${item.deficiencies_id}`}>
                                    {item.deficiencies}
                                </label>
                            </div>
                        </div>
                    ))}
                </div>

                <div>
                    <button type="submit" className="btn btn-sm generalexambutton">Submit</button>
                </div>
            </form>
        </div>
    )
}

export default Difieciency
