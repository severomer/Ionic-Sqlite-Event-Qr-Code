import { Component } from '@angular/core';
import { PhotoService } from '../services/photo.service';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { ToastController } from '@ionic/angular';
import { DbService } from "../services/db.service";


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  qrData : any;
  createdCode : any;
  checkAttend : number;

  constructor(public photoService: PhotoService,
    private qrScanner: QRScanner,
    private dbservice: DbService,
    public toastController: ToastController) { }

    ngOnInit(){

      this.takeQr()
    }

    async presentToast() {
      const toast = await this.toastController.create({
        message: 'Your settings have been saved.',
        duration: 2000
      });
      toast.present();
    }

    async presentToastMessage(cMessage) {
      const toast = await this.toastController.create({
        message: cMessage,
        duration: 2000
      });
      toast.present();
    }

    createCode () {
      this.createdCode = this.qrData;
      console.log(this.createdCode);
    }
  

    async presentToastWithOptions() {
      const toast = await this.toastController.create({
        header: 'Toast header',
        message: 'Click to Close',
        position: 'top',
        buttons: [
          {
            side: 'start',
            icon: 'star',
            text: 'Favorite',
            handler: () => {
              console.log('Favorite clicked');
            }
          }, {
            text: 'Done',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          }
        ]
      });
      toast.present();
    }

    stopQr(){
      this.presentToast();
      console.log('Qr stopped');
      this.qrScanner.destroy();
    }

    takeQr(){
      this.presentToastMessage('Scan QR Started');
      console.log('Qr initializad');
      // Optionally request the permission early
this.qrScanner.prepare()
.then((status: QRScannerStatus) => {
   if (status.authorized) {
     // camera permission was granted
     console.log('Scanned initializad');
     //this.qrScanner.useFrontCamera();
     this.qrScanner.show();

     // start scanning
     let scanSub = this.qrScanner.scan().subscribe((text: string) => {
       this.checkAttend = +text;
       console.log('Scanned something', text, text.length, 'some');
       console.log(text);
       console.log(text.length);
       console.log('something');

       this.presentToastMessage('Press Play To Check');

      // this.qrScanner.useCamera(0);
       this.qrScanner.hide(); // hide camera preview
       scanSub.unsubscribe(); // stop scanning
     });

   } else if (status.denied) {
     // camera permission was permanently denied
     // you must use QRScanner.openSettings() method to guide the user to the settings page
     // then they can grant the permission from there
     console.log('Scanned denied');
   } else {
     // permission was denied, but not permanently. You can ask for permission again at a later time.
     console.log('Scanned deny');
   }
})
.catch((e: any) => console.log('Error is', e));

    }


    check(){
      this.dbservice.setAttendedService(this.checkAttend);
      this.qrScanner.destroy();
      alert(" Guest Attended, number :" + this.checkAttend.toString())
    }


}
