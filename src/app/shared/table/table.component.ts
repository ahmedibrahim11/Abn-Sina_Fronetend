import { Component, PipeTransform, Input, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormControl } from '@angular/forms';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import * as _ from 'lodash';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements OnInit {
  @Input() formControl: any = [];
  @Input() data: any = [];
  @Input() headers: any = [];
  tableHeaders: any = [];
  tableData: any = [];

  page: any = 1;
  pageSize: any = 10;
  collectionSize: any;

  ngOnInit(): void {
    this.getTableHeader();
    this.getTableData();
    this.collectionSize = this.tableData.length;
    this.refreshData();
    this.itemsDropDownMenu = _.uniqBy(this.data, 'Item name');
  }

  constructor(pipe: DecimalPipe) {}

  dataPagination: any = [];
  itemsDropDownMenu: any = [];
  selectedItem: any = 'Choose Item';
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
  getTableHeader() {
    this.tableHeaders = Object.keys(this.data[0]);
  }

  getTableData() {
    this.tableData = _.map(this.data, function (item: any) {
      return Object.values(item);
    });
  }

  getValues() {
    this.dataPagination = this.tableData.filter((item: any) => {
      console.log('item', item);
      return item[4] === this.selectedItem['Item name'];
    });
  }
}