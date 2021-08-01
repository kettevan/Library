import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainPageUserComponent } from './main-page-user.component';

describe('MainPageUserComponent', () => {
  let component: MainPageUserComponent;
  let fixture: ComponentFixture<MainPageUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainPageUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainPageUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
