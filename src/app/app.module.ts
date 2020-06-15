import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { NgxQRCodeModule } from 'ngx-qrcode2';

import { Contacts } from "@ionic-native/contacts/ngx";
import { SMS } from "@ionic-native/sms/ngx";
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, NgxQRCodeModule, 
    AgmCoreModule.forRoot({
    apiKey: 'AIzaSyAP_Xy-1QSclKYAvxSmAZO2BuFAWWAlOZQ',
    libraries: ['places']
  })],
  providers: [
    StatusBar,
    SplashScreen,
    QRScanner,
    Contacts,
    SMS,
    SQLite,
    NativeGeocoder,
    SocialSharing,

        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
