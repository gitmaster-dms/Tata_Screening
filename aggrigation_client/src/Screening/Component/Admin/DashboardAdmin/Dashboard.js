import React, { useState, useEffect } from 'react'
import './Dashboard.css'
import TotalStudents from './TotalStudents'
import Gender from './Gender'
import Age from './Age'
import Psychological from './Psychological'
import Vision from './Vision'
import Dental from './Dental'
import Referred from './Referred'
import BirthDefect from './BirthDefect'
import Hb from './Hb'
import Bodymass from './Bodymass'
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import axios from 'axios'
import jsPDF from 'jspdf';
import html2pdf from 'html2pdf.js';
import PftDashboard from './PftDashboard'
import CorporateEmployee from './CorporateEmployee'

const Dashboard = () => {

    const [canDownload, setCanDownload] = useState(false);
    const Port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');

    const source = localStorage.getItem('loginSource');

    console.log(source, 'fetched source in the Dashboard');

    //// access the source from local storage
    const SourceUrlId = localStorage.getItem('loginSource');

    //// access the source name from local storage
    const SourceNameUrlId = localStorage.getItem('SourceNameFetched');

    useEffect(() => {
        const storedPermissions = localStorage.getItem('permissions');
        console.log('Stored Permissions:', storedPermissions);
        const parsedPermissions = storedPermissions ? JSON.parse(storedPermissions) : [];
        console.log('parsedPermissions Permissions:', parsedPermissions);
        // Check if the user has permission to download
        const hasDownloadPermission = parsedPermissions.some((p) =>
            p.modules_submodule.some(
                (m) =>
                    m.moduleName === 'Dashboard' &&
                    m.selectedSubmodules.some((s) => s.submoduleName === 'Download')
            )
        );
        // console.log(hasDownloadPermission,'kkkkkkkkk');
        setCanDownload(hasDownloadPermission);
    }, []);

    const [screeningSource, setScreeningSource] = useState([]);
    const [selectedSource, setSelectedSource] = useState(SourceUrlId || '');
    const [selctedType, setSelctedType] = useState('')
    const [type, setType] = useState([]);
    const [scheduleID, setScheduleID] = useState([]);
    const [classList, setClassList] = useState([]);
    const [selectedClassType, setSelectedClassType] = useState('');
    const [selectedScreenID, setSelectedScreenID] = useState('');
    const [department, setDepartment] = useState([]);
    const [selectedDepartmentId, setSelectedDepartmentId] = useState()

    console.log(selectedSource, selectedClassType, selctedType);

    const handleDownload = async () => {
        try {

            let url;
            if (selectedClassType) {
                // URL with selectedClassTypes
                url = `${Port}/Screening/combined-api-download/${selectedSource}/${selctedType}/${selectedClassType}/`;
            } else {
                // URL without selectedClassType
                url = `${Port}/Screening/combined-api-download/${selectedSource}/${selctedType}/`;
            }

            const response = await axios.get(url,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
            // const response = await axios.get(`${Port}/Screening/combined-api-download/${selectedSource}/${selctedType}/`);
            setCanDownload(response.data);

            const pdf = new jsPDF();
            pdf.text('Dashboard Data', 10, 10);

            const ageCountsTable = [];
            Object.entries(response.data.age_counts).forEach(([group, count]) => {
                ageCountsTable.push([getAgeGroupLabel(group), count]);
            });
            pdf.autoTable({ startY: 20, head: [['Age Group', 'Count']], body: ageCountsTable });

            //////////////// Gender
            const genderCountsTable = [];
            const boysCount = response.data.gender_counts.boys_count || 0;
            const girlsCount = response.data.gender_counts.girls_count || 0;
            genderCountsTable.push(['Boy', boysCount]);
            genderCountsTable.push(['Girl', girlsCount]);
            pdf.autoTable({ startY: pdf.autoTable.previous.finalY + 10, head: [['Gender', 'Count']], body: genderCountsTable });

            ///////////////// Birth Defect
            const birthDefectsCountTable = [];
            const birthdefect = response.data.birth_defects_count.birth_defects_count || 0;
            birthDefectsCountTable.push(['Birth Defect', birthdefect]);
            pdf.autoTable({ startY: pdf.autoTable.previous.finalY + 10, head: [['Birth Defect', 'Count']], body: birthDefectsCountTable });

            ///////////////citizen count
            const citizenCountsTable = [];
            const totalAdded = response.data.citizens_counts.total_added_count || 0;
            const totalScheduled = response.data.citizens_counts.total_schedule_count || 0;
            const totalScreened = response.data.citizens_counts.total_screened_count || 0;

            citizenCountsTable.push(['Added Citizen', totalAdded]);
            citizenCountsTable.push(['Scheduled Citizen', totalScheduled]);
            citizenCountsTable.push(['Screened Citizen', totalScreened]);
            pdf.autoTable({ startY: pdf.autoTable.previous.finalY + 10, head: [['Citizen', 'Count']], body: citizenCountsTable });

            ///////////////dental count
            const dentalCountsTable = [];
            const goodCount = response.data.student_condition_counts.good_count || 0;
            const fairCount = response.data.student_condition_counts.fair_count || 0;
            const poorCount = response.data.student_condition_counts.poor_count || 0;

            dentalCountsTable.push(['Good Condition', goodCount]);
            dentalCountsTable.push(['Poor Condition', fairCount]);
            dentalCountsTable.push(['Fair Condition', poorCount]);
            pdf.autoTable({ startY: pdf.autoTable.previous.finalY + 15, head: [['Dental Condition', 'Count']], body: dentalCountsTable });

            ///////////////vision count
            const visionCountsTable = [];
            const withGlass = response.data.vision_counts.vision_with_glasses || 0;
            const withoutGlass = response.data.vision_counts.vision_without_glasses || 0;
            const colorBlindness = response.data.vision_counts.color_blindness || 0;

            visionCountsTable.push(['Vision With Glass', withGlass]);
            visionCountsTable.push(['Vision Without Glass', withoutGlass]);
            visionCountsTable.push(['Colour Blindness', colorBlindness]);
            pdf.autoTable({ startY: pdf.autoTable.previous.finalY + 15, head: [['Vision Condition', 'Count']], body: visionCountsTable });

            ///////////////psycho count
            const psychoCountsTable = [];
            const diffinread = response.data.psyco_counts.diff_in_read || 0;
            const diffinwrite = response.data.psyco_counts.diff_in_write || 0;
            const hyperreactive = response.data.psyco_counts.hyper_reactive || 0;
            const aggressive = response.data.psyco_counts.aggressive || 0;

            psychoCountsTable.push(['Vision With Glass', diffinread]);
            psychoCountsTable.push(['Vision Without Glass', diffinwrite]);
            psychoCountsTable.push(['Colour Blindness', hyperreactive]);
            psychoCountsTable.push(['Aggressive', aggressive]);
            pdf.autoTable({ startY: pdf.autoTable.previous.finalY + 20, head: [['Psychological Condition', 'Count']], body: psychoCountsTable });


            ///////////////BMI count
            const bmiCountsTable = [];
            const underweight = response.data.bmi_categories.underweight || 0;
            const normal = response.data.bmi_categories.normal || 0;
            const overweight = response.data.bmi_categories.overweight || 0;
            const obese = response.data.bmi_categories.obese || 0;

            bmiCountsTable.push(['Underweight', underweight]);
            bmiCountsTable.push(['Normal', normal]);
            bmiCountsTable.push(['OverWeight', overweight]);
            bmiCountsTable.push(['Obesity', obese]);
            pdf.autoTable({ startY: pdf.autoTable.previous.finalY + 20, head: [['Growth Monitoring', 'Count']], body: bmiCountsTable });

            pdf.save('Dashboard.pdf');
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // const generateAuditoryPDF = (additionalData) => {
    //     const pdf = new jsPDF();
    //     const cardHeight = 150;
    //     const cardWidth = 190;
    //     const cardX = 10;
    //     const cardY = 30;

    //     pdf.setFillColor(200, 220, 255);
    //     pdf.rect(cardX, cardY, cardWidth, cardHeight, 'F');

    //     pdf.text('Auditory Information', cardX + 5, cardY + 15);

    //     // Customize the PDF content based on the structure of your additionalData
    //     const ageCountsTable = [['Age Group', 'Count']];
    //     Object.entries(additionalData.age_counts).forEach(([group, count]) => {
    //         ageCountsTable.push([getAgeGroupLabel(group), count]);
    //     });
    //     pdf.autoTable({ startY: cardY + 30, head: [['Age Group', 'Count']], body: ageCountsTable });

    //     const genderCountsTable = [['Gender', 'Count']];
    //     Object.entries(additionalData.gender_counts).forEach(([gender, count]) => {
    //         const genderLabel = gender === 'boys_count' ? 'Boy' : gender === 'girls_count' ? 'Girl' : gender;
    //         genderCountsTable.push([genderLabel, count]);
    //     });
    //     pdf.autoTable({ startY: pdf.autoTable.previous.finalY + 10, head: [['Gender', 'Count']], body: genderCountsTable });

    //     // Save the PDF
    //     pdf.save('auditory_information.pdf');
    // };

    // Helper function to get descriptive age group labels
    const getAgeGroupLabel = (ageGroup) => {
        switch (ageGroup) {
            case 'year_5_7_count':
                return '5-7 Years';
            case 'year_7_9_count':
                return '7-9 Years';
            case 'year_9_11_count':
                return '9-11 Years';
            case 'year_11_13_count':
                return '11-13 Years';
            case 'year_13_15_count':
                return '13-15 Years';
            case 'year_15_17_count':
                return '15-17 Years';
            default:
                return ageGroup;
        }
    };

    //////// Navbar Dropdown Value
    useEffect(() => {
        const fetchUserSourceDropdown = async () => {
            try {
                const response = await axios.get(`${Port}/Screening/source_GET/?source_pk_id=${SourceUrlId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    })
                setScreeningSource(response.data)
                console.log(screeningSource)
            }
            catch (error) {
                console.log('Error while fetching data', error)
            }
        }
        fetchUserSourceDropdown()
    }, []);

    useEffect(() => {
        if (selectedSource) {
            axios
                .get(`${Port}/Screening/screening_for_type_get/${selectedSource}`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    })
                .then((response) => {
                    setType(response.data);
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                });
        }
    }, [selectedSource]);

    //// Schedule ID WISE DATA
    useEffect(() => {
        const fetchScheduleID = async () => {
            try {
                const response = await axios.get(`${Port}/Screening/Schedule_id_GET/?source_id=${SourceUrlId}&source_name_id=${SourceNameUrlId}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });

                // Ensure response data is in the expected format
                if (Array.isArray(response.data)) {
                    setScheduleID(response.data);
                } else {
                    console.error("Unexpected response data format", response.data);
                }
            } catch (error) {
                console.log('Error while fetching data', error);
            }
        };
        fetchScheduleID();
    }, []);

    useEffect(() => {
        const fetchClass = async () => {
            try {
                const response = await axios.get(`${Port}/Screening/get_class/`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    })
                setClassList(response.data)
            }
            catch (error) {
                console.log('Error while fetching data', error)
            }
        }
        fetchClass()
    }, []);

    useEffect(() => {
        const fetchDepartment = async () => {
            try {
                const response = await axios.get(`${Port}/Screening/get_department/`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    })
                setDepartment(response.data)
            }
            catch (error) {
                console.log('Error while fetching data', error)
            }
        }
        fetchDepartment()
    }, []);

    return (
        <div className="backgrounddashcolor">
            <div className='container-fluid'>
                <div className="row topcard topcardddddddddcarddd">
                    <div className="col-md-12">
                        <div className="card dahboardcardforadmin topcarddash">
                            <div className="row mt-3 ml-4">
                                <div className="col-md-2" style={{ color: "white" }}>
                                    <TextField
                                        select
                                        className="DashboardDesignDropdown"
                                        size="small"
                                        label="Screening Source"
                                        id="select-small"
                                        variant="outlined"
                                        InputLabelProps={{
                                            style: {
                                                fontWeight: '100',
                                                fontSize: '14px',
                                            },
                                        }}
                                        value={selectedSource}
                                        onChange={(e) => setSelectedSource(e.target.value)}
                                    >
                                        <MenuItem value="">Select Source</MenuItem>
                                        {screeningSource.map((drop) => (
                                            <MenuItem key={drop.source_pk_id} value={drop.source_pk_id}>
                                                {drop.source}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </div>

                                <div className="col-md-2" style={{ color: "white" }}>
                                    <TextField
                                        select
                                        className="DashboardDesignDropdown"
                                        size="small"
                                        label="Type"
                                        id="select-small"
                                        variant="outlined"
                                        InputLabelProps={{
                                            style: {
                                                fontWeight: '100',
                                                fontSize: '14px',
                                            },
                                        }}
                                        value={selctedType}
                                        onChange={(e) => setSelctedType(e.target.value)}
                                    >
                                        <MenuItem value="">Select Type</MenuItem>
                                        {type.map((drop) => (
                                            <MenuItem key={drop.type_id} value={drop.type_id}>
                                                {drop.type}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </div>

                                {/* Schedule ID */}
                                <div className="col-md-2" style={{ color: "white" }}>
                                    <TextField
                                        select
                                        className="DashboardDesignDropdown"
                                        size="small"
                                        label="Screening ID"
                                        id="select-small"
                                        variant="outlined"
                                        InputLabelProps={{
                                            style: {
                                                fontWeight: '100',
                                                fontSize: '14px',
                                            },
                                        }}
                                        value={selectedScreenID}
                                        onChange={(e) => setSelectedScreenID(e.target.value)}
                                    >
                                        {scheduleID.map((drop) => (
                                            <MenuItem key={drop.schedule_id} value={drop.schedule_id}>
                                                {drop.schedule_id}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </div>

                                {
                                    selectedSource === 1 && selctedType === 1 && (
                                        <div className="col-md-2" style={{ color: "white" }}>
                                            <TextField
                                                select
                                                className="DashboardDesignDropdown"
                                                size="small"
                                                label="Class"
                                                id="select-small"
                                                variant="outlined"
                                                InputLabelProps={{
                                                    style: {
                                                        fontWeight: '100',
                                                        fontSize: '14px',
                                                    },
                                                }}
                                                value={selectedClassType}
                                                onChange={(e) => setSelectedClassType(e.target.value)}
                                            >
                                                <MenuItem value="">Class</MenuItem>
                                                {classList.map((drop) => (
                                                    <MenuItem key={drop.class_id} value={drop.class_id}>
                                                        {drop.class_name}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        </div>
                                    )
                                }

                                {/* {source === '1' && canDownload && (
                                    <div className="col">
                                        <button type="button" className="btn btn-sm btndashboard" onClick={handleDownload}>
                                            Download
                                            <FileDownloadOutlinedIcon />
                                        </button>
                                    </div>
                                )} */}
                            </div>
                        </div>
                    </div>
                </div>

                {
                    source === '1' ?
                        (
                            <>
                                <div className="row topcard1">
                                    <div className="col-md-5">
                                        <div className="card dahboardcardforadminnnnn totalstudentcard">
                                            <TotalStudents
                                                selctedType={selctedType}
                                                selectedClassType={selectedClassType}
                                                selectedSource={selectedSource}
                                                selectedScreenID={selectedScreenID}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-7">
                                        <div className="row">
                                            <div className="col-md-12 parametersscreeningcard">
                                                <div className="card dahboardcardforadminnnnn">
                                                    <h5 className="parameter">Screening Parameters</h5>
                                                </div>
                                            </div>

                                            <div className="col-md-7">
                                                <div className="card bmicarddash">
                                                    <Bodymass
                                                        selctedType={selctedType}
                                                        selectedClassType={selectedClassType}
                                                        selectedSource={selectedSource}
                                                        selectedScreenID={selectedScreenID}
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-md-5">
                                                <div className="card dahboardcardforadminnnnn hbcardresponsive">
                                                    <Hb />
                                                </div>
                                            </div>

                                            <div className="col-md-4">
                                                <div className="card dahboardcardforadminnnnn BIRTHDEFECT">
                                                    <BirthDefect
                                                        selctedType={selctedType}
                                                        selectedClassType={selectedClassType}
                                                        selectedSource={selectedSource}
                                                        selectedScreenID={selectedScreenID}
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-md-4">
                                                <div className="card dahboardcardforadminnnnn dentalchartgraph">
                                                    <Dental
                                                        selctedType={selctedType}
                                                        selectedClassType={selectedClassType}
                                                        selectedSource={selectedSource}
                                                        selectedScreenID={selectedScreenID}
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-md-4">
                                                <div className="card dahboardcardforadminnnnn" style={{ height: '95%' }}>
                                                    <Vision
                                                        selctedType={selctedType}
                                                        selectedClassType={selectedClassType}
                                                        selectedSource={selectedSource}
                                                        selectedScreenID={selectedScreenID}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-2">
                                        <div className="card dahboardcardforadminnnnn" style={{ height: '95%' }}>
                                            <Gender
                                                selctedType={selctedType}
                                                selectedClassType={selectedClassType}
                                                selectedSource={selectedSource}
                                                selectedScreenID={selectedScreenID}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-3">
                                        <div className="card dahboardcardforadminnnnn">
                                            <Age
                                                selctedType={selctedType}
                                                selectedClassType={selectedClassType}
                                                selectedSource={selectedSource}
                                                selectedScreenID={selectedScreenID} />
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <div className="card dahboardcardforadminnnnn">
                                            <Psychological
                                                selctedType={selctedType}
                                                selectedClassType={selectedClassType}
                                                selectedSource={selectedSource}
                                                selectedScreenID={selectedScreenID} />
                                        </div>
                                    </div>

                                    <div className="col-md-3">
                                        <div className="card dahboardcardforadminnnnn" style={{ height: '90%' }}>
                                            <Referred
                                                selctedType={selctedType}
                                                selectedClassType={selectedClassType}
                                                selectedSource={selectedSource}
                                                selectedScreenID={selectedScreenID}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </>
                        )
                        :
                        (
                            <>
                                <div className="row topcard1">
                                    <div className='col-md-5'>
                                        <div className='row'>
                                            <div className="col-md-12">
                                                <div className="card dahboardcardforadminnnnn totalstudentcard">
                                                    <CorporateEmployee
                                                        selctedType={selctedType}
                                                        selectedClassType={selectedClassType}
                                                        selectedSource={selectedSource}
                                                        selectedScreenID={selectedScreenID}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className='row'>
                                            <div className="col-md-6">
                                                <div className="card dahboardcardforadminnnnn" style={{ height: '93%' }}>
                                                    <Gender
                                                        selctedType={selctedType}
                                                        selectedClassType={selectedClassType}
                                                        selectedSource={selectedSource}
                                                        selectedScreenID={selectedScreenID}
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-md-6">
                                                <div className="card dahboardcardforadminnnnn">
                                                    <Age
                                                        selctedType={selctedType}
                                                        selectedClassType={selectedClassType}
                                                        selectedSource={selectedSource}
                                                        selectedScreenID={selectedScreenID} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-7">
                                        <div className="row">
                                            <div className="col-md-12 parametersscreeningcard">
                                                <div className="card dahboardcardforadminnnnn">
                                                    <h5 className="parameter">Screening Parameters</h5>
                                                </div>
                                            </div>

                                            <div className="col-md-7">
                                                <div className="card bmicarddash" style={{ height: '100%' }}>
                                                    <Bodymass
                                                        selctedType={selctedType}
                                                        selectedClassType={selectedClassType}
                                                        selectedSource={selectedSource}
                                                        selectedScreenID={selectedScreenID}
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-md-5">
                                                <div className="card dahboardcardforadminnnnn" style={{ height: '100%' }}>
                                                    {/* <Referred
                                                        selctedType={selctedType}
                                                        selectedClassType={selectedClassType}
                                                        selectedSource={selectedSource}
                                                    /> */}
                                                    <Vision
                                                        selctedType={selctedType}
                                                        selectedClassType={selectedClassType}
                                                        selectedSource={selectedSource}
                                                        selectedScreenID={selectedScreenID} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-5">
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <div className="card" style={{ marginTop: '10px', height: '90%' }}>
                                                            <Dental
                                                                selctedType={selctedType}
                                                                selectedClassType={selectedClassType}
                                                                selectedSource={selectedSource}
                                                                selectedScreenID={selectedScreenID} />
                                                        </div>
                                                    </div>

                                                    <div className="col-md-12">
                                                        <div className="card" style={{ marginTop: '5px', height: '90%' }}>

                                                            <Referred
                                                                selctedType={selctedType}
                                                                selectedClassType={selectedClassType}
                                                                selectedSource={selectedSource}
                                                                selectedScreenID={selectedScreenID}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-md-7">
                                                <div className="card" style={{ marginTop: '10px', height: '94%' }}>
                                                    <PftDashboard
                                                        selctedType={selctedType}
                                                        selectedClassType={selectedClassType}
                                                        selectedSource={selectedSource}
                                                        selectedScreenID={selectedScreenID}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )
                }
            </div>
        </div>
    )
}

export default Dashboard
