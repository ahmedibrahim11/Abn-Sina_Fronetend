import { CurrencyPipe, NgSwitch } from '@angular/common';
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterContentInit,
} from '@angular/core';
import { Input } from '@angular/core';
import * as Chart from 'chart.js';
import * as jsPDF from 'jspdf';
import * as _ from 'lodash';
import { IChartModal } from 'src/app/shared/modals/chart.modal';
import datalabels from 'chartjs-plugin-datalabels';
import domtoimage from 'dom-to-image';
import { BarChartConfig } from 'src/app/shared/charts/barchart.options';


@Component({
  selector: 'app-most-sales-branches',
  templateUrl: './most-sales-branches.component.html',
  styleUrls: ['./most-sales-branches.component.css'],
})
export class MostSalesBranchesComponent implements OnInit {
  header: string = 'Most Top 7 Sales Branches';
  chartType = 'bar';
  branchType = '';
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
    this.branchType = 'highest';
    this.getSalesBranches();
    
  }

  getSalesBranches() {
    let allbranchesSales = [];
    this.top7Brnaches = [];

    let dataGroupedByBranch = _.groupBy(this.data, 'Branch Name');
    for (let key in dataGroupedByBranch) {
      if (key) {
        let branch = { name: key, value: 0 };
        let values: number[] = [];
        dataGroupedByBranch[key].forEach((elm: any) => {
          values.push(elm['Sales Value']);
        });
        branch.value = _.sum(values);

        allbranchesSales.push(branch);
      }
    }
    _.remove(allbranchesSales,s=>s['value']<=0);

    this.top7Brnaches = _.orderBy(allbranchesSales, 'value')
      .reverse()
      .slice(0, 7);

    this.last7Brnaches = _.orderBy(allbranchesSales, 'value').slice(0, 7);

    this.onTopOrLowestChange();
  }
  onTopOrLowestChange() {
    if (this.branchType === 'highest') {
      this.header = 'Most Top 7 Sales Branches';
      this.chartData = this.top7Brnaches;
    } else {
      this.header = 'Lowest 7 Sales Branches';
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
    this.chart = new Chart('chart', {
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
    this.chart = new Chart('chart', {
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
          text: '',
        },
        legend: {
          align: 'center',
          display: true,
        },
        plugins: {
          // Change options for ALL labels of THIS CHART
          datalabels: {
            color: 'black',
            formatter(label){
              return label.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
      },
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
