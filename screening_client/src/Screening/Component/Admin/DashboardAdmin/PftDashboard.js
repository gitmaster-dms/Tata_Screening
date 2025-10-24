import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';

const PftDashboard = ({ selectedSource, selctedType, selectedClassType }) => {
    const [data, setData] = useState({});
    const Port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');
    const source = localStorage.getItem('loginSource');

    //// access the source name from local storage
    const SourceNameUrlId = localStorage.getItem('SourceNameFetched');

    useEffect(() => {
        const fetchData = async () => {
            try {
                let endpoint = `${Port}/Screening/NEW_pft_count/?source_id=${selectedSource}&type_id=${selctedType}&source_name_id=${SourceNameUrlId}`;
                if (selectedSource && selctedType && selectedClassType) {
                    endpoint = `${Port}/Screening/NEW_pft_count/?source_id=${selectedSource}&type_id=${selctedType}&Class_id=${selectedClassType}&source_name_id=${SourceNameUrlId}`;
                }
                else if (selectedSource) {
                    endpoint = `${Port}/Screening/NEW_pft_count/?source_id=${selectedSource}&source_name_id=${SourceNameUrlId}`;
                }
                else if (selectedSource) {
                    endpoint = `${Port}/Screening/NEW_pft_count/?source_id=${selectedSource}`;
                }
                
                const res = await fetch(endpoint, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                const apiData = await res.json();
                setData(apiData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, [selectedSource, selctedType, selectedClassType]);

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
            categories: ['Caution', 'Stable', 'Danger'],
        },
        yaxis: {
            min: 0,
            max: 200,
            tickAmount: 4,
        },
        grid: {
            show: false,
        },
        markers: {
            size: 0,
            hover: {
                size: undefined,
                sizeOffset: 0
            }
        },
    };

    const getColorByIndex = (index, category) => {
        if (category === 'Caution') {
            return '#E5E500'; // Yellow
        } else if (category === 'Stable') {
            return '#0FB666'; // Green
        } else if (category === 'Danger') {
            return '#E418B8'; // Red
        } else {
            return '#478F96'; // Default color
        }
    };

    const series = [
        {
            data: [
                { x: 'Caution', y: data.Caution || 0, fillColor: getColorByIndex(1, 'Caution') },
                { x: 'Stable', y: data.Stable || 0, fillColor: getColorByIndex(2, 'Stable') },
                { x: 'Danger', y: data.Danger || 0, fillColor: getColorByIndex(0, 'Danger') },
            ],
        },
    ];

    return (
        <div className="donut-container">
            <h5 className="birthdashboard">Pulmonary Function Tests</h5>
            <Chart options={options} series={series} type="bar" height="350" />
        </div>
    );
};

export default PftDashboard;
