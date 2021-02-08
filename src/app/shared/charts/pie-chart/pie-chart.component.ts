import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import { Input } from '@angular/core';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css'],
})
export class PieChartComponent implements OnInit {
  @Input() chartData: any = [];
  @Input() type: any = '';
  @Input() branchData: any = [];
  @Input() header: any = [];

  itemsName: any = [];
  itemsValue: any = [];
  ngOnInit(): void {
    for (var i = 0; i < this.chartData.length; i++) {
      this.itemsName.push(this.chartData[i]['name']);
    }
    for (var i = 0; i < this.chartData.length; i++) {
      this.itemsValue.push(this.chartData[i]['value']);
      let color = this.generateColors();
      this.pieChartColors[0].backgroundColor.push(color);
    }
  }

  pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top',
    },
    tooltips: {
      enabled: true,
      mode: 'single',
      callbacks: {
        label: function (tooltipItems: any, data: any) {
          return data.datasets[0].data[tooltipItems.index] + ' %';
        },
      },
    },
  };

  pieChartLabels: Label[] = this.itemsName;

  pieChartData: any[] = this.itemsValue;

  pieChartType: ChartType = 'pie';

  pieChartLegend = true;

  pieChartPlugins = [];

  openPDF(): void {
    var element: any = document.getElementById('myChart');
    debugger;
    html2canvas(element).then((canvas) => {
      var imgData = canvas.toDataURL('image/png');
      let doc = new jsPDF();
      doc.addImage(imgData, 0, 0, 0, 90, 400);
      doc.save(this.header);
    });
  }

  generateColors() {
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);
    return ('rgb(' + r + ',' + g + ',' + b + ')') as never;
  }
  pieChartColors = [
    {
      backgroundColor: [],
    },
  ];
}
