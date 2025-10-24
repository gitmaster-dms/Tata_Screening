import React from 'react'
import './Child.css'

const Childview = (props) => {

    const citizendata = props.data;

    return (
        <div className="backcolor">
            <div class="content">
                <div class="content-header">
                    <div class="container">
                        <form >
                            <div className="row wholebody">
                                <div className="col-md-6">
                                    <div className="card carddetailing">
                                        <div className='row'>
                                            <h5 className='childdetails'>CITIZEN DETAILS</h5>
                                            <div className="element"></div>
                                        </div>

                                        <div className='row contentincard'>
                                            <div className='col-md-8'>
                                                <label for="childName" class="visually-hidden inputfiledss">Citizen Name</label>
                                                <input type="text" class="form-control inputtype"
                                                    placeholder="Enter Name"
                                                    name="name"
                                                    value={citizendata.name}
                                                />
                                            </div>

                                            <div class="col-md-4">
                                                <label for="blood_groups" class="visually-hidden inputfiledss">Blood Group</label>
                                                <select
                                                    class='form-control inputtype'
                                                    name='blood_groups'
                                                    id='outlined-select'
                                                    value={citizendata.blood_groups}
                                                >
                                                    <option value="">{citizendata.blood_groups}</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div class="row contentincard">
                                            <div class="col-md-6">
                                                <label class="visually-hidden inputfiledss" id="age">Date of Birth</label>
                                                <input type="date" class="form-control inputtype" id="dob" name="dob" placeholder="Password" value={citizendata.dob}
                                                />
                                            </div>

                                            <div class="col-md-2">
                                                <label for="year" class='visually-hidden inputfiledss'>Year</label>
                                                <input class="form-control inputtype date" id="year" placeholder="Year" name="year" value={citizendata.year} />
                                            </div>

                                            <div class="col-md-2">
                                                <label for="months" class='visually-hidden inputfiledss'>Months</label>
                                                <input class="form-control inputtype date" id="months" placeholder="months" name="months" value={citizendata.months} />
                                            </div>

                                            <div class="col-md-2">
                                                <label for="days" class='visually-hidden inputfiledss'>Days</label>
                                                <input class="form-control inputtype date" id="days" placeholder="days" name="days" value={citizendata.days} />
                                            </div>

                                        </div>

                                        <div className='row contentincard'>
                                            <div className='col-md-6 mb-3'>
                                                <label for="aadhar_id" class="visually-hidden inputfiledss">Aadhar ID Number</label>
                                                <input type="text" class="form-control inputtype" id="aadhar_id"
                                                    placeholder="Enter Aadhar"
                                                    name="aadhar_id"
                                                    value={citizendata.aadhar_id}
                                                />
                                            </div>

                                            <div class="col-md-3">
                                                <label for="Class" class="visually-hidden inputfiledss">Class</label>
                                                <select
                                                    class='form-control inputtype'
                                                    name='class_name'
                                                    id='outlined-select'
                                                    value={citizendata.class_name}
                                                >
                                                    <option value="">{citizendata.class_name}</option>
                                                </select>
                                            </div>

                                            <div class="col-md-3">
                                                <label for="Class" class="visually-hidden inputfiledss">Division</label>
                                                <select
                                                    class='form-control inputtype'
                                                    name='division'
                                                    id='outlined-select'
                                                    value={citizendata.division_name}
                                                >
                                                    <option selected>{citizendata.division_name}</option>
                                                </select>
                                            </div>
                                        </div>

                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="card carddetailing1">
                                        <div className='row'>
                                            <h5 className='childdetails'>FAMILY INFORMATION</h5>
                                            <div className="element1"></div>
                                        </div>

                                        <div className='row contentincard'>
                                            <div className='col-md-6'>
                                                <label for="Father" class="visually-hidden inputfiledss">Father Name</label>
                                                <input type="text"
                                                    class="form-control inputtype"
                                                    id="Father"
                                                    placeholder="Enter Name"
                                                    name="father_name"
                                                    value={citizendata.father_name} />
                                            </div>

                                            <div className='col-md-6'>
                                                <label for="Mother" class="visually-hidden inputfiledss">Mother Name</label>
                                                <input type="text"
                                                    class="form-control inputtype"
                                                    id="Mother"
                                                    placeholder="Enter Name"
                                                    name="mother_name"
                                                    value={citizendata.mother_name} />
                                            </div>

                                            <div className='col-md-6'>
                                                <label for="Occupation" class="visually-hidden inputfiledss">Occupation of Father</label>
                                                <input type="text"
                                                    class="form-control inputtype"
                                                    id="Occupation"
                                                    placeholder="Enter Occupation"
                                                    name="occupation_of_father"
                                                    value={citizendata.occupation_of_father} />
                                            </div>

                                            <div className='col-md-6'>
                                                <label for="Occupation" class="visually-hidden inputfiledss">Occupation of Mother</label>
                                                <input type="text"
                                                    class="form-control inputtype"
                                                    id="Occupation"
                                                    placeholder="Enter Occupation"
                                                    name="occupation_of_mother"
                                                    value={citizendata.occupation_of_mother} />
                                            </div>

                                            <div className='col-md-6 mb-3'>
                                                <label for="child" class="visually-hidden inputfiledss">Contact Number</label>
                                                <input type="text" class="form-control inputtype"
                                                    id="child" placeholder="Enter Mobile Number"
                                                    name="parents_mobile"
                                                    value={citizendata.parents_mobile} />
                                            </div>

                                            {/* <div className='col-md-6 mb-3'>
                                                <label for="Gender" class="visually-hidden inputfiledss">Siblings Count</label>
                                                <select
                                                    class='form-control inputtype'
                                                    name='sibling_count'
                                                    id='outlined-select'
                                                    value={citizendata.sibling_count}
                                                >
                                                    <option value="">{citizendata.sibling_count}</option>
                                                </select>
                                            </div> */}

                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="card carddetailing">

                                        <div className='row'>
                                            <h5 className='childdetails'>GROWTH MONITORING</h5>
                                            <div className="element3"></div>
                                        </div>

                                        <div className='row contentincard'>
                                            <div className='col-md-4'>
                                                <label for="Height" class="visually-hidden inputfiledss">Height</label>
                                                <input type="text" class="form-control inputtype" id="Height"
                                                    placeholder="Enter Height"
                                                    name="height"
                                                    value={citizendata.height} />
                                            </div>

                                            <div className='col-md-4'>
                                                <label for="Weight" class="visually-hidden inputfiledss">Weight</label>
                                                <input type="text" class="form-control inputtype"
                                                    id="Weight"
                                                    placeholder="Enter Weight"
                                                    name="weight"
                                                    value={citizendata.weight} />
                                            </div>

                                            <div className='col-md-4'>
                                                <label for="wt" class="visually-hidden inputfiledss">Weight for Age</label>
                                                <input type="text" class="form-control inputtype"
                                                    id="weight for age"
                                                    placeholder="Weight for Age"
                                                    name="weight_for_age"
                                                    value={citizendata.weight_for_age} />
                                            </div>

                                            <div className='col-md-4'>
                                                <label for="ht" class="visually-hidden inputfiledss">Height for Age</label>
                                                <input type="text" class="form-control inputtype"
                                                    id="height for age"
                                                    placeholder="height for age"
                                                    name="height_for_age"
                                                    value={citizendata.height_for_age} />
                                            </div>

                                            <div className='col-md-4'>
                                                <label for="sam" class="visually-hidden inputfiledss">BMI</label>
                                                <input type="text"
                                                    class="form-control inputtype"
                                                    id="bmi"
                                                    name="bmi"
                                                    value={citizendata.bmi} />
                                            </div>

                                            <div className='col-md-4'>
                                                <label for="wt ht" class="visually-hidden inputfiledss">Weight for Height</label>
                                                <input type="text"
                                                    class="form-control inputtype"
                                                    id="weight for height"
                                                    placeholder="Weight for height"
                                                    name="weight_for_height"
                                                    value={citizendata.weight_for_height} />
                                            </div>

                                            <div className='col-md-4 mb-3'>
                                                <label for="arm" class="visually-hidden inputfiledss">Arm Size</label>
                                                <input type="text"
                                                    class="form-control inputtype"
                                                    id="arm"
                                                    placeholder="Enter Arm Size"
                                                    name="arm_size"
                                                    value={citizendata.arm_size} />
                                            </div>

                                            <div className='col-md-8 mb-3'>
                                                <label for="symtoms" class="visually-hidden inputfiledss">Symptoms if any</label>
                                                <input type="text"
                                                    class="form-control inputtype"
                                                    id="symtoms"
                                                    placeholder="Add symptoms"
                                                    name="symptoms"
                                                    value={citizendata.symptoms} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="card carddetailing1">
                                        <div className='row'>
                                            <h5 className='childdetails'>ADDRESS</h5>
                                            <div className="element4"></div>

                                        </div>

                                        <div className='row contentincard'>
                                            <div className='col-md-6'>
                                                <label for="state" class="visually-hidden inputfiledss">State</label>
                                                <select
                                                    class='form-control inputtype'
                                                    name='state'
                                                >
                                                    <option selected>{citizendata.state_name}</option>
                                                </select>
                                            </div>

                                            <div className='col-md-6'>
                                                <label for="district" class="visually-hidden inputfiledss">District</label>
                                                <select
                                                    class='form-control inputtype'
                                                    name='district'
                                                    id='outlined-select'
                                                >
                                                    <option selected>
                                                        {citizendata.district_name}
                                                    </option>
                                                </select>
                                            </div>

                                            <div className='col-md-6'>
                                                <label for="Gender" class="visually-hidden inputfiledss">Block</label>
                                                <select
                                                    class='form-control inputtype'
                                                    name='tehsil'
                                                    id='outlined-select'
                                                >
                                                    <option selected
                                                    >
                                                        {citizendata.tehsil_name}
                                                    </option>
                                                </select>
                                            </div>

                                            <div className='col-md-6'>
                                                <label htmlFor="source_name" className="visually-hidden inputfiledss">Institution Name</label>
                                                <select
                                                    className='form-control inputtype'
                                                    name='source_name'
                                                    id='outlined-select'
                                                >
                                                    <option selected>
                                                        {citizendata.source_name_name}
                                                    </option>
                                                </select>
                                            </div>

                                            <div className='col-md-4'>
                                                <label for="Pincode" class="visually-hidden inputfiledss">Pincode</label>
                                                <input type="text" class="form-control inputtype"
                                                    id="Pincode" placeholder="Enter Pincode"
                                                    name="pincode"
                                                    value={citizendata.pincode}
                                                />
                                            </div>

                                            <div className='col-md-8 mb-3'>
                                                <label for="address" class="visually-hidden inputfiledss">Address</label>
                                                <input type="text" class="form-control inputtype"
                                                    id="address" placeholder="Enter address"
                                                    name="address"
                                                    value={citizendata.address} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Childview;


