import { ThrowStmt } from '@angular/compiler';
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

    this.itemsName=_.uniqBy(this.data,"Item name");
    console.log("itemsName",this.itemsName);
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
      this.itemInBranches=_.filter(this.data,b=>b["Item Code"]===item['Item Code']);
      console.log("item BRanches",this.itemInBranches);
  }

  selectItemChange(item:any) {
    debugger;
    console.log("iteeem",item);
    this.getBranchesByItem(item);
 
  }
  selectBranch(branch:any){
      console.log("branch",branch['Branch Code']);
      this.getStockBranchVaules(this.selectedItem['Item Code'],branch['Branch Code'])
  }

  getStockBranchVaules(itemCode:any,branchCode:any){
    debugger;
    var values=_.filter(this.itemInBranches,v=>v["Item Code"]==itemCode && v['Branch Code']==branchCode)
    debugger;
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
