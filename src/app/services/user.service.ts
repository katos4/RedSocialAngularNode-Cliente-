import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import { User } from '../models/user';


@Injectable()
export class UserService{
    public url: string;
    public identity;
    public token;
    public stats;

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

    /**Identificar usuario*/
    login(user, gettoken = null): Observable<any>{
        if(gettoken != null){
            user.gettoken = gettoken;
        }

        //console.log(user);
        let params = JSON.stringify(user);
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        
        return this._http.post(this.url+'login', params, {headers: headers});
    }

    /**Obtener los datos del usuario de la propiedad identity almacenada en el localstorage */
    getIdentity(){
       // let identity = JSON.parse(localStorage.getItem('identity'));
        let identity = JSON.parse(sessionStorage.getItem('identity'));

        if(identity != 'undefined'){
            this.identity = identity;
        }else{
            this.identity = null;
        }

        return this.identity;
    }

    /**Obtener el token almacenado en el localstorage */
    gettoken(){
       // let token = localStorage.getItem('token');
        let token = sessionStorage.getItem('token');

        if(token != 'undefined'){
            this.token = token;
        }else{
            this.token = null;
        }
        return this.token;
    }

    /**Obtener las estadisticas almacenadas en el local storage */
    getStats(){
      //  let stats = JSON.parse(localStorage.getItem('stats'));
        let stats = JSON.parse(sessionStorage.getItem('stats'));

        if(stats !== 'undefined'){
            this.stats = stats;
        }else{
            this.stats = null;
        }
        return this.stats;
    }

    /**Obtener las estadisticas del usuario almacenadas en la base de datos */
    getCounters(userId = null): Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                       .set('Authorization', this.gettoken());
        
        if(userId != null){
            return this._http.get(this.url+'counters/'+userId, {headers:headers});
        }else{
            return this._http.get(this.url+'counters', {headers:headers});
        }
    }

    /**Actualizar los datos del usuario */
    updateUser(user: User): Observable<any>{
        let params = JSON.stringify(user);
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                       .set('Authorization', this.gettoken());
    
        return this._http.put(this.url+'update-user/'+user._id, params, {headers:headers});
    }

    /**Obtener todos los usuarios */
    getUsers(page = null): Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                       .set('Authorization', this.gettoken());

        return this._http.get(this.url+'users/'+page, {headers:headers});
    }

    /**Obtener un unico usuario */
    getUser(id): Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                       .set('Authorization', this.gettoken());

        return this._http.get(this.url+'user/'+id, {headers:headers});
    }


    
}