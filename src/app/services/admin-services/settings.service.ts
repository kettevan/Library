import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {RubricsResponseInterface} from '../../interfaces/admin/settings/rubrics-response.interface';
import jwt_decode from "jwt-decode";
import {SharedService} from '../shared/shared.service';
import {SettingsBasicInterface} from '../../interfaces/admin/settings/settings-basic.interface';

@Injectable({
  providedIn: 'root',
})

export class SettingsService {
  private BASE_URL = `http://localhost:8080/api/books`

  constructor(private http: HttpClient, private shared: SharedService) {}

  getAllGenres(): Observable<SettingsBasicInterface[]> {
    const token = localStorage.getItem('token');
    if (!this.shared.isAdminToken(token)) return of(null);
    const requestUrl = this.BASE_URL + `/genres`
    return this.http.get<SettingsBasicInterface[]>(requestUrl, {headers: {'Authorization': `Bearer ${token}`}})
  }

  updateGenre(rubric: SettingsBasicInterface): Observable<any> {
    const token = localStorage.getItem('token');
    if (!this.shared.isAdminToken(token)) return of(null);
    const requestUrl = this.BASE_URL + `/genres/${rubric.id}`
    console.log(requestUrl);
    return this.http.put(requestUrl, rubric, { headers: {'Authorization': `Bearer ${token}`} });
  }

  createGenre(rubric: SettingsBasicInterface): Observable<any> {
    const token = localStorage.getItem('token');
    if (!this.shared.isAdminToken(token)) return of(null);
    const requestUrl = this.BASE_URL + `/genres`
    return this.http.post(requestUrl, rubric, { headers: {'Authorization': `Bearer ${token}`} });
  }

  deleteGenre(rubric: SettingsBasicInterface): Observable<any> {
    const token = localStorage.getItem('token');
    if (!this.shared.isAdminToken(token)) return of(null);
    const requestUrl = this.BASE_URL + `/genres/${rubric.id}`
    return this.http.delete(requestUrl, { headers: {'Authorization': `Bearer ${token}`} });
  }
}
