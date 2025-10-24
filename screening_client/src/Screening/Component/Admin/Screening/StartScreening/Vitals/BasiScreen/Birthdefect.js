import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Birthdefect = ({ pkid, onAcceptClick, citizensPkId, selectedTab, subVitalList }) => {

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
    const accessToken = localStorage.getItem('token');
    const userID = localStorage.getItem('userID');
    console.log(userID);

    const basicScreeningPkId = localStorage.getItem('basicScreeningId');

    const [auditoryChechBox, setAuditoryChechBox] = useState([]);
    const [formData, setFormData] = useState({
        checkboxes: [],
        selectedNames: [],
        citizen_pk_id: citizensPkId,
        modify_by: userID
    });

    useEffect(() => {
        const fetchDataById = async (pkid) => {
            try {
                const response = await fetch(`${Port}/Screening/citizen_basic_screening_info_get/${pkid}/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`, // Include the authorization header
                    },
                });

                if (response.ok) {
                    const data = await response.json();

                    if (Array.isArray(data) && data.length > 0) {
                        const screeningInfo = data[0];
                        const birthDefectsData = screeningInfo.birth_defects || [];

                        const initialCheckboxes = auditoryChechBox.map(item =>
                            birthDefectsData.includes(item.birth_defects)
                        );

                        setFormData((prevState) => ({
                            ...prevState,
                            checkboxes: initialCheckboxes,
                            selectedNames: birthDefectsData,
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
    }, [pkid, auditoryChechBox]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${Port}/Screening/birth_defect/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`, // Include the authorization header
                    },
                });
                setAuditoryChechBox(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleCheckboxChange = (index) => {
        const updatedCheckboxes = [...formData.checkboxes];
        updatedCheckboxes[index] = !updatedCheckboxes[index];

        const selectedNames = auditoryChechBox
            .filter((item, i) => updatedCheckboxes[i])
            .map((item) => item.birth_defects);

        setFormData({
            ...formData,
            checkboxes: updatedCheckboxes,
            selectedNames: selectedNames,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const postData = {
            birth_defects: formData.selectedNames,
        };

        try {
            const response = await axios.put(`${Port}/Screening/birth_defect/${basicScreeningPkId}/`, postData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (window.confirm('Submit Birth Defect Form') && response.status === 200) {
                const responseData = response.data;
                const basic_screening_pk_id = responseData.basic_screening_pk_id;
                console.log('Form Submitted Successfully');
                console.log('Childhood disease:', basic_screening_pk_id);
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
            <h5 className="vitaltitlebasicscreen">Birth Defects</h5>
            <div className="elementvital"></div>
            <form onSubmit={handleSubmit}>
                <div className="row ml-1 headeskinvital">
                    {auditoryChechBox.map((item, index) => (
                        <div key={index} className="col-md-4">
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={formData.checkboxes[index]}
                                    onChange={() => handleCheckboxChange(index)}
                                />
                                <label className="form-check-label">
                                    {item.birth_defects}
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
    );
}

export default Birthdefect;
