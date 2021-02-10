import { ThrowStmt } from '@angular/compiler';
import { Component, Input, OnInit } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-sales-and-stocks-item',
  templateUrl: './sales-and-stocks-item.component.html',
  styleUrls: ['./sales-and-stocks-item.component.css']
})
export class SalesAndStocksItemComponent implements OnInit {
  @Input() data: any = [];
  top7BrnachesStock: any = [];
  top7BrnachesSales: any = [];
  selectedItemStocksQty: any[] = [];
  selectedItemSalesQty: any[] = [];

  selectedItemStocks: any = [];
  selectedItemSales: any = [];
  selectedvalQty: any;

  stockChartHeader = ' Stock Values';
  salesChartHeader = ' Sales Values';

  itemsDropDownMenu: any = [];
  selectedItem: any;
  chartType: any;

  constructor() { }

  ngOnInit(): void {
    this.selectedvalQty = 'val';
    this.chartType = 'bar';
    this.itemsDropDownMenu = _.uniqBy(this.data, "Item name");
    console.log("dropDownMenu", this.itemsDropDownMenu);
  }

  changeValueQuantity(e: any) {
    debugger;
    if (e.target.value === 'val') {
      this.selectedvalQty = 'val';
    }
    else {
      this.selectedvalQty = 'qty';
      this.stockChartHeader = ' Stock Quantites';
      this.salesChartHeader = ' Sales Quantites';
    }
  }


  changeType(e: any) {
   
    if (e.target.value === 'bar') {
      this.chartType = 'bar';
    }
    else {
      this.chartType = 'pie';
    }
  }

  getSalesValues(itemCode: Number) {
    
    let allbranchesSales = [];
    let dataGroupedByBranch = _.groupBy(this.data, 'Branch Name');
    for (let key in dataGroupedByBranch) {
      if (key) {
        let branch = { name: key, value: 0, qty: 0 };
        let values: number[] = [];
        let qty: number[] = [];
        dataGroupedByBranch[key].filter(s => s['Item Code'] === itemCode).forEach((elm: any) => {
          values.push(elm['Sales Value']);
          qty.push(elm['Sales Qty']);
        });
        branch.value = _.sum(values);
        branch.qty = _.sum(qty);
        allbranchesSales.push(branch);
      }
    }
    this.top7BrnachesSales = _.orderBy(allbranchesSales, 'value')
      .reverse()
      .slice(0, 7);
    this.top7BrnachesSales.forEach((branch: any) => {
      let row = { name: branch.name, value: branch.value };
      let qrow = { name: branch.name, value: branch.qty };
      this.selectedItemSales.push(row);
      this.selectedItemSalesQty.push(qrow);
     

    })

  }

  getStockValues(itemCode: Number) {
  
    let allbranches = [];
    let dataGroupedByBranch = _.groupBy(this.data, 'Branch Name');
    for (let key in dataGroupedByBranch) {
      if (key) {
        let branch = { name: key, value: 0 };
        let values: number[] = [];
        let qty: number[] = [];
        dataGroupedByBranch[key].filter(s => s['Item Code'] === itemCode).forEach((elm: any) => {
          values.push(elm['Stock Value']);
          qty.push(elm['Stock']);
        });
        branch.value = _.sum(values);
        allbranches.push(branch);
      }
    }
    this.top7BrnachesStock = _.orderBy(allbranches, 'value')
      .reverse()
      .slice(0, 7);
    this.top7BrnachesStock.forEach((branch: any) => {
      let row = { name: branch.name, value: branch.value };
      let qrow = { name: branch.name, value: branch.value };
      this.selectedItemStocks.push(row);
      this.selectedItemStocksQty.push(qrow);
    })

  }

  selectItemChange(item: any) {
    this.selectedItemStocks = [];
    this.selectedItemSales = [];
    this.selectedItemStocksQty = [];
    this.selectedItemSalesQty = [];
    this.getStockValues(item['Item Code']);
    this.getSalesValues(item['Item Code']);
  }
}
