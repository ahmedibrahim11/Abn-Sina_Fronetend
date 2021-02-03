import { Component, OnInit } from '@angular/core';
import { FileService } from 'src/app/core/file.Service';
import * as XLSX from 'xlsx';

import * as _ from "lodash";
@Component({
  selector: 'app-sales-and-stocks',
  templateUrl: './sales-and-stocks.component.html',
  styleUrls: ['./sales-and-stocks.component.css']
})
export class SalesAndStocksComponent implements OnInit {


  url: string = "Report/downloadFile";

  data: any[] = [];
  tableHeaders: any[] = [];
  itemsCode : any = [];
  branchesCode : any = [];
  totalSales : any = [];

  constructor(private _fileService: FileService) { }

  ngOnInit(): void {
    this.getExelfile();

  }

  getExelfile() {

    this._fileService.downloadFile("testExcel.xlsx", this.url).subscribe(
      {
        next: (res) => {
          debugger;
          this.extractDataFromExcel(res);
        },
        error: (err) => { console.log(err) },
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
      debugger;
      /* selected the first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      this.get_header_row(ws);
      /* save data */
      this.data = XLSX.utils.sheet_to_json(ws);
        this.getAllCardsValue("Item Code");
        this.getAllCardsValue("Branch Code");
        this.getAllCardsValue("Sales Value");
    };
  }

  getAllCardsValue(key:any){
    switch(key){
      case "Item Code":
        _.map(this.data,(item)=>{
         this.itemsCode += _.sum(item[key])
    })
    break;
    case "Branch Code":
        _.map(this.data,(item)=>{
         this.branchesCode += _.sum(item[key])
    })
    break;
    case "Sales Value":
      var salesValue =_.map(this.data, (item:any) => { 
      return item[key]; 
   }) 
     this.totalSales = _.sum(salesValue)
    break;
    }
    
  }

  get_header_row(ws: any) {
    var range = XLSX.utils.decode_range(ws['!ref']);
    var C, R = range.s.r;
    /* walk every column in the range */
    for (C = range.s.c; C <= range.e.c; ++C) {
      var cell = ws[XLSX.utils.encode_cell({ c: C, r: R })]
      /* find the cell in the first row */
      var hdr = "UNKNOWN " + C; // <-- replace with your desired default 
      if (cell && cell.t)
        hdr = XLSX.utils.format_cell(cell);
      this.tableHeaders.push({ name: hdr, title: hdr });
    }
    debugger;
    return this.tableHeaders;
  }


}
