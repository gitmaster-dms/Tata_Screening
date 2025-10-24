import React, { useState, useEffect } from 'react';
import '../Citizenforms/Source/Corporate.css'

const Corporate = (props) => {

    const coporateViewData = props.data;
    console.log('formviewdata', coporateViewData);

    return (
        <div className="container ml-2">
            <form>
                <div className="row cardsetup">
                    <div className="col-md-6">
                        <div className="card card1corporate">
                            <div className="row">
                                <h5 className='employeetitle'>Employee Details</h5>
                                <div className="elementemployee1"></div>
                            </div>

                            <div className="row formspaceemployee">
                                <div className="col-md-3">
                                    <label className="form-label corporatelabel">Prefix</label>
                                    <select className="form-control corporateinput"
                                        value={coporateViewData.prefix}
                                        disabled
                                    >
                                        <option>Prefix</option>
                                        <option value="Mr">Mr.</option>
                                        <option value="Ms">Ms.</option>
                                        <option value="Mrs">Mrs.</option>
                                        <option value="Adv">Adv.</option>
                                        <option value="Col">Col.</option>
                                        <option value="Dr">Dr.</option>
                                    </select>
                                </div>

                                <div className="col-md-5">
                                    <label className="form-label corporatelabel">Employee Name</label>
                                    <input className="form-control corporateinput" type="text"
                                        value={coporateViewData.name}
                                        readOnly
                                    />
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label corporatelabel">Blood Group</label>
                                    <select className="form-control corporateinput"
                                        value={coporateViewData.blood_groups}
                                        disabled
                                    >
                                        <option>Select Group</option>
                                        <option>A+</option>
                                        <option>A-</option>
                                        <option>B+</option>
                                        <option>B-</option>
                                        <option>AB+</option>
                                        <option>AB-</option>
                                        <option>O+</option>
                                        <option>O-</option>
                                    </select>
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label corporatelabel">Date of Birth</label>
                                    <input type="date" className="form-control corporateinput"
                                        value={coporateViewData.dob}
                                        readOnly
                                    />
                                </div>

                                <div className="col-md-2">
                                    <label className="form-label corporatelabel">Year</label>
                                    <input className="form-control corporateinput" readOnly
                                        value={coporateViewData.year}
                                    />
                                </div>

                                <div className="col-md-2">
                                    <label className="form-label corporatelabel">Month</label>
                                    <input className="form-control corporateinput" readOnly
                                        value={coporateViewData.months}
                                    />
                                </div>

                                <div className="col-md-2">
                                    <label className="form-label corporatelabel">Days</label>
                                    <input className="form-control corporateinput" readOnly
                                        value={coporateViewData.days}
                                    />
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label corporatelabel">Aadhar ID</label>
                                    <input type="number" className="form-control corporateinput"
                                        value={coporateViewData.aadhar_id} readOnly
                                    />
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label corporatelabel">Email ID</label>
                                    <input type="email" className="form-control corporateinput"
                                        value={coporateViewData.email_id} readOnly
                                    />
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label corporatelabel">Employee Mobile Number</label>
                                    <input type="number" className="form-control corporateinput"
                                        value={coporateViewData.emp_mobile_no} readOnly
                                    />
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label corporatelabel">Department</label>
                                    <select className="form-control corporateinput">
                                        <option selected>
                                            {coporateViewData.department_name}
                                        </option>
                                    </select>
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label corporatelabel">Designation</label>
                                    <select className="form-control corporateinput" >
                                        <option selected>
                                            {coporateViewData.designation_name}
                                        </option>
                                    </select>
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label corporatelabel">Employee ID</label>
                                    <input type="number" className="form-control corporateinput"
                                        value={coporateViewData.employee_id} readOnly
                                    />
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label corporatelabel">DOJ</label>
                                    <input type="date" className="form-control corporateinput"
                                        value={coporateViewData.doj} readOnly />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ////// previous wise changes  */}
                    {/* <div className="col-md-6">
                        <div className="card card2corporate ml-3" style={{ height: '303px' }}>

                            <div className="row">
                                <h5 className='employeetitle'>Family Information</h5>
                                <div className="elementemployee2"></div>
                            </div>

                            <div className="row formspaceemployee">
                                <div className="col-md-6">
                                    <label className="form-label corporatelabel">Father Name</label>
                                    <input className="form-control corporateinput" type="text"
                                        value={coporateViewData.father_name} />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label corporatelabel">Mother Name</label>
                                    <input className="form-control corporateinput" type="text"
                                        value={coporateViewData.mother_name} />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label corporatelabel">Occupation of Father</label>
                                    <input className="form-control corporateinput"
                                        value={coporateViewData.occupation_of_father} />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label corporatelabel">Occupation of Mother</label>
                                    <input className="form-control corporateinput"
                                        value={coporateViewData.occupation_of_mother} />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label corporatelabel">Employee's Marital Status</label>
                                    <select className="form-control corporateinput" >
                                        <option selected>
                                            {coporateViewData.marital_status}
                                        </option>
                                    </select>
                                </div>

                                {
                                    coporateViewData.marital_status === 'Married' && (
                                        <div className="col-md-6">
                                            <label className="form-label corporatelabel">Employee's Spouse Name</label>
                                            <input className="form-control corporateinput" type='text'
                                                value={coporateViewData.spouse_name} />
                                        </div>
                                    )
                                }

                                {
                                    coporateViewData.marital_status === 'Unmarried' && (
                                        <div className="col-md-6">
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <label className="form-label corporatelabel">Siblings Count</label>
                                                    <select className="form-control corporateinput"
                                                    >
                                                        <option selected>
                                                            {coporateViewData.sibling_count}
                                                        </option>
                                                    </select>
                                                </div>

                                            </div>
                                        </div>
                                    )
                                }

                                {
                                    (coporateViewData.marital_status === 'Widow' || coporateViewData.marital_status === 'Married') && (
                                        <div className="col-md-6">
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <label className="form-label corporatelabel">Children Count</label>
                                                    <select className="form-control corporateinput"
                                                    >
                                                        <option selected>
                                                            {coporateViewData.child_count}
                                                        </option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }

                                <div className="col-md-6">
                                    <label className="form-label corporatelabel">Parents Contact Number</label>
                                    <input type="number" className="form-control corporateinput"
                                        value={coporateViewData.parents_mobile} />
                                </div>
                            </div>
                        </div>
                    </div> */}
                    {/* previous wise changes end  */}


                    {/* excel sheet wise changes start*/}
                    <div className="col-md-6">
                        <div className="card card2corporate ml-3" style={{ height: '365px' }}>

                            <div className="row">
                                <h5 className='employeetitle'>Emergency Information</h5>
                                <div className="elementemployee2"></div>
                            </div>

                            <div className="row formspaceemployee">
                                <div className="col-md-3">
                                    <label className="form-label corporatelabel">Prefix</label>
                                    <select className="form-control corporateinput"
                                        value={coporateViewData.emergency_prefix}
                                        disabled
                                    >
                                        <option>Prefix</option>
                                        <option value="Mr">Mr.</option>
                                        <option value="Ms">Ms.</option>
                                        <option value="Mrs">Mrs.</option>
                                        <option value="Adv">Adv.</option>
                                        <option value="Col">Col.</option>
                                        <option value="Dr">Dr.</option>
                                    </select>
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label corporatelabel">Full Name</label>
                                    <input className="form-control corporateinput" type="text"
                                        value={coporateViewData.emergency_fullname} readOnly
                                    />
                                </div>

                                <div className="col-md-3">
                                    <label className="form-label corporatelabel">Gender</label>
                                    <select className="form-control corporateinput"
                                        value={coporateViewData.emergency_gender}
                                        disabled
                                    >
                                        <option>Prefix</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label corporatelabel">Emergency Contact Number</label>
                                    <input className="form-control corporateinput"
                                        value={coporateViewData.emergency_contact} readOnly
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label corporatelabel">Email ID</label>
                                    <input className="form-control corporateinput"
                                        value={coporateViewData.emergency_email} readOnly
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label corporatelabel">Parents Contact Number</label>
                                    <select className="form-control corporateinput"
                                        value={coporateViewData.relationship_with_employee}
                                        name='relationship_with_employee'
                                        disabled
                                    >
                                        <option>Relationship with Employee</option>
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
                                    <label className="form-label corporatelabel">Present Address</label>
                                    <input className="form-control corporateinput"
                                        value={coporateViewData.emergency_address} readOnly
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* excel sheet wise changes end*/}

                    <div className="col-md-6 mb-4">
                        <div className="card card1corporate" style={{ height: '93%' }}>

                            <div className="row">
                                <h5 className='employeetitle'>Growth Monitoring</h5>
                                <div className="elementemployee3"></div>
                            </div>

                            <div className="row formspaceemployee">
                                <div className="col-md-4">
                                    <label className="form-label corporatelabel">Height</label>
                                    <input type="number" className="form-control corporateinput"
                                        value={coporateViewData.height} readOnly
                                    />
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label corporatelabel">Weight</label>
                                    <input type="number" className="form-control corporateinput"
                                        value={coporateViewData.weight} readOnly
                                    />
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label corporatelabel">BMI</label>
                                    <input type="text" className="form-control corporateinput" readOnly value={coporateViewData.bmi}
                                    />
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label corporatelabel">Arm Size</label>
                                    <input type="number" className="form-control corporateinput"
                                        value={coporateViewData.arm_size} readOnly
                                    />
                                </div>

                                <div className="col-md-8">
                                    <label className="form-label corporatelabel">Symptoms if any</label>
                                    <input type="text" className="form-control corporateinput"
                                        value={coporateViewData.symptoms} readOnly
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6 mb-4">
                        <div className="card card2corporate ml-3">

                            <div className="row">
                                <h5 className='employeetitle'>Address</h5>
                                <div className="elementemployee4"></div>
                            </div>

                            <div className="row formspaceemployee">
                                <div className="col-md-6">
                                    <label className="form-label corporatelabel">State</label>
                                    <select className="form-control corporateinput">
                                        <option selected>
                                            {coporateViewData.state_name}
                                        </option>
                                    </select>
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label corporatelabel">District</label>
                                    <select className="form-control corporateinput">
                                        <option selected>
                                            {coporateViewData.district_name}
                                        </option>
                                    </select>
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label corporatelabel">Tehsil</label>
                                    <select className="form-control corporateinput">
                                        <option selected>
                                            {coporateViewData.tehsil_name}
                                        </option>
                                    </select>
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label corporatelabel">Source Name</label>
                                    <select className="form-control corporateinput">
                                        <option selected>
                                            {coporateViewData.source_name_name}
                                        </option>
                                    </select>
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label corporatelabel">Address</label>
                                    <input className="form-control corporateinput"
                                        value={coporateViewData.address} readOnly
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label corporatelabel">Address</label>
                                    <input className="form-control corporateinput"
                                        value={coporateViewData.permanant_address} readOnly
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label corporatelabel">Pincode</label>
                                    <input type="number" className="form-control corporateinput"
                                        value={coporateViewData.pincode} readOnly
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label corporatelabel">Site Plant</label>
                                    <input type="text" className="form-control corporateinput"
                                        value={coporateViewData.site_plant} readOnly
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Corporate;
