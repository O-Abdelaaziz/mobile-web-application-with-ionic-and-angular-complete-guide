import {Injectable} from '@angular/core';
import {CanLoad, Route, Router, UrlSegment, UrlTree} from '@angular/router';
import {Observable, of} from 'rxjs';
import {AuthenticationService} from './authentication.service';
import {switchMap, take, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanLoad {

  constructor(private _authenticationService: AuthenticationService, private _router: Router) {
  }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    if (!this._authenticationService.userIsAuthenticated) {
      this._router.navigateByUrl('/auth');
    }
    return this._authenticationService.userIsAuthenticated.pipe(
      take(1),
      switchMap(isAuthenticated => {
        if (!isAuthenticated) {
          return this._authenticationService.autoLogin();
        } else {
          return of(isAuthenticated);
        }
      }),
      tap((isAuthenticated) => {
        if (!isAuthenticated) {
          this._router.navigateByUrl('/auth');
        }
      }),
    );
  }

}
