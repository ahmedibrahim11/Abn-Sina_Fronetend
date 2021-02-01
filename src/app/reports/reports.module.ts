import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports.component';
import { SalesAndStocksComponent } from './sales-and-stocks/sales-and-stocks.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';


@NgModule({
  declarations: [ReportsComponent, SalesAndStocksComponent],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    Ng2SmartTableModule
  ]
})
export class ReportsModule { }
