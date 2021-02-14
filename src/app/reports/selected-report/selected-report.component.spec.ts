import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedReportComponent } from './selected-report.component';

describe('SelectedReportComponent', () => {
  let component: SelectedReportComponent;
  let fixture: ComponentFixture<SelectedReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectedReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
