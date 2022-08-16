import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from "rxjs";

interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private _userIsAuthenticated = false;
  private _userId = null;

  constructor(private _httpClient: HttpClient) {
  }

  get userId() {
    return this._userId;
  }

  signup(email: string, password: string) {
    return this._httpClient
      .post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]',
        {email, password, returnSecureToken: true});
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
