import React, { useState, useEffect } from 'react'
import './Generalexam.css'

const Femalescreening = ({ pkid, selectedTab, subVitalList, onAcceptClick }) => {

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
    const basicScreeningPkId = localStorage.getItem('basicScreeningId');
    const accessToken = localStorage.getItem('token');

    //// access the source from local storage
    const source = localStorage.getItem('source');

    const [femaleScreeningForm, setFemaleScreeningForm] = useState({
        date_of_menarche: "", ///////////date field
        age_of_menarche: null,
        vaginal_descharge: null,
        flow: null,
        comments: '',
        menarche_achieved: null,
    });

    const handleChange = (e) => {
        setFemaleScreeningForm({
            ...femaleScreeningForm,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = {
            ...femaleScreeningForm,
        };

        try {
            const response = await fetch(`${Port}/Screening/female_screening/${basicScreeningPkId}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify(formData),
            });

            if (response.status === 200) {
                const data = await response.json();
                console.log('Server Response:', data);
                alert('Female Child Screening form Submitted successfully');
                onAcceptClick(nextName, basicScreeningPkId);
            } else if (response.status === 400) {
                console.error('Bad Request:', response.statusText);
            } else {
                console.error('Unhandled Status Code:', response.status);
            }
        } catch (error) {
            console.error('Error sending data:', error.message);
        }
    };

    useEffect(() => {
        console.log('Fetching data for pkid:', pkid);
        fetchDataById(pkid);
    }, [pkid]);

    const fetchDataById = async (pkid) => {
        try {
            const response = await fetch(`${Port}/Screening/citizen_basic_screening_info_get/${pkid}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            if (response.ok) {
                const data = await response.json();

                if (Array.isArray(data) && data.length > 0) {
                    const screeningData = data[0];
                    console.log('Fetched screeningData:', screeningData);

                    setFemaleScreeningForm((prevState) => ({
                        ...prevState,
                        date_of_menarche: screeningData.date_of_menarche,
                        age_of_menarche: screeningData.age_of_menarche,
                        comments: screeningData.comments,
                        // menarche_achieved: screeningData.menarche_achieved ? String(screeningData.menarche_achieved) : null,
                        menarche_achieved: screeningData.menarche_achieved !== undefined ? String(screeningData.menarche_achieved) : null,
                        // vaginal_descharge: screeningData.vaginal_descharge ? String(screeningData.vaginal_descharge) : null,
                        vaginal_descharge: screeningData.vaginal_descharge !== undefined ? String(screeningData.vaginal_descharge) : null,
                        flow: screeningData.flow ? String(screeningData.flow) : null,
                    }));

                    console.log(femaleScreeningForm, 'updating data');
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

    return (
        <div>
            <h5 className="vitaltitlebasicscreen">Female Child Screening</h5>
            <div className="elementvital"></div>
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-md-4">
                        <h6 className='femalePoint'>Menarche Achieved</h6>
                    </div>
                    <div className="col-md-2">
                        <div className="form-check formchecksetpsycho">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="menarche_achieved"
                                value="1"
                                onChange={handleChange}
                                checked={femaleScreeningForm.menarche_achieved === '1'}
                            />
                            <label className="form-check-label" htmlFor="hyper_reactive_yes">
                                Yes
                            </label>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div className="form-check formchecksetpsycho">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="menarche_achieved"
                                value="0"
                                onChange={handleChange}
                                checked={femaleScreeningForm.menarche_achieved === '0'}
                            />
                            <label className="form-check-label" htmlFor="hyper_reactive_no">
                                No
                            </label>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-4">
                        <h6 className='femalePoint'>Vaginal Discharge</h6>
                    </div>
                    <div className="col-md-2">
                        <div className="form-check formchecksetpsycho">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="vaginal_descharge"
                                value="1"
                                onChange={handleChange}
                                checked={femaleScreeningForm.vaginal_descharge === '1'}
                            />
                            <label className="form-check-label" htmlFor="hyper_reactive_yes">
                                Yes
                            </label>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div className="form-check formchecksetpsycho">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="vaginal_descharge"
                                value="0"
                                onChange={handleChange}
                                checked={femaleScreeningForm.vaginal_descharge === '0'}
                            />
                            <label className="form-check-label" htmlFor="hyper_reactive_no">
                                No
                            </label>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-4">
                        <h6 className='femalePoint'>Flow</h6>
                    </div>
                    <div className="col-md-2">
                        <div className="form-check formchecksetpsycho">
                            <input
                                className="form-check-input"
                                type="radio"
                                id="flow_nad"
                                name="flow"
                                value="1"
                                onChange={handleChange}
                                checked={femaleScreeningForm.flow === '1'}
                            />
                            <label className="form-check-label" htmlFor="flow_nad">
                                NAD
                            </label>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div className="form-check formchecksetpsycho">
                            <input
                                className="form-check-input"
                                type="radio"
                                id="flow_mild"
                                name="flow"
                                value="2"
                                onChange={handleChange}
                                checked={femaleScreeningForm.flow === '2'}
                            />
                            <label className="form-check-label" htmlFor="flow_mild">
                                Mild
                            </label>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div className="form-check formchecksetpsycho">
                            <input
                                className="form-check-input"
                                type="radio"
                                id="flow_moderate"
                                name="flow"
                                value="3"
                                onChange={handleChange}
                                checked={femaleScreeningForm.flow === '3'}
                            />
                            <label className="form-check-label" htmlFor="flow_moderate">
                                Moderate
                            </label>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div className="form-check formchecksetpsycho">
                            <input
                                className="form-check-input"
                                type="radio"
                                id="flow_excessive"
                                name="flow"
                                value="4"
                                onChange={handleChange}
                                checked={femaleScreeningForm.flow === '4'}
                            />
                            <label className="form-check-label" htmlFor="flow_excessive">
                                Excessive
                            </label>
                        </div>
                    </div>
                </div>

                <div className='row headeskinvital'>
                    <div className='col-md-4'>
                        <label className="Visually-hidden basicscreenheadline">LMP</label>
                        <input
                            type='date'
                            className="form-control form-control formbasiccc"
                            name="date_of_menarche"
                            value={femaleScreeningForm.date_of_menarche}
                            onChange={handleChange}
                            max={new Date().toISOString().split('T')[0]} // Set max attribute to today's date
                        />
                    </div>

                    {
                        source === '1' && (
                            <>
                                <div className='col-md-4'>
                                    <label className="Visually-hidden basicscreenheadline">Age of Menarche</label>
                                    <input
                                        className="form-control form-control formbasiccc"
                                        name="age_of_menarche"
                                        value={femaleScreeningForm.age_of_menarche}
                                        onChange={handleChange}
                                    />
                                </div>
                            </>
                        )
                    }

                    <div className='col-md-4'>
                        <label className="Visually-hidden basicscreenheadline">Comments</label>
                        <input
                            className="form-control form-control formbasiccc"
                            name="comments"
                            value={femaleScreeningForm.comments}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div>
                    <button type="submit" className="btn btn-sm generalexambutton">Submit</button>
                </div>
            </form>
        </div>
    )
}

export default Femalescreening
