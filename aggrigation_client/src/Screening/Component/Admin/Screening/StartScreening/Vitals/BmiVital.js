import React, { useState, useEffect } from 'react'
import './BmiVital.css'

const BmiVital = ({ onAcceptClick, pkid, calculatedHeight, enteredWeight, scheduleID, fetchVital, selectedName }) => {
    //_________________________________START
    console.log(selectedName, 'Present name');
    console.log(fetchVital, 'Overall GET API');
    const [nextName, setNextName] = useState('');

    useEffect(() => {
        if (fetchVital && selectedName) {
            const currentIndex = fetchVital.findIndex(item => item.screening_list === selectedName);

            console.log('Current Index:', currentIndex);

            if (currentIndex !== -1 && currentIndex < fetchVital.length - 1) {
                const nextItem = fetchVital[currentIndex + 1];
                const nextName = nextItem.screening_list;
                setNextName(nextName);
                console.log('Next Name Set:', nextName);
            } else {
                setNextName('');
                console.log('No next item or selectedName not found');
            }
        }
    }, [selectedName, fetchVital]);
    //__________________________________END
    const Port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');
    const userID = localStorage.getItem('userID');
    console.log(userID);
    console.log(pkid, 'pkiddddddddddddddddddddddddddddddddddddddddd');
    console.log(scheduleID, 'scheduleIDdddddddddddddddddddddddddddddddddddddddddddd');

    //// access the source from local storage
    const SourceUrlId = localStorage.getItem('loginSource');

    //// access the source name from local storage
    const SourceNameUrlId = localStorage.getItem('SourceNameFetched');

    const displayHeight = calculatedHeight !== undefined ? calculatedHeight : 'N/A';
    console.log(pkid);

    const [isFormBlurred, setIsFormBlurred] = useState(true);
    const [referredToSpecialist, setReferredToSpecialist] = useState(null);

    const [bmiData, setBmiData] = useState({
        dob: "",
        year: "",
        month: "",
        days: "",
        height: null,
        weight: null,
        weight_for_age: "",
        height_for_age: "",
        weight_for_height: "",
        bmi: null,
        arm_size: "",
        citizen_info: {
            gender: "",  // Add default value for gender
        },
        // gender: "",
        remark: "",
        symptoms_if_any: "",
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBmiData({
            ...bmiData,
            [name]: value
        });
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${Port}/Screening/citizen_growth_info_get/${pkid}/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });
                if (!response.ok) {
                    throw new Error(`Failed to fetch data. Status: ${response.status}`);
                }

                const bmiDataFromApi = await response.json();
                const familyData = bmiDataFromApi[0];
                setBmiData(familyData);

                console.log(bmiData, 'bmidataaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');

                // Extract citizen_pk_id
                const citizenPkId = familyData.citizen_id;
                console.log('Citizen PK ID:', citizenPkId);

                setUpdateId(familyData.citizen_id)

                // Check if essential data (e.g., BMI, height for age, weight for age) is available
                const essentialDataAvailable =
                    // familyData.citizen_info?.bmi !== null &&
                    familyData.citizen_info?.bmi === null &&
                    familyData.citizen_info?.height_for_age !== null &&
                    familyData.citizen_info?.weight_for_age !== null &&
                    familyData.citizen_info?.weight_for_height !== null;
                setIsFormBlurred(!essentialDataAvailable);

            } catch (error) {
                console.error('Error fetching BMI data', error);
            }
        };

        fetchData();
    }, [pkid]);

    const [updateId, setUpdateId] = useState("") ////// PUT Store Variable

    useEffect(() => {
        if (updateId) {
            updateFormWithId(updateId);
        }
    }, [updateId]);

    const updateFormWithId = (citizen_id) => {
        console.log('Updating form with ID:', citizen_id);
    };

    const updateDataInDatabase = async (citizen_id, confirmationStatus) => {
        try {
            const response = await fetch(`${Port}/Screening/citizen_growth_info_put/${citizen_id}/`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json', // Ensure correct content type
                },
                body: JSON.stringify({
                    citizen_id: bmiData.citizen_id,
                    gender: bmiData.citizen_info.gender,
                    dob: bmiData.citizen_info.dob,
                    year: bmiData.citizen_info.year,
                    months: bmiData.citizen_info.months,
                    days: bmiData.citizen_info.days,
                    height: bmiData.citizen_info.height,
                    weight: bmiData.citizen_info.weight,
                    weight_for_age: bmiData.citizen_info.weight_for_age,
                    height_for_age: bmiData.citizen_info.height_for_age,
                    weight_for_height: bmiData.citizen_info.weight_for_height,
                    bmi: bmiData.citizen_info.bmi,
                    arm_size: bmiData.citizen_info.arm_size,
                    form_submit: confirmationStatus,
                    added_by: userID,
                    modify_by: userID,
                    remark: bmiData.remark,
                    symptoms_if_any: bmiData.symptoms_if_any,
                    reffered_to_specialist: referredToSpecialist,
                    schedule_id: scheduleID
                }),
            });

            console.log(response);

            if (response.ok) {
                const updatedBmiData = await response.json();
                setBmiData(updatedBmiData);  // Update the state with the new data
                console.log(updatedBmiData, 'Data updated successfully');
                onAcceptClick(nextName);
            } else if (response.status === 400) {
                alert('Bad request. Please check your data and try again.');
            } else if (response.status === 500) {
                alert('Internal Server Error. Please try again later.');
            } else {
                alert(`Failed to update data. Status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error updating data', error);
        }
    };

    const handleSubmit = async () => {
        const isConfirmed = window.confirm('Submit Growth Info Form');
        const confirmationStatus = isConfirmed ? 'True' : 'False';

        if (updateId) {
            if (isConfirmed) {
                await updateDataInDatabase(updateId, confirmationStatus);
            } else {
                console.log('Form submission cancelled');
            }
        }
        console.log("Move to Vital button clicked");
    };

    useEffect(() => {
        setBmiData((prevData) => ({
            ...prevData,
            citizen_info: {
                ...prevData.citizen_info,
                height: calculatedHeight !== undefined ? calculatedHeight : prevData.citizen_info.height,
            },
        }));
    }, [calculatedHeight]);

    useEffect(() => {
        setBmiData((prevData) => ({
            ...prevData,
            citizen_info: {
                ...prevData.citizen_info,
                weight: enteredWeight,
            },
        }));
    }, [enteredWeight]);

    useEffect(() => {
        const fetchOtherData = async () => {
            try {
                const response = await fetch(`${Port}/Screening/SAM_MAM_BMI/${bmiData.citizen_info.year}/${bmiData.citizen_info.months}/${bmiData.citizen_info.gender}/${bmiData.citizen_info.height}/${bmiData.citizen_info.weight}/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch other data. Status: ${response.status}`);
                }

                const otherData = await response.json();
                console.log(otherData);

                setBmiData((prevBmiData) => ({
                    ...prevBmiData,
                    citizen_info: {
                        ...prevBmiData.citizen_info,
                        bmi: otherData.bmi,
                        weight_for_age: otherData.weight_for_age1,
                        weight_for_height: otherData.height_for_weight3,
                        height_for_age: otherData.height_for_age2,
                        weight_for_age_label: otherData.weight_for_age1,
                        height_for_age_label: otherData.height_for_age2,
                        height_for_weight_label: otherData.height_for_weight3,
                        result_BMI: otherData.result_BMI
                    },
                }));

                console.log('result dataaaaa', otherData.result_BMI);
            } catch (error) {
                console.error('Error fetching other data', error);
            }
        };

        fetchOtherData();
    }, [bmiData.citizen_info.dob, bmiData.citizen_info.gender, bmiData.citizen_info.height, bmiData.citizen_info.weight]);

    const handleDOBChange = (event) => {
        const newDOB = event.target.value;
        setBmiData((prevBmiData) => ({
            ...prevBmiData,
            citizen_info: {
                ...prevBmiData.citizen_info,
                dob: newDOB,
            },
        }));

        const selectedDate = new Date(newDOB);
        const today = new Date();
        const differenceInYears = today.getFullYear() - selectedDate.getFullYear();

        setIsFormBlurred(differenceInYears < 10);
    };

    useEffect(() => {
        const calculateAge = () => {
            if (bmiData && bmiData.citizen_info && bmiData.citizen_info.dob) {
                const selectedDOB = new Date(bmiData.citizen_info.dob);
                const currentDate = new Date();

                const ageInMilliseconds = currentDate - selectedDOB;
                const ageInYears = Math.floor(ageInMilliseconds / (365.25 * 24 * 60 * 60 * 1000));
                const ageInMonths = Math.floor((ageInMilliseconds % (365.25 * 24 * 60 * 60 * 1000)) / (30.44 * 24 * 60 * 60 * 1000));
                const ageInDays = Math.floor((ageInMilliseconds % (30.44 * 24 * 60 * 60 * 1000)) / (24 * 60 * 60 * 1000));

                // Update the state with the calculated values
                setBmiData((prevBmiData) => ({
                    ...prevBmiData,
                    citizen_info: {
                        ...prevBmiData.citizen_info,
                        year: ageInYears.toString(),
                        months: ageInMonths.toString(),
                        days: ageInDays.toString(),
                    },
                }));
            }
        };

        calculateAge();
    }, [bmiData.citizen_info.dob]);

    // useEffect(() => {
    //     const calculateAge = () => {
    //         const selectedDOB = new Date(bmiData.citizen_info.dob);
    //         const currentDate = new Date();

    //         const ageInMilliseconds = currentDate - selectedDOB;
    //         const ageInYears = Math.floor(ageInMilliseconds / (365.25 * 24 * 60 * 60 * 1000));
    //         const ageInMonths = Math.floor((ageInMilliseconds % (365.25 * 24 * 60 * 60 * 1000)) / (30.44 * 24 * 60 * 60 * 1000));
    //         const ageInDays = Math.floor((ageInMilliseconds % (30.44 * 24 * 60 * 60 * 1000)) / (24 * 60 * 60 * 1000));

    //         // Update the state with the calculated values
    //         setBmiData((prevBmiData) => ({
    //             ...prevBmiData,
    //             citizen_info: {
    //                 ...prevBmiData.citizen_info,
    //                 year: ageInYears.toString(),
    //                 months: ageInMonths.toString(),
    //                 days: ageInDays.toString(),
    //             },
    //         }));
    //     };

    //     calculateAge();
    // }, [bmiData.citizen_info.dob]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${Port}/Screening/citizen_medical_event_info_get/${pkid}/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const responseData = await response.json();
                const { symptoms_if_any, remark, reffered_to_specialist } = responseData[0];
                console.log('Symptoms:', symptoms_if_any);
                console.log('Remark:', remark);
                console.log('Referred to specialist:', reffered_to_specialist);

                // Update referredToSpecialist state
                setReferredToSpecialist(reffered_to_specialist);

                // Update bmiData state
                setBmiData(prevBmiData => ({
                    ...prevBmiData,
                    symptoms_if_any,
                    remark,
                }));

            } catch (error) {
                console.error('Error fetching data', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <div className="row backdesign">
                <div className="col-md-12">
                    <div className="card bmicard">
                        <div className="row">
                            <div className="col-md-4">
                                <h6 className='mt-1'>BMI & Symptoms</h6>
                            </div>
                            <div className="col-md-5 ml-auto">
                                <div class="progress-barbmi"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-12">
                    <div className="card grothcardmonitor">
                        <div className="row">
                            <div className="col-md-12">
                                <h6 className="BMITitle">GROWTH MONITORING</h6>
                                <div className="bmielement"></div>
                            </div>

                            <div className="col-md-5">
                                <div className="row cardadjust growthcard">
                                    <div className="col-md-12">
                                        <label className="visually-hidden bmivitalfield" id="age">
                                            DOB
                                        </label>
                                        <input
                                            type="date"
                                            className="form-control inputbmivitalscreen"
                                            id="dob"
                                            name="dob"
                                            placeholder="Dob"
                                            value={bmiData.citizen_info.dob}
                                            onChange={handleDOBChange}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <input
                                            className="form-control inputbmivital1"
                                            id="year"
                                            placeholder="Year"
                                            name="year"
                                            value={bmiData.citizen_info.year}
                                            readOnly
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <input
                                            className="form-control inputbmivital1"
                                            id="months"
                                            placeholder="Months"
                                            name="months"
                                            value={bmiData.citizen_info.months}
                                            readOnly
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <input
                                            className="form-control inputbmivital1"
                                            id="days"
                                            placeholder="Days"
                                            name="days"
                                            value={bmiData.citizen_info.days}
                                            readOnly
                                        />
                                    </div>
                                </div>

                                <div className="row cardadjust">
                                    <div className="col-md-6">
                                        <div className="form-control responseinput ml-1">
                                            <div class="form-check">
                                                <label class="form-check-label mgenderdefine" for="flexRadioDefault1">
                                                    Male
                                                </label>
                                                <input class="form-check-input clickbtnm" type="radio" name="flexRadioDefault"
                                                    id="flexRadioDefault1" checked={bmiData?.citizen_info?.gender === "1"} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-control ml-1 responseinput1">
                                            <div class="form-check">
                                                <label class="form-check-label fgenderdefine" for="flexRadioDefault1">
                                                    Female
                                                </label>
                                                <input class="form-check-input clickbtnf" type="radio" name="flexRadioDefault"
                                                    id="flexRadioDefault1" checked={bmiData?.citizen_info?.gender === "2"} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="row cardadjust1">
                                    <div className="col-md-12">
                                        <div className="card heightcard">
                                            <div className="row">
                                                <div className="col-md-7 heightlabel">Height</div>
                                                <div className="col-md-5 mt-2">
                                                    <input
                                                        type="number"
                                                        className="form-control form-control-sm bmiformcontrol"
                                                        id="height"
                                                        name="height"
                                                        value={bmiData?.citizen_info?.height || null}
                                                        onChange={(e) => {
                                                            const newValue = Math.min(Math.max(parseInt(e.target.value)), 221);

                                                            setBmiData({
                                                                ...bmiData,
                                                                citizen_info: {
                                                                    ...bmiData.citizen_info,
                                                                    height: newValue,
                                                                },
                                                            });
                                                        }}
                                                    />

                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                <div className="row cardadjust1">
                                    <div className="col-md-12">
                                        <div className="card weightcard">
                                            <div className="row">
                                                <div className="col-md-7 heightlabel">Weight</div>
                                                <div className="col-md-5 mt-2">
                                                    <input
                                                        type="text"
                                                        className="form-control form-control-sm bmiformcontrolweight"
                                                        id="weight"
                                                        name="weight"
                                                        value={bmiData?.citizen_info?.weight}
                                                        onChange={(e) => {
                                                            let newValue = parseInt(e.target.value);

                                                            newValue = Math.min(newValue, 400);
                                                            newValue = isNaN(newValue) || newValue < 0 ? 0 : newValue;

                                                            setBmiData({
                                                                ...bmiData,
                                                                citizen_info: {
                                                                    ...bmiData.citizen_info,
                                                                    weight: newValue,
                                                                },
                                                            });
                                                        }}
                                                    />
                                                    {/* <input
                                                        type="text"
                                                        className="form-control form-control-sm bmiformcontrolweight"
                                                        id="weight"
                                                        name="weight"
                                                        value={bmiData?.citizen_info?.weight}
                                                        
                                                        onChange={(e) =>
                                                            setBmiData({
                                                                ...bmiData,
                                                                citizen_info: {
                                                                    ...bmiData.citizen_info,
                                                                    weight: e.target.value,
                                                                },
                                                            })
                                                        }
                                                    /> */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {
                                    SourceUrlId === '1' ?
                                        (
                                            <div className="row cardadjust1">
                                                <div className="col-md-12">
                                                    <div className="card armcard">
                                                        <div className="row">
                                                            <div className="col-md-7 heightlabel">Arm</div>
                                                            <div className="col-md-5 mt-2">{bmiData?.citizen_info?.arm_size}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                        :
                                        null
                                }
                            </div>

                            <div className={`col-md-7 mt-1`}>
                                <div className="row cardmove" style={{ height: '95%' }}>
                                    {bmiData.citizen_info.dob && (
                                        <div className="col-md-12">
                                            <div className={`card bmidatadetails`}>
                                                <div className='row bodymasstitle'>
                                                    <h6>Body Mass Index (BMI)</h6>
                                                </div>
                                                <div className='row databmi'>
                                                    <div className='col-md-4'>
                                                        <h6>{bmiData?.citizen_info?.bmi}</h6>
                                                    </div>

                                                    <div className='col-md-8'>
                                                        {'18.5' <= bmiData?.citizen_info?.bmi && bmiData?.citizen_info?.bmi < '25' && (
                                                            <h6 className={`textdecor`} style={{ fontSize: bmiData?.citizen_info?.font_size }}>
                                                                You are Normal.
                                                            </h6>
                                                        )}

                                                        {bmiData?.citizen_info?.bmi < '18.5' && (
                                                            <h6 className={`textdecor`} style={{ fontSize: bmiData?.citizen_info?.font_size }}>
                                                                You are Underweight.
                                                            </h6>
                                                        )}

                                                        {'25' <= bmiData?.citizen_info?.bmi && bmiData?.citizen_info?.bmi < '30' && (
                                                            <h6 className={`textdecor`} style={{ fontSize: bmiData?.citizen_info?.font_size }}>
                                                                You are Overweight.
                                                            </h6>
                                                        )}

                                                        {bmiData?.citizen_info?.bmi >= '30' && (
                                                            <h6 className={`textdecor`} style={{ fontSize: bmiData?.citizen_info?.font_size }}>
                                                                Obese.
                                                            </h6>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className='row belowheading'>
                                                    {/* <div className="arrow"></div> */}
                                                    <input className='widget' />
                                                    <div className="labels">
                                                        <span className={`label-bold ${bmiData?.citizen_info?.bmi < 18.5 ? 'label-red' : 'label-blurred'}`} style={{ fontSize: bmiData?.citizen_info?.bmi < 18.5 ? `${bmiData?.citizen_info?.font_size}px` : '15px' }}>
                                                            Underweight
                                                        </span>
                                                        <span className={`label-bold ${18.5 <= bmiData?.citizen_info?.bmi && bmiData?.citizen_info?.bmi < 25 ? 'label-red' : 'label-blurred'}`} style={{ fontSize: 18.5 <= bmiData?.citizen_info?.bmi && bmiData?.citizen_info?.bmi < 25 ? `${bmiData?.citizen_info?.font_size}px` : '15px' }}>
                                                            Normal
                                                        </span>
                                                        <span className={`label-bold ${25 <= bmiData?.citizen_info?.bmi && bmiData?.citizen_info?.bmi < 30 ? 'label-red' : 'label-blurred'}`} style={{ fontSize: 25 <= bmiData?.citizen_info?.bmi && bmiData?.citizen_info?.bmi < 30 ? `${bmiData?.citizen_info?.font_size}px` : '15px' }}>
                                                            Overweight
                                                        </span>
                                                        <span className={`label-bold ${bmiData?.citizen_info?.bmi >= 30 ? 'label-red' : 'label-blurred'}`} style={{ fontSize: bmiData?.citizen_info?.bmi >= 30 ? `${bmiData?.citizen_info?.font_size}px` : '15px' }}>
                                                            Obesity
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* <div className='row belowheading'>
                                                <div className="arrow"></div>
                                                <input className='widget' />
                                                <div className="labels">
                                                    <span className={bmiData?.citizen_info?.bmi < 18.5 ? 'label-bold label-red' : 'label-red'}>
                                                        Underweight
                                                    </span>
                                                    <span className={18.5 <= bmiData?.citizen_info?.bmi && bmiData?.citizen_info?.bmi < 25 ? 'label-bold label-red' : 'label-red'}>
                                                        Normal
                                                    </span>
                                                    <span className={25 <= bmiData?.citizen_info?.bmi && bmiData?.citizen_info?.bmi < 30 ? 'label-bold label-red' : 'label-red'}>
                                                        Overweight
                                                    </span>
                                                    <span className={bmiData?.citizen_info?.bmi >= 30 ? 'label-bold label-red' : 'label-red'}>
                                                        Obesity
                                                    </span>
                                                </div>
                                            </div> */}

                                                <div className='row belowheading'>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {bmiData.citizen_info.dob && (
                                        <div className={`col-md-12 mt-2`}>
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <div className="card wtforage" style={{ height: '118%' }}>
                                                        <div className="col textsize"> Weight for Age</div>
                                                        <div className="col wtcount">{bmiData?.citizen_info?.weight_for_age_label}</div>
                                                    </div>
                                                </div>

                                                <div className="col-md-4">
                                                    <div className="card wtforht" style={{ height: '118%' }}>
                                                        <div className="col textsize"> Weight for Height</div>
                                                        <div className="col wtcount">{bmiData?.citizen_info?.height_for_weight_label}</div>
                                                    </div>
                                                </div>

                                                <div className="col-md-4">
                                                    <div className="card htforage" style={{ height: '118%' }}>
                                                        <div className="col textsize"> Height for Age</div>
                                                        <div className="col wtcount">{bmiData?.citizen_info?.height_for_age_label}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-12">
                    <div className="card medicalcard">
                        <div className="row">
                            <div className="col-md-12">
                                <h6 className='medicaltitle'>Medical Event</h6>
                                <div className="elementmedical"></div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label htmlFor="symptoms" className="form-label medicallabel">Symptoms If any</label>
                                    <input
                                        type="text"
                                        className="form-control medicalinput"
                                        id="symptoms"
                                        name="symptoms_if_any"
                                        placeholder="Enter symptoms"
                                        value={bmiData.symptoms_if_any}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label htmlFor="remark" className="form-label medicallabel">Remark</label>
                                    <input
                                        type="text"
                                        className="form-control medicalinput"
                                        id="remark"
                                        name="remark"
                                        placeholder="Enter remark"
                                        value={bmiData.remark}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

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
                                    checked={referredToSpecialist === 1}
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
                </div>
            </div>

            <div className="row">
                <div className="col-md-12">
                    <button type="button" className="btn btn-sm btnbmivital" onClick={handleSubmit}>Accept</button>
                </div>
            </div>
        </div>
    )
}

export default BmiVital
