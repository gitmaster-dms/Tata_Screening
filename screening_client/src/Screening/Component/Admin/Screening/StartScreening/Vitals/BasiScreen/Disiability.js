import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Disiability = ({ pkid, onAcceptClick, citizensPkId, selectedTab, subVitalList }) => {

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
    // console.log(basicScreeningPkId, 'Diasaibility');
    const basicScreeningPkId = localStorage.getItem('basicScreeningId');
    console.log('Retrieved Basic Id from Local Storage:', basicScreeningPkId);

    //// access the source from local storage
    const source = localStorage.getItem('source');

    const userID = localStorage.getItem('userID');
    console.log(userID);
    const accessToken = localStorage.getItem('token');

    //////Disability 
    const [languageDelay, setLanguagedelay] = useState([]);
    const [behavioural, setBehavioural] = useState([]);
    const [speech, setSpeech] = useState([]);

    const [disiability, setDisiability] = useState({
        comment: '',
        language_delay: '',
        behavioural_disorder: '',
        speech_screening: '',
        citizen_pk_id: citizensPkId,
        modify_by: userID
    })

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

                // Check if the array has at least one element before accessing properties
                if (Array.isArray(data) && data.length > 0) {
                    const treatmentData = data[0];

                    setDisiability((prevState) => ({
                        ...prevState,
                        comment: treatmentData.comment,
                        language_delay: treatmentData.language_delay,
                        behavioural_disorder: treatmentData.behavioural_disorder,
                        speech_screening: treatmentData.speech_screening,
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

    useEffect(() => {
        fetchDataById(pkid);
    }, [pkid]);

    const handleChange = (e) => {
        setDisiability({
            ...disiability,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = {
            ...disiability,
        };

        console.log('Form Data:', formData);

        try {
            const response = await fetch(`${Port}/Screening/disability_screening/${basicScreeningPkId}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`, // Include the authorization header
                },
                body: JSON.stringify(formData),
            });

            if (window.confirm('Submit Disability Form') && response.ok) {
                const data = await response.json();
                console.log('Server Response:', data);

                if (response.status === 200) {
                    const basicScreeningPkId = data.basic_screening_pk_id;
                    console.log('Birth Defects:', basicScreeningPkId);
                    onAcceptClick(nextName, basicScreeningPkId);
                } else if (response.status === 400) {
                    console.error('Bad Request:', data.error);
                } else {
                    console.error('Unhandled Status Code:', response.status);
                }
            } else {
                console.error('Error:', response.status);
            }
        } catch (error) {
            console.error('Error sending data:', error.message);
        }
    };

    // Language Delay 
    useEffect(() => {
        const LanguageFetch = async () => {
            try {
                const response = await axios.get(`${Port}/Screening/language_delay/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`, // Include the authorization header
                    },
                });
                setLanguagedelay(response.data)
            }
            catch (error) {
                console.log(error, 'error fetching Data');
            }
        }
        LanguageFetch();
    }, [])

    // Behavioural 
    useEffect(() => {
        const BehaviouralFetch = async () => {
            try {
                const response = await axios.get(`${Port}/Screening/behavioural_disorder/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`, // Include the authorization header
                    },
                });
                setBehavioural(response.data)
            }
            catch (error) {
                console.log(error, 'error fetching Data');
            }
        }
        BehaviouralFetch();
    }, [])

    // Speech 
    useEffect(() => {
        const SpeechFetch = async () => {
            try {
                const response = await axios.get(`${Port}/Screening/speech_screening/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`, // Include the authorization header
                    },
                });
                setSpeech(response.data)
            }
            catch (error) {
                console.log(error, 'error fetching Data');
            }
        }
        SpeechFetch();
    }, [])

    return (
        <div>
            <h5 className="vitaltitlebasicscreen">Disability Screening</h5>
            <div className="elementvital"></div>
            <form onSubmit={handleSubmit}>
                <div className="row headeskinvitaldisability">
                    {
                        source === '1' && (
                            <>
                                <div className="col-md-4">
                                    <label className="Visually-hidden basicscreenheadline">Language Delay</label>
                                    <select className="form-control form-select form-select-sm selectdropexam"
                                        name="language_delay"
                                        value={disiability.language_delay}
                                        onChange={handleChange}>
                                        <option selected>Select</option>
                                        {
                                            languageDelay.map((drop) => (
                                                <option key={drop.language_delay_id} value={drop.language_delay_id}>
                                                    {drop.language_delay}
                                                </option>
                                            ))
                                        }
                                    </select>
                                </div>
                            </>
                        )
                    }

                    <div className="col-md-4">
                        <label className="Visually-hidden basicscreenheadline">Behavioural Disorder</label>
                        <select className="form-control form-select form-select-sm selectdropexam"
                            name="behavioural_disorder"
                            value={disiability.behavioural_disorder}
                            onChange={handleChange}>
                            <option selected>Select</option>
                            {
                                behavioural.map((drop) => (
                                    <option key={drop.behavioural_disorder_id} value={drop.behavioural_disorder_id}>
                                        {drop.behavioural_disorder}
                                    </option>
                                ))
                            }
                        </select>
                    </div>

                    <div className="col-md-4">
                        <label className="Visually-hidden basicscreenheadline">Speech Screening</label>
                        <select className="form-control form-select form-select-sm selectdropexam"
                            name="speech_screening"
                            value={disiability.speech_screening}
                            onChange={handleChange}>
                            <option selected>Select</option>
                            {
                                speech.map((drop) => (
                                    <option key={drop.speech_screening_id} value={drop.speech_screening_id}>
                                        {drop.speech_screening}
                                    </option>
                                ))
                            }
                        </select>
                    </div>

                    <div className="col-md-4">
                        <label className="Visually-hidden basicscreenheadline">Comment</label>
                        <input className='form-control form-select form-select-sm selectdropexam'
                            name="comment"
                            value={disiability.comment}
                            onChange={handleChange} />
                    </div>

                    <div>
                        <button type="submit" className="btn btn-sm generalexambutton">Submit</button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Disiability
