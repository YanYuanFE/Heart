import { Component } from '@angular/core';

import { NavController, Events, Platform } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { BLE } from '@ionic-native/ble';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { Storage } from '@ionic/storage';
import { DataService } from '../service/dataService';

import {Observable} from 'rxjs/Rx';

@Injectable()


@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
  providers: [DataService]
})
export class AboutPage {
  devices: any;
  listDevices: any;
  discoverDevices: any;
  data: any;
  status: any;
  mock: any;
  user: any;
  index: any;
  input: any;
  currentData:any;
  private isScanning = false;
  constructor(
    private storage: Storage,
    public navCtrl: NavController, 
    public events: Events, 
    private platform: Platform,
    private ble: BLE, 
    private bluetoothSerial: BluetoothSerial,
    private dataService: DataService) {
    this.devices = [];
    this.listDevices = [];
    this.discoverDevices = [];
    this.data = [];
    this.index = 0;
    this.status = '未连接';
    this.mock = '';
    this.user = '';
    this.currentData = {};
    storage.ready().then(() => {
       storage.get('device').then((val) => {
         this.user = val;
       })
     });
  }

  ionViewDidLoad() {
    this.bluetoothSerial.list().then((result) => {
      this.listDevices = result;
      console.log("已配对", JSON.stringify(result));
    });
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
    },8000);

  }

  connectToDevice(device) {
    console.log("Connect To Device:", device);
    console.log(device.address);
    this.bluetoothSerial.connectInsecure(device.address).subscribe(
      (res) => {
          this.status = '连接成功';
          this.storage.ready().then(() => { this.storage.set('device', device.address); })
          this.events.publish('user:binded', device);
          this.bluetoothSerial.subscribe('\n').subscribe((data) => {
            this.mock = data;
            console.log(JSON.stringify(data));
            this.data[this.index++] = data.toString().replace(/\n/,'');
            if(this.index > 2) {
                console.log(this.data);
                let heart = {
                    systolic: this.data[0],
                    diastolic: this.data[1],
                    rate: this.data[2],
                    time: new Date(),
                    user:device.address
                  }
                this.dataService.postData(heart).subscribe(
                  data => {
                    console.log(data);
                    return true;
                  },
                  error => {
                    return Observable.throw(error);
                  }
                );
                Object.assign(this.currentData,heart);
                console.log(this.currentData);
                this.events.publish('data:readed', this.currentData);
            }
          });
          return true;
          
      },
      (err) => {
          console.log(JSON.stringify(err));
      }
    );
  }

  send() {
    console.log(this.input);
    this.bluetoothSerial.write(this.input).then(
      (res) => alert(res), (err) => alert(err));
  }


}
