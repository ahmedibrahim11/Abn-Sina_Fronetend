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
import { BarChartConfig } from 'src/app/shared/charts/barchart.options';
@Component({
  selector: 'app-most-sales-govs',
  templateUrl: './most-sales-govs.component.html',
  styleUrls: ['./most-sales-govs.component.css']
})
export class MostSalesGovsComponent implements OnInit {

  header: string = 'Most Top 7 Sales Govs';
  chartType = 'bar';
  top7Governerats: IChartModal[];
  chartData: IChartModal[];
  chart: any;
  pieChart: any;
  ChartColors = [];
  itemsName: any[] = [];
  itemsValue: any[] = [];
  @Input() data: any = [];
  constructor() {
    this.top7Governerats = [];
   
    this.chartData = [];
  }

  ngOnInit(): void {
    this.getSalesgovs();
  }

  getSalesgovs() {
    let allgovsSales = [];
    this.top7Governerats = [];

    let dataGroupedBysegment = _.groupBy(this.data, 'city');
    for (let key in dataGroupedBysegment) {
      if (key) {
        let segment = { name: key, value: 0 };
        let values: number[] = [];
        dataGroupedBysegment[key].forEach((elm: any) => {
          values.push(elm['value']);
        });
        segment.value = _.sum(values);

        allgovsSales.push(segment);
      }
    }

    this.top7Governerats = _.orderBy(allgovsSales, 'value')
      .reverse()
      .slice(0, 7);

    this.onTopOrLowestChange();
  }
  onTopOrLowestChange() {
   

      this.chartData = this.top7Governerats;
    

    this.itemsName = [];
    this.itemsValue = [];
    for (var i = 0; i < this.chartData.length; i++) {
      this.itemsName.push(this.chartData[i]['name']);
    }
    for (var i = 0; i < this.top7Governerats.length; i++) {
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
    this.chart = new Chart('govchart', {
      type: 'bar',
      options: BarChartConfig,
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
    this.chart = new Chart('govchart', {
      type: 'pie',
      options: {
        responsive: true,
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