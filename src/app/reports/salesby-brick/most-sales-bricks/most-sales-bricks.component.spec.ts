import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostSalesBricksComponent } from './most-sales-bricks.component';

describe('MostSalesBricksComponent', () => {
  let component: MostSalesBricksComponent;
  let fixture: ComponentFixture<MostSalesBricksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MostSalesBricksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MostSalesBricksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
