import {Injectable} from '@angular/core';
import {BehaviorSubject, of} from 'rxjs';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})

export class SharedService {
  private userSource = new BehaviorSubject<string>('');
  public user = this.userSource.asObservable();

  constructor() { }

  public editUser(user) {
    this.userSource.next(user);
  }

  public isAdminToken(token: string) {
    if (token == null) {
      return false;
    }
    const role = jwt_decode(token)['Role'].toUpperCase()
    if (role != 'ADMIN') return false;
    return true;
  }

}
