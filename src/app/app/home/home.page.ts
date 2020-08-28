import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ToastController } from '@ionic/angular';
import { Chart } from 'chart.js';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild('barChart', { static: false }) barChart;
  @ViewChild('hrzBars2', { static: false }) hrzBars2;
  bars: any;
  colorArray: any;
  medidas: any[];
  tc: any[] = [];
  fecha: any[] = [];
  emociones = [0, 0, 0, 0, 0];
  loading: any;
  contenido:boolean;
  contenido2:boolean;
  constructor(private ngZone: NgZone, private auth: AuthService, private loadingCtrl: LoadingController) { }

  ngOnInit() {
    
    this.generateColorArray(7);
    this.presentLoading();
    this.ngZone.run(() => {
      this.contenido=true;
      this.contenido2=true;
      this.auth.getMedidas().subscribe(res => {
        

        this.medidas = this.sortJSON(res, 'startDate', 'desc');
        let medida;
        let i = 0;
        for (medida in this.medidas) {
          if (i < 7) {
            console.log(this.medidas);
            console.log("medidas",this.medidas[i].ira)
            this.tc.push(this.medidas[i].tc);
            this.fecha.push(new Date(this.medidas[i].startDate).toLocaleString("es-ES", { day: "numeric", month: "long" }));
            if (this.medidas[i].ira) {
              this.emociones[0]++;
            }
            if (this.medidas[i].tristeza) {
              this.emociones[1]++;
            }
            if (this.medidas[i].miedo) {
              this.emociones[2]++;
            }
            if (this.medidas[i].preocupacion) {
              this.emociones[3]++;
            }
            if (this.medidas[i].impulsividad) {
              this.emociones[4]++;
            }

            i++;
          } else {
            break;
          }
        }
        this.createBarChart();
        this.createHrzBarChart2();
        setTimeout(() => { this.loadingCtrl.dismiss() }, 1500);
      }, err => {
        console.log(err);
        setTimeout(() => { this.loadingCtrl.dismiss(); }, 500);
      });
    });

  }
  ionViewDidEnter() {

  }

  sortJSON(data, key, orden) {
    return data.sort(function (a, b) {
      var x = a[key],
        y = b[key];

      if (orden === 'asc') {
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
      }

      if (orden === 'desc') {
        return ((x > y) ? -1 : ((x < y) ? 1 : 0));
      }
    });
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      message: 'loading'

    });
    return this.loading.present();
  }

  createBarChart() {
    this.bars = new Chart(this.barChart.nativeElement, {
      type: 'bar',
      data: {
        labels: this.fecha,
        datasets: [{
          label: 'pulsaciones por minuto',
          data: this.tc,
          backgroundColor: this.colorArray,
          borderColor: this.colorArray,
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  }

  generateColorArray(num) {
    this.colorArray = [];
    for (let i = 0; i < num; i++) {
      this.colorArray.push('#' + Math.floor(Math.random() * 16777215).toString(16));
    }
  }

  createHrzBarChart2() {
    this.generateColorArray(5);
    this.bars = new Chart(this.hrzBars2.nativeElement, {
      type: 'horizontalBar',
      data: {
        labels: ['Ira', 'Tristeza', 'Miedo', 'Preocupación', 'Impulsividad'],
        datasets: [{
          label: 'Emociones más recurrentes en los últimos 7 días',
          data: this.emociones,
          backgroundColor: this.colorArray,
          borderColor: this.colorArray,
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  }

  refresco(event) {
    this.generateColorArray(7);
    this.ngZone.run(() => {
      this.auth.getMedidas().subscribe(res => {
        console.log(res);

        this.medidas = this.sortJSON(res, 'startDate', 'desc');
        let medida;
        let i = 0;
        this.tc = [];
        this.fecha = [];
        for (medida in this.medidas) {
          if (i < 7) {
            this.tc.push(this.medidas[i].tc);
            this.fecha.push(new Date(this.medidas[i].startDate).toLocaleString("es-ES", { day: "numeric", month: "long" }));
            i++;
          } else {
            break;
          }
        }
        this.createBarChart();
        this.createHrzBarChart2();
        event.target.complete();
      }, err => {
        console.log(err);
        setTimeout(() => { event.target.complete(); }, 500);
      });
    });

  }

}





