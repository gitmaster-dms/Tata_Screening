import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import './Dashboard.css';

const Dental = ({ selectedSource, selctedType, selectedClassType, selectedScreenID }) => {
    const Port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');

    //// access the source name from local storage
    const SourceNameUrlId = localStorage.getItem('SourceNameFetched');

    const [chartData, setChartData] = useState({
        options: {
            dataLabels: {
                enabled: false,
            },
            legend: {
                show: true,
                position: 'bottom',
                horizontalAlign: 'center',
                offsetY: 1,
            },
            colors: ['#00B4D8', '#560BAD', '#FD8E50'],
            labels: ['Good', 'Fair', 'Poor'],
        },
        series: [0, 0, 0], // Initial values
    });

    const fetchData = async () => {
        try {
            let apiUrl = `${Port}/Screening/NEW_dental_count/?`;
            if (selectedSource) apiUrl += `source_id=${selectedSource}&`;
            if (selctedType) apiUrl += `type_id=${selctedType}&`;
            if (selectedClassType) apiUrl += `class_id=${selectedClassType}&`;
            if (SourceNameUrlId) apiUrl += `source_name_id=${SourceNameUrlId}&`;
            if (selectedScreenID) apiUrl += `schedule_id=${selectedScreenID}`;

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

            const seriesData = [data.good_count, data.fair_count, data.poor_count];

            setChartData((prevChartData) => ({
                ...prevChartData,
                series: seriesData,
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
        <div className="donut donutttttt">
            <h5 className="birthdashboard dentalheadingggg">Dental Condition</h5>
            <Chart options={chartData.options} series={chartData.series} type="pie" width="220" height="162" />
        </div>
    );
};

export default Dental;
