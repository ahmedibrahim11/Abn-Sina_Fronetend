import { Component, OnInit,Input } from '@angular/core';
import * as _ from 'lodash';
import { IChartModal } from 'src/app/shared/modals/chart.modal';
import * as Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import * as jsPDF from 'jspdf';
import domtoimage from 'dom-to-image';
@Component({
  selector: 'app-most-sales-bricks',
  templateUrl: './most-sales-bricks.component.html',
  styleUrls: ['./most-sales-bricks.component.css']
})
export class MostSalesBricksComponent implements OnInit {
  header: string = 'Most Top 7 Sales Bricks';
  chartType = 'bar';
  branchType = '';
  top7Bricks: IChartModal[];
  last7Bricks: IChartModal[];
  chartData: IChartModal[];
  chart: any;
  pieChart: any;
  ChartColors = [];
  itemsName: any[] = [];
  itemsValue: any[] = [];
  @Input() data: any = [];
  constructor() { 
    this.top7Bricks=[];
    this.last7Bricks=[];
    this.chartData=[];
  }

  ngOnInit(): void {
    this.branchType = 'highest';
    this.getSalesBricks();
  }

  
  getSalesBricks() {
    let allBricksSales = [];
    this.top7Bricks = [];

    let dataGroupedByBranch = _.groupBy(this.data, 'Brick Name');
    console.log("Bricks",dataGroupedByBranch);
    for (let key in dataGroupedByBranch) {
      if (key) {
        let branch = { name: key, value: 0 };
        let values: number[] = [];
        dataGroupedByBranch[key].forEach((elm: any) => {
          values.push(elm['Total Qty']);
        });
        branch.value = _.sum(values);

        allBricksSales.push(branch);
      }
    }

    this.top7Bricks = _.orderBy(allBricksSales, 'value')
      .reverse()
      .slice(0, 7);

      console.log("top7Bricks",this.top7Bricks);

    this.last7Bricks = _.orderBy(allBricksSales, 'value').slice(0, 7);

    console.log("last",this.last7Bricks);


    this.onTopOrLowestChange();
  }

  onTopOrLowestChange() {
    if (this.branchType === 'highest') {
      this.header = 'Most Top 7 Sales Bricks';
      this.chartData = this.top7Bricks;
    } else {
      this.header = 'Lowest 7 Sales Bricks';
      this.chartData = this.last7Bricks;
    }

    this.itemsName = [];
    this.itemsValue = [];
    for (var i = 0; i < this.chartData.length; i++) {
      this.itemsName.push(this.chartData[i]['name']);
    }
    for (var i = 0; i < this.top7Bricks.length; i++) {
      this.itemsValue.push(this.chartData[i]['value'].toFixed(2));
      let color = this.generateColors();
      this.ChartColors.push(color);
    }
    this.onChartTypeChange();
  }

  onChartTypeChange() {
    if (this.chart) {
      this.chart.destroy();
    }
    if (this.chartType === 'bar') {
      this.generateBarChart();
    } else {
      this.generatePieChart();
    }
  }


  generateBarChart() {
    this.chart = new Chart('chart', {
      type: 'bar',
      options: {
        animation: { duration: 1000, easing: 'linear' },
        tooltips: {
          enabled: true,
          mode: 'single',
          callbacks: {
            label: function (tooltipItems: any, data: any) {
              return data.datasets[0].data[tooltipItems.index] + 'LE';
            },
          },
        },
        title: {
          display: true,
          fontSize: 10,
          text: this.header,
        },
        scales: {
          xAxes: [
            {
              gridLines: {
                display: true,
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
      },
      plugins: [ChartDataLabels],
      data: {
        labels: this.itemsName.map((s) => s.substring(0, 18)),

        datasets: [
          {
            data: this.itemsValue,
            backgroundColor: this.ChartColors,
            borderColor: '#fff',
          },
        ],
      },
    });
  }

  generatePieChart() {
    this.chart = new Chart('chart', {
      type: 'pie',
      options: {
        responsive: true,
        tooltips: {
          enabled: true,
          mode: 'single',
          callbacks: {
            label: function (tooltipItems: any, data: any) {
              return data.datasets[0].data[tooltipItems.index] + 'LE';
            },
          },
        },
        title: {
          display: true,
          fontSize: 10,
          text: this.header,
        },

        legend: {
          align: 'center',
          display: true,
        },
      },
      plugins: [ChartDataLabels],
      data: {
        labels: this.itemsName.map((s) => s.substring(0, 18)),

        datasets: [
          {
            data: this.itemsValue,
            backgroundColor: this.ChartColors,
            borderColor: '#fff',
          },
        ],
      },
    });
  }
  generateColors() {
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);
    return ('rgb(' + r + ',' + g + ',' + b + ')') as never;
  }

  
  openPDF(id:any): void {
    var element: any = document.getElementById(id);
    const options = { background: 'white', height: 845, width: 595 };
    domtoimage.toPng(element, options).then((canvas: any) => {
      const doc = new jsPDF('p', 'mm', 'a4');
      doc.addImage(canvas, 'PNG', 0, 0, 100, 100);
      doc.save(this.header)
    })
  }

}