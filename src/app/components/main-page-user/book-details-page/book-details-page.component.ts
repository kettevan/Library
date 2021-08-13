import { Component, OnInit } from '@angular/core';
import {startWith} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import {BooksAdminService} from '../../../services/books-admin/books-admin.service';
import {BooksInterface} from '../../../interfaces/admin/main-page/books.interface';

@Component({
  selector: 'app-book-details-page',
  templateUrl: './book-details-page.component.html',
  styleUrls: ['./book-details-page.component.scss']
})
export class BookDetailsPageComponent implements OnInit {
  public data: BooksInterface = null;
  private bookId: number;

  constructor(private route: ActivatedRoute, private booksService: BooksAdminService) {
  }

  ngOnInit(): void {
    this.route.params.pipe(startWith(this.route.snapshot.params)).subscribe(params => {
      const id = parseInt(params.id, 10);
      if (isFinite(id)) {
        this.bookId = id;
        this.booksService.getBookById(id).subscribe(result => {
          this.data = result;
          console.log(this.data)
        })
      }
    });
  }

}
