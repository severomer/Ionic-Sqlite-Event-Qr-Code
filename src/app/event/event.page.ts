import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DbService } from "../services/db.service";
import { Event } from "../interfaces";
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { Contacts, Contact, ContactName, ContactField } from "@ionic-native/contacts/ngx";
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@Component({
  selector: 'app-event',
  templateUrl: './event.page.html',
  styleUrls: ['./event.page.scss'],
})
export class EventPage implements OnInit {
  
  qrData : any;
  createdCode : any;

  staticCode = "Hello";

  eventId: number;
  event:Event;

  databaseObj: SQLiteObject;
  name_model: string = "";
  row_data: any = [];
  row_event: any = [];
  readonly database_name: string = "contact_database.db";
  readonly table_name: string = "mycontacttable";

  readonly table_event: string = "myeventtable";

  // Handle Update Row Operation
  updateActive: boolean;
  to_update_item: any;

  myContacts : Contact[] =[];

  selectedContacts : mcont[] =[];

  fruits: Array<string| boolean> =[]

  showSave:Boolean=false;
  showEvent:Boolean=false;

  href : string;

  // elementType: 'url' | 'canvas' | 'img' = 'url';
  elementType:  'img';

  constructor(private socialSharing: SocialSharing, private contacts:Contacts, private route:ActivatedRoute, private dbservice: DbService, private platform: Platform,
    private sqlite: SQLite) {
      this.platform.ready().then(() => {
        this.eventId = +this.route.snapshot.params['eventId'];
//        this.createDB();
//        this.getEvent();
      }).catch(error => {
        console.log(error);
      })
     }

     downloadImage(){
      this.href = document.getElementsByTagName('img')[1].src;
    }
  
    downloadStaticImage(){
      this.href = document.getElementsByTagName('img')[1].src;
    }

    // yalnizca iphoneda

    // downloadIonicImage(){
    //   this.href = document.getElementsByTagName('img')[1].src;
    //   this.socialSharing.saveToPhotoAlbum( this.href).then(() => {
    //     console.log('download code')
    //   }).catch((error) => {
    //     console.log(error)
    //   });
    // }

    shareoption = {message: null, subject: null, files: this.href, url:  null, chooserTitle:null}
    downloadIonicImage(){
      this.href = document.getElementsByTagName('img')[1].src;
      this.socialSharing.shareWithOptions(this.shareoption).then(() => {
        console.log('download code')
      }).catch((error) => {
        console.log(error)
      });
    }

    downloadShareVia(){
      this.href = document.getElementsByTagName('img')[0].src;
      this.socialSharing.shareVia('com.google.android.apps.photos', null, null, this.href,null).then(() => {
        console.log('download sharevia code')
      }).catch((error) => {
        console.log(error)
      });
    }

     sendShare(message, subject, url) {
      // Bunlar calismiyor
      // let x = document.getElementsByClassName('qr');
      // let y = x[0].children[0].getAttribute('src');

      this.href = document.getElementsByTagName('img')[0].src;

    //  this.socialSharing.share(this.eventId.toString(), subject, null, url);
      this.socialSharing.share('This is yourguest QR Code for  ' + this.row_event[0].Name 
      + 'Address:' + this.row_event[0].Address
      + 'Date and Time:' + this.row_event[0].Date + this.row_event[0].Time, subject, this.href, url).then(() => {
        console.log('Share code')
      }).catch(() => {
        // Sharing via email is not possible
      });

    }  
    sendShareNext(message, subject, url) {
      // Bunlar calismiyor
      // let x = document.getElementsByClassName('qr');
      // let y = x[0].children[0].getAttribute('src');

      this.href = document.getElementsByTagName('img')[1].src;

    //  this.socialSharing.share(this.eventId.toString(), subject, null, url);
      this.socialSharing.share(null, subject, this.href, url).then(() => {
        console.log('Share Next code')
      }).catch(() => {
        // Sharing via email is not possible
      });

    } 

    sendStaticShare(message, subject, url) {
      this.href = document.getElementsByTagName('img')[0].src;
//      this.socialSharing.saveToPhotoAlbum(this.href);
      this.socialSharing.share(null, subject, this.href, url).then(() => {
        console.log('Share static code')
      }).catch(() => {
        // Sharing via email is not possible
      });
    } 

        
    sendWhatsapp() {
      this.href = document.getElementsByTagName('img')[0].src;
//      this.socialSharing.saveToPhotoAlbum(this.href);
      this.socialSharing.shareViaWhatsApp('This is yourguest QR Code for  ' + this.row_event[0].Name 
      + '  Address:' + this.row_event[0].Address
      + '  Date and Time:' + this.row_event[0].Date + this.row_event[0].Time
      ,  this.href, 'https://www.google.com/maps/search/?api=1&query=' + this.row_event[0].Lat + ',' + this.row_event[0].Lng).then(() => {
        console.log('Share static code')
      }).catch(() => {
        // Sharing via email is not possible
      });
    }
     createCode () {
      this.createdCode = this.eventId.toString();
      console.log(this.createdCode);
    }
    
    createQr (item) {
      this.createdCode = item.pid.toString();
      console.log(this.createdCode);
    }
    
      
  createDB() {

    this.sqlite.create({
      name: this.database_name,
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        this.databaseObj = db;
    //    alert('Contact Database Created!');


        this.databaseObj.executeSql(`
        SELECT * FROM ${this.table_event}
        WHERE pid = ${this.eventId}
        `
          , [])
          .then((res) => {
            this.row_event = [];
            if (res.rows.length > 0) {
              for (var i = 0; i < res.rows.length; i++) {
                this.row_event.push(res.rows.item(i));
                console.log('getting events')
              }
            }


            this.getRows();

          })
          .catch(e => {
            alert("error " + JSON.stringify(e))
          });




      })
      .catch(e => {
        alert("error " + JSON.stringify(e))
      });

  }


