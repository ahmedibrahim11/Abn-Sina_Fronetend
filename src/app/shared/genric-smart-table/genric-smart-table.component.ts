import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import * as XLSX from 'xlsx';
import * as _ from 'lodash';
import { includes } from 'lodash';

@Component({
  selector: 'app-genric-smart-table',
  templateUrl: './genric-smart-table.component.html',
  styleUrls: ['./genric-smart-table.component.css'],
})
export class GenricSmartTableComponent implements OnInit {
  @Input() data: any = [];
  @Input() headers: any[] = [];

  ngOnInit(): void {
    this.ceateTableHeaders();
  }

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
    let list: any[] = [];
    _.uniq(
      _.map(this.data, (item) => {
        if (list.find((s) => s.title === item[key]) === undefined) {
          if (item[key] !== '') {
            list.push({ value: item[key], title: item[key] });
          }
        }
      })
    );

    return list;
  }

  ceateTableHeaders() {
    this.headers.forEach((column) => {
      if (column.filter) {
        this.settings.columns[column.name] = {
          title: column.title,
          filter: {
            type: 'list',
            config: {
              selectText: 'Select',
              list: this.tableFilters(column.name),
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
