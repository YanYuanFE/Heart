import { Component, ViewChild, ElementRef } from '@angular/core';

import { NavController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { BLE } from '@ionic-native/ble';

import { DataService } from '../service/dataService';

declare var echarts;
declare var moment;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [DataService]
})
export class HomePage {
  @ViewChild('container') container: ElementRef;
  chart: any;
  private isFetch:boolean = false;
  datas: Array<any>;
  currentData: Object;

  constructor(public navCtrl: NavController,private platform: Platform, private ble: BLE, private dataService: DataService) {
    platform.ready().then(() => {
      this.isFetch = true;

      this.dataService.getAlldata().subscribe(
          data => {
              this.datas = data; 
              console.log(data);
          },
          err => {
              console.log(err);
          }
      );

      this.dataService.getCurrentData().subscribe(
          data => {
              this.currentData = data; 
              console.log(data);
          },
          err => {
              console.log(err);
          },
          () => this.isFetch = false
      );
     
    });

    
  }



  ionViewDidEnter() {
    let ctx = this.container.nativeElement;
    this.chart = echarts.init(ctx);
    this.chart.setOption({
      tooltip : {
        trigger: 'axis',
        axisPointer : {
          type : 'shadow'
        }
      },
      legend: {
        data:['收缩压','舒张压','心率']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        width: '100%',
        height: '100%',
        containLabel: true
      },
      xAxis : [
        {
          type : 'category',
          data : this.datas.map((item) => moment(item.time).format('YYYY-MM-DD HH:mm')),
          axisTick: {
            alignWithLabel: true
          },
          nameTextStyle: {
            color: '#387ef5',
            fontStyle: 'italic',
          }
        }
      ],
      yAxis : [
        {
          type : 'value',
          nameTextStyle: {
            color: '#387ef5',
            fontStyle: 'italic',
          }
        }
      ],
      series : [
        {
          name:'收缩压',
          type:'line',
          data:this.datas.map((item) => item.systolic)
        },{
          name:'舒张压',
          type:'line',
          data:this.datas.map((item) => item.diastolic)
        },{
          name:'心率',
          type:'line',
          data:this.datas.map((item) => item.rate)
        }
      ]
    });
  }


}
