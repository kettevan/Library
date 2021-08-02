import {AfterViewInit, Component, OnDestroy, ViewChild} from '@angular/core';
import {SharedService} from '../../services/shared/shared.service';
import {BooksAdminService} from '../../services/books-admin/books-admin.service';
import {BooksResponseInterface} from '../../interfaces/admin/main-page/books-response.interface';
import {BookDataSource} from '../../data-sources/book-data-source.datasource';
import {MatPaginator} from '@angular/material/paginator';
import {tap} from 'rxjs/operators';
import {BooksInterface} from '../../interfaces/admin/main-page/books.interface';
import {Router} from '@angular/router';

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

  constructor(private booksAdminService: BooksAdminService, private sharedService: SharedService, private router: Router) {
    this.booksDatasource = new BookDataSource(this.booksAdminService);
    this.booksDatasource.loadBooks();
  }

  public createBook(): void {
    this.router.navigate(['/addbook']);
  }

  public editBook(book: BooksInterface): void {
    console.log(book);
  }

  public deleteBook(book: BooksInterface): void {
    console.log(book);
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
