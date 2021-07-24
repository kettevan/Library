import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

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

}
