import React, { useState, useEffect } from 'react'
import axios from 'axios'

const BadHabits = ({ pkid, onAcceptClick, citizensPkId, fetchVital, nextbasicVital, selectedTab, subVitalList }) => {

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

    const [checkBox, setCheckBox] = useState([])
    const Port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');
    console.log(accessToken);
    const userID = localStorage.getItem('userID');
    console.log(userID);
    const childGender = localStorage.getItem('childGender');

    const basicScreeningPkId = localStorage.getItem('basicScreeningId');
    console.log('Retrieved Basic Id from Local Storage:', basicScreeningPkId);

    useEffect(() => {
        const fetchcheckData = async () => {
            try {
                const response = await axios.get(`${Port}/Screening/bad_habbits/`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });
                setCheckBox(response.data); // <-- Set checkBox to response.data, assuming the array is directly within the response
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchcheckData();
    }, []);

    const [formData, setFormData] = useState({
        checkboxes: new Array(checkBox.length).fill(0),
        selectedNames: [],
        citizen_pk_id: citizensPkId,
        modify_by: userID
    });

    const handleCheckboxChange = (index) => {
        const updatedCheckboxes = [...formData.checkboxes];
        updatedCheckboxes[index] = !updatedCheckboxes[index];

        const selectedNames = checkBox
            .filter((item, i) => updatedCheckboxes[i])
            .map((item) => item.bad_habbits);

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

                    if (Array.isArray(data) && data.length > 0) {
                        const screeningInfo = data[0];
                        const checkBoxIfNormal = screeningInfo.check_box_if_normal || [];

                        // Create an array of boolean values to represent checkbox states
                        const initialCheckboxes = checkBox.map(item =>
                            checkBoxIfNormal.some(checkBoxItem => checkBoxItem.bad_habbits === item.bad_habbits)
                        );

                        setFormData((prevState) => ({
                            ...prevState,
                            checkboxes: initialCheckboxes,
                            selectedNames: checkBoxIfNormal.map(item => item.bad_habbits),
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
    }, [pkid, checkBox]);


    const handleSubmit = async (e) => {
        e.preventDefault();

        // Map strings to objects with the same structure as bad_habbits
        const normalizedCheckboxes = formData.selectedNames.map(name => ({ bad_habbits: name }));

        const postData = {
            check_box_if_normal: normalizedCheckboxes,
            basic_screening_pk_id: basicScreeningPkId,
            modify_by: userID
        };

        console.log(postData, "postData");
        try {
            const response = await axios.put(
                `${Port}/Screening/checkboxifnormal/${basicScreeningPkId}/`,
                postData,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            if (window.confirm('Submit CheckBox Form') && response.status === 200) {
                const responseData = response.data;
                const basicScreeningPkId = responseData.basic_screening_pk_id;
                console.log('CheckBox Form Submitted Successfully');

                if (childGender === 2) {
                    onAcceptClick(nextName, basicScreeningPkId);
                }
                else {
                    onAcceptClick(nextName);
                }
            } else if (response.status === 400) {
                console.error('Bad Request: 400');
            } else {
                console.error('Unhandled Status Code:', response.status);
            }
        } catch (error) {
            console.error('Error posting data:', error);
        }
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     const postData = {
    //         bad_habbits: formData.selectedNames,
    //     };
    //     console.log(postData, "postData");
    //     try {
    //         const response = await axios.put(
    //             `${Port}/Screening/checkboxifnormal/${basicScreeningPkId}/`,
    //             postData,
    //             {
    //                 headers: {
    //                     Authorization: `Bearer ${accessToken}`,
    //                     'Content-Type': 'application/json',
    //                 },
    //             }
    //         );
    //         if (window.confirm('Submit CheckBox Form') && response.status === 200) {
    //             const responseData = response.data;
    //             const basicScreeningPkId = responseData.basic_screening_pk_id;
    //             console.log('CheckBox Form Submitted Successfully');

    //         } else if (response.status === 400) {
    //             console.error('Bad Request:');
    //         } else {
    //             console.error('Unhandled Status Code:', response.status);
    //         }
    //     } catch (error) {
    //         console.error('Error posting data:', error);
    //     }
    // };

    return (
        <div>
            <h5 className="vitaltitlebasicscreen">Bad Habits</h5>
            <div className="elementvital"></div>

            <form onSubmit={handleSubmit}>
                <div className="row ml-1">
                    {/* {checkBox.map((item) => (
                        <div key={item.id} className="col-md-4">
                            <div className="form-check">
                                <input className="form-check-input mt-2" type="checkbox" value={item.value} id={`flexCheck-${item.bad_habbits_id}`} />
                                <label className="form-check-label basicscreeenlabel" htmlFor={`flexCheck-${item.bad_habbits_id}`}>
                                    {item.bad_habbits}
                                </label>
                            </div>
                        </div>
                    ))} */}


                    {checkBox.map((item, index) => (
                        <div key={item.bad_habbits_pk_id} className="col-md-4"> {/* Ensure item.bad_habbits_pk_id is unique */}
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={formData.checkboxes[index]}
                                    onChange={() => handleCheckboxChange(index)}
                                />
                                <label className="form-check-label basicscreeenlabel" htmlFor={`flexCheck-${item.bad_habbits_pk_id}`}>
                                    {item.bad_habbits}
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

export default BadHabits
