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
  url: string = 'assets/files/stock';
  data: any[] = [];
  tableHeaders: any[] = [];
  loader = true;

  branchesName: any;
  totalItems: any = [];
  branchesCode: any = [];
  totalSales: any = [];
  totalStocks: any = [];

  selectedChart = '';
  selectedChart2 = '';

  constructor(private _fileService: FileService) { }

  ngOnInit(): void {
    this.getExelfile();
  }

  getExelfile() {
    let file = { fileName: 'stock.xlsx', reportType: 'stock' };
    this._fileService.downloadFile('stock.xlsx', this.url).subscribe({
      next: (res) => {
        this.extractDataFromExcel(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  ec(r: any, c: any) {
    return XLSX.utils.encode_cell({ r: r, c: c });
  }

  delete_row(ws:any, row_index:any) {
    var variable = XLSX.utils.decode_range(ws["!ref"])
    for (var R = row_index; R < variable.e.r; ++R) {
      for (var C = variable.s.c; C <= variable.e.c; ++C) {
        ws[this.ec(R, C)] = ws[this.ec(R + 1, C)];
      }
    }
    variable.e.r--
    ws['!ref'] = XLSX.utils.encode_range(variable.s, variable.e);
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
      this.delete_row(ws,0);
      this.get_header_row(ws);
      /* save data */
      this.data = XLSX.utils.sheet_to_json(ws);

      this.selectedChart = 'BarChart';
      this.selectedChart2 = 'BarChart';

      this.getAllCardsValue('Item Code');
      this.getAllCardsValue('Item name');
      this.getAllCardsValue('Branch Code');
      this.getAllCardsValue('Sales Value');
      this.getAllCardsValue('Stock');
      this.loader = false;
    };
  }

  getAllCardsValue(key: any) {
    switch (key) {
      case 'Item Code':
        let uniqueData = _.uniqBy(this.data, key);
        _.map(uniqueData, (item) => {
          this.totalItems += _.sum(item[key]);
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
        this.totalSales = salesValue[salesValue.length - 1]
          .toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        break;

      case 'Stock':
        var stocks = _.map(this.data, (item: any) => {
          return item[key];
        });
        this.totalStocks = stocks[stocks.length - 1].toFixed(2)
          .toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        break;
    }
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
    return this.tableHeaders;
  }
}
