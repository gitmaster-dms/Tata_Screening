import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import './Dashboard.css';

const Vision = ({ selectedSource, selctedType, selectedClassType, selectedScreenID }) => {
    const Port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');

    // Access the source and source name from local storage
    const SourceUrlId = localStorage.getItem('loginSource');
    const SourceNameUrlId = localStorage.getItem('SourceNameFetched');

    // Set the labels based on the SourceUrlId
    let labels;
    if (SourceUrlId === '1') {
        labels = ['Colour blindness No', 'Vision with Glasses', 'Vision without Glasses'];
    } else {
        labels = ['Colour blindness Yes', 'Colour blindness No'];
    }

    const [chartData, setChartData] = useState({
        options: {
            chart: {
                type: 'donut',
                height: 300,
            },
            labels: labels, // Use the labels array here
            dataLabels: {
                enabled: false,
            },
            legend: {
                show: false,
                position: 'right',
                horizontalAlign: 'center',
                offsetY: 8,
            },
            colors: ['#C9E714', '#E8007D', '#0B2FAD'],
        },
        series: [0, 0, 0],
    });

    const fetchData = async () => {
        try {
            let apiUrl = `${Port}/Screening/NEW_vision_count/?`;

            if (selectedSource) {
                apiUrl += `source_id=${selectedSource}&`;
            }

            if (selctedType) {
                apiUrl += `type_id=${selctedType}&`;
            }

            if (selectedClassType) {
                apiUrl += `class_id=${selectedClassType}&`;
            }

            if (SourceNameUrlId) {
                apiUrl += `source_name_id=${SourceNameUrlId}&`;
            }

            if (selectedScreenID) {
                apiUrl += `schedule_id=${selectedScreenID}&`;
            }

            // Remove the last '&' if it exists
            if (apiUrl.endsWith('&')) {
                apiUrl = apiUrl.slice(0, -1);
            }

            console.log('API URL:', apiUrl);

            const response = await fetch(apiUrl, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log('API Data:', data);

            let series;
            if (SourceUrlId === '1') {
                series = [data.color_blindness_no, data.vision_with_glasses, data.vision_without_glasses];
            } else {
                series = [data.color_blindness_yes, data.color_blindness_no];
            }

            setChartData((prevChartData) => ({
                ...prevChartData,
                series,
            }));
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        if (selectedSource || selctedType || selectedClassType || selectedScreenID) {
            fetchData();
        }
    }, [selectedSource, selctedType, selectedClassType, selectedScreenID]);

    return (
        <div className="donut-container">
            <h5 className="birthdashboard">Vision</h5>
            <Chart options={chartData.options} series={chartData.series} type="donut" width="220" height='140' />
        </div>
    );
};

export default Vision;
