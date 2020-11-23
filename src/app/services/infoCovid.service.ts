import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';


@Injectable()
export class InfoCovidService{
public url: string;

    constructor(private _http: HttpClient){
        this.url = GLOBAL.url;
    }

    getCountries(date): Observable<any>{
        return this._http.get('https://api.covid19tracking.narrativa.com/api/' + date);
    }

    getInfo(date, country): Observable<any>{
        return this._http.get('https://api.covid19tracking.narrativa.com/api/' + date + '/country/' + country);
       // return this._http.get('https://api.covid19tracking.narrativa.com/api/' + date + '/country/spain');
    }
}