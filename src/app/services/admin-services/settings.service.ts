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
  private BASE_SETTINGS_URL = `http://localhost:8080/api/parameters`

  constructor(private http: HttpClient, private shared: SharedService) {}
  // რუბრიკა

  getAllGenres(): Observable<SettingsBasicInterface[]> {
    const token = localStorage.getItem('token');
    if (!this.shared.isAdminToken(token)) return of(null);
    const requestUrl = this.BASE_URL + `/subjects`
    return this.http.get<SettingsBasicInterface[]>(requestUrl, {headers: {'Authorization': `Bearer ${token}`}})
  }

  updateGenre(rubric: SettingsBasicInterface): Observable<any> {
    const token = localStorage.getItem('token');
    if (!this.shared.isAdminToken(token)) return of(null);
    const requestUrl = this.BASE_URL + `/subjects/${rubric.id}`
    console.log(requestUrl);
    return this.http.put(requestUrl, rubric, { headers: {'Authorization': `Bearer ${token}`} });
  }

  createGenre(rubric: SettingsBasicInterface): Observable<any> {
    const token = localStorage.getItem('token');
    if (!this.shared.isAdminToken(token)) return of(null);
    const requestUrl = this.BASE_URL + `/subjects`
    return this.http.post(requestUrl, rubric, { headers: {'Authorization': `Bearer ${token}`} });
  }

  deleteGenre(rubric: SettingsBasicInterface): Observable<any> {
    const token = localStorage.getItem('token');
    if (!this.shared.isAdminToken(token)) return of(1);
    const requestUrl = this.BASE_URL + `/subjects/${rubric.id}`
    console.log(requestUrl);
    return this.http.delete(requestUrl, { headers: {'Authorization': `Bearer ${token}`} });
  }

  // ფონდი / კოლექცია

  getAllCollections(): Observable<SettingsBasicInterface[]> {
    const token = localStorage.getItem('token');
    if (!this.shared.isAdminToken(token)) return of(null);
    // TO DO change url
    const requestUrl = this.BASE_SETTINGS_URL + `/funds`
    return this.http.get<SettingsBasicInterface[]>(requestUrl, {headers: {'Authorization': `Bearer ${token}`}})
  }

  createCollection(collection: SettingsBasicInterface): Observable<any> {
    const token = localStorage.getItem('token');
    if (!this.shared.isAdminToken(token)) return of(null);
    // TO DO change url
    const requestUrl = this.BASE_SETTINGS_URL + `/funds`
    return this.http.post(requestUrl, collection, { headers: {'Authorization': `Bearer ${token}`} });
  }

  updateCollection(collection: SettingsBasicInterface): Observable<any> {
    const token = localStorage.getItem('token');
    if (!this.shared.isAdminToken(token)) return of(null);
    // TO DO change url
    const requestUrl = this.BASE_SETTINGS_URL + `/funds/${collection.id}`
    console.log(requestUrl);
    return this.http.put(requestUrl, collection, { headers: {'Authorization': `Bearer ${token}`} });
  }

  deleteCollection(collection: SettingsBasicInterface): Observable<any> {
    const token = localStorage.getItem('token');
    if (!this.shared.isAdminToken(token)) return of(1);
    // TO DO change url
    const requestUrl = this.BASE_SETTINGS_URL + `/funds/${collection.id}`
    console.log(requestUrl);
    return this.http.delete(requestUrl, { headers: {'Authorization': `Bearer ${token}`} });
  }

  // მასალის სახე

  getAllForms(): Observable<SettingsBasicInterface[]> {
    const token = localStorage.getItem('token');
    if (!this.shared.isAdminToken(token)) return of(null);
    // TO DO change url
    const requestUrl = this.BASE_SETTINGS_URL + `/resourceForms`
    return this.http.get<SettingsBasicInterface[]>(requestUrl, {headers: {'Authorization': `Bearer ${token}`}})
  }

  createForms(form: SettingsBasicInterface): Observable<any> {
    const token = localStorage.getItem('token');
    if (!this.shared.isAdminToken(token)) return of(null);
    // TO DO change url
    const requestUrl = this.BASE_SETTINGS_URL + `/resourceForms`
    return this.http.post(requestUrl, form, { headers: {'Authorization': `Bearer ${token}`} });
  }

  updateForm(form: SettingsBasicInterface): Observable<any> {
    const token = localStorage.getItem('token');
    if (!this.shared.isAdminToken(token)) return of(null);
    // TO DO change url
    const requestUrl = this.BASE_SETTINGS_URL + `/resourceForms/${form.id}`
    return this.http.put(requestUrl, form, { headers: {'Authorization': `Bearer ${token}`} });
  }

  deleteForm(form: SettingsBasicInterface): Observable<any> {
    const token = localStorage.getItem('token');
    if (!this.shared.isAdminToken(token)) return of(1);
    // TO DO change url
    const requestUrl = this.BASE_SETTINGS_URL + `/resourceForms/${form.id}`
    return this.http.delete(requestUrl, { headers: {'Authorization': `Bearer ${token}`} });
  }

  // მასალის ტიპი

  getAllTypes(): Observable<SettingsBasicInterface[]> {
    const token = localStorage.getItem('token');
    if (!this.shared.isAdminToken(token)) return of(null);
    // TO DO change url
    const requestUrl = this.BASE_SETTINGS_URL + `/resourceTypes`
    return this.http.get<SettingsBasicInterface[]>(requestUrl, {headers: {'Authorization': `Bearer ${token}`}})
  }

  createTypes(type: SettingsBasicInterface): Observable<any> {
    const token = localStorage.getItem('token');
    if (!this.shared.isAdminToken(token)) return of(null);
    // TO DO change url
    const requestUrl = this.BASE_SETTINGS_URL + `/resourceTypes`
    return this.http.post(requestUrl, type, { headers: {'Authorization': `Bearer ${token}`} });
  }

  updateType(type: SettingsBasicInterface): Observable<any> {
    const token = localStorage.getItem('token');
    if (!this.shared.isAdminToken(token)) return of(null);
    // TO DO change url
    const requestUrl = this.BASE_SETTINGS_URL + `/resourceTypes/${type.id}`
    return this.http.put(requestUrl, type, { headers: {'Authorization': `Bearer ${token}`} });
  }

  deleteType(type: SettingsBasicInterface): Observable<any> {
    const token = localStorage.getItem('token');
    if (!this.shared.isAdminToken(token)) return of(1);
    // TO DO change url
    const requestUrl = this.BASE_SETTINGS_URL + `/resourceTypes/${type.id}`
    return this.http.delete(requestUrl, {headers: {'Authorization': `Bearer ${token}`}});
  }

  // მასალის ენა

  getAllLanguages(): Observable<SettingsBasicInterface[]> {
    const token = localStorage.getItem('token');
    if (!this.shared.isAdminToken(token)) return of(null);
    const requestUrl = this.BASE_SETTINGS_URL + `/languages`
    return this.http.get<SettingsBasicInterface[]>(requestUrl, {headers: {'Authorization': `Bearer ${token}`}})
  }

  createLanguage(language: SettingsBasicInterface): Observable<any> {
    const token = localStorage.getItem('token');
    if (!this.shared.isAdminToken(token)) return of(null);
    const requestUrl = this.BASE_SETTINGS_URL + `/languages`
    return this.http.post(requestUrl, language, { headers: {'Authorization': `Bearer ${token}`} });
  }

  updateLanguage(language: SettingsBasicInterface): Observable<any> {
    const token = localStorage.getItem('token');
    if (!this.shared.isAdminToken(token)) return of(null);
    const requestUrl = this.BASE_SETTINGS_URL + `/languages/${language.id}`
    return this.http.put(requestUrl, language, { headers: {'Authorization': `Bearer ${token}`} });
  }

  deleteLanguage(language: SettingsBasicInterface): Observable<any> {
    const token = localStorage.getItem('token');
    if (!this.shared.isAdminToken(token)) return of(1);
    const requestUrl = this.BASE_SETTINGS_URL + `/languages/${language.id}`
    return this.http.delete(requestUrl, { headers: {'Authorization': `Bearer ${token}`} });
  }
  // გამომცემლობა

  getAllPublishers(): Observable<SettingsBasicInterface[]> {
    const token = localStorage.getItem('token');
    if (!this.shared.isAdminToken(token)) return of(null);
    const requestUrl = this.BASE_SETTINGS_URL + `/publishers`
    return this.http.get<SettingsBasicInterface[]>(requestUrl, {headers: {'Authorization': `Bearer ${token}`}})
  }

  createPublisher(publisher: SettingsBasicInterface): Observable<any> {
    const token = localStorage.getItem('token');
    if (!this.shared.isAdminToken(token)) return of(null);
    const requestUrl = this.BASE_SETTINGS_URL + `/publishers`
    return this.http.post(requestUrl, publisher, { headers: {'Authorization': `Bearer ${token}`} });
  }

  updatePublisher(publisher: SettingsBasicInterface): Observable<any> {
    const token = localStorage.getItem('token');
    if (!this.shared.isAdminToken(token)) return of(null);
    const requestUrl = this.BASE_SETTINGS_URL + `/publishers/${publisher.id}`
    return this.http.put(requestUrl, publisher, { headers: {'Authorization': `Bearer ${token}`} });
  }

  deletePublisher(publisher: SettingsBasicInterface): Observable<any> {
    const token = localStorage.getItem('token');
    if (!this.shared.isAdminToken(token)) return of(1);
    const requestUrl = this.BASE_SETTINGS_URL + `/publishers/${publisher.id}`
    return this.http.delete(requestUrl, {headers: {'Authorization': `Bearer ${token}`}});
  }

}
