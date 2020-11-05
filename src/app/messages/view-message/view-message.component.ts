import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { MessageService } from '../../services/message.service';
import { UserService } from '../../services/user.service';
import { GLOBAL } from '../../services/global';


@Component({
  selector: 'app-view-message',
  templateUrl: './view-message.component.html',
  styleUrls: ['./view-message.component.css']
})
export class ViewMessageComponent implements OnInit {
  public token;
  public identity;
  public url;
  public message = [] as any;
  public goBack;
  public status;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _messageService: MessageService,
    private _userService: UserService
  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.gettoken();
    this.url = GLOBAL.url;
   }

  ngOnInit(){
    console.log('componente ver mensaje cargado');
    this.getMessage();
  }

  getMessage(){
    this._route.params.subscribe(params => {
      var messageId = params['id'];
      this.goBack = params['back'];
      this._messageService.getMessage(this.token, messageId).subscribe(
        response => {
          //console.log(response['message']);
          if(this.identity){
            this.message = response['message'];
          }
        },
        error => {
          console.log(<any>error);
        }
      );
    });
  }


  removeMessage(){
    let messageId;
    this.message.forEach(item => {
      messageId = item._id;
    });
    this._messageService.deleteMessage(this.token, messageId).subscribe(
      response => {
        console.log(response.message);
        if(response.message){
          this.status = 'success';
          //setTimeout(this.back, 2000);
          this.back();
        }
      },
      error => {
        this.status = 'error';
        console.log(<any>error);
      }
    );
    //console.log(messageId);
  }


  back(){
    if(this.goBack == 1){
      this._router.navigate(['/mensajes/enviados']);
    }else{
      this._router.navigate(['/mensajes/recibidos']);
    }
  }


}
