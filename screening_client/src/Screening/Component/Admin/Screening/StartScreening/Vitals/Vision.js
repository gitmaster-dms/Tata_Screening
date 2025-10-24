import React, { useState, useEffect } from 'react';
import './Vision.css'

const Vision = ({ pkid, citizensPkId, fetchVital, selectedName, onAcceptClick }) => {

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

  const Port = process.env.REACT_APP_API_KEY;
  const accessToken = localStorage.getItem('token');
  const source = localStorage.getItem('source');

  console.log(source, 'fetched source in the vision');
  const userID = localStorage.getItem('userID');
  console.log(userID);

  const userGroup = localStorage.getItem('usergrp');

  useEffect(() => {
    console.log('User Group:', userGroup);
  }, [userGroup]);

  /////////// Field
  const [visionForm, setVisionForm] = useState({
    if_other_commnet: '',
    vision_with_glasses: '',
    vision_without_glasses: '',
    visual_perimetry: '',
    comment: '',
    treatment: '',
    color_blindness: '',
    vision_screening: '',
    vision_screening_comment: '',
    referred_to_surgery: '',
    citizen_pk_id: citizensPkId,

    //// corporate field
    re_near_without_glasses: null,
    re_far_without_glasses: null,
    le_near_without_glasses: null,
    le_far_without_glasses: null,
    re_near_with_glasses: null,
    re_far_with_glasses: null,
    le_near_with_glasses: null,
    le_far_with_glasses: null,
  })

  const [specialist, setSpecialist] = useState(null);
  const [eyeMuscles, setEyeMuscles] = useState('');
  const [referractive, setReferractive] = useState('');

  const handleRadioChange = (event) => {
    const { name, value } = event.target;

    if (name === "reffered_to_specialist") {
      setSpecialist(parseInt(value));
    } else if (name === "eye_muscle_control") {
      setEyeMuscles(value);
    }
    else if (name === "refractive_error") {
      setReferractive(value);
    }
    // else if (name === "eye_muscle_control") {
    //   setEyeMuscles(value);
    // }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setVisionForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {

    const isConfirmed = window.confirm('Submit Vision Form');

    const confirmationStatus = isConfirmed ? 'True' : 'False';

    e.preventDefault();

    const formData = {
      ...visionForm,
      reffered_to_specialist: specialist,
      eye_muscle_control: eyeMuscles,
      refractive_error: referractive,
      citizen_pk_id: citizensPkId,
      form_submit: confirmationStatus,
      added_by: userID,
      modify_by: userID,
    };

    console.log('Form Data:', formData);

    try {
      const response = await fetch(`${Port}/Screening/citizen_vision_info_post/${pkid}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify(formData),
      });


      if (response.status === 201 && response.status === 200) {
        const data = await response.json();
        console.log('Server Response:', data);
      }
    } catch (error) {
      console.error('Error sending data:', error.message);
    }
    // onMoveToMedical('medical');
    onAcceptClick(nextName);
  };

  const fetchDataById = async (pkid) => {
    try {
      const response = await fetch(`${Port}/Screening/citizen_vision_info_get/${pkid}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
      });

      if (response.ok) {
        const data = await response.json();

        // Check if the array has at least one element before accessing properties
        if (Array.isArray(data) && data.length > 0) {
          const visionForm = data[0];

          setVisionForm((prevState) => ({
            ...prevState,
            if_other_commnet: visionForm.if_other_commnet,
            vision_with_glasses: visionForm.vision_with_glasses,
            vision_without_glasses: visionForm.vision_without_glasses,
            visual_perimetry: visionForm.visual_perimetry,
            comment: visionForm.comment,
            treatment: visionForm.treatment,
            color_blindness: visionForm.color_blindness,
            vision_screening: visionForm.vision_screening,
            vision_screening_comment: visionForm.vision_screening_comment,
            referred_to_surgery: visionForm.referred_to_surgery,


            ////// corporate field
            re_near_without_glasses: visionForm.re_near_without_glasses,
            re_far_without_glasses: visionForm.re_far_without_glasses,
            le_near_without_glasses: visionForm.le_near_without_glasses,
            le_far_without_glasses: visionForm.le_far_without_glasses,
            re_near_with_glasses: visionForm.re_near_with_glasses,
            re_far_with_glasses: visionForm.re_far_with_glasses,
            le_near_with_glasses: visionForm.le_near_with_glasses,
            le_far_with_glasses: visionForm.le_far_with_glasses,
          }));

          setSpecialist(visionForm.reffered_to_specialist);
          setEyeMuscles(visionForm.eye_muscle_control.toString());
          setReferractive(visionForm.refractive_error.toString());
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

  const [editMode, setEditMode] = useState(false); // State to track edit mode

  const handleEditClick = () => {
    setEditMode(!editMode); // Toggle edit mode
  };

  return (
    <div>
      <div className="row">
        <div className="col-md-12">
          <div className="card visioncard">
            <div className="row">
              <div className="col-md-7">
                <h5 className="visiontitle">Vision Screening</h5>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-12">
          <form onSubmit={handleSubmit}>
            <div className="card">
              <h5 className="eartitle">Eye</h5>
              {
                source === '1' ?
                  (
                    <>
                      {
                        ['UG-DOCTOR', 'UG-EXPERT', 'UG-SUPERADMIN', 'UG-ADMIN', 'CO-HR'].includes(userGroup) &&
                        (
                          <>
                            <div className='row paddingcolvision'>
                              <div className="col-md-3">
                                <div class="form-check">
                                  <input class="form-check-input checkboxdefault" type="checkbox" value="" id="defaultCheck1 checkboxdefault" />
                                  <label class="form-check-label" for="defaultCheck1">
                                    Exophthalmos
                                  </label>
                                </div>
                              </div>
                              <div className="col-md-3">
                                <div class="form-check">
                                  <input class="form-check-input checkboxdefault" type="checkbox" value="" id="defaultCheck1" />
                                  <label class="form-check-label" for="defaultCheck1">
                                    Squint_nys
                                  </label>
                                </div>
                              </div>
                              <div className="col-md-3">
                                <div class="form-check">
                                  <input class="form-check-input checkboxdefault" type="checkbox" value="" id="defaultCheck1" />
                                  <label class="form-check-label" for="defaultCheck1">
                                    Tagmus
                                  </label>
                                </div>
                              </div>
                              <div className="col-md-3">
                                <div class="form-check">
                                  <input class="form-check-input checkboxdefault" type="checkbox" value="" id="defaultCheck1" />
                                  <label class="form-check-label" for="defaultCheck1">
                                    Other
                                  </label>
                                </div>
                              </div>
                            </div>

                            <div className="row paddingcol1vision">
                              <div className="col-md-12">
                                <label className="visually-hidden remarkvision">If Other/Comment</label>
                                <input className='form-control inputvision'
                                  placeholder='Remark' name="if_other_commnet"
                                  value={visionForm.if_other_commnet}
                                  onChange={handleChange} />
                              </div>
                            </div>
                          </>
                        )
                      }

                      {
                        ['UG-EXPERT', 'UG-SUPERADMIN', 'UG-ADMIN', 'CO-HR'].includes(userGroup) &&
                        (
                          <>
                            <div className="visualllllllll">
                              <h6 className='Acuity'>Visual Acuity test</h6>
                              <div className="row everyrow">
                                <div className="col-md-4">
                                  <label className="visually-hidden labelvision">Vision With Glasses</label>
                                  <select className="form-control visioninput"
                                    onChange={handleChange}
                                    name="vision_with_glasses"
                                    value={visionForm.vision_with_glasses}>
                                    <option>Select</option>
                                    <option value="2">Good</option>
                                    <option value="1">Poor</option>
                                  </select>
                                </div>

                                <div className="col-md-4">
                                  <label className="visually-hidden labelvision">Vision Without Glasses</label>
                                  <select className="form-control visioninput"
                                    onChange={handleChange}
                                    name="vision_without_glasses"
                                    value={visionForm.vision_without_glasses}>
                                    <option>Select</option>
                                    <option value="1">Good</option>
                                    <option value="2">Poor</option>
                                  </select>
                                </div>

                              </div>
                            </div>

                            <div className="row everyrow">
                              <div className="col-md-4">
                                <h6 className='remarklabelreffer mt-1'>Eye Muscle Control</h6>
                              </div>

                              <div className="col-md-2">
                                <div class="form-check">
                                  <input
                                    className="form-check-input inputradio"
                                    type="radio"
                                    id='eye_muscle_control'
                                    name="eye_muscle_control"
                                    value="1"
                                    checked={eyeMuscles === "1"}
                                    onChange={handleRadioChange}
                                  />
                                  <label class="form-check-label" for="flexRadioOralGood">
                                    Good
                                  </label>
                                </div>
                              </div>

                              <div className="col-md-2">
                                <div class="form-check">
                                  <input class="form-check-input inputradio" type="radio"
                                    name="eye_muscle_control"
                                    id='eye_muscle_control'
                                    value="2"
                                    checked={eyeMuscles === "2"}
                                    onChange={handleRadioChange}
                                  />
                                  <label class="form-check-label">
                                    Poor Control
                                  </label>
                                </div>
                              </div>

                              <div className="col-md-4">
                                <div class="form-check">
                                  <input class="form-check-input inputradio" type="radio"
                                    name="eye_muscle_control"
                                    id='eye_muscle_control'
                                    value="3"
                                    checked={eyeMuscles === "3"}
                                    onChange={handleRadioChange} />
                                  <label class="form-check-label" for="flexRadioOralPoor">
                                    Poor Coordination
                                  </label>
                                </div>
                              </div>
                            </div>

                            <div className="row everyrow">
                              <div className="col-md-4">
                                <h6 className='remarklabelreffer mt-1'>Refractive error</h6>
                              </div>

                              <div className="col-md-2">
                                <div class="form-check">
                                  <input
                                    className="form-check-input inputradio"
                                    type="radio"
                                    name="refractive_error"
                                    value="1"
                                    checked={referractive === "1"} onChange={handleRadioChange}
                                  />
                                  <label class="form-check-label" for="flexRadioOralGood">
                                    Yes
                                  </label>
                                </div>
                              </div>

                              <div className="col-md-2">
                                <div class="form-check">
                                  <input class="form-check-input inputradio" type="radio"
                                    name="refractive_error"
                                    value="2"
                                    checked={referractive === "2"} onChange={handleRadioChange}
                                  />
                                  <label class="form-check-label" for="flexRadioOralFair">
                                    No
                                  </label>
                                </div>
                              </div>
                            </div>

                            <div className="row everyrow">
                              <div className="col-md-4">
                                <label className="visually-hidden labelvision">Visual Field Perimetry</label>
                                <input className='form-control form-control-sm visioninput'
                                  name="visual_perimetry"
                                  value={visionForm.visual_perimetry}
                                  onChange={handleChange} />
                              </div>

                              <div className="col-md-4">
                                <label className="visually-hidden labelvision">Comment</label>
                                <input className='form-control form-control-sm visioninput'
                                  name="comment"
                                  value={visionForm.comment}
                                  onChange={handleChange} />
                              </div>

                              <div className="col-md-4">
                                <label className="visually-hidden labelvision">Treatment Given</label>
                                <input className='form-control form-control-sm visioninput'
                                  name="treatment"
                                  value={visionForm.treatment}
                                  onChange={handleChange} />
                              </div>

                            </div>

                            <div className="row everyrow">
                              <div className="col-md-4">
                                <label className="visually-hidden labelvision">Color blindness</label>
                                <select className="form-control visioninput"
                                  onChange={handleChange}
                                  name="color_blindness"
                                  value={visionForm.color_blindness}>
                                  <option>Select</option>
                                  <option value="1">Yes</option>
                                  <option value="2">No</option>
                                </select>
                              </div>

                              <div className="col-md-4">
                                <label className="visually-hidden labelvision">Vision screening</label>
                                <select className="form-control visioninput"
                                  onChange={handleChange}
                                  name="vision_screening"
                                  value={visionForm.vision_screening}>
                                  <option>Select</option>
                                  <option value="1">Hypermertropia</option>
                                  <option value="2">Myopia</option>
                                </select>
                              </div>
                            </div>

                            <div className="row everyrow">
                              <div className="col-md-6">
                                <label className="visually-hidden labelvision">Vision Screening Comment</label>
                                <input className='form-control inputvision'
                                  placeholder='Remark' name="vision_screening_comment"
                                  value={visionForm.vision_screening_comment}
                                  onChange={handleChange} />
                              </div>

                              <div className="col-md-6">
                                <label className="visually-hidden labelvision">Referred to Surgery</label>
                                <select className="form-control visioninput"
                                  onChange={handleChange}
                                  name="referred_to_surgery"
                                  value={visionForm.referred_to_surgery}>
                                  <option>Select</option>
                                  <option value="1">Yes</option>
                                  <option value="2">No</option>
                                </select>
                              </div>
                            </div>

                            <div className="row paddingcol2vision">
                              <div className='col-md-4'>
                                <label className="visually-hidden remarklabelreffer">Reffered To Specialist</label>
                              </div>

                              <div className="col-md-2 ml-2">
                                <div class="form-check">
                                  <input class="form-check-input checkboxdefault"
                                    type="radio"
                                    value={1}
                                    checked={specialist === 1}
                                    onChange={handleRadioChange}
                                    name="reffered_to_specialist" />
                                  <label class="form-check-label" for="flexRadioDefault1">
                                    Yes
                                  </label>
                                </div>
                              </div>

                              <div className="col-md-2">
                                <div class="form-check">
                                  <input class="form-check-input checkboxdefault"
                                    type="radio"
                                    value={2}
                                    checked={specialist === 2}
                                    onChange={handleRadioChange}
                                    name="reffered_to_specialist" />
                                  <label class="form-check-label" for="flexRadioDefault1">
                                    No
                                  </label>
                                </div>
                              </div>
                            </div>
                          </>
                        )
                      }
                    </>
                  )
                  :
                  ////// corporate form data
                  (
                    <>
                      {
                        ['UG-EXPERT', 'UG-SUPERADMIN', 'UG-ADMIN', 'UG-DOCTOR', 'UG-EXPERT', 'CO-HR'].includes(userGroup) &&
                        (
                          <>
                            <div className="visualllllllll">
                              <div className='row'>
                                <div className="col-md-6">
                                  <h6 className='Acuity mt-2'>Vision Without Glasses</h6>
                                  <div className="row everyrow">
                                    <div className="col-md-4">
                                      <label className="visually-hidden labelvision" style={{ marginTop: '30px' }}>NEAR</label>
                                    </div>

                                    <div className="col-md-4">
                                      <label className="visually-hidden labelvision" style={{ marginLeft: '2rem' }}>Right </label>
                                      <input className='form-control inputvision'
                                        name='re_near_without_glasses'
                                        value={visionForm.re_near_without_glasses}
                                        onChange={handleChange}
                                        type="number"
                                        min="0"
                                      />
                                    </div>

                                    <div className="col-md-4">
                                      <label className="visually-hidden labelvision" style={{ marginLeft: '2rem' }}>Left </label>
                                      <input className='form-control inputvision'
                                        name='le_near_without_glasses'
                                        value={visionForm.le_near_without_glasses}
                                        onChange={handleChange}
                                        type="number"
                                        min="0"
                                      />
                                    </div>
                                  </div>

                                  <div className="row everyrow">
                                    <div className="col-md-4">
                                      <label className="visually-hidden labelvision" style={{ marginTop: '30px' }}>FAR</label>
                                    </div>

                                    <div className="col-md-4">
                                      <label className="visually-hidden labelvision" style={{ marginLeft: '2rem' }}>Right </label>
                                      <input className='form-control inputvision'
                                        name='re_far_without_glasses'
                                        value={visionForm.re_far_without_glasses}
                                        onChange={handleChange}
                                        type="number"
                                        min="0"
                                      />
                                    </div>

                                    <div className="col-md-4">
                                      <label className="visually-hidden labelvision" style={{ marginLeft: '2rem' }}>Left </label>
                                      <input className='form-control inputvision'
                                        name='le_far_without_glasses'
                                        value={visionForm.le_far_without_glasses}
                                        onChange={handleChange}
                                        type="number"
                                        min="0"
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div className="col-md-6">
                                  <h6 className='Acuity mt-2'>Vision With Glasses</h6>
                                  <div className="row everyrow">
                                    <div className="col-md-4">
                                      <label className="visually-hidden labelvision" style={{ marginTop: '30px' }}>NEAR</label>
                                    </div>

                                    <div className="col-md-4">
                                      <label className="visually-hidden labelvision" style={{ marginLeft: '2rem' }}>Right </label>
                                      <input className='form-control inputvision'
                                        name='re_near_with_glasses'
                                        value={visionForm.re_near_with_glasses}
                                        onChange={handleChange}
                                        type="number"
                                        min="0"
                                      />
                                    </div>

                                    <div className="col-md-4">
                                      <label className="visually-hidden labelvision" style={{ marginLeft: '2rem' }}>Left </label>
                                      <input className='form-control inputvision'
                                        name='le_near_with_glasses'
                                        value={visionForm.le_near_with_glasses}
                                        onChange={handleChange}
                                        type="number"
                                        min="0"
                                      />
                                    </div>
                                  </div>

                                  <div className="row everyrow">
                                    <div className="col-md-4">
                                      <label className="visually-hidden labelvision" style={{ marginTop: '30px' }}>FAR</label>
                                    </div>

                                    <div className="col-md-4">
                                      <label className="visually-hidden labelvision" style={{ marginLeft: '2rem' }}>Right </label>
                                      <input className='form-control inputvision'
                                        name='re_far_with_glasses'
                                        value={visionForm.re_far_with_glasses}
                                        onChange={handleChange}
                                        type="number"
                                        min="0"
                                      />
                                    </div>

                                    <div className="col-md-4">
                                      <label className="visually-hidden labelvision" style={{ marginLeft: '2rem' }}>Left </label>
                                      <input className='form-control inputvision'
                                        name='le_far_with_glasses'
                                        value={visionForm.le_far_with_glasses}
                                        onChange={handleChange}
                                        type="number"
                                        min="0"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className='row ml-4'>
                                <div className="col-md-3">
                                  <label className="visually-hidden labelvision">Color blindness</label>
                                  <select className="form-control visioninput"
                                    onChange={handleChange}
                                    name="color_blindness"
                                    value={visionForm.color_blindness}>
                                    <option>Select</option>
                                    <option value="1">Yes</option>
                                    <option value="2">No</option>
                                  </select>
                                </div>

                                <div className="col-md-3">
                                  <label className="visually-hidden labelvision">Comment</label>
                                  <input className='form-control visioninput'
                                    name="comment"
                                    value={visionForm.comment}
                                    onChange={handleChange} />
                                </div>

                                <div className="col-md-6">
                                  <div className="row">
                                    <div className='col-md-12'>
                                      <label className="visually-hidden labelvision">Reffered To Specialist</label>
                                    </div>

                                    <div className="col-md-2 ml-2">
                                      <div class="form-check">
                                        <input class="form-check-input checkboxdefault"
                                          type="radio"
                                          value={1}
                                          checked={specialist === 1}
                                          onChange={handleRadioChange}
                                          name="reffered_to_specialist" />
                                        <label class="form-check-label" for="flexRadioDefault1">
                                          Yes
                                        </label>
                                      </div>
                                    </div>

                                    <div className="col-md-2">
                                      <div class="form-check">
                                        <input class="form-check-input checkboxdefault"
                                          type="radio"
                                          value={2}
                                          checked={specialist === 2}
                                          onChange={handleRadioChange}
                                          name="reffered_to_specialist" />
                                        <label class="form-check-label" for="flexRadioDefault1">
                                          No
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        )
                      }
                    </>
                  )
              }
              <div className="row">
                <div className="col-md-12">
                  <button type="submit" className="btn btn-sm btnauditory">Accept</button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Vision
