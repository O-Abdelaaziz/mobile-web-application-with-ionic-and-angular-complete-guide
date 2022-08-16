import {Injectable} from '@angular/core';
import {CanLoad, Route, Router, UrlSegment, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthenticationService} from './authentication.service';
import {take, tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanLoad {

  constructor(private _authenticationService: AuthenticationService, private _router: Router) {
  }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this._authenticationService.userIsAuthenticated) {
      this._router.navigateByUrl('/auth');
    }
    return this._authenticationService.userIsAuthenticated.pipe(
      take(1),
      tap((isAuthenticated) => {
        if (!isAuthenticated) {
          this._router.navigateByUrl('/auth');
        }
      }),
    );
  }

}
