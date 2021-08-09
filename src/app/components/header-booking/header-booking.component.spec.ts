import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderBookingComponent } from './header-booking.component';

describe('HeaderBookingComponent', () => {
  let component: HeaderBookingComponent;
  let fixture: ComponentFixture<HeaderBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderBookingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
