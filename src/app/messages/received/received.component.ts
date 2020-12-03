import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { Message } from '../../models/message';
import { Follow } from '../../models/follow';
import { User } from '../../models/user';

import { FollowService } from '../../services/follow.service';
import { MessageService } from '../../services/message.service';
import { UserService } from '../../services/user.service';
import { GLOBAL } from '../../services/global';



@Component({
  selector: 'app-received',
  templateUrl: './received.component.html',
  styleUrls: ['./received.component.css'],
  providers: [FollowService, MessageService]
})
export class ReceivedComponent implements OnInit {
  public message: Message;
  public identity;
  public token;
  public url: string;
  public status;
  public follows;
  public messages: Message[];
  public pages;
  public total;
  public page;
  public nextPage;
  public prevPage;
  public back;
  public msg = 0;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _followService: FollowService,
    private _messageService: MessageService,
    private _userService: UserService
  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.gettoken();
    this.url = GLOBAL.url;
    
   }

  ngOnInit(){
   // console.log('componente received cargado');
    $('.navbar').removeAttr('hidden');
    this.actualPage();
  }

  actualPage(){
    this._route.params.subscribe(params => {
  
      let page = +params['page'];
      this.page = page;

      if(!params['page']){
        page = 1;
      }

      if(!page){
        page = 1;
      }else{
        this.nextPage = page + 1;
        this.prevPage = page - 1;

        if(this.prevPage <= 0){
          this.prevPage = 1;
        }
      }
      //devolver listado de usuarios
      this.getMessages(this.token, this.page);
    });
  }

  getMessages(token, page){
    this._messageService.getMyMessages(token, page).subscribe(
      response => {
        if(!response.messages){
          
        }else{
          this.messages = response.messages;
          this.msg = this.messages.length;
         // console.log(this.msg);
          this.total = response.total;
          this.pages = response.pages;
        }
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  viewMessage(id){
    this.back = 2;
    //console.log("id del mensaje clickado " + id);
    this._router.navigate(['/mensajes/ver-mensaje/' + id + '/' + this.back]);
  }

}

