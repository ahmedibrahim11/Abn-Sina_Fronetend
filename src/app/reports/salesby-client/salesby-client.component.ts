import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { FileService } from 'src/app/core/file.Service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-salesby-client',
  templateUrl: './salesby-client.component.html',
  styleUrls: ['./salesby-client.component.css'],
})
export class SalesbyClientComponent implements OnInit {
  url: string = 'Report/downloadFile';
  data: any[] = [];
  tableHeaders: any[] = [];
  loader = true;

  branchesName: any;
  totalItems: any = [];
  totalClients: any = [];
  totalSales: any = [];
  totalStocks: any = [];

  selectedChart = '';
  selectedChart2 = '';

  constructor(private _fileService: FileService) {}

  ngOnInit(): void {
    this.getExelfile();
  }

  getExelfile() {
    let file = { fileName: 'salesbyclient.xlsx', reportType: 'client' };
    this._fileService.downloadFile(file, this.url).subscribe({
      next: (res) => {
        this.extractDataFromExcel(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
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
      this.get_header_row(ws);
      /* save data */
      let excelData: any[] = XLSX.utils.sheet_to_json(ws);
      excelData.splice(0, 1);
      console.log(excelData);
      this.data = excelData.map((row) => {
        return {
          date: row['NEXT PHARMA (PAS) Sales By Client Report'],
           branchCode: row['__EMPTY'],
          branchName: row['__EMPTY_1'],
          suppCode: row['__EMPTY_2'],
          suppName: row['__EMPTY_3'],
          itemCode: row['__EMPTY_4'],
          itemName: row['__EMPTY_5'],
          brickCode: row['__EMPTY_6'],
          gov: row['__EMPTY_7'],
          terName: row['__EMPTY_8'],
          brickName: row['__EMPTY_9'],
          maincustomerCode: row['__EMPTY_10'],
          clientCode: row['__EMPTY_11'],
          clientName: row['__EMPTY_12'],
          segment: row['__EMPTY_13'],
          city:row['__EMPTY_14'],
          address: row['__EMPTY_15'],
          qty: row['__EMPTY_17'],
          fu: row['__EMPTY_18'],
          value: row['__EMPTY_19'],
          totalQty: row['__EMPTY_20'],
        };
      });

      this.selectedChart = 'BarChart';
      this.selectedChart2 = 'BarChart';
      console.log('SalesByClientData', this.data);

      this.getAllCardsValue('itemCode');
      this.getAllCardsValue('clientCode');
      this.getAllCardsValue('value');
      this.getAllCardsValue('qty');
      this.loader = false;
    };
  }

  getAllCardsValue(key: any) {
    switch (key) {
      case 'itemCode':
        let uniqueData=_.uniqBy(this.data,key);
        _.map(uniqueData, (item) => {
          this.totalItems += _.sum(item[key]);
        });
        break;
      case 'clientCode':
        let clientCodes=_.uniqBy(this.data,key);
        _.map(clientCodes, (item) => {
          this.totalClients += _.sum(item[key]);
        });
   
        break;
      case 'qty':
        var salesQty = _.map(this.data, (item: any) => {
          return item[key];
        });
        this.totalStocks = salesQty[salesQty.length - 1].toFixed(2)
        .toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        break;

      case 'value':
        var salesValue = _.map(this.data, (item: any) => {
          return item[key];
        });
        this.totalSales = salesValue[salesValue.length - 1].toFixed(2)
        .toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        break;
    }
  }
  get_header_row(ws: any) {
    this.tableHeaders = [
      { name: 'date', title: 'Date', filter: false },
      { name: 'branchCode', title: 'Branch Code', filter: false },
     { name: 'suppCode', title: 'Supp Code' },
      { name: 'suppName', title: 'Supp Name' },
      { name: 'itemCode', title: 'Item Code',filter: true},
      { name: 'itemName', title: 'Item Name', filter: true },
      { name: 'brickCode', title: 'Brick Code', filter: true },
      { name: 'brickName', title: 'Brick Name', filter: true },

      { name: 'gov', title: 'Gov' },
      { name: 'terName', title: 'TerName' },
      { name: 'clientCode', title: 'Client Code' },
      { name: 'clientName', title: 'Client Name' },
      { name: 'segment', title: 'Segment' },
      { name: 'city', title: 'City' },
      { name: 'address', title: 'Address' },
      { name: 'qty', title: 'Quantity' },
      { name: 'fu', title: 'Fu' },
      { name: 'value', title: 'value' },
      { name: 'totalQty', title: 'Total Qty' },
    ];
  }
}
