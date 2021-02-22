import { Component, PipeTransform, Input, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import * as _ from 'lodash';
import * as XLSX from 'xlsx';
import { of } from 'rxjs';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements OnInit {
  @Input() formControl: any = [];
  @Input() data: any = [];
  @Input() headers: any = [];
  @Input() selectedType: any = '';
  tableHeaders: any = [];
  tableData: any = [];
  page: any = 1;
  pageSize: any = 10;
  collectionSize: any;
  dataPagination: any = [];
  itemsDropDownMenu: any = [];
  branchesDropDownMenu: any = [];
  bricksDropDownMenu: any = [];
  selectedItem: any = '';
  selectedBranch: any = '';
  selectedBrick: any = ''
  refreshData() {
    this.dataPagination = this.tableData
      .map((item: any, i: any) => ({
        ...item,
      }))
      .slice(
        (this.page - 1) * this.pageSize,
        (this.page - 1) * this.pageSize + this.pageSize
      );
  }

  ngOnInit(): void {
    if (this.selectedType === "stock") {
      this.selectedItem = 'Choose Item';
      this.selectedBranch = 'Choose Branch';
      this.itemsDropDownMenu = _.uniqBy(this.data, 'Item name');
      this.branchesDropDownMenu = _.uniqBy(this.data, 'Branch Name');
    }
    else if (this.selectedType === 'client') {
      this.selectedItem = 'Choose Item';
      this.selectedBrick = 'Choose Brick';
      this.bricksDropDownMenu = _.uniqBy(this.data, 'brickName');
      this.itemsDropDownMenu = _.uniqBy(this.data, 'itemName');
      debugger;
    }
    this.getTableData();
    this.collectionSize = this.tableData.length;
    this.refreshData();
  }

  objectKeys(obj: any) {
    return Object.keys(obj);
  }

  constructor(pipe: DecimalPipe) { }


  getTableData() {
    this.tableData = _.map(this.data, function (item: any) {
      return item;
    });
    console.log("tableData", this.tableData);
  }

  getStockValues() {
    debugger;
    if (this.selectedBranch != 'Choose Branch' && this.selectedBranch != null) {
      if (this.selectedItem) {
        this.dataPagination = this.tableData.filter((item: any) => {
          console.log('item', item);
          return item['Item name'] === this.selectedItem['Item name'] && item['Branch Name'] === this.selectedBranch['Branch Name'];
        });
      }
      else {
        this.dataPagination = this.tableData.filter((item: any) => {
          console.log('item', item);
          return item['Branch Name'] === this.selectedBranch['Branch Name'];
        });
      }

    }
    else {
      if (this.selectedItem) {
        debugger;
        this.dataPagination = this.tableData.filter((item: any) => {
          console.log('item', item);
          return item['Item name'] === this.selectedItem['Item name'];
        });
      }
      else {
        debugger;
        this.refreshData();
      }
    }
  }
  getBranches() {
    debugger;
    if (this.selectedItem != 'Choose Item' && this.selectedItem != null) {
      if (this.selectedBranch) {
        this.dataPagination = this.tableData.filter((branch: any) => {
          console.log('branch', branch);
          return branch['Branch Name'] === this.selectedBranch['Branch Name'] && branch['Item name'] === this.selectedItem['Item name'];
        });
      }
      else {
        this.dataPagination = this.tableData.filter((branch: any) => {
          console.log('branch', branch);
          return branch['Item name'] === this.selectedItem['Item name'];
        });
      }

    }
    else {
      if (this.selectedBranch) {
        this.dataPagination = this.tableData.filter((branch: any) => {
          console.log('branch', branch);
          return branch['Branch Name'] === this.selectedBranch['Branch Name'];
        });
      }
      else {
        this.refreshData();
      }
    }
  }

  getBricks() {
    debugger;
    if (this.selectedItem != 'Choose Item' && this.selectedItem != null) {
      if (this.selectedBrick) {
        this.dataPagination = this.tableData.filter((branch: any) => {
          console.log('Brick', branch);
          return branch['brickName'] === this.selectedBrick['brickName'] && branch['itemName'] === this.selectedItem['itemName'];
        });
      }
      else {
        this.dataPagination = this.tableData.filter((branch: any) => {
          console.log('Brick', branch);
          return branch['itemName'] === this.selectedItem['itemName'];
        });
      }

    }
    else {
      if (this.selectedBrick) {
        this.dataPagination = this.tableData.filter((branch: any) => {
          console.log('Brick', branch);
          return branch['brickName'] === this.selectedBrick['brickName'];
        });
      }
      else {
        this.refreshData();
      }

    }

  }


  getCleintValues() {
    debugger;
    if (this.selectedBrick != 'Choose Brick' && this.selectedBrick != null) {
      if (this.selectedItem) {
        this.dataPagination = this.tableData.filter((item: any) => {
          console.log('item', item);
          return item['itemName'] === this.selectedItem['itemName'] && item['branchName'] === this.selectedBrick['branchName'];
        });
      }
      else {
        this.dataPagination = this.tableData.filter((item: any) => {
          console.log('item', item);
          return item['branchName'] === this.selectedBrick['branchName'];
        });
      }

    }
    else {
      if (this.selectedItem) {
        this.dataPagination = this.tableData.filter((item: any) => {
          console.log('item', item);
          return item['itemName'] === this.selectedItem['itemName'];
        });
      }
      else {
        this.refreshData();
      }

    }

  }


  exportoExcel(): void {
    /* pass here the table id */
    let element = document.getElementById('table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'Stocks.xlsx');
  }
}