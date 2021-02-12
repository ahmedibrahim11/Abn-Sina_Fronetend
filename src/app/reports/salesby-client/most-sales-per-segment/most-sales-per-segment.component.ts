import {
  Component,
  OnInit,

} from '@angular/core';
import { Input } from '@angular/core';
import * as Chart from 'chart.js';
import html2canvas from 'html2canvas';
import * as jsPDF from 'jspdf';
import * as _ from 'lodash';
import { IChartModal } from 'src/app/shared/modals/chart.modal';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import domtoimage from 'dom-to-image';
@Component({
  selector: 'app-most-sales-per-segment',
  templateUrl: './most-sales-per-segment.component.html',
  styleUrls: ['./most-sales-per-segment.component.css']
})
export class MostSalesPerSegmentComponent implements OnInit {
  header: string = 'Most Top 7 Sales Segments';
  chartType = 'bar';
  segmentType = '';
  top7Brnaches: IChartModal[];
  last7Brnaches: IChartModal[];
  chartData: IChartModal[];
  chart: any;
  pieChart: any;
  ChartColors = [];
  itemsName: any[] = [];
  itemsValue: any[] = [];
  @Input() data: any = [];
  constructor() {
    this.top7Brnaches = [];
    this.last7Brnaches = [];
    this.chartData = [];
  }

  ngOnInit(): void {
    this.segmentType = 'highest';
    this.getSalessegmentes();
  }

  getSalessegmentes() {
    let allsegmentesSales = [];
    this.top7Brnaches = [];

    let dataGroupedBysegment = _.groupBy(this.data, 'segment');
    for (let key in dataGroupedBysegment) {
      if (key) {
        let segment = { name: key, value: 0 };
        let values: number[] = [];
        dataGroupedBysegment[key].forEach((elm: any) => {
          values.push(elm['value']);
        });
        segment.value = _.sum(values);

        allsegmentesSales.push(segment);
      }
    }

    this.top7Brnaches = _.orderBy(allsegmentesSales, 'value')
      .reverse()
      .slice(0, 7);

    this.last7Brnaches = _.orderBy(allsegmentesSales, 'value').slice(0, 7);

    this.onTopOrLowestChange();
  }
  onTopOrLowestChange() {
    if (this.segmentType === 'highest') {
      this.header = 'Most Top 7 Sales Segments';
      this.chartData = this.top7Brnaches;
    } else {
      this.header = 'Lowest 7 Sales Segments';
      this.chartData = this.last7Brnaches;
    }

    this.itemsName = [];
    this.itemsValue = [];
    for (var i = 0; i < this.chartData.length; i++) {
      this.itemsName.push(this.chartData[i]['name']);
    }
    for (var i = 0; i < this.top7Brnaches.length; i++) {
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
  generateColors() {
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);
    return ('rgb(' + r + ',' + g + ',' + b + ')') as never;
  }
  generateBarChart() {
    this.chart = new Chart('segchart', {
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
    this.chart = new Chart('segchart', {
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


  openPDF(id: any): void {
    var element: any = document.getElementById(id);
    const options = { background: 'white', height: 845, width: 595 };
    domtoimage.toPng(element, options).then((canvas: any) => {
      const doc = new jsPDF('p', 'mm', 'a4');
      doc.addImage(canvas, 'PNG', 0, 0, 100, 100);
      doc.save(this.header)
    })
  }
}