  loadContacts(){
    this.showSave=true;
    this.selectedContacts=[];
    console.log('log in loadcontact begin');
    let options = {
      filter : '',
      multiple:true,
      hasPhoneNumber:true
    }
    this.contacts.find(['*'], options).then((value:Contact[]) => {
      this.myContacts = value;
      //this.myContacts.push(value)
      console.log('static log in loadcontact');
      console.log(this.myContacts[1]);
      console.log(value[0].name);

      for (var index in this.myContacts) {
        let newC :mcont = {contact:this.myContacts[index],
        select:false}
  
        this.selectedContacts.push(newC);
  
     //   this.selectedContacts[index].contact = this.myContacts[index];
     //   this.selectedContacts[index].select = false;
        console.log(this.selectedContacts[index]);
      }
    })
    .catch( function(error) {
      console.log('error');
    });
    console.log(this.myContacts[0].name.givenName);

  }

  
  saveSelect(){
    this.showSave=false;


    for (var index in this.selectedContacts) {
    
      if (this.selectedContacts[index].select == true) {
        
      
      this.databaseObj.executeSql(`
      INSERT INTO ${this.table_name} (Name, SurName, Attend, EventId) VALUES ('${this.selectedContacts[index].contact.name.givenName}', '${this.selectedContacts[index].contact.name.familyName}', 0, '${this.eventId}')
    `, [])
      .then(() => {
    //    alert('Contact Inserted!');
    console.log('Contact Inserted!');
        this.getRows();
      })
      .catch(e => {
        alert("error " + JSON.stringify(e))
      });

      }
    
    }
    console.log('Saved button clicked')
  }

  
  // Retrieve rows from table
  getRows() {
    this.databaseObj.executeSql(`
    SELECT * FROM ${this.table_name}
    WHERE EventId = ${this.eventId}
    `
      , [])
      .then((res) => {
        this.row_data = [];
        if (res.rows.length > 0) {
          for (var i = 0; i < res.rows.length; i++) {
            this.row_data.push(res.rows.item(i));
          }
        }
      })
      .catch(e => {
        alert("error " + JSON.stringify(e))
      });
  }

  // Retrieve Event rows from table
  getEventRows() {
    this.databaseObj.executeSql(`
    SELECT * FROM ${this.table_event}
    `
      , [])
      .then((res) => {
        this.row_event = [];
        if (res.rows.length > 0) {
          for (var i = 0; i < res.rows.length; i++) {
            this.row_event.push(res.rows.item(i));
          }
        }
      })
      .catch(e => {
        alert("error " + JSON.stringify(e))
      });
  }

    // Set attnedance true 
    setAttended(item) {
      if(item.Attend == 0){
        console.log('attend 0');
      }
  
      this.databaseObj.executeSql(`
        UPDATE ${this.table_name} 
        SET Attend = 1
        WHERE pid = ${item.pid}
      `
        , [])
        .then((res) => {
          alert("Attendance Setted!");
          this.getRows();
        })
        .catch(e => {
          alert("error " + JSON.stringify(e))
        });
    }

  ngOnInit() {
    this.eventId = +this.route.snapshot.params['eventId'];
    this.createDB();
    // this.getRows();
    // this.databaseObj.executeSql(`
    //   SELECT * FROM ${this.table_event}
    //   WHERE pid = ${this.eventId}
    //   `, [])
    //   .then((res) => {
    //     this.row_event = [];
    //     if (res.rows.length > 0) {
    //       for (var i = 0; i < res.rows.length; i++) {
    //         this.row_event.push(res.rows.item(i));
    //       }
    //     }
    //   })
    //   .catch(e => {
    //     alert("error " + JSON.stringify(e))
    //   });

    // console.log('this event Event Page')
    // console.log(this.event);
    // console.log(this.row_event[0]);
    // console.log(this.row_event[0].Name);

  }

  // async ngOnInit() {
  //   this.eventId = +this.route.snapshot.params['eventId'];

  //   this.event = await this.dbservice.getEvent(this.eventId);

  //   console.log('this event Event Page')
  //   console.log(this.event);
  // }

  getEvent(){
    this.databaseObj.executeSql(`
      SELECT * FROM ${this.table_event}
      WHERE pid = ${this.eventId}
      `, [])
      .then((res) => {
        this.row_event = [];
        if (res.rows.length > 0) {
          for (var i = 0; i < res.rows.length; i++) {
            this.row_event.push(res.rows.item(i));
          }
        }
      })
      .catch(e => {
        alert("error " + JSON.stringify(e))
      });

    console.log('this event Event Page')
    console.log(this.event);
    console.log(this.row_event[0]);
    console.log(this.row_event[0].Name);
  }


  // Delete single row 
  deleteRow(item) {
    this.databaseObj.executeSql(`
      DELETE FROM ${this.table_name} WHERE pid = ${item.pid}
    `
      , [])
      .then((res) => {
        alert("Row Deleted!");
        this.getRows();
      })
      .catch(e => {
        alert("error " + JSON.stringify(e))
      });
  }

  async goEvent(){
    //this.event = await this.dbservice.getEvent(this.eventId);

    console.log('goEvent function Event Page')
    console.log(await this.dbservice.getEvent(this.eventId));
  }
}


export interface mcont{
  contact:Contact
  select:Boolean
}