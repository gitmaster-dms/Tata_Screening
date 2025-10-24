import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';

const Age = ({ selectedSource, selctedType, selectedClassType, selectedScreenID }) => {
    
    const [data, setData] = useState([]);
    const Port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');
    const source = localStorage.getItem('loginSource');
    const SourceNameUrlId = localStorage.getItem('SourceNameFetched');

    useEffect(() => {
        if (selectedSource || selctedType || selectedClassType || selectedScreenID) {
            const fetchData = async () => {
                try {
                    let apiUrl = `${Port}/Screening/age_count/?`;

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
                        apiUrl += `schedule_id=${selectedScreenID}`;
                    }

                    if (apiUrl.endsWith('&')) {
                        apiUrl = apiUrl.slice(0, -1);
                    }

                    const response = await fetch(apiUrl, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }

                    const apiData = await response.json();
                    setData(apiData);
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            };

            fetchData();
        }
    }, [selectedSource, selctedType, selectedClassType, selectedScreenID, Port, SourceNameUrlId, accessToken]);

    const xAxisCategories = source === '1'
        ? ['5-7', '7-9', '9-11', '11-13', '13-15', '15-17']
        : ['18-30', '31-50', '51-59', '60+'];

    const options = {
        chart: {
            type: 'bar',
            horizontal: true,
            toolbar: {
                show: false,
            },
        },
        plotOptions: {
            bar: {
                horizontal: false,
                dataLabels: {
                    position: 'top',
                    enabled: false,
                },
            },
        },
        dataLabels: {
            enabled: false,
        },
        xaxis: {
            categories: xAxisCategories,
        },
        grid: {
            show: false,
        },
        tooltip: {
            enabled: false,
        },
    };

    const getColorByIndex = (index) => {
        const colors = ['#0FB666', '#7209B7', '#E418B8', '#480CA8', '#EEC227', '#F89604'];
        return colors[index % colors.length];
    };

    const series = [
        {
            data: Object.keys(data).map((key, index) => ({
                x: key,
                y: data[key],
                fillColor: getColorByIndex(index),
            })),
        },
    ];

    return (
        <div className="donut-container">
            <h5 className="birthdashboard">Age</h5>
            <Chart options={options} series={series} type="bar" height="200" />
        </div>
    );
};

export default Age;
