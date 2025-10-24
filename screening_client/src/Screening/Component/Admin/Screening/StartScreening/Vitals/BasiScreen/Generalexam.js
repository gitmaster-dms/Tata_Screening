import React, { useState, useEffect } from 'react'
import headpic from '../../../../../../Images/Head Massage Area.png'
import dermatology from '../../../../../../Images/Dermatology.png'
import mouth from '../../../../../../Images/Smiling Mouth.png'
import torso from '../../../../../../Images/Torso.png'
import axios from 'axios'
import './Generalexam.css'

const Generalexam = ({ pkid, onAcceptClick, citizensPkId, citizenidddddddd, selectedTab, subVitalList }) => {

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
    //__________________________________END

    const userID = localStorage.getItem('userID');
    console.log(userID);
    console.log(citizenidddddddd, 'mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm');
    const accessToken = localStorage.getItem('token');

    //// access the source from local storage
    const source = localStorage.getItem('source');
    const Port = process.env.REACT_APP_API_KEY;
    const [headData, setHeadData] = useState([]);
    const [hairData, setHairData] = useState([]);
    const [hairDensity, setHairDensity] = useState([]);
    const [hairTexture, setHairTexture] = useState([]);
    const [alopecia, setAlopecia] = useState([]);
    const [neck, setNeck] = useState([]);
    const [nose, setNose] = useState([]);
    const [skinColor, setSkinColor] = useState([]);
    const [skinTexture, setSkinTexture] = useState([]);
    const [skinLessions, setSkinLessions] = useState([]);
    const [lips, setLips] = useState([]);
    const [gum, setGums] = useState([]);
    const [dention, setdention] = useState([]);
    const [mucosa, setMucosa] = useState([]);
    const [toungue, setToungue] = useState([]);
    const [chest, setChest] = useState([]);
    const [abdomen, setAbdomen] = useState([]);
    const [extremity, setExtremity] = useState([]);

    const [generalExam, setGeneralExam] = useState({
        head: null,
        hair_color: null,
        hair_density: null,
        hair_texture: null,
        alopecia: null,
        neck: null,
        nose: null,
        skin_color: null,
        skin_texture: null,
        skin_lesions: null,
        lips: null,
        gums: null,
        oral_mucosa: null,
        tongue: null,
        dention: null,
        chest: null,
        abdomen: null,
        extremity: null,
        citizen_pk_id: citizensPkId,
        added_by: userID,
        modify_by: userID,
        observation: ''
    });

    const handleChange = (event) => {
        const { name, value } = event.target;

        setGeneralExam((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

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

                // Check if the array has at least one element before accessing properties
                if (Array.isArray(data) && data.length > 0) {
                    const treatmentData = data[0];

                    setGeneralExam((prevState) => ({
                        ...prevState,
                        head: treatmentData.head,
                        hair_color: treatmentData.hair_color,
                        hair_density: treatmentData.hair_density,
                        hair_texture: treatmentData.hair_texture,
                        alopecia: treatmentData.alopecia,
                        neck: treatmentData.neck,
                        nose: treatmentData.nose,
                        skin_color: treatmentData.skin_color,
                        skin_texture: treatmentData.skin_texture,
                        skin_lesions: treatmentData.skin_lesions,
                        lips: treatmentData.lips,
                        gums: treatmentData.gums,
                        oral_mucosa: treatmentData.oral_mucosa,
                        tongue: treatmentData.tongue,
                        dention: treatmentData.dention,
                        chest: treatmentData.chest,
                        abdomen: treatmentData.abdomen,
                        extremity: treatmentData.extremity,
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

    const handleSubmit = async (e) => {

        e.preventDefault();
        const isConfirmed = window.confirm('Submit Basic Screen Form');
        if (!isConfirmed) return;
        const confirmationStatus = isConfirmed ? 'True' : 'False';

        const formData = {
            ...generalExam,
            form_submit: confirmationStatus,
        };

        console.log('Form Data:', formData);

        try {
            const response = await fetch(`${Port}/Screening/citizen_basic_screening_info_post/${pkid}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Server Response:', data);

                // Check if the response contains the basic_screening_pk_id
                const basicScreeningPkId = data.updated_data?.basic_screening_pk_id || data.posted_data?.basic_screening_pk_id;

                if (basicScreeningPkId) {
                    localStorage.setItem('basicScreeningId', basicScreeningPkId);
                    console.log('basicScreeningId:', basicScreeningPkId);
                    onAcceptClick(nextName, basicScreeningPkId);
                } else {
                    console.error('Basic Screening ID not found in response data');
                    // Optionally, handle this case as appropriate
                }
            } else {
                console.error('Error:', response.status);
                // Optionally, show a message to the user
            }
        } catch (error) {
            console.error('Error sending data:', error.message);
        }


    };

    const extractBasicScreeningPkId = (data) => {
        return data.updated_data ? data.updated_data.basic_screening_pk_id : undefined;
    };

    // head
    useEffect(() => {
        const headFetch = async () => {
            try {
                const response = await axios.get(`${Port}/Screening/head_scalp/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`, // Include the authorization header
                    },
                });
                setHeadData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        headFetch();
    }, []);

    // hair color
    useEffect(() => {
        const hairFetch = async () => {
            try {
                const response = await axios.get(`${Port}/Screening/hair_color/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`, // Include the authorization header
                    },
                });
                setHairData(response.data)
            }
            catch (error) {
                console.log(error, 'error fetching Data');
            }
        }
        hairFetch();
    }, [])

    // hair density
    useEffect(() => {
        const hairDensityFetch = async () => {
            try {
                const response = await axios.get(`${Port}/Screening/hair_density/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`, // Include the authorization header
                    },
                });
                setHairDensity(response.data)
            }
            catch (error) {
                console.log(error, 'error fetching Data');
            }
        }
        hairDensityFetch();
    }, [])

    // hair texture
    useEffect(() => {
        const hairDensityFetch = async () => {
            try {
                const response = await axios.get(`${Port}/Screening/hair_texture/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`, // Include the authorization header
                    },
                });
                setHairTexture(response.data)
            }
            catch (error) {
                console.log(error, 'error fetching Data');
            }
        }
        hairDensityFetch();
    }, [])

    // Alopecia
    useEffect(() => {
        const alopeciaFetch = async () => {
            try {
                const response = await axios.get(`${Port}/Screening/alopecia/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`, // Include the authorization header
                    },
                });
                setAlopecia(response.data)
            }
            catch (error) {
                console.log(error, 'error fetching Data');
            }
        }
        alopeciaFetch();
    }, [])

    // Neck
    useEffect(() => {
        const neckFetch = async () => {
            try {
                const response = await axios.get(`${Port}/Screening/neck/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`, // Include the authorization header
                    },
                });
                setNeck(response.data)
            }
            catch (error) {
                console.log(error, 'error fetching Data');
            }
        }
        neckFetch();
    }, [])

    // Neck
    useEffect(() => {
        const noseFetch = async () => {
            try {
                const response = await axios.get(`${Port}/Screening/nose/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`, // Include the authorization header
                    },
                });
                setNose(response.data)
            }
            catch (error) {
                console.log(error, 'error fetching Data');
            }
        }
        noseFetch();
    }, [])

    // Skin color
    useEffect(() => {
        const SkinColourfetch = async () => {
            try {
                const response = await axios.get(`${Port}/Screening/skin_color/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`, // Include the authorization header
                    },
                });
                setSkinColor(response.data)
            }
            catch (error) {
                console.log(error, 'error fetching Data');
            }
        }
        SkinColourfetch();
    }, [])

    // Skin Texture
    useEffect(() => {
        const SkinTexturefetch = async () => {
            try {
                const response = await axios.get(`${Port}/Screening/skin_texture/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`, // Include the authorization header
                    },
                });
                setSkinTexture(response.data)
            }
            catch (error) {
                console.log(error, 'error fetching Data');
            }
        }
        SkinTexturefetch();
    }, [])

    // Skin Lesion
    useEffect(() => {
        const SkinColourfetch = async () => {
            try {
                const response = await axios.get(`${Port}/Screening/skin_lension/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`, // Include the authorization header
                    },
                });
                setSkinLessions(response.data)
            }
            catch (error) {
                console.log(error, 'error fetching Data');
            }
        }
        SkinColourfetch();
    }, [])

    // Lips
    useEffect(() => {
        const lipsFetch = async () => {
            try {
                const response = await axios.get(`${Port}/Screening/lips/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`, // Include the authorization header
                    },
                });
                setLips(response.data)
            }
            catch (error) {
                console.log(error, 'error fetching Data');
            }
        }
        lipsFetch();
    }, [])

    // Gums
    useEffect(() => {
        const gumFetch = async () => {
            try {
                const response = await axios.get(`${Port}/Screening/gums/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`, // Include the authorization header
                    },
                });
                setGums(response.data)
            }
            catch (error) {
                console.log(error, 'error fetching Data');
            }
        }
        gumFetch();
    }, [])

    // dention
    useEffect(() => {
        const dentionFetch = async () => {
            try {
                const response = await axios.get(`${Port}/Screening/dentition/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`, // Include the authorization header
                    },
                });
                setdention(response.data)
            }
            catch (error) {
                console.log(error, 'error fetching Data');
            }
        }
        dentionFetch();
    }, [])

    // Healthy Mucosa
    useEffect(() => {
        const mucosaFetch = async () => {
            try {
                const response = await axios.get(`${Port}/Screening/oral_mucosa/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`, // Include the authorization header
                    },
                });
                setMucosa(response.data)
            }
            catch (error) {
                console.log(error, 'error fetching Data');
            }
        }
        mucosaFetch();
    }, [])

    // toungue
    useEffect(() => {
        const toungueFetch = async () => {
            try {
                const response = await axios.get(`${Port}/Screening/tounge/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`, // Include the authorization header
                    },
                });
                setToungue(response.data)
            }
            catch (error) {
                console.log(error, 'error fetching Data');
            }
        }
        toungueFetch();
    }, [])

    // chest
    useEffect(() => {
        const toungueFetch = async () => {
            try {
                const response = await axios.get(`${Port}/Screening/chest/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`, // Include the authorization header
                    },
                });
                setChest(response.data)
            }
            catch (error) {
                console.log(error, 'error fetching Data');
            }
        }
        toungueFetch();
    }, [])

    // Abdomen
    useEffect(() => {
        const abdomenFetch = async () => {
            try {
                const response = await axios.get(`${Port}/Screening/abdomen/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`, // Include the authorization header
                    },
                });
                setAbdomen(response.data)
            }
            catch (error) {
                console.log(error, 'error fetching Data');
            }
        }
        abdomenFetch();
    }, [])

    // Extremity
    useEffect(() => {
        const extremityFetch = async () => {
            try {
                const response = await axios.get(`${Port}/Screening/extremity/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`, // Include the authorization header
                    },
                });
                setExtremity(response.data)
            }
            catch (error) {
                console.log(error, 'error fetching Data');
            }
        }
        extremityFetch();
    }, [])

    return (
        <div>
            <h5 className="vitaltitlebasicscreen">General Examination</h5>
            <div className="elementvital"></div>
            <form onSubmit={handleSubmit}>
                {/* Head */}
                <div className='row'>
                    <div className="col-md-4">
                        <div className="card gendercardexam">
                            <div className="row">
                                <div className="col-md-4">
                                    <img className="headbasicscreen" src={headpic} />
                                </div>
                                <div className="col-md-8">
                                    <h6 className='headtitle'>Head / Scalp</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='row headeskinvital'>
                    <div className="col-md-4">
                        <label className="Visually-hidden basicscreenheadline">Head/Scalp</label>
                        <select className="form-control form-select form-select-sm selectdropexam"
                            onChange={handleChange}
                            name="head"
                            value={generalExam.head}>
                            <option selected>Select</option>
                            {
                                headData.map((drop) => (
                                    <option key={drop.head_scalp_id} value={drop.head_scalp_id}>
                                        {drop.head_scalp}
                                    </option>
                                ))
                            }
                        </select>
                    </div>

                    {
                        source === '1' && (
                            <>

                                <div className="col-md-4">
                                    <label className="Visually-hidden basicscreenheadline">Hair Color</label>
                                    <select className="form-control form-select form-select-sm selectdropexam"
                                        onChange={handleChange}
                                        name="hair_color"
                                        value={generalExam.hair_color}>
                                        <option selected>Select</option>
                                        {
                                            hairData.map((drop) => (
                                                <option key={drop.hair_color_id} value={drop.hair_color_id}>
                                                    {drop.hair_color}
                                                </option>
                                            ))
                                        }
                                    </select>
                                </div>

                                <div className="col-md-4">
                                    <label className="Visually-hidden basicscreenheadline">Hair Density</label>
                                    <select className="form-control form-select form-select-sm selectdropexam"
                                        onChange={handleChange}
                                        name="hair_density"
                                        value={generalExam.hair_density}>
                                        <option selected>Select</option>
                                        {
                                            hairDensity.map((drop) => (
                                                <option key={drop.hair_density_id} value={drop.hair_density_id}>
                                                    {drop.hair_density}
                                                </option>
                                            ))
                                        }
                                    </select>
                                </div>

                                <div className='col-md-4'>
                                    <label className="Visually-hidden basicscreenheadline">Hair Texture</label>
                                    <select class="form-control form-select-lg mb-1 selectdropexam"
                                        onChange={handleChange}
                                        name="hair_texture"
                                        value={generalExam.hair_texture}>
                                        <option className='selecttag' selected>Select</option>
                                        {
                                            hairTexture.map((drop) => (
                                                <option key={drop.hair_texture_id} value={drop.hair_texture_id}>
                                                    {drop.hair_texture}
                                                </option>
                                            ))
                                        }
                                    </select>
                                </div>

                            </>
                        )
                    }
                    <div className='col-md-4'>
                        <label className="Visually-hidden basicscreenheadline">Alopecia</label>
                        <select class="form-control form-select-lg mb-1 selectdropexam"
                            onChange={handleChange}
                            name="alopecia"
                            value={generalExam.alopecia}>
                            <option selected>Select</option>
                            {
                                alopecia.map((drop) => (
                                    <option key={drop.alopecia_id} value={drop.alopecia_id}>
                                        {drop.alopecia}
                                    </option>
                                ))
                            }
                        </select>
                    </div>

                    <div className='col-md-4'>
                        <label className="Visually-hidden basicscreenheadline">Neck</label>
                        <select class="form-control form-select-lg mb-1 selectdropexam"
                            onChange={handleChange}
                            name="neck"
                            value={generalExam.neck}>
                            <option selected>Select</option>
                            {
                                neck.map((drop) => (
                                    <option key={drop.neck_id} value={drop.neck_id}>
                                        {drop.neck}
                                    </option>
                                ))
                            }
                        </select>
                    </div>

                    <div className='col-md-4'>
                        <label className="Visually-hidden basicscreenheadline">Nose</label>
                        <select class="form-control form-select-lg mb-3 selectdropexam"
                            onChange={handleChange}
                            name="nose"
                            value={generalExam.nose}>
                            <option selected>Select</option>
                            {
                                nose.map((drop) => (
                                    <option key={drop.nose_id} value={drop.nose_id}>
                                        {drop.nose}
                                    </option>
                                ))
                            }
                        </select>
                    </div>
                </div>

                {/* SKIN */}
                <div className='row headeskinvital'>
                    <div className="col-md-4">
                        <div className="card gendercardexam">
                            <div className="row shiftttttttt">
                                <div className="col-md-4 skin">
                                    <img className="mouth1" src={dermatology} />
                                </div>
                                <div className="col-md-8">
                                    <h6 className='headtitle'>Skin</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='row headeskinvital'>
                    <div className="col-md-4">
                        <label className="Visually-hidden basicscreenheadline">Skin Colour</label>
                        <select className="form-control form-select form-select-sm selectdropexam"
                            onChange={handleChange}
                            name="skin_color"
                            value={generalExam.skin_color}>
                            <option selected>Select</option>
                            {
                                skinColor.map((drop) => (
                                    <option key={drop.skin_id} value={drop.skin_id}>
                                        {drop.skin_color}
                                    </option>
                                ))
                            }
                        </select>
                    </div>

                    {
                        source === '1' && (
                            <>
                                <div className="col-md-4">
                                    <label className="Visually-hidden basicscreenheadline">Skin Texture</label>
                                    <select className="form-control form-select form-select-sm selectdropexam"
                                        onChange={handleChange}
                                        name="skin_texture"
                                        value={generalExam.skin_texture}>
                                        <option selected>Select</option>
                                        {
                                            skinTexture.map((drop) => (
                                                <option key={drop.skin_texture_id} value={drop.skin_texture_id}>
                                                    {drop.skin_texture}
                                                </option>
                                            ))
                                        }
                                    </select>
                                </div>

                            </>
                        )
                    }

                    <div className="col-md-4">
                        <label className="Visually-hidden basicscreenheadline">Skin Lesions</label>
                        <select className="form-control form-select form-select-sm selectdropexam"
                            onChange={handleChange}
                            name="skin_lesions"
                            value={generalExam.skin_lesions}>
                            <option selected>Select</option>
                            {
                                skinLessions.map((drop) => (
                                    <option key={drop.skin_lesions_id} value={drop.skin_lesions_id}>
                                        {drop.skin_lesions}
                                    </option>
                                ))
                            }
                        </select>
                    </div>

                </div>

                {/* Mouth */}
                {/* {
                    source === '1' && (
                        <> */}
                <div className='row mt-2 headeskinvital'>
                    <div className="col-md-4">
                        <div className="card gendercardexam">
                            <div className="row shiftttttttt">
                                <div className="col-md-4 mouth">
                                    <img className="mouth1" src={mouth} />
                                </div>
                                <div className="col-md-8">
                                    <h6 className='headtitle'>Mouth</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='row headeskinvital'>
                    <div className="col-md-4">
                        <label className="Visually-hidden basicscreenheadline">Lips</label>
                        <select className="form-control form-select form-select-sm selectdropexam"
                            onChange={handleChange}
                            name="lips"
                            value={generalExam.lips}>
                            <option selected>Select</option>
                            {
                                lips.map((drop) => (
                                    <option key={drop.lips_id} value={drop.lips_id}>
                                        {drop.lips}
                                    </option>
                                ))
                            }
                        </select>
                    </div>

                    <div className="col-md-4">
                        <label className="Visually-hidden basicscreenheadline">Gums</label>
                        <select className="form-control form-select form-select-sm selectdropexam"
                            onChange={handleChange}
                            name="gums"
                            value={generalExam.gums}>
                            <option selected>Select</option>
                            {
                                gum.map((drop) => (
                                    <option key={drop.gums_id} value={drop.gums_id}>
                                        {drop.gums}
                                    </option>
                                ))
                            }
                        </select>
                    </div>

                    <div className="col-md-4">
                        <label className="Visually-hidden basicscreenheadline">Dention</label>
                        <select className="form-control form-select form-select-sm selectdropexam"
                            onChange={handleChange}
                            name="dention"
                            value={generalExam.dention}>
                            <option selected>Select</option>
                            {
                                dention.map((drop) => (
                                    <option key={drop.dentition_id} value={drop.dentition_id}>
                                        {drop.dentition}
                                    </option>
                                ))
                            }
                        </select>
                    </div>

                    <div className='col-md-4'>
                        <label className="Visually-hidden basicscreenheadline">Oral Mucosa</label>
                        <select class="form-control form-select-lg mb-3 selectdropexam"
                            onChange={handleChange}
                            name="oral_mucosa"
                            value={generalExam.oral_mucosa}>
                            <option className='selecttag' selected>Select</option>
                            {
                                mucosa.map((drop) => (
                                    <option key={drop.oral_mucosa_id} value={drop.oral_mucosa_id}>
                                        {drop.oral_mucosa}
                                    </option>
                                ))
                            }
                        </select>
                    </div>

                    <div className='col-md-4'>
                        <label className="Visually-hidden basicscreenheadline">Tongue</label>
                        <select class="form-control form-select-lg mb-3 selectdropexam"
                            onChange={handleChange}
                            name="tongue"
                            value={generalExam.tongue}>
                            <option selected>Select</option>
                            {
                                toungue.map((drop) => (
                                    <option key={drop.tounge_id} value={drop.tounge_id}>
                                        {drop.tounge}
                                    </option>
                                ))
                            }
                        </select>
                    </div>
                </div>
                {/* </> */}
                {/* )
                } */}

                {/* Other */}
                <div className='row headeskinvital'>
                    <div className="col-md-4">
                        <div className="card gendercardexam">
                            <div className="row shiftttttttt">
                                <div className="col-md-4 torso">
                                    <img className="mouth1" src={torso} />
                                </div>
                                <div className="col-md-8">
                                    <h6 className='headtitle'>Other</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='row mb-2 headeskinvital'>
                    {
                        source === '1' && (
                            <>
                                <div className="col-md-4">
                                    <label className="Visually-hidden basicscreenheadline">Chest</label>
                                    <select className="form-control form-select form-select-sm selectdropexam"
                                        onChange={handleChange}
                                        name="chest"
                                        value={generalExam.chest}>
                                        <option selected>Select</option>
                                        {
                                            chest.map((drop) => (
                                                <option key={drop.chest_id} value={drop.chest_id}>
                                                    {drop.chest}
                                                </option>
                                            ))
                                        }
                                    </select>
                                </div>

                            </>
                        )
                    }

                    <div className="col-md-4">
                        <label className="Visually-hidden basicscreenheadline">Abdomen</label>
                        <select className="form-control form-select form-select-sm selectdropexam"
                            onChange={handleChange}
                            name="abdomen"
                            value={generalExam.abdomen}>
                            <option selected>Select</option>
                            {
                                abdomen.map((drop) => (
                                    <option key={drop.abdomen_id} value={drop.abdomen_id}>
                                        {drop.abdomen}
                                    </option>
                                ))
                            }
                        </select>
                    </div>

                    <div className="col-md-4">
                        <label className="Visually-hidden basicscreenheadline">Extremity</label>
                        <select className="form-control form-select form-select-sm selectdropexam"
                            onChange={handleChange}
                            name="extremity"
                            value={generalExam.extremity}>
                            <option selected>Select</option>
                            {
                                extremity.map((drop) => (
                                    <option key={drop.extremity} value={drop.extremity_id}>
                                        {drop.extremity}
                                    </option>
                                ))
                            }
                        </select>
                    </div>
                </div>

                <div className='row mb-2 headeskinvital'>
                    {source === '5' && (
                        <div className='col-12'>
                            <label className="visually-hidden basicscreenheadline">General Remark</label>
                            <textarea
                                className="form-control form-select form-select-sm selectdropexam"
                                onChange={handleChange}
                                name="observation"
                                value={generalExam.observation}
                            />
                        </div>
                    )}
                </div>

                <div>
                    <button type="submit" className="btn btn-sm generalexambutton">Submit</button>
                </div>

            </form>
        </div>
    )
}

export default Generalexam
