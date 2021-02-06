import { Component, Input, OnInit } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-sales-and-stocks-item',
  templateUrl: './sales-and-stocks-item.component.html',
  styleUrls: ['./sales-and-stocks-item.component.css']
})
export class SalesAndStocksItemComponent implements OnInit {
  @Input()  data:any=[];
  constructor() { }
  selectedItemBranches: any = [];
  selectedItemStocks: any = [];
  selectedItemSales: any = [];
  selectedStockSales: any;
  selectedBarBieChart: any;
  allItemData: any = [];
  selectedItem: any;
  selectedBranch:any;
  statisticsHeader = 'Item stock and sales values';
  itemsName: any = [];
  itemInBranches:any=[];
  ngOnInit(): void {
    this.selectedStockSales = 'stock';
    this.selectedBarBieChart = 'bar';
    this.itemsName = _.uniq(
      _.map(this.data, (item) => {
       return item['Item name'];
      })
    );
    console.log("ittteeeeeeee",this.itemsName);
  }
  
  handleStockOrSalesChange(event: any) {
    if (event.currentTarget.value==='stock') {
      this.selectedStockSales = 'stock';
    } else {
      this.selectedStockSales = 'sales';
    }
  }
 
  handleChartChange(event: any) {
    
    if (event.currentTarget.value==='BarChart') {
      this.selectedBarBieChart = 'bar';
    } else {
      this.selectedBarBieChart = 'pie';
    }
  }

  getBranchesByItem(item:any)
  {
      this.itemInBranches=_.filter(this.data,b=>b["Item name"]===item);

    console.log("item BRanches",this.itemInBranches);
  }

  selectItemChange(item:any) {
    console.log("iteeem",item);
    this.selectedItemStocks=[];
    this.getSelectedItemData(this.selectedItem);
    this.getBranchesByItem(item);
    // this.getSelectedItemBranches(this.allItemData);
 
  }
  getSelectedItemData(selectedItemName: any) {
    this.allItemData = _.filter(this.data, function (item) {
      return item['Item name'] === selectedItemName;
    });
  }
  getSelectedItemBranches(itemData: any) {
    this.selectedItemBranches = _.uniq(
      _.map(itemData, (item) => {
        return item['Branch Name'];
      })
    );
    this.selectedItemStocks = _.uniq(
      _.map(itemData, (item) => {
        return {name:item['Stock'],value:item['Stock Value']};
      })
    );
    this.selectedItemSales = _.uniq(
      _.map(itemData, (item) => {
        return {name:item['Stock Value'],value:item['Stock Value']};

      })
    );
  }
}
