import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportsComponent } from './reports.component';
import { SalesAndStocksComponent } from './sales-and-stocks/sales-and-stocks.component';
import { SalesbyClientComponent } from './salesby-client/salesby-client.component';

const routes: Routes = [


  { path: '', component: ReportsComponent,
  children: [
    { path: 'sales', component: SalesAndStocksComponent },
    { path: 'salesbyclient', component: SalesbyClientComponent },
    { path: '', redirectTo:"salesbyclient" },
    { path: '**', redirectTo:"salesbyclient" },

  ] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
