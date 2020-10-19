import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { User } from '../../models/user';
import { Follow } from '../../models/follow';
import { UserService } from '../../services/user.service';
import { FollowService } from '../../services/follow.service';
import { GLOBAL } from '../../services/global';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [UserService, FollowService]
})
export class ProfileComponent implements OnInit {
  public title: string;
  public user: User;
  public status: string;
  public identity;
  public token;
  public url;
  public stats;
  public follow;


  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _followService: FollowService
  ) { 
    this.title = 'Perfil';
    this. identity = this._userService.getIdentity();
    this.token = _userService.gettoken();
    this.url = GLOBAL.url;
  }

  ngOnInit() {
    console.log("componente perfil cargado");
    this.loadPage();
  }

  loadPage(){
    this._route.params.subscribe(params => {
      let id = params['id'];
      this.getUser(id);
      this.getCounters(id);
    });
  }

  getUser(id){
    this._userService.getUser(id).subscribe(
      response => {
        console.log(response);
        if(response.user){
          console.log(response.user);
          this.user = response.user;
        }else{
          this.status='error';
        }
      },
      error => {
        console.log(<any>error);
        this._router.navigate(['/perfil',this.identity._id]);
      }
    );
  }

  getCounters(id){
    this._userService.getCounters(id).subscribe(
      response => {
        console.log(response);
        this.stats = response;
      },
      error => {
        console.log(<any>error);
      }
    );
  }

}
