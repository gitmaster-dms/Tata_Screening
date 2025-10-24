import React, { useState, useEffect } from 'react';
import './Body.css';
import maleImage from '../../../../../Images/human-body-frontal-removebg-preview.png';
import femaleImage from '../../../../../Images/Group 237928.png';
import Head from '../Vitals/Psychological';
import Dental from '../Vitals/Dental';
import Vision from '../Vitals/Vision';
import Auditory from '../Vitals/Auditory';
import MenuIcon from '@mui/icons-material/Menu';
import Immunisation from '../Vitals/Immunisation';
import Childvital from '../Vitals/ChildVital';
import FamilyInfo from '../Vitals/FamilyInfo';
import BmiVital from '../Vitals/BmiVital';
import Vital from '../Vitals/Vital';
import { Link, useLocation } from 'react-router-dom'
import BasicScreen from '../Vitals/BasicScreen';
import MonitorWeightIcon from '@mui/icons-material/MonitorWeight';
import axios from 'axios';
import MedicalInfo from '../Vitals/MedicalInfo';
import InvestigationInfo from '../Vitals/InvestigationInfo';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Pft from '../Vitals/Pft';
import Psychological from '../Vitals/Psychological';
import Other from '../Vitals/Other';

const Body = () => {

  const userID = localStorage.getItem('userID');
  console.log(userID);
  const accessToken = localStorage.getItem('token');
  console.log(accessToken);
  const SourceUrlId = localStorage.getItem('loginSource');
  const SourceNameUrlId = localStorage.getItem('SourceNameFetched');
  console.log('fetched SOurce', SourceUrlId);
  console.log('fetched SOurce Name', SourceNameUrlId);
  const Port = process.env.REACT_APP_API_KEY;
  const [isPopupVisible, setPopupVisible] = useState(false);
  const location = useLocation();
  const { citizensPkId, pkid, year, dob, gender, citizenId, ScreeningCount, citizenidddddddd, scheduleID, sourceID } = location.state;
  const [selectedId, setSelectedId] = useState(null);
  const [selectedGender, setSelectedGender] = useState(gender);
  console.log(gender, 'genderrrrrrrrrrrrrrrrrrrrrrrrrrrr');
  console.log(scheduleID, 'scheduleID');
  console.log(citizenidddddddd, 'new citizen id');

  const [formSubmitValues, setFormSubmitValues] = useState({
    'basic_information': false,
    'family_info': false,
    'bmi_info': false,
    'med_info': false,
    'vital_info': false,
    'dental_info': false,
    'vision_info': false,
    'immunization_info': false,
    'basic_info': false,
    'audit_info': false,
    'psycho_info': false,
    'invest_info': false,
    'pft_info': false,
  });

  const fetchData = async () => {
    try {
      const res = await fetch(`${Port}/Screening/citizen-vital-status/${citizenId}/${ScreeningCount}/`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      const data = await res.json();

      setFormSubmitValues((prevValues) => ({
        ...prevValues,
        basic_information: data?.basic_information?.[0]?.form_submit || false,
        family_info: data?.family_info?.[0]?.form_submit || false,
        bmi_info: data?.bmi_info?.[0]?.form_submit || false,
        vital_info: data?.vital_info?.[0]?.form_submit || false,
        dental_info: data?.dental_info?.[0]?.form_submit || false,
        vision_info: data?.vision_info?.[0]?.form_submit || false,
        immunization_info: data?.immunization_info?.[0]?.form_submit || false,
        basic_info: data?.basic_info?.[0]?.form_submit || false,
        audit_info: data?.audit_info?.[0]?.form_submit || false,
        psycho_info: data?.psycho_info?.[0]?.form_submit || false,
        invest_info: data?.invest_info?.[0]?.form_submit || false,
        pft_info: data?.pft_info?.[0]?.form_submit || false,
        med_info: data?.med_info?.[0]?.form_submit || false,
      }));

    } catch (error) {
      console.error("Error fetching form submit status:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleMenuIconClick = () => {
    setPopupVisible(!isPopupVisible);
  };

  const handlePointClick = (form) => {
    setOpenedPart(form);
  };

  const getBodyImage = () => {
    if (selectedGender === 1) {
      return maleImage;
    } else {
      return femaleImage;
    }
  };

  const getBodyImageClass = () => {
    if (selectedGender === 1) {
      return 'male-body-image';
    } else {
      return 'female-body-image';
    }
  };

  const [progress, setProgress] = useState(0);

  const calculateHeightInFeet = (progress) => {
    const totalHeightInCm = 210;
    const heightInFeet = (progress / 100) * totalHeightInCm;
    return heightInFeet.toFixed(0);
  };

  const calculatedHeight = calculateHeightInFeet(progress);

  const handleProgressChange = (event) => {
    const newProgress = event.target.value;
    setProgress(newProgress);
  };

  const [openedPart, setOpenedPart] = useState('Basic Information');

  const handleAcceptClick = (nextName) => {
    if (nextName) {
      console.log('Handling accept click with:', nextName);
      setOpenedPart(nextName);
    } else {
      console.log('Next Vital not found. Staying on the same page.');
    }
  };

  // const handleAcceptChild = (nextVitalName) => {
  //   console.log("nextVitalName from previous Componenet1:", nextVitalName);
  //   setOpenedPart(nextVitalName);
  //   setEmergencyInfo(nextVitalName);
  // };

  // const [emergencyInfo, setEmergencyInfo] = useState('');
  // const handleGoToBmi = (nextVitalName1) => {
  //   console.log("nextVitalName from previous Componenet2:", nextVitalName1);
  //   setOpenedPart(nextVitalName1);
  //   setBmiVital(nextVitalName1);
  // };

  // const [bmiVital, setBmiVital] = useState('');
  // const handleMoveToVital = (nextVitalName2) => {
  //   console.log("nextVitalName from previous Componenet3:", nextVitalName2);
  //   setOpenedPart(nextVitalName2);
  //   setVital(nextVitalName2);
  // };

  // const [vital, setVital] = useState('');
  // const handleMoveToBasicScreen = (nextVitalName3) => {
  //   console.log("nextVitalName from previous Componenet4:", nextVitalName3);
  //   setOpenedPart(nextVitalName3);
  //   setBasicScreen(nextVitalName3);
  // };

  // const [basicScreen, setBasicScreen] = useState('');
  // const handleMoveToAuditory = (nextVitalName4) => {
  //   console.log("nextVitalName from previous Componenet5:", nextVitalName4);
  //   setOpenedPart(nextVitalName4);
  //   setDental(nextVitalName4);
  // };

  // const [dental, setDental] = useState('');
  // const handleMoveToDental = (nextVitalName5) => {
  //   console.log("nextVitalName from previous Componenet6:", nextVitalName5);
  //   setOpenedPart(nextVitalName5);
  //   setVision(nextVitalName5);
  // };

  // const [vision, setVision] = useState('');
  // const handleMoveToVision = (nextVitalName6) => {
  //   console.log("showing Next after Componenet7:", nextVitalName6);
  //   setOpenedPart(nextVitalName6);
  //   setMedical(nextVitalName6);
  // };

  // const [medical, setMedical] = useState('');
  // const handleGoToMedical = (nextVitalName7) => {
  //   console.log("showing Next after Componenet8:", nextVitalName7);
  //   setOpenedPart(nextVitalName7);
  //   setInvestigation(nextVitalName7);
  // };

  // const [investigation, setInvestigation] = useState('');
  // const handleGoToInvestigation = (nextVitalName8) => {
  //   console.log("fetching COmponenet after investigation:", nextVitalName8);
  //   setOpenedPart(nextVitalName8);
  //   setPft(nextVitalName8);
  // };

  // const [pft, setPft] = useState('');
  // const handleMoveToPft = (nextVitalName9) => {
  //   console.log("showing Next after Componenet9:", nextVitalName9);
  //   setOpenedPart(nextVitalName9);
  //   setPsycho(nextVitalName9);
  // };

  // const [psycho, setPsycho] = useState('');
  // const handleMoveToPsycho = (nextVitalName10) => {
  //   console.log("showing Next after Componenet10:", nextVitalName10);
  //   setOpenedPart(nextVitalName10);
  //   setImmu(nextVitalName10)
  // };

  // const [immu, setImmu] = useState('');
  // const handleMoveToImmunisation = (nextVitalName11) => {
  //   console.log("showing Next after Componenet11:", nextVitalName11);
  //   setOpenedPart(nextVitalName11);
  // };

  //////////////// weight 
  const [isClicked, setIsClicked] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [preCheckbox, setPreCheckbox] = useState([]);
  console.log(preCheckbox, 'kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk');

  const handleClick = () => setIsClicked(!isClicked);

  const handleModalClick = (event) => event.stopPropagation();

  const handleChange = (event) => {
    const value = event.target.value;

    if (/^\d*\.?\d+$/.test(value) && parseFloat(value) > 0 && parseFloat(value) <= 400 || value === '') {
      setInputValue(value);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${Port}/Screening/citizen_auditory_info_get/${pkid}/`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });
        setPreCheckbox(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [Port, pkid]);

  const fetchData1 = async () => {
    try {
      const response = await axios.get(`${Port}/Screening/citizen_auditory_info_get/${pkid}/`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      setPreCheckbox(response.data);
      console.log(response.data, 'recalllllllll');
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const [fetchVital, setFetchVital] = useState([]);
  const [selectedName, setSelectedName] = useState('');
  console.log(selectedName, 'selected Name in the body componenet fetching......');

  useEffect(() => {
    const fetchVitals = async () => {
      try {
        const response = await axios.get(`${Port}/Screening/GET_Schedule_Screening_List/?source=${SourceUrlId}&source_name=${SourceNameUrlId}&schedule_id=${scheduleID}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        // Extract screening_list from response data
        const data = response.data[0].screening_list;
        setFetchVital(data);
        console.log(data, 'fetching Vital List.......');
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchVitals();
  }, []);

  return (
    <div className='backgroundbody'>
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row ">
              <div className="col-md-4 backbodydesignnnnn">
                <div>
                  <div style={{ marginBottom: "-22px" }}>
                    <Link to="/mainscreen/Screening">
                      <ArrowBackIosIcon />
                    </Link>
                  </div>
                  <h6 className="screeninfonamevital">Screening Information</h6>
                  <div className='screningstatusinfo'>
                    <MenuIcon className='menuiconinfo' onClick={handleMenuIconClick} style={{ cursor: 'pointer' }} />Screening Status
                  </div>
                </div>

                <div className="row">
                  {/* ////////// Scale for cm */}
                  <div className="col-md-1 vertical-input-container">
                    {openedPart === 'BMI & Symptoms' ? (
                      <div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={progress}
                          onChange={handleProgressChange}
                        />
                        <div className="scale vertical-scale">
                          <span class="horizontal-span">{calculateHeightInFeet(0)}cm</span>
                          <span class="horizontal-span">{calculateHeightInFeet(14.3)}cm</span>
                          <span class="horizontal-span">{calculateHeightInFeet(28.56)}cm</span>
                          <span class="horizontal-span">{calculateHeightInFeet(42.86)}cm</span>
                          <span class="horizontal-span">{calculateHeightInFeet(57.12)}cm</span>
                          <span class="horizontal-span">{calculateHeightInFeet(71.3)}cm</span>
                          <span class="horizontal-span">{calculateHeightInFeet(85.5)}cm</span>
                          <span class="horizontal-span">{calculateHeightInFeet(100)}cm</span>
                        </div>
                      </div>
                    ) :
                      (
                        <div className="disabled-scale">
                          <span className="disabled-text"></span>
                        </div>
                      )
                    }
                  </div>

                  {/* //////// Body Points */}
                  <div className="col-md-2">
                    <div className="image-container">
                      <img className={`${getBodyImageClass()}`} src={getBodyImage()} alt="Body" />
                      <div className={`circle ${isClicked ? 'clicked' : ''}`} onClick={handleClick}>
                        <MonitorWeightIcon className="movable-button" />
                        {isClicked && (
                          <div className="card cardWeightdatainput" onClick={handleModalClick}>
                            <input
                              type="text"
                              placeholder="Enter Weight"
                              value={inputValue}
                              onChange={handleChange}
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="clickable-point-11" onClick={() => handlePointClick('Vitals')}></div>
                    <div className="clickable-point-22" onClick={() => handlePointClick('Basic Screening')}></div>
                    <div className="clickable-point-33" onClick={() => handlePointClick('BMI & Symptoms')}></div>
                    <div className="clickable-point-44" onClick={() => handlePointClick('Immunisation')}></div>
                    <div className="clickable-point-55" onClick={() => handlePointClick('Auditory')}></div>
                    <div className="clickable-point-66" onClick={() => handlePointClick('Dental')}></div>
                    <div className="clickable-point-77" onClick={() => handlePointClick('Vision')}></div>
                    <div className="clickable-point-88" onClick={() => handlePointClick('Psychological')}></div>
                    <div className="clickable-point-89" onClick={() => handlePointClick('Investigation')}></div>
                  </div>

                  {/* ///////  Menu click Vital Name  /////// */}
                  <div className='col-md-5 popup-container'>
                    {isPopupVisible && (
                      <div className="card cardshiftment popup-content">
                        <div className="row">
                          {/* <div className="col">
                            {Array.isArray(fetchVital) && fetchVital.map((item) => (
                              <div key={item.screening_vitals} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h6
                                  style={{
                                    fontSize: '13px',
                                    margin: '0.2em 0em 0.4em 0.3em',
                                    fontFamily: 'Roboto',
                                    fontWeight: 'bold',
                                    cursor: 'pointer'
                                  }}
                                  onClick={() => {
                                    setOpenedPart(item.screening_list);  // Set the opened part based on the fetched value
                                    setSelectedId(item.screening_vitals); // Store the selected ID
                                    setSelectedName(item.screening_list); // Store the name of the clicked item
                                  }}
                                >
                                  {item.screening_list}
                                </h6>
                                <CheckCircleIcon style={{ fontSize: '20px', color: 'green' }} />
                              </div>
                            ))}
                          </div> */}
                          <div className="col">
                            {Array.isArray(fetchVital) && fetchVital.length > 0 ? (
                              fetchVital.map((item) => (
                                <div
                                  key={item.screening_vitals}
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                  }}
                                >
                                  <h6
                                    style={{
                                      fontSize: '13px',
                                      margin: '0.2em 0em 0.4em 0.3em',
                                      fontFamily: 'Roboto',
                                      fontWeight: 'bold',
                                      cursor: 'pointer',
                                    }}
                                    onClick={() => {
                                      setOpenedPart(item.screening_list);  // Set the opened part based on the fetched value
                                      setSelectedId(item.screening_vitals); // Store the selected ID
                                      setSelectedName(item.screening_list); // Store the name of the clicked item
                                    }}
                                  >
                                    {item.screening_list}
                                  </h6>
                                  {/* <CheckCircleIcon style={{ fontSize: '20px', color: 'green' }} /> */}
                                </div>
                              ))
                            ) : (
                              <p style={{ fontFamily: 'Roboto', fontSize: '13px', fontWeight: 'bold', color: 'gray', margin: '0.5em 0' }}>
                                No vitals found
                              </p>
                            )}
                          </div>

                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-md-8 backdesign">
                {openedPart === 'Basic Information' && (
                  <Childvital citizensPkId={citizensPkId}
                    pkid={pkid} citizenidddddddd={citizenidddddddd} sourceID={sourceID}
                    selectedId={selectedId} fetchVital={fetchVital}
                    selectedName={openedPart}
                    onAcceptClick={handleAcceptClick}
                  />
                )}

                {openedPart === 'Emergency Details' && (
                  <FamilyInfo
                    citizensPkId={citizensPkId}
                    pkid={pkid}
                    citizenidddddddd={citizenidddddddd}
                    sourceID={sourceID}
                    selectedId={selectedId}
                    selectedName={openedPart}
                    fetchVital={fetchVital}
                    onAcceptClick={handleAcceptClick}
                  />
                )}

                {openedPart === 'BMI & Symptoms' && (
                  <BmiVital
                    citizenidddddddd={citizenidddddddd} citizensPkId={citizensPkId}
                    pkid={pkid} calculatedHeight={calculatedHeight}
                    enteredWeight={inputValue} gender={gender} scheduleID={scheduleID}
                    selectedName={openedPart}
                    fetchVital={fetchVital}
                    onAcceptClick={handleAcceptClick}
                  />
                )}

                {openedPart === 'Vital' &&
                  <Vital citizensPkId={citizensPkId} pkid={pkid} year={year}
                    gender={gender} selectedId={selectedId}
                    selectedName={openedPart}
                    fetchVital={fetchVital}
                    onAcceptClick={handleAcceptClick}
                  />
                }

                {openedPart === 'Basic Screening' &&
                  <BasicScreen
                    pkid={pkid} citizensPkId={citizensPkId} gender={gender}
                    scheduleID={scheduleID} citizenidddddddd={citizenidddddddd}
                    selectedId={selectedId}
                    selectedName={openedPart}
                    fetchVital={fetchVital}
                    onAcceptClick={handleAcceptClick}
                  />
                }

                {openedPart === 'Auditory' &&
                  <Auditory
                    pkid={pkid} citizensPkId={citizensPkId}
                    lastview={preCheckbox} recall={fetchData1}
                    selectedName={openedPart}
                    fetchVital={fetchVital}
                    onAcceptClick={handleAcceptClick}
                  />
                }

                {openedPart === 'Dental Check Up' &&
                  <Dental
                    pkid={pkid} citizensPkId={citizensPkId}
                    selectedName={openedPart}
                    fetchVital={fetchVital}
                    scheduleID={scheduleID}
                    citizenId={citizenId}
                    onAcceptClick={handleAcceptClick}
                  />
                }

                {openedPart === 'Vision' &&
                  <Vision
                    pkid={pkid} citizensPkId={citizensPkId}
                    selectedName={openedPart}
                    fetchVital={fetchVital}
                    onAcceptClick={handleAcceptClick}
                  />
                }

                {/* Roshni Code */}
                {openedPart === 'Medical History' &&
                  <MedicalInfo
                    citizensPkId={citizensPkId} pkid={pkid} citizenidddddddd={citizenidddddddd}
                    sourceID={sourceID} selectedId={selectedId}
                    fetchVital={fetchVital}
                    selectedName={openedPart}
                    onAcceptClick={handleAcceptClick}
                  />}

                {openedPart === 'Investigation' &&
                  <InvestigationInfo
                    pkid={pkid} citizensPkId={citizensPkId}
                    selectedName={openedPart}
                    fetchVital={fetchVital}
                    onAcceptClick={handleAcceptClick}
                  />
                }

                {openedPart === 'Pulmonary Function Tests' &&
                  <Pft
                    pkid={pkid} citizensPkId={citizensPkId}
                    fetchVital={fetchVital}
                    selectedName={openedPart}
                    onAcceptClick={handleAcceptClick}
                  />
                }

                {openedPart === 'Psychological Screening' &&
                  <Psychological
                    toggleFormVisibility={setOpenedPart} pkid={pkid} citizensPkId={citizensPkId}
                    selectedName={openedPart}
                    fetchVital={fetchVital}
                    onAcceptClick={handleAcceptClick}
                  />
                }

                {openedPart === 'Immunisation' &&
                  <Immunisation pkid={pkid} citizensPkId={citizensPkId} dob={dob}
                    fetchVital={fetchVital} selectedName={selectedName}
                    onAcceptClick={handleAcceptClick}
                  />}
                {openedPart === 'Other' &&
                  <Other pkid={pkid} citizensPkId={citizensPkId} dob={dob}
                    fetchVital={fetchVital} selectedName={selectedName}
                    onAcceptClick={handleAcceptClick}
                  />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Body;
