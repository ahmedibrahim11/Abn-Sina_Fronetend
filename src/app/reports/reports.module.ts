import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports.component';
import { SalesAndStocksComponent } from './sales-and-stocks/sales-and-stocks.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { FileService } from '../core/file.Service';
import { ExcelService } from '../core/excelService';
import { HttpClientModule } from '@angular/common/http';
import { SmartTableComponent } from '../shared/smart-table/smart-table.component';
import { BarChartComponent } from '../shared/charts/bar-chart/bar-chart.component';
import { PieChartComponent } from '../shared/charts/pie-chart/pie-chart.component';
import { ChartsModule } from 'ng2-charts';
import { NgbButtonsModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { MostSalesBranchesComponent } from './sales-and-stocks/most-sales-branches/most-sales-branches.component';
import { SalesAndStocksItemComponent } from './sales-and-stocks/sales-and-stocks-item/sales-and-stocks-item.component';


@NgModule({
  declarations: [ReportsComponent, SalesAndStocksComponent,SmartTableComponent,BarChartComponent,PieChartComponent, MostSalesBranchesComponent, SalesAndStocksItemComponent],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    Ng2SmartTableModule,
    HttpClientModule,
    ChartsModule,
    NgbModule,
    FormsModule,
    NgbButtonsModule,
  ],
  providers:[FileService,ExcelService]
})
export class ReportsModule { }
