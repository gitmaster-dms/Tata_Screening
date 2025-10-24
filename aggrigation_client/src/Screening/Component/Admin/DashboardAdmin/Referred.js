import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';

const Referred = ({ selectedSource, selctedType, selectedClassType, selectedScreenID }) => {
    const [referredData, setReferredData] = useState({});

    const Port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');
    const SourceNameUrlId = localStorage.getItem('SourceNameFetched');

    const fetchData = async () => {
        try {
            let url = `${Port}/Screening/reffered_to_specialist_count/?`;

            if (selectedSource) {
                url += `source_id=${selectedSource}&`;
            }

            if (selctedType) {
                url += `type_id=${selctedType}&`;
            }

            if (selectedClassType) {
                url += `Class_id=${selectedClassType}&`;
            }

            if (SourceNameUrlId) {
                url += `source_name_id=${SourceNameUrlId}`;
            }

            if (selectedScreenID) {
                url += `schedule_id=${selectedScreenID}`;
            }


            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setReferredData(data); // Update referredData state with fetched data
            } else {
                throw new Error('Failed to fetch data');
            }
        } catch (error) {
            console.error('Error Fetching Data:', error);
        }
    };

    useEffect(() => {
        if (selectedSource || selctedType || selectedClassType || selectedScreenID) {
            fetchData();
        }
    }, [selectedSource, selctedType, selectedClassType || selectedScreenID]);

    const chartData = {
        series: [
            referredData.vital_info_count || 0,
            referredData.audit_info_count || 0,
            referredData.dental_info_count || 0,
            referredData.vision_info_count || 0,
            referredData.screening_info_count || 0,
        ],
        options: {
            chart: {
                height: 400, // Adjust the height here
                type: 'radialBar',
            },
            plotOptions: {
                radialBar: {
                    hollow: {
                        size: '40%', // Adjust hollow size to increase circle width
                    },
                    track: {
                        show: true,
                        background: '#f2f2f2',
                        strokeWidth: '97%',
                        margin: 5, // margin is in pixels
                    },
                    dataLabels: {
                        name: {
                            fontSize: '16px', // Reduced font size
                        },
                        value: {
                            formatter: (val) => {
                                const index = chartData.series.indexOf(val);
                                return chartData.series[index];
                            },
                            fontSize: '14px', // Reduced font size
                        },
                    }
                }
            },
            labels: ['Vital Info', 'Audit Info', 'Dental Info', 'Vision Info', 'Screening Info'],
            legend: {
                show: false,
                position: 'bottom',
                horizontalAlign: 'center',
                fontSize: '12px', // Adjust font size of legend
            },
            tooltip: {
                enabled: true,
                style: {
                    fontSize: '12px', // Adjust font size of tooltip
                }
            }
        },
    };

    return (
        <div>
            <h5 className="birthdashboard">Total Referred</h5>
            <Grid item xs={10}>
                <Stack direction="row" justifyContent="center" spacing={2}>
                    <Box sx={{ height: '34vh', width: '100%' }}>
                        {Object.keys(referredData).length > 0 && (
                            <Chart
                                options={chartData.options}
                                series={chartData.series}
                                type="radialBar"
                                height="220"
                                width="220"
                            />
                        )}
                    </Box>
                </Stack>
            </Grid>
        </div>
    );
};

export default Referred;
