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
  private USERS_BASE_UEL = `http://localhost:8080/api/users/`

  constructor(private http: HttpClient, private shared: SharedService) {
  }

  reservations(pageNumber: number, limit: number): Observable<any> {
    const token = localStorage.getItem('token');
    if (!this.shared.isAdminToken(token)) return of(null);
    const requestUrl = `http://localhost:8080/api/reservations` + `?page=${pageNumber}&limit=${limit}`;
    return this.http.get(requestUrl, { headers: {'Authorization': `Bearer ${token}`} });
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
    if (!this.shared.isAdminToken(token) && !this.shared.isUserToken(token)) return of(null);
    const requestUrl = this.BASE_URL
    return this.http.post(requestUrl, reservationInfo, { headers: {'Authorization': `Bearer ${token}`} });
  }

  getUserReservations(userId: number): Observable<any> {
    const token = localStorage.getItem('token');
    if (!this.shared.isAdminToken(token) && !this.shared.isUserToken(token)) return of(null);
    const requestUrl = this.USERS_BASE_UEL + `${userId}/reservations`
    return this.http.get(requestUrl, { headers: {'Authorization': `Bearer ${token}`} });
  }

  cancelReservation(reservationId: number): Observable<any> {
    const token = localStorage.getItem('token');
    if (!this.shared.isAdminToken(token) && !this.shared.isUserToken(token)) return of(null);
    const requestUrl = this.BASE_URL + `${reservationId}/_cancel`
    return this.http.post(requestUrl, null, { headers: {'Authorization': `Bearer ${token}`} });
  }
}
