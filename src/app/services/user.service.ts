import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import { User } from '../models/user';


@Injectable()
export class UserService{
    public url: string;

    constructor(public _http: HttpClient){
        this.url = GLOBAL.url;
    }

    /**Registrar usuario*/
    register(user: User): Observable<any>{
        //params es lo que va en el body de la peticion y asi es como se llama en el backend
        let params = JSON.stringify(user);
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        
        return this._http.post(this.url+'register', params, {headers: headers});
    }

}