import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartType, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import { Input } from '@angular/core';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {

  @Input() chartData: any = [];


  @Input() branchData: any = [];
  @Input() type: any = '';

  @Input() header: any = [];
  
  itemsName : any = [];
  itemsValue: any = [];
ngOnInit(): void {

  switch (this.type) {
    case 1:
      for (var i = 0; i < this.chartData.length; i++) {
        this.itemsName.push(this.chartData[i]['name']);
      }
      for (var i = 0; i < this.chartData.length; i++) {
        this.itemsValue.push(this.chartData[i]['value']);
      }
      break;

    case 2:
      for (var i = 0; i < this.branchData.length; i++) {
        this.itemsName.push(this.branchData[i]);
      }
      for (var i = 0; i < this.chartData.length; i++) {
        this.itemsValue.push(this.chartData[i]);
      }

      break;

    default:
      break;
  }
 
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
      label: function (tooltipItems:any, data:any) {
        return data.datasets[0].data[tooltipItems.index] + 'LE';
      }
    }
  },
};

barChartLabels: Label[] = this.itemsName;
barChartData: ChartDataSets [] = [{data: this.itemsValue,label:"Most Sales Branches"}]
barChartType: ChartType = 'bar';
barChartLegend = true;
barChartPlugins = [];
barChartColors = [
  {
    backgroundColor: ['rgba(255, 99, 132)',
    'rgba(54, 162, 235)',
    'rgba(255, 206, 86)',
    'rgba(75, 192, 192)',
    'rgba(153, 102, 255 )',
    'rgba(153, 202, 205)',
    'rgba(255, 159, 64,)']
  },
];
}