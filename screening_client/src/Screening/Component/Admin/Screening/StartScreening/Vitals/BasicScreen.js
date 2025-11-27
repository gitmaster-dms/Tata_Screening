import React, { useEffect, useState, useRef } from 'react'
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
import { Grid, Card, Typography, Box, IconButton } from '@mui/material';
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

const BasicScreen = ({ pkid, citizensPkId, gender, scheduleID, citizenidddddddd, fetchVital, onAcceptClick,basicScreenId }) => {

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

  // useEffect(() => {
  //   const fetchVitalName = async () => {
  //     try {
  //       const response = await axios.get(`${Port}/Screening/GET_Schedule_Screening_sub_vital/?source=${SourceUrlId}&source_name=${SourceNameUrlId}&schedule_id=${scheduleID}`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${accessToken}`
  //           }
  //         });
  //       setSubVitalList(response.data[0].screening_list || []);
  //       console.log(response.data);
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   };

  //   fetchVitalName();
  // }, [Port]);

    useEffect(() => {
    const fetchVitalName = async () => {
      try {
        const response = await axios.get(`${Port}/Screening/Screening_sub_list/?screening_list=${basicScreenId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          });
        // setSubVitalList(response.data[0].screening_list || []);
        setSubVitalList(response.data);
        console.log(response.data,"cdcdcdcdcd");
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


  const scrollRef = useRef(null);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (el) {
      setCanScrollUp(el.scrollTop > 0);
      setCanScrollDown(el.scrollTop + el.clientHeight < el.scrollHeight);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      checkScroll();
      el.addEventListener("scroll", checkScroll);
      return () => el.removeEventListener("scroll", checkScroll);
    }
  }, []);

  const scrollByAmount = (amount) => {
    scrollRef.current.scrollBy({ top: amount, behavior: "smooth" });
  };

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={2}>
          <Card sx={{ height: 'auto', p: 1, backgroundColor: '#0A70B7', borderRadius: "20px" }}>
            <Typography sx={{ fontWeight: 600, fontFamily: "Roboto", fontSize: "16px", color: "white" }}>
              Basic Screening
            </Typography>
            <Box sx={{ position: "relative", width: "100%" }}>
              {canScrollUp && (
                <IconButton
                  size="small"
                  onClick={() => scrollByAmount(-100)}
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 2,
                    bgcolor: "#ffffffff",
                    boxShadow: 1,
                    "&:hover": {
                      bgcolor: "#ffffff",
                    },
                  }}
                >
                  <ArrowDropUpIcon />
                </IconButton>
              )}

              <Box
                ref={scrollRef}
                sx={{
                  maxHeight: "70vh",
                  overflowY: "auto",
                  scrollbarWidth: "none",
                  "&::-webkit-scrollbar": { display: "none" },
                  pt: canScrollUp ? 3 : 0,
                  pb: canScrollDown ? 3 : 0,
                }}
              >
                <Grid container direction="column" spacing={1}>
                  {subVitalList.map((option) => (
                    <Grid item key={option.screening_vitals}>
                      <Box
                        onClick={() =>
                          handleTabClick(option.screening_list, option.basicScreeningPkId)
                        }
                        sx={{
                          p: 0.5,
                          cursor: "pointer",
                          bgcolor:
                            selectedTab === option.screening_list ? "#f1f4f6ff" : null,
                          color: selectedTab === option.screening_list ? "#080707ff" : "#fefefeff",
                          borderRadius: 1,
                          "&:hover": {
                            bgcolor:
                              selectedTab === option.screening_list
                                ? "#f1f4f6ff"
                                : "fefefeff",
                          },
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 500,
                            fontSize: "13px",
                            fontFamily: "Roboto",
                          }}
                        >
                          {option.sub_list}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              {canScrollDown && (
                <IconButton
                  size="small"
                  onClick={() => scrollByAmount(100)}
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 2,
                    bgcolor: "#ffffffff",
                    boxShadow: 1,
                    "&:hover": {
                      bgcolor: "#ffffff",
                    },
                  }}
                >
                  <ArrowDropDownIcon />
                </IconButton>
              )}
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} sm={10}>
          <Box
            sx={{
              maxHeight: "80vh",
              overflowY: "auto",
              pr: 2,
            }}
          >
            <Card sx={{ p: 2, mb: 2, borderRadius: "20px", }}>
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
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default BasicScreen
