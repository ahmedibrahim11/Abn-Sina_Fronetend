import { Component, PipeTransform, Input, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import * as _ from 'lodash';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements OnInit {
  @Input() formControl: any = [];
  @Input() data: any = [];
  @Input() headers: any = [];
  @Input() selectedType:any='';
  tableHeaders: any = [];
  tableData: any = [];
  page: any = 1;
  pageSize: any = 10;
  collectionSize: any;
  dataPagination: any = [];
  itemsDropDownMenu: any = [];
  branchesDropDownMenu:any=[];
  bricksDropDownMenu:any=[];
  selectedItem: any = '';
  selectedBranch:any='';
  selectedBrick:any=''
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

  ngOnInit(): void {
    debugger;
    if(this.selectedType==="stock"){
      this.selectedItem = 'Choose Item';
      this.selectedBranch='Choose Branch';
     this.itemsDropDownMenu = _.uniqBy(this.data, 'Item name');
     this.branchesDropDownMenu=_.uniqBy(this.data,'Branch Name');
    }
    else if(this.selectedType==='Brick'){
      this.selectedItem = 'Choose Item';
      this.selectedBrick='Choose Brick';
      this.bricksDropDownMenu=_.uniqBy(this.data,'Brick Name');
      this.itemsDropDownMenu = _.uniqBy(this.data, 'Item Name');
      debugger;
    }
    

    console.log("heades",this.headers);
    this.getTableData();
    this.collectionSize = this.tableData.length;
    this.refreshData();



  }

  objectKeys(obj:any) {
    return Object.keys(obj);
}

  constructor(pipe: DecimalPipe) {}

 
  getTableData() {
    this.tableData = _.map(this.data, function (item: any) {
      return item;
    });
  }

  getValues() {
    this.dataPagination = this.tableData.filter((item: any) => {
      console.log('item', item);
      return item['Item name'] === this.selectedItem['Item name'];
    });
  }
  getBranches(){
    this.dataPagination = this.tableData.filter((branch: any) => {
      console.log('branch', branch);
      return branch['Branch Name'] === this.selectedBranch['Branch Name'];
    });
  }

  getBricks(){
    this.dataPagination = this.tableData.filter((branch: any) => {
      console.log('Brick', branch);
      return branch['Brick Name'] === this.selectedBranch['Brick Name'];
    });
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