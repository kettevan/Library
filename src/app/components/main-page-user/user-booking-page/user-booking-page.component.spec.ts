import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserBookingPageComponent } from './user-booking-page.component';

describe('UserBookingPageComponent', () => {
  let component: UserBookingPageComponent;
  let fixture: ComponentFixture<UserBookingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserBookingPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserBookingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
