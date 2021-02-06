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
    this.selectedItemStocks=[];
    this.selectedItemSales=[];

    var values:any=_.filter(this.itemInBranches,v=>v["Item Code"]==itemCode && v['Branch Code']==branchCode);
    this.selectedItemStocks.push({name:values[0]['Branch Name'],value:values[0]["Stock Value"]})
    debugger;
    this.selectedItemSales.push({name:values[0]['Branch Name'],value:values[0]["Sales Value"]})

    console.log("ItemStocks",this.selectedItemStocks);
    console.log("ItemValues",this.selectedItemSales);

  }
}
