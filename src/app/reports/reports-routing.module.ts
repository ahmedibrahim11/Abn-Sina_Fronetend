import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportsComponent } from './reports.component';
import { SalesAndStocksComponent } from './sales-and-stocks/sales-and-stocks.component';

const routes: Routes = [


  { path: '', component: ReportsComponent,
  children: [
    { path: 'sales', component: SalesAndStocksComponent },

  ] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
