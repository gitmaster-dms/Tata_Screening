import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Diagnosis = ({ pkid, Diagnosis, onAcceptClick, citizensPkId, onMoveToImmunisation, selectedTab, subVitalList }) => {

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

    const [diagnosis, setDiagnosis] = useState([])
    const Port = process.env.REACT_APP_API_KEY;
    // console.log('Diagnosis :', basicScreeningPkId);
    const basicScreeningPkId = localStorage.getItem('basicScreeningId');
    console.log('Retrieved Basic Id from Local Storage:', basicScreeningPkId);
    const accessToken = localStorage.getItem('token');

    const userID = localStorage.getItem('userID');
    console.log(userID);

    useEffect(() => {
        const fetchdiagnosisData = async () => {
            try {
                const response = await axios.get(`${Port}/Screening/diagnosis/`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });
                setDiagnosis(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchdiagnosisData();
    }, []);

    const [formData, setFormData] = useState({
        checkboxes: new Array(diagnosis.length).fill(0),
        selectedNames: [],
        citizen_pk_id: citizensPkId,
        modify_by: userID
    });

    const handleCheckboxChange = (index) => {
        const updatedCheckboxes = [...formData.checkboxes];
        updatedCheckboxes[index] = !updatedCheckboxes[index];

        const selectedNames = diagnosis
            .filter((item, i) => updatedCheckboxes[i])
            .map((item) => item.diagnosis);

        setFormData({
            ...formData,
            checkboxes: updatedCheckboxes,
            selectedNames: selectedNames, // Add this line to store selected names in formData
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
                    console.log(data);

                    if (Array.isArray(data) && data.length > 0) {
                        const screeningInfo = data[0];
                        const diagnoSis = screeningInfo.diagnosis || [];

                        const initialCheckboxes = diagnosis.map(item =>
                            diagnoSis.includes(item.diagnosis)
                        );

                        setFormData((prevState) => ({
                            ...prevState,
                            checkboxes: initialCheckboxes,
                            selectedNames: diagnoSis,
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
    }, [pkid, diagnosis]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const postData = {
            diagnosis: formData.selectedNames,
        };

        try {
            const accessToken = localStorage.getItem('token');

            const response = await axios.put(
                `${Port}/Screening/diagnosis/${basicScreeningPkId}/`,
                postData,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (window.confirm('Submit Diagnosis Form') && response.status === 200) {
                console.log('Submission successful!');
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
            <h5 className="vitaltitlebasicscreen">Diagnosis</h5>
            <div className="elementvital"></div>
            <form onSubmit={handleSubmit}>
                <div className="row ml-1">
                    {/* {
                    diagnosis.map((item) => (
                        <div key={item.id} className="col-md-4">
                            <div className="form-check">
                                <input className="form-check-input mt-2" type="checkbox" value={item.value} id={`flexCheck-${item.diagnosis_id}`} />
                                <label className="form-check-label basicscreeenlabel" htmlFor={`flexCheck-${item.diagnosis_id}`}>
                                    {item.diagnosis}
                                </label>
                            </div>
                        </div>
                    ))
                } */}

                    {diagnosis.map((item, index) => (
                        <div key={item.id} className="col-md-4">
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={formData.checkboxes[index]}
                                    onChange={() => handleCheckboxChange(index)}
                                />
                                <label className="form-check-label basicscreeenlabel" htmlFor={`flexCheck-${item.diagnosis_id}`}>
                                    {item.diagnosis}
                                </label>
                            </div>
                        </div>
                    ))}
                </div>

                <div>
                    <button type="submit" className="btn btn-sm generalexambutton" >Submit</button>
                </div>
            </form>
        </div>
    )
}

export default Diagnosis
