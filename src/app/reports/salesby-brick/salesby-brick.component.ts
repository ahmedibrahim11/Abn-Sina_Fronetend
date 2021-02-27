import { Component, OnInit, Input } from '@angular/core';
import { FileService } from 'src/app/core/file.Service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import * as XLSX from 'xlsx';
import * as _ from 'lodash';
import { uniqBy } from 'lodash';

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
  dataWithoutItemName: any = [];

  itemsDropDownMenu: any = [];
  selectedItem: any = '';
  selectedBrick: any = '';

  // public showProductCountryInfo(index, productId) {
  //   this._productService.countryInfo(productId).subscribe((res: any) => {
  //     this.productCountryInformation[index] = res;
  //   });
  //   this.hideme[index] = !this.hideme[index];
  //   this.Index = index;
  // }

  bricksDropDownMenu: any = [];
  specificItemBricks: any = [];
  brickFilter: any = false;

  removeItems() {
    location.reload();
  }
  openScrollableContent(longContent: any, row: any, i: any) {
    if (row !== 0) this.collapsedCheck(row, i);
    this.modalService.open(longContent, { scrollable: true });
  }

  filterBricks() {
    this.bricksDropDownMenu = _.uniqBy(this.data, 'Brick Name');
  }

  checkBricks(selectedItem: any) {
    this.specificItemBricks = this.dataGrouped.filter((item: any) => {
      return item['Brick Name'] === selectedItem['Brick Name'];
    });
  }
  getBricks(DDLBrickName: any) {
    this.checkBricks(this.selectedBrick);
    this.openScrollableContent(DDLBrickName, 0, 0);

    this.specificItemBricks = this.dataGrouped.filter((item: any) => {
      return item['Brick Name'] === this.selectedBrick['Brick Name'];
    });
    console.log('speeeeeeec', this.specificItemBricks);
  }
  itemNameDropDown: any = [];
  getItems(item: any, DDLItemName: any) {
    this.openScrollableContent(DDLItemName, 0, 0);
    console.log('ahoooooo', item.__rowNum__);
    this.getSpecificItemData(this.selectedItem, item.__rowNum__);
    this.itemNameDropDown = this.dataGrouped.filter((item: any) => {
      return item['Item Name'] === this.selectedItem['Item Name'];
    });
  }
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
    console.log(this.hideme[i]);
    this.getSpecificItemData(e, i);

    if (!this.isCollapsed) {
      this.isCollapsed = true;
      this.brickFilter = true;
    } else {
      this.isCollapsed = false;
      this.brickFilter = false;
    }
  }

  separateWithItemName: any = [];
  separateWithoutItemName: any = [];

  getUniqueItems() {
    this.separateWithItemName = _.filter(this.tableData, (item: any) => {
      return item['Item Name'];
    });
    this.separateWithItemName = _.uniqBy(
      this.separateWithItemName,
      'Item Name'
    );
  }

  checkItems() {
    let dict = new Map();
    let date = '';
    let suppCode = '';
    let supperName = '';
    let itemCode = '';
    let itemName = '';
    let dataGroup: any = [];
    this.tableData.forEach((element: any) => {
      debugger;
      if (Object.keys(element).includes('Item Name')) {
        debugger;
        if (itemName === element['Item Name']) {
          dataGroup.push(element);
        } else {
          var firstItem: any = {};
          firstItem['date'] = element['Date'];
          firstItem['Supp Code'] = element['Supp Code'];
          firstItem['Supp Name'] = element['Supp Name'];
          firstItem['Item Code'] = element['Item Code'];
          firstItem['Item Name'] = element['Item Name'];
          firstItem['Brick'] = element['Brick'];
          firstItem['Brick Name'] = element['Brick Name'];
          firstItem['total'] = element['Total Qty'];
          dataGroup.push(firstItem);
          date = element['Date'];
          suppCode = element['Supp Code'];
          supperName = element['Supp Name'];
          itemCode = element['Item Code'];
          itemName = element['Item Name'];
          dict.set(element['Item Name'], dataGroup);
          dataGroup = [];
        }
      } else {
        debugger;
        var object: any = {};
        object['date'] = date;
        object['Supp Code'] = suppCode;
        object['Supp Name'] = supperName;
        object['Item Code'] = itemCode;
        object['Item Name'] = itemName;
        object['Brick'] = element['Brick'];
        object['Brick Name'] = element['Brick Name'];
        object['Total Qty'] = element['Total Qty'];
        var valeues = dict.get(itemName);
        valeues.push(object);
      }
    });
    console.log('aaaaa', dict);
  }

  dataGrouped: any = [];
  getSpecificItemData(selectedValue: any, i: any) {
    this.dataGrouped = [];
    let itemName = selectedValue['Item Name'];
    let itemCode = selectedValue['Item Code'];
    debugger;

    let startIndex = this.tableData.findIndex(
      (x: any) => x['Item Name'] === selectedValue['Item Name']
    );
    debugger;

    for (let index = startIndex + 1; index < this.tableData.length; index++) {
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
          itemName = item['Item Name'];
          this.dataGrouped.push(item);
          this.checkBricks(selectedValue);
        } else {
          break;
        }
      } else {
        debugger;
        var object: any = {};
        object['Item Code'] = itemCode;
        object['Item Name'] = itemName;
        object['Brick'] = item['Brick'];
        object['Brick Name'] = item['Brick Name'];
        object['Total Qty'] = item['Total Qty'];
        this.dataGrouped.push(object);
        console.log('hna', this.dataGrouped);
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

  closeResult: any;

  getTableData() {
    this.tableData = _.map(this.data, function (item: any) {
      return item;
    });
  }

  objectKeys(obj: any) {
    return Object.keys(obj);
  }

  filterItems() {
    this.itemsDropDownMenu = _.uniqBy(this.data, 'Item Name');
  }
  constructor(
    private _fileService: FileService,
    private modalService: NgbModal
  ) {}

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

      this.filterItems();
      this.filterBricks();

      this.getAllCardsValue('Item Name');
      this.getAllCardsValue('Brick');
      this.getAllCardsValue('Total Qty');
      this.getTableData();
      this.getUniqueItems();
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
