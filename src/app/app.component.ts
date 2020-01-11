import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateConfigService } from './services/translate-config.service';
import { AuthService } from './services/auth.service';

import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Storage } from '@ionic/storage';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private translateConfigService:TranslateConfigService,
    private authService: AuthService,
    private route:Router,
    private storage:Storage,
    private helper: JwtHelperService
  ) {
    this.initializeApp();
  }

  initializeApp() {
 
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.translateConfigService.getDefaultLanguage();
 
      
    });
  }
}
