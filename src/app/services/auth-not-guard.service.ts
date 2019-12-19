import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root'
})
export class AuthNotGuardService implements CanActivate{

  constructor(public auth:AuthService,private route:Router) { }

  canActivate():boolean{
    if (this.auth.isAuthenticated()){
      this.route.navigate(['home']);
      return false;
    }else{
      return true;
    }
  }
}