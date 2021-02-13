import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesQuantityBrickComponent } from './sales-quantity-brick.component';

describe('SalesQuantityBrickComponent', () => {
  let component: SalesQuantityBrickComponent;
  let fixture: ComponentFixture<SalesQuantityBrickComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesQuantityBrickComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesQuantityBrickComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
