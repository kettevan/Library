import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationsDetailsPageComponent } from './reservations-details-page.component';

describe('ReservationsDetailsPageComponent', () => {
  let component: ReservationsDetailsPageComponent;
  let fixture: ComponentFixture<ReservationsDetailsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReservationsDetailsPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservationsDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
