import React, { useState, useEffect } from 'react'
import './Psychological.css'
import EditIcon from '@mui/icons-material/Edit';

const Psychological = ({ pkid, citizensPkId, fetchVital, selectedName, onAcceptClick }) => {

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

  const userID = localStorage.getItem('userID');
  console.log(userID);
  const accessToken = localStorage.getItem('token');

  const Port = process.env.REACT_APP_API_KEY;
  const [diffReading, setDiffReading] = useState('');
  const [writing, setWriting] = useState('');
  const [hyper, setHyper] = useState('');
  const [aggressive, setAggressive] = useState('');
  const [urine, setUrine] = useState('');
  const [poorMixing, setPoorMixing] = useState('');
  const [poorEye, setPoorEye] = useState('');
  const [scholostic, setScholostic] = useState('');
  const [overall, setOverall] = useState('');
  const [referredToSpecialist, setReferredToSpecialist] = useState(null);
  // const [confirmationChecked, setConfirmationChecked] = useState(false);
  console.log('referredToSpecialist:', referredToSpecialist);

  const calculateOverall = () => {
    const values = [
      diffReading,
      writing,
      hyper,
      aggressive,
      urine,
      poorMixing,
      poorEye,
      scholostic,
    ];

    const countGood = values.filter((value) => value === '1').length;
    const countBad = values.filter((value) => value === '2').length;

    if (values.every(value => value === '0')) {
      return null;
    }

    let calculatedOverall = '';

    if (countGood >= 5) {
      calculatedOverall = 'Good';
    } else if (countGood >= 3 && countGood <= 5) {
      calculatedOverall = 'Fair';
    } else {
      calculatedOverall = 'Bad';
    }

    // Handling '2' values
    if (countBad >= 5) {
      calculatedOverall = 'Bad';
    } else if (countBad < 3) {
      calculatedOverall = 'Good';
    } else if (countBad >= 3 && countBad < 5) {
      calculatedOverall = 'Fair';
    }

    return calculatedOverall;
  };

  // const calculateOverall = () => {
  //   const values = [
  //     diffReading,
  //     writing,
  //     hyper,
  //     aggressive,
  //     urine,
  //     poorMixing,
  //     poorEye,
  //     scholostic,
  //   ];

  //   const countGood = values.filter((value) => value === '1').length;
  //   const countBad = values.filter((value) => value === '2').length;

  //   let calculatedOverall = '';

  //   if (countGood >= 5) {
  //     calculatedOverall = 'Good';
  //   } else if (countGood >= 3 && countGood <= 5) {
  //     calculatedOverall = 'Fair';
  //   } else {
  //     calculatedOverall = 'Bad';
  //   }

  //   // Handling '2' values
  //   if (countBad >= 5) {
  //     calculatedOverall = 'Bad';
  //   } else if (countBad < 3) {
  //     calculatedOverall = 'Good';
  //   } else if (countBad >= 3 && countBad < 5) {
  //     calculatedOverall = 'Fair';
  //   }

  //   return calculatedOverall;
  // };

  const handleRadioChange = (event) => {
    const { name, value } = event.target;

    if (name === 'reffered_to_specialist') {
      setReferredToSpecialist(parseInt(value));
    }
    else {
      switch (name) {
        case 'diff_in_read':
          setDiffReading(value);
          break;
        case 'diff_in_write':
          setWriting(value);
          break;
        case 'hyper_reactive':
          setHyper(value);
          break;
        case 'aggresive':
          setAggressive(value);
          break;
        case 'urine_stool':
          setUrine(value);
          break;
        case 'peers':
          setPoorMixing(value);
          break;
        case 'poor_contact':
          setPoorEye(value);
          break;
        case 'scholastic':
          setScholostic(value);
          break;
        // case 'reffered_to_specialist':
        //   setReferredToSpecialist(value);
        //   break;
        default:
          break;
      }
    }

    const calculatedOverall = calculateOverall();
    setOverall(calculatedOverall);

    // Update psycho conditions based on the updated radio button values
    updatePsychoConditions(calculatedOverall);
  };

  const updatePsychoConditions = (updatedOverall) => {
    setPsycho((prevState) => ({
      ...prevState,
      pycho_conditions: updatedOverall,
    }));
  };

  const [psychoForm, setPsycho] = useState({
    diff_in_read_text: '',
    diff_in_write_text: '',
    hyper_reactive_text: '',
    aggresive_text: '',
    urine_stool_text: '',
    peers_text: '',
    poor_contact_text: '',
    scholastic_text: '',
    any_other: '',
    pycho_conditions: "",
  })

  const handleChange = (event) => {
    const { name, value } = event.target;

    setPsycho((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isConfirmed = window.confirm('Are you sure you want to end the screening?');

    const confirmationStatus = isConfirmed ? 'True' : 'False';

    const calculatedOverall = calculateOverall();

    const formData = {
      ...psychoForm,
      diff_in_read: diffReading,
      diff_in_write: writing,
      hyper_reactive: hyper,
      aggresive: aggressive,
      urine_stool: urine,
      peers: poorMixing,
      poor_contact: poorEye,
      scholastic: scholostic,
      // pycho_conditions: calculatedOverall,
      pycho_conditions: calculatedOverall !== null ? calculatedOverall : null,
      citizen_pk_id: citizensPkId,
      form_submit: confirmationStatus,
      added_by: userID,
      modify_by: userID,
      reffered_to_specialist: referredToSpecialist,
    };

    console.log('Form Data:', formData);

    try {
      const response = await fetch(`${Port}/Screening/citizen_pycho_info_post/${pkid}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        if (response.status === 200) {
          // alert('Screening Completed Successfully');
          console.log('Server Response:', data);
          onAcceptClick(nextName);
        }
        // else {
        //   alert(`Error: ${data.message || 'Unknown error'}`);
        //   console.error('Server Error:', data);
        // }
      } else {
        alert(`Error: ${response.status} - ${response.statusText}`);
        console.error('Server Error:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error sending data:', error.message);
    }
  };

  const fetchDataById = async (pkid) => {
    try {
      const response = await fetch(`${Port}/Screening/citizen_pycho_info_get/${pkid}/`, {
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
          const psychoData = data[0];

          setPsycho((prevState) => ({
            ...prevState,
            diff_in_read_text: psychoData.diff_in_read_text,
            diff_in_write_text: psychoData.diff_in_write_text,
            hyper_reactive_text: psychoData.hyper_reactive_text,
            aggresive_text: psychoData.aggresive_text,
            urine_stool_text: psychoData.urine_stool_text,
            peers_text: psychoData.peers_text,
            poor_contact_text: psychoData.poor_contact_text,
            scholastic_text: psychoData.scholastic_text,
            any_other: psychoData.any_other,
            pycho_conditions: psychoData.pycho_conditions || overall,
          }));

          setReferredToSpecialist(psychoData.reffered_to_specialist);
          setDiffReading(psychoData.diff_in_read.toString());
          setWriting(psychoData.diff_in_write.toString());
          setHyper(psychoData.hyper_reactive.toString());
          setAggressive(psychoData.aggresive.toString());
          setUrine(psychoData.urine_stool.toString());
          setPoorMixing(psychoData.peers.toString());
          setPoorEye(psychoData.poor_contact.toString());
          setScholostic(psychoData.scholastic.toString());
          setOverall(psychoData.any_other.toString());
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
          <div className="card psychologicalcard">
            <h5 className="psychologicaltitle">Psychological Screening</h5>
            {/* <EditIcon onClick={handleEditClick} className="editvitalheader" /> Edit icon from Material-UI */}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card cardpaddingpyschovital">
          <div className="row">
            <div className="col-md-4">
              <h6 className='psychologicalpoints'>Difficulty In Reading</h6>
            </div>

            <div className="col-md-2">
              <div className="form-check formchecksetpsycho">
                <input
                  className="form-check-input"
                  type="radio"
                  name="diff_in_read"
                  id="diff_in_read_yes"
                  value="2"
                  checked={diffReading === "2"}
                  onChange={handleRadioChange}
                />
                <label className="form-check-label" htmlFor="diff_in_read_yes">
                  Yes
                </label>
              </div>
            </div>

            <div className="col-md-2">
              <div className="form-check formchecksetpsycho">
                <input
                  className="form-check-input"
                  type="radio"
                  name="diff_in_read"
                  id="diff_in_read_no"
                  value="1" // Assuming you want the string value
                  checked={diffReading === "1"}
                  onChange={handleRadioChange}
                />
                <label className="form-check-label" htmlFor="diff_in_read_no">
                  No
                </label>
              </div>
            </div>

            <div className="col-md-4">
              <input
                className="form-control inputpsycho"
                placeholder='Mention'
                name="diff_in_read_text"
                value={psychoForm.diff_in_read_text}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="card cardpaddingpyschovital">
          <div className="row">
            <div className="col-md-4">
              <h6 className='psychologicalpoints'>Difficulty In Writing</h6>
            </div>
            <div className="col-md-2">
              <div class="form-check formchecksetpsycho">
                <input class="form-check-input" type="radio"
                  name="diff_in_write"
                  id="diff_in_write"
                  value="2" // Assuming you want the string value
                  checked={writing === "2"}
                  onChange={handleRadioChange} />
                <label class="form-check-label" for="flexRadioDifficultyWritingYes">
                  Yes
                </label>
              </div>
            </div>
            <div className="col-md-2">
              <div class="form-check formchecksetpsycho">
                <input class="form-check-input" type="radio"
                  name="diff_in_write"
                  id="diff_in_write"
                  value="1" // Assuming you want the string value
                  checked={writing === "1"} onChange={handleRadioChange} />
                <label class="form-check-label" for="flexRadioDifficultyWritingNo">
                  No
                </label>
              </div>
            </div>
            <div className="col-md-4">
              <input className="form-control inputpsycho" placeholder='Mention'
                name="diff_in_write_text"
                value={psychoForm.diff_in_write_text}
                onChange={handleChange} />
            </div>
          </div>
        </div>

        <div className="card cardpaddingpyschovital">
          <div className="row">
            <div className="col-md-4">
              <h6 className='psychologicalpoints'>Hyper Reactive Behaviour</h6>
            </div>
            <div className="col-md-2">
              <div className="form-check formchecksetpsycho">
                <input
                  className="form-check-input"
                  type="radio"
                  name="hyper_reactive"
                  id="hyper_reactive_yes"
                  value="2"
                  checked={hyper === "2"}
                  onChange={handleRadioChange}
                />
                <label className="form-check-label" htmlFor="hyper_reactive_yes">
                  Yes
                </label>
              </div>
            </div>
            <div className="col-md-2">
              <div className="form-check formchecksetpsycho">
                <input
                  className="form-check-input"
                  type="radio"
                  name="hyper_reactive"
                  id="hyper_reactive_no"
                  value="1"
                  checked={hyper === "1"}
                  onChange={handleRadioChange}
                />
                <label className="form-check-label" htmlFor="hyper_reactive_no">
                  No
                </label>
              </div>
            </div>
            <div className="col-md-4">
              <input
                className="form-control inputpsycho"
                placeholder='Mention'
                name="hyper_reactive_text"
                value={psychoForm.hyper_reactive_text}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="card cardpaddingpyschovital">
          <div className="row">
            <div className="col-md-4">
              <h6 className='psychologicalpoints'>Aggressive Behaviour</h6>
            </div>
            <div className="col-md-2">
              <div className="form-check formchecksetpsycho">
                <input
                  className="form-check-input"
                  type="radio"
                  name="aggresive"
                  id="aggresive_yes"
                  value="2"
                  checked={aggressive === "2"}
                  onChange={handleRadioChange}
                />
                <label className="form-check-label" htmlFor="aggresive_yes">
                  Yes
                </label>
              </div>
            </div>
            <div className="col-md-2">
              <div className="form-check formchecksetpsycho">
                <input
                  className="form-check-input"
                  type="radio"
                  name="aggresive"
                  id="aggresive_no"
                  value="1"
                  checked={aggressive === "1"}
                  onChange={handleRadioChange}
                />
                <label className="form-check-label" htmlFor="aggresive_no">
                  No
                </label>
              </div>
            </div>
            <div className="col-md-4">
              <input
                className="form-control inputpsycho"
                placeholder='Mention'
                name="aggresive_text"
                value={psychoForm.aggresive_text}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="card cardpaddingpyschovital">
          <div className="row">
            <div className="col-md-4">
              <h6 className='psychologicalpoints'>Passing Urine/Stool (Bed/Classroom)</h6>
            </div>
            <div className="col-md-2">
              <div className="form-check formchecksetpsycho">
                <input
                  className="form-check-input"
                  type="radio"
                  name="urine_stool"
                  id="urine_stool_yes"
                  value="2"
                  checked={urine === "2"}
                  onChange={handleRadioChange}
                />
                <label className="form-check-label" htmlFor="urine_stool_yes">
                  Yes
                </label>
              </div>
            </div>
            <div className="col-md-2">
              <div className="form-check formchecksetpsycho">
                <input
                  className="form-check-input"
                  type="radio"
                  name="urine_stool"
                  id="urine_stool_no"
                  value="1"
                  checked={urine === "1"}
                  onChange={handleRadioChange}
                />
                <label className="form-check-label" htmlFor="urine_stool_no">
                  No
                </label>
              </div>
            </div>
            <div className="col-md-4">
              <input
                className="form-control inputpsycho"
                placeholder='Mention'
                name="urine_stool_text"
                value={psychoForm.urine_stool_text}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="card cardpaddingpyschovital">
          <div className="row">
            <div className="col-md-4">
              <h6 className='psychologicalpoints'>Poor Mixing With Peers</h6>
            </div>
            <div className="col-md-2">
              <div className="form-check formchecksetpsycho">
                <input
                  className="form-check-input"
                  type="radio"
                  name="peers"
                  id="peers_yes"
                  value="2"
                  checked={poorMixing === "2"}
                  onChange={handleRadioChange}
                />
                <label className="form-check-label" htmlFor="peers_yes">
                  Yes
                </label>
              </div>
            </div>
            <div className="col-md-2">
              <div className="form-check formchecksetpsycho">
                <input
                  className="form-check-input"
                  type="radio"
                  name="peers"
                  id="peers_no"
                  value="1"
                  checked={poorMixing === "1"}
                  onChange={handleRadioChange}
                />
                <label className="form-check-label" htmlFor="peers_no">
                  No
                </label>
              </div>
            </div>
            <div className="col-md-4">
              <input
                className="form-control inputpsycho"
                placeholder='Mention'
                name="peers_text"
                value={psychoForm.peers_text}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="card cardpaddingpyschovital">
          <div className="row">
            <div className="col-md-4">
              <h6 className='psychologicalpoints'>Poor Eye Contact</h6>
            </div>
            <div className="col-md-2">
              <div className="form-check formchecksetpsycho">
                <input
                  className="form-check-input"
                  type="radio"
                  name="poor_contact"
                  id="poor_contact_yes"
                  value="2"
                  checked={poorEye === "2"}
                  onChange={handleRadioChange}
                />
                <label className="form-check-label" htmlFor="poor_contact_yes">
                  Yes
                </label>
              </div>
            </div>
            <div className="col-md-2">
              <div className="form-check formchecksetpsycho">
                <input
                  className="form-check-input"
                  type="radio"
                  name="poor_contact"
                  id="poor_contact_no"
                  value="1"
                  checked={poorEye === "1"}
                  onChange={handleRadioChange}
                />
                <label className="form-check-label" htmlFor="poor_contact_no">
                  No
                </label>
              </div>
            </div>
            <div className="col-md-4">
              <input
                className="form-control inputpsycho"
                placeholder='Mention'
                name="poor_contact_text"
                value={psychoForm.poor_contact_text}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="card cardpaddingpyschovital">
          <div className="row">
            <div className="col-md-4">
              <h6 className='psychologicalpoints'>Scholastic Backwardness</h6>
            </div>
            <div className="col-md-2">
              <div className="form-check formchecksetpsycho">
                <input
                  className="form-check-input"
                  type="radio"
                  name="scholastic"
                  id="scholastic_yes"
                  value="2"
                  checked={scholostic === "2"}
                  onChange={handleRadioChange}
                />
                <label className="form-check-label" htmlFor="scholastic_yes">
                  Yes
                </label>
              </div>
            </div>
            <div className="col-md-2">
              <div className="form-check formchecksetpsycho">
                <input
                  className="form-check-input"
                  type="radio"
                  name="scholastic"
                  id="scholastic_no"
                  value="1"
                  checked={scholostic === "1"}
                  onChange={handleRadioChange}
                />
                <label className="form-check-label" htmlFor="scholastic_no">
                  No
                </label>
              </div>
            </div>
            <div className="col-md-4">
              <input
                className="form-control inputpsycho"
                placeholder='Mention'
                name="scholastic_text"
                value={psychoForm.scholastic_text}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <label className="Visually-hidden labelpsychological">Any Other</label>
            <input className="form-control inputpsychoremark" placeholder='Mention '
              name="any_other"
              value={psychoForm.any_other}
              onChange={handleChange} />
          </div>

          <div className="col-md-6">
            <label className="Visually-hidden labelpsychological">Psychological Condition</label>
            <input
              className="form-control inputpsychoremark"
              name="pycho_conditions"
              // value={psychoForm.pycho_conditions || overall}
              value={psychoForm.pycho_conditions !== null ? psychoForm.pycho_conditions : null}
              readOnly
            />
          </div>
        </div>

        <div className="row mb-3 mt-3">
          <div className="col-md-4">
            <h6 className="specialistedrefrresedd">Referred To Specialist</h6>
          </div>

          <div className="col-md-1">
            <input
              className="form-check-input"
              type="radio"
              id="yes"
              name="reffered_to_specialist"
              value={1}
              checked={referredToSpecialist === 1}
              onChange={handleRadioChange}
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
              onChange={handleRadioChange}
            />
            <label className="form-check-label" htmlFor="no">
              No
            </label>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <button type="submit" className="btn btn-sm btnpsychological">Accept</button>
          </div>
        </div>

      </form>
    </div>
  )
}

export default Psychological
