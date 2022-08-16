import {Component, OnInit} from '@angular/core';
import {AuthenticationService, AuthResponseData} from './authentication.service';
import {Router} from "@angular/router";
import {AlertController, LoadingController} from "@ionic/angular";
import {NgForm} from "@angular/forms";
import {Observable} from "rxjs";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  public isLoading = false;
  public isLogin = false;

  constructor(
    private _authenticationService: AuthenticationService,
    private _loadingController: LoadingController,
    private _alertController: AlertController,
    private _router: Router) {
  }

  ngOnInit() {
    console.log(this.isLogin);
  }

  public authenticate(email: string, password: string) {
    this.isLoading = true;
    this._loadingController
      .create({
        keyboardClose: true,
        message: 'Loading...',
        duration: 1000,
        spinner: 'circles',
      })
      .then(loadingEl => {
        loadingEl.present();
        let authObservable: Observable<AuthResponseData>;
        if (this.isLogin) {
          authObservable = this._authenticationService.login(email, password);
        } else {
          authObservable = this._authenticationService.signup(email, password);
        }
        authObservable.subscribe(
          resData => {
            console.log(resData);
            this.isLoading = false;
            loadingEl.dismiss();
            this._router.navigateByUrl('/places/tabs/discover');
          },
          errRes => {
            loadingEl.dismiss();
            const code = errRes.error.error.message;
            let message = 'Could not sign you up, please try again.';
            if (code === 'EMAIL_EXISTS') {
              message = 'This email address exists already!';
            } else if (code === 'EMAIL_NOT_FOUND') {
              message = 'This email address not exists!';
            } else if (code === 'INVALID_PASSWORD') {
              message = 'This password not correct!';
            }
            this.showAlert(message);
          }
        );
      });
  }

  onSubmit(authForm: NgForm) {
    if (authForm.invalid) {
      return;
    }
    const email = authForm.value.email;
    const password = authForm.value.password;
    this.authenticate(email, password);
    authForm.reset();
  }

  onSwitchAuthMode() {
    this.isLogin = !this.isLogin;
  }

  private showAlert(message: string) {
    this._alertController
      .create({
        header: 'Authentication failed',
        message: message,
        buttons: ['Okay']
      })
      .then(alertEl => alertEl.present());
  }
}
