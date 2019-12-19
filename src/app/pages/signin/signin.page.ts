import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {

  credentialsForm: FormGroup;
 
  constructor(private alertCtrl:AlertController,private formBuilder: FormBuilder, private authService: AuthService, private route:Router) { }
 
  ngOnInit() {
    this.credentialsForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      repeatPassword: ['', [Validators.required, Validators.minLength(6)]],
      birthDate:['',[Validators.required]],
      name: ['', [Validators.required]],
      surname: ['', [Validators.required]]
      
    });
  }
 
  onSubmit() {
    this.register();
  }
 
  register() {
    this.authService.register(this.credentialsForm.value).subscribe(res => {
     this.alert();
      // Call Login to automatically login the new user
      //crear alerta advirtiendo de email de verificación con redireccion dandole al ok al login
     
    });
  }

  async alert(){
    const alert = await this.alertCtrl.create({
      header: 'Registro realizado con éxito',
      message: 'Se te ha enviado un correo a tu dirección de correo electrónico, una vez lo valides podrás logearte en la app',
      buttons: [ {
        text: 'Ok',
        handler: () => {
          this.route.navigate(['login']);
        }
      }]
    });
    await alert.present();
  
  }

}
