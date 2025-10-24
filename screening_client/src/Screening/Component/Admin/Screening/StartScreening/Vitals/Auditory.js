import React, { useState, useEffect } from 'react';
import './Auditory.css';
import axios from 'axios';
import ear from '../../../../../Images/Ear.png';
import EditIcon from '@mui/icons-material/Edit';

const Auditory = ({ pkid, citizensPkId, lastview, recall, fetchVital, selectedName, onAcceptClick }) => {

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


  const userGroup = localStorage.getItem('usergrp');
  const [referredToSpecialist, setReferredToSpecialist] = useState(null);
  const accessToken = localStorage.getItem('token');
  const source = localStorage.getItem('source');

  console.log(source, 'fetched source in the auditory');
  const [pre, setPre] = useState(lastview[0] || {})

  console.log(lastview, 'lastviewlastviewlastview')

  useEffect(() => {
    console.log('User Group:', userGroup);
  }, [userGroup]);

  const [editMode, setEditMode] = useState(false); // State to track edit mode

  const handleEditClick = () => {
    setEditMode(!editMode); // Toggle edit mode
  };

  const localStorageKey = `auditoryFormData_${pkid}`;

  const Port = process.env.REACT_APP_API_KEY;
  const [auditoryChechBox, setAuditoryChechBox] = useState([]);

  const [formData, setFormData] = useState({
    right: '',
    left: '',
    tratement_given: '',
    otoscopic_exam: '',
    remark: '',
    citizen_pk_id: citizensPkId,
    checkboxes: lastview[0]?.checkboxes || auditoryChechBox.map(() => false),
    // Initialize checkboxes with an empty array
    selectedNames: [],

    ///// added fields
    hz_250_left: null,
    hz_500_left: null,
    hz_1000_left: null,
    hz_2000_left: null,
    hz_4000_left: null,
    hz_8000_left: null,
    reading_left: null,
    left_ear_observations_remarks: '',
    hz_250_right: null,
    hz_500_right: null,
    hz_1000_right: null,
    hz_2000_right: null,
    hz_4000_right: null,
    hz_8000_right: null,
    reading_right: null,
    right_ear_observations_remarks: '',
  });
  console.log(formData, 'fdddddddddd');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${Port}/Screening/get_auditory/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          });
        setAuditoryChechBox(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [Port]);

  const handleCheckboxChange = (name) => {
    setFormData((prevFormData) => {
      const updatedCheckboxes = [...prevFormData.checkboxes];
      const index = updatedCheckboxes.indexOf(name);
      if (index !== -1) {
        updatedCheckboxes.splice(index, 1);
      } else {
        updatedCheckboxes.push(name);
      }

      console.log('Updated Checkboxes:', updatedCheckboxes);

      return {
        ...prevFormData,
        checkboxes: updatedCheckboxes,
        selectedNames: updatedCheckboxes,
      };
    });
  };

  const userID = localStorage.getItem('userID');
  console.log(userID);

  const handleSubmit = async (e) => {
    const isConfirmed = window.confirm('Submit Auditory Form');
    const confirmationStatus = isConfirmed ? 'True' : 'False';
    e.preventDefault();
    const postData = {
      checkboxes: formData.selectedNames,
      remark: formData.remark,
      right: formData.right,
      left: formData.left,
      tratement_given: formData.tratement_given,
      otoscopic_exam: formData.otoscopic_exam,
      citizen_pk_id: citizensPkId,
      form_submit: confirmationStatus,
      added_by: userID,
      modify_by: userID,
      reffered_to_specialist: referredToSpecialist,

      // added fields
      hz_250_left: formData.hz_250_left,
      hz_500_left: formData.hz_500_left,
      hz_1000_left: formData.hz_1000_left,
      hz_2000_left: formData.hz_2000_left,
      hz_4000_left: formData.hz_4000_left,
      hz_8000_left: formData.hz_8000_left,
      reading_left: leftReading.left_average_reading,
      left_ear_observations_remarks: leftReading.message,
      hz_250_right: formData.hz_250_right,
      hz_500_right: formData.hz_500_right,
      hz_1000_right: formData.hz_1000_right,
      hz_2000_right: formData.hz_2000_right,
      hz_4000_right: formData.hz_4000_right,
      hz_8000_right: formData.hz_8000_right,
      reading_right: rightReading.Right_average_reading,
      right_ear_observations_remarks: rightReading.message,
    };

    console.log(postData, 'postData');

    try {
      const response = await axios.post(
        `${Port}/Screening/citizen_audit_info_post/${pkid}`,
        postData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          }
        }
      );
      // onMoveToVital('dentalsection');
      onAcceptClick(nextName);
      recall();
      console.log('POST response:', response);
    } catch (error) {
      console.error('Error posting data:', error);
    }
  };

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (value === '') {
      setLeftReading({
        message: '',
        left_average_reading: ''
      });
    }

    if (value === '') {
      setRightReading({
        message: '',
        Right_average_reading: ''
      });
    }
  };

  useEffect(() => {
    if (lastview.length > 0) {
      const {
        hz_250_left = null,
        hz_500_left = null,
        hz_1000_left = null,
        hz_2000_left = null,
        hz_4000_left = null,
        hz_8000_left = null,
        left_ear_observations_remarks = '',
        reading_left = null,
        hz_250_right = null,
        hz_500_right = null,
        hz_1000_right = null,
        hz_2000_right = null,
        hz_4000_right = null,
        hz_8000_right = null,
        right_ear_observations_remarks = '',
        reading_right = null,
        reffered_to_specialist = ''
      } = lastview[0];

      setFormData({
        ...formData,
        hz_250_left,
        hz_500_left,
        hz_1000_left,
        hz_2000_left,
        hz_4000_left,
        hz_8000_left,
        left_ear_observations_remarks,
        reading_left,
        hz_250_right,
        hz_500_right,
        hz_1000_right,
        hz_2000_right,
        hz_4000_right,
        hz_8000_right,
        right_ear_observations_remarks,
        reading_right,
        reffered_to_specialist
      });

      setLeftReading({
        message: left_ear_observations_remarks,
        left_average_reading: reading_left
      });

      setRightReading({
        message: right_ear_observations_remarks,
        Right_average_reading: reading_right
      });

      setReferredToSpecialist(reffered_to_specialist);
    }
  }, [lastview]);

  ////// value pass API ID wise 

  const [leftReading, setLeftReading] = useState([]);
  const [rightReading, setRightReading] = useState([]);

  useEffect(() => {
    const fetchLeftReading = async () => {
      if (formData.hz_500_left && formData.hz_1000_left && formData.hz_2000_left) {
        try {
          const response = await axios.get(`${Port}/Screening/left_reading/${formData.hz_500_left}/${formData.hz_1000_left}/${formData.hz_2000_left}/`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          setLeftReading(response.data);
          console.log('Left Ear Data Fetching As per Input Value......', response.data);
        } catch (error) {
          console.error('Error fetching Left data:', error);
        }
      }
    };

    fetchLeftReading();
  }, [formData, Port, accessToken]);

  useEffect(() => {
    const fetchRightReading = async () => {
      if (formData.hz_500_right && formData.hz_1000_right && formData.hz_2000_right) {
        try {
          const response = await axios.get(`${Port}/Screening/right_reading/${formData.hz_500_right}/${formData.hz_1000_right}/${formData.hz_2000_right}/`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          setRightReading(response.data);
          console.log('Right Ear Data Fetching As per Input Value......', response.data);
        } catch (error) {
          console.error('Error fetching Right data:', error);
        }
      }
    };

    fetchRightReading();
  }, [formData.hz_500_right, formData.hz_1000_right, formData.hz_2000_right, Port, accessToken]);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-12">
            <div className="card auditorycard">
              <h5 className="audittitle">{Auditory}</h5>
            </div>
          </div>

          <div className="col-md-12">
            <div className="card">
              <img src={ear} className="earimage" />
              <h5 className="eartitle">Ear</h5>

              <div className="row">
                <div className="col-md-12">
                  <h6 className="checktitle">Hearing Test</h6>
                  <div className="elementauditory"></div>
                </div>
              </div>

              {
                source === '1' ?
                  (
                    <>
                      <div className="container">
                        <div className="row ml-2 mr-1">
                          {['UG-EXPERT', 'UG-SUPERADMIN', 'CO-HR'].includes(userGroup) && (
                            <>
                              <div className="col-md-3">
                                <label className="visually-hidden earlabel">Right</label>
                                <select
                                  className="form-control form-control-sm earinput"
                                  aria-label="Default select example"
                                  name="right"
                                  value={formData.right}
                                  onChange={handleChange}
                                >
                                  <option>Select</option>
                                  <option value="Yes">Yes</option>
                                  <option value="No">No</option>
                                </select>
                              </div>

                              <div className="col-md-3">
                                <label className="visually-hidden earlabel">Left</label>
                                <select
                                  className="form-control form-control-sm earinput"
                                  aria-label="Default select example"
                                  name="left"
                                  value={formData.left}
                                  onChange={handleChange}
                                >
                                  <option>Select</option>
                                  <option value="Yes">Yes</option>
                                  <option value="No">No</option>
                                </select>
                              </div>

                              <div className="col-md-6">
                                <label className="visually-hidden earlabel">
                                  Treatment Given
                                </label>
                                <input
                                  className="form-control form-control-sm"
                                  name="tratement_given"
                                  value={formData.tratement_given}
                                  onChange={handleChange}
                                />
                              </div>

                              <div className="col-md-6 mb-3">
                                <label className="visually-hidden earlabel">
                                  Otoscopic exam
                                </label>
                                <input
                                  className="form-control form-control-sm"
                                  name="otoscopic_exam"
                                  value={formData.otoscopic_exam}
                                  onChange={handleChange}
                                />
                              </div>
                            </>
                          )}

                          {['UG-DOCTOR', 'UG-EXPERT', 'UG-SUPERADMIN', 'UG-ADMIN', 'CO-HR'].includes(userGroup) && (
                            <>
                              <div className="col-md-6">
                                <label className="visually-hidden earlabel">Remark</label>
                                <input
                                  className="form-control form-control-sm"
                                  name="remark"
                                  value={formData.remark}
                                  onChange={handleChange}
                                />
                              </div>

                              <div className="col-md-12">
                                <h6 className="checktitlee">Check if Present</h6>
                                <div className="elementauditorypresenttt"></div>
                              </div>

                              <div className="container">
                                <div className="row ml-3 mb-2">
                                  {/* {auditoryChechBox.map((item, index) => (
                            <div key={index} className="col-md-4">
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  // name={item.audit_name}
                                  checked={formData.checkboxes[index]}
                                  onChange={() => handleCheckboxChange(index)}
                                />
                                <label className="form-check-label">{item.audit_name}</label>
                              </div>
                            </div>
                          ))} */}

                                  {auditoryChechBox.map((item) => (
                                    <div key={item.audit_name} className="col-md-4">
                                      <div className="form-check">
                                        <input
                                          className="form-check-input"
                                          type="checkbox"
                                          checked={formData.checkboxes.some((name) => name === item.audit_name)}
                                          onChange={() => handleCheckboxChange(item.audit_name)}
                                        />
                                        <label className="form-check-label">{item.audit_name}</label>
                                      </div>
                                    </div>
                                  ))}

                                </div>
                              </div>
                            </>
                          )}
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
                    </>
                  )
                  :
                  (
                    <>
                      <div className="container">
                        {['UG-EXPERT', 'UG-SUPERADMIN', 'UG-DOCTOR', 'UG-EXPERT', 'CO-HR'].includes(userGroup) && (
                          <>
                            <div className="row">
                              <div className="col-md-2" style={{ marginTop: '5em' }}>
                                <h6 className="visually-hidde" style={{ marginLeft: '10px' }}>Audio Ear Left</h6>
                              </div>

                              <div className="col-md-6">
                                <div className="row">
                                  <div className="col-md-6">
                                    <label className="visually-hidden earlabel">
                                      250hz
                                    </label>
                                    <input
                                      className="form-control form-control-sm"
                                      type="number"
                                      min="0"
                                      max="200"
                                      onInput={(e) => {
                                        if (e.target.value > 200) {
                                          e.target.value = 200;
                                        }
                                      }}
                                      name="hz_250_left"
                                      value={formData.hz_250_left}
                                      onChange={handleChange}
                                    />
                                  </div>

                                  <div className="col-md-6">
                                    <label className="visually-hidden earlabel">500hz</label>
                                    <input
                                      className="form-control form-control-sm"
                                      type="number"
                                      min="0"
                                      max="200"
                                      onInput={(e) => {
                                        if (e.target.value > 200) {
                                          e.target.value = 200;
                                        }
                                      }}
                                      name="hz_500_left"
                                      value={formData.hz_500_left}
                                      onChange={handleChange}
                                    />
                                  </div>

                                  <div className="col-md-6">
                                    <label className="visually-hidden earlabel">1000hz</label>
                                    <input
                                      className="form-control form-control-sm"
                                      min="0"
                                      max="200"
                                      onInput={(e) => {
                                        if (e.target.value > 200) {
                                          e.target.value = 200;
                                        }
                                      }}
                                      name="hz_1000_left"
                                      value={formData.hz_1000_left}
                                      onChange={handleChange}
                                    />
                                  </div>

                                  <div className="col-md-6">
                                    <label className="visually-hidden earlabel">2000hz</label>
                                    <input
                                      className="form-control form-control-sm"
                                      name="hz_2000_left"
                                      type="number"
                                      min="0"
                                      max="200"
                                      onInput={(e) => {
                                        if (e.target.value > 200) {
                                          e.target.value = 200;
                                        }
                                      }}
                                      value={formData.hz_2000_left}
                                      onChange={handleChange}
                                    />
                                  </div>

                                  <div className="col-md-6">
                                    <label className="visually-hidden earlabel">
                                      4000hz
                                    </label>
                                    <input
                                      className="form-control form-control-sm"
                                      name="hz_4000_left"
                                      type="number"
                                      min="0"
                                      max="200"
                                      onInput={(e) => {
                                        if (e.target.value > 200) {
                                          e.target.value = 200;
                                        }
                                      }}
                                      value={formData.hz_4000_left}
                                      onChange={handleChange}
                                    />
                                  </div>

                                  <div className="col-md-6">
                                    <label className="visually-hidden earlabel">
                                      8000hz
                                    </label>
                                    <input
                                      className="form-control form-control-sm"
                                      name="hz_8000_left"
                                      type="number"
                                      min="0"
                                      max="200"
                                      onInput={(e) => {
                                        if (e.target.value > 200) {
                                          e.target.value = 200;
                                        }
                                      }}
                                      value={formData.hz_8000_left}
                                      onChange={handleChange}
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="col-md-3" style={{ marginTop: '2em', marginLeft: '3em' }}>
                                <div className="row">
                                  <label className="visually-hidden earlabel">
                                    Left Ear Observation
                                  </label>
                                  <input
                                    className="form-control form-control-sm"
                                    name="left_ear_observations_remarks"
                                    readonly
                                    value={leftReading.message}
                                    onChange={handleChange}
                                    style={{
                                      backgroundColor: leftReading.message && leftReading.message.trim() === 'Normal' ? 'rgb(183, 218, 201)' :
                                        leftReading.message && leftReading.message.trim() === 'Mild Hearing Loss' ? 'rgb(160, 192, 203)' :
                                          leftReading.message && leftReading.message.trim() === 'Moderate Hearing Loss' ? 'rgb(244, 236, 211)' :
                                            leftReading.message && leftReading.message.trim() === 'Severe Hearing Loss' ? 'rgb(238, 220, 162)' :
                                              leftReading.message && leftReading.message.trim() === 'Profound Hearning Loss' ? 'rgb(254, 164, 163)' :
                                                'white',
                                      color: 'black'
                                    }}
                                  />
                                </div>

                                <div className="row" style={{ marginTop: '1em' }}>
                                  <label className="visually-hidden earlabel">
                                    Reading
                                  </label>
                                  <input
                                    className="form-control form-control-sm"
                                    name="reading_left"
                                    readonly
                                    value={leftReading.left_average_reading}
                                    onChange={handleChange}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="row mt-4">
                              <div className="col-md-2" style={{ marginTop: '5em' }}>
                                <h6 className="visually-hidde" style={{ marginLeft: '10px' }}>Audio Ear Right</h6>
                              </div>

                              <div className="col-md-6">
                                <div className="row">
                                  <div className="col-md-6">
                                    <label className="visually-hidden earlabel">
                                      250hz
                                    </label>
                                    <input
                                      className="form-control form-control-sm"
                                      name="hz_250_right"
                                      type="number"
                                      min="0"
                                      max="200"
                                      onInput={(e) => {
                                        if (e.target.value > 200) {
                                          e.target.value = 200;
                                        }
                                      }}
                                      value={formData.hz_250_right}
                                      onChange={handleChange}
                                    />
                                  </div>

                                  <div className="col-md-6">
                                    <label className="visually-hidden earlabel">500hz</label>
                                    <input
                                      className="form-control form-control-sm"
                                      name="hz_500_right"
                                      type="number"
                                      min="0"
                                      max="200"
                                      onInput={(e) => {
                                        if (e.target.value > 200) {
                                          e.target.value = 200;
                                        }
                                      }}
                                      value={formData.hz_500_right}
                                      onChange={handleChange}
                                    />
                                  </div>

                                  <div className="col-md-6">
                                    <label className="visually-hidden earlabel">1000hz</label>
                                    <input
                                      className="form-control form-control-sm"
                                      name="hz_1000_right"
                                      type="number"
                                      min="0"
                                      max="200"
                                      onInput={(e) => {
                                        if (e.target.value > 200) {
                                          e.target.value = 200;
                                        }
                                      }}
                                      value={formData.hz_1000_right}
                                      onChange={handleChange}
                                    />
                                  </div>

                                  <div className="col-md-6">
                                    <label className="visually-hidden earlabel">2000hz</label>
                                    <input
                                      className="form-control form-control-sm"
                                      name="hz_2000_right"
                                      type="number"
                                      min="0"
                                      max="200"
                                      onInput={(e) => {
                                        if (e.target.value > 200) {
                                          e.target.value = 200;
                                        }
                                      }}
                                      value={formData.hz_2000_right}
                                      onChange={handleChange}
                                    />
                                  </div>

                                  <div className="col-md-6">
                                    <label className="visually-hidden earlabel">
                                      4000hz
                                    </label>
                                    <input
                                      className="form-control form-control-sm"
                                      name="hz_4000_right"
                                      type="number"
                                      min="0"
                                      max="200"
                                      onInput={(e) => {
                                        if (e.target.value > 200) {
                                          e.target.value = 200;
                                        }
                                      }}
                                      value={formData.hz_4000_right}
                                      onChange={handleChange}
                                    />
                                  </div>

                                  <div className="col-md-6">
                                    <label className="visually-hidden earlabel">
                                      8000hz
                                    </label>
                                    <input
                                      className="form-control form-control-sm"
                                      name="hz_8000_right"
                                      type="number"
                                      value={formData.hz_8000_right}
                                      onChange={handleChange}
                                      min="0"
                                      max="200"
                                      onInput={(e) => {
                                        if (e.target.value > 200) {
                                          e.target.value = 200;
                                        }
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="col-md-3" style={{ marginTop: '2.5em', marginLeft: '3em' }}>
                                <div className="row">
                                  <label className="visually-hidden earlabel">
                                    Right Ear Observation
                                  </label>
                                  <input
                                    className="form-control form-control-sm"
                                    name="right_ear_observations_remarks"
                                    value={rightReading.message}
                                    onChange={handleChange}
                                    readonly
                                    style={{
                                      backgroundColor: rightReading.message && rightReading.message.trim() === 'Normal' ? 'rgb(183, 218, 201)' :
                                        rightReading.message && rightReading.message.trim() === 'Mild Hearing Loss' ? 'rgb(160, 192, 203)' :
                                          rightReading.message && rightReading.message.trim() === 'Moderate Hearing Loss' ? 'rgb(244, 236, 211)' :
                                            rightReading.message && rightReading.message.trim() === 'Severe Hearing Loss' ? 'rgb(238, 220, 162)' :
                                              rightReading.message && rightReading.message.trim() === 'Profound Hearning Loss' ? 'rgb(254, 164, 163)' :
                                                'white',
                                      color: 'black'
                                    }}
                                  />
                                </div>

                                <div className="row" style={{ marginTop: '1em' }}>
                                  <label className="visually-hidden earlabel">
                                    Reading
                                  </label>
                                  <input
                                    className="form-control form-control-sm"
                                    name="reading_right"
                                    value={rightReading.Right_average_reading}
                                    onChange={handleChange}
                                    readonly
                                  />
                                </div>
                              </div>
                            </div>
                          </>
                        )}

                        <div className="row mb-3 mt-4">
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
                    </>
                  )
              }
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <button type="submit" className="btn btn-sm btnauditory">
                Accept
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Auditory;
