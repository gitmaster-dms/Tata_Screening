import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Checkbox = ({ pkid, onAcceptClick, citizensPkId, selectedTab, subVitalList }) => {

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
    // console.log('CheckBox :', basicScreeningPkId);
    const accessToken = localStorage.getItem('token');
    const userID = localStorage.getItem('userID');
    console.log(userID);

    const basicScreeningPkId = localStorage.getItem('basicScreeningId');
    console.log('Retrieved Basic Id from Local Storage:', basicScreeningPkId);

    useEffect(() => {
        const fetchcheckData = async () => {
            try {
                const response = await axios.get(`${Port}/Screening/check_box/`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                }
                );
                setCheckBox(response.data);
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
            .map((item) => item.check_box_if_normal);

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
                        const checkBoxddd = screeningInfo.check_box_if_normal || [];

                        const initialCheckboxes = checkBox.map(item =>
                            checkBoxddd.includes(item.check_box_if_normal)
                        );

                        setFormData((prevState) => ({
                            ...prevState,
                            checkboxes: initialCheckboxes,
                            selectedNames: checkBoxddd,
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
        const postData = {
            check_box_if_normal: formData.selectedNames,
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

                console.log('Diagnosis:', basicScreeningPkId);
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

    return (
        <div>
            <h5 className="vitaltitlebasicscreen">Check Box if Normal</h5>
            <div className="elementvital"></div>

            <form onSubmit={handleSubmit}>
                <div className="row ml-1">
                    {/* {checkBox.map((item) => (
                        <div key={item.id} className="col-md-4">
                            <div className="form-check">
                                <input className="form-check-input mt-2" type="checkbox" value={item.value} id={`flexCheck-${item.check_box_if_normal_id}`} />
                                <label className="form-check-label basicscreeenlabel" htmlFor={`flexCheck-${item.check_box_if_normal_id}`}>
                                    {item.check_box_if_normal}
                                </label>
                            </div>
                        </div>
                    ))} */}


                    {checkBox.map((item, index) => (
                        <div key={item.id} className="col-md-4">
                            <div className="form-check">

                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={formData.checkboxes[index]}
                                    onChange={() => handleCheckboxChange(index)}
                                />
                                <label className="form-check-label basicscreeenlabel" htmlFor={`flexCheck-${item.check_box_if_normal_id}`}>
                                    {item.check_box_if_normal}
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

export default Checkbox
