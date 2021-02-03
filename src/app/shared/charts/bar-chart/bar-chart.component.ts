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
    itemsName : any = [];
    itemsCode : any = [];

  ngOnInit(): void {
    for(var i=0 ; i< this.chartData.length ; i++){
      this.itemsName.push(this.chartData[i]['Item name']);
    }
    for(var i=0 ; i< this.chartData.length ; i++){
      this.itemsCode.push(this.chartData[i]['Item Code']);
    }
    console.log(this.itemsCode)
  }

  barChartOptions: ChartOptions = {
    responsive: true,
    scales: { xAxes: [{}], yAxes: [{}] },
  };
  barChartLabels: Label[] = this.itemsName;
  barChartType: ChartType = 'bar';
  barChartLegend = false;
  barChartPlugins = [];

  barChartData: ChartDataSets[] = [
    { data: this.itemsCode},
  
  ];

}