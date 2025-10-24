import React, { useState, useEffect, useRef } from 'react';
import './Dental.css'
import Webcam from 'react-webcam';
import { Button, Slider } from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { Modal, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useSourceContext } from '../../../../../../contexts/SourceContext';
import DentalAssessment from './AI/DentalAssesment';
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

const Dental = ({ scheduleID, pkid, citizensPkId, citizenId, onMoveTovision, fetchVital, selectedName, onAcceptClick }) => {

  //// QR Generate Update
  const [openModal, setOpenModal] = useState(false);
  const [qrCodeImage, setQrCodeImage] = useState(null);
  const { setScheduleIdd, setPkIddd, setCitizenIddd } = useSourceContext();

  const handleOpen = async () => {
    try {
      const response = await fetch(`${Port}/Screening/QRCode/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          citizens_pk_id: pkid,
          citizen_id: citizenId,
          schedule_id: scheduleID,
        })
      });

      if (response.ok) {
        const data = await response.json();
        setQrCodeImage(data.qr_code_image);
        setOpenModal(true);
        setScheduleIdd(scheduleID);
        setPkIddd(pkid);
        setCitizenIddd(citizenId);

        const assessmentUrl = `${Port}/screening/dental_assesment?schedule_id=${encodeURIComponent(data.schedule_id)}&citizen_id=${encodeURIComponent(data.citizen_id)}&citizen_pk_id=${encodeURIComponent(data.citizens_pk_id)}`;
        Cookies.set('scheduleIdd', scheduleID, { expires: 1, path: assessmentUrl });
      } else {
        console.error('Error:', response.status);
      }
    } catch (error) {
      console.error('API error:', error);
    }
  };
  const handleClose = () => setOpenModal(false);

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
  //_________________________________END___________________________________

  const userGroup = localStorage.getItem('usergrp');
  const accessToken = localStorage.getItem('token');

  useEffect(() => {
    console.log('User Group:', userGroup);
  }, [userGroup]);

  const userID = localStorage.getItem('userID');
  console.log(userID);

  const Port = process.env.REACT_APP_API_KEY;

  const [oralHygiene, setOralHygiene] = useState('');
  const [gum, setGum] = useState('');
  const [oral, setOral] = useState('');
  const [gumbleeding, setgumbleeding] = useState('');
  const [discolouration, setDiscolouration] = useState('');
  const [food, setFood] = useState('');
  const [carious, setCarious] = useState('');
  const [extraction, setExtraction] = useState('');
  const [fluorosis, setFluorosis] = useState('');
  const [tooth, setTooth] = useState('');
  // const [reffered, setReffered] = useState(null);
  const [referredToSpecialist, setReferredToSpecialist] = useState(null);
  const [sensitive, setSensitive] = useState('');
  const [malalignment, setMalalignment] = useState('');
  const [surgery, setSurgery] = useState('');
  const [orthodontic, setOrthodontic] = useState('');
  const [overall, setOverall] = useState('');

  const calculateOverall = () => {
    const values = [
      oralHygiene,
      gum,
      oral,
      gumbleeding,
      discolouration,
      food,
      carious,
      extraction,
      fluorosis,
      tooth,
      referredToSpecialist,
      sensitive,
      malalignment,
      orthodontic,
      // orthodontic,
    ];

    const countGood = values.filter((value) => value === '1').length;
    const countBad = values.filter((value) => value === '2').length;

    let calculatedOverall = '';

    if (countGood >= 10) {
      calculatedOverall = 'Good';
    } else if (countGood >= 4 && countGood <= 9) {
      calculatedOverall = 'Fair';
    } else {
      calculatedOverall = 'Bad';
    }

    // Handling '2' values
    if (countBad >= 10) {
      calculatedOverall = 'Bad';
    } else if (countBad < 5) {
      calculatedOverall = 'Good';
    } else if (countBad >= 2 && countBad < 5) {
      calculatedOverall = 'Fair';
    }

    return calculatedOverall;
  };

  const handleRadioChange = (event) => {
    const { name, value } = event.target;

    if (name === 'reffered_to_specialist') {
      setReferredToSpecialist(parseInt(value));
    } else {
      switch (name) {
        case 'oral_hygiene':
          setOralHygiene(value);
          break;
        case 'gum_condition':
          setGum(value);
          break;
        case 'oral_ulcers':
          setOral(value);
          break;
        case 'gum_bleeding':
          setgumbleeding(value);
          break;
        case 'discoloration_of_teeth':
          setDiscolouration(value);
          break;
        case 'food_impaction':
          setFood(value);
          break;
        case 'carious_teeth':
          setCarious(value);
          break;
        case 'extraction_done':
          setExtraction(value);
          break;
        case 'fluorosis':
          setFluorosis(value);
          break;
        case 'tooth_brushing_frequency':
          setTooth(value);
          break;
        case 'sensitive_teeth':
          setSensitive(value);
          break;
        case 'malalignment':
          setMalalignment(value);
          break;
        case 'orthodontic_treatment':
          setOrthodontic(value);
          break;
        case 'referred_to_surgery':
          setSurgery(value);
          break;
        default:
          break;
      }
    }

    const calculatedOverall = calculateOverall();
    setOverall(calculatedOverall);
    updateDentalConditions(calculatedOverall);
  };

  const updateDentalConditions = (updatedOverall) => {
    setDentalform((prevState) => ({
      ...prevState,
      dental_conditions: updatedOverall,
    }));
  };

  const [dentalform, setDentalform] = useState({
    oral_hygiene_remark: '',
    gum_condition_remark: '',
    oral_ulcers_remark: '',
    gum_bleeding_remark: '',
    discoloration_of_teeth_remark: '',
    food_impaction_remark: '',
    carious_teeth_remark: '',
    extraction_done_remark: '',
    fluorosis_remark: '',
    tooth_brushing_frequency_remark: '',
    reffered_to_specialist_remark: '',
    sensitive_teeth_remark: '',
    malalignment_remark: '',
    orthodontic_treatment_remark: '',
    comment: '',
    treatment_given: '',
    citizen_pk_id: citizensPkId,
    dental_conditions: overall
  })

  const handleChange = (event) => {
    const { name, value } = event.target;

    setDentalform((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    const isConfirmed = window.confirm('Submit Dental Form');
    const confirmationStatus = isConfirmed ? 'True' : 'False';
    const calculatedOverall = calculateOverall();

    e.preventDefault();
    const formData = {
      ...dentalform,
      oral_hygiene: oralHygiene,
      gum_condition: gum,
      oral_ulcers: oral,
      gum_bleeding: gumbleeding,
      discoloration_of_teeth: discolouration,
      food_impaction: food,
      carious_teeth: carious,
      extraction_done: extraction,
      fluorosis: fluorosis,
      tooth_brushing_frequency: tooth,
      reffered_to_specialist: referredToSpecialist,
      sensitive_teeth: sensitive,
      malalignment: malalignment,
      orthodontic_treatment: orthodontic,
      referred_to_surgery: surgery,
      citizen_pk_id: citizensPkId,
      dental_conditions: calculatedOverall,
      form_submit: confirmationStatus,
      added_by: userID,
      modify_by: userID
    };

    console.log('Form Data:', formData);

    try {
      const response = await fetch(`${Port}/Screening/citizen_dental_info_post/${pkid}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify(formData),
      });

      if (isConfirmed && response.ok) {
        const data = await response.json();
        console.log('Server Response:', data);
        // onMoveToVital('dentalsection');
        onAcceptClick(nextName);
      } else if (response.status === 400) {
        console.error('Bad Request:', response.data.error);
      } else if (response.status === 500) {
        // onMoveToVital('dentalsection');
        onAcceptClick(nextName);
      }
      else {
        console.error('Unhandled Status Code:', response.status);
      }
    } catch (error) {
      console.error('Error sending data:', error.message);
    }
  };

  const fetchDataById = async (pkid) => {
    try {
      const response = await fetch(`${Port}/Screening/citizen_dental_info_get/${pkid}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
      });

      if (response.ok) {
        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
          const dentalData = data[0];

          setDentalform((prevState) => ({
            ...prevState,
            oral_hygiene_remark: dentalData.oral_hygiene_remark,
            gum_condition_remark: dentalData.gum_condition_remark,
            oral_ulcers_remark: dentalData.oral_ulcers_remark,
            gum_bleeding_remark: dentalData.gum_bleeding_remark,
            discoloration_of_teeth_remark: dentalData.discoloration_of_teeth_remark,
            food_impaction_remark: dentalData.food_impaction_remark,
            carious_teeth_remark: dentalData.carious_teeth_remark,
            extraction_done_remark: dentalData.extraction_done_remark,
            fluorosis_remark: dentalData.fluorosis_remark,
            tooth_brushing_frequency_remark: data[0].tooth_brushing_frequency_remark,
            reffered_to_specialist_remark: data[0].reffered_to_specialist_remark,
            sensitive_teeth_remark: data[0].sensitive_teeth_remark,
            malalignment_remark: data[0].malalignment_remark,
            orthodontic_treatment_remark: data[0].orthodontic_treatment_remark,
            comment: data[0].comment,
            treatment_given: data[0].treatment_given,
            dental_conditions: dentalData.dental_conditions || overall,
          }));

          setOralHygiene(dentalData.oral_hygiene.toString());
          setGum(dentalData.gum_condition.toString());
          setOral(dentalData.oral_ulcers.toString());
          setgumbleeding(dentalData.gum_bleeding.toString());
          setDiscolouration(dentalData.discoloration_of_teeth.toString());
          setFood(dentalData.food_impaction.toString());
          setCarious(dentalData.carious_teeth.toString());
          setExtraction(dentalData.extraction_done.toString());
          setFluorosis(dentalData.fluorosis.toString());
          setTooth(dentalData.tooth_brushing_frequency.toString());
          setReferredToSpecialist(dentalData.reffered_to_specialist);
          setSensitive(dentalData.sensitive_teeth.toString());
          setMalalignment(dentalData.malalignment.toString());
          setOrthodontic(dentalData.orthodontic_treatment.toString());
          setSurgery(dentalData.referred_to_surgery.toString());
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

  const [editMode, setEditMode] = useState(false);

  const handleEditClick = () => {
    setEditMode(!editMode);
  };

  return (
    <div>
      <div className="card dentalcard">
        <div className="col-md-12">
          <div className="row">
            <div className="col-md-4">
              <h5 className="dentaltitle">Dental Check Up</h5>
            </div>
            <div className="col-md-5 ml-auto">
              <div className="dental-screening-wrapper">
                <button className="btn btn mt-1"
                  style={{ backgroundColor: 'white', fontFamily: 'Roboto', marginLeft: '7em' }} onClick={handleOpen}
                >
                  Start Dental Screening
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={openModal}
        onClose={handleClose}
        aria-labelledby="dental-screening-modal"
        aria-describedby="dental-screening-modal-description"
      >
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, width: 400, position: 'relative' }}>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleClose}
            sx={{ position: 'absolute', top: 8, right: 10 }}
          >
            <CloseIcon />
          </IconButton>
          <h4 id="dental-screening-modal">Scan QR Code</h4>
          {qrCodeImage ? (
            <img
              src={`${Port}${qrCodeImage}`}
              alt="QR Code"
              style={{ width: '100%', height: 'auto', marginTop: '16px' }}
            />
          ) : (
            <p>Loading QR code...</p>
          )}
        </Box>
      </Modal>

      {/* <DentalAssessment/> */}

      {/* <div style={{ display: 'none' }}> */}
      {/* <DentalAssessment scheduleIdd={scheduleIdd} pkiddd={pkIddd} citizenIddd={citizenIddd} /> */}
      {/* </div> */}

      <form onSubmit={handleSubmit}>
        {
          ['UG-DOCTOR', 'UG-EXPERT', 'UG-SUPERADMIN', 'UG-ADMIN', 'CO-HR'].includes(userGroup) && (
            <>
              <div className="card cardcheckdental">
                <div className="row datapaddding">
                  <div className="col-md-3">
                    <h6 className='dentalpoints'>Oral Hygiene</h6>
                  </div>
                  <div className="col-md-2">
                    <div class="form-check formcheckset">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="oral_hygiene"
                        id="oral_hygiene"
                        value="1" // Assuming you want the string value
                        checked={oralHygiene === "1"} onChange={handleRadioChange}

                      />
                      <label class="form-check-label" for="flexRadioOralGood">
                        Good
                      </label>
                    </div>
                  </div>

                  <div className="col-md-2">
                    <div class="form-check formcheckset">
                      <input class="form-check-input" type="radio" name="oral_hygiene"
                        id="oral_hygiene"
                        value="2" // Assuming you want the string value
                        checked={oralHygiene === "2"} onChange={handleRadioChange} />
                      <label class="form-check-label" for="flexRadioOralFair">
                        Fair
                      </label>
                    </div>
                  </div>

                  <div className="col-md-2">
                    <div class="form-check formcheckset">
                      <input class="form-check-input" type="radio"
                        id="oral_hygiene"
                        value="3" // Assuming you want the string value
                        checked={oralHygiene === "3"} onChange={handleRadioChange}
                        name="oral_hygiene" />
                      <label class="form-check-label" for="flexRadioOralPoor">
                        Poor
                      </label>
                    </div>
                  </div>

                  <div className="col-md-3">
                    <input className="form-control inputdental" placeholder='Mention'
                      name='oral_hygiene_remark'
                      value={dentalform.oral_hygiene_remark}
                      onChange={handleChange} />
                  </div>
                </div>
              </div>

              <div className="card cardcheckdental">
                <div className="row datapaddding">
                  <div className="col-md-3">
                    <h6 className='dentalpoints'>Gum Condition</h6>
                  </div>
                  <div className="col-md-2">
                    <div class="form-check formcheckset">
                      <input class="form-check-input" type="radio"
                        id="gum_condition"
                        value="1" // Assuming you want the string value
                        checked={gum === "1"} onChange={handleRadioChange}
                        name="gum_condition" />
                      <label class="form-check-label" for="flexRadioGumGood">
                        Good
                      </label>
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div class="form-check formcheckset">
                      <input class="form-check-input" type="radio"
                        id="gum_condition"
                        value="2" // Assuming you want the string value
                        checked={gum === "2"} onChange={handleRadioChange}
                        name="gum_condition" />
                      <label class="form-check-label" for="flexRadioGumFair">
                        Fair
                      </label>
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div class="form-check formcheckset">
                      <input class="form-check-input" type="radio"
                        id="gum_condition"
                        value="3" // Assuming you want the string value
                        checked={gum === "3"} onChange={handleRadioChange}
                        name="gum_condition" />
                      <label class="form-check-label" for="flexRadioGumPoor">
                        Poor
                      </label>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <input className="form-control inputdental" placeholder='Mention'
                      name='gum_condition_remark'
                      value={dentalform.gum_condition_remark}
                      onChange={handleChange} />
                  </div>
                </div>
              </div>

              <div className="card cardcheckdental">
                <div className="row datapaddding">
                  <div className="col-md-3">
                    <h6 className='dentalpoints'>Oral Ulcers</h6>
                  </div>
                  <div className="col-md-3">
                    <div class="form-check formcheckset">
                      <input class="form-check-input" type="radio"
                        id="oral_ulcers"
                        value="2" // Assuming you want the string value
                        checked={oral === "2"} onChange={handleRadioChange}
                        name="oral_ulcers" />
                      <label class="form-check-label" for="flexRadioUlcerYes">
                        Yes
                      </label>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div class="form-check formcheckset">
                      <input class="form-check-input" type="radio"
                        id="oral_ulcers"
                        value="1" // Assuming you want the string value
                        checked={oral === "1"} onChange={handleRadioChange}
                        name="oral_ulcers" />
                      <label class="form-check-label" for="flexRadioUlcerNo">
                        No
                      </label>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <input className="form-control inputdental" placeholder='Mention'
                      name='oral_ulcers_remark'
                      value={dentalform.oral_ulcers_remark}
                      onChange={handleChange} />
                  </div>
                </div>
              </div>

              <div className="card cardcheckdental">
                <div className="row datapaddding">
                  <div className="col-md-3">
                    <h6 className='dentalpoints'>Gum Bleeding</h6>
                  </div>
                  <div className="col-md-3">
                    <div class="form-check formcheckset">
                      <input class="form-check-input" type="radio"
                        id="gum_bleeding"
                        value="2" // Assuming you want the string value
                        checked={gumbleeding === "2"} onChange={handleRadioChange}
                        name="gum_bleeding" />
                      <label class="form-check-label" for="flexRadioGumBleedingYes">
                        Yes
                      </label>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div class="form-check formcheckset">
                      <input class="form-check-input" type="radio"
                        id="gum_bleeding"
                        value="1" // Assuming you want the string value
                        checked={gumbleeding === "1"} onChange={handleRadioChange}
                        name="gum_bleeding" />
                      <label class="form-check-label" for="flexRadioGumBleedingNo">
                        No
                      </label>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <input className="form-control inputdental" placeholder='Mention'
                      value={dentalform.gum_bleeding_remark}
                      onChange={handleChange}
                      name="gum_bleeding_remark" />
                  </div>
                </div>
              </div>

              <div className="card cardcheckdental">
                <div className="row datapaddding">
                  <div className="col-md-3">
                    <h6 className='dentalpoints'>Discolouration Of Teeth</h6>
                  </div>
                  <div className="col-md-3">
                    <div class="form-check formcheckset">
                      <input class="form-check-input" type="radio"
                        id="discoloration_of_teeth"
                        value="2" // Assuming you want the string value
                        checked={discolouration === "2"} onChange={handleRadioChange}
                        name="discoloration_of_teeth" />
                      <label class="form-check-label" for="flexRadioDiscolourationYes">
                        Yes
                      </label>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div class="form-check formcheckset">
                      <input class="form-check-input" type="radio"
                        id="discoloration_of_teeth"
                        value="1" // Assuming you want the string value
                        checked={discolouration === "1"} onChange={handleRadioChange}
                        name="discoloration_of_teeth" />
                      <label class="form-check-label" for="flexRadioDiscolourationNo">
                        No
                      </label>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <input className="form-control inputdental" placeholder='Mention'
                      value={dentalform.discoloration_of_teeth_remark}
                      onChange={handleChange}
                      name="discoloration_of_teeth_remark" />
                  </div>
                </div>
              </div>

              <div className="card cardcheckdental">
                <div className="row datapaddding">
                  <div className="col-md-3">
                    <h6 className='dentalpoints'>Food Impaction</h6>
                  </div>
                  <div className="col-md-3">
                    <div class="form-check formcheckset">
                      <input class="form-check-input" type="radio"
                        id="food_impaction"
                        value="2" // Assuming you want the string value
                        checked={food === "2"} onChange={handleRadioChange}
                        name="food_impaction" />
                      <label class="form-check-label" for="flexRadioFoodYes">
                        Yes
                      </label>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div class="form-check formcheckset">
                      <input class="form-check-input" type="radio"
                        id="food_impaction"
                        value="1" // Assuming you want the string value
                        checked={food === "1"} onChange={handleRadioChange}
                        name="food_impaction" />
                      <label class="form-check-label" for="flexRadioFoodNo">
                        No
                      </label>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <input className="form-control inputdental" placeholder='Mention'
                      value={dentalform.food_impaction_remark}
                      onChange={handleChange}
                      name="food_impaction_remark" />
                  </div>
                </div>
              </div>

              <div className="card cardcheckdental">
                <div className="row datapaddding">
                  <div className="col-md-3">
                    <h6 className='dentalpoints'>Carious Teeth</h6>
                  </div>
                  <div className="col-md-3">
                    <div class="form-check formcheckset">
                      <input class="form-check-input" type="radio"
                        id="carious_teeth"
                        value="2" // Assuming you want the string value
                        checked={carious === "2"} onChange={handleRadioChange}
                        name="carious_teeth" />
                      <label class="form-check-label" for="flexRadioCariousYes">
                        Yes
                      </label>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div class="form-check formcheckset">
                      <input class="form-check-input" type="radio"
                        id="carious_teeth"
                        value="1" // Assuming you want the string value
                        checked={carious === "1"} onChange={handleRadioChange}
                        name="carious_teeth" />
                      <label class="form-check-label" for="flexRadioCariousNo">
                        No
                      </label>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <input className="form-control inputdental" placeholder='Mention'
                      value={dentalform.carious_teeth_remark}
                      onChange={handleChange}
                      name="carious_teeth_remark" />
                  </div>
                </div>
              </div>

              <div className="card cardcheckdental">
                <div className="row datapaddding">
                  <div className="col-md-3">
                    <h6 className='dentalpoints'>Extraction Done</h6>
                  </div>
                  <div className="col-md-3">
                    <div class="form-check formcheckset">
                      <input class="form-check-input" type="radio"
                        id="extraction_done"
                        value="2" // Assuming you want the string value
                        checked={extraction === "2"} onChange={handleRadioChange}
                        name="extraction_done" />
                      <label class="form-check-label" for="flexRadioCariousExtractionYes">
                        Yes
                      </label>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div class="form-check formcheckset">
                      <input class="form-check-input" type="radio"
                        id="extraction_done"
                        value="1" // Assuming you want the string value
                        checked={extraction === "1"} onChange={handleRadioChange}
                        name="extraction_done" />
                      <label class="form-check-label" for="flexRadioCariousExtractionNo">
                        No
                      </label>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <input className="form-control inputdental" placeholder='Mention'
                      value={dentalform.extraction_done_remark}
                      onChange={handleChange}
                      name="extraction_done_remark" />
                  </div>
                </div>
              </div>

              <div className="card cardcheckdental">
                <div className="row datapaddding">
                  <div className="col-md-3">
                    <h6 className='dentalpoints'>Fluorosis</h6>
                  </div>
                  <div className="col-md-3">
                    <div class="form-check formcheckset">
                      <input class="form-check-input" type="radio"
                        id="fluorosis"
                        value="2" // Assuming you want the string value
                        checked={fluorosis === "2"} onChange={handleRadioChange}
                        name="fluorosis" />
                      <label class="form-check-label" for="flexRadioCariousFluorosisYes">
                        Yes
                      </label>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div class="form-check formcheckset">
                      <input class="form-check-input" type="radio"
                        id="fluorosis"
                        value="1" // Assuming you want the string value
                        checked={fluorosis === "1"} onChange={handleRadioChange}
                        name="fluorosis" />
                      <label class="form-check-label" for="flexRadioCariousFluorosisNo">
                        No
                      </label>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <input className="form-control inputdental" placeholder='Mention'
                      value={dentalform.fluorosis_remark}
                      onChange={handleChange}
                      name="fluorosis_remark" />
                  </div>
                </div>
              </div>

              <div className="card cardcheckdental">
                <div className="row datapaddding">
                  <div className="col-md-3">
                    <h6 className='dentalpoints'>Tooth Brushing Frequency</h6>
                  </div>
                  <div className="col-md-2">
                    <div class="form-check formcheckset">
                      <input class="form-check-input" type="radio"
                        id="tooth_brushing_frequency"
                        value="3" // Assuming you want the string value
                        checked={tooth === "3"} onChange={handleRadioChange}
                        name="tooth_brushing_frequency" />
                      <label class="form-check-label" for="flexRadioCariousTooth1">
                        1/day
                      </label>
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div class="form-check formcheckset">
                      <input class="form-check-input" type="radio"
                        id="tooth_brushing_frequency"
                        value="2" // Assuming you want the string value
                        checked={tooth === "2"} onChange={handleRadioChange}
                        name="tooth_brushing_frequency" />
                      <label class="form-check-label" for="flexRadioCariousTooth2">
                        2/day
                      </label>
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div class="form-check formcheckset">
                      <input class="form-check-input" type="radio"
                        id="tooth_brushing_frequency"
                        value="1" // Assuming you want the string value
                        checked={tooth === "1"} onChange={handleRadioChange}
                        name="tooth_brushing_frequency" />
                      <label class="form-check-label" for="flexRadioCariousTooth3">
                        Less Than 1 Day
                      </label>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <input className="form-control inputdental" placeholder='Mention'
                      value={dentalform.tooth_brushing_frequency_remark}
                      onChange={handleChange}
                      name="tooth_brushing_frequency_remark" />
                  </div>
                </div>
              </div>

              {/* <div className="card cardcheckdental">
                <div className="row datapaddding">
                  <div className="col-md-3">
                    <h6 className='dentalpoints'>Reffered To Specialist</h6>
                  </div>
                  <div className="col-md-3">
                    <div class="form-check formcheckset">
                      <input class="form-check-input" type="radio"
                        id="reffered_to_specialist"
                        value="1" // Assuming you want the string value
                        checked={reffered === "1"} onChange={handleRadioChange}
                        name="reffered_to_specialist" />
                      <label class="form-check-label" for="flexRadioCariousTooth1">
                        Yes
                      </label>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div class="form-check formcheckset">
                      <input class="form-check-input" type="radio"
                        id="reffered_to_specialist"
                        value="2" // Assuming you want the string value
                        checked={reffered === "2"} onChange={handleRadioChange}
                        name="reffered_to_specialist" />
                      <label class="form-check-label" for="flexRadioCariousTooth2">
                        No
                      </label>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <input className="form-control inputdental" placeholder='Mention'
                      value={dentalform.reffered_to_specialist_remark}
                      onChange={handleChange}
                      name="reffered_to_specialist_remark" />
                  </div>
                </div>
              </div> */}
            </>
          )
        }

        {
          ['UG-EXPERT', 'UG-SUPERADMIN', 'UG-ADMIN', 'CO-HR'].includes(userGroup) && (
            <>
              <div className="card cardcheckdental">
                <div className="row datapaddding">
                  <div className="col-md-3">
                    <h6 className='dentalpoints'>Sensitive Teeth</h6>
                  </div>
                  <div className="col-md-3">
                    <div class="form-check formcheckset">
                      <input class="form-check-input" type="radio"
                        id="sensitive_teeth"
                        value="2" // Assuming you want the string value
                        checked={sensitive === "2"} onChange={handleRadioChange}
                        name="sensitive_teeth" />
                      <label class="form-check-label" for="flexRadioCariousTooth1">
                        Yes
                      </label>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div class="form-check formcheckset">
                      <input class="form-check-input" type="radio"
                        id="sensitive_teeth"
                        value="1" // Assuming you want the string value
                        checked={sensitive === "1"} onChange={handleRadioChange}
                        name="sensitive_teeth" />
                      <label class="form-check-label" for="flexRadioCariousTooth2">
                        No
                      </label>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <input className="form-control inputdental" placeholder='Mention'
                      id="sensitive_teeth_remark"
                      value={dentalform.sensitive_teeth_remark}
                      onChange={handleChange}
                      name="sensitive_teeth_remark" />
                  </div>
                </div>
              </div>

              <div className="card cardcheckdental">
                <div className="row datapaddding">
                  <div className="col-md-3">
                    <h6 className='dentalpoints'>Malalignment</h6>
                  </div>
                  <div className="col-md-3">
                    <div class="form-check formcheckset">
                      <input class="form-check-input" type="radio"
                        id="malalignment"
                        value="2" // Assuming you want the string value
                        checked={malalignment === "2"} onChange={handleRadioChange}
                        name="malalignment" />
                      <label class="form-check-label" for="flexRadioCariousTooth1">
                        Yes
                      </label>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div class="form-check formcheckset">
                      <input class="form-check-input" type="radio"
                        id="malalignment"
                        value="1" // Assuming you want the string value
                        checked={malalignment === "1"} onChange={handleRadioChange}
                        name="malalignment" />
                      <label class="form-check-label" for="flexRadioCariousTooth2">
                        No
                      </label>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <input className="form-control inputdental" placeholder='Mention'
                      value={dentalform.malalignment_remark}
                      onChange={handleChange}
                      name="malalignment_remark" />
                  </div>
                </div>
              </div>

              <div className="card cardcheckdental">
                <div className="row datapaddding">
                  <div className="col-md-3">
                    <h6 className='dentalpoints'>Orthodontic Treatment</h6>
                  </div>
                  <div className="col-md-3">
                    <div class="form-check formcheckset">
                      <input class="form-check-input" type="radio"
                        id="orthodontic_treatment"
                        value={2}
                        onChange={handleRadioChange}
                        name="orthodontic_treatment"
                        checked={orthodontic === "2"}
                      />
                      <label class="form-check-label" for="flexRadioCariousTooth1">
                        Yes
                      </label>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div class="form-check formcheckset">
                      <input class="form-check-input" type="radio"
                        id="orthodontic_treatment"
                        value={1}
                        onChange={handleRadioChange}
                        name="orthodontic_treatment"
                        checked={orthodontic === "1"}
                      />
                      <label class="form-check-label" for="flexRadioCariousTooth2">
                        No
                      </label>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <input className="form-control inputdental" placeholder='Mention'
                      value={dentalform.orthodontic_treatment_remark}
                      onChange={handleChange}
                      name="orthodontic_treatment_remark" />
                  </div>
                </div>
              </div>

              {/* <div className="row">
                <div className="col-md-12">
                  <div className="card dentalht">
                    <h6 className='Specialist'>Reffered To Surgery *</h6>
                    <div className="row p-2 mb-2">
                      <div className="col-md-3">
                        <div class="form-check formcheckset">
                          <input class="form-check-input" type="radio"
                            id="referred_to_surgery"
                            value="1" // Assuming you want the string value
                            checked={reffered === "1"} onChange={handleRadioChange}
                            name="referred_to_surgery" />
                          <label class="form-check-label" for="flexRadioCariousRefferedYes">
                            Yes
                          </label>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div class="form-check formcheckset">
                          <input class="form-check-input" type="radio"
                            id="referred_to_surgery"
                            value="2" // Assuming you want the string value
                            checked={reffered === "2"} onChange={handleRadioChange}
                            name="referred_to_surgery" />
                          <label class="form-check-label" for="flexRadioCariousRefferedNo">
                            No
                          </label>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <input placeholder='Mention' className='form-control inputdental'
                          value={dentalform.reffered_to_specialist_remark}
                          onChange={handleChange}
                          name="referred_to_surgery_remark" />
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}

              <div className="card cardcheckdental">
                <div className="row datapaddding">
                  <div className="col-md-3">
                    <h6 className='dentalpoints'>Referred To Specialist</h6>
                  </div>

                  <div className="col-md-3">
                    <div className="form-check formcheckset">
                      <input
                        className="form-check-input"
                        type="radio"
                        id="referred_to_specialist_yes"
                        value={1}
                        checked={referredToSpecialist === 1}
                        onChange={handleRadioChange}
                        name="reffered_to_specialist"  // Changed name attribute
                      />
                      <label className="form-check-label" htmlFor="referred_to_specialist_yes">
                        Yes
                      </label>
                    </div>
                  </div>

                  <div className="col-md-3">
                    <div className="form-check formcheckset">
                      <input
                        className="form-check-input"
                        type="radio"
                        id="referred_to_specialist_no"
                        value={2}
                        checked={referredToSpecialist === 2}
                        onChange={handleRadioChange}
                        name="reffered_to_specialist"  // Changed name attribute
                      />
                      <label className="form-check-label" htmlFor="referred_to_specialist_no">
                        No
                      </label>
                    </div>
                  </div>

                  <div className="col-md-3">
                    <input
                      className="form-control inputdental"
                      placeholder='Mention'
                      value={dentalform.reffered_to_specialist_remark}
                      onChange={handleChange}
                      name="reffered_to_specialist_remark"
                    />
                  </div>
                </div>
              </div>
            </>
          )
        }

        <div className="row datapaddding">
          <>
            {/* <div className="col-md-6"> */}
            <div className="col-md-6">
              <label className="visually-hidden remarkdental">Comment</label>
              <input className='form-control inputdental11' placeholder='Remark'
                value={dentalform.comment}
                onChange={handleChange}
                name="comment" />
            </div>
            <div className="col-md-6">
              <label className="visually-hidden remarkdental">Treatment given</label>
              <input className='form-control inputdental11' placeholder='Remark'
                value={dentalform.treatment_given}
                onChange={handleChange}
                name="treatment_given" />
            </div>
            {/* </div> */}
          </>
        </div>

        <div className="col-md-4">
          <label className="Visually-hidden labelpsychological">Dental Condition</label>
          <input
            className="form-control inputpsychoremark"
            name="dental_conditions"
            value={dentalform.dental_conditions || overall}
            readOnly
          />
        </div>

        {/* <div className="col-md-12">
          <label className="Visually-hidden labelpsychological">Dental</label>

          <div className="row">
            <div className="col-md-4">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                style={{
                  width: '100%',
                  transform: `scale(${zoom})`,
                  transformOrigin: 'center center',
                }}
              />
            </div>

            <div className="col-md-2">
              <div className="row">
                <Button variant="contained" onClick={capture} sx={{ marginBottom: '10px' }}>
                  <CameraAltIcon onClick={capture} />
                </Button>
              </div>

              <div className="row">
                <Button variant="contained" component="label">
                  <FileUploadIcon />
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleFileUpload}
                  />
                </Button>
              </div>
            </div>

            <div className="col-md-4">
              {imageSrc && (
                <img src={imageSrc} alt="Captured" style={{ width: '100%' }} />
              )}
              <Button variant="contained" color="primary" style={{ marginTop: '10px' }} onClick={handleSubmitImage}
              >
                Submit
              </Button>
            </div>

          </div>

          <div className="row">
            {loading ? (
              <div className="row">Loading...</div>
            ) : (
              <div className="row">
                <h6>Analysis:</h6>
                <br />
                {responseText.English.split(' ').map((word, index) => (
                  <span key={index} style={{ display: 'inline-block', margin: '3px',marginTop:'20px' }}>
                    {word}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div> */}

        <div className="row">
          <button type='submit' className='btn btn-sm dentalbutton'>Accept</button>
        </div>

      </form>
    </div>


  )
}

export default Dental
