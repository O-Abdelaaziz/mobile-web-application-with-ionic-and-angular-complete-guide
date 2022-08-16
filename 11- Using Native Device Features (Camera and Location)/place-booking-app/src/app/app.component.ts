import {Component} from '@angular/core';
import {AuthenticationService} from './auth/authentication.service';
import {Platform} from '@ionic/angular';
import {Plugins, Capacitor} from '@capacitor/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private _authenticationService: AuthenticationService) {
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (Capacitor.isPluginAvailable('SplashScreen')) {
        Plugins.SplashScreen.hide();
      }
    });
  }

  public onLogout() {
    this._authenticationService.logout();
  }
}
