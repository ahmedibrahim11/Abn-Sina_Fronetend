import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollapsedTableComponent } from './collapsed-table.component';

describe('CollapsedTableComponent', () => {
  let component: CollapsedTableComponent;
  let fixture: ComponentFixture<CollapsedTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollapsedTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollapsedTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
