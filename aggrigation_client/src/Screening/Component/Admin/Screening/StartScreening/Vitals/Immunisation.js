import React, { useEffect, useState } from 'react'
import './Immunisation.css';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';

const Immunisation = ({ pkid, citizensPkId, dob, fetchVital, selectedName, onAcceptClick }) => {

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


  const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);
  const accessToken = localStorage.getItem('token');

  const userID = localStorage.getItem('userID');
  console.log(userID);

  const [immunizationData, setImmunizationData] = useState([]);
  const [apiError, setApiError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);

  const Port = process.env.REACT_APP_API_KEY;
  console.log('jhasgdhjdgjh', dob);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${Port}/Screening/get_immunisation/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setData(response.data);
        console.log("All GET", response.data);
      } catch (error) {
        console.log(error, 'error fetching Data');
      }
    };

    fetchData();
  }, [Port]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${Port}/Screening/citizen_immunisation_info_get/${pkid}/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setData1(response.data);
        console.log("Id Wise Data", response.data);
      } catch (error) {
        console.log(error, 'error fetching Data');
      }
    };

    fetchData();
  }, [Port, pkid]);

  useEffect(() => {
    console.log("Updated State (data1):", data1);
  }, [data1]); // This effect will only run when data1 changes

  useEffect(() => {
    setImmunizationData(data.map(item => ({
      immunisations: item.immunisations,
      given_yes_no: '',
      scheduled_date_from: item.scheduled_date_from || '', // Set default value only if data is present
      scheduled_date_to: item.scheduled_date_to || '',     // Set default value only if data is present
      window_period_days_from: item.window_period_days_from || '',     // Set default value only if data is present
      window_period_days_to: item.window_period_days_to || '',     // Set default value only if data is present
    })));
  }, [data]);

  const handleInputChange = async (index, field, value, i_pk_id) => {
    const newData = [...immunizationData];
    console.log('Disabling dates');
    if (newData[index]) {
      newData[index][field] = value;

      // Disable both 'Scheduled date from' and 'Scheduled date to' for 'Already Taken'
      if (field === 'given_yes_no' && (value === '1' || value === '2')) {
        newData[index]['scheduled_date_from'] = '';
        newData[index]['scheduled_date_to'] = '';
      }

      // Trigger API call when 'Not Yet Taken' is selected
      if (field === 'given_yes_no' && value === '3') {
        try {
          // Make your API call here, for example:
          const response = await axios.get(`${Port}/Screening/calculate_days/${dob}/${i_pk_id}/`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          // Handle the API response, you can set it to a state variable or show an alert
          console.log(response.data);
          setApiResponse(response.data.status);
          setShowModal(true);
          // onMoveToVital('auditorysection');

        } catch (error) {
          // Handle API error, you can set it to a state variable or show an alert
          console.error('API Error:', error);
          setApiError('Error fetching data from the API');
          setShowModal(true);
        }
      }

      setImmunizationData(newData);
    } else {
      console.error(`Index ${index} does not exist in newData`);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setApiResponse(null);
    setApiError(null);
  };

  const handleSave = async () => {
    const isConfirmed = window.confirm('Submit Immunisation Form');

    const confirmationStatus = isConfirmed ? 'True' : 'False';
    const selectedData = immunizationData.filter(item => item.given_yes_no !== '');
    try {
      const response = await axios.post(`${Port}/Screening/citizen_immunisation_info_post/${pkid}`, {
        name_of_vaccine: selectedData,
        citizen_pk_id: citizensPkId,
        form_submit: confirmationStatus,
        modify_by: userID,
        added_by: userID
      }
        ,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });

      if (response.status === 201) {
        const responseData = response.data;
        console.log('Data posted successfully:', responseData);
        onAcceptClick(nextName);
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error during data posting:', error);
    }
  };

  return (
    <div>
      <Modal show={showModal}>
        <Modal.Body>
          <p className='text-center'>{apiResponse}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="row">
        <div className="col-md-12">
          <div className="card immunisationheadcard">
            <h5 className="immutitle">Immunisation</h5>
          </div>
        </div>
      </div>
      {apiError && <div className="alert alert-danger">{apiError}</div>}
      <div className="row">
        <table className="table table-borderless">
          <thead className="">
            <tr className="card cardheaduserhealthcard">
              <th className="col">
                <h6 className='immunisationheadtile'> Name of vaccine scheduled</h6>
              </th>
              <th className="col">
                <h6 className='immunisationheadtile'> Given yes/no</h6>
              </th>
              <th className="col">
                <h6 className='immunisationheadtile'> Scheduled date from to To</h6>
              </th>
              <th className="col">
                <h6 className='immunisationheadtile'> Window Period Days From</h6>
              </th>
              <th className="col">
                <h6 className='immunisationheadtile'> Window Period Days To</h6>
              </th>
            </tr>
          </thead>
          <tbody>
            {
              data1.length > 0 ? (
                data1.map((item, index) => (
                  item.name_of_vaccine.map((vaccine, innerIndex) => (
                    <tr className="card cardbodyuserhealthcard" key={`${index}-${innerIndex}`}>
                      <td className="col">
                        <h6 className='vitaltitleimmunisation'>{vaccine.immunisations}</h6>
                      </td>

                      <td className="col">
                        <select
                          className="form-control form-control-sm selectimmu"
                          aria-label="Small select example"
                          onChange={(e) => handleInputChange(index, 'given_yes_no', e.target.value, vaccine.immunization_info_pk_id)}
                          value={vaccine.given_yes_no} // Set the value based on API response
                        >
                          <option value="">select menu</option>
                          <option value="1">Already Taken</option>
                          <option value="2">Already Taken(ODR)</option>
                          <option value="3">Not Yet Taken</option>
                        </select>
                      </td>

                      <td className="col">
                        <input
                          className="form-control form-control-sm datinputimmu"
                          type="date"
                          style={{
                            backgroundColor:
                              immunizationData[index]?.given_yes_no === '1'
                                ? '#90EE90'
                                : immunizationData[index]?.given_yes_no === '2'
                                  ? '#FFC000'
                                  : immunizationData[index]?.given_yes_no === '3'
                                    ? '#FF726F'
                                    : '',
                          }}
                          onChange={(e) => handleInputChange(index, 'scheduled_date_from', e.target.value, vaccine.immunisation_pk_id)}
                          value={immunizationData[index]?.scheduled_date_from || vaccine.scheduled_date_from}  // Use API response value
                          max={
                            immunizationData[index]?.given_yes_no === '1' || immunizationData[index]?.given_yes_no === '2'
                              ? new Date().toISOString().split('T')[0]
                              : undefined
                          }
                          min={
                            immunizationData[index]?.given_yes_no === '3'
                              ? new Date().toISOString().split('T')[0]
                              : undefined
                          }
                        />
                        <input
                          style={{
                            backgroundColor:
                              immunizationData[index]?.given_yes_no === '3'
                                ? '#FF726F'
                                : '',
                          }}
                          className="form-control form-control-sm datinputimmu"
                          onChange={(e) => handleInputChange(index, 'scheduled_date_to', e.target.value)}
                          type="date"
                          disabled={immunizationData[index]?.given_yes_no === '1' || immunizationData[index]?.given_yes_no === '2'}
                          value={immunizationData[index]?.scheduled_date_to || vaccine.scheduled_date_to}  // Use API response value
                          max={
                            immunizationData[index]?.given_yes_no === '1' || immunizationData[index]?.given_yes_no === '2'
                              ? new Date().toISOString().split('T')[0]
                              : undefined
                          }
                          min={
                            immunizationData[index]?.given_yes_no === '3'
                              ? new Date().toISOString().split('T')[0]
                              : undefined
                          }
                        />
                      </td>

                      <td className="col">
                        <p>{vaccine.window_period_days_from || '-'}</p>
                      </td>

                      <td className="col">
                        <p>{vaccine.window_period_days_to || '-'}</p>
                      </td>
                    </tr>
                  ))
                ))
              ) : (
                data.map((row, index) => (
                  <tr className="card cardbodyuserhealthcard" key={index}>
                    <td className="col">
                      <h6 className='vitaltitleimmunisation'>{row.immunisations}</h6>
                    </td>
                    <td className="col">
                      <select
                        className="form-control form-control-sm selectimmu"
                        aria-label="Small select example"
                        onChange={(e) => handleInputChange(index, 'given_yes_no', e.target.value, row.immunisation_pk_id)}
                      >
                        <option value="">select menu</option>
                        <option value="1">Already Taken</option>
                        <option value="2">Already Taken(ODR)</option>
                        <option value="3">Not Yet Taken</option>
                      </select>
                    </td>
                    <td className="col">
                      <input
                        className="form-control form-control-sm datinputimmu"
                        type="date"
                        style={{
                          backgroundColor:
                            immunizationData[index]?.given_yes_no === '1'
                              ? '#90EE90'
                              : immunizationData[index]?.given_yes_no === '2'
                                ? '#FFC000'
                                : immunizationData[index]?.given_yes_no === '3'
                                  ? '#FF726F'
                                  : '',
                        }}
                        onChange={(e) => handleInputChange(index, 'scheduled_date_from', e.target.value, row.immunisation_pk_id)}
                        value={immunizationData[index]?.scheduled_date_from || ''}
                        max={
                          immunizationData[index]?.given_yes_no === '1' || immunizationData[index]?.given_yes_no === '2'
                            ? new Date().toISOString().split('T')[0]
                            : undefined
                        }

                        min={
                          immunizationData[index]?.given_yes_no === '3'
                            ? new Date().toISOString().split('T')[0]
                            : undefined
                        }

                      />
                      <input
                        style={{
                          backgroundColor:
                            immunizationData[index]?.given_yes_no === '3'
                              ? '#FF726F'
                              : '',
                        }}
                        className="form-control form-control-sm datinputimmu"
                        onChange={(e) => handleInputChange(index, 'scheduled_date_to', e.target.value)}
                        type="date"
                        disabled={immunizationData[index]?.given_yes_no === '1' || immunizationData[index]?.given_yes_no === '2'}
                        value={immunizationData[index]?.scheduled_date_to || ''}
                        max={
                          immunizationData[index]?.given_yes_no === '1' || immunizationData[index]?.given_yes_no === '2'
                            ? new Date().toISOString().split('T')[0]
                            : undefined
                        }

                        min={
                          immunizationData[index]?.given_yes_no === '3'
                            ? new Date().toISOString().split('T')[0]
                            : undefined
                        }
                      />
                    </td>
                    <td className="col">
                      <p>{row.window_period_days_from}</p>
                    </td>
                    <td className="col">
                      <p>{row.window_period_days_to}</p>
                    </td>
                  </tr>
                ))
              )
            }
          </tbody>
        </table>

        <div className='d-flex justify-content-center my-4'>
          <button className='immunisationvitalbutton btn btn-sm' type='button' onClick={handleSave} style={{ backgroundColor: '#313774', color: '#ffffff' }}>Submit</button>
        </div>
      </div>
    </div>
  );
};


export default Immunisation
