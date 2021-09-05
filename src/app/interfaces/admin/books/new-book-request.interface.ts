import {SettingsBasicInterface} from '../settings/settings-basic.interface';
import {BookCopyInterface} from './books.interface';

export interface NewBookRequestInterface {
  id?: number;
  title?: string;
  author?: string;
  subtitle?: string;
  note?: string;
  edition?: string;
  bookCopies?: BookCopyInterface[];
  publishDate?: Date;
  createDate?: Date;
  active?: boolean;
  rubricId?: number;
  languageId?: number;
  fundId?: number;
  publisherId?: number;
  resourceTypeId?: number;
  resourceFormId?: number;
  isbn: string;
  udc?: string;
  link?: string;
  place?: string;
  price?: string;
  file?: string;
  coverImage?: string;
}
