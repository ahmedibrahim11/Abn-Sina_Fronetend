import { ChartOptions } from "chart.js";

export const BarChartConfig:ChartOptions={
  animation: { duration: 1000, easing: 'linear' },
  tooltips: {
    enabled: true,
    mode: 'single',
    callbacks: {
      label: function (tooltipItems: any, data: any) {
        return data.datasets[0].data[tooltipItems.index].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      },
    },
  },
  title: {
    display: true,
    fontSize: 20,
    text: '',
    fontColor:"black",
  
 
  },
  scales: {
    xAxes: [
      {
        gridLines: {
          display: true
        },
      },
    ],

    yAxes: [
      {
        ticks: {
          beginAtZero: true,
          fontColor: '#000',
          fontSize: 10,
        },
      },
    ],
  },
  legend: {
    align: 'center',
    display: false,
  },
  plugins: {
    // Change options for ALL labels of THIS CHART
    datalabels: {
      color: 'black',
      labels: {
        title: {
        formatter:function(text:string){
          return   text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        },
          font: {
            weight: 'bold',
            size: 10,
          },
        }
      }
    }
  }
};