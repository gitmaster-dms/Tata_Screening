import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Systematic = ({ pkid, onAcceptClick, citizensPkId, selectedTab, subVitalList }) => {

    //_________________________________START
    console.log(selectedTab, 'Present name');
    console.log(subVitalList, 'Overall GET API');
    const [nextName, setNextName] = useState('');

    useEffect(() => {
        if (subVitalList && selectedTab) {
            const currentIndex = subVitalList.findIndex(item => item.screening_list === selectedTab);

            console.log('Current Index:', currentIndex);

            if (currentIndex !== -1 && currentIndex < subVitalList.length - 1) {
                const nextItem = subVitalList[currentIndex + 1];
                const nextName = nextItem.screening_list;
                setNextName(nextName);
                console.log('Next Name Set:', nextName);
            } else {
                setNextName('');
                console.log('No next item or selectedTab not found');
            }
        }
    }, [selectedTab, subVitalList]);
    //_________________________________END


    // console.log('Systematic ID :', basicScreeningPkId);
    const basicScreeningPkId = localStorage.getItem('basicScreeningId');
    console.log('Retrieved Basic Id from Local Storage:', basicScreeningPkId);

    //// access the source from local storage
    const source = localStorage.getItem('source');
    ////////////////////////////////////

    const userID = localStorage.getItem('userID');
    console.log(userID);
    const accessToken = localStorage.getItem('token'); // Retrieve access token
    const Port = process.env.REACT_APP_API_KEY;
    //////////////// systematic exam 
    const [rsright, setRsright] = useState([]);
    const [rsleft, setRsleft] = useState([]);
    const [cvs, setCvs] = useState([]);
    const [varicose, setVaricose] = useState([]);
    const [lmp, setLmp] = useState([]);
    const [cns, setCns] = useState([]);
    const [reflexes, setReflexes] = useState([]);
    const [romberg, setRomberg] = useState([]);
    const [pupils, setPupils] = useState([]);
    const [pa, setPa] = useState([]);
    const [tenderness, setTenderness] = useState([]);
    const [ascitis, setAscitis] = useState([]);
    const [guarding, setGuarding] = useState([]);
    const [joints, setJoints] = useState([]);
    const [swollen, setSwollen] = useState([]);
    const [spine, setSpine] = useState([]);

    console.log(basicScreeningPkId, 'Systematic Exam');

    const [systematicExam, setSystematicExam] = useState({
        rs_right: null,
        rs_left: null,
        cvs: null,
        varicose_veins: null,
        lmp: null,
        cns: null,
        reflexes: null,
        rombergs: null,
        pupils: null,
        p_a: null,
        tenderness: null,
        ascitis: null,
        guarding: null,
        joints: null,
        swollen_joints: null,
        spine_posture: null,
        modify_by: userID,
        discharge: '',
        genito_urinary: '',
        hydrocele: '',
        cervical: '',
        axilla: '',
        inguinal: '',
        thyroid: ''
    });

    const fetchDataById = async (pkid) => {
        try {
            const response = await fetch(`${Port}/Screening/citizen_basic_screening_info_get/${pkid}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                if (Array.isArray(data) && data.length > 0) {
                    const treatmentData = data[0];
                    setSystematicExam((prevState) => ({
                        ...prevState,
                        rs_right: treatmentData.rs_right,
                        rs_left: treatmentData.rs_left,
                        cvs: treatmentData.cvs,
                        varicose_veins: treatmentData.varicose_veins,
                        lmp: treatmentData.lmp,
                        cns: treatmentData.cns,
                        reflexes: treatmentData.reflexes,
                        rombergs: treatmentData.rombergs,
                        pupils: treatmentData.pupils,
                        pa: treatmentData.pa,
                        tenderness: treatmentData.tenderness,
                        ascitis: treatmentData.ascitis,
                        guarding: treatmentData.guarding,
                        joints: treatmentData.joints,
                        swollen_joints: treatmentData.swollen_joints,
                        spine_posture: treatmentData.spine_posture,
                        discharge: treatmentData.discharge,
                        genito_urinary: treatmentData.genito_urinary,
                        hydrocele: treatmentData.hydrocele,
                        cervical: treatmentData.cervical,
                        axilla: treatmentData.axilla,
                        inguinal: treatmentData.inguinal,
                        thyroid: treatmentData.thyroid
                    }));
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

    const handleChange = (event) => {
        const { name, value } = event.target;

        setSystematicExam((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = {
            ...systematicExam,

        };

        console.log('Form Data:', formData);

        try {
            const response = await fetch(`${Port}/Screening/symmetric_exam/${basicScreeningPkId}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`, // Include the authorization header
                },
                body: JSON.stringify(formData),
            });

            if (window.confirm('Submit Systematic Form') && response.ok) {
                const data = await response.json();
                console.log('Server Response:', data);

                if (response.status === 200) {
                    const basicScreeningPkId = data.basic_screening_pk_id;
                    localStorage.setItem('basicScreeningId', basicScreeningPkId);
                    console.log('basicScreeningId', basicScreeningPkId);
                    onAcceptClick(nextName, basicScreeningPkId);
                } else if (response.status === 400) {
                    console.error('Bad Request:', data.error);
                } else {
                    console.error('Unhandled Status Code:', response.status);
                }
            } else {
                console.error('Error:', response.status);
            }
        } catch (error) {
            console.error('Error sending data:', error.message);
        }
    };

    // Rs Right
    useEffect(() => {
        const rsrightFetch = async () => {
            try {
                const response = await axios.get(`${Port}/Screening/rs_right/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`, // Include the authorization header
                    },
                });
                setRsright(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        rsrightFetch();
    }, []);

    // Rs left
    useEffect(() => {
        const rsleftFetch = async () => {
            try {
                const response = await axios.get(`${Port}/Screening/rs_left/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`, // Include the authorization header
                    },
                });
                setRsleft(response.data)
            }
            catch (error) {
                console.log(error, 'error fetching Data');
            }
        }
        rsleftFetch();
    }, [])

    // CVS
    useEffect(() => {
        const CVSFetch = async () => {
            try {
                const response = await axios.get(`${Port}/Screening/cvs/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`, // Include the authorization header
                    },
                });
                setCvs(response.data)
            }
            catch (error) {
                console.log(error, 'error fetching Data');
            }
        }
        CVSFetch();
    }, [])

    // Varicose 
    useEffect(() => {
        const VaricoseFetch = async () => {
            try {
                const response = await axios.get(`${Port}/Screening/varicose_veins/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`, // Include the authorization header
                    },
                });
                setVaricose(response.data)
            }
            catch (error) {
                console.log(error, 'error fetching Data');
            }
        }
        VaricoseFetch();
    }, [])

    // LMP 
    useEffect(() => {
        const LMPFetch = async () => {
            try {
                const response = await axios.get(`${Port}/Screening/lmp/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`, // Include the authorization header
                    },
                });
                setLmp(response.data)
            }
            catch (error) {
                console.log(error, 'error fetching Data');
            }
        }
        LMPFetch();
    }, [])

    // CNS 
    useEffect(() => {
        const CNSFetch = async () => {
            try {
                const response = await axios.get(`${Port}/Screening/cns/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`, // Include the authorization header
                    },
                });
                setCns(response.data)
            }
            catch (error) {
                console.log(error, 'error fetching Data');
            }
        }
        CNSFetch();
    }, [])

    // Reflexes 
    useEffect(() => {
        const ReflexesFetch = async () => {
            try {
                const response = await axios.get(`${Port}/Screening/reflexes/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`, // Include the authorization header
                    },
                });
                setReflexes(response.data)
            }
            catch (error) {
                console.log(error, 'error fetching Data');
            }
        }
        ReflexesFetch();
    }, [])

    // Romberg 
    useEffect(() => {
        const RombergFetch = async () => {
            try {
                const response = await axios.get(`${Port}/Screening/rombergs/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`, // Include the authorization header
                    },
                });
                setRomberg(response.data)
            }
            catch (error) {
                console.log(error, 'error fetching Data');
            }
        }
        RombergFetch();
    }, [])

    // Pupils 
    useEffect(() => {
        const PupilsFetch = async () => {
            try {
                const response = await axios.get(`${Port}/Screening/pupils/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`, // Include the authorization header
                    },
                });
                setPupils(response.data)
            }
            catch (error) {
                console.log(error, 'error fetching Data');
            }
        }
        PupilsFetch();
    }, [])

    // PA 
    useEffect(() => {
        const PaFetch = async () => {
            try {
                const response = await axios.get(`${Port}/Screening/pa/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`, // Include the authorization header
                    },
                });
                setPa(response.data)
            }
            catch (error) {
                console.log(error, 'error fetching Data');
            }
        }
        PaFetch();
    }, [])

    // Tenderness 
    useEffect(() => {
        const TendernessFetch = async () => {
            try {
                const response = await axios.get(`${Port}/Screening/tendernes/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`, // Include the authorization header
                    },
                });
                setTenderness(response.data)
            }
            catch (error) {
                console.log(error, 'error fetching Data');
            }
        }
        TendernessFetch();
    }, [])

    // Ascitis 
    useEffect(() => {
        const AscitisFetch = async () => {
            try {
                const response = await axios.get(`${Port}/Screening/ascitis/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`, // Include the authorization header
                    },
                });
                setAscitis(response.data)
            }
            catch (error) {
                console.log(error, 'error fetching Data');
            }
        }
        AscitisFetch();
    }, [])

    // Guarding 
    useEffect(() => {
        const GuardingFetch = async () => {
            try {
                const response = await axios.get(`${Port}/Screening/guarding/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`, // Include the authorization header
                    },
                });
                setGuarding(response.data)
            }
            catch (error) {
                console.log(error, 'error fetching Data');
            }
        }
        GuardingFetch();
    }, [])

    // Joints 
    useEffect(() => {
        const JointsFetch = async () => {
            try {
                const response = await axios.get(`${Port}/Screening/joints/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`, // Include the authorization header
                    },
                });
                setJoints(response.data)
            }
            catch (error) {
                console.log(error, 'error fetching Data');
            }
        }
        JointsFetch();
    }, [])

    // Swollen  
    useEffect(() => {
        const SwollenFetch = async () => {
            try {
                const response = await axios.get(`${Port}/Screening/swollen_joints/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`, // Include the authorization header
                    },
                });
                setSwollen(response.data)
            }
            catch (error) {
                console.log(error, 'error fetching Data');
            }
        }
        SwollenFetch();
    }, [])

    // Spine 
    useEffect(() => {
        const SpineFetch = async () => {
            try {
                const response = await axios.get(`${Port}/Screening/spine_posture/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`, // Include the authorization header
                    },
                });
                setSpine(response.data)
            }
            catch (error) {
                console.log(error, 'error fetching Data');
            }
        }
        SpineFetch();
    }, [])

    return (
        <div>
            <h5 className="vitaltitlebasicscreen">Systemic Exam</h5>
            <div className="elementvital"></div>

            <form onSubmit={handleSubmit}>
                <div className='row headeskinvital'>
                    <div className="col-md-4">
                        <label className="Visually-hidden basicscreenheadline">RS Right</label>
                        <select className="form-control form-select form-select-sm selectdropexam"
                            onChange={handleChange}
                            name="rs_right"
                            value={systematicExam.rs_right}>
                            <option selected>Select</option>
                            {
                                rsright.map((drop) => (
                                    <option key={drop.rs_right_id} value={drop.rs_right_id}>
                                        {drop.rs_right}
                                    </option>
                                ))
                            }
                        </select>
                    </div>

                    <div className="col-md-4">
                        <label className="Visually-hidden basicscreenheadline">RS Left</label>
                        <select className="form-control form-select form-select-sm selectdropexam"
                            onChange={handleChange}
                            name="rs_left"
                            value={systematicExam.rs_left}>
                            <option selected>Select</option>
                            {
                                rsleft.map((drop) => (
                                    <option key={drop.rs_left_id} value={drop.rs_left_id}>
                                        {drop.rs_left}
                                    </option>
                                ))
                            }
                        </select>
                    </div>

                    <div className="col-md-4">
                        <label className="Visually-hidden basicscreenheadline">CVS</label>
                        <select className="form-control form-select form-select-sm selectdropexam"
                            onChange={handleChange}
                            name="cvs"
                            value={systematicExam.cvs}>
                            <option selected>Select</option>
                            {
                                cvs.map((drop) => (
                                    <option key={drop.cvs_id} value={drop.cvs_id}>
                                        {drop.cvs}
                                    </option>
                                ))
                            }
                        </select>
                    </div>

                    <div className='col-md-4'>
                        <label className="Visually-hidden basicscreenheadline">Varicose Veins</label>
                        <select class="form-control form-select-lg mb-3 selectdropexam"
                            onChange={handleChange}
                            name="varicose_veins"
                            value={systematicExam.varicose_veins}>
                            <option className='selecttag' selected>Select</option>
                            {
                                varicose.map((drop) => (
                                    <option key={drop.varicose_veins_id} value={drop.varicose_veins_id}>
                                        {drop.varicose_veins}
                                    </option>
                                ))
                            }
                        </select>
                    </div>

                    {
                        source === '1' && (
                            <>
                                <div className='col-md-4'>
                                    <label className="Visually-hidden basicscreenheadline">LMP</label>
                                    <select class="form-control form-select-lg mb-3 selectdropexam"
                                        onChange={handleChange}
                                        name="lmp"
                                        value={systematicExam.lmp}>
                                        <option selected>Select</option>
                                        {
                                            lmp.map((drop) => (
                                                <option key={drop.lmp_id} value={drop.lmp_id}>
                                                    {drop.lmp}
                                                </option>
                                            ))
                                        }
                                    </select>
                                </div>
                            </>
                        )
                    }

                    <div className='col-md-4'>
                        <label className="Visually-hidden basicscreenheadline">CNS</label>
                        <select class="form-control form-select-lg mb-3 selectdropexam"
                            onChange={handleChange}
                            name="cns"
                            value={systematicExam.cns}>
                            <option selected>Select</option>
                            {
                                cns.map((drop) => (
                                    <option key={drop.cns_id} value={drop.cns_id}>
                                        {drop.cns}
                                    </option>
                                ))
                            }
                        </select>
                    </div>

                    <div className="col-md-4">
                        <label className="Visually-hidden basicscreenheadline">Reflexes</label>
                        <select className="form-control form-select form-select-sm selectdropexam"
                            onChange={handleChange}
                            name="reflexes"
                            value={systematicExam.reflexes}>
                            <option selected>Select</option>
                            {
                                reflexes.map((drop) => (
                                    <option key={drop.reflexes_id} value={drop.reflexes_id}>
                                        {drop.reflexes}
                                    </option>
                                ))
                            }
                        </select>
                    </div>

                    <div className="col-md-4">
                        <label className="Visually-hidden basicscreenheadline">Romberg's</label>
                        <select className="form-control form-select form-select-sm selectdropexam"
                            onChange={handleChange}
                            name="rombergs"
                            value={systematicExam.rombergs}>
                            <option selected>Select</option>
                            {
                                romberg.map((drop) => (
                                    <option key={drop.rombergs_id} value={drop.rombergs_id}>
                                        {drop.rombergs}
                                    </option>
                                ))
                            }
                        </select>
                    </div>

                    <div className="col-md-4">
                        <label className="Visually-hidden basicscreenheadline">Pupils</label>
                        <select className="form-control form-select form-select-sm selectdropexam"
                            onChange={handleChange}
                            name="pupils"
                            value={systematicExam.pupils}>
                            <option selected>Select</option>
                            {
                                pupils.map((drop) => (
                                    <option key={drop.pupils_id} value={drop.pupils_id}>
                                        {drop.pupils}
                                    </option>
                                ))
                            }
                        </select>
                    </div>

                    <div className="col-md-4">
                        <label className="Visually-hidden basicscreenheadline">P/A</label>
                        <select className="form-control form-select form-select-sm selectdropexam"
                            onChange={handleChange}
                            name="pa"
                            value={systematicExam.pa}>
                            <option selected>Select</option>
                            {
                                pa.map((drop) => (
                                    <option key={drop.pa_id} value={drop.pa_id}>
                                        {drop.pa}
                                    </option>
                                ))
                            }
                        </select>
                    </div>

                    <div className="col-md-4">
                        <label className="Visually-hidden basicscreenheadline">Tenderness</label>
                        <select className="form-control form-select form-select-sm selectdropexam"
                            onChange={handleChange}
                            name="tenderness"
                            value={systematicExam.tenderness}>
                            <option selected>Select</option>
                            {
                                tenderness.map((drop) => (
                                    <option key={drop.tenderness_id} value={drop.tenderness_id}>
                                        {drop.tenderness}
                                    </option>
                                ))
                            }
                        </select>
                    </div>

                    <div className="col-md-4">
                        <label className="Visually-hidden basicscreenheadline">Ascitis</label>
                        <select className="form-control form-select form-select-sm selectdropexam"
                            onChange={handleChange}
                            name="ascitis"
                            value={systematicExam.ascitis}>
                            <option selected>Select</option>
                            {
                                ascitis.map((drop) => (
                                    <option key={drop.ascitis_id} value={drop.ascitis_id}>
                                        {drop.ascitis}
                                    </option>
                                ))
                            }
                        </select>
                    </div>

                    <div className='col-md-4'>
                        <label className="Visually-hidden basicscreenheadline">Guarding</label>
                        <select class="form-control form-select-lg mb-3 selectdropexam"
                            onChange={handleChange}
                            name="guarding"
                            value={systematicExam.guarding}>
                            <option className='selecttag' selected>Select</option>
                            {
                                guarding.map((drop) => (
                                    <option key={drop.guarding_id} value={drop.guarding_id}>
                                        {drop.guarding}
                                    </option>
                                ))
                            }
                        </select>
                    </div>

                    {
                        source === '1' && (
                            <>
                                <div className='col-md-4'>
                                    <label className="Visually-hidden basicscreenheadline">Joints</label>
                                    <select class="form-control form-select-lg mb-3 selectdropexam"
                                        onChange={handleChange}
                                        name="joints"
                                        value={systematicExam.joints}>
                                        <option selected>Select</option>
                                        {
                                            joints.map((drop) => (
                                                <option key={drop.joints_id} value={drop.joints_id}>
                                                    {drop.joints}
                                                </option>
                                            ))
                                        }
                                    </select>
                                </div>

                                <div className="col-md-4">
                                    <label className="Visually-hidden basicscreenheadline">Swollen Joints</label>
                                    <select className="form-control form-select form-select-sm selectdropexam"
                                        onChange={handleChange}
                                        name="swollen_joints"
                                        value={systematicExam.swollen_joints}>
                                        <option selected>Select</option>
                                        {
                                            swollen.map((drop) => (
                                                <option key={drop.swollen_joints_id} value={drop.swollen_joints_id}>
                                                    {drop.swollen_joints}
                                                </option>
                                            ))
                                        }
                                    </select>
                                </div>

                                <div className="col-md-4">
                                    <label className="Visually-hidden basicscreenheadline">Spine/Posture</label>
                                    <select className="form-control form-select form-select-sm selectdropexam"
                                        onChange={handleChange}
                                        name="spine_posture"
                                        value={systematicExam.spine_posture}>
                                        <option selected>Select</option>
                                        {
                                            spine.map((drop) => (
                                                <option key={drop.spine_posture_id} value={drop.spine_posture_id}>
                                                    {drop.spine_posture}
                                                </option>
                                            ))
                                        }
                                    </select>
                                </div>
                            </>
                        )
                    }

                    {/* ////////////////// ADDED Fieldss */}
                    <div className="col-md-4">
                        <label className="Visually-hidden basicscreenheadline">Genito Urinary</label>
                        <select className="form-control form-select form-select-sm selectdropexam"
                            onChange={handleChange}
                            name="discharge"
                            value={systematicExam.discharge}>
                            <option selected>Select</option>
                            <option value="Normal">Normal</option>
                            <option value="Abnormal">Abnormal</option>
                        </select>
                    </div>

                    <div className="col-md-4">
                        <label className="Visually-hidden basicscreenheadline">Discharge</label>
                        <select className="form-control form-select form-select-sm selectdropexam"
                            onChange={handleChange}
                            name="genito_urinary"
                            value={systematicExam.genito_urinary}>
                            <option selected>Select</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>

                    <div className="col-md-4">
                        <label className="Visually-hidden basicscreenheadline">Hydrocele</label>
                        <select className="form-control form-select form-select-sm selectdropexam"
                            onChange={handleChange}
                            name="hydrocele "
                            value={systematicExam.hydrocele}>
                            <option selected>Select</option>
                            <option value="Present">Present</option>
                            <option value="Absent">Absent</option>
                        </select>
                    </div>

                    <div className="col-md-4">
                        <label className="Visually-hidden basicscreenheadline">Cervical</label>
                        <select className="form-control form-select form-select-sm selectdropexam"
                            onChange={handleChange}
                            name="cervical"
                            value={systematicExam.cervical}>
                            <option selected>Select</option>
                            <option value="Palpable">Palpable</option>
                            <option value="Not Palpable">Not Palpable</option>
                        </select>
                    </div>

                    <div className="col-md-4">
                        <label className="Visually-hidden basicscreenheadline">Axilla</label>
                        <select className="form-control form-select form-select-sm selectdropexam"
                            onChange={handleChange}
                            name="axilla"
                            value={systematicExam.axilla}>
                            <option selected>Select</option>
                            <option value="Palpable">Palpable</option>
                            <option value="Not Palpable">Not Palpable</option>
                        </select>
                    </div>

                    <div className="col-md-4">
                        <label className="Visually-hidden basicscreenheadline">Inguinal</label>
                        <select className="form-control form-select form-select-sm selectdropexam"
                            onChange={handleChange}
                            name="inguinal"
                            value={systematicExam.inguinal}>
                            <option selected>Select</option>
                            <option value="Palpable">Palpable</option>
                            <option value="Not Palpable">Not Palpable</option>
                        </select>
                    </div>

                    <div className="col-md-4">
                        <label className="Visually-hidden basicscreenheadline">Thyroid</label>
                        <select className="form-control form-select form-select-sm selectdropexam"
                            onChange={handleChange}
                            name="thyroid"
                            value={systematicExam.thyroid}>
                            <option selected>Select</option>
                            <option value="Palpable">Palpable</option>
                            <option value="Not Palpable">Not Palpable</option>
                        </select>
                    </div>
                </div>

                <div>
                    <button type="submit" className="btn btn-sm generalexambutton">Submit</button>
                </div>
            </form>
        </div>
    )
}

export default Systematic
