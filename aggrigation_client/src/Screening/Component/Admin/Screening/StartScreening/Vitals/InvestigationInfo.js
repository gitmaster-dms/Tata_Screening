import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';

const InvestigationInfo = ({ citizensPkId, pkid, fetchVital, selectedName, onAcceptClick }) => {

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
    const investtData = JSON.parse(localStorage.getItem('investiData'));
    console.log("investtttttData....", investtData)

    /////////// Roshni's Code Start ///////////////////// 
    const [viewInvestigation, setViewInvestigation] = useState(false);
    const viewInvest = localStorage.getItem('investiData');
    console.log("View Invest....", viewInvest);

    useEffect(() => {
        const storedPermissions = localStorage.getItem('permissions');
        console.log('Stored Permissions:', storedPermissions);
        const parsedPermissions = storedPermissions ? JSON.parse(storedPermissions) : [];
        console.log('parsedPermissions Permissions:', parsedPermissions);
        ////// roshni code start
        const investigationModules = parsedPermissions.map(permission => {
            const modules = permission.modules_submodule.find(module => module.moduleName === 'Investigation');
            if (modules) {
                return {
                    moduleId: modules.moduleId,
                    moduleName: modules.moduleName,
                    selectedSubmodules: modules.selectedSubmodules
                };
            } else {
                return null;
            }
        }).filter(module => module !== null);

        console.log("investigationModules", investigationModules);

        if (investigationModules.length > 0) {
            setViewInvestigation(investigationModules[0].selectedSubmodules);
            localStorage.setItem('investiData', JSON.stringify(investigationModules[0].selectedSubmodules));
        } else {
            // Handle the case when investigationModules is empty
            setViewInvestigation([]);
            localStorage.setItem('investiData', JSON.stringify([]));
        }


        ////// roshni code end
    }, []);
    /////////// Roshni's Code End //////////////////////////

    const Port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');

    const [investData, setInvestData] = useState({
        investigation_report: null,
        urine_report: null,
        ecg_report: null,
        x_ray_report: null,
        // cbc_report: null,
        // lipid_profile_report: null,
        // creatinine_report: null,
        // rbs_report: null,
        // uric_acid_report: null,
        // protein_report: null,
        // albumin_report: null,
        // alp_alkaline_phosphate_report: null,
        // urea_report: null,
        // bilirubin_report: null,
        // sgot_report: null,
        // thyroid_profile_report: null,
        // t3_report: null,
        // t4_report: null,
        // tsh_report: null,
        // vitamin_b12_report: null,
        // vitamin_d3_report: null,
        // hiv_report: null,
        // vdrl_report: null,
        // bilirubin_urine_report: null,
        // protein_urine_report: null,
        // glucose_report: null,
        // specific_gravity_report: null,
        // ph_report: null,
        // urine_bilinogen_report: null,
        // pus_cells_report: null,
        // epithelial_cells_report: null,
        // blood_report: null,
        // leukocytes_report: null,
        // crystals_report: null,
        // rbc_report: null,
        // ecg_report: null,
        // pft_report: null,
        // x_ray_report: null,
    })

    const [imgUrl, setImgUrl] = useState('');

    function formatSubmoduleName(submoduleName) {
        switch (submoduleName) {
            case 'cbc_report':
                return 'CBC Report';
            case 'cholesterol_report':
                return 'Cholesterol Report';
            case 'rbs_random_blood_sugar_report':
                return 'RBS Random Blood Sugar Report';
            case 'urea_report':
                return 'Urea Report';
            case 'urine_routine_report':
                return 'Urine Routine Report';
            case 'creatinine_report':
                return 'Creatinine Report';
            default:
                return submoduleName;
        }
    }

    // const handleFileChange = (e, fieldName) => {
    //     const { files } = e.target;
    //     setInvestData({
    //         ...investData,
    //         // [fieldName]: e.target.files[0].name,
    //         [fieldName]: files[0]
    //     });
    // };

    const handleFileChange = (e, fieldName) => {
        const { files } = e.target;
        setInvestData({
            ...investData,
            [fieldName]: e.target.files[0],
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const confirmed = window.confirm('Are you sure you want to submit the form?');

        if (confirmed) {
            const formData = new FormData();

            // Append all existing data from investData
            Object.entries(investData).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    formData.append(key, value);
                }
            });

            // Append only newly selected files or updated values
            if (investData.investigation_report) {
                formData.append('investigation_report', investData.investigation_report);
            }
            if (investData.urine_report) {
                formData.append('urine_report', investData.urine_report);
            }
            if (investData.ecg_report) {
                formData.append('ecg_report', investData.ecg_report);
            }
            if (investData.x_ray_report) {
                formData.append('x_ray_report', investData.x_ray_report);
            }

            formData.append('citizen_pk_id', citizensPkId.toString());
            formData.append('form_submit', true ? 'True' : 'False');
            formData.append('added_by', userID);
            formData.append('modify_by', userID);

            try {
                const response = await axios.post(
                    `${Port}/Screening/citizen_investigation/${pkid}`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );
                console.log('POST response:', response);
                // onMoveToVital('pft');
                onAcceptClick(nextName);
            } catch (error) {
                console.error('Error posting data:', error);
            }
        } else {
            console.log('Form submission cancelled.');
        }
    };

    useEffect(() => {
        const fetchDataById = async (pkid) => {
            console.error('Citizens Pk Id...', pkid);
            try {
                const response = await fetch(`${Port}/Screening/citizen_investigation_info_get/${pkid}/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('These are selected files.', data);
                    setInvestData(data);
                    // setImgUrl(data[0].investigation_report)

                    // if (data && data.length > 0) {
                    //     switch (data[0].submoduleName) {
                    //         case 'Blood Report':
                    //             setImgUrl(data[0].investigation_report);
                    //             break;
                    //         case 'Urine Report':
                    //             setImgUrl(data[0].urine_report);
                    //             break;
                    //         case 'ECG Report':
                    //             setImgUrl(data[0].ecg_report);
                    //             break;
                    //         case 'X-Ray Report':
                    //             setImgUrl(data[0].x_ray_report);
                    //             break;
                    //         default:
                    //             break;
                    //     }
                    // }
                } else {
                    console.error('Server Error:', response.status, response.statusText);
                }
            } catch (error) {
                console.error('Error fetching data:', error.message);
            }
        };

        fetchDataById(pkid);
    }, [pkid]);

    const downloadFile = async (fileUrl) => {
        console.log('imgUrl...', fileUrl);
        try {
            const response = await fetch(`${Port}${fileUrl}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/pdf',
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            console.log('response:', response.url);
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'InvestigationReport.pdf');
                document.body.appendChild(link);

                link.click();
                link.parentNode.removeChild(link);
                window.URL.revokeObjectURL(url);
            } else {
                console.error('Server Error:', response.status);
            }
        } catch (error) {
            console.error('Error fetching data:', error.message);
        }
    };

    return (
        <div>
            <div>
                <div className="row backdesign">
                    <div className="col-md-12">
                        <div className="card bmicard">
                            <div className="row">
                                <div className="col-md-4">
                                    <h6 className='mt-1 familyTital'>INVESTIGATION INFORMATION</h6>
                                </div>
                                <div className="col-md-5 ml-auto">
                                    <div class="progress-barbmi"></div>
                                </div>
                            </div>
                        </div>

                        <div className="card grothcardmonitor">
                            <div className="row">
                                <div className="col-md-12">
                                    <h6 className="BMITitle">INVESTIGATION REPORT</h6>
                                    <div className="childdetailelement"></div>
                                </div>
                            </div>

                            {/* <li>{formatSubmoduleName(data.submoduleName)}</li> */}
                            <div>
                                {investtData && investtData.map((data, i) => (
                                    <ul key={i} style={{ listStyle: 'none' }}>
                                        <li><input type="checkbox" id={`checkbox-${i}`} style={{ marginRight: '4px' }} />{data.submoduleName}</li>
                                    </ul>
                                ))}
                            </div>

                            {investtData && investtData.map((data, i) => (
                                <div className="row paddingwhole mb-4" key={i} value={i}>

                                    {data.submoduleName === "Blood Report" && (
                                        <div className="row paddingwhole">
                                            <div className="col-md-8">
                                                <label className="visually-hidden childvitaldetails">Upload Blood Report</label>
                                                <input type="file" className="form-control childvitalinput" onChange={(e) => handleFileChange(e, 'investigation_report')} />
                                            </div>
                                            {/* {Array.isArray(investData) && investData.length > 0 && ( */}
                                            {Array.isArray(investData) && investData.length > 0 && investData[0].investigation_report !== '/media/undefined' && (
                                                <div className="col-md-4 mt-4">
                                                    <div className="btn btn-sm" style={{ background: "#F77C00", color: "white", borderRadius: "4px" }} onClick={() => downloadFile(investData[0]?.investigation_report)}>
                                                        <CloudDownloadOutlinedIcon /> Download
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {data.submoduleName === 'Urine Report' && (
                                        <div className="row paddingwhole">
                                            <div className="col-md-8">
                                                <label className="visually-hidden childvitaldetails">Upload Urine Report</label>
                                                <input type="file" className="form-control childvitalinput" onChange={(e) => handleFileChange(e, 'urine_report')} />
                                            </div>
                                            {Array.isArray(investData) && investData.length > 0 && investData[0].urine_report !== '/media/undefined' && (

                                                <div className="col-md-4 mt-4">
                                                    <div className="btn btn-sm" style={{ background: "#F77C00", color: "white", borderRadius: "4px" }} onClick={() => downloadFile(investData[0]?.urine_report)}>
                                                        <CloudDownloadOutlinedIcon /> Download
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {data.submoduleName === 'ECG Report' && (
                                        <div className="row paddingwhole">
                                            <div className="col-md-8">
                                                <label className="visually-hidden childvitaldetails">Upload ECG Report</label>
                                                <input type="file" className="form-control childvitalinput" onChange={(e) => handleFileChange(e, 'ecg_report')} />
                                            </div>
                                            {Array.isArray(investData) && investData.length > 0 && investData[0].ecg_report !== '/media/undefined' && (
                                                <div className="col-md-4 mt-4">
                                                    <div className="btn btn-sm" style={{ background: "#F77C00", color: "white", borderRadius: "4px" }} onClick={() => downloadFile(investData[0]?.ecg_report)}>
                                                        <CloudDownloadOutlinedIcon /> Download
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {data.submoduleName === 'X-Ray Report' && (
                                        <div className="row paddingwhole">
                                            <div className="col-md-8">
                                                <label className="visually-hidden childvitaldetails">Upload X-Ray Report</label>
                                                <input type="file" className="form-control childvitalinput" onChange={(e) => handleFileChange(e, 'x_ray_report')} />
                                            </div>
                                            {Array.isArray(investData) && investData.length > 0 && investData[0].x_ray_report !== '/media/undefined' && (
                                                <div className="col-md-4 mt-4">
                                                    <div className="btn btn-sm" style={{ background: "#F77C00", color: "white", borderRadius: "4px" }} onClick={() => downloadFile(investData[0]?.x_ray_report)}>
                                                        <CloudDownloadOutlinedIcon /> Download
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* <div className="row paddingwhole">
                                <div className="col-md-3">
                                    <label for="childName" class="visually-hidden childvitaldetails">CBC Report</label>
                                    <input type="file" class="form-control childvitalinput" placeholder="Enter Name"
                                        onChange={(e) => handleFileChange(e, 'cbc_report')}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label for="childName" class="visually-hidden childvitaldetails">Lipid Profile Report </label>
                                    <input type="file" class="form-control childvitalinput" placeholder="Enter Name"
                                        onChange={(e) => handleFileChange(e, 'lipid_profile_report')}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label for="childName" class="visually-hidden childvitaldetails">Creatinine Report</label>
                                    <input type="file" class="form-control childvitalinput" placeholder="Enter Name"
                                        onChange={(e) => handleFileChange(e, 'creatinine_report')}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label for="childName" class="visually-hidden childvitaldetails">RBS Report </label>
                                    <input type="file" class="form-control childvitalinput" placeholder="Enter Name"
                                        onChange={(e) => handleFileChange(e, 'rbs_report')}
                                    />
                                </div>
                            </div> */}

                            {/* <div className="row paddingwhole">
                                <div className="col-md-3">
                                    <label for="childName" class="visually-hidden childvitaldetails">Uric Acid Report</label>
                                    <input type="file" class="form-control childvitalinput" placeholder="Enter Name"
                                        onChange={(e) => handleFileChange(e, 'uric_acid_report')}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label for="childName" class="visually-hidden childvitaldetails">Protein Report </label>
                                    <input type="file" class="form-control childvitalinput" placeholder="Enter Name"
                                        onChange={(e) => handleFileChange(e, 'protein_report')}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label for="childName" class="visually-hidden childvitaldetails">Albumin Report </label>
                                    <input type="file" class="form-control childvitalinput" placeholder="Enter Name"
                                        onChange={(e) => handleFileChange(e, 'albumin_report')}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label for="childName" class="visually-hidden childvitaldetails">ALP Alkaline phosphate Report </label>
                                    <input type="file" class="form-control childvitalinput" placeholder="Enter Name"
                                        onChange={(e) => handleFileChange(e, 'alp_alkaline_phosphate_report')}
                                    />
                                </div>
                            </div> */}

                            {/* <div className="row paddingwhole">
                                <div className="col-md-3">
                                    <label for="childName" class="visually-hidden childvitaldetails">Urea Report </label>
                                    <input type="file" class="form-control childvitalinput" placeholder="Enter Name"
                                        onChange={(e) => handleFileChange(e, 'urea_report')}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label for="childName" class="visually-hidden childvitaldetails">Bilirubin Report</label>
                                    <input type="file" class="form-control childvitalinput" placeholder="Enter Name"
                                        onChange={(e) => handleFileChange(e, 'bilirubin_report')}
                                    />

                                </div>
                                <div className="col-md-3">
                                    <label for="childName" class="visually-hidden childvitaldetails">SGOT Report </label>
                                    <input type="file" class="form-control childvitalinput" placeholder="Enter Name"
                                        onChange={(e) => handleFileChange(e, 'sgot_report')}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label for="childName" class="visually-hidden childvitaldetails">Thyroid Profile Report </label>
                                    <input type="file" class="form-control childvitalinput" placeholder="Enter Name"
                                        onChange={(e) => handleFileChange(e, 'thyroid_profile_report')}
                                    />
                                </div>
                            </div> */}

                            {/* <div className="row paddingwhole">
                                <div className="col-md-3">
                                    <label for="childName" class="visually-hidden childvitaldetails">T3 Report</label>
                                    <input type="file" class="form-control childvitalinput" id="t3_report" name="t3_report"
                                        value={investData && investData.t3_report ? investData.t3_report : ''}
                                        onChange={(e) => handleFileChange(e, 't3_report')}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label for="childName" class="visually-hidden childvitaldetails">T4 Report</label>
                                    <input type="file" class="form-control childvitalinput"
                                        onChange={(e) => handleFileChange(e, 't4_report')}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label for="childName" class="visually-hidden childvitaldetails">TSH Report</label>
                                    <input type="file" class="form-control childvitalinput" placeholder="Enter Name"
                                        onChange={(e) => handleFileChange(e, 'tsh_report')}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label for="childName" class="visually-hidden childvitaldetails">Vitamin b12 Report </label>
                                    <input type="file" class="form-control childvitalinput" placeholder="Enter Name"
                                        onChange={(e) => handleFileChange(e, 'vitamin_b12_report')}
                                    />
                                </div>
                            </div> */}

                            {/* <div className="row paddingwhole">
                                <div className="col-md-3">
                                    <label for="childName" class="visually-hidden childvitaldetails">Vitamin D3 Report </label>
                                    <input type="file" class="form-control childvitalinput" placeholder="Enter Name"
                                        onChange={(e) => handleFileChange(e, 'vitamin_d3_report')}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label for="childName" class="visually-hidden childvitaldetails">HIV Report</label>
                                    <input type="file" class="form-control childvitalinput" placeholder="Enter Name"
                                        onChange={(e) => handleFileChange(e, 'hiv_report')}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label for="childName" class="visually-hidden childvitaldetails">VDRL Report</label>
                                    <input type="file" class="form-control childvitalinput" placeholder="Enter Name"
                                        onChange={(e) => handleFileChange(e, 'vdrl_report')}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label for="childName" class="visually-hidden childvitaldetails">Bilirubin Urine Report</label>
                                    <input type="file" class="form-control childvitalinput" placeholder="Enter Name"
                                        onChange={(e) => handleFileChange(e, 'bilirubin_urine_report')}
                                    />
                                </div>
                            </div> */}

                            {/* <div className="row paddingwhole">
                                <div className="col-md-3">
                                    <label for="childName" class="visually-hidden childvitaldetails">Protein Urine Report</label>
                                    <input type="file" class="form-control childvitalinput" placeholder="Enter Name"
                                        onChange={(e) => handleFileChange(e, 'protein_urine_report')}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label for="childName" class="visually-hidden childvitaldetails">Glucose Report</label>
                                    <input type="file" class="form-control childvitalinput" placeholder="Enter Name"
                                        onChange={(e) => handleFileChange(e, 'glucose_report')}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label for="childName" class="visually-hidden childvitaldetails">Specific Gravity Report </label>
                                    <input type="file" class="form-control childvitalinput" placeholder="Enter Name"
                                        onChange={(e) => handleFileChange(e, 'specific_gravity_report')}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label for="childName" class="visually-hidden childvitaldetails">PH Report</label>
                                    <input type="file" class="form-control childvitalinput" placeholder="Enter Name"
                                        onChange={(e) => handleFileChange(e, 'ph_report')}
                                    />
                                </div>
                            </div> */}

                            {/* <div className="row paddingwhole">
                                <div className="col-md-3">
                                    <label for="childName" class="visually-hidden childvitaldetails">Urine Bilinogen Report </label>
                                    <input type="file" class="form-control childvitalinput" placeholder="Enter Name"
                                        onChange={(e) => handleFileChange(e, 'urine_bilinogen_report')}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label for="childName" class="visually-hidden childvitaldetails">PUS Cells Report</label>
                                    <input type="file" class="form-control childvitalinput" placeholder="Enter Name"
                                        onChange={(e) => handleFileChange(e, 'pus_cells_report')}
                                    />
                                </div>

                                <div className="col-md-3">
                                    <label for="childName" class="visually-hidden childvitaldetails">Epithelial Cells Report </label>
                                    <input type="file" class="form-control childvitalinput" placeholder="Enter Name"
                                        onChange={(e) => handleFileChange(e, 'epithelial_cells_report')}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label for="childName" class="visually-hidden childvitaldetails">Blood Report </label>
                                    <input type="file" class="form-control childvitalinput" placeholder="Enter Name"
                                        onChange={(e) => handleFileChange(e, 'blood_report')}
                                    />
                                </div>
                            </div> */}

                            {/* <div className="row paddingwhole">
                                <div className="col-md-3">
                                    <label for="childName" class="visually-hidden childvitaldetails">Leukocytes Report </label>
                                    <input type="file" class="form-control childvitalinput" placeholder="Enter Name"
                                        onChange={(e) => handleFileChange(e, 'leukocytes_report')}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label for="childName" class="visually-hidden childvitaldetails">Crystals Report</label>
                                    <input type="file" class="form-control childvitalinput" placeholder="Enter Name"
                                        onChange={(e) => handleFileChange(e, 'crystals_report')}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label for="childName" class="visually-hidden childvitaldetails">RBC Report </label>
                                    <input type="file" class="form-control childvitalinput" placeholder="Enter Name"
                                        onChange={(e) => handleFileChange(e, 'rbc_report')}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label for="childName" class="visually-hidden childvitaldetails">ECG Report</label>
                                    <input type="file" class="form-control childvitalinput" placeholder="Enter Name"
                                        onChange={(e) => handleFileChange(e, 'ecg_report')}
                                    />
                                </div>
                            </div> */}

                            {/* <div className="row paddingwhole">
                                <div className="col-md-3">
                                    <label for="childName" class="visually-hidden childvitaldetails">PFT Report </label>
                                    <input type="file" class="form-control childvitalinput" placeholder="Enter Name"
                                        onChange={(e) => handleFileChange(e, 'pft_report')}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label for="childName" class="visually-hidden childvitaldetails">X Ray Report</label>
                                    <input type="file" class="form-control childvitalinput" placeholder="Enter Name"
                                        onChange={(e) => handleFileChange(e, 'x_ray_report')}
                                    />
                                </div>
                            </div> */}
                        </div>
                        <div className="row mb-4 mt-4">
                            <div type="button" className="btn btn-sm submitvital" onClick={handleSubmit}>Submit</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InvestigationInfo
