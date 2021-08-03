import {SettingsBasicInterface} from '../settings/settings-basic.interface';
import {BookCopyInterface} from './books.interface';

export interface NewBookRequestInterface {
  id?: number;
  title?: string;
  author?: string;
  note?: string;
  bookCopies?: BookCopyInterface[];
  publishDate?: Date;
  subjectId?: number;
  languageId?: number;
  fundId?: number;
  publisherId?: number;
  resourceTypeId?: number;
  resourceFormId?: number;
  isbn: string;
}
