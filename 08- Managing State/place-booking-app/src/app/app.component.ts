import {Component} from '@angular/core';
import {AuthenticationService} from './auth/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private _authenticationService: AuthenticationService) {
  }

  public onLogout() {
    this._authenticationService.logout();
  }
}
