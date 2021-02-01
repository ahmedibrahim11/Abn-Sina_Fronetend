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


@NgModule({
  declarations: [ReportsComponent, SalesAndStocksComponent,SmartTableComponent],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    Ng2SmartTableModule,
    HttpClientModule
  ],
  providers:[FileService,ExcelService]
})
export class ReportsModule { }
