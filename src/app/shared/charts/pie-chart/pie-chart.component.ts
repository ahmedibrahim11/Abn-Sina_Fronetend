import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import { Input } from '@angular/core';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit{

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
        label: function (tooltipItems:any, data:any) {
          return data.datasets[0].data[tooltipItems.index] + ' %';
        }
      }
    },
  };

  pieChartLabels: Label[] = this.itemsName;

  pieChartData: any[] = this.itemsCode;

  pieChartType: ChartType = 'pie';

  pieChartLegend = true;

  pieChartPlugins = [];

  pieChartColors = [
    {
      backgroundColor: ['rgba(255,0,0,0.3)', 'rgba(0,255,0,0.3)', 'rgba(0,0,255,0.3)'],
    },
  ];
}