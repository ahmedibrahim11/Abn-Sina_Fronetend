import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChartDataSets, ChartType, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import { Input } from '@angular/core';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css'],
})
export class BarChartComponent implements OnInit {
  @Input() chartData: any = [];

  @Input() branchData: any = [];
  @Input() type: any = '';

  @Input() header: any = [];

  itemsName: any = [];
  itemsValue: any = [];

  ngOnInit(): void {
    console.log('chartDataaaaa', this.chartData);
    for (var i = 0; i < this.chartData.length; i++) {
      this.itemsName.push(this.chartData[i]['name'].substring(0, 18));
    }
    for (var i = 0; i < this.chartData.length; i++) {
      this.itemsValue.push(this.chartData[i]['value']);
      let color = this.generateColors();
      this.barChartColors[0].backgroundColor.push(color);
    }
  }

  openPDF(): void {
    var element: any = document.getElementById('myChart');
    debugger;
    html2canvas(element).then((canvas) => {
      var imgData = canvas.toDataURL('image/png');
      let doc = new jsPDF();
      doc.addImage(imgData, 0, 0, 0, 100, 500);
      doc.save(this.header);
    });
  }

  barChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top',
    },

    tooltips: {
      enabled: true,
      mode: 'single',
      callbacks: {
        label: function (tooltipItems: any, data: any) {
          return data.datasets[0].data[tooltipItems.index] + 'LE';
        },
      },
    },
  };

  barChartLabels: Label[] = this.itemsName;
  barChartData: ChartDataSets[] = [
    { data: this.itemsValue, label: this.header },
  ];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];
  generateColors() {
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);
    return ('rgb(' + r + ',' + g + ',' + b + ')') as never;
  }
  barChartColors = [
    {
      backgroundColor: [],
    },
  ];
}
