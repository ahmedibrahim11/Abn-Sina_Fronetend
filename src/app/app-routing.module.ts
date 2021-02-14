import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SelectedReportComponent } from './reports/selected-report/selected-report.component';

const routes: Routes = [

  { path: '', redirectTo: 'selectedReport', pathMatch: "full" },
  { path: 'selectedReport',component:SelectedReportComponent},
  { path: 'reports', loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
