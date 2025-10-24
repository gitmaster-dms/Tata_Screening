import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import './Dashboard.css'

const TotalStudents = ({ selectedSource, selctedType, selectedClassType, selectedScreenID }) => {
    const Port = process.env.REACT_APP_API_KEY;
    const source = localStorage.getItem('loginSource');

    //// access the source name from local storage
    const SourceNameUrlId = localStorage.getItem('SourceNameFetched');

    console.log(source, 'fetched source in the vision');
    const [chartData, setChartData] = useState({ options: {}, series: [] });
    const [totalStudentAdded, setTotalStudentAdded] = useState([]);
    const [totalScheduleAdded, setTotalScheduleAdded] = useState([]);
    const [totalScreened, setTotalScreened] = useState([]);
    const [totalRemaining, setTotalRemaining] = useState([]);
    const accessToken = localStorage.getItem('token');

    const fetchData = async () => {
        try {
            let url = `${Port}/Screening/NEW_citizens_count/?`;

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
                url += `source_name_id=${SourceNameUrlId}&`;
            }

            if (selectedScreenID) {
                url += `schedule_id=${selectedScreenID}`;
            }

            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            const data = await response.json();
            console.log('API Data:', data);

            const currentYear = new Date().getFullYear();

            const categories = source === '1' ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

            const filteredData = {
                citizen_counts_monthwise: {},
                screening_counts_monthwise: {},
                total_screened_count_monthwise: {},
                total_added_count: {},
                total_screened_count: {}
            };

            for (const month in data.citizen_counts_monthwise) {
                const year = new Date(month).getFullYear();
                if (year === currentYear) {
                    filteredData.citizen_counts_monthwise[month] = data.citizen_counts_monthwise[month];
                    filteredData.screening_counts_monthwise[month] = data.screening_counts_monthwise[month];
                    filteredData.total_screened_count_monthwise[month] = data.total_screened_count_monthwise[month];
                }
            }

            const options = source === '1' ? {
                chart: { type: 'bar', height: 350, width: '100%', toolbar: { show: false } },
                plotOptions: { bar: { horizontal: false } },
                dataLabels: { enabled: false },
                grid: { show: false },
                xaxis: { type: 'category', categories, labels: { show: true } },
                yaxis: { max: 1000, tickAmount: 5, tickvals: [100, 200, 300, 400, 500, 600, 700] },
                colors: ['#CA6B6E', '#478F96', '#D08726'],
            } :
                {
                    chart: { type: 'bar', height: 350, width: '100%', toolbar: { show: false } },
                    plotOptions: { bar: { horizontal: false } },
                    dataLabels: { enabled: false },
                    grid: { show: false },
                    xaxis: { type: 'category', categories, labels: { show: true } },
                    colors: ['#CA6B6E', '#478F96', '#D08726'],
                };

            const series = source === '1' ? [{
                name: 'Total Citizen Added',
                data: Object.values(filteredData.citizen_counts_monthwise)
            },
            {
                name: 'Total Citizen Remaining',
                data: Object.values(filteredData.screening_counts_monthwise)
            },
            {
                name: 'Total Screened',
                data: Object.values(filteredData.total_screened_count_monthwise)
            },
            ] :
                source === '5' ? [{
                    name: 'Total Employee Added',
                    data: Object.values(filteredData.citizen_counts_monthwise)
                },
                {
                    name: 'Total Citizen Remaining',
                    data: Object.values(filteredData.screening_counts_monthwise)
                },
                ] :
                    [];

            console.log('Chart Series:', series);

            setChartData({
                options,
                series
            });
            setTotalStudentAdded(data.total_added_count);
            setTotalScreened(data.total_screened_count);
            setTotalScheduleAdded(data.total_schedule_count);
            setTotalRemaining(data.total_remaining_screening_employees);

            console.log();

            setChartData({
                options,
                series
            });
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
        <div>
            {/* <h5 className="birthdashboard">Total Citizen</h5> */}
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
                                {/* <h6 className="totalstudenttitlecard">Total Citizen Added</h6> */}
                                <p className="countstudent">{totalStudentAdded}</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card studentScreened">
                                <h6 className="totalstudenttitlecard">
                                    {source === '1' ? 'Total Citizen Screened' : 'Total Employee Screened'}
                                </h6>
                                {/* <h6 className="totalstudenttitlecard">Total Citizen Screened</h6> */}
                                <p className="countstudent">{totalScreened}</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card ScheduledScreening">
                                <h6 className="totalstudenttitlecard">
                                    {source === '1' ? 'Total Citizen Remaining' : 'Total Employee Remaining'}
                                </h6>
                                {/* <h6 className="totalstudenttitlecard">Total Screening Scheduled</h6> */}
                                <p className="countstudent">{totalRemaining}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TotalStudents
