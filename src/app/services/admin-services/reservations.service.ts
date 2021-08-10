import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SharedService} from '../shared/shared.service';
import {Observable, of} from 'rxjs';
import {HeaderBookingRequestInterface} from '../../interfaces/admin/booking/header-booking-request.interface';

@Injectable({
  providedIn: 'root',
})

export class ReservationsService {

  private BASE_URL = `http://localhost:8080/api/reservations/_lend`

  constructor(private http: HttpClient, private shared: SharedService) {
  }

  reserveBook(reservedBooks: HeaderBookingRequestInterface[]): Observable<any> {
    const token = localStorage.getItem('token');
    if (!this.shared.isAdminToken(token)) return of(null);
    const final = {'bookCopyReservationList': reservedBooks};
    return this.http.post(this.BASE_URL, final, { headers: {'Authorization': `Bearer ${token}`} });
  }
}
