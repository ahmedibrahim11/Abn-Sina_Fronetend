import { Component, OnInit } from '@angular/core';
import { FileService } from 'src/app/core/file.Service';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-sales-and-stocks',
  templateUrl: './sales-and-stocks.component.html',
  styleUrls: ['./sales-and-stocks.component.css']
})
export class SalesAndStocksComponent implements OnInit {
 

   url:string="Report/downloadFile";

data:any[]=[];
tableHeaders:any[]=[];
  
  constructor(private _fileService:FileService) { }

  ngOnInit(): void {
this.getExelfile();
  }

  getExelfile(){

    this._fileService.downloadFile("Daily_Sales_and_Stock_for_AL_ANDALOUS20210110080017.xlsx",this.url).subscribe(
      {
        next:(res)=>{
        
          this.extractDataFromExcel(res);

        },
    
        error:(err)=>{console.log(err)},
    }
      


    )
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
      this.getheaders(ws);
      /* save data */
      this.data = XLSX.utils.sheet_to_json(ws); // to get 2d array pass 2nd parameter as object {header: 1}
     console.log(this.data);
    };
 }

getheaders(ws:any){

        // getting all rows
let secRow=  JSON.stringify((XLSX.utils.sheet_to_json(ws, { header: 2}))[0] ); 
secRow=secRow.replace(/"/g, "").replace(/}/g,'');
// Fetch the first row
let headersArr= secRow.split(":") ;
this.tableHeaders.push({name:"Daily Sales and Stock for AL ANDALOUS Sales and Stock",title:"Date"});

for (let i = 1; i < headersArr.length; i++) {
  const element = headersArr[i];
  let header=element.split(",");
  debugger;
  
  if (header[0]==="Date") {
    header[0]="SupCode";
  }
    this.tableHeaders.push({name:header[1],title:header[0]});
}



}


}
