import {BooksInterface} from './books.interface';

export interface CommentInterface {
  id?: number;
  active?: boolean;
  comment: string;
  createDate?: Date;
  updateDate?: Date;
  userId: number;
  bookId: number;
  userInfo?: {
    fullName?: string;
  }
}

export interface CommentsResponseInterface {
  content: CommentInterface[];
  pageable: {
    sort: {
      unsorted: boolean;
      sorted: boolean;
      empty: boolean;
    };
    offset: number;
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  numberOfElements: number;
  number: number;
  size: number;
  first: boolean;
  sort: {
    unsorted: boolean;
    sorted: boolean;
    empty: boolean;
  };
  empty: boolean;
}
