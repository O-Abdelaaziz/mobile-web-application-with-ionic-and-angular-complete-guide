import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from './authentication.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  public isLoading = false;

  constructor(
    private _authenticationService: AuthenticationService,
    private _router: Router) {
  }

  ngOnInit() {
  }

  public async onLogin() {
    this.isLoading = true;
    this._authenticationService.login();

    setTimeout(() => {
      this.isLoading = false;
      this._router.navigateByUrl('/places/tabs/discover')
    }, 5000);
  }
}
