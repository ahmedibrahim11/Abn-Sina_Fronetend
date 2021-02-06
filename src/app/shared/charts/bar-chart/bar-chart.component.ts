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
  @Input() header: any = [];
  
  itemsName : any = [];
  itemsValue: any = [];
ngOnInit(): void {
   for(var i=0 ; i< this.chartData.length ; i++){
    this.itemsName.push(this.chartData[i]['name']);
  }
  for(var i=0 ; i< this.chartData.length ; i++){
    this.itemsValue.push(this.chartData[i]['value']);
   let color=  this.generateColors();
   this.barChartColors[0].backgroundColor.push(color);
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
generateColors() {
  var r = Math.floor(Math.random() * 255);
  var g = Math.floor(Math.random() * 255);
  var b = Math.floor(Math.random() * 255);
  return "rgb(" + r + "," + g + "," + b + ")" as never;
};
barChartColors = [
  {
    backgroundColor: []
  },
];
}