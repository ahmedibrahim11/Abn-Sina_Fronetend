import { Component, OnInit } from '@angular/core';
import { FileService } from 'src/app/core/file.Service';

import * as XLSX from 'xlsx';
import * as _ from 'lodash';

@Component({
  selector: 'app-salesby-brick',
  templateUrl: './salesby-brick.component.html',
  styleUrls: ['./salesby-brick.component.css'],
})
export class SalesbyBrickComponent implements OnInit {
  url: string = 'Report/downloadFile';
  data: any[] = [];
  tableHeaders: any[] = [];
  loader = true;

  branchesName: any;
  totalItems: any = [];
  totalBricks: any = [];
  totalQuantity: any = [];

  selectedChart = '';
  selectedChart2 = '';

  constructor(private _fileService: FileService) {}

  ngOnInit(): void {
    this.getExelfile();
  }

  getExelfile() {
    let file = { fileName: 'testBrick.xlsx', reportType: 'brick' };
    this._fileService.downloadFile(file, this.url).subscribe({
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
      this.selectedChart = 'BarChart';
      this.selectedChart2 = 'BarChart';

      this.getAllCardsValue('Item Name');
      this.getAllCardsValue('Brick');
      this.getAllCardsValue('Total Qty');

      this.loader = false;
    };
  }

  getAllCardsValue(key: any) {
    switch (key) {
      case 'Item Name':
          let uniqueData=_.uniqBy(this.data,key);
      
          _.map(uniqueData, (item) => {
            this.totalItems += _.sum(item[key]);
          });
        break;
      case 'Brick':
        var bricks = _.uniq(
          _.map(this.data, (item) => {
            return item[key];
          })
        );

        this.totalBricks = bricks;

        break;
      case 'Total Qty':
        var sum = _.map(this.data, (item) => {
          return item[key];
        });
        this.totalQuantity = sum[sum.length - 1];
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
      if (
        hdr.search('Item Name') !== -1 ||
        hdr.search('Item name') !== -1 ||
        hdr.search('Branch') !== -1 ||
        hdr.search('Brick Name') !== -1
      ) {
        this.tableHeaders.push({ name: hdr, title: hdr, filter: true });
      } else {
        this.tableHeaders.push({ name: hdr, title: hdr, filter: false });
      }
    }
    return this.tableHeaders;
  }
}
