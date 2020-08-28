import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { ModalPage } from '../modal/modal.page';
import { BLE } from '@ionic-native/ble/ngx';
import * as aesjs from 'aes-js';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { ConexionmybandService } from '../../services/conexionmyband.service';
import {
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/animations';

@Component({
  selector: 'app-ritmo-cardiaco',
  templateUrl: './ritmo-cardiaco.page.html',
  styleUrls: ['./ritmo-cardiaco.page.scss'],
  animations: [
    trigger('estado', [
      state('activo', style({ width: '90%', height: '90%' })),
      state('inactivo', style({ width: '10%', height: '10%' })),

      transition('activo=>inactivo',
        animate('2500ms ease-in')
      ),

      transition('inactivo=>activo',
        animate('2500ms ease-out')
      )
    ])
  ]

})
export class RitmoCardiacoPage implements OnInit {
  rojo: boolean;
  azul: boolean;
  verde: boolean;
  tcmedio: number = 0;
  inspira: boolean;
  audio = new Audio();
  respiracion;
  estado: string;
  cont: number = 0;
  comenzar = false;
  emparejando = false;
  myband = false;
  device;
  enable = false;
  idDevice;
  ritmocardiacoactual = [];
  key = new Uint8Array([0x30, 0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x40, 0x41, 0x42,
    0x43, 0x44, 0x45]);
  key2;
  buffer;
  parar;
  keymergeada: string = "0";
  mybandBD;
  card1: boolean;
  card2: boolean;
  card3: boolean;
  impulsividad = false;
  ira = false;
  tristeza = false;
  miedo = false;
  preocupacion = false;
  slide1 = false;
  slide2 = false;
  slide3 = false;
  slide4 = false;

  constructor(private ConexionBand: ConexionmybandService, private auth: AuthService, private toastController: ToastController, public alertController: AlertController, private modalCtrl: ModalController, private ble: BLE, private ngZone: NgZone) { }

  ngOnInit() {
    this.ngZone.run(() => {
      this.azul = false;
      this.verde = false;
      this.rojo = true;
      this.estado = 'inactivo'; this.inspira = true; this.card1 = true; this.card2 = true; this.card3 = true;
    });
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
    this.ble.isEnabled().then(data => { this.enable = true; }).catch(() => { this.myband = false; this.enable = false; this.presentAlert(); })
  }

//conecta bluetooth
  bluetoothConnect() {

    this.ConexionBand.bluetoothConnect();

  }

  async presentToast(mensaje) {
    const toast = await this.toastController.create({
      message: mensaje,
      position: 'top',
      animated: true,
      cssClass: "my-custom-class",
      translucent: true,
      duration: 5000

    });
    toast.present();
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Bluetooth desconectado ',
      message: 'El bluetooth no está conectado, si no lo conectas no es posible la utilizar esta función, quieres conectarlo?',
      buttons: [{
        text: 'cancel',
        role: 'cancel',
        handler: blah => {

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

  //Abre modal con distintos dispositivos encontrados
  async openModal() {
    this.ConexionBand.isEnabled();
    const modal = await this.modalCtrl.create({
      component: ModalPage
    });
    modal.onDidDismiss()
      .then((data) => {
        const user = data['data'];
        this.device = user; 
        if (typeof this.device === 'undefined') {
          this.myband = false;
          this.emparejando = false;

        } else { this.deviceSelected(this.device); }

      });
    return await modal.present();

  }

  //Lee el ritmo cardiaco
  leerRit() {
    this.ngZone.run(() => {
      this.ConexionBand.ritmocardiacoactual.subscribe(data => {
        if (data != 0) {
          if (this.tcmedio + 5 < data) {
            this.rojo = true;
            this.verde = false;
            this.azul = false;
          } else if (this.tcmedio == data || (this.tcmedio + 5 > data && this.tcmedio < data)) {
            this.verde = true;
            this.rojo = false;
            this.azul = false;

          } else if (this.tcmedio > data) {
            this.azul = true;
            this.rojo = false;
            this.verde = false;
          }
        }

        this.ritmocardiacoactual.push(data);
        this.cont++;
      });

    });
    this.ConexionBand.leerRitmoCardiaco();
    this.parar = setInterval(() => {
      if (this.cont == 6) {
        clearInterval(this.parar);
      } else {
        this.ConexionBand.leerRitmoCardiaco();
      }
    }, 10000);


  }

  //Comienza el juego
  comenzarEjercicio() {
    this.comenzar = true;
    this.slide1 = true;

  }

//conecta a device
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

  //Pasa las distintas pantallas
  siguiente() {
    if (this.slide1 == true) {
      this.slide1 = false;
      this.slide2 = true;
    } else if (this.slide2 == true) {
      this.slide2 = false;
      this.slide3 = true;
      this.reproducir();
      this.cambio();

      this.auth.getTCMedio().subscribe(data => {
        this.ngZone.run(() => {
          let aux;
          aux = data;
          this.tcmedio = aux.tcMedio;
        });
      });
      this.leerRit();
      this.respiracion = setInterval(() => { this.cambio(); this.inspira = !this.inspira; }, 4000);
      setTimeout(() => {
        clearInterval(this.respiracion);
        this.audio.pause();
        this.auth.setMedida(this.ritmocardiacoactual[1], this.ira, this.tristeza, this.miedo, this.preocupacion, this.impulsividad).
          subscribe(() => { console.log("Introducida la medida correctamente") },
            (err) => { console.log("error al introducir la medida correcta", err) });

        this.ngZone.run(() => {

          this.slide3 = false;
          this.slide4 = true;
        });

      }, 90000);
    } else {
      this.slide1 = false;
      this.slide2 = false;
      this.slide3 = false;
      this.slide4 = false;
      this.comenzar = false;
    }

  }

  ionViewWillLeave() {
    this.comenzar = false;
    this.slide1 = false;
    this.slide2 = false;
    this.slide3 = false;
    this.impulsividad = false;
    this.ira = false;
    this.tristeza = false;
    this.miedo = false;
    this.preocupacion = false;
    this.audio.pause();
    clearInterval(this.respiracion);
    this.azul = false;
    this.rojo = true;
    this.verde = false;

  }

  //Cambia el estado
  cambio() {
    this.estado = (this.estado == 'activo') ? 'inactivo' : 'activo';
  }

  //reproduce el audio
  reproducir() {
    this.audio.src = "../../../assets/cancion.mp3";
    this.audio.load();
    this.audio.play();

  }

}
