import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from './authentication.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  constructor(private _authenticationService: AuthenticationService, private _router: Router) {
  }

  ngOnInit() {
  }

  public onLogin() {
    this._authenticationService.login();
    this._router.navigateByUrl('/places/tabs/discover');
  }
}
