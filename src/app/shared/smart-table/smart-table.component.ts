import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import * as XLSX from 'xlsx';
import * as _ from 'lodash';
import { listLazyRoutes } from '@angular/compiler/src/aot/lazy_routes';

@Component({
  selector: 'app-smart-table',
  templateUrl: './smart-table.component.html',
  styleUrls: ['./smart-table.component.css'],
})
export class SmartTableComponent implements OnInit {
  @Input() data: any = [];
  @Input() headers: any[] = [];

  itemsCode: any = [];
  itemsName: any = [];
  branchCode: any = [];
  branchName: any = [];

  source: LocalDataSource = new LocalDataSource();

  settings: any = {
    actions: false,
    pager: {
      display: true,
      perPage: 20,
      pagging: true,
    },

    columns: {},
  };

  constructor() {}

  tableFilters(key: any) {
    switch (key) {
      case 'Item Code':
        this.itemsCode = _.uniq(
          _.map(this.data, (item) => {
            return item[key];
          })
        );
        break;
      case 'Item name':
        this.itemsName = _.uniq(
          _.map(this.data, (item) => {
            return item[key];
          })
        );
        break;
      case 'Branch Code':
        this.branchCode = _.uniq(
          _.map(this.data, (item) => {
            return item[key];
          })
        );
        break;

      case 'Branch Name':
        this.branchName = _.uniq(
          _.map(this.data, (item) => {
            return item[key];
          })
        );
        break;
    }
  }

  codeList: any = [{ value: '', title: '' }];
  nameList: any = [{ value: '', title: '' }];
  branchCodeList: any = [{ value: '', title: '' }];
  branchNameList: any = [{ value: '', title: '' }];

  createListData(list: any) {
    if (list === this.itemsCode) {
      for (var i = 0; i < list.length; i++) {
        this.codeList.push({ value: list[i], title: list[i] });
      }
      return this.codeList;
    } else if (list === this.itemsName) {
      for (var i = 0; i < list.length; i++) {
        this.nameList.push({ value: list[i], title: list[i] });
      }
      return this.nameList;
    } else if (list === this.branchCode) {
      for (var i = 0; i < list.length; i++) {
        this.branchCodeList.push({ value: list[i], title: list[i] });
      }
      return this.branchCodeList;
    } else if (list === this.branchName) {
      for (var i = 0; i < list.length; i++) {
        this.branchNameList.push({ value: list[i], title: list[i] });
      }
      return this.branchNameList;
    }
  }

  ceateTableHeaders() {
    this.headers.forEach((column) => {
      if (column.name === 'Item Code') {
        this.tableFilters('Item Code');
        this.itemsCode = this.createListData(this.itemsCode);
        this.settings.columns[column.name] = {
          title: column.title,
          filter: {
            type: 'list',
            config: {
              selectText: 'Select',
              list: this.itemsCode,
            },
          },
        };
      } else if (column.name === 'Item name') {
        this.tableFilters('Item name');
        console.log('name', this.itemsName);
        this.itemsName = this.createListData(this.itemsName);
        console.log('name', this.itemsName);
        this.settings.columns[column.name] = {
          title: column.title,
          filter: {
            type: 'list',
            config: {
              selectText: 'Select',
              list: this.itemsName,
            },
          },
        };
      } else if (column.name === 'Branch Code') {
        this.tableFilters('Branch Code');
        this.branchCode = this.createListData(this.branchCode);
        this.settings.columns[column.name] = {
          title: column.title,
          filter: {
            type: 'list',
            config: {
              selectText: 'Select',
              list: this.branchCode,
            },
          },
        };
      } else if (column.name === 'Branch Name') {
        this.tableFilters('Branch Name');
        this.branchName = this.createListData(this.branchName);
        this.settings.columns[column.name] = {
          title: column.title,
          filter: {
            type: 'list',
            config: {
              selectText: 'Select',
              list: this.branchName,
            },
          },
        };
      } else {
        this.settings.columns[column.name] = {
          title: column.title,
          filter: false,
        };
      }
    });
    this.source.load(this.data);
  }

  ngOnInit(): void {
    this.ceateTableHeaders();
  }

  onSearch(query: string = '') {
    let filterArr: any = [];
    this.headers.forEach((columnname) => {
      filterArr.push({ field: columnname, search: query });
    });
    this.source.setFilter(filterArr, false);
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
