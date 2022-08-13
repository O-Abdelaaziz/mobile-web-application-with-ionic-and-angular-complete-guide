import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private _userIsAuthenticated = true;
  private _userId = 'user1';

  constructor() {
  }

  get userId() {
    return this._userId;
  }

  get userIsAuthenticated() {
    return this._userIsAuthenticated;
  }

  public login() {
    this._userIsAuthenticated = true;
  }

  public logout() {
    this._userIsAuthenticated = false;
  }
}
