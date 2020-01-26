import { Component, OnInit, NgZone } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ToastController } from '@ionic/angular';
import { BLE } from '@ionic-native/ble/ngx';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
devices:any[]=[];
  constructor(private ngZone:NgZone, private ble:BLE, private toastController:ToastController, private authService: AuthService) { }

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

  scan(){
    this.devices=[];
    this.ble.scan([],15).subscribe(device=>this.onDeviceDiscovered(device));
  }

  onDeviceDiscovered(device){
    console.log('Discovered'+JSON.stringify(device, null, 2));
    this.ngZone.run(()=>{
      this.devices.push(device);
      console.log(device);
    });
  }


}
