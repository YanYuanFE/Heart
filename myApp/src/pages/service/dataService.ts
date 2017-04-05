import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
  
export class DataService {  
    static get parameters() {
        return [[Http]];
    }
    baseUrl:String;
  
    constructor(private http:Http) {
        this.baseUrl = 'http://10.8.12.129:3000';
         
    }
  
    getAlldata() {
        var url = this.baseUrl+'/api/all';
        var response = this.http.get(url).map(res => res.json());
        return response;
    }

    getCurrentData() {
        var url= this.baseUrl+ '/api/getCurrent';
        var response = this.http.get(url).map(res => res.json());
        return response;
    }
}