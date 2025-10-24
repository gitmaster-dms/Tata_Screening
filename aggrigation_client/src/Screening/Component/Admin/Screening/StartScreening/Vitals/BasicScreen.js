import React, { useEffect, useState } from 'react'
import './BasicScreen.css'
import Generalexam from './BasiScreen/Generalexam'
import Systematic from './BasiScreen/Systematic'
import Disiability from './BasiScreen/Disiability'
import Birthdefect from './BasiScreen/Birthdefect'
import Childhood from './BasiScreen/Childhood'
import Difieciency from './BasiScreen/Difieciency'
import Skin from './BasiScreen/Skin'
import Checkbox from './BasiScreen/Checkbox'
import Diagnosis from './BasiScreen/Diagnosis'
import Treatment from './BasiScreen/Treatment'
import Femalescreening from './BasiScreen/Femalescreening'
import BadHabits from './BasiScreen/BadHabits'
import axios from 'axios';

const BasicScreen = ({ pkid, citizensPkId, gender, scheduleID, citizenidddddddd, fetchVital, onAcceptClick }) => {

  const Port = process.env.REACT_APP_API_KEY;
  const userID = localStorage.getItem('userID');
  console.log(userID);
  console.log(scheduleID, 'scheduleIDddd');
  console.log(citizenidddddddd, 'aaaaaaaaj');
  const userGroup = localStorage.getItem('usergrp');
  const SourceUrlId = localStorage.getItem('loginSource');
  const SourceNameUrlId = localStorage.getItem('SourceNameFetched');
  const accessToken = localStorage.getItem('token');
  const [subVitalList, setSubVitalList] = useState([])
  const [selectedTab, setSelectedTab] = useState('General Examination');
  const [basicScreeningPkId, setBasicScreeningPkId] = useState(null);

  useEffect(() => {
    console.log('User Group:', userGroup);
  }, [userGroup]);

  useEffect(() => {
    const fetchVitalName = async () => {
      try {
        const response = await axios.get(`${Port}/Screening/GET_Schedule_Screening_sub_vital/?source=${SourceUrlId}&source_name=${SourceNameUrlId}&schedule_id=${scheduleID}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          });
        setSubVitalList(response.data[0].screening_list || []);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchVitalName();
  }, [Port]);

  const handleTabClick = (tabName, basicScreeningPkId) => {
    if (gender === 1 && selectedTab === 'Treatment' && tabName === 'Female Child Screening') {
      return;
    }

    setSelectedTab(tabName);
    setBasicScreeningPkId(basicScreeningPkId);
  };

  const handleAcceptClick = (nextName, basicScreeningPkId) => {
    if (nextName) {
      console.log('Handling accept click with:', nextName, basicScreeningPkId);
      setSelectedTab(nextName);
    } else {
      console.log('Next Vital not found. Staying on the same page.');
    }

  };

  return (
    <div>
      <div className="row scroll mb-3">
        <div className="col-md-2" style={{ height: "auto" }}>
          <div className="card generalcard" style={{ height: "100%" }}>
            <div style={{ height: "100%" }}>
              <h5 className="basictitle">Basic Screening</h5>
              <div>
                {subVitalList.map((option) => (
                  <div key={option.screening_vitals} onClick={() => handleTabClick(option.screening_list, option.basicScreeningPkId)}>
                    <h5 className={`generaltitle ${selectedTab === option.screening_list ? 'selected-general' : ''}`}>
                      {option.screening_list}
                    </h5>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>

        <div className="col-md-10">
          <div className="card basicscreentabbbbb" style={{ height: "100%" }}>
            {selectedTab ? (
              <div className="content contenttype" id="generalContent">
                {selectedTab === 'General Examination' && (
                  <Generalexam
                    pkid={pkid}
                    citizensPkId={citizensPkId} scheduleID={scheduleID} citizenidddddddd={citizenidddddddd}

                    onAcceptClick={handleAcceptClick}
                    selectedTab={selectedTab} subVitalList={subVitalList}
                  />
                )}

                {selectedTab === 'Treatment' && (
                  <Treatment pkid={pkid} citizensPkId={citizensPkId}
                    basicScreeningPkId={basicScreeningPkId} scheduleID={scheduleID} citizenidddddddd={citizenidddddddd}
                    // onAcceptClick={(tabName, basicScreeningPkId) => handleTabClick(tabName, basicScreeningPkId)}
                    onAcceptClick={handleAcceptClick}
                    selectedTab={selectedTab} subVitalList={subVitalList}
                  />
                )}

                {selectedTab === 'Systemic Exam' && (
                  <Systematic pkid={pkid} citizensPkId={citizensPkId}
                    basicScreeningPkId={basicScreeningPkId} scheduleID={scheduleID} citizenidddddddd={citizenidddddddd}
                    // onAcceptClick={(tabName, basicScreeningPkId) => handleTabClick(tabName, basicScreeningPkId)} 
                    onAcceptClick={handleAcceptClick}
                    selectedTab={selectedTab} subVitalList={subVitalList}
                  />
                )}

                {selectedTab === 'Disability Screening' && (
                  <Disiability pkid={pkid} citizensPkId={citizensPkId}
                    basicScreeningPkId={basicScreeningPkId} scheduleID={scheduleID} citizenidddddddd={citizenidddddddd}
                    // onAcceptClick={(tabName, basicScreeningPkId) => handleTabClick(tabName, basicScreeningPkId)}  
                    onAcceptClick={handleAcceptClick}
                    selectedTab={selectedTab} subVitalList={subVitalList}
                  />
                )}

                {selectedTab === 'Birth Defects' && (
                  <Birthdefect pkid={pkid} citizensPkId={citizensPkId} citizenidddddddd={citizenidddddddd}
                    basicScreeningPkId={basicScreeningPkId} scheduleID={scheduleID}
                    // onAcceptClick={(tabName, basicScreeningPkId) => handleTabClick(tabName, basicScreeningPkId)} 
                    onAcceptClick={handleAcceptClick}
                    selectedTab={selectedTab} subVitalList={subVitalList}
                  />
                )}

                {selectedTab === 'Childhood disease' && (
                  <Childhood pkid={pkid} citizensPkId={citizensPkId} citizenidddddddd={citizenidddddddd}
                    basicScreeningPkId={basicScreeningPkId} scheduleID={scheduleID}
                    // onAcceptClick={(tabName, basicScreeningPkId) => handleTabClick(tabName, basicScreeningPkId)}
                    onAcceptClick={handleAcceptClick}
                    selectedTab={selectedTab} subVitalList={subVitalList}
                  />
                )}

                {selectedTab === 'Deficiencies' && (
                  <Difieciency pkid={pkid} citizensPkId={citizensPkId} citizenidddddddd={citizenidddddddd}
                    basicScreeningPkId={basicScreeningPkId} scheduleID={scheduleID}
                    // onAcceptClick={(tabName, basicScreeningPkId) => handleTabClick(tabName, basicScreeningPkId)}
                    onAcceptClick={handleAcceptClick}
                    selectedTab={selectedTab} subVitalList={subVitalList}
                  />
                )}

                {selectedTab === 'Skin Condition' && (
                  <Skin pkid={pkid} citizensPkId={citizensPkId} citizenidddddddd={citizenidddddddd}
                    basicScreeningPkId={basicScreeningPkId} scheduleID={scheduleID}
                    // onAcceptClick={(tabName, basicScreeningPkId) => handleTabClick(tabName, basicScreeningPkId)} 
                    onAcceptClick={handleAcceptClick}
                    selectedTab={selectedTab} subVitalList={subVitalList}
                  />
                )}

                {selectedTab === 'Check Box if Normal' && (
                  <Checkbox pkid={pkid} citizensPkId={citizensPkId} citizenidddddddd={citizenidddddddd}
                    basicScreeningPkId={basicScreeningPkId} scheduleID={scheduleID}
                    // onAcceptClick={(tabName, basicScreeningPkId) => handleTabClick(tabName, basicScreeningPkId)}
                    onAcceptClick={handleAcceptClick}
                    selectedTab={selectedTab} subVitalList={subVitalList}
                  />
                )}

                {selectedTab === 'Diagnosis' && (
                  <Diagnosis pkid={pkid} citizensPkId={citizensPkId} citizenidddddddd={citizenidddddddd}
                    basicScreeningPkId={basicScreeningPkId} scheduleID={scheduleID}
                    // onAcceptClick={(tabName, basicScreeningPkId) => handleTabClick(tabName, basicScreeningPkId)}
                    onAcceptClick={handleAcceptClick}
                    selectedTab={selectedTab} subVitalList={subVitalList}
                  />
                )}

                {
                  selectedTab === 'Female Child Screening' && (
                    <Femalescreening pkid={pkid} citizensPkId={citizensPkId} citizenidddddddd={citizenidddddddd}
                      basicScreeningPkId={basicScreeningPkId} scheduleID={scheduleID}
                      // onAcceptClick={(tabName, basicScreeningPkId) => handleTabClick(tabName, basicScreeningPkId)}
                      onAcceptClick={handleAcceptClick}
                      selectedTab={selectedTab} subVitalList={subVitalList}
                    />
                  )
                }
                {
                  selectedTab === 'Bad Habit' && (
                    <BadHabits pkid={pkid} citizensPkId={citizensPkId} citizenidddddddd={citizenidddddddd}
                      basicScreeningPkId={basicScreeningPkId} scheduleID={scheduleID}
                      // onAcceptClick={(tabName, basicScreeningPkId) => handleTabClick(tabName, basicScreeningPkId)}
                      onAcceptClick={handleAcceptClick}
                      selectedTab={selectedTab} subVitalList={subVitalList}
                    />
                  )
                }

              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BasicScreen
