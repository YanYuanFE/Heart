import { Component } from '@angular/core';

import { NavController, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {
  device: any;
  user: any;

  constructor(public navCtrl: NavController, public events: Events, private storage: Storage) {
    this.device = '未绑定';
    events.subscribe('user:binded', (device) => {
      this.device = device.name || device.id;
    });
    storage.get('device').then((val) => {
      this.device = '已绑定';
      this.user = val;
    })
  }

}
