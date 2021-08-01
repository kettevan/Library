import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MainPageAdminComponent} from './main-page-admin.component';

describe('MainPageComponent', () => {
  let component: MainPageAdminComponent;
  let fixture: ComponentFixture<MainPageAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MainPageAdminComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainPageAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
