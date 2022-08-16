import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from './authentication.service';
import {Router} from "@angular/router";
import {AlertController, LoadingController} from "@ionic/angular";
import {NgForm} from "@angular/forms";

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
    this._authenticationService.login();
    this._loadingController
      .create({
        keyboardClose: true,
        message: 'Loading...',
        duration: 1000,
        spinner: 'circles',
      })
      .then(loadingEl => {
        loadingEl.present();
        this._authenticationService.signup(email, password).subscribe(
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
    console.log(email, password);
    if (this.isLogin) {
      //send a request to login server
    } else {
      //send a request to signup server
      this.authenticate(email, password);
      console.log('signup');
    }
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
