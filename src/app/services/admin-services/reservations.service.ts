import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SharedService} from '../shared/shared.service';
import {Observable, of} from 'rxjs';
import {HeaderBookingRequestInterface} from '../../interfaces/admin/booking/header-booking-request.interface';

@Injectable({
  providedIn: 'root',
})

export class ReservationsService {

  private BASE_URL = `http://localhost:8080/api/reservations/`

  constructor(private http: HttpClient, private shared: SharedService) {
  }

  reserveBook(reservedBooks: HeaderBookingRequestInterface[]): Observable<any> {
    const token = localStorage.getItem('token');
    if (!this.shared.isAdminToken(token)) return of(null);
    const final = {'bookCopyReservationList': reservedBooks};
    const requestUrl = this.BASE_URL + `_lend`
    return this.http.post(requestUrl, final, { headers: {'Authorization': `Bearer ${token}`} });
  }

  reserveUserBook(reservationInfo: HeaderBookingRequestInterface): Observable<any> {
    const token = localStorage.getItem('token');
    if (!this.shared.isAdminToken(token)) return of(null);
    const requestUrl = this.BASE_URL
    return this.http.post(requestUrl, reservationInfo, { headers: {'Authorization': `Bearer ${token}`} });
  }
}
