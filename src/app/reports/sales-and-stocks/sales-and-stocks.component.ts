import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { FileService } from 'src/app/core/file.Service';
@Component({
  selector: 'app-sales-and-stocks',
  templateUrl: './sales-and-stocks.component.html',
  styleUrls: ['./sales-and-stocks.component.css']
})
export class SalesAndStocksComponent implements OnInit {
 

  source: LocalDataSource = new LocalDataSource();
   url:string="controller/Action";
   data = [
    {
      id: 1,
      name: "Leanne Graham",
      username: "Bret",
      email: "Sincere@april.biz"
    },
    {
      id: 2,
      name: "Ervin Howell",
      username: "Antonette",
      email: "Shanna@melissa.tv"
    },
    
    // ... list of items
    
    {
      id: 11,
      name: "Nicholas DuBuque",
      username: "Nicholas.Stanton",
      email: "Rey.Padberg@rosamond.biz"
    }
  ];
  
  constructor(private _fileService:FileService) { }

  ngOnInit(): void {
    this.source.load(this.data);

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

 

  settings = {
    columns: {
      id: {
        title: 'ID'
      },
      name: {
        title: 'Full Name'
      },
      username: {
        title: 'User Name'
      },
      email: {
        title: 'Email'
      }
    }

  }
}
