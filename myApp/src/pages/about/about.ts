import { Component } from '@angular/core';

import { NavController, Events } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { BLE } from '@ionic-native/ble';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';

import { HomePage } from '../home/home';

@Injectable()


@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  devices: any;
  listDevices: any;
  discoverDevices: any;
  data: any;
  private isScanning = false;
  constructor(
    public navCtrl: NavController, 
    public events: Events, 
    private ble: BLE, 
    private bluetoothSerial: BluetoothSerial) {
    this.devices = [];
    this.listDevices = [];
    this.discoverDevices = [];
    this.data = {};
  }

  startScan(seconds, callback) {
    if(this.bluetoothSerial.isEnabled) {
      this.bluetoothSerial.enable();
    }
    this.isScanning = true;
    
    const onDeviceFound = (device) => {
      console.log('Device found:', JSON.stringify(device));
      this.devices.push(device);
    };
    const onError = (err) => {
      console.log('Error while scanning:', err);
    }

    console.log('start scanning ...');
    this.ble.scan([], seconds).subscribe(onDeviceFound, onError);

    this.bluetoothSerial.list().then((result) => {
      this.listDevices = result;
      console.log("已配对", JSON.stringify(result));
      this.bluetoothSerial.discoverUnpaired().then((result) => {
        console.log("未配对",JSON.stringify(result));
        this.discoverDevices = result;
      },(err) => alert(err))
    });
    

    setTimeout(() => {
      this.ble.stopScan().then(() => {
        console.log("Scanning has stopped");
        console.log(JSON.stringify(this.devices));
        this.isScanning = false;
      });
    },3000);

  }

  connectToDevice(device) {
    console.log("Connect To Device");
    console.log(JSON.stringify(device));
    this.bluetoothSerial.connect(device.address).subscribe(
      () => {
          this.bluetoothSerial.read().then((result) => {
          this.data = result;
          this.events.publish('data:readed', result);
          console.log(JSON.stringify(result));
        })
      },
      err => {
          console.log(err);
      },
      () => {
        this.events.publish('user:binded', device);
        this.navCtrl.push(HomePage, {
          data: this.data
        });
      }
    );
  }


}
