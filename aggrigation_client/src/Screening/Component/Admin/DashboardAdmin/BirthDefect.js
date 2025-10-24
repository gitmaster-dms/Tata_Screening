import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import './Dashboard.css';

const BirthDefect = ({ selectedSource, selctedType, selectedClassType, selectedScreenID }) => {

    const Port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');
    const SourceNameUrlId = localStorage.getItem('SourceNameFetched');

    const [chartData, setChartData] = useState({
        options: {
            dataLabels: {
                enabled: false,
            },
            legend: {
                show: false,
            },
            labels: ['Birth Defect'],
            colors: ['#E8007D'],
        },
        series: [0, 0],
    });

    const [isFilterApplied, setIsFilterApplied] = useState(false);

    useEffect(() => {
        if (selectedSource || selctedType || selectedClassType || selectedScreenID) {
            const fetchData = async () => {
                try {
                    let apiUrl = `${Port}/Screening/Birth_defect_count/?`;

                    if (selectedSource) {
                        apiUrl += `source_id=${selectedSource}&`;
                    }

                    if (selctedType) {
                        apiUrl += `type_id=${selctedType}&`;
                    }

                    if (selectedClassType) {
                        apiUrl += `Class_id=${selectedClassType}&`;
                    }

                    if (SourceNameUrlId) {
                        apiUrl += `source_name_id=${SourceNameUrlId}&`;
                    }

                    if (selectedScreenID) {
                        apiUrl += `schedule_id=${selectedScreenID}`;
                    }

                    // Remove the last '&' if it exists
                    if (apiUrl.endsWith('&')) {
                        apiUrl = apiUrl.slice(0, -1);
                    }

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

                    const series = [data.birth_defects_count];
                    setChartData((prevChartData) => ({
                        ...prevChartData,
                        series,
                    }));

                    setIsFilterApplied(true);  // Set filter applied to true after successful fetch
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            };

            fetchData();
        }
    }, [selectedSource, selctedType, selectedClassType, selectedScreenID, Port, SourceNameUrlId, accessToken]);

    return (
        <div className="donut-container bbiorthhhhhhhhhhhhh">
            <h5 className="birthdashboard">Birth Defect</h5>
            <Chart options={chartData.options} series={chartData.series} type="donut" width="200" height="150" />
        </div>
    );
}

export default BirthDefect;
