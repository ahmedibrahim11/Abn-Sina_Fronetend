import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportsComponent } from './reports.component';
import { SalesAndStocksComponent } from './sales-and-stocks/sales-and-stocks.component';
import { SalesbyBrickComponent } from './salesby-brick/salesby-brick.component';
import { SalesbyClientComponent } from './salesby-client/salesby-client.component';

const routes: Routes = [


  { path: '', component: ReportsComponent,
  children: [
    { path: 'sales', component: SalesAndStocksComponent },
    { path: 'salesbyclient', component: SalesbyClientComponent },
    { path: 'salesbyBrick', component: SalesbyBrickComponent },
    { path: '', redirectTo:"salesbyBrick" },
    { path: '**', redirectTo:"salesbyBrick" },


  ] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
