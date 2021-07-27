import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingEditDialogComponent } from './setting-edit-dialog.component';

describe('SettingEditDialogComponent', () => {
  let component: SettingEditDialogComponent;
  let fixture: ComponentFixture<SettingEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingEditDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
