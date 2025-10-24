import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';

const Psychological = ({ selectedSource, selctedType, selectedClassType, selectedScreenID }) => {
  const [data, setData] = useState([]);
  const Port = process.env.REACT_APP_API_KEY;
  const accessToken = localStorage.getItem('token');

  const source = localStorage.getItem('loginSource');
  const SourceNameUrlId = localStorage.getItem('SourceNameFetched');

  console.log(source, 'fetched source in the PFT');

  const fetchData = async () => {
    try {
      let url = `${Port}/Screening/NEW_PsycoCount/?`;

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
      if (response.ok) {
        const data = await response.json();
        setData(data); 
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

  const xAxisCategories = source === '1' ?
    ['Reading', 'Writing', 'Hyper', 'Aggressive'] :
    ['PFT Reading', 'PFT Remark'];

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
        horizontal: true,
        dataLabels: {
          position: 'top',
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    // xaxis: {
    //     categories: ['Reading', 'Writing', 'Hyper', 'Aggressive'],
    // },
    xaxis: {
      categories: xAxisCategories, // Set x-axis categories dynamically
    },
    yaxis: {
      min: 0,
      max: 200,
    },
    grid: {
      show: false,
    },
  };

  const getColorByIndex = (index) => {
    const colors = ['#F72585', '#B5179E', '#7209B7', '#3F37C9'];
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
      <h5 className="birthdashboard">
        {
          source === '1' ? 'Psychological Screening' : 'PFT'
        }
      </h5>
      <Chart options={options} series={series} type="bar" height="200" />
    </div>
  );
};

export default Psychological;
