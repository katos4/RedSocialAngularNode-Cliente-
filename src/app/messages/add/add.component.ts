import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';

//modelos
import { Message } from '../../models/message';
import { Follow } from '../../models/follow';
import { User } from '../../models/user';

//servicios
import { FollowService } from '../../services/follow.service';
import { MessageService } from '../../services/message.service';
import { UserService } from '../../services/user.service';
import { GLOBAL } from '../../services/global';
import { HttpClient } from '@angular/common/http';
declare let $: any;


@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css'],
  providers: [FollowService, MessageService]
})
export class AddComponent implements OnInit {
  public message: Message;
  public identity;
  public token;
  public url: string;
  public status;
  public follows = [];
  public options = [];
  myControl = new FormControl();
  filteredOptions: Observable<string[]>;

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
    this.message = new Message('','','','',this.identity._id,'');
  }

  ngOnInit(){
    $('.navbar').removeAttr('hidden');
    this.getMyFollows();
    $('.mi-selector').select2();
  

  this.filteredOptions = this.myControl.valueChanges.pipe(
     startWith(''),
     map((value) => this._filter(value))
   );

  }

private _filter(value: string): string[]{
  const filterValue = value.toString().toLowerCase();
  
  return this.options.filter(option =>
    option.name.toLowerCase().includes(filterValue));
}

  onSubmit(form){
    var idUser;
    var valorInput = $('#autoCompleteSelect').val();
    var textoNombre = valorInput.split('(');
    var textoNick = textoNombre[1].split(')');
    var texto2 = textoNombre[0];
    var nick = textoNick[0];
    var textarea = $('#text').val();

    for(let i = 0; i < this.follows.length; i++){
      if(this.follows[i].user.nick === nick){
        idUser = this.follows[i].user._id;
      }
    }

    this.message.text = textarea;
    this.message.receiver = idUser;
    console.log('id del usuario ' + idUser);
    console.log('mensaje del textarea ' + textarea);
    //console.log(this.message);
   
    this._messageService.addMessage(this.token, this.message).subscribe(
      response => {
        if(response.message){
          this.status = 'success';
          $('#addMessageForm')[0].reset();
        }
      },
      error => {
        this.status = 'error';
        console.log(<any>error);
      }
    );

  }

  getMyFollows(){
    this._followService.getMyFollows(this.token).subscribe(
      response => {
        this.follows = response.follows;
        this.follows.forEach(item => {
          this.options.push({'name':item.user.name + '(' + item.user.nick + ')',
                              'id': item.user._id
                            });
        });
       // console.log(this.follows);
       // console.log(this.options);
      },
      error => {
        console.log(<any>error);
      }
    );
  }


  displayFn(subject){
    return subject ? subject.name : undefined;
  }
//--
}


