import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
 @Component({
  selector: 'app-selected-report',
  templateUrl: './selected-report.component.html',
  styleUrls: ['./selected-report.component.css']
})
export class SelectedReportComponent implements OnInit {

  constructor(public router:Router) { }

  ngOnInit(): void {
  }

}
