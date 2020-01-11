import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(private toastController:ToastController, private authService: AuthService) { }

  ngOnInit() {
  }

  logout() {
    this.authService.logout();
    let toast = this.toastController.create({
      message: 'logout con éxito',
      duration: 3000
    });
    toast.then(toast => toast.present());
  }
}
