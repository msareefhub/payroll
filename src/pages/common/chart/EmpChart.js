//import { useEffect, useState } from 'react';

// material-ui
//import { useTheme } from '@mui/material/styles';

// third-party
import ReactApexChart from 'react-apexcharts';

// chart options
const barChartOptions = {
  series: [44, 55, 13, 43, 22],
  options: {
    chart: {
      width: 380,
      type: 'pie'
    },
    labels: ['Sareef', 'Kavya', 'Anas', 'Sana', 'Ilma'],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }
    ]
  }
};

// ==============================|| MONTHLY BAR CHART ||============================== //

const EmailChart = () => {
  return (
    <div id="chart">
      <ReactApexChart options={barChartOptions.options} series={barChartOptions.series} type="pie" height={500} />
    </div>
  );
};

export default EmailChart;
