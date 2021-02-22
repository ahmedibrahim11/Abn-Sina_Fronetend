import { Component, OnInit, Input } from '@angular/core';
import { FileService } from 'src/app/core/file.Service';

import * as XLSX from 'xlsx';
import * as _ from 'lodash';
import { Cell } from 'ng2-smart-table';

@Component({
  selector: 'app-salesby-brick',
  templateUrl: './salesby-brick.component.html',
  styleUrls: ['./salesby-brick.component.css'],
})
export class SalesbyBrickComponent implements OnInit {
  url: string = 'assets/files/brick';
  data: any[] = [];
  tableHeaders: any[] = [];
  loader = true;




  branchesName: any;
  totalItems: any = [];
  totalBricks: any = [];
  totalQuantity: any = [];

  selectedChart = '';
  selectedChart2 = '';

  constructor(private _fileService: FileService) { }

  ngOnInit(): void {
    this.getExelfile();
  }

  getExelfile() {
    let file = { fileName: 'brick.xlsx', reportType: 'brick' };
    this._fileService.downloadFile(file.fileName, this.url).subscribe({
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

  delete_row(ws: any, row_index: any) {
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
      this.delete_row(ws, 0);
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
        let uniqueData = _.uniqBy(this.data, key);

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
        this.totalQuantity = sum[sum.length - 1].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        break;
    }
  }

  get_header_row(ws: any) {
    debugger;
    var range = XLSX.utils.decode_range(ws['!ref']);
    var C,
      R = range.s.r;
    /* walk every column in the range */
    for (C = range.s.c; C <= range.e.c; ++C) {
      var cell = ws[XLSX.utils.encode_cell({ c: C, r: R })];
      debugger;
      if (cell === undefined) {
        break;
      }
      else {
        var hdr = 'UNKNOWN ' + C;
        if (cell && cell.t) hdr = XLSX.utils.format_cell(cell);
        if (hdr.search("Brick Name") != -1) {
          this.tableHeaders.push({ name: hdr, title: hdr, filter: true });
        }
        else {
          this.tableHeaders.push({ name: hdr, title: hdr, filter: false });
        } 
      }

    }
    return this.tableHeaders;
  }
}
