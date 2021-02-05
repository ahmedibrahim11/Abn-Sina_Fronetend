import { Component, OnInit } from '@angular/core';
import { FileService } from 'src/app/core/file.Service';
import * as XLSX from 'xlsx';

import * as _ from 'lodash';
@Component({
  selector: 'app-sales-and-stocks',
  templateUrl: './sales-and-stocks.component.html',
  styleUrls: ['./sales-and-stocks.component.css'],
})
export class SalesAndStocksComponent implements OnInit {
  url: string = 'Report/downloadFile';

  data: any[] = [];
  tableHeaders: any[] = [];
  itemsName: any = [];
  selectedStockSales: any;
  selectedBarBieChart: any;
  allItemData: any = [];
  selectedItemBranches: any = [];
  selectedItemStocks: any = [];
  selectedItemSales: any = [];
  selectedItem: any;
  branchesName: any;
  itemsCode: any = [];
  branchesCode: any = [];
  totalSales: any = [];
  totalStocks: any = [];
  top7Brnaches: any = [];
  bieChartHeader = 'Most Top 7 Sales Branches';
  statisticsHeader = 'Item stock and sales values';
  chartType = '';
  selectedChart = '';
  selectedChart2 = '';

  constructor(private _fileService: FileService) {}

  ngOnInit(): void {
    this.getExelfile();
  }

  getExelfile() {
    this._fileService.downloadFile('testExcel.xlsx', this.url).subscribe({
      next: (res) => {
        this.extractDataFromExcel(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  extractDataFromExcel(file: any) {
    /* wire up file reader */
    const reader: FileReader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (e: any) => {
      /* create workbook */
      const binarystr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });
      /* selected the first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      this.get_header_row(ws);
      /* save data */
      this.data = XLSX.utils.sheet_to_json(ws);
      this.chartType = 'BarChart';
      this.selectedChart = 'BarChart';
      this.selectedChart2 = 'BarChart';
      this.selectedStockSales = 'stock';
      this.selectedBarBieChart = 'bar';
      this.getAllCardsValue('Item Code');
      this.getAllCardsValue('Item name');
      this.getAllCardsValue('Branch Code');
      this.getAllCardsValue('Sales Value');
      this.getAllCardsValue('Stock');
      this.getSalesBranches();
    };
  }

  getSalesBranches() {
    let allbranchesSales = [];

    let dataGroupedByBranch = _.groupBy(this.data, 'Branch Name');
    console.log('names', dataGroupedByBranch);
    for (let key in dataGroupedByBranch) {
      if (key) {
        let branch = { name: key, value: 0 };
        let values: number[] = [];
        dataGroupedByBranch[key].forEach((elm: any) => {
          values.push(elm['Sales Value']);
        });
        branch.value = _.sum(values);

        allbranchesSales.push(branch);
      }
    }
    this.top7Brnaches = _.orderBy(allbranchesSales, 'value')
      .reverse()
      .slice(0, 7);
    console.log(this.top7Brnaches);
  }

  getAllCardsValue(key: any) {
    switch (key) {
      case 'Item Code':
        _.map(this.data, (item) => {
          this.itemsCode += _.sum(item[key]);
        });
        break;
      case 'Branch Code':
        var branches = _.uniq(
          _.map(this.data, (item) => {
            return item[key];
          })
        );

        this.branchesCode = branches;

        break;
      case 'Sales Value':
        var salesValue = _.map(this.data, (item: any) => {
          return item[key];
        });
        this.totalSales = _.sum(salesValue);
        break;

      case 'Stock':
        var stocks = _.map(this.data, (item: any) => {
          return item[key];
        });
        this.totalStocks = _.sum(stocks);
        break;
      case 'Item name':
        this.itemsName = _.uniq(
          _.map(this.data, (item) => {
            return item[key];
          })
        );
    }
  }

  handleStockChange(evt: any) {
    var target = evt.target;
    if (target.checked) {
      this.selectedStockSales = 'stock';
    } else {
      this.selectedStockSales = 'sales';
    }
    console.log(this.selectedStockSales);
  }
  handleSalesChange(evt: any) {
    var target = evt.target;
    if (target.checked) {
      this.selectedStockSales = 'sales';
    } else {
      this.selectedStockSales = 'stock';
    }
    console.log(this.selectedStockSales);
  }
  handleBarChange(evt: any) {
    var target = evt.target;
    if (target.checked) {
      this.selectedBarBieChart = 'bar';
    } else {
      this.selectedBarBieChart = 'pie';
    }
    console.log(this.selectedBarBieChart);
  }
  handlePieChange(evt: any) {
    var target = evt.target;
    if (target.checked) {
      this.selectedBarBieChart = 'pie';
    } else {
      this.selectedBarBieChart = 'bar';
    }
    console.log(this.selectedBarBieChart);
  }

  selected() {
    this.getSelectedItemData(this.selectedItem);
    this.getSelectedItemBranches(this.allItemData);
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
        return item['Stock Value'];
      })
    );
    this.selectedItemSales = _.uniq(
      _.map(itemData, (item) => {
        return item['Sales Value'];
      })
    );
    console.log(this.selectedItemStocks);
    console.log(this.selectedItemSales);
  }

  get_header_row(ws: any) {
    var range = XLSX.utils.decode_range(ws['!ref']);
    var C,
      R = range.s.r;
    /* walk every column in the range */
    for (C = range.s.c; C <= range.e.c; ++C) {
      var cell = ws[XLSX.utils.encode_cell({ c: C, r: R })];
      /* find the cell in the first row */
      var hdr = 'UNKNOWN ' + C; // <-- replace with your desired default
      if (cell && cell.t) hdr = XLSX.utils.format_cell(cell);
      this.tableHeaders.push({ name: hdr, title: hdr });
    }
    debugger;
    return this.tableHeaders;
  }
}
