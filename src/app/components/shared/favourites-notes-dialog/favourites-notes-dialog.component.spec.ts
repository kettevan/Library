import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavouritesNotesDialogComponent } from './favourites-notes-dialog.component';

describe('FavouritesNotesDialogComponent', () => {
  let component: FavouritesNotesDialogComponent;
  let fixture: ComponentFixture<FavouritesNotesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FavouritesNotesDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FavouritesNotesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
