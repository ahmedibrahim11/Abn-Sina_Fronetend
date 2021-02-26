import { Component, Input } from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import * as _ from 'lodash';

@Component({
  selector: 'app-collapsed-table',
  templateUrl: './collapsed-table.component.html',
  styleUrls: ['./collapsed-table.component.css'],
  animations: [
    trigger('detailExpand', [
      state(
        'collapsed',
        style({ height: '0px', minHeight: '0', display: 'none' })
      ),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class CollapsedTableComponent {
  constructor() {}

  loader = true;

  hideme: any[] = [];
  isCollapsed = false;
  tableData: any = [];
  page: any = 1;
  pageSize: any = 10;
  collectionSize: any;
  dataPagination: any = [];
  dataWithoutItemName: any = [];

  itemsDropDownMenu: any = [];
  selectedItem: any = '';

  @Input() data: any = [];
  @Input() tableHeaders: any = [];

  headers: any = [];

  dataSource: any;
  columnsToDisplay: any;
  expandedElement: any | null;

  async getHeaders() {
    if (this.tableHeaders.length === 0) {
      console.log('fadyaaaaaaaaaaaaaaaaaa');
    } else {
      console.log('a8aaaaaaaaaaaaaaaaaa', this.tableHeaders);
      debugger;

      this.headers = _.map(this.tableHeaders, (item: any) => {
        return item;
      });
      console.log('heeee heeee heeee ', this.headers);
    }
  }
  ngOnInit(): void {
    console.log('iniiiiiiiiit', this.tableHeaders);
    this.getHeaders();
    this.dataSource = this.data;
    this.columnsToDisplay = this.headers;

    this.filterItems();

    this.getTableData();
    this.checkItems();
    this.refreshData();
    this.collectionSize = this.separateWithItemName.length;
  }

  getTableData() {
    this.tableData = _.map(this.data, function (item: any) {
      return item;
    });
  }

  filterItems() {
    this.itemsDropDownMenu = _.uniqBy(this.data, 'Item Name');
  }

  dataGrouped: any = [];
  getSpecificItemData(selectedValue: any, i: any) {
    this.dataGrouped = [];
    let itemName = selectedValue['Item Name'];
    let itemCode = selectedValue['Item Code'];
    debugger;

    let startIndex = this.tableData.findIndex(
      (x: any) => x['Item Name'] === selectedValue['Item Name']
    );
    debugger;

    for (let index = startIndex + 1; index < this.tableData.length; index++) {
      const item = this.tableData[index];
      debugger;
      if (Object.keys(item).includes('Item Name')) {
        debugger;
        var x = item['Item Name'].replaceAll(/\s/g, '');
        debugger;
        if (
          item['Item Name'].replaceAll(/\s/g, '') ===
          itemName.replaceAll(/\s/g, '')
        ) {
          itemName = item['Item Name'];
          this.dataGrouped.push(item);
        } else {
          break;
        }
      } else {
        debugger;
        var object: any = {};
        object['Item Code'] = itemCode;
        object['Item Name'] = itemName;
        object['Brick'] = item['Brick'];
        object['Brick Name'] = item['Brick Name'];
        object['Total Qty'] = item['Total Qty'];
        this.dataGrouped.push(object);
        console.log('hna', this.dataGrouped);
      }
    }
    console.log('a7aaaa', this.dataGrouped);
  }

  separateWithItemName: any = [];
  separateWithoutItemName: any = [];

  checkItems() {
    let dict = new Map();
    let date = '';
    let suppCode = '';
    let supperName = '';
    let itemCode = '';
    let itemName = '';
    let dataGroup: any = [];
    this.tableData.forEach((element: any) => {
      debugger;
      if (Object.keys(element).includes('Item Name')) {
        debugger;
        if (itemName === element['Item Name']) {
          dataGroup.push(element);
        } else {
          var firstItem: any = {};
          firstItem['date'] = element['Date'];
          firstItem['Supp Code'] = element['Supp Code'];
          firstItem['Supp Name'] = element['Supp Name'];
          firstItem['Item Code'] = element['Item Code'];
          firstItem['Item Name'] = element['Item Name'];
          firstItem['Brick'] = element['Brick'];
          firstItem['Brick Name'] = element['Brick Name'];
          firstItem['total'] = element['Total Qty'];
          dataGroup.push(firstItem);
          date = element['Date'];
          suppCode = element['Supp Code'];
          supperName = element['Supp Name'];
          itemCode = element['Item Code'];
          itemName = element['Item Name'];
          dict.set(element['Item Name'], dataGroup);
          dataGroup = [];
        }
      } else {
        debugger;
        var object: any = {};
        object['date'] = date;
        object['Supp Code'] = suppCode;
        object['Supp Name'] = supperName;
        object['Item Code'] = itemCode;
        object['Item Name'] = itemName;
        object['Brick'] = element['Brick'];
        object['Brick Name'] = element['Brick Name'];
        object['Total Qty'] = element['Total Qty'];
        var valeues = dict.get(itemName);
        valeues.push(object);
      }
    });
    console.log('aaaaa', dict);
  }

  refreshData() {
    this.dataPagination = this.separateWithItemName
      .map((item: any, i: any) => ({
        ...item,
      }))
      .slice(
        (this.page - 1) * this.pageSize,
        (this.page - 1) * this.pageSize + this.pageSize
      );
  }

  collapsedCheck(e: any, i: number) {
    debugger;
    this.hideme[i] = !this.hideme[i];

    this.getSpecificItemData(e, i);
    if (!this.isCollapsed) this.isCollapsed = true;
    else {
      this.isCollapsed = false;
    }
  }
}
