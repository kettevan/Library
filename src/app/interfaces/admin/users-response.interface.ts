import {READER_TYPES} from '../login/google-user-response.interface';

export interface UsersResponseInterface {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  personalNo?: string;
  phoneNum?: string;
  readerType?: READER_TYPES;
  createDate: Date;
}
