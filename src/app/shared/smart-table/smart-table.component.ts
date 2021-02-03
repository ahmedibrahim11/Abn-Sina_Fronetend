import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';

@Component({
  selector: 'app-smart-table',
  templateUrl: './smart-table.component.html',
  styleUrls: ['./smart-table.component.css']
})
export class SmartTableComponent implements OnInit {
  @Input() data: any = [];
  @Input() headers: any[] = [];
  source: LocalDataSource = new LocalDataSource();

  settings: any = {
    actions: false,
    pager: {
      display: true,
      perPage: 5,
      pagging: true,
    },

    columns: {
    }

  }

  constructor() {

  }

  ceateTableHeaders() {
    this.headers.forEach(column => {
      if (column.name === "Item Code" || column.name === "Item name" || column.name === "Branch Code" || column.name === "Branch Name" ) {
        this.settings.columns[column.name] = { title: column.title };
      }
      else {
        this.settings.columns[column.name] = { title: column.title, filter: false };
      }
    });
    this.source.load(this.data);
    console.log("thisData", this.data);
  }

  ngOnInit(): void {
    this.ceateTableHeaders();
  }

  onSearch(query: string = '') {
    let filterArr: any = [];
    this.headers.forEach(columnname => {
      filterArr.push({ field: columnname, search: query });

    });
    this.source.setFilter(filterArr, false);
  }

}
