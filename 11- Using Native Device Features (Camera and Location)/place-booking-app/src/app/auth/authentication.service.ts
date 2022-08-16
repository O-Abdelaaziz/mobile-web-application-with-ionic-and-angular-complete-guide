import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, from} from 'rxjs';
import {User} from './user.model';
import {map, tap} from 'rxjs/operators';
import {Preferences} from '@capacitor/preferences';

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
  private _user = new BehaviorSubject<User>(null);

  constructor(private _httpClient: HttpClient) {
  }

  get userId() {
    return this._user.asObservable().pipe(
      map(user => {
        if (user) {
          return user.id;
        } else {
          return null;
        }
      }));
    ;
  }

  get userIsAuthenticated() {
    return this._user.asObservable().pipe(
      map(user => {
        if (user) {
          return !!user.token;
        } else {
          return false;
        }
      }));
  }

  signup(email: string, password: string) {
    return this._httpClient
      .post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[Your_Key]',
        {email: email, password: password, returnSecureToken: true})
      .pipe(
        tap(
          this.setUserDate.bind(this)));
  }

  autoLogin() {
    return from(Preferences.get({key: 'authData'})).pipe(
      map(storedData => {
        if (!storedData || !storedData.value) {
          return null;
        }
        const parsedData = JSON.parse(storedData.value) as {
          token: string;
          tokenExpirationDate: string;
          userId: string;
          email: string;
        };
        const expirationTime = new Date(parsedData.tokenExpirationDate);
        if (expirationTime <= new Date()) {
          return null;
        }
        const user = new User(
          parsedData.userId,
          parsedData.email,
          parsedData.token,
          expirationTime
        );
        return user;
      }),
      tap(user => {
        if (user) {
          this._user.next(user);
        }
      }),
      map(user => {
        return !!user;
      })
    );
  }

  public login(email: string, password: string) {
    return this._httpClient
      .post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[Your_Key]',
        {email: email, password: password, returnSecureToken: true})
      .pipe(
        tap(
          this.setUserDate.bind(this)));
    ;
  }

  public logout() {
    this._user.next(null);
  }

  private setUserDate(userData: AuthResponseData) {
    const expirationTime = new Date(new Date().getTime() + (+userData.expiresIn * 1000));
    this._user.next(new User(userData.localId, userData.email, userData.idToken, expirationTime));
    this.storeAuthData(userData.localId, userData.idToken, expirationTime.toISOString());
  }

  private storeAuthData(userId: string, token: string, tokenExpirationDate: string) {
    const data = JSON.stringify({userId, token, tokenExpirationDate});
    Preferences.set({
      key: 'authData',
      value: data,
    });
  }

}
