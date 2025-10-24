import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dependency = () => {

    const Port = process.env.REACT_APP_API_KEY;
    const [sourceNav, setSourceNav] = useState([]);

    useEffect(() => {
        const fetchSourceDropdown = async () => {
            try {
                const response = await axios.get(`${Port}}/Screening/source_GET/`);
                setSourceNav(response.data);
                console.log(response.data);
            } catch (error) {
                console.log('Error while fetching data', error);
            }
        };
        fetchSourceDropdown();
    }, []);

    return sourceNav;
};

export default Dependency;
