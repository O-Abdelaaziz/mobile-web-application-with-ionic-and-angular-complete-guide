import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from './authentication.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  constructor(private _authenticationService: AuthenticationService) {
  }

  ngOnInit() {
  }

  public onLogin() {
    this._authenticationService.login();
  }
}
