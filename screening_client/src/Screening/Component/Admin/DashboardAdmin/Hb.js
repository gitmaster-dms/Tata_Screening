import React from 'react';
import Chart from 'react-apexcharts';
import './Dashboard.css'
import hbimage from '../../../Images/noun_Blood Pressure_10989 1.png'

const Hb = () => {
    
    const accessToken = localStorage.getItem('token');

    const options = {
        chart: {
            height: 280,
            type: "area",
            toolbar: {
                show: false,
            },
        },
        series: [
            {
                name: "Series 1",
                data: [2, 23, 19, 45, 38, 52, 45]
            }
        ],
        xaxis: {
            labels: {
                show: false,
            },
            axisBorder: {
                show: false,
            }
        },
        yaxis: {
            labels: {
                show: false,
            },
            axisBorder: {
                show: false,
            }
        },
        zoom: {
            enabled: false,
        },
        grid: {
            show: false,
        },
        fill: {
            type: "solid",
            colors: ['#FBF0F3'],
        },
        stroke: {
            curve: 'smooth',
            colors: ['#CA6B6E'],
            width: 1.5
        },
        markers: {
            size: 0,
        },
        dataLabels: {
            enabled: false,
        },
        tooltip: {
            enabled: false,
        }
    };

    return (
        <div>
            <h6 className="hbdashtitle">Hemoglobin (Hb)</h6>
            <div className="row margincardshift">
                <div className="col-md-2">
                    <div className='card hbcarddahs'>
                        <img className="hbimagedash" src={hbimage} />
                    </div>
                </div>
            </div>
            <Chart className="hbchatheight" options={options} series={options.series} type="area" height={90} style={{ marginTop: '-20px' }}/>
        </div>
    );
};

export default Hb;
