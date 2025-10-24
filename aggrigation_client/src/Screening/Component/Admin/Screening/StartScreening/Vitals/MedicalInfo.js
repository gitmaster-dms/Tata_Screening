import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MedicalInfo = ({ citizensPkId, pkid, fetchVital, selectedName, onAcceptClick }) => {

    //_________________________________START
    console.log(selectedName, 'Present name');
    console.log(fetchVital, 'Overall GET API');
    const [nextName, setNextName] = useState('');

    useEffect(() => {
        if (fetchVital && selectedName) {
            const currentIndex = fetchVital.findIndex(item => item.screening_list === selectedName);

            console.log('Current Indexxxx:', currentIndex);

            if (currentIndex !== -1 && currentIndex < fetchVital.length - 1) {
                const nextItem = fetchVital[currentIndex + 1];
                const nextName = nextItem.screening_list;
                setNextName(nextName);
                console.log('Next Name Setttt:', nextName);
            } else {
                setNextName('');
                console.log('No next item or selectedName not found');
            }
        }
    }, [selectedName, fetchVital]);
    //_________________________________END

    const userID = localStorage.getItem('userID');
    const accessToken = localStorage.getItem('token');
    console.log(userID);

    const Port = process.env.REACT_APP_API_KEY;

    const [medInfoChechBox, setMedInfoChechBox] = useState([]);
    const [medPastInfoChechBox, setMedPastInfoChechBox] = useState([]);

    const [formData, setFormData] = useState({
        checkboxes: [],
        selectedNames: [],
        citizen_pk_id: citizensPkId,
    });

    const [formPastData, setFormPastData] = useState({
        checkbox: [],
        selectedMedPastName: [],
    });

    console.log("checked formData....", formData.selectedNames);
    console.log("checked formMedPastData....", formPastData.selectedMedPastName);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${Port}/Screening/citizen_medical_history/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    throw new Error(`Failed to fetch data. Status: ${response.status}`);
                }
                const medDataFromApi = await response.json();
                setMedInfoChechBox(medDataFromApi);
                console.log('Medical Data Idddddd:', medDataFromApi);
            } catch (error) {
                console.error('Error fetching Medical data', error);
            }
        };
        fetchData();
    }, []);

    const handleCheckboxChange = (index) => {
        const updatedCheckboxes = [...formData.checkboxes];
        updatedCheckboxes[index] = !updatedCheckboxes[index];

        const selectedNames = medInfoChechBox
            .filter((item, i) => updatedCheckboxes[i])
            .map((item) => item.medical_history);

        setFormData({
            ...formData,
            checkboxes: updatedCheckboxes,
            selectedNames: selectedNames,
        });
    };

    // Medical Past Info
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${Port}/Screening/citizen_past_operative_history/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    throw new Error(`Failed to fetch data. Status: ${response.status}`);
                }
                const medDataFromApi = await response.json();
                setMedPastInfoChechBox(medDataFromApi);
                console.log('Medical Past Info:', medDataFromApi);
            } catch (error) {
                console.error('Error fetching Medical Past Info', error);
            }
        };
        fetchData();
    }, []);

    const handleCheckboxMedPastChange = (index) => {
        const updatedCheckbox = [...formPastData.checkbox];
        updatedCheckbox[index] = !updatedCheckbox[index];

        const selectedMedPastName = medPastInfoChechBox
            .filter((item, i) => updatedCheckbox[i])
            .map((item) => item.past_operative_history);

        setFormPastData({
            ...formPastData,
            checkbox: updatedCheckbox,
            selectedMedPastName: selectedMedPastName,
        });
    };

    useEffect(() => {
        const fetchDataById = async (pkid) => {
            console.error('Citizens Pk Id...', pkid);
            try {
                const response = await fetch(`${Port}/Screening/medical_history_get/${pkid}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    console.error('hiii data array.');
                    if (Array.isArray(data) && data.length > 0) {
                        const screeningInfo = data[0];
                        const medDefectsData = screeningInfo.medical_history || [];
                        const pastOperativeData = screeningInfo.past_operative_history || [];

                        // Set checkboxes for medical history
                        const initialCheckboxes = medInfoChechBox.map(item =>
                            medDefectsData.includes(item.medical_history)
                        );
                        setFormData((prevState) => ({
                            ...prevState,
                            checkboxes: initialCheckboxes,
                            selectedNames: medDefectsData,
                        }));

                        // Set checkboxes for past operative history
                        const initialPastCheckboxes = medPastInfoChechBox.map(item =>
                            pastOperativeData.includes(item.past_operative_history)
                        );
                        setFormPastData((prevState) => ({
                            ...prevState,
                            checkbox: initialPastCheckboxes,
                            selectedMedPastName: pastOperativeData,
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
    }, [pkid, medInfoChechBox, medPastInfoChechBox]);

    // useEffect(() => {
    //     const fetchDataById = async (pkid) => {
    //         console.error('Citizens Pk Id...', pkid);
    //         try {
    //             const response = await fetch(`${Port}/Screening/medical_history_get/${pkid}`, {
    //                 method: 'GET',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                     'Authorization': `Bearer ${accessToken}`,
    //                 },
    //             });

    //             if (response.ok) {
    //                 const data = await response.json();
    //                 console.error('hiii data array.');
    //                 if (Array.isArray(data) && data.length > 0) {
    //                     const screeningInfo = data[0];
    //                     const medDefectsData = screeningInfo.medical_history || [];

    //                     const initialCheckboxes = medInfoChechBox.map(item =>
    //                         medDefectsData.includes(item.medical_history)
    //                     );

    //                     setFormData((prevState) => ({
    //                         ...prevState,
    //                         checkboxes: initialCheckboxes,
    //                         selectedNames: medDefectsData,
    //                     }));
    //                 } else {
    //                     console.error('Empty or invalid data array.');
    //                 }
    //             } else {
    //                 console.error('Server Error:', response.status, response.statusText);
    //             }
    //         } catch (error) {
    //             console.error('Error fetching data:', error.message);
    //         }
    //     };

    //     fetchDataById(pkid);
    // }, [pkid, medInfoChechBox]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const postData = {
            citizen_pk_id: citizensPkId,
            form_submit: true,
            added_by: userID,
            modify_by: userID,
            medical_history: formData.selectedNames,
            past_operative_history: formPastData.selectedMedPastName
        };
        console.log('Form Submitted Successfully', postData);
        try {
            const response = await axios.post(`${Port}/Screening/medical_history/${pkid}`,
                postData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (window.confirm('Submit Medical Form') && response.status === 200) {
                const responseData = response.data;
                console.log('Form Submitted Successfully');
                // onMoveToInvestigation('investigation');
                onAcceptClick(nextName);
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
            <div>
                <div className="row backdesign">
                    <div className="col-md-12">
                        <div className="card bmicard">
                            <div className="row">
                                <div className="col-md-4">
                                    <h6 className='mt-1 familyTital'>MEDICAL INFORMATION</h6>
                                </div>
                                <div className="col-md-5 ml-auto">
                                    <div class="progress-barbmi"></div>
                                </div>
                            </div>
                        </div>

                        <div className="card grothcardmonitor">
                            <div className="row">
                                <div className="col-md-12">
                                    <h6 className="BMITitle">MEDICAL INFORMATION</h6>
                                    {/* <div className="childdetailelement"></div> */}
                                </div>
                            </div>

                            <div>
                                <div className="elementvital"></div>
                                <form
                                    onSubmit={handleSubmit}
                                >
                                    <div className="row ml-1 headeskinvital">
                                        {medInfoChechBox.map((item, index) => (
                                            <div key={index} className="col-md-4">
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        checked={formData.checkboxes[index]}
                                                        onChange={() => handleCheckboxChange(index)}
                                                    />
                                                    <label className="form-check-label">
                                                        {item.medical_history}
                                                    </label>
                                                </div>
                                            </div>
                                        ))}
                                    </div>


                                    <div className="row">
                                        <div className="col-md-12">
                                            <h6 className="BMITitle">MEDICAL PAST INFORMATION</h6>
                                            <div className="childdetailelement"></div>
                                        </div>
                                    </div>
                                    <div className="row ml-1 headeskinvital">
                                        {medPastInfoChechBox.map((item, index) => (
                                            <div key={index} className="col-md-4">
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        checked={formPastData.checkbox[index]}
                                                        onChange={() => handleCheckboxMedPastChange(index)}
                                                    />
                                                    <label className="form-check-label">
                                                        {item.past_operative_history}
                                                    </label>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div>
                                        <button type="submit" className="btn btn-sm generalexambutton mb-4">Submit</button>
                                    </div>
                                </form>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default MedicalInfo
