import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from './authentication.service';
import {Router} from "@angular/router";
import {LoadingController} from "@ionic/angular";
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
    private _router: Router) {
  }

  ngOnInit() {
  }

  public async onLogin() {
    this.isLoading = true;
    this._authenticationService.login();

    const loading = await this._loadingController.create({
      message: 'Loading...',
      duration: 1000,
      spinner: 'circles',
    });

    await loading.present();

    if (await loading.onDidDismiss()) {
      this.isLoading = false;
      await this._router.navigateByUrl('/places/tabs/discover')
    }


    // setTimeout(() => {
    //   this.isLoading = false;
    //   this._router.navigateByUrl('/places/tabs/discover')
    // }, 5000);
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
    }
  }

  onSwitchAuthMode() {
    this.isLogin = !this.isLogin;
  }
}
