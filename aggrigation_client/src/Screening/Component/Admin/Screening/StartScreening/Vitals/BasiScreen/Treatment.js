import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Treatment = ({ pkid, onAcceptClick, citizensPkId, scheduleID, citizenidddddddd, selectedTab, subVitalList }) => {

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

    const userID = localStorage.getItem('userID');
    console.log(userID);
    console.log(scheduleID, 'treatmentschedule');
    console.log(citizenidddddddd, 'treatmentcitizen');
    const accessToken = localStorage.getItem('token');

    const [referral, setReferral] = useState([])
    const [placereferaal, setPlacereferral] = useState([])

    const basicScreeningPkId = localStorage.getItem('basicScreeningId');
    console.log('Retrieved Basic Id in Treatment Local Storage:', basicScreeningPkId);

    const [referredToSpecialist, setReferredToSpecialist] = useState(null);

    const [treatmentForm, setTreatmentForm] = useState({
        treatment_for: '',
        reason_for_referral: '',
        outcome: '',
        referral: '',
        placereferaal: '',
        modify_by: userID,
        reffered_to_specialist: null,
        schedule_id: scheduleID,
        citizen_id: citizenidddddddd
    });

    const handleChange = (e) => {
        setTreatmentForm({
            ...treatmentForm,
            [e.target.name]: e.target.value,
        });
    };

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

                // Check if the array has at least one element before accessing properties
                if (Array.isArray(data) && data.length > 0) {
                    const treatmentData = data[0];

                    setTreatmentForm((prevState) => ({
                        ...prevState,
                        treatment_for: treatmentData.treatment_for,
                        reason_for_referral: treatmentData.reason_for_referral,
                        outcome: treatmentData.outcome,
                        referral: treatmentData.referral,
                        place_referral: treatmentData.place_referral,
                        reffered_to_specialist: treatmentData.reffered_to_specialist // Set referred_to_specialist in state
                    }));

                    // Set referredToSpecialist state based on fetched value
                    setReferredToSpecialist(treatmentData.reffered_to_specialist);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = {
            ...treatmentForm,
            reffered_to_specialist: referredToSpecialist // Include referredToSpecialist in formData
        };

        console.log('Form Data:', formData);

        try {
            const response = await fetch(`${Port}/Screening/treatment/${basicScreeningPkId}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(formData),
            });

            if (response.status === 200) {
                const data = await response.json();
                console.log('Server Response:', data);

                // Extract basic_screening_pk_id from the response
                const basicScreeningPkId = data.basic_screening_pk_id;

                // Use updatedBasicScreeningPkId as needed in your component
                console.log('Female Child Screening:', basicScreeningPkId);
                // Call onAcceptClick with the updated id
                // onAcceptClick('Female Child Screening', basicScreeningPkId);
                onAcceptClick(nextName, basicScreeningPkId);

                alert('Treatment form Submitted successfully');
            } else if (response.status === 400) {
                console.error('Bad Request:');
            } else {
                console.error('Unhandled Status Code:', response.status);
            }
        } catch (error) {
            console.error('Error sending data:', error.message);
        }
    };

    // treatment referal 
    useEffect(() => {
        const fetchReferralData = async () => {
            try {
                const response = await axios.get(`${Port}/Screening/referral/`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                setReferral(response.data);
            } catch (error) {
                console.error('Error fetching referral data:', error);
            }
        };

        fetchReferralData();
    }, []);

    // place_referral 
    useEffect(() => {
        const placereferalFetch = async () => {
            try {
                const response = await axios.get(`${Port}/Screening/place_referral/`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                setPlacereferral(response.data)
            }
            catch (error) {
                console.log(error, 'error fetching Data');
            }
        }
        placereferalFetch();
    }, [])

    return (
        <div>
            <h5 className="vitaltitlebasicscreen">Treatment</h5>
            <div className="elementvital"></div>
            <form onSubmit={handleSubmit}>
                <div className='row headeskinvital'>
                    <div className='col-md-4'>
                        <label className="Visually-hidden basicscreenheadline">Treatment For</label>
                        <input
                            className="form-control form-control formbasiccc"
                            name="treatment_for"
                            value={treatmentForm.treatment_for}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-4">
                        <label className="Visually-hidden basicscreenheadline">Referral</label>
                        <select className="form-control form-select form-select-sm selectdropexam"
                            onChange={handleChange}
                            name="referral"
                            value={treatmentForm.referral}>
                            <option selected>Select</option>
                            {
                                referral.map((drop) => (
                                    <option key={drop.referral_id} value={drop.referral_id}>
                                        {drop.referral}
                                    </option>
                                ))
                            }
                        </select>
                    </div>

                    <div className='col-md-4'>
                        <label className="Visually-hidden basicscreenheadline">Reason For Referral</label>
                        <input className="form-control form-control formbasiccc"
                            name="reason_for_referral"
                            value={treatmentForm.reason_for_referral}
                            onChange={handleChange} />
                    </div>

                    <div className="col-md-4 mb-2">
                        <label className="Visually-hidden basicscreenheadline">Place Referral</label>
                        <select className="form-control form-select form-select-sm selectdropexam"
                            onChange={handleChange}
                            name="place_referral"
                            value={treatmentForm.place_referral}>
                            <option selected>Select</option>
                            {
                                placereferaal.map((drop) => (
                                    <option key={drop.place_referral_id} value={drop.place_referral_id}>
                                        {drop.place_referral}
                                    </option>
                                ))
                            }
                        </select>
                    </div>

                    <div className='col-md-4'>
                        <label className="Visually-hidden basicscreenheadline">Outcome</label>
                        <input className="form-control form-control formbasiccc"
                            name="outcome"
                            value={treatmentForm.outcome}
                            onChange={handleChange} />
                    </div>

                    <div className="col-md-12 mb-3 mt-2">
                        <div className="row mb-3 mt-2">
                            <div className="col-md-4">
                                <h6 className="specialistedrefrresedd">Reffered To Specialist</h6>
                            </div>

                            <div className="col-md-1">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    id="yes"
                                    name="reffered_to_specialist"
                                    value={1}
                                    checked={referredToSpecialist === 1} // Compare with string values
                                    onChange={() => setReferredToSpecialist(1)}
                                />
                                <label className="form-check-label" htmlFor="yes">
                                    Yes
                                </label>
                            </div>

                            <div className="col-md-1">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    id="no"
                                    name="reffered_to_specialist"
                                    value={2}
                                    checked={referredToSpecialist === 2}
                                    onChange={() => setReferredToSpecialist(2)}
                                />
                                <label className="form-check-label" htmlFor="no">
                                    No
                                </label>
                            </div>
                        </div>
                    </div>

                    <div>
                        <button type="submit" className="btn btn-sm generalexambutton">Submit</button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Treatment
