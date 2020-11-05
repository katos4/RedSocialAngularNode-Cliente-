import { Injectable, EventEmitter, Output} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import * as io from 'socket.io-client';
import { environment } from '../../environments/environment';
import { UserService } from './user.service';


export class ChatService {

    socket;
    server = 'http://localhost:5000';
    public identity;
    constructor(
      
    ){
     
     /* const localUser = localStorage.getItem('identity');
      
      if(localUser){
         this.socket = io.connect(this.server);
         //OBTENER EL ID DEL SOCKET CONECTADO EN EL SERVIDOR
         this.socket.on('connect', () => {
         //console.log(this.socket.id, this.socket.io.engine.id, this.socket.json.id);
         localStorage.setItem('socket-id', this.socket.id);
         this.identity = JSON.parse(localUser);
         this.identity['socketId'] = this.socket.id;
         localStorage.setItem('identity', JSON.stringify(this.identity)); 
         });  
      }*/
      this.socket = io.connect(this.server);
     }

     listen(eventName: String){
         return new Observable((suscriber) => {
            this.socket.on(eventName, (data) => {
                suscriber.next(data);
            });
         });
     }

     emit(eventName: String, data: any){
        this.socket.emit(eventName, data);
     }

    emitPrivate(eventName: string, data: any){
       // this.socket.io.to(socketId).emit(eventName, data);
    }
}