import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { ActivatedRoute } from '@angular/router';
import { identity } from 'rxjs';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  public socketId;
  public name;

  userChat = {
    user: '',
    text: ''
  }

  myMessages;
  eventName = 'send-message';
 

  constructor(
    private activated: ActivatedRoute,
    private _chatService: ChatService
    ) {  }

  ngOnInit(){
    console.log("componente chat cargado");
    const id = this.activated.snapshot.params.id;
    //this.userChat.user = id;
  

    this._chatService.listen('text-event').subscribe((data) => {
      this.myMessages = data;
    });
    

  }

  privateMessage(){
    
  }
 
  myMessage(){
    this._chatService.emit(this.eventName, this.userChat);
    this.userChat.text = '';
  }




}
