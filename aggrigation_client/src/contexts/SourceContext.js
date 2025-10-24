import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const SourceContext = createContext();

export const useSourceContext = () => useContext(SourceContext);

export const SourceProvider = ({ children }) => {

    const [scheduleIdd, setScheduleIdd] = useState('');
    const [pkIddd, setPkIddd] = useState(null);
    const [citizenIddd, setCitizenIddd] = useState('');
    localStorage.setItem('scheduleIdd', scheduleIdd);
    localStorage.setItem('pkIddd', pkIddd);
    localStorage.setItem('citizenIddd', citizenIddd);
    
    /// State District Tehsil
    const State = localStorage.getItem('StateLogin');
    const District = localStorage.getItem('DistrictLogin');
    const Tehsil = localStorage.getItem('TehsilLogin');

    const Port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');
    //// access the source from local storage
    const SourceUrlId = localStorage.getItem('loginSource');

    //// access the source name from local storage
    const SourceNameUrlId = localStorage.getItem('SourceNameFetched');

    const [selectedAge, setSelectedAge] = useState('')
    const [selectedSource, setSelectedSource] = useState(SourceUrlId || '');
    const [selectedScheduleType, setSelectedScheduleType] = useState('')
    const [selectedDisease, setSelectedDisease] = useState('')

    const [sourceState, setSourceState] = useState([]);
    const [selectedState, setSelectedState] = useState(State || '');
    const [district, setDistrict] = useState([]);
    const [selectedDistrict, setSelectedDistrict] = useState(District || '');
    const [tehsil, setTehsil] = useState([]);
    const [selectedTehsil, setSelectedTehsil] = useState(Tehsil || '');
    const [SourceName, setSourceName] = useState([]);
    const [selectedName, setSelectedName] = useState('');

    //////////// bmi
    const [height, setHeight] = useState('');
    const [gender, setGender] = useState('');
    const [weight, setWeight] = useState('');
    const [age, setAge] = useState({ year: 0, months: 0, days: 0 });
    const [bmi, setBmi] = useState(null);

    console.log(bmi, 'bmiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii');

    ///////////// bmi
    useEffect(() => {
        const fetchStateOptions = async () => {
            if (height && weight && gender && age.year !== '' && age.months !== '') {
                try {
                    const response = await axios.get(`${Port}/Screening/SAM_MAM_BMI/${age.year}/${age.months}/${gender}/${height}/${weight}/`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    const options = response.data;
                    console.log('BMI Response:', options);
                    setBmi(options.bmi);
                } catch (error) {
                    console.error('Error Fetching Response:', error);
                }
            }
        };
        console.log('Height:', height, 'Weight:', weight, 'Gender:', gender, 'Age:', age.year, 'Months:', age.months);
        fetchStateOptions();
    }, [height, weight, gender, age.year, age.months]);

    useEffect(() => {
        const fetchStateOptions = async () => {
            if (selectedSource) {
                try {
                    const response = await axios.get(`${Port}/Screening/source_and_pass_state_Get/${selectedSource}`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    const options = response.data;
                    console.log('State Options:', options);
                    setSourceState(options);
                } catch (error) {
                    console.error('Error Fetching State:', error);
                }
            }
        };
        fetchStateOptions();
    }, [selectedSource]);

    useEffect(() => {
        const fetchDistrict = async () => {
            if (selectedSource && selectedState) {
                try {
                    const response = await axios.get(`${Port}/Screening/state_and_pass_district_Get/${selectedSource}/${selectedState}/`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    const options = response.data;
                    console.log('District Options:', options);
                    setDistrict(options);
                } catch (error) {
                    console.error('Error Fetching District:', error);
                }
            }
        };
        fetchDistrict();
    }, [selectedSource, selectedState]);

    ///////////// Tehsil
    useEffect(() => {
        const fetchTehsil = async () => {
            if (selectedState) {
                try {
                    const response = await axios.get(`${Port}/Screening/district_and_pass_taluka_Get/${selectedSource}/${selectedDistrict}/`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json'
                        }
                    });

                    console.log(response);
                    const options = response.data;
                    console.log('Tehsil Corporate', options);
                    setTehsil(options);
                } catch (error) {
                    console.log('Error While Fetching District', error);
                }
            }
        };
        fetchTehsil();
    }, [selectedDistrict]);

    ///////////// Source Name
    useEffect(() => {
        const fetchName = async () => {
            if (selectedState) {
                try {
                    const response = await axios.get(`${Port}/Screening/taluka_and_pass_SourceName_Get/?SNid=${selectedTehsil}&So=${selectedSource}&source_pk_id=${SourceNameUrlId}`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    const options = response.data;
                    console.log('Source Name', options);
                    setSourceName(options);
                } catch (error) {
                    console.log('Error While Fetching Name', error);
                }
            }
        };
        fetchName();
    }, [selectedTehsil]);

    ///////////////////////////////////// BMI API

    return (
        <SourceContext.Provider
            value={{
                selectedSource, setSelectedSource, sourceState,
                selectedState, setSelectedState, district,
                selectedDistrict, setSelectedDistrict, tehsil,
                selectedTehsil, setSelectedTehsil, SourceName,
                selectedName, setSelectedName,
                height, setHeight, weight, setWeight,
                age, setAge,
                bmi, setBmi,
                selectedAge, setSelectedAge,
                gender, setGender,
                selectedScheduleType, setSelectedScheduleType,
                selectedDisease, setSelectedDisease,
                scheduleIdd, setScheduleIdd, pkIddd, setPkIddd, citizenIddd, setCitizenIddd 
            }}>
            {children}
        </SourceContext.Provider>
    );
};
