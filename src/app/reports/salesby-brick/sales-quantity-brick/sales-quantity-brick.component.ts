import { Component, OnInit, Input } from '@angular/core';
import domtoimage from 'dom-to-image';
import * as Chart from 'chart.js';
import * as jsPDF from 'jspdf';
import * as _ from 'lodash';

import ChartDataLabels from 'chartjs-plugin-datalabels';
import { BarChartConfig } from 'src/app/shared/charts/barchart.options';
import { PieChartConfig } from 'src/app/shared/charts/piechart.options';

export interface ChartDataModal {
  labels: string[];
  values: number[];
  colors: string[];
}

@Component({
  selector: 'app-sales-quantity-brick',
  templateUrl: './sales-quantity-brick.component.html',
  styleUrls: ['./sales-quantity-brick.component.css'],
})
export class SalesQuantityBrickComponent implements OnInit {
  @Input() data: any = [];
  brickHeader = ' Bricks Quantites';
  itemsDropDownMenu: any = [];
  selectedItem: any;
  chartType: string = 'bar';
  chart1: any;
  chart1Data: ChartDataModal;
  generateClicked: any;
  constructor() {
    this.chart1Data = { labels: [], colors: [], values: [] };
    this.chart1 = undefined;
  }

  ngOnInit(): void {
    this.chartType = 'bar';
    debugger;
    this.itemsDropDownMenu = _.uniqBy(this.data, 'Item Name');
    this.selectedItem=this.itemsDropDownMenu[0];
    this.generatCharts();
  }

  changeType(e: any) {
    if (e.target.value === 'bar') {
      this.chartType = 'bar';
    } else {
      this.chartType = 'pie';
    }
    this.generatCharts();
  }

  getSalesData(itemCode: Number, type: string, chartData: ChartDataModal) {
    let allbranchesSales = [];
    let dataGroupedByBranch = _.groupBy(this.data, 'Brick Name');
    for (let key in dataGroupedByBranch) {
      if (key) {
        let branch = { name: key, value: 0, qty: 0 };
        let values: number[] = [];
        dataGroupedByBranch[key]
          .filter((s) => s['Item Code'] === itemCode)
          .forEach((elm: any) => {
            values.push(elm[type]);
          });
        branch.value = _.sum(values);
        allbranchesSales.push(branch);
      }
    }
    let top7BrnachesSales = _.orderBy(allbranchesSales, 'value')
      .reverse()
      .slice(0, 7);
    top7BrnachesSales.forEach((branch: any) => {
      chartData.labels.push(branch.name);
      chartData.values.push(branch.value.toFixed(2));
      chartData.colors.push(this.generateColors());
    });
  }

  getStockData(itemCode: Number, type: string, chartData: ChartDataModal) {
    let allbranches = [];
    let dataGroupedByBranch = _.groupBy(this.data, 'Branch Name');
    for (let key in dataGroupedByBranch) {
      if (key) {
        let branch = { name: key, value: 0 };
        let values: number[] = [];

        dataGroupedByBranch[key]
          .filter((s) => s['Item Code'] === itemCode)
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
    this.getSalesData(
      this.selectedItem['Item Code'],
      'Total Qty',
      this.chart1Data
    );

    if (this.chart1 !== undefined) {
      this.chart1.destroy();
    }

    switch (this.chartType) {
      case 'bar':
        this.chart1 = this.generateBarChart(
          this.chart1Data,
          'chart1',
          this.brickHeader
        );
        break;
      case 'pie':
        this.chart1 = this.generatePieChart(
          this.chart1Data,
          'chart1',
          this.brickHeader
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
      options: BarChartConfig,
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
      options: PieChartConfig,
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
    const options = { background: 'white', height: 845, width: 595 };
    domtoimage.toPng(element, options).then((canvas: any) => {
      const doc = new jsPDF('p', 'mm', 'a4');
      doc.addImage(canvas, 'PNG', 0, 0, 100, 100);
      doc.save(this.brickHeader);
    });
  }
}
