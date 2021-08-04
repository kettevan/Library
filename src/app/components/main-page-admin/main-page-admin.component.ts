import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, ViewChild} from '@angular/core';
import {SharedService} from '../../services/shared/shared.service';
import {BooksAdminService} from '../../services/books-admin/books-admin.service';
import {BooksResponseInterface} from '../../interfaces/admin/main-page/books-response.interface';
import {BookDataSource} from '../../data-sources/book-data-source.datasource';
import {MatPaginator} from '@angular/material/paginator';
import {tap} from 'rxjs/operators';
import {BooksInterface} from '../../interfaces/admin/main-page/books.interface';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {ConfirmDeleteDialogComponent} from '../shared/confirm-delete-dialog/confirm-delete-dialog.component';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {SettingsBasicInterface} from '../../interfaces/admin/settings/settings-basic.interface';
import {ViewBookPageComponent} from './view-book-page/view-book-page.component';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page-admin.component.html',
  styleUrls: ['./main-page-admin.component.scss']
})
export class MainPageAdminComponent implements OnDestroy, AfterViewInit{
  private subs = [];
  public displayColumns: string[] = ['id', 'place', 'title', 'author', 'book_copy', 'isbn', 'publish_year', 'publisher', 'rubric', 'language', 'actions']
  public booksDatasource: BookDataSource;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private route: ActivatedRoute, private booksAdminService: BooksAdminService, private sharedService: SharedService, private router: Router,
              private toastr: ToastrService, private changeDetectorRefs: ChangeDetectorRef, public dialog: MatDialog) {
    this.booksDatasource = new BookDataSource(this.booksAdminService);
    this.booksDatasource.loadBooks();
  }

  public createBook(): void {
    this.router.navigate(['/book'], {relativeTo: this.route});
  }

  public editBook(book: BooksInterface): void {
    this.router.navigate([`/book/${book.id}`], {relativeTo: this.route});
  }

  public deleteBook(book: BooksInterface): void {
    this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '400px'
    }).afterClosed().subscribe(result => {
      if (result) {
        this.deleteBookSer(book);
        this.loadBooks();
      }
    })
  }

  public viewBook(book: BooksInterface): void {
    console.log(book);
    this.dialog.open(ViewBookPageComponent, {
      data: book,
      width: '1000px'
    }).afterClosed().subscribe(result => {
      if (result) {
        this.deleteBookSer(book);
        this.loadBooks();
      }
    })
  }

  private deleteBookSer(book: BooksInterface) {
    this.booksAdminService.deleteBook(book.id).subscribe(result => {
      if (result) {
        this.toastr.success('წიგნი წარმატებით წაიშალა');
        this.changeDetectorRefs.detectChanges();
      } else {
        this.toastr.error('წიგნის წაშლისას დაფიქსირდა შეცდომა');
      }
    })
  }


  ngAfterViewInit() {
    this.booksDatasource.counter$
      .pipe(
        tap((count) => {
          this.paginator.length = count;
        })
      )
      .subscribe();

    this.paginator.page
      .pipe(
        tap(() => this.loadBooks())
      )
      .subscribe();
  }

  private loadBooks() {
    this.booksDatasource.loadBooks(this.paginator.pageIndex+1, this.paginator.pageSize);
  }

  ngOnDestroy(): void {
    this.subs.forEach(subscription => subscription.unsubscribe);
  }

}
