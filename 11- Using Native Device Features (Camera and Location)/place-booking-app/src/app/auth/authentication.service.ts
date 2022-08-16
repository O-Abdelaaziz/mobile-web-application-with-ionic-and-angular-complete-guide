import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

export interface AuthResponseData {
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
      .post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[Your_Key]',
        { email: email, password: password, returnSecureToken: true });
  }


  get userIsAuthenticated() {
    return this._userIsAuthenticated;
  }

  public login(email: string, password: string) {
    return this._httpClient
      .post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[Your_Key]',
        { email: email, password: password, returnSecureToken: true });
  }

  public logout() {
    this._userIsAuthenticated = false;
  }
}
