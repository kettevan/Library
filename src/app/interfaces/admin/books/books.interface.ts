import {SettingsBasicInterface} from '../settings/settings-basic.interface';

export interface BooksInterface {
  id?: number;
  title?: string;
  subtitle?: string;
  author?: string;
  edition?: string;
  note?: string;
  bookCopies?: BookCopyInterface[];
  publishDate?: Date;
  createDate?: Date;
  active?: boolean;
  pageNumber?: number
  rubric?: SettingsBasicInterface;
  language?: SettingsBasicInterface;
  fund?: SettingsBasicInterface;
  publisher?: SettingsBasicInterface;
  resourceType?: SettingsBasicInterface;
  resourceForm?: SettingsBasicInterface;
  rubricId?: SettingsBasicInterface;
  udc?: string;
  link?: string;
  place?: string;
  price?: string;
  file?: string;
  isbn: string;
  coverImage?: string;
  comments?: CommentsInterface[];
}

export interface CommentsInterface {
  id?: number;
  userId: number;
  bookId: number;
  comment: string;
}

export interface BookCopyInterface {
  id?: number;
  bookId?: null;
  description?: string;
  bookedDates?: Date[];
  confirmerAdminId?: number;
  status?: string;
  code: string;
  createDate?: Date;
  active?: boolean
}

export enum BookCopyStatuses {
  PRESENT,
  MISSING,
  LENT
}
