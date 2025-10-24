import React, { useState, useEffect } from 'react';
import './ViewFollowup.css'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddFollowUp = () => {
    const accessToken = localStorage.getItem('token');

    const Port = process.env.REACT_APP_API_KEY;
    const [options, setOptions] = useState([]);

    ////////////// GET API
    const { citizenId, scheduleId, pkId } = useParams();
    console.log("Citizen ID:", citizenId);
    console.log("Schedule ID:", scheduleId);
    console.log("pk id:", pkId);

    const [fetchFollowUpData, setFetchFollowUpData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${Port}/Screening/follow_up_citizen_get_idwise/${citizenId}/${scheduleId}/`, {
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
    }, [Port, citizenId, scheduleId]);

    //////////// POST API
    const [formData, setFormData] = useState({
        call_status: '',
        conversational_remarks: '',
        visit_status: '',
        not_visited_reason: '',
        schedule_date: null,
        condition_improved: '',
        weight_gain_status: '',
        forward_to: '',
        priority: '',
        visited_status: '',
        remark: '',
        reschedule_date1: null,
        follow_up: null,
        reschedule_date2: null,
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const citizenId = fetchFollowUpData[0].citizen_id;
        const scheduleId = fetchFollowUpData[0].schedule_id;
        const citizenName = fetchFollowUpData[0].citizen_name;
        const contactNumber = fetchFollowUpData[0].parents_no;
        const dob = fetchFollowUpData[0].dob;
        const state = fetchFollowUpData[0].state;
        const district = fetchFollowUpData[0].district;
        const tehsil = fetchFollowUpData[0].tehsil;
        const source_name = fetchFollowUpData[0].source_name;

        const updatedFormData = {
            ...formData,
            citizen_id: citizenId,
            schedule_id: scheduleId,
            name: citizenName,
            parents_no: contactNumber,
            dob: dob,
            state: state,
            district: district,
            tehsil: tehsil,
            source_name: source_name,
        };

        try {
            const response = await axios.post(`http://103.186.133.168:9001/Screening/followup/${pkId}/`, updatedFormData, {
                headers: {
                  Authorization: `Bearer ${accessToken}`
                }
              });
            console.log('Response:', response.data);
            navigate('/mainscreen/Follow-Up');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const response = await fetch(`${Port}/Screening/follow_status/`);
                const data = await response.json();
                setOptions(data);
            }
            catch (error) {
                console.log('Error while fetching data', error)
            }
        }
        fetchOptions();
    }, [])

    return (
        <div>
            <div className="content-wrapper" style={{ marginTop: '3.5em' }}>

                <form onSubmit={handleSubmit}>
                    <div className="card m-2" style={{ backgroundColor: '#313774', color: 'white', height: 'auto' }}>
                        {fetchFollowUpData.length > 0 && (
                            <div class="row">
                                <div class="col-md-12">
                                    <div className="backadd">
                                        <Link to="/mainscreen/Follow-Up">
                                            <ArrowBackIosIcon className='signdeskkk' />
                                        </Link>
                                    </div>
                                    <h3 className='viewdekstitle'>Add Follow Up SAM</h3>
                                </div>

                                <div class="col-md-6">
                                    <h5 className='viewdeskbody'>Citizen ID : {fetchFollowUpData[0].citizen_id}</h5>
                                </div>

                                <div class="col-md-6">
                                    <h5 className='viewdeskbody'>Schedule ID : {fetchFollowUpData[0].schedule_id}</h5>
                                </div>

                                <div class="col-md-6">
                                    <h5 className='viewdeskbody'>Citizen Name : {fetchFollowUpData[0].citizen_name}</h5>
                                </div>

                                <div class="col-md-6">
                                    <h5 className='viewdeskbody'>Contact Number : {fetchFollowUpData[0].parents_no}</h5>
                                </div>

                                <div class="col-md-6">
                                    <h5 className='viewdeskbody'>D.O.B :  {fetchFollowUpData[0].dob}</h5>
                                </div>

                                <div class="col-md-6">
                                    <h5 className='viewdeskbody'>State :  {fetchFollowUpData[0].state}</h5>
                                </div>

                                <div class="col-md-6">
                                    <h5 className='viewdeskbody'>District :  {fetchFollowUpData[0].district}</h5>
                                </div>

                                <div class="col-md-6">
                                    <h5 className='viewdeskbody'>Tehsil :  {fetchFollowUpData[0].tehsil}</h5>
                                </div>

                                <div class="col-md-6">
                                    <h5 className='viewdeskbody'>Source Name :  {fetchFollowUpData[0].source_name}</h5>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="card m-2" style={{ backgroundColor: 'white', color: 'white', height: '100%' }}>
                        <div class="row">
                            <div class="col-md-12">
                                <h5 className="addconversational">Conversation Status</h5>
                                <div className="addfollowline"></div>
                            </div>
                        </div>

                        <div class="row ml-1 mb-3">
                            <div className="col-md-3">
                                <label className="alllabeldesk">Call Status :</label>
                                <select className="form-control" name="call_status" value={formData.call_status} onChange={handleChange}>
                                    <option value="">Select Call Status</option>
                                    <option value="connected">Connected</option>
                                    <option value="not-connected">Not Connected</option>
                                </select>
                            </div>

                            {formData.call_status === 'connected' && (
                                <div className="col-md-3">
                                    <label className="alllabeldesk">Conversational Remarks :</label>
                                    <select className="form-control" name="conversational_remarks" value={formData.conversational_conversational_remarks} onChange={handleChange}>
                                        <option>Select Call Status</option>
                                        <option value="answered">Answered</option>
                                        <option value="reschedule">Reschedule Call</option>
                                    </select>
                                </div>
                            )}

                            {formData.conversational_remarks === 'reschedule' && formData.call_status === 'connected' && (
                                <div className="col-md-3 mr-1">
                                    <label className="alllabeldesk">Schedule date :</label>
                                    <input
                                        type="datetime-local"
                                        className="form-control"
                                        name="schedule_date"
                                        value={formData.schedule_date}
                                        onChange={handleChange}
                                    />
                                </div>
                            )}

                            {formData.call_status === 'not-connected' && (
                                <div className="col-md-3">
                                    <label className="alllabeldesk">Not Connected Reason :</label>
                                    <select className="form-control" name="not_connected_reason" value={formData.not_connected_reason} onChange={handleChange}>
                                        <option>Select Call Reason</option>
                                        <option>Not Answered</option>
                                        <option>Not Reachable</option>
                                        <option>Out of Network</option>
                                    </select>
                                </div>
                            )}

                            {formData.conversational_remarks === 'answered' && formData.call_status === 'connected' && (
                                <div className="col-md-3">
                                    <label className="alllabeldesk">Status :</label>
                                    <select className="form-control" name="visit_status" value={formData.visit_status} onChange={handleChange}>
                                        <option>Select Status</option>
                                        <option value="visited">Visited</option>
                                        <option value="not-visited">Not Visited</option>
                                    </select>
                                </div>
                            )}
                        </div>

                        {formData.conversational_remarks === 'answered' && formData.call_status === 'connected' && (
                            <div class="row ml-1 mb-3">
                                <div className="col-md-3">
                                    <label className="alllabeldesk">Condition Improved :</label>
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label className="alllabeldesk">
                                                <input type="radio" name="condition_improved" value="yes" onChange={handleChange} checked={formData.condition_improved === 'yes'} /> Yes
                                            </label>
                                        </div>
                                        <div className="col-md-3">
                                            <label className="alllabeldesk">
                                                <input type="radio" name="condition_improved" value="no" onChange={handleChange} checked={formData.condition_improved === 'no'} /> No
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-3">
                                    <label className="alllabeldesk">Weight Gain Status:</label>
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label className="alllabeldesk">
                                                <input type="radio" name="weight_gain_status" value="yes" onChange={handleChange} checked={formData.weight_gain_status === 'yes'} /> Yes
                                            </label>
                                        </div>
                                        <div className="col-md-3">
                                            <label className="alllabeldesk">
                                                <input type="radio" name="weight_gain_status" value="no" onChange={handleChange} checked={formData.weight_gain_status === 'no'} /> No
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-3">
                                    <label className="alllabeldesk">Forward to:</label>
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label className="alllabeldesk">
                                                <input type="radio" name="forward_to" value="CHO" onChange={handleChange} checked={formData.forward_to === 'CHO'} /> CHO
                                            </label>
                                        </div>
                                        <div className="col-md-4">
                                            <label className="alllabeldesk">
                                                <input type="radio" name="forward_to" value="EXPERT" onChange={handleChange} checked={formData.forward_to === 'EXPERT'} /> Expert
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-3">
                                    <label className="alllabeldesk">Priority :</label>
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label className="alllabeldesk">
                                                <input type="radio" name="priority" value="High" onChange={handleChange} checked={formData.priority === 'High'} /> High
                                            </label>
                                        </div>
                                        <div className="col-md-4">
                                            <label className="alllabeldesk">
                                                <input type="radio" name="priority" value="Medium" onChange={handleChange} checked={formData.priority === 'Medium'} /> Medium
                                            </label>
                                        </div>
                                        <div className="col-md-3">
                                            <label className="alllabeldesk">
                                                <input type="radio" name="priority" value="Low" onChange={handleChange} checked={formData.priority === 'Low'} /> Low
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="row mb-2 ml-1">
                            {formData.visit_status === 'visited' && formData.conversational_remarks === 'answered' && formData.call_status === 'connected' && (
                                <div className="col-md-3 mb-3">
                                    <label className="alllabeldesk">Visited :</label>
                                    <select className="form-control" name="visited_status" onChange={handleChange} value={formData.visited_status}>
                                        <option>Select Call Status</option>
                                        <option>NRC</option>
                                        <option>DOA</option>
                                        <option>DOD</option>
                                    </select>
                                </div>
                            )}

                            {formData.visit_status === 'not-visited' && formData.conversational_remarks === 'answered' && formData.call_status === 'connected' && (
                                <div className="col-md-3">
                                    <label className="alllabeldesk">Not Visited Reason :</label>
                                    <select className="form-control" name="not_visited_reason" value={formData.not_visited_reason} onChange={handleChange}>
                                        <option>Select Call Status</option>
                                        <option>Not Willing</option>
                                        <option>Refused</option>
                                        <option>Health Condition</option>
                                        <option>Due to personal reason</option>
                                        <option value="Reschedule">Reschedule Call</option>
                                    </select>
                                </div>
                            )}

                            {formData.not_visited_reason === 'Reschedule' && formData.call_status === 'connected' && formData.visit_status === 'not-visited' && formData.conversational_remarks === 'answered' && (
                                <div className="col-md-3">
                                    <label className="alllabeldesk">Reschedule date :</label>
                                    <input
                                        name="reschedule_date1"
                                        type="datetime-local"
                                        className="form-control"
                                        value={formData.reschedule_date1}
                                        onChange={handleChange}

                                    />
                                </div>
                            )}

                            <div className="col-md-3">
                                <label className="alllabeldesk">Follow Up :</label>
                                <select className="form-control" name="follow_up" value={formData.follow_up} onChange={handleChange}>
                                    <option>Select Follow Up</option>
                                    {options.map((option) => (
                                        <option key={option.followup_status_pk_id} value={option.followup_status_pk_id}>
                                            {option.followup_status}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {formData.follow_up === 3 && (
                                <div className="col-md-3 mr-1">
                                    <label className="alllabeldesk">Reschedule date :</label>
                                    <input
                                        name="reschedule_date2"
                                        type="datetime-local"
                                        className="form-control"
                                        value={formData.reschedule_date2}
                                        onChange={handleChange}
                                    />
                                </div>
                            )}

                            <div className="col-md-3">
                                <label className="alllabeldesk">Remark :</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder='Remark'
                                    name="remark"
                                    value={formData.remark}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className={`row`}>
                            <button type="submit" className="btn btn-sm addfollowupupsubmit">Submit</button>
                        </div>
                    </div>
                </form>

                {/* <div className="card m-2" style={{ backgroundColor: 'white', color: 'white', height: '100%' }}>
                    <div class="row">
                        <div class="col-md-12">
                            <h5 className="addconversational">Past Follow Up</h5>
                            <div className="addfollowline"></div>
                        </div>
                    </div>
                </div> */}
            </div>
        </div>
    )
}

export default AddFollowUp

