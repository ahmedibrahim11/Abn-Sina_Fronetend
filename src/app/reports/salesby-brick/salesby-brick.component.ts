import { Component, OnInit, Input } from '@angular/core';
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

  hideme: any[] = [];
  isCollapsed = false;
  tableData: any = [];
  page: any = 1;
  pageSize: any = 10;
  collectionSize: any;
  dataPagination: any = [];
  dataWithItemName: any = [];
  dataWithoutItemName: any = [];

  // public showProductCountryInfo(index, productId) {
  //   this._productService.countryInfo(productId).subscribe((res: any) => {
  //     this.productCountryInformation[index] = res;
  //   });
  //   this.hideme[index] = !this.hideme[index];
  //   this.Index = index;
  // }
  refreshData() {
    this.dataPagination = this.separateWithItemName
      .map((item: any, i: any) => ({
        ...item,
      }))
      .slice(
        (this.page - 1) * this.pageSize,
        (this.page - 1) * this.pageSize + this.pageSize
      );
  }

  collapsedCheck(e: any, i: number) {
    debugger;
    this.hideme[i] = !this.hideme[i];

    this.getSpecificItemData(e, i);
    if (!this.isCollapsed) this.isCollapsed = true;
    else {
      this.isCollapsed = false;
    }
  }

  separateWithItemName: any = [];
  separateWithoutItemName: any = [];

  checkItems() {
    _.map(this.tableData, (item) => {
      if (item['Item Name'] === undefined) {
        this.separateWithoutItemName.push(item);
      } else {
        this.separateWithItemName.push(item);
      }
    });
    console.log('without', this.separateWithoutItemName);
    this.separateWithItemName = _.uniqBy(
      this.separateWithItemName,
      (item: any) => {
        return item['Item Name'];
      }
    );
  }

  dataGrouped: any = [];
  getSpecificItemData(selectedValue: any, i: any) {
    this.dataGrouped=[]
    let itemName = selectedValue['Item Name'];
    let itemCode = selectedValue['item Code'];
    debugger;

    let startIndex=this.tableData.findIndex((x:any) => x['Item Name']=== selectedValue['Item Name']);
    debugger;

    for (let index = startIndex; index < this.tableData.length; index++) {
      const item = this.tableData[index];
      debugger;
      if (Object.keys(item).includes('Item Name')) {
        debugger;
        var x = item['Item Name'].replaceAll(/\s/g, '');
        debugger;

        if (
          item['Item Name'].replaceAll(/\s/g, '') ===
          itemName.replaceAll(/\s/g, '')
        ) {
          itemCode = item['item Code'];
          this.dataGrouped.push(item);
        } else {
          break;
        }
      } else {
        debugger;
        var object: any = {};
        object['item Code'] = itemCode;
        object['Brick Name'] = item['Brick Name'];
        object['Total Qty'] = item['Total Qty'];
        this.dataGrouped.push(object);
      }
    }
    console.log('a7aaaa', this.dataGrouped);
  }

  branchesName: any;
  totalItems: any = [];
  totalBricks: any = [];
  totalQuantity: any = [];

  selectedChart = '';
  selectedChart2 = '';

  getTableData() {
    this.tableData = _.map(this.data, function (item: any) {
      return item;
    });
    console.log('tableData', this.tableData);
  }

  objectKeys(obj: any) {
    return Object.keys(obj);
  }
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
      this.getTableData();

      this.checkItems();
      this.refreshData();
      this.collectionSize = this.separateWithItemName.length;
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
        this.totalQuantity = sum[sum.length - 1]
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        break;
    }
  }

  get_header_row(ws: any) {
    var range = XLSX.utils.decode_range(ws['!ref']);
    var C,
      R = range.s.r;
    /* walk every column in the range */
    for (C = 3; C <= range.e.c; ++C) {
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
