import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { TranslateConfigService } from '../../services/translate-config.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  selectedLanguage:string;
  credentialsForm: FormGroup;
 
  constructor(private formBuilder: FormBuilder, private authService: AuthService, private route:Router) { 
      }
 
  ngOnInit() {
    this.credentialsForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }
 
  onSubmit() {
    this.authService.login(this.credentialsForm.value).subscribe(()=>{
      this.route.navigate(['home']);
    },
    (err)=>{
      console.log("Error en el login");
    });
  }
 
goSignin(){
  
  this.route.navigate(['signin']);
}

goPolicy(){
  console.log("kdlkjfsljd");
  this.route.navigate(['policy']);
}
}