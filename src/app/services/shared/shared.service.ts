import {Injectable} from '@angular/core';
import {BehaviorSubject, of} from 'rxjs';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})

export class SharedService {
  private userSource = new BehaviorSubject<string>('');
  public user = this.userSource.asObservable();

  public userObj: any;


  constructor() { }

  public editUser(user) {
    this.userSource.next(user);
  }

  public setUser(user) {
    this.userObj = user;
    console.log(this.userObj);
  }

  public getUser() {
    return this.userObj;
  }

  public isSuperAdmin(token: string) {
    if (token == null) {
      return false;
    }
    const role = jwt_decode(token)['Role'].toUpperCase()
    if (role != 'SUPER_ADMIN') return false;
    return true;
  }

  public isAdminToken(token: string) {
    if (token == null) {
      return false;
    }
    const role = jwt_decode(token)['Role'].toUpperCase()
    if (role != 'ADMIN') return false;
    return true;
  }

  public isUserToken(token: string) {
    if (token == null) {
      return false;
    }
    const role = jwt_decode(token)['Role'].toUpperCase()
    if (role != 'USER') return false;
    return true;
  }



}
