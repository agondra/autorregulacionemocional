import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate{

  constructor(public auth:AuthService, private route:Router) { }

  canActivate():boolean{
    if (this.auth.isAuthenticated()){
      return true
    }else{
      this.route.navigate(['login']);
      return false;
    }
  }
}
