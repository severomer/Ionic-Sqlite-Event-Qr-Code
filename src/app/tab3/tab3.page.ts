import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { DbService } from "../services/db.service";
import { Contacts, Contact, ContactName, ContactField } from "@ionic-native/contacts/ngx";
import { SMS } from "@ionic-native/sms/ngx";
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})

export class Tab3Page {

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

  constructor(private contacts:Contacts, private sms:SMS, private nav: NavController, private platform: Platform,
    private sqlite: SQLite, private dbservice: DbService) {
      this.platform.ready().then(() => {
        this.createDB();
      }).catch(error => {
        console.log(error);
      })
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
      INSERT INTO ${this.table_name} (Name, SurName, Attend) VALUES ('${this.selectedContacts[index].contact.name.givenName}', '${this.selectedContacts[index].contact.name.familyName}', 0)
    `, [])
      .then(() => {
        alert('Contact Inserted!');
        this.getRows();
      })
      .catch(e => {
        alert("error " + JSON.stringify(e))
      });

      }
    
    }

    // window.location.reload();
    this.nav.back() //navigateRoot(); setRoot(this.navCtrl.getActive().component);
    console.log('Saved button clicked')
  }

  copyContact(){
    console.log('begin log in copyContact');
    for (var index in this.myContacts) {
      let newC :mcont = {contact:this.myContacts[index],
      select:false}

      this.selectedContacts.push(newC);

   //   this.selectedContacts[index].contact = this.myContacts[index];
   //   this.selectedContacts[index].select = false;
      console.log(this.myContacts[index]);
    }
  }


  sendSMS(contact:Contact){
  this.sms.send(contact.phoneNumbers[0].value, 'SMS from me!!' );
  }


  createContact(){
    let contact:Contact = this.contacts.create();

    contact.name = new ContactName(null,'Tire','lkk');
    contact.phoneNumbers= [new ContactField('mobile','3345678')];

    contact.save().then(()=>{
      console.log('Contact Saved')
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
        alert('Contact Database Created!');
      })
      .catch(e => {
        alert("error " + JSON.stringify(e))
      });
  }

  // Create table
  createTable() {
    this.databaseObj.executeSql(`
    CREATE TABLE IF NOT EXISTS ${this.table_name}  (pid INTEGER PRIMARY KEY, Name varchar(255), SurName varchar(255), 
    PhoneNum varchar(255), Attend tinyint, EventId INTEGER)
    `, [])
      .then(() => {
        alert('Contact Table Created!');
      })
      .catch(e => {
        alert("error " + JSON.stringify(e))
      });

      this.databaseObj.executeSql(`
      CREATE TABLE IF NOT EXISTS ${this.table_event}  (pid INTEGER PRIMARY KEY, Name varchar(255), Description varchar(255))
      `, [])
        .then(() => {
          alert('Event Table Created!');
        })
        .catch(e => {
          alert("error " + JSON.stringify(e))
        });
  }

  // Create table
  alterTable() {
    this.databaseObj.executeSql(`
    ALTER TABLE  ${this.table_event}  ADD COLUMN Address TEXT
    `, [])
      .then(() => {
        alert('Altered Table!');
      })
      .catch(e => {
        alert("error " + JSON.stringify(e))
      });
  }

  //Inset row in the table
  insertRow() {
    // Value should not be empty
    if (!this.name_model.length) {
      alert("Enter Name");
      return;
    }

    this.databaseObj.executeSql(`
      INSERT INTO ${this.table_event} (Name) VALUES ('${this.name_model}')
    `, [])
      .then(() => {
        alert('Row Inserted!');
        this.getRows();
      })
      .catch(e => {
        alert("error " + JSON.stringify(e))
      });
  }

  // Retrieve rows from table
  getRows() {
    this.databaseObj.executeSql(`
    SELECT * FROM ${this.table_name}
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
  // Enable update mode and keep row data in a variable
  enableUpdate(item) {
    this.updateActive = true;
    this.to_update_item = item;
    this.name_model = item.Name;
  }

  // Update row with saved row id
  updateRow() {
    this.databaseObj.executeSql(`
      UPDATE ${this.table_name}
      SET Name = '${this.name_model}'
      WHERE pid = ${this.to_update_item.pid}
    `, [])
      .then(() => {
        alert('Row Updated!');
        this.updateActive = false;
        this.getRows();
      })
      .catch(e => {
        alert("error " + JSON.stringify(e))
      });
  }


  event(form){
    //  form.ozel="1";
      this.dbservice.newEvent(form.value)
      .then((res)=>{
        console.log('inside New Event')
       // console.log(res.message)
   //     console.log(res.user.access_token)
   //     console.log(res.user.id)
   //     console.log(res.user.name)
      });
    }
  
}


export interface mcont{
  contact:Contact
  select:Boolean
}
