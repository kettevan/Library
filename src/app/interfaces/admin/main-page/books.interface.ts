import {SettingsBasicInterface} from '../settings/settings-basic.interface';

export interface BooksInterface {
  id?: number;
  title?: string;
  author?: string;
  note?: string;
  bookCopies?: BookCopyInterface[];
  publishDate?: string;
  subject?: SettingsBasicInterface;
  language?: SettingsBasicInterface;
  fund?: SettingsBasicInterface;
  publisher?: SettingsBasicInterface;
  resourceType?: SettingsBasicInterface;
  resourceForm?: SettingsBasicInterface;
  subjectId?: SettingsBasicInterface;
  isbn: string;
}


export interface BookCopyInterface {
  id?: number;
  book?: BooksInterface;
  description?: string;
  code: string;
}
