import { Injectable } from '@angular/core';
import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Contacts, Contact, ContactName, ContactField } from "@ionic-native/contacts/ngx";
import { SMS } from "@ionic-native/sms/ngx";
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { Event } from "../interfaces";

@Injectable({
  providedIn: 'root'
})
export class DbService {

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

  //  selectedContacts : mcont[] =[];

  event:Event;

  showSave:Boolean=false;

  constructor(private contacts:Contacts, private sms:SMS, private nav: NavController, private platform: Platform,
    private sqlite: SQLite) {
      this.platform.ready().then(() => {
        this.createDB();
      }).catch(error => {
        console.log(error);
      })
     }


     
  createDB() {
    // this.sqlite.deleteDatabase({
    //   name: this.database_name,
    //   location: 'default'
    // }).then(() => {
    //   alert('Contact Table Deleted!');
    // })
    // .catch(e => {
    //   alert("error " + JSON.stringify(e))
    // });

    this.sqlite.create({
      name: this.database_name,
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        this.databaseObj = db;
    //    alert('Contact Database Created!');
      })
      .catch(e => {
        alert("error " + JSON.stringify(e))
      });
  }

  getEventDB(id) {

    this.sqlite.create({
      name: this.database_name,
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        this.databaseObj = db;
    //    alert('Contact Database Created!');


        this.databaseObj.executeSql(`
        SELECT * FROM ${this.table_event}
        WHERE pid = ${id}
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




      })
      .catch(e => {
        alert("error " + JSON.stringify(e))
      });

  }

    async newEvent(event:Event){
      console.log('inside dbservice newevent')
      console.log(event.event_name)
      console.log(event.event_address)
      console.log(event.event_lat)
      this.databaseObj.executeSql(`
      INSERT INTO ${this.table_event} (Name, Ozel, Address, Lat, Lng, Date, Time, Desc) VALUES ('${event.event_name}' , '${event.ozel}', '${event.event_address}' , '${event.event_lat}', '${event.event_lng}', '${event.event_date}', '${event.event_time}', '${event.event_desc}')
    `, [])
      .then(() => {
        alert('Row Inserted!');
        //this.getRows();
      })
      .catch(e => {
        alert("error " + JSON.stringify(e))
      });
    }


    setAttendedService(itemId) {
      if(itemId == 1){
        console.log('attended 1');
      }
  
      this.databaseObj.executeSql(`
        UPDATE ${this.table_name} 
        SET Attend = 1
        WHERE pid = ${itemId}
      `
        , [])
        .then((res) => {
          alert("Attendance Setted!");
 //         this.getRows();
        })
        .catch(e => {
          alert("error " + JSON.stringify(e))
        });
    }

    async getEvent(id):Promise<Event>{
      console.log('inside dbservice Getevent')
      return this.databaseObj.executeSql(`
      SELECT * FROM ${this.table_event}
      WHERE pid = 2
      `, [])
      .then(res => {
        console.log('get event sql result')
        console.log(id)
        console.log(res);
        this.row_event.push(res.rows.item(0));
        console.log('row event sql result')
        console.log(this.row_event[0]);
        // return this.event=res;
        return this.row_event[0];
        console.log('this event sql result')
        console.log(this.event);
      })
      .catch(e => {
        alert("error " + JSON.stringify(e))
      });
      console.log('row event sql result')
      console.log(this.row_event[0]);
      console.log('this event sql result')
      console.log(this.event);
      // return this.event;
    }
}
