import { Component } from '@angular/core';

import { NavController, Events } from 'ionic-angular';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {
  device: any;

  constructor(public navCtrl: NavController, public events: Events) {
    this.device = '未绑定';
    events.subscribe('user:binded', (device) => {
      this.device = device.name || device.id;
    });
  }

}
