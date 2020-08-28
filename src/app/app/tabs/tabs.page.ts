import { Component, OnInit, OnChanges, SimpleChanges, DoCheck, NgZone } from '@angular/core';
import { PushNotificationService } from 'src/app/services/push-notification.service';
import { ToastController } from '@ionic/angular';
import { FCM } from '@ionic-native/fcm/ngx';
import { Badge } from '@ionic-native/badge/ngx';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { BLE } from '@ionic-native/ble/ngx';
import { AuthService } from 'src/app/services/auth.service';
import { ModalPage } from '../modal/modal.page';
import { ModalController, AlertController } from '@ionic/angular';
import { ConexionmybandService } from '../../services/conexionmyband.service';
@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {
  alturas = ["1.50", "1.51", "1.52", "1.53", "1.54", "1.55", "1.56", "1.57", "1.58", "1.59",
    "1.60", "1.61", "1.62", "1.63", "1.64", "1.65", "1.66", "1.67", "1.68", "1.69",
    "1.70", "1.71", "1.72", "1.73", "1.74", "1.75", "1.76", "1.77", "1.78", "1.79",
    "1.80", "1.81", "1.82", "1.83", "1.84", "1.85", "1.86", "1.87", "1.88", "1.89",
    "1.90", "1.91", "1.92", "1.93", "1.94", "1.95", "1.96", "1.97", "1.98", "1.99",
    "2.00", "2.01", "2.02", "2.03", "2.04", "2.05", "2.06", "2.07", "2.08", "2.09",
    "2.10", "2.11", "2.12", "2.13", "2.14", "2.15", "2.16", "2.17", "2.18", "2.19",
    "2.20", "2.21", "2.22", "2.23", "2.24", "2.25", "2.26", "2.27", "2.28", "2.29"];
  pesos = ["30", "31", "32", "33", "34", "35", "36", "37", "38", "39",
    "40", "41", "42", "43", "44", "45", "46", "47", "48", "49",
    "50", "51", "52", "53", "54", "55", "56", "57", "58", "59",
    "60", "61", "62", "63", "64", "65", "66", "67", "68", "69",
    "70", "71", "72", "73", "74", "75", "76", "77", "78", "79",
    "80", "81", "82", "83", "84", "85", "86", "87", "88", "89",
    "90", "91", "92", "93", "94", "95", "96", "97", "98", "99",
    "100", "101", "102", "103", "104", "105", "106", "107", "108", "109",
    "110", "111", "112", "113", "114", "115", "116", "117", "118", "119",
    "120", "121", "122", "123", "124", "125", "126", "127", "128", "129",

  ];
  first;
  firstConexion;
  finmedicion;
  comienzo;
  ritmocardiacoactual = [];
  cont: number = 0;
  parar;
  comenzar = false;
  device = "";
  sexo = "";
  altura = "";
  peso = "";
  deporte = "";
  impulsividad = false;
  ira = false;
  tristeza = false;
  miedo = false;
  preocupacion = false;
  slide1 = false;
  slide2 = false;
  slide3 = false;
  notificationNumber = 0;
  emparejando = false;
  myband = false;
  enable = false;
  constructor(private authService: AuthService, private alertController: AlertController, private ble: BLE, private modalCtrl: ModalController, private ConexionBand: ConexionmybandService, private badge: Badge, private ngZone: NgZone, private fcm: FCM, private toastController: ToastController, private notificationService: PushNotificationService) {

  }

  ngOnInit() {
    this.authService.getFirstConexion().subscribe((data) => {
      this.ngZone.run(() => {
        this.firstConexion = data;
        this.first = this.firstConexion.firstConexion;
      });
    });

    this.finmedicion = false;
    this.comienzo = false;
    this.slide1 = true;
    this.slide2 = false;
    this.slide3 = false;
    this.ConexionBand.myband.subscribe(data => {
      this.ngZone.run(() => {
        this.myband = data;
      });
    });
    this.ConexionBand.enable.subscribe(data => {
      this.ngZone.run(() => {
        this.enable = data;
      });
    });
    this.ConexionBand.emparejando.subscribe(data => {
      this.ngZone.run(() => {
        this.emparejando = data;
      });
    });
    this.ble.isEnabled().then(data => { this.enable = true; }).catch(() => { this.myband = false; this.enable = false; this.emparejando = false; })

    this.notificationService.getNumberNotification().subscribe(res => {

      this.notificationNumber = res;
      this.badge.set(20);
    })

    this.notificationService.refreshNumberNotifications();
    this.fcm.onNotification().subscribe(data => {

      this.presentToast(data.title);


    });
    /*
    this.finmedicion=false;
    this.comienzo=false;
 this.enable=true;
 this.emparejando=true;
 this.myband=true;
 this.slide1=false;
 this.slide2=false;
 this.slide3=false;
 */
  }



  async presentToast(mensaje) {
    const toast = await this.toastController.create({
      message: "Tienes una nueva notificación -><br/>" + mensaje,
      position: 'top',
      animated: true,
      cssClass: "my-custom-class",
      translucent: true,
      duration: 3000

    });
    toast.present();
  }

  siguiente() {
    if (this.slide1 == true) {
      this.slide1 = false;
      this.slide2 = true;
    } else if (this.slide2 == true) {
      this.slide2 = false;
      this.slide3 = true;
    } else {
      this.slide1 = false;
      this.slide2 = false;
      this.slide3 = false;
    }

  }


  async openModal() {
    this.ConexionBand.isEnabled();

    const modal = await this.modalCtrl.create({
      component: ModalPage
    });
    modal.onDidDismiss()
      .then((data) => {
        const user = data['data'];
        this.device = user; // Here's your selected user!
        if (typeof this.device === 'undefined') {
          this.myband = false;
          this.emparejando = false;

        } else { this.deviceSelected(this.device); }

        console.log("este es el valor del dispositivo", this.device);


      });
    return await modal.present();

  }

  deviceSelected(device) {
    this.ConexionBand.deviceSelected(device);
    this.ConexionBand.myband.subscribe(data => {
      this.ngZone.run(() => {
        this.myband = data;
      });
    });
    this.ConexionBand.enable.subscribe(data => {
      this.ngZone.run(() => {
        this.enable = data;
      });
    });
    this.ConexionBand.emparejando.subscribe(data => {
      this.ngZone.run(() => {
        this.emparejando = data;
      });
    });
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Bluetooth desconectado ',
      message: 'El bluetooth no está conectado, si no lo conectas no es posible la utilizar esta función, quieres conectarlo?',
      buttons: [{
        text: 'cancel',
        role: 'cancel',
        handler: blah => {
          console.log('Confirm Cancel: blah');
          this.myband = false;
          this.enable = false;

        }
      }, {
        text: 'aceptar',
        handler: blah => {
          console.log('Activando bluetoothh .....');
          this.ble.enable().then(
            data => {
              console.log("bluetooth activado")
              this.enable = true;

            }
          ).catch(
            data => {
              console.log("error conectado el bluetooth", data);
              this.myband = false
              this.enable = false;

            });
        }
      }

      ]
    });

    await alert.present();
  }


  isEnable() {
    if (this.slide3 == true) {
      this.ble.isEnabled().then(data => { this.enable = true; }).catch(() => { this.myband = false; this.enable = false; this.presentAlert(); })
    }
  }

  bluetoothConnect() {
    this.ConexionBand.bluetoothConnect();


  }


  leerRit() {

    this.ngZone.run(() => { ; this.comienzo = true; this.ConexionBand.ritmocardiacoactual.subscribe(data => { this.ritmocardiacoactual.push(data); this.cont++; }); });



    this.ConexionBand.leerRitmoCardiaco();

    this.parar = setInterval(() => {

      if (this.cont == 4) {

        clearInterval(this.parar);
        this.ngZone.run(() => { this.comienzo = false; this.finmedicion = true; });

      } else {

        this.ConexionBand.leerRitmoCardiaco();
      }
    }, 15000);

  }

  irapp() {

    let cont = 0;
    let ritmoCardiaco: number = 0;
    for (var ritmo in this.ritmocardiacoactual) {
      ritmoCardiaco += this.ritmocardiacoactual[ritmo];
      cont++;
    }

    ritmoCardiaco = ritmoCardiaco / (cont - 1);
    this.authService.setDataUser(this.sexo, this.altura, this.peso, this.deporte, ritmoCardiaco).
      subscribe(() => { console.log("Introducido correctamente los valores del usuario") },
        (err) => { console.log("error al introducir los nuevos valores del usuario", err) });


    this.authService.setMedida(ritmoCardiaco, this.ira, this.tristeza, this.miedo, this.preocupacion, this.impulsividad).
      subscribe(() => { console.log("Introducida la medida correctamente") },
        (err) => { console.log("error al introducir la medida correcta", err) });


    let data = {
      "title": "Bienvenido al equipo de autorregulacion emocional!!!",
      "body": "Que ganas teníamos de que formaras parte de nosotros, esta app es para ayudarte y conseguir con nuestra ayuda que te encuentres bien, hemos diseñado unos cuantos ejercicios para que puedas realizarlos y llegar a tus objetivos. Gracias por confiar en nosotros!",
      "data": "Gracias"
    }
    this.notificationService.addNotification(data).subscribe(res => {
      this.notificationService.getNotifications().subscribe(res => {

        setTimeout(() => {
          let data = {
            "title": "Bienvenido al equipo de autorregulacion emocional!!!",
            "body": " Que ganas teníamos de que formaras parte de nosotros, esta app es para ayudarte y conseguir con nuestra ayuda que te encuentres bien, hemos diseñado unos cuantos ejercicios para que puedas realizarlos y llegar a tus objetivos. Gracias por confiar en nosotros!",
            "titulo": "Bienvenido a autorregulación emocional",
            "cuerpo": "Estupendo! Te has registrado satisfactoriamente a nuestra app y ya formas parte del equipo, bienvenido!!",
            "data": "Gracias"
          };
          this.notificationService.sendNotification(data);
        }, 1000);
      }, err => { console.log(err) });
      console.log(res)
    },
      err => {
        console.log("Error en el envío de la notificación", err);
      });


    this.ngZone.run(() => {
      this.slide1 = false;
      this.slide2 = false;
      this.slide3 = false;
      this.first = false;
    });
  }

}



