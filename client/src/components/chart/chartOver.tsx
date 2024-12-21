import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const ChartOver = () => {
  const options = {
    chart: {
      type: 'column', // Kiểu biểu đồ cột
      backgroundColor: '#fff', // Màu nền
    },
    title: {
      text: null, // Không có tiêu đề
    },
    xAxis: {
      categories: ['19', '22', '01', '04', '07', '10', '13', '16', '19'], // Dữ liệu trục X
      labels: {
        style: { color: '#000' }, // Màu chữ
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: null, // Không tiêu đề trục Y
      },
      labels: {
        style: { color: '#000' }, // Màu chữ
      },
    },
    series: [
      {
        name: 'Data',
        data: [30, 30, 30, 30, 30, 30, 30, 70, 100], // Dữ liệu
        color: '#0f0', // Màu cột
      },
    ],
    tooltip: {
      enabled: false,
    },
    credits: {
      enabled: false, // Tắt logo Highcharts
    },
    plotOptions: {
      column: {
        borderWidth: 0,
        borderRadius: 2, // Bo góc cột
      },
    },
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default ChartOver;
