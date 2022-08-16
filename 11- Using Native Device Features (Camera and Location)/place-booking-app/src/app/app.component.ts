import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthenticationService} from './auth/authentication.service';
import {Platform} from '@ionic/angular';
import {Plugins, Capacitor} from '@capacitor/core';
import {Router} from '@angular/router';
import {Subscription} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  public previousAuthState = false;
  private subscription: Subscription;

  constructor(
    private platform: Platform,
    private _authenticationService: AuthenticationService,
    private _router: Router
  ) {
  }

  ngOnInit(): void {
    this.subscription = this._authenticationService.userIsAuthenticated.subscribe(
      (isAuthenticated) => {
        if (!isAuthenticated && this.previousAuthState !== isAuthenticated) {
          this._router.navigateByUrl('/auth');
        }
        this.previousAuthState = isAuthenticated;
      }
    );
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

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
