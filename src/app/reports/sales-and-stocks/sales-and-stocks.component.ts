import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { FileService } from 'src/app/core/file.Service';
@Component({
  selector: 'app-sales-and-stocks',
  templateUrl: './sales-and-stocks.component.html',
  styleUrls: ['./sales-and-stocks.component.css']
})
export class SalesAndStocksComponent implements OnInit {
 
  settings:any;
  source: LocalDataSource = new LocalDataSource();
   url:string="controller/Action";
  constructor(private _fileService:FileService) { }

  ngOnInit(): void {
  }
  extractDataFromExcel(file:any){}
  getExelfile(){
    this._fileService.downloadFile("",this.url).subscribe(
      {
        next:(res)=>{
          this.extractDataFromExcel(res);

        },
    
        error:(err)=>{console.log(err)},
    }
      


    )
  }

 

  loadTableSettings() {
    this.settings = {
      columns: {

        column1: {
          title: "name1",
          type: 'string',
          filter: true
        },
        column2: {
          title: "name2",
          type: 'string',
          filter: false
        },
      }
    
  }
    
  }

}
