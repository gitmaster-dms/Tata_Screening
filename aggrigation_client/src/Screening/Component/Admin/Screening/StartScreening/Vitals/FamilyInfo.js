import React, { useState, useEffect } from 'react'
import './FamilyInfo.css'

const FamilyInfo = ({ citizensPkId, pkid, fetchVital, selectedName, onAcceptClick }) => {

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
    console.log(userID);
    const accessToken = localStorage.getItem('token');

    const source = localStorage.getItem('source');

    const Port = process.env.REACT_APP_API_KEY;
    const [familyData, setFamilyData] = useState({
        father_name: "",
        mother_name: "",
        occupation_of_father: "",
        occupation_of_mother: "",
        parents_mobile: "",
        sibling_count: "",
        child_count: null,
        spouse_name: null,
        marital_status: "",

        /// new fields
        emergency_fullname: '',
        emergency_gender: '',
        emergency_contact: '',
        emergency_email: '',
        relationship_with_employee: '',
        emergency_address: '',
        emergency_prefix: '',
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${Port}/Screening/citizen_family_info_get/${pkid}/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });
                if (!response.ok) {
                    throw new Error(`Failed to fetch data. Status: ${response.status}`);
                }

                const familyDataFromApi = await response.json();
                const familyData = familyDataFromApi[0];
                setFamilyData(familyData);
                console.log('Family Idddddd:', familyData?.citizen_id);
                setUpdateId(familyData?.citizen_id)
            } catch (error) {
                console.error('Error fetching Family data', error);
            }
        };
        fetchData();
    }, [citizensPkId]);

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
            const response = await fetch(`${Port}/Screening/citizen_family_info_put/${citizen_id}/`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json', // Ensure correct content type
                },
                body: JSON.stringify({
                    citizen_id: familyData.citizen_id,
                    schedule_id: familyData.schedule_id,
                    father_name: familyData.citizen_info.father_name,
                    mother_name: familyData.citizen_info.mother_name,
                    occupation_of_father: familyData.citizen_info.occupation_of_father,
                    occupation_of_mother: familyData.citizen_info.occupation_of_mother,
                    parents_mobile: familyData.citizen_info.parents_mobile,
                    sibling_count: familyData.citizen_info.sibling_count,
                    form_submit: confirmationStatus,
                    child_count: familyData.citizen_info.child_count,
                    spouse_name: familyData.citizen_info.spouse_name,
                    marital_status: familyData.citizen_info.marital_status,
                    added_by: userID,
                    modify_by: userID,


                    // Include emergency information here
                    emergency_fullname: familyData.citizen_info.emergency_fullname,
                    emergency_gender: familyData.citizen_info.emergency_gender,
                    emergency_contact: familyData.citizen_info.emergency_contact,
                    emergency_email: familyData.citizen_info.emergency_email,
                    relationship_with_employee: familyData.citizen_info.relationship_with_employee,
                    emergency_address: familyData.citizen_info.emergency_address,
                    emergency_prefix: familyData.citizen_info.emergency_prefix,
                }),
            });

            if (response.status === 200) {
                const updatedfamilyData = { ...familyData, };
                setFamilyData(updatedfamilyData);
                console.log(updatedfamilyData, 'Data updated successfully');
                // onAcceptClick(nextName);
                if (nextName) {
                    onAcceptClick(nextName);
                } else {
                    console.log('Next Vital not found. Staying on the same page.');
                }
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
        const isConfirmed = window.confirm('Submit Family Info Form');
        const confirmationStatus = isConfirmed ? 'True' : 'False';

        if (updateId) {
            if (isConfirmed) {
                await updateDataInDatabase(updateId, confirmationStatus);
            } else {
                console.log('Form submission cancelled');
            }
        }
        console.log("Accept button clicked");
    };

    return (
        <div>
            <div>
                <div className="row backdesign">
                    <div className="col-md-12">
                        <div className="card bmicard">
                            <div className="row">
                                <div className="col-md-4">
                                    <h6 className='mt-1 familyTital'>
                                        {source === '5' ? 'EMERGENCY INFORMATION' : 'FAMILY INFORMATION'}
                                    </h6>
                                </div>
                                <div className="col-md-5 ml-auto">
                                    <div class="progress-barbmi"></div>
                                </div>
                            </div>
                        </div>

                        {/* <div className="card grothcardmonitor">
                            <div className="row">
                                <div className="col-md-12">
                                    <h6 className="BMITitle">EMERGENCY INFORMATION</h6>
                                    <div className="childdetailelement"></div>
                                </div>
                            </div>

                            <div className="row paddingwhole">
                                <div className="col-md-6">
                                    <label for="childName" class="visually-hidden childvitaldetails">Father Name</label>
                                    <input type="text" class="form-control childvitalinput" placeholder="Enter Name"
                                        value={familyData?.citizen_info?.father_name}
                                        onInput={(e) => {
                                            e.target.value = e.target.value.replace(/[0-9]/, '');
                                        }}
                                        onChange={(e) => setFamilyData({ ...familyData, citizen_info: { ...familyData.citizen_info, father_name: e.target.value } })}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label for="childName" class="visually-hidden childvitaldetails">Mother Name</label>
                                    <input type="text" class="form-control childvitalinput" placeholder="Enter Name"
                                        value={familyData?.citizen_info?.mother_name}
                                        onInput={(e) => {
                                            e.target.value = e.target.value.replace(/[0-9]/, '');
                                        }}
                                        onChange={(e) => setFamilyData({ ...familyData, citizen_info: { ...familyData.citizen_info, mother_name: e.target.value } })} />
                                </div>
                            </div>

                            <div className="row paddingwhole">
                                <div className="col-md-6">
                                    <label for="childName" class="visually-hidden childvitaldetails">Occupation of Father</label>
                                    <input type="text" class="form-control childvitalinput" placeholder="Enter Name"
                                        value={familyData?.citizen_info?.occupation_of_father}
                                        onChange={(e) => setFamilyData({ ...familyData, citizen_info: { ...familyData.citizen_info, occupation_of_father: e.target.value } })}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label for="childName" class="visually-hidden childvitaldetails">Occupation of Mother</label>
                                    <input type="text" class="form-control childvitalinput" placeholder="Enter Name"
                                        value={familyData?.citizen_info?.occupation_of_mother}
                                        onChange={(e) => setFamilyData({ ...familyData, citizen_info: { ...familyData.citizen_info, occupation_of_mother: e.target.value } })}
                                    />
                                </div>
                            </div>

                            <div className="row paddingwhole mb-3">
                                <div className="col-md-6">
                                    <label for="childName" class="visually-hidden childvitaldetails">Parents Mobile Number</label>
                                    <input type="text" class="form-control childvitalinput" placeholder="Enter Name"
                                        value={familyData?.citizen_info?.parents_mobile}
                                        onInput={(e) => {
                                            if (e.target.value.length > 13) {
                                                e.target.value = e.target.value.slice(0, 13);
                                            }
                                        }}
                                        onChange={(e) => setFamilyData({ ...familyData, citizen_info: { ...familyData.citizen_info, parents_mobile: e.target.value } })}
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label for="childName" class="visually-hidden childvitaldetails">Siblings Count</label>
                                    <select class="form-control childvitalinput" aria-label="Default select example"
                                        value={familyData?.citizen_info?.sibling_count}
                                        onChange={(e) => setFamilyData({ ...familyData, citizen_info: { ...familyData.citizen_info, sibling_count: e.target.value } })}
                                    >
                                        <option selected>select</option>
                                        <option value="0">0</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                    </select>
                                </div>

                                <div className="col-md-6">
                                    <label for="childName" class="visually-hidden childvitaldetails">Employee's Marital Status</label>
                                    <select class="form-control childvitalinput" aria-label="Default select example"
                                        value={familyData?.citizen_info?.marital_status}
                                        onChange={(e) => setFamilyData({ ...familyData, citizen_info: { ...familyData.citizen_info, marital_status: e.target.value } })}
                                    >
                                        <option selected>select</option>
                                        <option value='Married'>Married</option>
                                        <option value='Unmarried'>Unmarried</option>
                                        <option value='Widow'>Widow/Widower</option>
                                    </select>
                                </div>

                                <div className="col-md-6">
                                    <label for="childName" class="visually-hidden childvitaldetails">Children Count</label>
                                    <select class="form-control childvitalinput" aria-label="Default select example"
                                        value={familyData?.citizen_info?.child_count}
                                        onChange={(e) => setFamilyData({ ...familyData, citizen_info: { ...familyData.citizen_info, child_count: e.target.value } })}
                                    >
                                        <option selected>select</option>
                                        <option value="0">0</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                    </select>
                                </div>

                                <div className="col-md-6">
                                    <label for="childName" class="visually-hidden childvitaldetails">Employee's Spouse Name</label>
                                    <input type="text" class="form-control childvitalinput" placeholder="Enter Name"
                                        value={familyData?.citizen_info?.spouse_name}
                                        onChange={(e) => setFamilyData({ ...familyData, citizen_info: { ...familyData.citizen_info, spouse_name: e.target.value } })}
                                    />
                                </div>
                            </div>

                        </div> */}

                        {
                            source === '5' ?
                                (
                                    <div className="card grothcardmonitor">
                                        <div className="row">
                                            <div className="col-md-12">
                                                <h6 className="BMITitle">EMERGENCY INFORMATION</h6>
                                                <div className="childdetailelement"></div>
                                            </div>
                                        </div>

                                        <div className="row paddingwhole">
                                            <div className="col-md-2">
                                                <label for="childName" class="visually-hidden childvitaldetails">Prefix</label>
                                                <select class="form-control childvitalinput" aria-label="Default select example"
                                                    value={familyData?.citizen_info?.emergency_prefix}
                                                    onChange={(e) => setFamilyData({ ...familyData, citizen_info: { ...familyData.citizen_info, emergency_prefix: e.target.value } })}
                                                >
                                                    <option selected>select</option>
                                                    <option value="Mr">Mr.</option>
                                                    <option value="Ms">Ms.</option>
                                                    <option value="Mrs">Mrs.</option>
                                                    <option value="Adv">Adv.</option>
                                                    <option value="Col">Col.</option>
                                                    <option value="Dr">Dr.</option>
                                                </select>
                                            </div>

                                            <div className="col-md-3">
                                                <label for="childName" class="visually-hidden childvitaldetails">Father Name</label>
                                                <input type="text" class="form-control childvitalinput" placeholder="Enter Name"
                                                    value={familyData?.citizen_info?.father_name}
                                                    onInput={(e) => {
                                                        e.target.value = e.target.value.replace(/[0-9]/, '');
                                                    }}
                                                    onChange={(e) => setFamilyData({ ...familyData, citizen_info: { ...familyData.citizen_info, father_name: e.target.value } })}
                                                />
                                            </div>

                                            <div className="col-md-4">
                                                <label for="childName" class="visually-hidden childvitaldetails">Full Name</label>
                                                <input type="text" class="form-control childvitalinput" placeholder="Enter Full Name"
                                                    value={familyData?.citizen_info?.emergency_fullname}
                                                    onInput={(e) => {
                                                        e.target.value = e.target.value.replace(/[0-9]/, '');
                                                    }}
                                                    onChange={(e) => setFamilyData({ ...familyData, citizen_info: { ...familyData.citizen_info, emergency_fullname: e.target.value } })} />
                                            </div>

                                            <div className="col-md-3">
                                                <label for="childName" class="visually-hidden childvitaldetails">Gender</label>
                                                <select class="form-control childvitalinput" aria-label="Default select example"
                                                    value={familyData?.citizen_info?.emergency_gender}
                                                    onChange={(e) => setFamilyData({ ...familyData, citizen_info: { ...familyData.citizen_info, emergency_gender: e.target.value } })}
                                                >
                                                    <option selected>select</option>
                                                    <option value="male">Male</option>
                                                    <option value="female">Female</option>
                                                    <option value="other">Other</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="row paddingwhole">
                                            <div className="col-md-6">
                                                <label for="childName" class="visually-hidden childvitaldetails">Emergency Conatct</label>
                                                <input type="text" class="form-control childvitalinput" placeholder="Enter Contact"
                                                    value={familyData?.citizen_info?.emergency_contact}
                                                    onChange={(e) => setFamilyData({ ...familyData, citizen_info: { ...familyData.citizen_info, emergency_contact: e.target.value } })}
                                                />
                                            </div>

                                            <div className="col-md-6">
                                                <label for="childName" class="visually-hidden childvitaldetails">Email ID</label>
                                                <input type="text" class="form-control childvitalinput" placeholder="Enter Mail ID"
                                                    value={familyData?.citizen_info?.emergency_email}
                                                    onChange={(e) => setFamilyData({ ...familyData, citizen_info: { ...familyData.citizen_info, emergency_email: e.target.value } })}
                                                />
                                            </div>
                                        </div>

                                        <div className="row paddingwhole mb-3">
                                            <div className="col-md-6">
                                                <label for="childName" class="visually-hidden childvitaldetails">Relationship with Employee</label>
                                                <select class="form-control childvitalinput" aria-label="Default select example"
                                                    value={familyData?.citizen_info?.relationship_with_employee}
                                                    onChange={(e) => setFamilyData({ ...familyData, citizen_info: { ...familyData.citizen_info, relationship_with_employee: e.target.value } })}
                                                >
                                                    <option>Select</option>
                                                    <option value="father">Father</option>
                                                    <option value="mother">Mother</option>
                                                    <option value="brother">Brother</option>
                                                    <option value="sister">Sister</option>
                                                    <option value="spouse">Spouse</option>
                                                    <option value="son">Son</option>
                                                    <option value="daughter">Daughter</option>
                                                </select>
                                            </div>

                                            <div className="col-md-6">
                                                <label for="childName" class="visually-hidden childvitaldetails">Present Address</label>
                                                <input type="text" class="form-control childvitalinput" placeholder="Enter Address"
                                                    value={familyData?.citizen_info?.emergency_address}
                                                    onChange={(e) => setFamilyData({ ...familyData, citizen_info: { ...familyData.citizen_info, emergency_address: e.target.value } })}
                                                />
                                            </div>
                                        </div>

                                    </div>
                                ) :
                                ////// School data
                                (

                                    <div className="card grothcardmonitor">
                                        <div className="row">
                                            <div className="col-md-12">
                                                <h6 className="BMITitle">EMERGENCY INFORMATION</h6>
                                                <div className="childdetailelement"></div>
                                            </div>
                                        </div>

                                        <div className="row paddingwhole">
                                            <div className="col-md-6">
                                                <label for="childName" class="visually-hidden childvitaldetails">Father Name</label>
                                                <input type="text" class="form-control childvitalinput" placeholder="Enter Name"
                                                    value={familyData?.citizen_info?.father_name}
                                                    onInput={(e) => {
                                                        e.target.value = e.target.value.replace(/[0-9]/, '');
                                                    }}
                                                    onChange={(e) => setFamilyData({ ...familyData, citizen_info: { ...familyData.citizen_info, father_name: e.target.value } })}
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label for="childName" class="visually-hidden childvitaldetails">Mother Name</label>
                                                <input type="text" class="form-control childvitalinput" placeholder="Enter Name"
                                                    value={familyData?.citizen_info?.mother_name}
                                                    onInput={(e) => {
                                                        e.target.value = e.target.value.replace(/[0-9]/, '');
                                                    }}
                                                    onChange={(e) => setFamilyData({ ...familyData, citizen_info: { ...familyData.citizen_info, mother_name: e.target.value } })} />
                                            </div>
                                        </div>

                                        <div className="row paddingwhole">
                                            <div className="col-md-6">
                                                <label for="childName" class="visually-hidden childvitaldetails">Occupation of Father</label>
                                                <input type="text" class="form-control childvitalinput" placeholder="Enter Name"
                                                    value={familyData?.citizen_info?.occupation_of_father}
                                                    onChange={(e) => setFamilyData({ ...familyData, citizen_info: { ...familyData.citizen_info, occupation_of_father: e.target.value } })}
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label for="childName" class="visually-hidden childvitaldetails">Occupation of Mother</label>
                                                <input type="text" class="form-control childvitalinput" placeholder="Enter Name"
                                                    value={familyData?.citizen_info?.occupation_of_mother}
                                                    onChange={(e) => setFamilyData({ ...familyData, citizen_info: { ...familyData.citizen_info, occupation_of_mother: e.target.value } })}
                                                />
                                            </div>
                                        </div>

                                        <div className="row paddingwhole mb-3">
                                            <div className="col-md-6">
                                                <label for="childName" class="visually-hidden childvitaldetails">Parents Mobile Number</label>
                                                <input type="text" class="form-control childvitalinput" placeholder="Enter Name"
                                                    value={familyData?.citizen_info?.parents_mobile}
                                                    onInput={(e) => {
                                                        if (e.target.value.length > 13) {
                                                            e.target.value = e.target.value.slice(0, 13);
                                                        }
                                                    }}
                                                    onChange={(e) => setFamilyData({ ...familyData, citizen_info: { ...familyData.citizen_info, parents_mobile: e.target.value } })}
                                                />
                                            </div>

                                            <div className="col-md-6">
                                                <label for="childName" class="visually-hidden childvitaldetails">Siblings Count</label>
                                                <select class="form-control childvitalinput" aria-label="Default select example"
                                                    value={familyData?.citizen_info?.sibling_count}
                                                    onChange={(e) => setFamilyData({ ...familyData, citizen_info: { ...familyData.citizen_info, sibling_count: e.target.value } })}
                                                >
                                                    <option selected>select</option>
                                                    <option value="0">0</option>
                                                    <option value="1">1</option>
                                                    <option value="2">2</option>
                                                    <option value="3">3</option>
                                                    <option value="4">4</option>
                                                </select>
                                            </div>

                                            <div className="col-md-6">
                                                <label for="childName" class="visually-hidden childvitaldetails">Employee's Marital Status</label>
                                                <select class="form-control childvitalinput" aria-label="Default select example"
                                                    value={familyData?.citizen_info?.marital_status}
                                                    onChange={(e) => setFamilyData({ ...familyData, citizen_info: { ...familyData.citizen_info, marital_status: e.target.value } })}
                                                >
                                                    <option selected>select</option>
                                                    <option value='Married'>Married</option>
                                                    <option value='Unmarried'>Unmarried</option>
                                                    <option value='Widow'>Widow/Widower</option>
                                                </select>
                                            </div>

                                            <div className="col-md-6">
                                                <label for="childName" class="visually-hidden childvitaldetails">Children Count</label>
                                                <select class="form-control childvitalinput" aria-label="Default select example"
                                                    value={familyData?.citizen_info?.child_count}
                                                    onChange={(e) => setFamilyData({ ...familyData, citizen_info: { ...familyData.citizen_info, child_count: e.target.value } })}
                                                >
                                                    <option selected>select</option>
                                                    <option value="0">0</option>
                                                    <option value="1">1</option>
                                                    <option value="2">2</option>
                                                    <option value="3">3</option>
                                                    <option value="4">4</option>
                                                </select>
                                            </div>

                                            <div className="col-md-6">
                                                <label for="childName" class="visually-hidden childvitaldetails">Employee's Spouse Name</label>
                                                <input type="text" class="form-control childvitalinput" placeholder="Enter Name"
                                                    value={familyData?.citizen_info?.spouse_name}
                                                    onChange={(e) => setFamilyData({ ...familyData, citizen_info: { ...familyData.citizen_info, spouse_name: e.target.value } })}
                                                />
                                            </div>
                                        </div>

                                    </div>
                                )
                        }

                        <div className="row">
                            <div type="button" className="btn btn-sm submitvital" onClick={handleSubmit}>Accept</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FamilyInfo
