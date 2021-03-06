import { ThrowStmt } from '@angular/compiler';
import { Component, Input, OnInit } from '@angular/core';
import * as Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import html2canvas from 'html2canvas';
import * as jsPDF from 'jspdf';
import * as _ from 'lodash';

import { ExportAsService, ExportAsConfig,SupportedExtensions } from 'ngx-export-as';


export interface ChartDataModal {
  labels: string[];
  values: number[];
  colors: string[];
}
@Component({
  selector: 'app-sales-and-stocks-item',
  templateUrl: './sales-and-stocks-item.component.html',
  styleUrls: ['./sales-and-stocks-item.component.css'],
})
export class SalesAndStocksItemComponent implements OnInit {

  config: ExportAsConfig = {
    type: 'pdf', // the type you want to download
    elementIdOrContent: "mytable",
    options: {
      jsPDF: {
        orientation: 'landscape'
      },
      pdfCallbackFn: this.pdfCallbackFn // to add header and footer
    }
  }
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
  constructor(private exportAsService: ExportAsService) {
    this.chart1Data = { labels: [], colors: [], values: [] };
    this.chart2Data = { labels: [], colors: [], values: [] };
    this.chart1 = undefined;
    this.chart2 = undefined;
  }

  ngOnInit(): void {
    this.selectedvalQty = 'val';
    this.chartType = 'bar';
    this.itemsDropDownMenu = _.uniqBy(this.data, 'Item name');
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
    let dataGroupedByBranch = _.groupBy(this.data, 'Branch Name');
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
      chartData.values.push(branch.value);
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
      chartData.values.push(branch.value);
      chartData.colors.push(this.generateColors());
    });
  }
  pdfCallbackFn (pdf: any) {
    // example to add page number as footer to every page of pdf
    const noOfPages = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= noOfPages; i++) {
      pdf.setPage(i);
      pdf.text('Page ' + i + ' of ' + noOfPages, pdf.internal.pageSize.getWidth() - 100, pdf.internal.pageSize.getHeight() - 30);
    }
  }

  generatCharts() {
    this.generateClicked = true;
    this.chart1Data = { labels: [], colors: [], values: [] };
    this.chart2Data = { labels: [], colors: [], values: [] };
    if (this.selectedvalQty === 'val') {
      this.getSalesData(
        this.selectedItem['Item Code'],
        'Sales Qty',
        this.chart1Data
      );
      this.getSalesData(
        this.selectedItem['Item Code'],
        'Sales Value',
        this.chart2Data
      );
    } else {
      this.getStockData(
        this.selectedItem['Item Code'],
        'Stock',
        this.chart1Data
      );

      this.getStockData(
        this.selectedItem['Item Code'],
        'Stock Value',
        this.chart2Data
      );
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

      plugins:[ChartDataLabels],
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
        plugins:[ChartDataLabels],
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


  exportAs(type: SupportedExtensions, opt?: string) {
    debugger;
    this.config.type = type;
    if (opt) {
      this.config.options.jsPDF.orientation = opt;
    }
    this.exportAsService.save(this.config, 'myFile').subscribe(() => {
    });

  }


}
