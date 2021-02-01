import { Component, Input, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';

@Component({
  selector: 'app-smart-table',
  templateUrl: './smart-table.component.html',
  styleUrls: ['./smart-table.component.css']
})
export class SmartTableComponent implements OnInit {
  @Input() data:any=[];
  @Input() headers:string[]=[];
  source: LocalDataSource = new LocalDataSource();
  url:string="controller/Action";
  settings:any = {
    actions:false,
    pager: {
      display: true,
      perPage: 10,
      pagging:true,
   
    },



    columns: {
    }

  }

  constructor() { 
    
    console.log(this.data);
  }

  ceateTableHeaders(){
    this.headers.forEach(columnname => {
      this.settings.columns[columnname] ={ title:columnname };

    });
    

  }

  ngOnInit(): void {
    this.source.load(this.data);

  }

  onSearch(query: string = '') {
let filterArr:any=[];
    this.headers.forEach(columnname => {
      filterArr.push({field:columnname,search:query});

    });
    this.source.setFilter(filterArr,false); 
    // second parameter specifying whether to perform 'AND' or 'OR' search 
    // (meaning all columns should contain search query or at least one)
    // 'AND' by default, so changing to 'OR' by setting false here
  }

}
