import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Input } from '@angular/core';
import * as _ from 'lodash';
import * as jsPDF from 'jspdf'
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-most-sales-branches',
  templateUrl: './most-sales-branches.component.html',
  styleUrls: ['./most-sales-branches.component.css']
})
export class MostSalesBranchesComponent implements OnInit {
  bieChartHeader = 'Most Top 7 Sales Branches';
  lowerHeader = 'Lowest 7 Sales Branches'
  chartType = '';
  chartID = '';
  branchType = '';
  top7Brnaches: any = [];
  lowest7Branches: any = [];
  @Input() data: any = [];
  constructor() {
  }

  openPDF(): void {
    var element:any=document.getElementById(this.chartID);
    debugger;
    html2canvas(element).then((canvas)=>{
      var imgData=canvas.toDataURL('image/png');
      let doc = new jsPDF();
      doc.addImage(imgData,0,0,0,90,100);
      doc.save('csvpdf.pdf');
    })
   
  }

  ngOnInit(): void {
    debugger;
    console.log(this.data);
    this.chartType = 'BarChart';
    this.branchType = 'highest';
    this.chartID = 'firstCase';
    this.getSalesBranches();
  }


  getSalesBranches() {
    let allbranchesSales = [];

    let dataGroupedByBranch = _.groupBy(this.data, 'Branch Name');
    console.log('names', dataGroupedByBranch);
    for (let key in dataGroupedByBranch) {
      if (key) {
        let branch = { name: key, value: 0 };
        let values: number[] = [];
        dataGroupedByBranch[key].forEach((elm: any) => {
          values.push(elm['Sales Value']);
        });
        branch.value = _.sum(values);

        allbranchesSales.push(branch);
      }
    }
    this.top7Brnaches = _.orderBy(allbranchesSales, 'value')
      .reverse()
      .slice(0, 7);
    this.lowest7Branches = _.orderBy(allbranchesSales, 'value')
      .slice(0, 7);

  }
}
