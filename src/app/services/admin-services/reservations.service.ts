import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SharedService} from '../shared/shared.service';

@Injectable({
  providedIn: 'root',
})

export class ReservationsService {

  private BASE_URL = `http://localhost:8080/api/`

  constructor(private http: HttpClient, private shared: SharedService) {
  }
}
