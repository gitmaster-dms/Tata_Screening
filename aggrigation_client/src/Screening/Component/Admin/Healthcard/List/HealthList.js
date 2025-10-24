import React, { useState, useEffect, useRef } from 'react'
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import './HealthList.css'
import malepic from '../../../../Images/human-body-frontal-removebg-preview.png'
import femalePic from '../../../../Images/Group 237928.png'
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import Vitalhealth from '../HealthcardVitals/VitalHealth';
import BasicScreenVital from '../HealthcardVitals/BasicScrenVital';
import BmiHealth from '../HealthcardVitals/BmiHealth';
import ImmunisationHealth from '../HealthcardVitals/ImmunisationHealth';
import AuditoryHealth from '../HealthcardVitals/AuditoryHealth';
import DentalHealth from '../HealthcardVitals/DentalHealth';
import VisionHealth from '../HealthcardVitals/VisionHealth';
import PsychologicalHealth from '../HealthcardVitals/PsychologicalHealth';
import axios from 'axios'
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import TablePagination from '@mui/material/TablePagination';
import Healthcarddownload from '../Healthcarddownload';
import backgroundImage from '../../../../Images/Group 427318871.png';
import secondImage from '../../../../Images/Group 427318867.png';
import CircularProgress from '@mui/material/CircularProgress';
import defaultImage from '../../../../Images/Default Image.webp'
import SignLogo from '../../../../Images/ImportedPhoto_1716285997519.jpg'
import html2canvas from 'html2canvas';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import { saveAs } from 'file-saver';
import html2PDF from 'jspdf-html2canvas';
import CitizenInfoHealth from '../HealthcardVitals/CitizenInfoHealth';
import FamilyInfo from '../HealthcardVitals/FamilyInfo';
import Medicalhistory from '../HealthcardVitals/Medicalhistory';
import PftHealth from '../HealthcardVitals/PftHealth';
import EmailIcon from '@mui/icons-material/Email';
import LanguageIcon from '@mui/icons-material/Language';
import sperologo from '../../../../Images/Spero Logo ©-03 2.png';

