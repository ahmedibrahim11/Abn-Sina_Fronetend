import { NgSwitch } from '@angular/common';
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterContentInit,
} from '@angular/core';
import { Input } from '@angular/core';
import * as Chart from 'chart.js';
import html2canvas from 'html2canvas';
import * as jsPDF from 'jspdf';
import * as _ from 'lodash';
import { IChartModal } from 'src/app/shared/modals/chart.modal';

import { ExportAsService, ExportAsConfig,SupportedExtensions } from 'ngx-export-as';


import ChartDataLabels from 'chartjs-plugin-datalabels';


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
  config: ExportAsConfig = {
    type: 'pdf', // the type you want to download
    elementIdOrContent: "chart",
    options: {
      jsPDF: {
        orientation: 'landscape'
      },
      pdfCallbackFn: this.pdfCallbackFn // to add header and footer
    }
  }
  constructor(private exportAsService: ExportAsService) {
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
  pdfCallbackFn (pdf: any) {
    // example to add page number as footer to every page of pdf
    const noOfPages = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= noOfPages; i++) {
      pdf.setPage(i);
      pdf.text('Page ' + i + ' of ' + noOfPages, pdf.internal.pageSize.getWidth() - 100, pdf.internal.pageSize.getHeight() - 30);
    }
  }
  
  exportAsString(type: SupportedExtensions, opt?: string) {
    this.config.elementIdOrContent = '<div> test string </div>';
    this.exportAs(type, opt);
    setTimeout(() => {
      this.config.elementIdOrContent = 'mytable';
    }, 1000);
  }

  exportAs(type: SupportedExtensions, opt?: string) {
    this.config.type = type;
    if (opt) {
      this.config.options.jsPDF.orientation = opt;
    }
    this.exportAsService.save(this.config, 'myFile').subscribe(() => {
    });
    
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
      plugins:[ChartDataLabels],
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

  openPDF(): void {
    var element: any = document.getElementById('chart');
    debugger;
    html2canvas(element).then((canvas) => {
      var imgData = canvas.toDataURL('image/png');
      let doc = new jsPDF();
      doc.addImage(imgData, 0, 10, 10, 100, 500);
      doc.save(this.header);
    });
  }
}
