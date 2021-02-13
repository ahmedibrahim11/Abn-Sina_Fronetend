import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports.component';
import { SalesAndStocksComponent } from './sales-and-stocks/sales-and-stocks.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { FileService } from '../core/file.Service';
import { ExcelService } from '../core/excelService';
import { HttpClientModule } from '@angular/common/http';
import { BarChartComponent } from '../shared/charts/bar-chart/bar-chart.component';
import { PieChartComponent } from '../shared/charts/pie-chart/pie-chart.component';
import { ChartsModule } from 'ng2-charts';
import { NgbButtonsModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { MostSalesBranchesComponent } from './sales-and-stocks/most-sales-branches/most-sales-branches.component';
import { SalesAndStocksItemComponent } from './sales-and-stocks/sales-and-stocks-item/sales-and-stocks-item.component';
import { SalesbyClientComponent } from './salesby-client/salesby-client.component';
import { GenricSmartTableComponent } from '../shared/genric-smart-table/genric-smart-table.component';
import { MostSalesCitiesComponent } from './salesby-client/most-sales-cities/most-sales-cities.component';
import { MostSalesGovsComponent } from './salesby-client/most-sales-govs/most-sales-govs.component';
import { MostSalesPerSegmentComponent } from './salesby-client/most-sales-per-segment/most-sales-per-segment.component';
import { SalesAndStockClientItemComponent } from './salesby-client/sales-and-stock-client-item/sales-and-stock-client-item.component';

import { SalesbyBrickComponent } from "./salesby-brick/salesby-brick.component"
import { MostSalesBricksComponent } from './salesby-brick/most-sales-bricks/most-sales-bricks.component';
import { SalesQuantityBrickComponent } from './salesby-brick/sales-quantity-brick/sales-quantity-brick.component';
@NgModule({
  declarations: [
    ReportsComponent, SalesAndStocksComponent, GenricSmartTableComponent,
    BarChartComponent, PieChartComponent, MostSalesBranchesComponent,
    SalesAndStocksItemComponent, SalesbyClientComponent,
    MostSalesCitiesComponent, MostSalesGovsComponent,
    MostSalesPerSegmentComponent, SalesAndStockClientItemComponent,SalesbyBrickComponent,
    MostSalesBricksComponent,SalesQuantityBrickComponent
  ],
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
  providers: [FileService, ExcelService]
})
export class ReportsModule { }
