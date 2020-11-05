import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { identity } from 'rxjs';

//modelo
import { User } from '../../models/user';

//servicios
import { ChatService } from '../../services/chat.service';
import { UserService } from '../../services/user.service';
import { MessageService } from '../../services/message.service';





@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  providers:[UserService, ChatService]
})
export class ChatComponent implements OnInit {

  public socketId;
  public name;
  public users: User[];
  public userNames = [];
  public amigos1 = [];
  public amigos2 = [];
  public amigosTotal = [];
  public friends = [];
  public token;
  
  public array1 = [];
  public array2 = [];
  public messages = this.array1.concat(this.array2);


  userChat = {
    user: '',
    text: ''
  }


  myMessages;
  eventName = 'send-message';
 

  constructor(
    private activated: ActivatedRoute,
    private _chatService: ChatService,
    private _userService: UserService,
    private _messageService: MessageService
    ) { 
      this.token = this._userService.gettoken();
     }

  ngOnInit(){
    //console.log("componente chat cargado");
    this.getUserList();
    $('.navbar').removeAttr('hidden');
    const id = this.activated.snapshot.params.id;
    //this.userChat.user = id;
  

    this._chatService.listen('text-event').subscribe((data) => {
      this.myMessages = data;
    });





  //--
  }


  getUserList(){
    this._userService.getUsers().subscribe(
      response => {
        this.users = response.users;

        //comprobar array con mayor longitud
        if(response.users_follow_me.length > response.users_following.length){
          this.amigos1 = response.users_follow_me;
          this.amigos2 = response.users_following;
        }else{
          this.amigos1 = response.users_following;
          this.amigos2 = response.users_follow_me;
        }

        //comparar para encontrar si hay usuarios que sigo y me siguen, si es asi, se consideran 'amigos' y se puede
        //chatear con ellos
        for(let i = 0; i < this.amigos1.length; i++){
          for(let j = 0; j < this.amigos2.length; j++){
            if(this.amigos1[i] == this.amigos2[j]){
              this.amigosTotal.push(this.amigos1[i]);
            }
          }
        }
        
        //para cada id de amigo, traigo el objeto usuario completo
        this.amigosTotal.forEach(id => {
          this._userService.getUser(id).subscribe(
            response => {
              this.friends.push(response.user);
              //console.log(this.friends);
            },
            error => {
              console.log(<any>error);
            }
          );
        });

      },
      error => {
        console.log(<any>error);
      }
    );
  }


  myMessage(){
    this._chatService.emit('send-message', this.userChat);
    this.userChat.text = '';
  }


  getMessages(id){
    //console.log("el id del usuario clickado es " + id);
   /* this._messageService.getAllMesaggesEmitted(this.token, id).subscribe(
      response => {
        response.messages.forEach(element => {
          this.array1.push({'emisor':{'text':element.text, 'created':element.created_at}});
        });
      },
      error => {
        console.log(<any>error);
      }
    );*/

    

  /*  this._messageService.getAllMessagesReceived(this.token, id).subscribe(
      response => {
        response.messages.forEach(element => {
          this.array2.push({'receptor':{'text':element.text, 'created':element.created_at}});
        });
      },
      error => {
        console.log(<any>error);
      }
    );*/

   /* this.array1.forEach(item => {
      this.messages.push(item);
    });

    this.array2.forEach(item => {
      this.messages.push(item);
    });
    console.log(this.messages);*/
    
  }

  

}
