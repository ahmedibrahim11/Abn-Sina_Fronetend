import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Input } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-most-sales-branches',
  templateUrl: './most-sales-branches.component.html',
  styleUrls: ['./most-sales-branches.component.css'],
})
export class MostSalesBranchesComponent implements OnInit {
  bieChartHeader = 'Most Top 7 Sales Branches';
  lowerHeader = 'Lowest 7 Sales Branches';
  chartType = '';
  branchType = '';
  top7Brnaches: any = [];
  lowest7Branches: any = [];
  @Input() data: any = [];
  constructor() {}

  ngOnInit(): void {
    this.chartType = 'BarChart';
    this.branchType = 'highest';
    this.getSalesBranches();
  }

  getSalesBranches() {
    let allbranchesSales = [];

    let dataGroupedByBranch = _.groupBy(this.data, 'Branch Name');
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
    this.lowest7Branches = _.orderBy(allbranchesSales, 'value').slice(0, 7);
  }
}
