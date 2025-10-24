import React, { useState, useEffect } from 'react';
import './ViewFollowup.css';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const ViewFollowup = () => {
    const accessToken = localStorage.getItem('token');

    const Port = process.env.REACT_APP_API_KEY;
    const [callConnected, setCallConnected] = useState(false);

    const { citizenId } = useParams();
    console.log("pk idddddddddddddddddddddddddddddddd:", citizenId);

    const [fetchFollowUpData, setFetchFollowUpData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${Port}/Screening/followup_citizen_info_get/${citizenId}/`, {
                    headers: {
                      Authorization: `Bearer ${accessToken}`
                    }
                  })
                setFetchFollowUpData(response.data);
                console.log("Fetch Follow Up Data:", response.data);
            }
            catch (error) {
                console.log('Error while fetching data', error)
            }
        };

        fetchData();
    }, [Port, citizenId]);

    const groupedData = fetchFollowUpData.reduce((acc, item) => {
        const followupCount = item.followup_count;
        if (!acc[followupCount]) {
            acc[followupCount] = [];
        }
        acc[followupCount].push(item);
        return acc;
    }, {});

    return (
        <div>
            <div className="content-wrapper" style={{ marginTop: '3.5em' }}>
                <div className="card m-2" style={{ backgroundColor: '#313774', color: 'white', height: 'auto' }}>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="back">
                                <Link to="/mainscreen/Follow-Up">
                                    <ArrowBackIosIcon className='signdeskkk' />
                                </Link>
                            </div>
                            <h3 className='viewdekstitle'>View Follow Up SAM</h3>
                        </div>
                    </div>
                </div>

                <div className="card m-2">
                    <div className="row">
                        <div className="col-md-12">
                            {Object.entries(groupedData).map(([followupCount, group], index) => (
                                <Accordion key={index}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls={`panel${index}-content`}
                                        id={`panel${index}-header`}
                                    >
                                        <Typography>FollowUp {followupCount}</Typography>
                                    </AccordionSummary>

                                    <AccordionDetails>
                                        <div className="row">
                                            {group.map((item, itemIndex) => (
                                                <div key={itemIndex} className="row">
                                                    <div className="col-md-6">
                                                        <h5 className='viewdeskbody'><strong>Call Status :</strong> {item.call_status}</h5>
                                                    </div>

                                                    {
                                                        item.call_status === "not-connected" ?
                                                            (
                                                                <>
                                                                    <div className="col-md-6">
                                                                        <h5 className='viewdeskbody'><strong>Not Connected Reason</strong>: {item.not_connected_reason}</h5>
                                                                    </div>

                                                                    <div className="col-md-6">
                                                                        <h5 className='viewdeskbody'><strong>Close FollowUp</strong>: {item.follow_up}</h5>
                                                                    </div>

                                                                    <div className="col-md-6">
                                                                        <h5 className='viewdeskbody'><strong>Followup Remark :</strong> {item.remark}</h5>
                                                                    </div>
                                                                </>
                                                            )
                                                            :
                                                            (
                                                                <>
                                                                    <div className="col-md-6 ">
                                                                        <h5 className='viewdeskbody'><strong>Conversational Remarks</strong> : {item.conversational_remarks}</h5>
                                                                    </div>

                                                                    {
                                                                        item.conversational_remarks === "answered" ? (
                                                                            <>
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <div className="col-md-6">
                                                                                    <h5 className='viewdeskbody'><strong>Schedule date:</strong> {item.schedule_date}</h5>
                                                                                </div>
                                                                            </>
                                                                        )
                                                                    }

                                                                    <div className="col-md-6">
                                                                        <h5 className='viewdeskbody'><strong>Status:</strong> {item.visit_status}</h5>
                                                                    </div>

                                                                    {
                                                                        item.visit_status === "visited" ? (
                                                                            <>
                                                                                <div className="col-md-6">
                                                                                    <h5 className='viewdeskbody'><strong>Visited:</strong> {item.visited_status}</h5>
                                                                                </div>
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <div className="col-md-6">
                                                                                    <h5 className='viewdeskbody'><strong>Not Visited Reason:</strong> {item.not_visited_reason}</h5>
                                                                                </div>
                                                                            </>
                                                                        )
                                                                    }

                                                                    <div className="col-md-6">
                                                                        <h5 className='viewdeskbody'><strong>Condition Improved:</strong> {item.condition_improved}</h5>
                                                                    </div>

                                                                    <div className="col-md-6">
                                                                        <h5 className='viewdeskbody'><strong>Weight Gain Status:</strong> {item.weight_gain_status}</h5>
                                                                    </div>

                                                                    <div className="col-md-6">
                                                                        <h5 className='viewdeskbody'><strong>Forward To :</strong>  {item.forward_to}</h5>
                                                                    </div>

                                                                    <div className="col-md-6">
                                                                        <h5 className='viewdeskbody'><strong>Priority :</strong>  {item.priority}</h5>
                                                                    </div>

                                                                    <div className="col-md-6">
                                                                        <h5 className='viewdeskbody'><strong>Close Call :</strong>  {item.follow_up}</h5>
                                                                    </div>

                                                                    <div className="col-md-6">
                                                                        <h5 className='viewdeskbody'><strong>Followup Remark :</strong>  {item.remark}</h5>
                                                                    </div>
                                                                </>
                                                            )
                                                    }
                                                </div>
                                            ))}
                                        </div>
                                    </AccordionDetails>
                                </Accordion>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ViewFollowup;
