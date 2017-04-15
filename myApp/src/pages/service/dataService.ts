import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

  
@Injectable()

export class DataService {  
    static get parameters() {
        return [[Http]];
    }
    baseUrl:String;
    private headers = new Headers({'Content-Type': 'application/json'});
    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
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
        var url= this.baseUrl+ '/api/update';
        return this.http
        .post(url, data, {headers: this.headers})
        .toPromise()
        .then(res => res.json().data)
        .catch(this.handleError);
    }
}