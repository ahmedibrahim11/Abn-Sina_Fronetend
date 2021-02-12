import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostSalesCitiesComponent } from './most-sales-cities.component';

describe('MostSalesCitiesComponent', () => {
  let component: MostSalesCitiesComponent;
  let fixture: ComponentFixture<MostSalesCitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MostSalesCitiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MostSalesCitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
