import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SharedService} from '../shared/shared.service';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class ReservationsService {

  private BASE_URL = `http://localhost:8080/api/reservations`

  constructor(private http: HttpClient, private shared: SharedService) {
  }

  reserveBook(reservationInfo: any): Observable<any> {
    const token = localStorage.getItem('token');
    if (!this.shared.isAdminToken(token)) return of(null);
    return this.http.post(this.BASE_URL, reservationInfo, { headers: {'Authorization': `Bearer ${token}`} });
  }
}
