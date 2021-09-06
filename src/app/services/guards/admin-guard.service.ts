import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import jwt_decode from "jwt-decode"

@Injectable({
  providedIn: 'root'
})
export class AdminGuardService implements CanActivate {

  constructor(private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean|UrlTree>|Promise<boolean|UrlTree>|boolean|UrlTree
  {
    var token = localStorage.getItem('token');
    if (token == null) {
      this.router.navigate(['/login']);
      return false;
    }
    var decoded = jwt_decode(token);
    console.log(decoded);
    if (decoded['Role'].toUpperCase().includes('ADMIN') || decoded['Role'].toUpperCase().includes('SUPER_ADMIN')) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
