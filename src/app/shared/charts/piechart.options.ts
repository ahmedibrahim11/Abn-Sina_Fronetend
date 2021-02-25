import { ChartOptions } from "chart.js";
import { Context } from "chartjs-plugin-datalabels/types/context";

export const PieChartConfig:ChartOptions={
  responsive: true,
  tooltips: {
    enabled: true,
    mode: 'single',
    callbacks: {
      label: function (tooltipItems: any, data: any) {
       
          let sum = 0;
          let dataArr:any = data.datasets[0].data;
          dataArr.map((data:any) => {
              sum += parseInt(data);
          });
          let percentage = (data.datasets[0].data[tooltipItems.index]*100 / sum).toFixed(2)+"%";
          return percentage;
      
    
      },
    },
  },
   title: {
    display: true,
    fontSize: 10,
    text: '',
  },
  legend: {
    align: 'center',
    display: true,
    labels:{fontSize:12},
    
 
  },
  plugins: {
    // Change options for ALL labels of THIS CHART
    datalabels: {
      color: 'black',
      formatter: (value:any, ctx:Context) => {
        let sum = 0;
        let dataArr:any = ctx.dataset.data;

        dataArr.map((data:any) => {
            sum += parseInt(data);
        });
        let percentage = (value*100 / sum).toFixed(2)+"%";
        return percentage;
    },

      labels: {
        title: {
          font: {
            weight: 'bold',
            size: 10
          }
        }
      }
    }
  }
};