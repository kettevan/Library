import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationConformationDialogComponent } from './reservation-conformation-dialog.component';

describe('ReservationConformationDialogComponent', () => {
  let component: ReservationConformationDialogComponent;
  let fixture: ComponentFixture<ReservationConformationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReservationConformationDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservationConformationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
