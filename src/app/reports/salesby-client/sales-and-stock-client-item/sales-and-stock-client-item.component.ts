import { ThrowStmt } from '@angular/compiler';
import { Component, Input, OnInit } from '@angular/core';
import * as Chart from 'chart.js';
import html2canvas from 'html2canvas';
import * as jsPDF from 'jspdf';
import * as _ from 'lodash';
import { ChartDataModal } from '../../sales-and-stocks/sales-and-stocks-item/sales-and-stocks-item.component';

import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-sales-and-stock-client-item',
  templateUrl: './sales-and-stock-client-item.component.html',
  styleUrls: ['./sales-and-stock-client-item.component.css']
})
export class SalesAndStockClientItemComponent implements OnInit {
  @Input() data: any = [];

  selectedvalQty: any;

  stockChartHeader = ' Stock Values';
  salesChartHeader = ' Sales Values';

  itemsDropDownMenu: any = [];
  selectedItem: any;
  chartType: string = 'bar';
  chart1: any;
  chart2: any;
  chart1Data: ChartDataModal;
  chart2Data: ChartDataModal;
  generateClicked: any;
  constructor() {
    this.chart1Data = { labels: [], colors: [], values: [] };
    this.chart2Data = { labels: [], colors: [], values: [] };
    this.chart1 = undefined;
    this.chart2 = undefined;
  }

  ngOnInit(): void {
    this.selectedvalQty = 'val';
    this.chartType = 'bar';
    this.itemsDropDownMenu = _.uniqBy(this.data,'itemName');
  }

  changeValueQuantity(e: any) {
    if (e.target.value === 'val') {
      this.selectedvalQty = 'val';
      this.stockChartHeader = ' Stock Values';
      this.salesChartHeader = ' Sales Values';
    } else {
      this.selectedvalQty = 'qty';
      this.stockChartHeader = ' Stock Quantites';
      this.salesChartHeader = ' Sales Quantites';
    }
  }

  changeType(e: any) {
    if (e.target.value === 'bar') {
      this.chartType = 'bar';
    } else {
      this.chartType = 'pie';
    }
  }

  getSalesData(itemCode: Number, type: string, chartData: ChartDataModal) {
    let allbranchesSales = [];
    let dataGroupedByBranch = _.groupBy(this.data, 'clientCode');
    for (let key in dataGroupedByBranch) {
      if (key) {
        let branch = { name: key, value: 0, qty: 0 };
        let values: number[] = [];
        dataGroupedByBranch[key]
          .filter((s) => s['itemCode'] === itemCode)
          .forEach((elm: any) => {
            values.push(elm[type]);
          });
        branch.value = _.sum(values);
        allbranchesSales.push(branch);
      }
    }
    let top7 = _.orderBy(allbranchesSales, 'value')
      .reverse()
      .slice(0, 7);
      top7.forEach((branch: any) => {
      chartData.labels.push(branch.name);
      chartData.values.push(branch.value.toFixed(2));
      chartData.colors.push(this.generateColors());
    });
  }

  getStockData(itemCode: Number, type: string, chartData: ChartDataModal) {
    let allbranches = [];
    let dataGroupedByclientCode = _.groupBy(this.data, 'clientCode');
    for (let key in dataGroupedByclientCode) {
      if (key) {
        let branch = { name: key, value: 0 };
        let values: number[] = [];

        dataGroupedByclientCode[key]
          .filter((s) => s['itemCode'] === itemCode)
          .forEach((elm: any) => {
            values.push(elm[type]);
          });
        branch.value = _.sum(values);
        allbranches.push(branch);
      }
    }
    let top7BrnachesStock = _.orderBy(allbranches, 'value')
      .reverse()
      .slice(0, 7);
    top7BrnachesStock.forEach((branch: any) => {
      chartData.labels.push(branch.name);
      chartData.values.push(branch.value.toFixed(2));
      chartData.colors.push(this.generateColors());
    });
  }

  generatCharts() {
    this.generateClicked = true;
    this.chart1Data = { labels: [], colors: [], values: [] };
    this.chart2Data = { labels: [], colors: [], values: [] };
    if (this.selectedvalQty === 'val') {
      this.getSalesData(this.selectedItem['itemCode'],'qty',this.chart1Data);
      this.getSalesData(this.selectedItem['itemCode'],'value',this.chart2Data);

    } else {
      this.getStockData(this.selectedItem['itemCode'],'qty',this.chart1Data);

      this.getStockData(this.selectedItem['itemCode'],'value',this.chart2Data);
    }

    if (this.chart1 !== undefined) {
      this.chart1.destroy();
    }
    if (this.chart2 !== undefined) {
      this.chart2.destroy();
    }
    switch (this.chartType) {
      case 'bar':
        this.chart1 = this.generateBarChart(
          this.chart1Data,
          'chart1',
          this.stockChartHeader
        );
        this.chart2 = this.generateBarChart(
          this.chart2Data,
          'chart2',
          this.salesChartHeader
        );
        break;
      case 'pie':
        this.chart1 = this.generatePieChart(
          this.chart1Data,
          'chart1',
          this.stockChartHeader
        );
        this.chart2 = this.generatePieChart(
          this.chart2Data,
          'chart2',
          this.salesChartHeader
        );
        break;

      default:
        break;
    }
  }

  generateColors() {
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);
    return ('rgb(' + r + ',' + g + ',' + b + ')') as never;
  }
  generateBarChart(chartData: ChartDataModal, id: any, header: string) {
    return new Chart(id, {
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
          text: header,
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
        labels: chartData.labels.map((s) => s.substring(0, 15)),

        datasets: [
          {
            data: chartData.values,
            backgroundColor: chartData.colors,
            borderColor: '#fff',
          },
        ],
      },
    });
  }

  generatePieChart(chartData: ChartDataModal, id: any, header: string) {
    return new Chart(id, {
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
          text: header,
        },

        legend: {
          align: 'center',
          display: true,
        },
      },
      plugins: [ChartDataLabels],
      data: {
        labels: chartData.labels.map((s) => s.substring(0, 18)),

        datasets: [
          {
            data: chartData.values,
            backgroundColor: chartData.colors,
            borderColor: '#fff',
          },
        ],
      },
    });
  }

  openPDF(id: any): void {
    var element: any = document.getElementById(id);

    html2canvas(element).then((canvas) => {
      var imgData = canvas.toDataURL('image/png');
      let doc = new jsPDF();
      doc.addImage(imgData, 0, 0, 0, 100, 500);
      doc.save('ss');
    });
  }
}
