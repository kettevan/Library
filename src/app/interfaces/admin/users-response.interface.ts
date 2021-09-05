import {READER_TYPES} from '../login/google-user-response.interface';

export interface UsersResponseInterface {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  personalNo?: string;
  phoneNumber?: string;
  userType?: READER_TYPES;
  registerDate: string;
}
