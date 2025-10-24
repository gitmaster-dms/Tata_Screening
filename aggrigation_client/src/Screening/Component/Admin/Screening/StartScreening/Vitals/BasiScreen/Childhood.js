import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Childhood = ({ pkid, onAcceptClick, citizensPkId, selectedTab, subVitalList }) => {

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

    const Port = process.env.REACT_APP_API_KEY;
    // console.log('Child Hoodddddddddddd:', basicScreeningPkId);
    const userID = localStorage.getItem('userID');
    console.log(userID);
    const accessToken = localStorage.getItem('token');

    const basicScreeningPkId = localStorage.getItem('basicScreeningId');
    console.log('Retrieved Basic Id from Local Storage:', basicScreeningPkId);

    const [childhoodData, setChildhoodData] = useState([]);

    useEffect(() => {
        const fetchchildData = async () => {
            try {
                const response = await axios.get(`${Port}/Screening/childhood_disease/`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });
                setChildhoodData(response.data);
                console.log(response.data, "kkkkkkkkkkkkkk");
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchchildData();
    }, []);

    const [formData, setFormData] = useState({
        checkboxes: new Array(childhoodData.length).fill(0),
        selectedNames: [],
        citizen_pk_id: citizensPkId,
        modify_by: userID
    });

    const handleCheckboxChange = (index) => {
        const updatedCheckboxes = [...formData.checkboxes];
        updatedCheckboxes[index] = !updatedCheckboxes[index];

        const selectedNames = childhoodData
            .filter((item, i) => updatedCheckboxes[i])
            .map((item) => item.childhood_disease);

        setFormData({
            ...formData,
            checkboxes: updatedCheckboxes,
            selectedNames: selectedNames, // Add this line to store selected names in formData
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const postData = {
            childhood_disease: formData.selectedNames,
        };
        console.log(postData, "postData");
        try {
            const response = await axios.put(
                `${Port}/Screening/childhood_disease/${basicScreeningPkId}/`,
                postData,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            if (window.confirm('Submit Childhood Disease Form') && response.status === 200) {
                const responseData = response.data;
                const basicScreeningPkId = responseData.basic_screening_pk_id;
                console.log('Form Submitted Successfully');

                console.log('Deficiencies:', basicScreeningPkId);
                onAcceptClick(nextName, basicScreeningPkId);
            } else if (response.status === 400) {
                console.error('Bad Request:');
            } else {
                console.error('Unhandled Status Code:', response.status);
            }
        } catch (error) {
            console.error('Error posting data:', error);
        }
    };

    useEffect(() => {
        const fetchDataById = async (pkid) => {
            try {
                const response = await fetch(`${Port}/Screening/citizen_basic_screening_info_get/${pkid}/`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();

                    if (Array.isArray(data) && data.length > 0) {
                        const screeningInfo = data[0];
                        const childHoodDisease = screeningInfo.childhood_disease || [];

                        const initialCheckboxes = childhoodData.map(item =>
                            childHoodDisease.includes(item.childhood_disease)
                        );

                        setFormData((prevState) => ({
                            ...prevState,
                            checkboxes: initialCheckboxes,
                            selectedNames: childHoodDisease,
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
    }, [pkid, childhoodData]);

    return (
        <div>
            <h5 className="vitaltitlebasicscreen">Childhood disease</h5>
            <div className="elementvital"></div>

            <form>
                <div className="row ml-1">
                    {childhoodData.map((item, index) => (
                        <div key={item.id} className="col-md-4">
                            <div className="form-check">

                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={formData.checkboxes[index]}
                                    onChange={() => handleCheckboxChange(index)}
                                />
                                <label className="form-check-label basicscreeenlabel" htmlFor={`flexCheck-${item.childhood_disease_id}`}>
                                    {item.childhood_disease}
                                </label>
                            </div>
                        </div>
                    ))}
                </div>
                <div>
                    <button type="button" className="btn btn-sm generalexambutton" onClick={handleSubmit}>Submit</button>
                </div>
            </form>
        </div>
    )
}

export default Childhood
