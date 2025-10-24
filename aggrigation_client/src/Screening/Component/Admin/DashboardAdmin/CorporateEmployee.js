import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import './Dashboard.css';

const CorporateEmployee = ({ selectedSource, selctedType, selectedClassType }) => {
    const Port = process.env.REACT_APP_API_KEY;
    const source = localStorage.getItem('loginSource');
    const SourceNameUrlId = localStorage.getItem('SourceNameFetched');

    const [chartData, setChartData] = useState({ options: {}, series: [] });
    const [totalStudentAdded, setTotalStudentAdded] = useState(null);
    const [totalScreened, setTotalScreened] = useState(null);
    const [totalScheduleAdded, setTotalScheduleAdded] = useState(null);
    const accessToken = localStorage.getItem('token');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const endpoint = selectedClassType
                ? `${Port}/Screening/NEW_citizens_count/?source_id=${selectedSource}&type_id=${selctedType}&Class_id=${selectedClassType}&source_name_id=${SourceNameUrlId}`
                : `${Port}/Screening/NEW_citizens_count/?source_id=${selectedSource}&type_id=${selctedType}&source_name_id=${SourceNameUrlId}`;

                const response = await fetch(endpoint, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                const data = await response.json();
                console.log('API Data:', data);

                // Extracting data from the API response
                const series = [
                    { name: 'Total Employee Added', data: [data.total_added_count] },
                    { name: 'Total Screened', data: [data.total_screened_count] }
                ];

                // Setting options for the chart
                const options = {
                    chart: { type: 'bar', height: 350, width: '100%', toolbar: { show: false } },
                    plotOptions: { bar: { horizontal: false } },
                    dataLabels: { enabled: false },
                    grid: { show: false },
                    xaxis: { categories: [''], labels: { show: true } },
                    colors: ['#CA6B6E', '#478F96'],
                };

                console.log('Chart Series:', series);

                // Setting state with the new data
                setChartData({ options, series });
                setTotalStudentAdded(data.total_added_count);
                setTotalScreened(data.total_screened_count);
                setTotalScheduleAdded(data.total_remaining_screening_employees);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [selectedSource, selctedType, selectedClassType]);

    return (
        <div>
            <h5 className="birthdashboard">
                {source === '1' ? 'Total Citizen' : 'Total Employee'}
            </h5>
            <div className="row">
                <div className="col-md-12 mb-2">
                    <div>
                        <ReactApexChart
                            options={chartData.options}
                            series={chartData.series}
                            type="bar"
                            height={203}
                            width="98%"
                        />
                    </div>
                </div>
                <div className="col-md-12">
                    <div className="row m-2">
                        <div className="col-md-4">
                            <div className="card studentadded">
                                <h6 className="totalstudenttitlecard">
                                    {source === '1' ? 'Total Citizen Added' : 'Total Employee Added'}
                                </h6>
                                <p className="countstudent">{totalStudentAdded}</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card studentScreened">
                                <h6 className="totalstudenttitlecard">
                                    {source === '1' ? 'Total Citizen Screened' : 'Total Employee Screened'}
                                </h6>
                                <p className="countstudent">{totalScreened}</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card ScheduledScreening">
                                <h6 className="totalstudenttitlecard">
                                    {source === '1' ? 'Total Citizen Remaining' : 'Total Employee Remaining'}
                                </h6>
                                <p className="countstudent">{totalScheduleAdded}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CorporateEmployee;
