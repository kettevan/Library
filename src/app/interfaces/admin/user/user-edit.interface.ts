import {UsersResponseInterface} from '../users-response.interface';

export interface UserEditInterface {
  isAdmin: boolean,
  userInfo?: UsersResponseInterface
}
