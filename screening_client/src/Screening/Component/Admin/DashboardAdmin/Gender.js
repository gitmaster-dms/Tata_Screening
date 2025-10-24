import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import './Dashboard.css';
import axios from 'axios';

const Gender = ({ selectedSource, selctedType, selectedClassType, selectedScreenID }) => {
  const Port = process.env.REACT_APP_API_KEY;
  const accessToken = localStorage.getItem('token');
  const source = localStorage.getItem('loginSource');

  //// access the source name from local storage
  const SourceNameUrlId = localStorage.getItem('SourceNameFetched');

  console.log(source, 'fetched source in the Gender Dashboard');

  const [chartData, setChartData] = useState({
    options: {
      chart: {
        type: 'donut',
        height: 300, // Adjust the height as needed
      },
      // labels: ['Boys', 'Girls'],
      labels: source === '1' ? ['Boys', 'Girls'] : ['Male', 'Female'],
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: true,
        position: 'bottom', // Set the legend position to bottom
        horizontalAlign: 'center', // Align the legend to the center
        offsetY: 8, // Adjust the offset if needed
      },
      colors: ['#FF08B8', '#2EAED6'], // Set colors for each segment
    },
    series: [0, 0], // Initialize with empty values
  });

  ///// Gender API
  const fetchData = async () => {
    try {
      let apiUrl = `${Port}/Screening/gender_count/?`;

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
        apiUrl += `schedule_id=${selectedScreenID}&`;
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

      const series = [data.Male, data.Female];

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
  }, [selectedSource, selctedType, selectedClassType || selectedScreenID]);

  return (
    <div>
      <h5 className="birthdashboard">Gender</h5>
      <Chart className="genderchart" options={chartData.options} series={chartData.series} type="donut" width="240" />
    </div>
  );
};

export default Gender;
