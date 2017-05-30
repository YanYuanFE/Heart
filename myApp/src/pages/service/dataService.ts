import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()

export class DataService {  
    static get parameters() {
        return [[Http]];
    }
    baseUrl:String;
    constructor(private http:Http) {
        this.baseUrl = 'http://123.206.14.146:3000';
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

    postData(data) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let body = data;
        console.log(data);
        var url= this.baseUrl+ '/api/update';
        return this.http
        .post(url, body, {headers: headers})
        .map((res:Response) => res.json());
    }
}