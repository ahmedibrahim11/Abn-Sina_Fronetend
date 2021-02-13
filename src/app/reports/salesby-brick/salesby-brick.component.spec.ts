import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesbyBrickComponent } from './salesby-brick.component';

describe('SalesbyBrickComponent', () => {
  let component: SalesbyBrickComponent;
  let fixture: ComponentFixture<SalesbyBrickComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesbyBrickComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesbyBrickComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
