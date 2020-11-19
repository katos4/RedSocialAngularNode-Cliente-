import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import { Follow } from '../models/follow';


@Injectable()
export class CommentService{
public url: string;

    constructor(private _http: HttpClient){
        this.url = GLOBAL.url;
    }


    addComment(token, comment): Observable<any>{
        let params = JSON.stringify(comment);
        console.log(params);
        
        let headers = new HttpHeaders().set('Content-Type','application/json').set('Authorization', token);
        return this._http.post(this.url + 'comment', params, {headers:headers});
    }

    getComments(token, idPub, page = 1): Observable<any>{
        let headers = new HttpHeaders().set('Content-Type','application/json').set('Authorization', token);

        return this._http.get(this.url + 'get-comments/' + idPub + '/' + page, {headers:headers});
    }
}