import {Component, OnInit, Inject, ViewChild, AfterViewInit} from '@angular/core';
import {BookCopyInterface, BooksInterface} from '../../../interfaces/admin/main-page/books.interface';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {BookingPageComponent} from '../booking-page/booking-page.component';

@Component({
  selector: 'app-view-book-page',
  templateUrl: './view-book-page.component.html',
  styleUrls: ['./view-book-page.component.scss']
})

export class ViewBookPageComponent implements OnInit, AfterViewInit {
  constructor(private dialogRef: MatDialogRef<any>, @Inject(MAT_DIALOG_DATA) public data: BooksInterface,
              public dialog: MatDialog) { }
  displayColumns: string[] = ['code', 'status', 'action']
  public booksCopyDataSource = new MatTableDataSource<BookCopyInterface>();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(): void {
    this.booksCopyDataSource = new MatTableDataSource<BookCopyInterface>(this.data.bookCopies);
    this.booksCopyDataSource.filterPredicate = function(data, filter: string): boolean {
      return data.code.toLowerCase().includes(filter);
    };
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.booksCopyDataSource.filter = filterValue;
  }

  onBookingClick(bookCopy: BookCopyInterface): void {
    this.dialog.open(BookingPageComponent, {
      width: '400px',
      data: bookCopy
    }).afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
      }
    })
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  ngAfterViewInit(): void {
    this.booksCopyDataSource.paginator = this.paginator;
  }
}