const HealthList = () => {

    const Port = process.env.REACT_APP_API_KEY;
    const [openForm, setOpenForm] = useState('bmiform')
    const [loading, setLoading] = useState(true);
    const [searchResults, setSearchResults] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5); // Set to 10 for 10 entries per page
    const accessToken = localStorage.getItem('token');

    //// access the source from local storage
    const SourceUrlId = localStorage.getItem('loginSource');

    //// access the source name from local storage
    const SourceNameUrlId = localStorage.getItem('SourceNameFetched');

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 5));
        setPage(0);
    };

    //////////////////////////// Nav Dropdown //////////////////////////
    const [sourceNav, setSourceNav] = useState([]); // State for source options
    const [selectedSource, setSelectedSource] = useState(''); // State to store selected source

    const [sourceStateNav, setSourceStateNav] = useState([]); // State for source state options
    const [selectedStateNav, setSelectedStateNav] = useState('');

    const [sourceDistrictNav, setSourceDistrictNav] = useState([]); // State for source district options
    const [selectedDistrictNav, setSelectedDistrictNav] = useState('')

    const [sourceTehsilNav, setSourceTehsilNav] = useState([]); // District for source Tehsil options
    const [selectedTehsilNav, setSelectedTehsilNav] = useState('')

    const [sourceName, setSourceName] = useState([]);
    const [selectedName, setSelectedName] = useState('');

    console.log(selectedSource, selectedStateNav, selectedDistrictNav, selectedTehsilNav, selectedName);
    ///////////// scheudle API 
    const [scheduleData, setScheduleData] = useState([]);
    const [totalCount, setTotalCount] = useState([]);
    const [store, setStore] = useState([]) ///////////////Schdule citizen info
    const [newId, setNewID] = useState("") ///// citizen id
    const [psychoData, setPsychoData] = useState(null);
    const [dentalData, setDentalData] = useState(null);
    const [visionData, setVisionData] = useState(null);
    const [auditoryData, setAuditoryData] = useState(null);
    const [vitalsData, setVitalsData] = useState(null);
    const [bmiData, setBmiData] = useState(null);
    const [immunizationData, setImmunizationData] = useState(null);
    const [selectedCitizenId, setSelectedCitizenId] = useState(null);
    const [basicScreenData, setBasicScreenData] = useState(null)
    const [citizen, setCitizen] = useState(null)
    const [family, setFamily] = useState(null)
    const [medical, setMedical] = useState(null)
    const [pft, setPft] = useState(null)
    const [auditory, setAuditory] = useState(null)
    const [vision, setVision] = useState(null)
    console.log(citizen, 'citizencitizen....');

    const [isDataFetched, setIsDataFetched] = useState(false);
    const [selectedForm, setSelectedForm] = useState('');

    const handleFormClick = (formVital) => {
        console.log('Clicked form:', formVital); // Debugging: Check what gets passed
        setSelectedForm(formVital);
    };

    //_____________________________navbar value dropdown get _____________________________

    // source Dropdown
    useEffect(() => {
        fetch(`${Port}/Screening/Source_Get/?source_pk_id=${SourceUrlId}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            .then(response => response.json())
            .then(data => {
                setSourceNav(data);
            })
            .catch(error => {
                console.error('Error fetching sources:', error);
            });
    }, []);

    //// Soure State against selected source
    useEffect(() => {
        const fetchStateNavOptions = async () => {
            if (selectedSource) {
                try {
                    const res = await fetch(`${Port}/Screening/source_and_pass_state_Get/${selectedSource}`,
                        {
                            headers: {
                                Authorization: `Bearer ${accessToken}`
                            }
                        });
                    const data = await res.json();
                    setSourceStateNav(data);
                } catch (error) {
                    console.error("Error fetching state against source data:", error);
                }
            }
        };
        fetchStateNavOptions();
    }, [selectedSource]);

    //// Soure District against selected source state/////////
    useEffect(() => {
        const fetchDistrictNavOptions = async () => {
            if (selectedStateNav) {
                try {
                    const res = await fetch(`${Port}/Screening/state_and_pass_district_Get/${selectedSource}/${selectedStateNav}/`,
                        {
                            headers: {
                                Authorization: `Bearer ${accessToken}`
                            }
                        });
                    const data = await res.json();
                    setSourceDistrictNav(data);
                } catch (error) {
                    console.error("Error fetching districts against state data:", error);
                }
            }
        };
        fetchDistrictNavOptions();
    }, [selectedStateNav]);

    //// Soure Tehsil against selected source District/////////
    useEffect(() => {
        const fetchTehsilNavOptions = async () => {
            if (selectedDistrictNav) {
                try {
                    const res = await fetch(`${Port}/Screening/district_and_pass_taluka_Get/${selectedSource}/${selectedDistrictNav}/`,
                        {
                            headers: {
                                Authorization: `Bearer ${accessToken}`
                            }
                        });
                    const data = await res.json();
                    setSourceTehsilNav(data);
                } catch (error) {
                    console.error("Error fetching Tehsil against District data:", error);
                }
            }
        };
        fetchTehsilNavOptions();
    }, [selectedDistrictNav]);

    //// Soure Name against selected source district
    useEffect(() => {
        const fetchSourceNameOptions = async () => {
            if (selectedSource && selectedStateNav && selectedDistrictNav && selectedTehsilNav) {
                try {
                    const res = await fetch(`${Port}/Screening/taluka_and_pass_SourceName_Get/?SNid=${selectedTehsilNav}&So=${selectedSource}&source_pk_id=${SourceNameUrlId}`,
                        {
                            headers: {
                                Authorization: `Bearer ${accessToken}`
                            }
                        });
                    const data = await res.json();
                    setSourceName(data);
                } catch (error) {
                    console.error("Error fetching Source Name against Tehsil data:", error);
                }
            }
        };
        fetchSourceNameOptions();
    }, [selectedSource, selectedStateNav, selectedDistrictNav, selectedTehsilNav]);

    ////////////// search API
    const [id, setId] = useState('');
    console.log(id, 'ididididididididididi');

    const handlesubmit = async (e) => {
        let url = `${Port}/Screening/healthcards/?`;

        if (SourceUrlId) {
            url += `source_id_id=${SourceUrlId}&`;
        }

        if (SourceNameUrlId) {
            url += `source_name_id=${SourceNameUrlId}&`;
        }

        if (selectedSource) {
            url += `source=${selectedSource}&`;

            if (selectedStateNav) {
                url += `state_id =${selectedStateNav}&`;

                if (selectedDistrictNav) {
                    url += `district_id=${selectedDistrictNav}&`;

                    if (selectedTehsilNav) {
                        url += `tehsil_id=${selectedTehsilNav}&`;

                        if (selectedName) {
                            url += `source_name=${selectedName}&`;
                        }
                    }
                }
            }
        }
        setLoading(true);
        try {
            const response = await axios.get(url,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
            setSearchResults(response.data);

            //______________________________Fetch Schedule ID From the API response__________________________________
            const scheId = response.data[0];
            if (scheId) {
                setId(scheId.schedule_id);
            }
            console.log(response.data);
        } catch (error) {
            console.log('Error while fetching data', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        handlesubmit();
    }, [])

    //////////// download 
    function getCurrentTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }
    const [selectedScheduleCount, setSelectedScheduleCount] = useState(null);

    const [scheduleId, setScheduleId] = useState(null);
    const [image, setImage] = useState('')
    console.log(image, 'image fetched state');
    const [imageShows, setImageShows] = useState('')
    console.log(imageShows, 'imag downloading.....');

    useEffect(() => {
        const fetchImageData = async () => {
            try {
                const apiUrl = `${Port}${image}`;
                console.log("API URL:", apiUrl);

                const res = await fetch(apiUrl);
                console.log("API Response:", res);

                if (res.ok) {
                    const blob = await res.blob();
                    const blobUrl = URL.createObjectURL(blob);
                    setImageShows(blobUrl);
                } else {
                    throw new Error(`Error fetching image. Status: ${res.status}`);
                }
            } catch (error) {
                console.error("Error fetching image:", error);
            }
        };

        fetchImageData();
    }, [image]);

    const dashboardRef = useRef(null);
    const healthCardRef = useRef(null);
    const [fetchedData, setFetchedData] = useState(null);

    useEffect(() => {
        console.log('Fetched data state updated:', fetchedData);
    }, [fetchedData]);

    const handleFitness = async () => {
        if (!scheduleData || !selectedScheduleCount) {
            console.error('No data available for download or no schedule count selected');
            return;
        }

        try {
            const response = await fetch(`${Port}/Screening/citizen-download/${selectedCitizenId}/${selectedScheduleCount}/`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
            console.log(response);

            const additionalData = await response.json();
            const bmiInfo = additionalData.bmi_info?.[0]; // Assuming bmi_info is present in the response
            const basicInfo = additionalData.basic_info?.[0]; // Assuming basic_info is present in the response

            // Set font family and size
            const pdf = new jsPDF();
            const fontSettings = {
                font: 'Roboto',
                fontSize: 12,
            };
            const imgWidth = 210; // Adjust as needed
            const imgHeight = 297; // Adjust as needed

            pdf.addImage(backgroundImage, 'PNG', 0, 0, imgWidth, imgHeight);

            // Header
            const leftMargin = 30; // Adjust the left margin as needed

            const headerText = 'FITNESS CERTIFICATE';
            const headerX = imgWidth / 1.7 + leftMargin;
            const headerY = 15;

            // Check if citizenInfo is available before attempting to use it

            if (imageShows) {
                const cmToPoints = 15; // Conversion factor from cm to points

                const imageWidthCm = 1.55; // Set the width of the image in cm
                const imageHeightCm = 1.7; // Set the height of the image in cm
                const borderRadiusCm = 1.5; // Set the border radius of the image in cm

                const imageWidth = imageWidthCm * cmToPoints; // Convert width from cm to points
                const imageHeight = imageHeightCm * cmToPoints; // Convert height from cm to points
                const borderRadius = borderRadiusCm * cmToPoints; // Convert border radius from cm to points

                pdf.addImage(imageShows, 'JPEG', 20, 15, imageWidth, imageHeight, borderRadius); // Adjust the coordinates, dimensions, and border radius as needed
            } else {
                // Show the default image if imageShows is not available
                const cmToPoints = 15; // Conversion factor from cm to points

                const defaultImageWidthCm = 1.5; // Set the width of the default image in cm
                const defaultImageHeightCm = 1.5; // Set the height of the default image in cm

                const defaultImageWidth = defaultImageWidthCm * cmToPoints; // Convert width from cm to points
                const defaultImageHeight = defaultImageHeightCm * cmToPoints; // Convert height from cm to points

                pdf.addImage(defaultImage, 'WEBP', 20, 19, defaultImageWidth, defaultImageHeight); // Adjust the coordinates and dimensions as needed
            }

            const { name, year: age, added_date: currentDate } = basicInfo;

            if (basicInfo) {
                const citizenInfoFontSize = 10;

                // Set text color to white
                pdf.setTextColor(255, 255, 255);

                // Display Citizen Name
                const nameText = `${basicInfo.name}`;
                pdf.text(nameText, 45, 28);
                pdf.setFontSize(citizenInfoFontSize);

                // Display Gender
                const genderText = `${basicInfo.gender}`;
                pdf.text(genderText, 45, 34);
                pdf.setFontSize(citizenInfoFontSize);

                // Display Age
                const ageText = ` ${basicInfo.year} years`;
                pdf.text(ageText, 43.5, 39);
                pdf.setFontSize(citizenInfoFontSize);

                // Set text color back to black (or any other desired color)
                pdf.setTextColor(0, 0, 0);

                // Apply bottom margin for all displayed text
                const bottomMargin = 10;
                pdf.text('', 2, pdf.internal.pageSize.height - bottomMargin);

                // Display citizen_id
                pdf.setTextColor(255, 255, 255); // Set text color to white
                const citizenIdText = `Citizen ID: ${basicInfo.citizen_id}`;
                pdf.text(citizenIdText, imgWidth - 20, 37, { align: 'right' });
                pdf.setFontSize(citizenInfoFontSize);

                // Display Schedule Count
                const scheduleCountText = `Schedule ID : ${basicInfo.schedule_id}`;
                pdf.text(scheduleCountText, imgWidth - 20, 31, { align: 'right' });
                pdf.setFontSize(citizenInfoFontSize);

                // Display Schedule Count
                const shceduleID = `Screening : ${basicInfo.schedule_count}`;
                pdf.text(shceduleID, imgWidth - 20, 25, { align: 'right' });
                pdf.setFontSize(citizenInfoFontSize);

                const currentTime = getCurrentTime();

                // // Display current time
                // pdf.setTextColor(0, 0, 0); // Set text color back to black
                // const downloadTimeText = `Download Time: ${currentTime}`;
                // pdf.text(downloadTimeText, 20, pdf.internal.pageSize.height - 2);
            }

            pdf.setTextColor(255, 255, 255); // Set text color to white for the header
            pdf.setFontSize(25); // Adjust the font size directly

            pdf.text(headerText, headerX, headerY, { align: 'right' });

            // Reset font size and text color for subsequent text
            pdf.setFont(fontSettings.font, 'normal');
            pdf.setFontSize(fontSettings.fontSize);
            pdf.setTextColor(0, 0, 0); // Reset text color to black

            const cardWidth = 190;
            const bmiCardHeight = 70; // Adjust the BMI card height as needed
            const borderRadius = 4; // Border radius in millimeters

            // First Card (BMI Information)
            const cardX1 = 10;
            const marginTopBMI = 33; // Adjust the margin-top for BMI card as needed
            const cardY1 = 20 + marginTopBMI;

            pdf.setFillColor(244, 245, 250); // #F4F5FA
            pdf.roundedRect(cardX1, cardY1, cardWidth, bmiCardHeight, borderRadius, borderRadius, 'F');

            pdf.setTextColor(49, 55, 116); // RGB values corresponding to #313774
            pdf.setFont(fontSettings.font, 'bold');

            pdf.setTextColor('black'); // Set text color to black
            pdf.setFont(fontSettings.font, 'bold');
            pdf.text(`This is To certify that ${name} has Undergone the medical examination with us`, cardX1 + 5, cardY1 + 14);
            pdf.text(`${currentDate} based on examination and investigation results is free from infection`, cardX1 + 5, cardY1 + 21);
            pdf.text(`disease for which diagnostic tests have been carried out and is medically fit to continue duties.`, cardX1 + 5, cardY1 + 28);
            pdf.setFont(fontSettings.font, 'normal');
            pdf.setTextColor(0, 0, 0);

            pdf.setTextColor(0, 0, 0);
            // Save the PDF
            const pdfFileName = `fitness_${selectedCitizenId}.pdf`;

            pdf.save(pdfFileName);
        } catch (error) {
            console.error('Error fetching additional data', error);
        }
    };

    //////////// handle table psycho
    const handleEyeClick = async (citizenID) => {
        try {
            const response = await fetch(`${Port}/Screening/schedule-count/?citizen_id=${citizenID}`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
            const data = await response.json();
            setScheduleData(data);
            setIsDataFetched(true);

            const options = data.schedule_count_sequence ?? [];
            setTotalCount(options);
            setSelectedCitizenId(citizenID);

            // Set data for each type (vitals, bmi, immunization, etc.)
            setVitalsData(data.vitalsData);
            setBmiData(data.bmiData);
            setImmunizationData(data.immunizationData);

            setImage(data?.Citizen_info?.[0]?.photo)

            console.log('API Schedule Response:', data);
            console.log('Citizen Name:', data?.Citizen_info?.[0]?.name);
            console.log('Citizen Idddddd:', data?.Citizen_info?.[0]?.citizen_id);
            console.log('Total Count:', options);
            setNewID(data?.Citizen_info?.[0]?.citizen_id)
        } catch (error) {
            console.error('Error Fetching Data', error);
        }
    }

    useEffect(() => {
        handleEyeClick();
    }, []);

    const [citizenName, setCitizenName] = useState('');
    const [sourceNameFetched, setSourceNameFetched] = useState('');
    const [gender, setGender] = useState(null)
    const [scheduleIDD, setScheduleIDD] = useState(null)
    const [citizenID, setCitizenID] = useState(null)
    const [basicInfo2Data, setBasicInfo2Data] = useState([]);

    const fetchCitizenVital = async (iddddddddddd) => {
        try {
            const res = await fetch(`${Port}/Screening/citizen-info/${newId}/${iddddddddddd}/`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
            console.log('API RESPONSE', res);
            const data = await res.json();

            const basicInfo2 = data.basic_info2 || [];
            setBasicInfo2Data(basicInfo2);

            setIsDataFetched(true);

            const scheduleId = data.basic_info?.[0]?.schedule_id || null;
            console.log('Schedule ID:', scheduleId);
            setScheduleId(scheduleId);

            ///////////////////////// BMI
            const bmiInfo = data.bmi_info ? data.bmi_info.map(item => {
                return {
                    id: item.id,
                    citizenId: item.citizen_id,
                    scheduleId: item.schedule_id,
                    scheduleCount: item.schedule_count,
                    gender: item.gender,
                    dob: item.dob,
                    year: item.year,
                    months: item.months,
                    days: item.days,
                    height: item.height,
                    weight: item.weight,
                    weightForAge: item.weight_for_age,
                    heightForAge: item.height_for_age,
                    weightForHeight: item.weight_for_height,
                    bmi: item.bmi,
                    armSize: item.arm_size,
                    formSubmit: item.form_submit,
                    isDeleted: item.is_deleted,
                    addedBy: item.added_by,
                    addedDate: item.added_date,
                    modifyBy: item.modify_by,
                    modifyDate: item.modify_date,
                };
            }) : [];
            console.log('BMI Info:', bmiInfo);
            setBmiData(bmiInfo);

            ///////////////////////// Psycho
            const psychoConditions = data.psycho_info ? data.psycho_info.map(item => item.pycho_conditions) : [];
            console.log('Psycho Conditions:', psychoConditions);
            setPsychoData(psychoConditions);

            ///////////////////////// Dental
            const dentalConditions = data.dental_info ? data.dental_info.map(item => item.dental_conditions) : [];
            console.log('Dental Conditions:', dentalConditions);
            setDentalData(dentalConditions);

            ///////////////////////// Immunization
            const immunizationData = data.immunization_info ? data.immunization_info.map(item => {
                return {
                    immunizationCode: item.immunization_code,
                    vaccines: item.name_of_vaccine.map(vaccine => {
                        return {
                            immunization: vaccine.immunisations,
                            givenYesNo: vaccine.given_yes_no,
                            scheduledDateFrom: vaccine.scheduled_date_from,
                            scheduledDateTo: vaccine.scheduled_date_to,
                            windowPeriodDaysFrom: vaccine.window_period_days_from,
                            windowPeriodDaysTo: vaccine.window_period_days_to,
                        };
                    }),
                };
            }) : [];
            console.log('Immunization Data:', immunizationData);
            setImmunizationData(immunizationData);

            //////////////////////// Vital
            const vitalsConditions = data.vital_info ? data.vital_info.map(item => {
                return {
                    pulse: item.pulse,
                    pulse_conditions: item.pulse_conditions,
                    sys_mm: item.sys_mm,
                    sys_mm_conditions: item.sys_mm_conditions,
                    dys_mm: item.dys_mm,
                    dys_mm_mm_conditions: item.dys_mm_mm_conditions,
                    hb: item.hb,
                    hb_conditions: item.hb_conditions,
                    oxygen_saturation: item.oxygen_saturation,
                    oxygen_saturation_conditions: item.oxygen_saturation_conditions,
                    rr: item.rr,
                    rr_conditions: item.rr_conditions,
                    temp: item.temp,
                    temp_conditions: item.temp_conditions,
                }
            }) : [];
            console.log('Vitals Conditions:', vitalsConditions);
            setVitalsData(vitalsConditions)

            ///////////////////////// Vision
            const visionConditions = data.vision_info ? data.vision_info.map(item => {
                return {
                    vision_with_glasses: item.vision_with_glasses,
                    vision_without_glasses: item.vision_without_glasses,
                    color_blindness: item.color_blindness,
                };
            }) : [];
            console.log('Vision Conditions:', visionConditions);
            setVisionData(visionConditions);

            ///////////////////////// Auditory
            const auditoryCheckboxData = data.audit_info ? data.audit_info.map(item => item.checkboxes) : [];
            console.log('Auditory Checkbox Data:', auditoryCheckboxData);
            setAuditoryData(auditoryCheckboxData);

            ///////////////////////// Basic Screening
            const basiScreenData = data.basic_info ? data.basic_info.map(item => item.birth_defects) : [];
            console.log('Basic Screen Data:', basiScreenData);
            setBasicScreenData(basiScreenData);

            ///////////////////////// Basic All Data
            setCitizen(data.basic_info);
            setFamily(data.family_info);
            setMedical(data.medical_history_info);
            setPft(data.pft_info);
            setAuditory(data.audit_info);
            setVision(data.vision_info);

            /////// Header Section
            const citizenName = data.basic_info?.[0]?.name || 'Unknown';
            setCitizenName(citizenName);

            const sourceName = data.basic_info?.[0]?.source_name || 'Unknown';
            setSourceNameFetched(sourceName);

            const ge = data.basic_info?.[0]?.gender || 'Unknown';
            setGender(ge);

            const schedu = data.basic_info?.[0]?.schedule_id || 'Unknown';
            setScheduleIDD(schedu);

            const citiId = data.basic_info?.[0]?.citizen_id || 'Unknown';
            setCitizenID(citiId);

            setStore(data);
        } catch (error) {
            console.error("Error fetching Source Name against Tehsil data:", error);
        }
    };

    useEffect(() => {
        fetchCitizenVital();
    }, []);

    const isGenderAvailable = scheduleData && scheduleData?.Citizen_info?.[0]?.gender;

    const [searchQuery, setSearchQuery] = useState('');
    const [filteredResults, setFilteredResults] = useState(searchResults);

    useEffect(() => {
        const filtered = searchResults.filter(result =>
            (result.name && result.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (result.aadhar_id && result.aadhar_id.includes(searchQuery))
        );
        setFilteredResults(filtered);
    }, [searchQuery, searchResults]);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const slicedResults = filteredResults.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    const handleDownload = async () => {
        try {
            console.log('Starting handleDownload function');

            // Fetch data from the API
            const response = await fetch(`${Port}/Screening/citizen-download/${selectedCitizenId}/${selectedScheduleCount}/`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            console.log('API call response:', response);

            if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Fetched data:', data);

            // Set default values if null or empty
            const processedData = {
                psycho_info: data.psycho_info || [],
                dental_info: data.dental_info || [],
                vision_info: data.vision_info || [],
                audit_info: data.audit_info || [],
                immunization_info: data.immunization_info || [],
                basic_info: data.basic_info || [],
                bmi_info: data.bmi_info || [],
                vital_info: data.vital_info || [],
                pft_info: data.pft_info || [],
                basic_info2: data.basic_info2 || [],
            };
            // Log the processed data
            console.log('Processed data:', processedData);

            // Log specific data for basic_info2
            console.log('Basic Info 2:', processedData.basic_info2);

            // Set the fetched data
            setFetchedData(processedData);
        } catch (error) {
            console.error('Error fetching data', error);
        }
    };

    useEffect(() => {
        handleDownload();
    }, []);

    useEffect(() => {
        if (fetchedData) {
            try {
                console.log('Generating PDF from healthCard element');

                // Temporarily change display for PDF generation
                const healthCardElement = healthCardRef.current;
                healthCardElement.style.display = 'block';

                html2PDF(healthCardElement, {
                    jsPDF: { unit: 'px', format: 'letter', orientation: 'portrait' },
                    imageType: 'image/jpeg',
                    output: 'Healthcard.pdf',
                    html2canvas: {
                        scrollX: 0,
                        scrollY: -window.scrollY, // Adjust for current scroll position
                    },
                    pagebreak: { mode: 'avoid-all', before: '#footer' }, // Ensure footer is on the page
                }).then(() => {
                    // Hide the element again after generating the PDF
                    healthCardElement.style.display = 'none';
                });

            } catch (error) {
                console.error('Error generating PDF', error);
            }
        }
    }, [fetchedData]);

    // useEffect(() => {
    //     if (fetchedData &&
    //         fetchedData.bmi_info && fetchedData.bmi_info.length > 0 &&
    //         fetchedData.vital_info && fetchedData.vital_info.length > 0 &&
    //         fetchedData.basic_info && fetchedData.basic_info.length > 0 &&
    //         fetchedData.audit_info && fetchedData.audit_info.length > 0 &&
    //         fetchedData.vision_info && fetchedData.vision_info.length > 0
    //     ) {
    //         try {
    //             console.log('Generating PDF from healthCard element');
    //             const input = document.getElementById('healthCard');
    //             if (!input) {
    //                 throw new Error('Element with ID "healthCard" not found.');
    //             }

    //             html2PDF(input, {
    //                 jsPDF: { unit: 'px', format: 'letter', orientation: 'portrait' },
    //                 imageType: 'image/jpeg',
    //                 output: 'download.pdf',
    //             });

    //             html2canvas(input).then((canvas) => {
    //                 const imgData = canvas.toDataURL('image/png');
    //                 const pdf = new jsPDF('p', 'mm', 'a4');
    //                 const imgWidth = 210;
    //                 const pageHeight = 294;
    //                 const imgHeight = (canvas.height * imgWidth) / canvas.width;
    //                 let heightLeft = imgHeight;

    //                 pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    //                 pdf.save('healthcard.pdf');
    //                 console.log('PDF saved successfully.');
    //             });
    //         } catch (error) {
    //             console.error('Error generating PDF', error);
    //         }
    //     }
    // }, [fetchedData]);

    //______________________________Healthcard Form Rendering__________________________________

    const [fetchVitalForm, setFetchVitalForm] = useState([]);

    useEffect(() => {
        const fetchForm = async () => {
            try {
                if (SourceUrlId && SourceNameUrlId && scheduleId) {
                    const response = await fetch(`${Port}/Screening/GET_Schedule_Screening_List/?source_id=${SourceUrlId}&source_name_id=${SourceNameUrlId}&schedule_id=${scheduleId}`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                        },
                    });
                    const data = await response.json();
                    if (data && data[0]) {
                        setFetchVitalForm(data[0].screening_list);
                    } else {
                        setFetchVitalForm([]);
                    }
                } else {
                    setFetchVitalForm([]);
                }
            } catch (error) {
                console.log(error);
                setFetchVitalForm([]);
            }
        };
        fetchForm();
    }, [SourceUrlId, SourceNameUrlId, scheduleId, accessToken]);

    // useEffect(() => {
    //     const fetchForm = async () => {
    //         try {
    //             const response = await fetch(`${Port}/Screening/GET_Schedule_Screening_List/?source_id=${SourceUrlId}&source_name_id=${SourceNameUrlId}&schedule_id=${id}`, {
    //                 headers: {
    //                     'Authorization': `Bearer ${accessToken}`,
    //                 },
    //             });
    //             const data = await response.json();
    //             setFetchVitalForm(data[0].screening_list);
    //         }
    //         catch (error) {
    //             console.log(error);
    //         }
    //     };
    //     fetchForm();
    // }, []);

    return (
        <div>
            <div class="content-wrapper">
                <div class="content-header fullscreen">
                    <div class="container-fluid">
                        <div className="card healthcard">
                            <div className="row">
                                <div className="col-md-12">
                                    <h6 className="healthcardtitle">Healthcard Information List</h6>

                                    <div className="dropdownall mb-3">
                                        <Box>
                                            <div class="container text-center">
                                                <div class="row" style={{ display: 'flex' }}>
                                                    <div class="col" style={{ color: 'white' }}>
                                                        <TextField
                                                            select
                                                            className="healthcardlistdropdown"
                                                            size="small"
                                                            label="Source"
                                                            id="select-small"
                                                            variant="outlined"
                                                            value={selectedSource}
                                                            onChange={event => setSelectedSource(event.target.value)}
                                                            InputLabelProps={{
                                                                style: {
                                                                    fontWeight: '100',
                                                                    fontSize: '14px', // Set the desired font size for the label
                                                                },
                                                            }}
                                                        >
                                                            <MenuItem value="">Select Source</MenuItem>
                                                            {sourceNav.map(drop => (
                                                                <MenuItem key={drop.source_pk_id} value={drop.source_pk_id}>
                                                                    {drop.source}
                                                                </MenuItem>
                                                            ))}
                                                        </TextField>

                                                    </div>

                                                    <div class="col" style={{ color: 'white' }}>
                                                        <TextField
                                                            select
                                                            className="healthcardlistdropdown"
                                                            size="small"
                                                            label="Source State"
                                                            id="select-small"
                                                            variant="outlined"
                                                            value={selectedStateNav}
                                                            onChange={event => setSelectedStateNav(event.target.value)}
                                                            InputLabelProps={{
                                                                style: {
                                                                    fontWeight: '100',
                                                                    fontSize: '14px', // Set the desired font size for the label
                                                                },
                                                            }}
                                                        >
                                                            <MenuItem value="">Select Source State</MenuItem>
                                                            {sourceStateNav.map(drop => (
                                                                <MenuItem key={drop.source_state} value={drop.source_state}>
                                                                    {drop.state_name}
                                                                </MenuItem>
                                                            ))}
                                                        </TextField>
                                                    </div>

                                                    <div class="col" style={{ color: 'white' }}>
                                                        <TextField
                                                            select
                                                            className="healthcardlistdropdown"
                                                            size="small"
                                                            label="Source District"
                                                            id="select-small"
                                                            variant="outlined"
                                                            value={selectedDistrictNav}
                                                            onChange={event => setSelectedDistrictNav(event.target.value)}
                                                            InputLabelProps={{
                                                                style: {
                                                                    fontWeight: '100',
                                                                    fontSize: '14px', // Set the desired font size for the label
                                                                },
                                                            }}
                                                        >
                                                            <MenuItem value="">Select Source District</MenuItem>
                                                            {sourceDistrictNav.map(drop => (
                                                                <MenuItem key={drop.source_district} value={drop.source_district}>
                                                                    {drop.dist_name}
                                                                </MenuItem>
                                                            ))}
                                                        </TextField>
                                                    </div>

                                                    <div class="col" style={{ color: 'white' }}>
                                                        <TextField
                                                            select
                                                            className="healthcardlistdropdown"
                                                            size="small"
                                                            label="Source Tehsil"
                                                            id="select-small"
                                                            variant="outlined"
                                                            value={selectedTehsilNav}
                                                            onChange={event => setSelectedTehsilNav(event.target.value)}
                                                            InputLabelProps={{
                                                                style: {
                                                                    fontWeight: '100',
                                                                    fontSize: '14px', // Set the desired font size for the label
                                                                },
                                                            }}
                                                        >
                                                            <MenuItem value="">Select Source Tehsil</MenuItem>
                                                            {sourceTehsilNav.map(drop => (
                                                                <MenuItem key={drop.source_taluka} value={drop.source_taluka}>
                                                                    {drop.tahsil_name}
                                                                </MenuItem>
                                                            ))}
                                                        </TextField>
                                                    </div>

                                                    <div class="col" style={{ color: 'white' }}>
                                                        <TextField
                                                            select
                                                            className="healthcardlistdropdown"
                                                            size="small"
                                                            label="Source Name"
                                                            id="select-small"
                                                            variant="outlined"
                                                            value={selectedName}
                                                            onChange={event => setSelectedName(event.target.value)}
                                                            InputLabelProps={{
                                                                style: {
                                                                    fontWeight: '100',
                                                                    fontSize: '14px', // Set the desired font size for the label
                                                                },
                                                            }}
                                                        >
                                                            <MenuItem value="">Select Source Name</MenuItem>
                                                            {sourceName.map(drop => (
                                                                <MenuItem key={drop.source_pk_id} value={drop.source_pk_id}>
                                                                    {drop.source_names}
                                                                </MenuItem>
                                                            ))}
                                                        </TextField>
                                                    </div>

                                                    <div className='col'>
                                                        <button
                                                            type='button'
                                                            className='btn btn-sm searchhealth'
                                                            onClick={handlesubmit} // Call the handleSearch function when the button is clicked
                                                        >
                                                            Search
                                                        </button>
                                                    </div>

                                                    {/* <div className='col'>
                                                        <input className="form-control searchhealthid"
                                                            placeholder='Search Citizen'
                                                        />
                                                        <SearchIcon className="searchiconhealthid" />
                                                    </div> */}

                                                </div>
                                            </div>
                                        </Box>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-4">
                                <input
                                    className='form-control mb-3'
                                    placeholder="Search Citizen..."
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                />
                                <table className="table table-borderless">
                                    <thead className="">
                                        <tr className="card cardheadhealthcard">
                                            <th className="col">Citizen Name</th>
                                            <th className="col">Aadhar ID</th>
                                            <th className="col">Action</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {loading ? (
                                            <tr>
                                                <td colSpan="3" className="text-center">
                                                    <CircularProgress className='circular-progress-containerscreeninglist' style={{ margin: 'auto' }} />
                                                </td>
                                            </tr>
                                        ) : filteredResults.length === 0 ? (
                                            <tr>
                                                <td className="nodatafounddddd" colSpan="3">No data found</td>
                                            </tr>
                                        ) : (
                                            slicedResults.map((result, index) => (
                                                <tr
                                                    key={index}
                                                    className={`card cardbodyhealthcard ${result.citizen_id === 'selectedCitizenId' ? 'hovered' : ''}`}
                                                    onClick={() => handleEyeClick(result.citizen_id)}
                                                >
                                                    <td className="col">{result.name.toLowerCase().charAt(0).toUpperCase() + result.name.toLowerCase().slice(1)}</td>
                                                    <td className="col">{result.aadhar_id}</td>
                                                    <td className="col">
                                                        <RemoveRedEyeOutlinedIcon />
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>

                                    <tfoot>
                                        <tr>
                                            <td colSpan="3">
                                                <div className="paginationnew" style={{ marginTop: '0%' }}>
                                                    <TablePagination
                                                        component="div"
                                                        count={filteredResults.length}
                                                        page={page}
                                                        onPageChange={handleChangePage}
                                                        rowsPerPage={rowsPerPage}
                                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                                        rowsPerPageOptions={[5, 10, 20]} // Adjust options based on your requirements
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>

                            <div className="col-md-8">
                                <div className={`card ${isDataFetched ? 'data-fetched' : ''}`}>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="row">
                                                <div className="col-md-4 titlehealth">Citizen Name : </div>
                                                <div className="col-md-7 healthresponsetitle">{scheduleData.Citizen_info?.[0]?.name}</div>

                                                <div className="col-md-4 titlehealth1">Citizen ID : </div>
                                                <div className="col-md-7 healthresponsetitle1">{scheduleData.Citizen_info?.[0]?.citizen_id}</div>
                                            </div>
                                            <hr className="hrline" />
                                            <div className="row cardhealth">
                                                <div className='col-md-3 ealthcardtitle'>Gender</div>
                                                <div className='col-md-4 ealthcardtitle'>DOB</div>
                                                <div className='col-md-4 ealthcardtitle'>Age</div>

                                                <div className='col-md-3 ealthcardtitle1'>{scheduleData.Citizen_info?.[0]?.gender}</div>
                                                <div className='col-md-4 ealthcardtitle1'>{scheduleData.Citizen_info?.[0]?.dob}</div>
                                                <div className='col-md-4 ealthcardtitle1'>{scheduleData.Citizen_info?.[0]?.year}</div>
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="row">
                                                <div className="col-md-8">
                                                    <label className="visually-hidden screenid">Screening Count</label>
                                                    <select className="form-control from-control-sm screedropdown"
                                                        onChange={(e) => {
                                                            fetchCitizenVital(e.target.value);
                                                            setSelectedScheduleCount(e.target.value);
                                                        }}>
                                                        <option>Select</option>
                                                        {totalCount.map((option) => (
                                                            <option key={option} value={option}>
                                                                {option}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="col-md-4">
                                                    <button className="downloadhealthcardddddddddddddddddddddddddddd" onClick={handleDownload}>
                                                        Healthcard
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="col-md-3 idddddddd">Schedule ID-</div>
                                                <div className="col-md-6 scheduledidhealthcard" style={{ marginTop: '3px', marginLeft: '-15px' }}>{scheduleId}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* <div className="row form-tabs">
                                                <div className={`col healthvitalname ${selectedForm === 'bmiform' ? 'selected-tab' : ''}`} onClick={() => handleFormClick('bmiform')}>BMI & Symptoms</div>
                                                <div className={`col-md-1 healthvitalname ${selectedForm === 'vitalform' ? 'selected-tab' : ''}`} onClick={() => handleFormClick('vitalform')}>Vital</div>
                                                <div className={`col healthvitalname ${selectedForm === 'basicscreenform' ? 'selected-tab' : ''}`} onClick={() => handleFormClick('basicscreenform')}>Basic Screening</div>
                                                <div className={`col healthvitalname ${selectedForm === 'immunizationform' ? 'selected-tab' : ''}`} onClick={() => handleFormClick('immunizationform')}>Immunization</div>
                                                <div className={`col-md-1 healthvitalname ${selectedForm === 'auditoryform' ? 'selected-tab' : ''}`} onClick={() => handleFormClick('auditoryform')}>Auditory</div>
                                                <div className={`col healthvitalname ${selectedForm === 'dentalcheckupform' ? 'selected-tab' : ''}`} onClick={() => handleFormClick('dentalcheckupform')}>Dental Check Up</div>
                                                <div className={`col-md-1 healthvitalname ${selectedForm === 'visionform' ? 'selected-tab' : ''}`} onClick={() => handleFormClick('visionform')}>Vision</div>
                                                <div className={`col healthvitalname ${selectedForm === 'psychologicalform' ? 'selected-tab' : ''}`} onClick={() => handleFormClick('psychologicalform')}>Psychological</div>
                                            </div> */}
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="card">
                                            <div
                                                className="row form-tabs"
                                                style={{
                                                    display: 'flex',
                                                    overflowX: 'auto',
                                                    height: '4em',
                                                }}
                                            >
                                                {fetchVitalForm.length > 0 ?
                                                    (
                                                        fetchVitalForm
                                                            .filter(form =>
                                                                form.screening_list !== 'Investigation' && form.screening_list !== 'Immunisation '
                                                            )
                                                            .map((form, index) => (
                                                                <div
                                                                    key={index}
                                                                    style={{
                                                                        display: 'inline-flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        cursor: 'pointer',
                                                                        backgroundColor: selectedForm === form.screening_vitals ? '#ddd' : 'transparent',
                                                                        borderRadius: '4px',
                                                                        '&:hover': {
                                                                            backgroundColor: '#f0f0f0',
                                                                        },
                                                                    }}
                                                                    className={`col healthvitalname ${selectedForm === form.screening_vitals ? 'selected-tab' : ''}`}
                                                                    onClick={() => handleFormClick(form.screening_list)}
                                                                >
                                                                    {form.screening_list}
                                                                </div>
                                                            ))
                                                    ) :
                                                    (
                                                        <div className="row form-tabs"
                                                            style={{
                                                                display: 'flex',
                                                                overflowX: 'auto',
                                                                height: '4em',
                                                                marginLeft: '2em'
                                                            }}
                                                        >
                                                            No screening forms available.
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-4">
                                        {isGenderAvailable && (
                                            <>
                                                {scheduleData.Citizen_info[0].gender === 'Male' ? (
                                                    <img className="malepiccc" src={malepic} alt="Male" />
                                                ) : (
                                                    <img className="femalepiccc" src={femalePic} alt="Female" />
                                                )}
                                            </>
                                        )}
                                    </div>

                                    <div className="col-md-8">
                                        <div className="card cardhealthcardallvitalscomponenet">
                                            {selectedForm === 'Basic Information' && <CitizenInfoHealth citizenData={citizen} />}
                                            {selectedForm === 'Emergency Details' && <FamilyInfo family={family} />}
                                            {selectedForm === 'BMI & Symptoms' && <BmiHealth bmiData={bmiData} />}
                                            {selectedForm === 'Vital' && <Vitalhealth vitalsData={vitalsData} />}
                                            {selectedForm === 'Basic Screening' && <BasicScreenVital basicScreenData={basicScreenData} />}
                                            {selectedForm === 'Auditory' && <AuditoryHealth auditoryData={auditoryData} auditory={auditory} />}
                                            {selectedForm === 'Dental Check Up' && <DentalHealth dentalData={dentalData} />}
                                            {selectedForm === 'Vision' && <VisionHealth visionData={visionData} vision={vision} />}
                                            {selectedForm === 'Medical History' && <Medicalhistory medical={medical} />}
                                            {selectedForm === 'immunizationform' && <ImmunisationHealth immunizationData={immunizationData} />}
                                            {selectedForm === 'Psychological Screening' && <PsychologicalHealth psychoData={psychoData} />}
                                            {selectedForm === 'Pulmonary Function Tests' && <PftHealth pft={pft} />}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div
                            ref={dashboardRef}
                            id="dashboard-content"
                            style={{
                                width: '210mm',
                                flex: 1,
                            }}
                        >
                            <div
                                ref={healthCardRef}
                                id="healthCard"
                                style={{
                                    // backgroundImage: `url(${backgroundImage})`,
                                    backgroundSize: 'contain',
                                    width: '100%',
                                    // height: '100%',
                                    padding: '2em',
                                    boxSizing: 'border-box',
                                    display: 'none'
                                }}
                            >
                                <div>
                                    <Grid container spacing={2}>
                                        <Grid container spacing={2}
                                            style={{ height: 'auto', backgroundColor: '#313774', marginLeft: '1em', borderRadius: '0.5em', marginTop: '0.3em' }}
                                        >
                                            <Grid item xs={12} md={9} style={{ paddingRight: '1em', marginBottom: '1em' }}>
                                                <Typography color="white" style={{ fontSize: '25px', marginLeft: '2em' }}>
                                                    {sourceNameFetched || 'No Citizen Name Available'}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} md={3} style={{ paddingRight: '1em', marginBottom: '1em' }}>
                                                <img
                                                    src={sperologo}
                                                    alt="Logo"
                                                    style={{ width: '90px', height: '60px', marginLeft: '2em' }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={3} style={{ paddingRight: '1em', marginBottom: '1em', marginTop: '-2.5em' }}>
                                                {/* <Typography variant="h1" color="white">Column 1</Typography> */}
                                                {/* <img src={imageShows} /> */}
                                                <img src={imageShows} alt="Image description" style={{ width: '5em', height: '4em' }} />
                                            </Grid>
                                            <Grid item xs={12} md={4} style={{ marginBottom: '1em', fontSize: '12px' }}>
                                                <Typography color="white" style={{ fontSize: '13px' }}>
                                                    Citizen Name:  {citizenName || 'No Citizen Name Available'}
                                                </Typography>
                                                <Typography color="white" style={{ fontSize: '13px' }}>
                                                    Gender:{gender || 'No Citizen Name Available'}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} md={5} style={{ marginBottom: '1em', fontSize: '12px' }}>
                                                <Typography style={{ fontSize: '13px' }} color="white">
                                                    Screening ID:  {scheduleIDD || 'No Citizen Name Available'}
                                                </Typography>
                                                <Typography style={{ fontSize: '13px' }} color="white">
                                                    CitizenID:{citizenID || 'No Citizen Name Available'}
                                                </Typography>
                                            </Grid>
                                        </Grid>

                                        {/* GROWTH MONITORING */}
                                        {fetchedData?.bmi_info?.length > 0 && (
                                            <Grid item xs={12} md={6} style={{ paddingRight: '1em', marginBottom: '0.5em', marginTop: '0.2em' }}>
                                                <Card
                                                    sx={{
                                                        boxShadow: 3,
                                                        borderRadius: '1.2em',
                                                        backgroundColor: '#F4F5FA',
                                                        height: 'auto',
                                                    }}
                                                >
                                                    <CardContent style={{ marginBottom: '1.3em' }}>
                                                        <Typography variant="h5" align="left" color="#313774"
                                                            style={{
                                                                fontFamily: 'Poppins',
                                                                fontSize: '18px',
                                                                marginBottom: '18px'
                                                            }}
                                                        >
                                                            GROWTH MONITORING
                                                        </Typography>

                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} md={7}
                                                                style={{
                                                                    fontFamily: 'Poppins',
                                                                    fontSize: '17px',
                                                                }}
                                                            >
                                                                Height:
                                                            </Grid>

                                                            <Grid item xs={12}
                                                                md={5}
                                                                style={{
                                                                    fontWeight: 'bold',
                                                                    marginTop: '-5px'
                                                                }}
                                                            >
                                                                {fetchedData?.bmi_info[0]?.height || 'N/A'}
                                                            </Grid>
                                                        </Grid>

                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} md={7} style={{
                                                                fontFamily: 'Poppins',
                                                                fontSize: '17px',
                                                            }}>
                                                                Weight:
                                                            </Grid>
                                                            <Grid item xs={12}
                                                                md={5}
                                                                style={{
                                                                    fontWeight: 'bold',
                                                                    marginTop: '-5px'
                                                                }}>
                                                                {fetchedData?.bmi_info[0]?.weight || 'N/A'}
                                                            </Grid>
                                                        </Grid>

                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} md={7} style={{
                                                                fontFamily: 'Poppins',
                                                                fontSize: '17px',
                                                            }}>
                                                                Weight for Age:
                                                            </Grid>
                                                            <Grid item xs={12}
                                                                md={5}
                                                                style={{
                                                                    fontWeight: 'bold',
                                                                    marginTop: '-5px'
                                                                }}>
                                                                {fetchedData?.bmi_info[0]?.weight_for_age || 'N/A'}
                                                            </Grid>
                                                        </Grid>

                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} md={7} style={{
                                                                fontFamily: 'Poppins',
                                                                fontSize: '17px',
                                                            }}>
                                                                Height for Age:
                                                            </Grid>
                                                            <Grid item xs={12}
                                                                md={5}
                                                                style={{
                                                                    fontWeight: 'bold',
                                                                    marginTop: '-5px'
                                                                }}>
                                                                {fetchedData?.bmi_info[0]?.height_for_age || 'N/A'}
                                                            </Grid>
                                                        </Grid>

                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} md={7} style={{
                                                                fontFamily: 'Poppins',
                                                                fontSize: '17px',
                                                            }}>
                                                                Weight for Height:
                                                            </Grid>
                                                            <Grid item xs={12}
                                                                md={5}
                                                                style={{
                                                                    fontWeight: 'bold',
                                                                    marginTop: '-5px'
                                                                }}>
                                                                {fetchedData?.bmi_info[0]?.weight_for_height || 'N/A'}
                                                            </Grid>
                                                        </Grid>

                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} md={7} style={{
                                                                fontFamily: 'Poppins',
                                                                fontSize: '17px',
                                                            }}>
                                                                BMI:
                                                            </Grid>
                                                            <Grid item xs={12}
                                                                md={5}
                                                                style={{
                                                                    fontWeight: 'bold',
                                                                    marginTop: '-5px'
                                                                }}>
                                                                {fetchedData?.bmi_info[0]?.bmi || 'N/A'}
                                                            </Grid>
                                                        </Grid>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        )}

                                        {/* VITALS */}
                                        {fetchedData?.vital_info?.length > 0 && (
                                            <Grid item xs={12} md={6} style={{ paddingRight: '2em', marginBottom: '0.5em', marginTop: '0.2em' }}>
                                                <Card
                                                    sx={{
                                                        boxShadow: 3,
                                                        borderRadius: '1.2em',
                                                        backgroundColor: '#F4F5FA',
                                                        height: 'auto',
                                                    }}
                                                >
                                                    <CardContent style={{ marginBottom: '1.3em' }}>
                                                        <Typography variant="h5" align="left" color="#313774"
                                                            style={{
                                                                fontFamily: 'Poppins',
                                                                fontSize: '18px',
                                                                marginBottom: '18px',
                                                            }}
                                                        >
                                                            VITALS
                                                        </Typography>

                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} md={7}
                                                                style={{
                                                                    fontFamily: 'Poppins',
                                                                    fontSize: '17px',
                                                                }}
                                                            >
                                                                Pulse:
                                                            </Grid>
                                                            <Grid item xs={12}
                                                                md={5}
                                                                style={{
                                                                    fontWeight: 'bold',
                                                                    marginTop: '-5px'
                                                                }}>
                                                                {fetchedData?.vital_info[0]?.pulse || 'N/A'}
                                                            </Grid>
                                                        </Grid>

                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} md={7} style={{
                                                                fontFamily: 'Poppins',
                                                                fontSize: '17px',
                                                            }}>
                                                                Sys(mm):
                                                            </Grid>
                                                            <Grid item xs={12}
                                                                md={5}
                                                                style={{
                                                                    fontWeight: 'bold',
                                                                    marginTop: '-5px'
                                                                }}>
                                                                {fetchedData?.vital_info[0]?.sys_mm || 'N/A'}
                                                            </Grid>
                                                        </Grid>

                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} md={7} style={{
                                                                fontFamily: 'Poppins',
                                                                fontSize: '17px',
                                                            }}>
                                                                Dys(mm):
                                                            </Grid>
                                                            <Grid item xs={12}
                                                                md={5}
                                                                style={{
                                                                    fontWeight: 'bold',
                                                                    marginTop: '-5px'
                                                                }}>
                                                                {fetchedData?.vital_info[0]?.dys_mm || 'N/A'}
                                                            </Grid>
                                                        </Grid>

                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} md={7} style={{
                                                                fontFamily: 'Poppins',
                                                                fontSize: '17px',
                                                            }}>
                                                                O2:
                                                            </Grid>
                                                            <Grid item xs={12}
                                                                md={5}
                                                                style={{
                                                                    fontWeight: 'bold',
                                                                    marginTop: '-5px'
                                                                }}>
                                                                {fetchedData?.vital_info[0]?.oxygen_saturation || 'N/A'}
                                                            </Grid>
                                                        </Grid>

                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} md={7} style={{
                                                                fontFamily: 'Poppins',
                                                                fontSize: '17px',
                                                            }}>
                                                                RR :
                                                            </Grid>
                                                            <Grid item xs={12}
                                                                md={5}
                                                                style={{
                                                                    fontWeight: 'bold',
                                                                    marginTop: '-5px'
                                                                }}>
                                                                {fetchedData?.vital_info[0]?.rr || 'N/A'}
                                                            </Grid>
                                                        </Grid>

                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} md={7} style={{
                                                                fontFamily: 'Poppins',
                                                                fontSize: '17px',
                                                            }}>
                                                                Temperature :
                                                            </Grid>
                                                            <Grid item xs={12}
                                                                md={5}
                                                                style={{
                                                                    fontWeight: 'bold',
                                                                    marginTop: '-5px'
                                                                }}>
                                                                {fetchedData?.vital_info[0]?.temp || 'N/A'}
                                                            </Grid>
                                                        </Grid>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        )}

                                        {/* GENERAL EXAMINATION */}
                                        {basicInfo2Data.map((item, index) => (
                                            <Grid item xs={12} md={6} style={{ paddingRight: '1em', marginBottom: '0.5em' }}>
                                                <Card
                                                    sx={{
                                                        boxShadow: 3,
                                                        borderRadius: '1.2em',
                                                        backgroundColor: '#F4F5FA',
                                                        height: 'auto',
                                                    }}
                                                >
                                                    <CardContent style={{ marginBottom: '0.5em' }}>
                                                        <Typography variant="h5" align="left" color="#313774"
                                                            style={{
                                                                fontFamily: 'Poppins',
                                                                fontSize: '18px',
                                                                marginBottom: '18px',
                                                            }}
                                                        >
                                                            GENERAL EXAMINATION
                                                        </Typography>
                                                    </CardContent>

                                                    <Grid container spacing={2}>
                                                        {/* {basicInfo2Data.map((item, index) => ( */}
                                                        <Grid container spacing={2} key={index} style={{ marginBottom: '2em' }}>
                                                            {Object.entries(item).map(([key, value]) => (
                                                                <React.Fragment key={key}>
                                                                    <Grid
                                                                        item
                                                                        xs={12}
                                                                        md={5}
                                                                        style={{
                                                                            fontFamily: 'Poppins',
                                                                            fontSize: '17px',
                                                                            marginLeft: '2.3em',
                                                                            marginBottom: '-1em',
                                                                        }}
                                                                    >
                                                                        {`${key}:`}
                                                                    </Grid>
                                                                    <Grid
                                                                        item
                                                                        xs={12}
                                                                        md={5}
                                                                        style={{
                                                                            fontWeight: 'bold',
                                                                            marginTop: '-5px',
                                                                            marginBottom: '-1em',
                                                                        }}
                                                                    >
                                                                        {value || 'NAD'}
                                                                    </Grid>
                                                                </React.Fragment>
                                                            ))}
                                                        </Grid>
                                                    </Grid>
                                                </Card>
                                            </Grid>
                                        ))}

                                        {/* {fetchedData?.basic_info?.length > 0 && (
                                            <Grid item xs={12} md={6} style={{ paddingRight: '1em', marginBottom: '0.5em' }}>
                                                <Card
                                                    sx={{
                                                        boxShadow: 3,
                                                        borderRadius: '1.2em',
                                                        backgroundColor: '#F4F5FA',
                                                        height: 'auto',
                                                    }}
                                                >
                                                    <CardContent style={{ marginBottom: '0.5em' }}>
                                                        <Typography variant="h5" align="left" color="#313774"
                                                            style={{
                                                                fontFamily: 'Poppins',
                                                                fontSize: '18px',
                                                                marginBottom: '18px',
                                                            }}
                                                        >
                                                            GENERAL EXAMINATION
                                                        </Typography>

                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} md={7}
                                                                style={{
                                                                    fontFamily: 'Poppins',
                                                                    fontSize: '17px',
                                                                }}
                                                            >
                                                                Head:
                                                            </Grid>
                                                            <Grid item xs={12}
                                                                md={5}
                                                                style={{
                                                                    fontWeight: 'bold',
                                                                    marginTop: '-5px'
                                                                }}>
                                                                {fetchedData?.basic_info[0]?.head || 'NAD'}
                                                            </Grid>
                                                        </Grid>

                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} md={7}
                                                                style={{
                                                                    fontFamily: 'Poppins',
                                                                    fontSize: '17px',
                                                                }}
                                                            >
                                                                Neck:
                                                            </Grid>
                                                            <Grid item xs={12}
                                                                md={5}
                                                                style={{
                                                                    fontWeight: 'bold',
                                                                    marginTop: '-5px'
                                                                }}>
                                                                {fetchedData?.basic_info[0]?.neck || 'NAD'}
                                                            </Grid>
                                                        </Grid>

                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} md={7}
                                                                style={{
                                                                    fontFamily: 'Poppins',
                                                                    fontSize: '17px',
                                                                }}
                                                            >
                                                                Skin Texture :
                                                            </Grid>
                                                            <Grid item xs={12}
                                                                md={5}
                                                                style={{
                                                                    fontWeight: 'bold',
                                                                    marginTop: '-5px'
                                                                }}>
                                                                {fetchedData?.basic_info[0]?.skin_texture || 'NAD'}
                                                            </Grid>
                                                        </Grid>

                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} md={7}
                                                                style={{
                                                                    fontFamily: 'Poppins',
                                                                    fontSize: '17px',
                                                                }}
                                                            >
                                                                Mouth Lips:
                                                            </Grid>
                                                            <Grid item xs={12}
                                                                md={5}
                                                                style={{
                                                                    fontWeight: 'bold',
                                                                    marginTop: '-5px'
                                                                }}>
                                                                {fetchedData?.basic_info[0]?.lips || 'NAD'}
                                                            </Grid>
                                                        </Grid>

                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} md={7}
                                                                style={{
                                                                    fontFamily: 'Poppins',
                                                                    fontSize: '17px',
                                                                }}
                                                            >
                                                                Mouth Tongue:
                                                            </Grid>
                                                            <Grid item xs={12}
                                                                md={5}
                                                                style={{
                                                                    fontWeight: 'bold',
                                                                    marginTop: '-5px'
                                                                }}>
                                                                {fetchedData?.basic_info[0]?.tongue || 'NAD'}
                                                            </Grid>
                                                        </Grid>

                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} md={7}
                                                                style={{
                                                                    fontFamily: 'Poppins',
                                                                    fontSize: '17px',
                                                                }}
                                                            >
                                                                Hair Density:
                                                            </Grid>
                                                            <Grid item xs={12}
                                                                md={5}
                                                                style={{
                                                                    fontWeight: 'bold',
                                                                    marginTop: '-5px'
                                                                }}>
                                                                {fetchedData?.basic_info[0]?.hair_density || 'NAD'}
                                                            </Grid>
                                                        </Grid>

                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} md={7}
                                                                style={{
                                                                    fontFamily: 'Poppins',
                                                                    fontSize: '17px',
                                                                }}
                                                            >
                                                                Alopecia:
                                                            </Grid>
                                                            <Grid item xs={12}
                                                                md={5}
                                                                style={{
                                                                    fontWeight: 'bold',
                                                                    marginTop: '-5px'
                                                                }}>
                                                                {fetchedData?.basic_info[0]?.alopecia || 'NAD'}
                                                            </Grid>
                                                        </Grid>

                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} md={7}
                                                                style={{
                                                                    fontFamily: 'Poppins',
                                                                    fontSize: '17px',
                                                                }}
                                                            >
                                                                Abdomen:
                                                            </Grid>
                                                            <Grid item xs={12}
                                                                md={5}
                                                                style={{
                                                                    fontWeight: 'bold',
                                                                    marginTop: '-5px'
                                                                }}>
                                                                {fetchedData?.basic_info[0]?.abdomen || 'NAD'}
                                                            </Grid>
                                                        </Grid>

                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} md={7}
                                                                style={{
                                                                    fontFamily: 'Poppins',
                                                                    fontSize: '17px',
                                                                }}
                                                            >
                                                                Skin colour:
                                                            </Grid>
                                                            <Grid item xs={12}
                                                                md={5}
                                                                style={{
                                                                    fontWeight: 'bold',
                                                                    marginTop: '-5px'
                                                                }}>
                                                                {fetchedData?.basic_info[0]?.skin_color || 'NAD'}
                                                            </Grid>
                                                        </Grid>

                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} md={7}
                                                                style={{
                                                                    fontFamily: 'Poppins',
                                                                    fontSize: '17px',
                                                                }}
                                                            >
                                                                Skin Lesions:
                                                            </Grid>
                                                            <Grid item xs={12}
                                                                md={5}
                                                                style={{
                                                                    fontWeight: 'bold',
                                                                    marginTop: '-5px'
                                                                }}>
                                                                {fetchedData?.basic_info[0]?.skin_lesions || 'NAD'}
                                                            </Grid>
                                                        </Grid>

                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} md={7}
                                                                style={{
                                                                    fontFamily: 'Poppins',
                                                                    fontSize: '17px',
                                                                }}
                                                            >
                                                                Hair Colour:
                                                            </Grid>
                                                            <Grid item xs={12}
                                                                md={5}
                                                                style={{
                                                                    fontWeight: 'bold',
                                                                    marginTop: '-5px'
                                                                }}>
                                                                {fetchedData?.basic_info[0]?.hair_color || 'NAD'}
                                                            </Grid>
                                                        </Grid>

                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} md={7}
                                                                style={{
                                                                    fontFamily: 'Poppins',
                                                                    fontSize: '17px',
                                                                }}
                                                            >
                                                                Nose:
                                                            </Grid>
                                                            <Grid item xs={12}
                                                                md={5}
                                                                style={{
                                                                    fontWeight: 'bold',
                                                                    marginTop: '-5px'
                                                                }}>
                                                                {fetchedData?.basic_info[0]?.nose || 'NAD'}
                                                            </Grid>
                                                        </Grid>

                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} md={7}
                                                                style={{
                                                                    fontFamily: 'Poppins',
                                                                    fontSize: '17px',
                                                                }}
                                                            >
                                                                Gums:
                                                            </Grid>
                                                            <Grid item xs={12}
                                                                md={5}
                                                                style={{
                                                                    fontWeight: 'bold',
                                                                    marginTop: '-5px'
                                                                }}>
                                                                {fetchedData?.basic_info[0]?.gums || 'NAD'}
                                                            </Grid>
                                                        </Grid>

                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} md={7}
                                                                style={{
                                                                    fontFamily: 'Poppins',
                                                                    fontSize: '17px',
                                                                }}
                                                            >
                                                                Dention:
                                                            </Grid>
                                                            <Grid item xs={12}
                                                                md={5}
                                                                style={{
                                                                    fontWeight: 'bold',
                                                                    marginTop: '-5px'
                                                                }}>
                                                                {fetchedData?.basic_info[0]?.dention || 'NAD'}
                                                            </Grid>
                                                        </Grid>

                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} md={7}
                                                                style={{
                                                                    fontFamily: 'Poppins',
                                                                    fontSize: '17px',
                                                                }}
                                                            >
                                                                Oral Mucosa:
                                                            </Grid>
                                                            <Grid item xs={12}
                                                                md={5}
                                                                style={{
                                                                    fontWeight: 'bold',
                                                                    marginTop: '-5px'
                                                                }}>
                                                                {fetchedData?.basic_info[0]?.oral_mucosa || 'NAD'}
                                                            </Grid>
                                                        </Grid>

                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} md={7} style={{
                                                                fontFamily: 'Poppins',
                                                                fontSize: '17px',
                                                            }}>
                                                                Extremity:
                                                            </Grid>
                                                            <Grid item xs={12}
                                                                md={5}
                                                                style={{
                                                                    fontWeight: 'bold',
                                                                    marginTop: '-5px'
                                                                }}>
                                                                {fetchedData?.basic_info[0]?.extremity || 'NAD'}
                                                            </Grid>
                                                        </Grid>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        )} */}

                                        {/* {fetchedData?.basic_info2?.length > 0 && (
                                            <Grid item xs={12} md={6} style={{ paddingRight: '1em', marginBottom: '0.5em' }}>
                                                <Card
                                                    sx={{
                                                        boxShadow: 3,
                                                        borderRadius: '1.2em',
                                                        backgroundColor: '#F4F5FA',
                                                        height: 'auto',
                                                    }}
                                                >
                                                    <CardContent style={{ marginBottom: '0.5em' }}>
                                                        <Typography variant="h5" align="left" color="#313774"
                                                            style={{
                                                                fontFamily: 'Poppins',
                                                                fontSize: '18px',
                                                                marginBottom: '18px',
                                                            }}
                                                        >
                                                            GENERAL EXAMINATION
                                                        </Typography>

                                                        <Grid container spacing={2}>
                                                            {Object.entries(fetchedData.basic_info2[0]).map(([key, value]) => (
                                                                <Grid container key={key} spacing={2} alignItems="center">
                                                                    <Grid item xs={6}
                                                                        style={{
                                                                            fontFamily: 'Poppins',
                                                                            fontSize: '17px',
                                                                            fontWeight: 'bold',
                                                                            textAlign: 'left',
                                                                            paddingRight: '1em',
                                                                        }}
                                                                    >
                                                                        {key}:
                                                                    </Grid>
                                                                    <Grid item xs={6}
                                                                        style={{
                                                                            fontFamily: 'Poppins',
                                                                            fontSize: '17px',
                                                                            textAlign: 'right',
                                                                        }}
                                                                    >
                                                                        {value || 'N/A'}
                                                                    </Grid>
                                                                </Grid>
                                                            ))}
                                                        </Grid>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        )} */}

                                        {/*DENTAL*/}
                                        {fetchedData?.dental_info?.length > 0 && (
                                            <Grid item xs={12} md={6} style={{ paddingRight: '2em', marginBottom: '1em' }}>
                                                <Card
                                                    sx={{
                                                        boxShadow: 3,
                                                        borderRadius: '1.2em',
                                                        backgroundColor: '#F4F5FA',
                                                        height: 'auto',
                                                    }}
                                                >
                                                    <CardContent style={{ marginBottom: '1em' }}>
                                                        <Typography variant="h5" align="left" color="#313774"
                                                            style={{
                                                                fontFamily: 'Poppins',
                                                                fontSize: '18px',
                                                                marginBottom: '18px',
                                                            }}
                                                        >
                                                            Dental
                                                        </Typography>

                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} md={7}
                                                                style={{
                                                                    fontFamily: 'Poppins',
                                                                    fontSize: '17px',
                                                                }}
                                                            >
                                                                Oral Hygiene:
                                                            </Grid>
                                                            <Grid item xs={12}
                                                                md={5}
                                                                style={{
                                                                    fontWeight: 'bold',
                                                                    marginTop: '-5px'
                                                                }}>
                                                                {/* {fetchedData?.dental_info?.[0]?.oral_hygiene || 'N/A'} */}
                                                                {fetchedData?.dental_info?.[0]?.oral_hygiene ? (
                                                                    fetchedData.dental_info[0].oral_hygiene === "1" ? "Good" :
                                                                        fetchedData.dental_info[0].oral_hygiene === "2" ? "Fair" :
                                                                            fetchedData.dental_info[0].oral_hygiene === "3" ? "Poor" :
                                                                                "N/A"
                                                                ) : "N/A"}
                                                            </Grid>
                                                        </Grid>

                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} md={7}
                                                                style={{
                                                                    fontFamily: 'Poppins',
                                                                    fontSize: '17px',
                                                                }}
                                                            >
                                                                Gum Condition:
                                                            </Grid>
                                                            <Grid item xs={12}
                                                                md={5}
                                                                style={{
                                                                    fontWeight: 'bold',
                                                                    marginTop: '-5px'
                                                                }}>
                                                                {fetchedData?.dental_info?.[0]?.gum_condition ? (
                                                                    fetchedData.dental_info[0].gum_condition === "1" ? "Good" :
                                                                        fetchedData.dental_info[0].gum_condition === "2" ? "Fair" :
                                                                            fetchedData.dental_info[0].gum_condition === "3" ? "Poor" :
                                                                                "N/A"
                                                                ) : "N/A"}
                                                            </Grid>
                                                        </Grid>

                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} md={7}
                                                                style={{
                                                                    fontFamily: 'Poppins',
                                                                    fontSize: '17px',
                                                                }}
                                                            >
                                                                Oral Ulcer:
                                                            </Grid>
                                                            <Grid item xs={12}
                                                                md={5}
                                                                style={{
                                                                    fontWeight: 'bold',
                                                                    marginTop: '-5px'
                                                                }}>
                                                                {fetchedData?.dental_info?.[0]?.oral_ulcers ? (
                                                                    fetchedData.dental_info[0].oral_ulcers === "1" ? "No" :
                                                                        fetchedData.dental_info[0].oral_ulcers === "2" ? "Yes" :
                                                                            "N/A"
                                                                ) : "N/A"}
                                                            </Grid>
                                                        </Grid>

                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} md={7}
                                                                style={{
                                                                    fontFamily: 'Poppins',
                                                                    fontSize: '17px',
                                                                }}
                                                            >
                                                                Gum Bleeding:
                                                            </Grid>
                                                            <Grid item xs={12}
                                                                md={5}
                                                                style={{
                                                                    fontWeight: 'bold',
                                                                    marginTop: '-5px'
                                                                }}>
                                                                {fetchedData?.dental_info?.[0]?.gum_bleeding ? (
                                                                    fetchedData.dental_info[0].gum_bleeding === "1" ? "No" :
                                                                        fetchedData.dental_info[0].gum_bleeding === "2" ? "Yes" :
                                                                            "N/A"
                                                                ) : "N/A"}
                                                            </Grid>
                                                        </Grid>

                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} md={7}
                                                                style={{
                                                                    fontFamily: 'Poppins',
                                                                    fontSize: '17px',
                                                                }}
                                                            >
                                                                Discoloration of teeth:
                                                            </Grid>
                                                            <Grid item xs={12}
                                                                md={5}
                                                                style={{
                                                                    fontWeight: 'bold',
                                                                    marginTop: '-5px'
                                                                }}>
                                                                {fetchedData?.dental_info?.[0]?.discoloration_of_teeth ? (
                                                                    fetchedData.dental_info[0].discoloration_of_teeth === "1" ? "No" :
                                                                        fetchedData.dental_info[0].discoloration_of_teeth === "2" ? "Yes" :
                                                                            "N/A"
                                                                ) : "N/A"}
                                                            </Grid>
                                                        </Grid>

                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} md={7}
                                                                style={{
                                                                    fontFamily: 'Poppins',
                                                                    fontSize: '17px',
                                                                }}
                                                            >
                                                                Food Impaction:
                                                            </Grid>
                                                            <Grid item xs={12}
                                                                md={5}
                                                                style={{
                                                                    fontWeight: 'bold',
                                                                    marginTop: '-5px'
                                                                }}>
                                                                {fetchedData?.dental_info?.[0]?.food_impaction ? (
                                                                    fetchedData.dental_info[0].food_impaction === "1" ? "No" :
                                                                        fetchedData.dental_info[0].food_impaction === "2" ? "Yes" :
                                                                            "N/A"
                                                                ) : "N/A"}
                                                            </Grid>
                                                        </Grid>

                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} md={7}
                                                                style={{
                                                                    fontFamily: 'Poppins',
                                                                    fontSize: '17px',
                                                                }}
                                                            >
                                                                Carious teeth:
                                                            </Grid>
                                                            <Grid item xs={12}
                                                                md={5}
                                                                style={{
                                                                    fontWeight: 'bold',
                                                                    marginTop: '-5px'
                                                                }}>
                                                                {fetchedData?.dental_info?.[0]?.carious_teeth ? (
                                                                    fetchedData.dental_info[0].carious_teeth === "1" ? "No" :
                                                                        fetchedData.dental_info[0].carious_teeth === "2" ? "Yes" :
                                                                            "N/A"
                                                                ) : "N/A"}
                                                            </Grid>
                                                        </Grid>

                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} md={7}
                                                                style={{
                                                                    fontFamily: 'Poppins',
                                                                    fontSize: '17px',
                                                                }}
                                                            >
                                                                Carious Teeth:
                                                            </Grid>
                                                            <Grid item xs={12}
                                                                md={5}
                                                                style={{
                                                                    fontWeight: 'bold',
                                                                    marginTop: '-5px'
                                                                }}>
                                                                {fetchedData?.dental_info?.[0]?.carious_teeth ? (
                                                                    fetchedData.dental_info[0].carious_teeth === "1" ? "No" :
                                                                        fetchedData.dental_info[0].carious_teeth === "2" ? "Yes" :
                                                                            "N/A"
                                                                ) : "N/A"}
                                                            </Grid>
                                                        </Grid>

                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} md={7}
                                                                style={{
                                                                    fontFamily: 'Poppins',
                                                                    fontSize: '17px',
                                                                }}
                                                            >
                                                                Extraction Done:
                                                            </Grid>
                                                            <Grid item xs={12}
                                                                md={5}
                                                                style={{
                                                                    fontWeight: 'bold',
                                                                    marginTop: '-5px'
                                                                }}>
                                                                {fetchedData?.dental_info?.[0]?.extraction_done ? (
                                                                    fetchedData.dental_info[0].extraction_done === "1" ? "No" :
                                                                        fetchedData.dental_info[0].extraction_done === "2" ? "Yes" :
                                                                            "N/A"
                                                                ) : "N/A"}
                                                            </Grid>
                                                        </Grid>

                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} md={7}
                                                                style={{
                                                                    fontFamily: 'Poppins',
                                                                    fontSize: '17px',
                                                                }}
                                                            >
                                                                Oral Hygiene:
                                                            </Grid>
                                                            <Grid item xs={12}
                                                                md={5}
                                                                style={{
                                                                    fontWeight: 'bold',
                                                                    marginTop: '-5px'
                                                                }}>
                                                                {fetchedData?.dental_info?.[0]?.fluorosis ? (
                                                                    fetchedData.dental_info[0].fluorosis === "1" ? "No" :
                                                                        fetchedData.dental_info[0].fluorosis === "2" ? "Yes" :
                                                                            "N/A"
                                                                ) : "N/A"}
                                                            </Grid>
                                                        </Grid>

                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} md={7}
                                                                style={{
                                                                    fontFamily: 'Poppins',
                                                                    fontSize: '17px',
                                                                }}
                                                            >
                                                                Tooth Brushing:
                                                            </Grid>
                                                            <Grid item xs={12}
                                                                md={5}
                                                                style={{
                                                                    fontWeight: 'bold',
                                                                    marginTop: '-5px'
                                                                }}>
                                                                {fetchedData?.dental_info?.[0]?.tooth_brushing_frequency ? (
                                                                    fetchedData.dental_info[0].tooth_brushing_frequency === "1" ? "<1 Day" :
                                                                        fetchedData.dental_info[0].tooth_brushing_frequency === "2" ? "2/day" :
                                                                            fetchedData.dental_info[0].tooth_brushing_frequency === "3" ? "1/day" :
                                                                                "N/A"
                                                                ) : "N/A"}
                                                            </Grid>
                                                        </Grid>

                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} md={7}
                                                                style={{
                                                                    fontFamily: 'Poppins',
                                                                    fontSize: '17px',
                                                                }}
                                                            >
                                                                Sensitive Teeth:
                                                            </Grid>
                                                            <Grid item xs={12}
                                                                md={5}
                                                                style={{
                                                                    fontWeight: 'bold',
                                                                    marginTop: '-5px'
                                                                }}>
                                                                {fetchedData?.dental_info?.[0]?.sensitive_teeth ? (
                                                                    fetchedData.dental_info[0].sensitive_teeth === "1" ? "No" :
                                                                        fetchedData.dental_info[0].sensitive_teeth === "2" ? "Yes" :
                                                                            "N/A"
                                                                ) : "N/A"}
                                                            </Grid>
                                                        </Grid>

                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} md={7}
                                                                style={{
                                                                    fontFamily: 'Poppins',
                                                                    fontSize: '17px',
                                                                }}
                                                            >
                                                                Malalignment:
                                                            </Grid>
                                                            <Grid item xs={12}
                                                                md={5}
                                                                style={{
                                                                    fontWeight: 'bold',
                                                                    marginTop: '-5px'
                                                                }}>
                                                                {fetchedData?.dental_info?.[0]?.malalignment ? (
                                                                    fetchedData.dental_info[0].malalignment === "1" ? "No" :
                                                                        fetchedData.dental_info[0].malalignment === "2" ? "Yes" :
                                                                            "N/A"
                                                                ) : "N/A"}
                                                            </Grid>
                                                        </Grid>

                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} md={7}
                                                                style={{
                                                                    fontFamily: 'Poppins',
                                                                    fontSize: '17px',
                                                                }}
                                                            >
                                                                Orthodontic Treatment:
                                                            </Grid>
                                                            <Grid item xs={12}
                                                                md={5}
                                                                style={{
                                                                    fontWeight: 'bold',
                                                                    marginTop: '-5px'
                                                                }}>
                                                                {fetchedData?.dental_info?.[0]?.orthodontic_treatment ? (
                                                                    fetchedData.dental_info[0].orthodontic_treatment === "1" ? "No" :
                                                                        fetchedData.dental_info[0].orthodontic_treatment === "2" ? "Yes" :
                                                                            "N/A"
                                                                ) : "N/A"}
                                                            </Grid>
                                                        </Grid>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        )}

                                        {/* <footer style={{
                                            backgroundColor: '#313774',
                                            textAlign: 'center',
                                            borderTop: '1px solid #ddd',
                                            position: 'relative',
                                            bottom: 0,
                                            width: '100%',
                                            height: '2em',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            color: '#fff',
                                            boxSizing: 'border-box',
                                            marginTop: '-0.2em'
                                        }}>
                                            <div style={{ flex: 1, textAlign: 'left', paddingLeft: '1em', display: 'flex', alignItems: 'center' }}>
                                                <EmailIcon style={{ marginRight: '0.5em' }} />
                                                <p>sperohealthcare</p>
                                            </div>
                                            <div style={{ flex: 1, textAlign: 'right', paddingRight: '1em', display: 'flex', alignItems: 'center' }}>
                                                <LanguageIcon />
                                                <p>sperohealthcare.in</p>
                                            </div>
                                        </footer> */}

                                        {/* AUDIOMETRY */}
                                        {fetchedData?.audit_info?.length > 0 && (
                                            <Grid item xs={12} md={6} style={{ paddingRight: '1em', marginBottom: '1.6em', marginTop: '2.5em' }}>
                                                <Card
                                                    sx={{
                                                        boxShadow: 3,
                                                        borderRadius: '1.2em',
                                                        backgroundColor: '#F4F5FA',
                                                        height: 'auto',
                                                    }}
                                                >
                                                    <CardContent style={{ marginBottom: '1.3em' }}>
                                                        <Typography variant="h5" align="left" color="#313774"
                                                            style={{
                                                                fontFamily: 'Poppins',
                                                                fontSize: '18px',
                                                                marginBottom: '28px'
                                                            }}
                                                        >
                                                            AUDIOMETRY
                                                        </Typography>

                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} md={7}
                                                                style={{
                                                                    fontFamily: 'Poppins',
                                                                    fontSize: '17px',
                                                                }}
                                                            >
                                                                Right:
                                                            </Grid>
                                                            <Grid item xs={12}
                                                                md={5}
                                                                style={{
                                                                    fontWeight: 'bold',
                                                                    marginTop: '-5px'
                                                                }}>
                                                                {fetchedData?.vital_info[0]?.pulse || 'N/A'}
                                                            </Grid>
                                                        </Grid>

                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} md={7} style={{
                                                                fontFamily: 'Poppins',
                                                                fontSize: '17px',
                                                            }}>
                                                                Left:
                                                            </Grid>
                                                            <Grid item xs={12}
                                                                md={5}
                                                                style={{
                                                                    fontWeight: 'bold',
                                                                    marginTop: '-5px'
                                                                }}>
                                                                {fetchedData?.vital_info[0]?.pulse || 'N/A'}
                                                            </Grid>
                                                        </Grid>

                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} md={7} style={{
                                                                fontFamily: 'Poppins',
                                                                fontSize: '17px',
                                                            }}>
                                                                Observation:
                                                            </Grid>
                                                            <Grid item xs={12}
                                                                md={5}
                                                                style={{
                                                                    fontWeight: 'bold',
                                                                    marginTop: '-5px'
                                                                }}>
                                                                {fetchedData?.vital_info[0]?.pulse || 'N/A'}
                                                            </Grid>
                                                        </Grid>

                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} md={7} style={{
                                                                fontFamily: 'Poppins',
                                                                fontSize: '17px',
                                                            }}>
                                                                Remark:
                                                            </Grid>
                                                            <Grid item xs={12}
                                                                md={5}
                                                                style={{
                                                                    fontWeight: 'bold',
                                                                    marginTop: '-5px'
                                                                }}>
                                                                {fetchedData?.vital_info[0]?.pulse || 'N/A'}
                                                            </Grid>
                                                        </Grid>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        )}

                                        {/* VISION */}
                                        {fetchedData?.vision_info?.length > 0 && (
                                            <Grid item xs={12} md={6} style={{ paddingRight: '1em', marginBottom: '1.6em', marginTop: '2.5em' }}>
                                                <Card
                                                    sx={{
                                                        boxShadow: 3,
                                                        borderRadius: '1.2em',
                                                        backgroundColor: '#F4F5FA',
                                                        height: 'auto',
                                                    }}
                                                >
                                                    <CardContent style={{ marginBottom: '1.3em' }}>
                                                        <Typography variant="h5" align="left" color="#313774"
                                                            style={{
                                                                fontFamily: 'Poppins',
                                                                fontSize: '18px',
                                                                marginBottom: '28px'
                                                            }}
                                                        >
                                                            VISION
                                                        </Typography>

                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} md={12}>
                                                                <Typography variant="h6" align="left" color="black"
                                                                    style={{
                                                                        fontFamily: 'Poppins',
                                                                        fontSize: '17px',
                                                                        fontWeight: 'bold'
                                                                    }}
                                                                >
                                                                    Vision Without Glasses

                                                                </Typography>
                                                            </Grid>

                                                            <Grid item xs={12} md={4}
                                                                style={{
                                                                    fontFamily: 'Poppins',
                                                                    fontSize: '17px',
                                                                }}
                                                            >
                                                                Near:
                                                            </Grid>

                                                            <Grid item xs={12} md={4}
                                                                style={{
                                                                    marginTop: '-5px'
                                                                }}>
                                                                Right:{fetchedData?.vision_info[0]?.le_near_without_glasses || 'N/A'}
                                                            </Grid>

                                                            <Grid item xs={12} md={4}
                                                                style={{
                                                                    marginTop: '-5px'
                                                                }}>
                                                                Left:{fetchedData?.vision_info[0]?.re_near_without_glasses || 'N/A'}
                                                            </Grid>

                                                            <Grid item xs={12} md={4}
                                                                style={{
                                                                    fontFamily: 'Poppins',
                                                                    fontSize: '17px',
                                                                }}
                                                            >
                                                                FAR:
                                                            </Grid>

                                                            <Grid item xs={12} md={4}
                                                                style={{
                                                                    marginTop: '-5px'
                                                                }}>
                                                                Right:{fetchedData?.vision_info[0]?.le_far_without_glasses || 'N/A'}
                                                            </Grid>

                                                            <Grid item xs={12} md={4}
                                                                style={{
                                                                    marginTop: '-5px'
                                                                }}>
                                                                Left:{fetchedData?.vision_info[0]?.re_far_without_glasses || 'N/A'}
                                                            </Grid>
                                                        </Grid>

                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} md={12}>
                                                                <Typography variant="h6" align="left" color="black"
                                                                    style={{
                                                                        fontFamily: 'Poppins',
                                                                        fontSize: '17px',
                                                                        marginTop: '15px',
                                                                        fontWeight: 'bold'
                                                                    }}
                                                                >
                                                                    Vision With Glasses

                                                                </Typography>
                                                            </Grid>

                                                            <Grid item xs={12} md={4}
                                                                style={{
                                                                    fontFamily: 'Poppins',
                                                                    fontSize: '17px',
                                                                }}
                                                            >
                                                                Near:
                                                            </Grid>

                                                            <Grid item xs={12} md={4}
                                                                style={{
                                                                    marginTop: '-5px'
                                                                }}>
                                                                Right:{fetchedData?.vision_info[0]?.le_near_without_glasses || 'N/A'}
                                                            </Grid>

                                                            <Grid item xs={12} md={4}
                                                                style={{
                                                                    marginTop: '-5px'
                                                                }}>
                                                                Left:{fetchedData?.vision_info[0]?.re_near_without_glasses || 'N/A'}
                                                            </Grid>

                                                            <Grid item xs={12} md={4}
                                                                style={{
                                                                    fontFamily: 'Poppins',
                                                                    fontSize: '17px',
                                                                }}
                                                            >
                                                                FAR:
                                                            </Grid>

                                                            <Grid item xs={12} md={4}
                                                                style={{
                                                                    marginTop: '-5px'
                                                                }}>
                                                                Right:{fetchedData?.vision_info[0]?.le_far_without_glasses || 'N/A'}
                                                            </Grid>

                                                            <Grid item xs={12} md={4}
                                                                style={{
                                                                    marginTop: '-5px'
                                                                }}>
                                                                Left:{fetchedData?.vision_info[0]?.re_far_without_glasses || 'N/A'}
                                                            </Grid>
                                                        </Grid>

                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        )}

                                        {/* Immunisattion */}
                                        {fetchedData?.immunization_info?.length > 0 && (
                                            <Grid item xs={12} md={6} style={{ paddingRight: '1em', marginBottom: '1.6em', marginTop: '0.5em' }}>
                                                <Card
                                                    sx={{
                                                        boxShadow: 3,
                                                        borderRadius: '1.2em',
                                                        backgroundColor: '#F4F5FA',
                                                        height: 'auto',
                                                    }}
                                                >
                                                    <CardContent style={{ marginBottom: '1.3em' }}>
                                                        <Typography variant="h5" align="left" color="#313774"
                                                            style={{
                                                                fontFamily: 'Poppins',
                                                                fontSize: '18px',
                                                                marginBottom: '28px'
                                                            }}
                                                        >
                                                            Immunisattion
                                                        </Typography>

                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} md={7}
                                                                style={{
                                                                    fontFamily: 'Poppins',
                                                                    fontSize: '17px',
                                                                }}
                                                            >
                                                                Height:
                                                            </Grid>
                                                            <Grid item xs={12}
                                                                md={5}
                                                                style={{
                                                                    fontWeight: 'bold',
                                                                    marginTop: '-5px'
                                                                }}>
                                                                {fetchedData?.vital_info[0]?.pulse || 'N/A'}
                                                            </Grid>
                                                        </Grid>

                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} md={7} style={{
                                                                fontFamily: 'Poppins',
                                                                fontSize: '17px',
                                                            }}>
                                                                Weight:
                                                            </Grid>
                                                            <Grid item xs={12}
                                                                md={5}
                                                                style={{
                                                                    fontWeight: 'bold',
                                                                    marginTop: '-5px'
                                                                }}>
                                                                {fetchedData?.vital_info[0]?.pulse || 'N/A'}
                                                            </Grid>
                                                        </Grid>

                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} md={7} style={{
                                                                fontFamily: 'Poppins',
                                                                fontSize: '17px',
                                                            }}>
                                                                Weight for Age:
                                                            </Grid>
                                                            <Grid item xs={12}
                                                                md={5}
                                                                style={{
                                                                    fontWeight: 'bold',
                                                                    marginTop: '-5px'
                                                                }}>
                                                                {fetchedData?.vital_info[0]?.pulse || 'N/A'}
                                                            </Grid>
                                                        </Grid>

                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} md={7} style={{
                                                                fontFamily: 'Poppins',
                                                                fontSize: '17px',
                                                            }}>
                                                                Height for Age:
                                                            </Grid>
                                                            <Grid item xs={12}
                                                                md={5}
                                                                style={{
                                                                    fontWeight: 'bold',
                                                                    marginTop: '-5px'
                                                                }}>
                                                                {fetchedData?.vital_info[0]?.pulse || 'N/A'}
                                                            </Grid>
                                                        </Grid>

                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} md={7} style={{
                                                                fontFamily: 'Poppins',
                                                                fontSize: '17px',
                                                            }}>
                                                                Weight for Height:
                                                            </Grid>
                                                            <Grid item xs={12}
                                                                md={5}
                                                                style={{
                                                                    fontWeight: 'bold',
                                                                    marginTop: '-5px'
                                                                }}>
                                                                {fetchedData?.vital_info[0]?.pulse || 'N/A'}
                                                            </Grid>
                                                        </Grid>

                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} md={7} style={{
                                                                fontFamily: 'Poppins',
                                                                fontSize: '17px',
                                                            }}>
                                                                BMI:
                                                            </Grid>
                                                            <Grid item xs={12}
                                                                md={5}
                                                                style={{
                                                                    fontWeight: 'bold',
                                                                    marginTop: '-5px'
                                                                }}>
                                                                {fetchedData?.vital_info[0]?.pulse || 'N/A'}
                                                            </Grid>
                                                        </Grid>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        )}

                                        {/* Psychological */}
                                        {fetchedData?.immunization_info?.length > 0 && (
                                            <Grid item xs={12} md={6} style={{ paddingRight: '1em', marginBottom: '1.6em', marginTop: '0.5em' }}>
                                                <Card
                                                    sx={{
                                                        boxShadow: 3,
                                                        borderRadius: '1.2em',
                                                        backgroundColor: '#F4F5FA',
                                                        height: 'auto',
                                                    }}
                                                >
                                                    <CardContent style={{ marginBottom: '1.3em' }}>
                                                        <Typography variant="h5" align="left" color="#313774"
                                                            style={{
                                                                fontFamily: 'Poppins',
                                                                fontSize: '18px',
                                                                marginBottom: '28px'
                                                            }}
                                                        >
                                                            Psychological
                                                        </Typography>

                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} md={7}
                                                                style={{
                                                                    fontFamily: 'Poppins',
                                                                    fontSize: '17px',
                                                                }}
                                                            >
                                                                Height:
                                                            </Grid>
                                                            <Grid item xs={12}
                                                                md={5}
                                                                style={{
                                                                    fontWeight: 'bold',
                                                                    marginTop: '-5px'
                                                                }}>
                                                                {fetchedData?.vital_info[0]?.pulse || 'N/A'}
                                                            </Grid>
                                                        </Grid>

                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} md={7} style={{
                                                                fontFamily: 'Poppins',
                                                                fontSize: '17px',
                                                            }}>
                                                                Weight:
                                                            </Grid>
                                                            <Grid item xs={12}
                                                                md={5}
                                                                style={{
                                                                    fontWeight: 'bold',
                                                                    marginTop: '-5px'
                                                                }}>
                                                                {fetchedData?.vital_info[0]?.pulse || 'N/A'}
                                                            </Grid>
                                                        </Grid>

                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} md={7} style={{
                                                                fontFamily: 'Poppins',
                                                                fontSize: '17px',
                                                            }}>
                                                                Weight for Age:
                                                            </Grid>
                                                            <Grid item xs={12}
                                                                md={5}
                                                                style={{
                                                                    fontWeight: 'bold',
                                                                    marginTop: '-5px'
                                                                }}>
                                                                {fetchedData?.vital_info[0]?.pulse || 'N/A'}
                                                            </Grid>
                                                        </Grid>

                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} md={7} style={{
                                                                fontFamily: 'Poppins',
                                                                fontSize: '17px',
                                                            }}>
                                                                Height for Age:
                                                            </Grid>
                                                            <Grid item xs={12}
                                                                md={5}
                                                                style={{
                                                                    fontWeight: 'bold',
                                                                    marginTop: '-5px'
                                                                }}>
                                                                {fetchedData?.vital_info[0]?.pulse || 'N/A'}
                                                            </Grid>
                                                        </Grid>

                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} md={7} style={{
                                                                fontFamily: 'Poppins',
                                                                fontSize: '17px',
                                                            }}>
                                                                Weight for Height:
                                                            </Grid>
                                                            <Grid item xs={12}
                                                                md={5}
                                                                style={{
                                                                    fontWeight: 'bold',
                                                                    marginTop: '-5px'
                                                                }}>
                                                                {fetchedData?.vital_info[0]?.pulse || 'N/A'}
                                                            </Grid>
                                                        </Grid>

                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} md={7} style={{
                                                                fontFamily: 'Poppins',
                                                                fontSize: '17px',
                                                            }}>
                                                                BMI:
                                                            </Grid>
                                                            <Grid item xs={12}
                                                                md={5}
                                                                style={{
                                                                    fontWeight: 'bold',
                                                                    marginTop: '-5px'
                                                                }}>
                                                                {fetchedData?.vital_info[0]?.pulse || 'N/A'}
                                                            </Grid>
                                                        </Grid>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        )}

                                        {/* GENERAL REMARK */}
                                        {fetchedData?.basic_info?.length > 0 && fetchedData?.vital_info[0]?.observation && (
                                            <Grid item xs={12} md={6} style={{ paddingRight: '1em', marginBottom: '1.6em' }}>
                                                <Card
                                                    sx={{
                                                        boxShadow: 3,
                                                        borderRadius: '1.2em',
                                                        backgroundColor: '#F4F5FA',
                                                        height: 'auto',
                                                    }}
                                                >
                                                    <CardContent style={{ marginBottom: '1.3em' }}>
                                                        <Typography variant="h5" align="left" color="#313774"
                                                            style={{
                                                                fontFamily: 'Poppins',
                                                                fontSize: '18px',
                                                                marginBottom: '28px'
                                                            }}
                                                        >
                                                            General Remark
                                                        </Typography>

                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} md={12}
                                                                style={{
                                                                    fontWeight: 'bold',
                                                                    marginTop: '-5px'
                                                                }}>
                                                                {fetchedData?.vital_info[0]?.observation}
                                                            </Grid>
                                                        </Grid>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        )}

                                        {fetchedData ? (
                                            <Grid item xs={12} md={6} style={{ paddingRight: '2em', marginBottom: '1em', marginTop: '0.3em' }}>
                                                <Card
                                                    sx={{
                                                        boxShadow: 3,
                                                        borderRadius: '1.2em',
                                                        backgroundColor: '#F4F5FA',
                                                        height: 'auto',
                                                    }}
                                                >
                                                    <CardContent style={{ marginBottom: '1.3em' }}>
                                                        <Typography variant="h5" align="left" color="#313774"
                                                            style={{
                                                                fontFamily: 'Poppins',
                                                                fontSize: '18px',
                                                                marginBottom: '18px',
                                                            }}
                                                        >
                                                            PFT
                                                        </Typography>

                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} md={7}
                                                                style={{
                                                                    fontFamily: 'Poppins',
                                                                    fontSize: '17px',
                                                                }}
                                                            >
                                                                Reading:
                                                            </Grid>
                                                            <Grid item xs={12}
                                                                md={5}
                                                                style={{
                                                                    fontWeight: 'bold',
                                                                    marginTop: '-5px'
                                                                }}>
                                                                {fetchedData?.pft_info[0]?.pft_reading || 'N/A'}
                                                            </Grid>
                                                        </Grid>

                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} md={7} style={{
                                                                fontFamily: 'Poppins',
                                                                fontSize: '17px',
                                                            }}>
                                                                Observation:
                                                            </Grid>
                                                            <Grid item xs={12}
                                                                md={5}
                                                                style={{
                                                                    fontWeight: 'bold',
                                                                    marginTop: '-5px'
                                                                }}>
                                                                {fetchedData?.pft_info[0]?.observations || 'N/A'}
                                                            </Grid>
                                                        </Grid>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        ) : (
                                            <p>No data fetched yet.</p>
                                        )}
                                        {/* <footer style={{
                                            backgroundColor: '#313774',
                                            textAlign: 'center',
                                            borderTop: '1px solid #ddd',
                                            position: 'relative',
                                            bottom: 0,
                                            width: '100%',
                                            height: '2em',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            color: '#fff',
                                            boxSizing: 'border-box',
                                            marginTop: '32em'
                                        }}>
                                            <div style={{ flex: 1, textAlign: 'left', paddingLeft: '1em', display: 'flex', alignItems: 'center' }}>
                                                <EmailIcon style={{ marginRight: '0.5em' }} />
                                                <p>sperohealthcare</p>
                                            </div>
                                            <div style={{ flex: 1, textAlign: 'right', paddingRight: '1em', display: 'flex', alignItems: 'center' }}>
                                                <LanguageIcon style={{ marginRight: '0.5em' }} />
                                                <p>sperohealthcare.in</p>
                                            </div>
                                        </footer> */}
                                        {/* Fitness*/}
                                        {/* <Grid item xs={12} md={12} style={{ paddingRight: '1em', marginBottom: '1.6em', marginTop: '12em' }}>
                                            <Card
                                                sx={{
                                                    boxShadow: 3,
                                                    borderRadius: '1.2em',
                                                    backgroundColor: '#F4F5FA',
                                                    height: '100%'
                                                }}
                                            >
                                                <CardContent style={{ marginBottom: '1.3em' }}>
                                                    <Typography variant="h5" align="left" color="#313774"
                                                        style={{
                                                            fontFamily: 'Poppins',
                                                            fontSize: '18px',
                                                            marginBottom: '28px'
                                                        }}
                                                    >
                                                        Fitness Certificate
                                                    </Typography>

                                                    <Grid container spacing={2}>
                                                        <Grid item xs={12} md={7}
                                                            style={{
                                                                fontFamily: 'Poppins',
                                                                fontSize: '17px',
                                                            }}
                                                        >
                                                            Height:
                                                        </Grid>
                                                        <Grid item xs={12}
                                                            md={5}
                                                            style={{
                                                                fontWeight: 'bold',
                                                                marginTop: '-5px'
                                                            }}>
                                                            {fetchedData?.vital_info[0]?.pulse || 'N/A'}
                                                        </Grid>
                                                    </Grid>
                                                </CardContent>
                                            </Card>
                                        </Grid> */}
                                    </Grid>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HealthList
