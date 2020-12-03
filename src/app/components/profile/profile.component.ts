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
  public followed;
  public following;
  public open;


  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _followService: FollowService
  ) { 
    this.title = 'Mi perfil';
    this. identity = this._userService.getIdentity();
    this.token = _userService.gettoken();
    this.url = GLOBAL.url;
    this.followed = false;
    this.following = false;
    this.open = false;
  }

  ngOnInit() {
    //console.log("componente perfil cargado");
    this.loadPage();

    var height = $(window).height();
    $('.loginPage').height(height);
    $('.navbar').removeAttr('hidden');
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
        //console.log(response);
        if(response.user){
          //console.log(response.user);
          this.user = response.user;
          //console.log(this.user);
          if(response.following[0] && response.following[0]._id){
            this.following = true;
          }else{
            this.following = false;
          }

          if(response.followed[0] && response.followed[0]._id){
            this.followed = true;
          }else{
            this.followed = false;
          }

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
        //console.log(response);
        this.stats = response;
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  followUser(followed){
    var follow = new Follow('', this.identity._id, followed);

    this._followService.addFollow(this.token, follow).subscribe(
      response => {
        this.following = true;
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  unfollowUser(followed){
    this._followService.deleteFollow(this.token, followed).subscribe(
      response => {
        this.following = false;
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  public followUserOver;
  mouseEnter(user_id){
    this.followUserOver = user_id;
  }

  mouseLeave(){
    this.followUserOver = 0;
  }

  openModal(){
   // console.log('modal abierto');
    this.open = true;
    ($('#modalPersonalizadoMoreInfo') as any).css('display'​​​​​​​​​​​​​​​​​​​​​​​​​​​, 'block');​​​​​​
    ($('body') as any).css('position', 'static');
    ($('body') as any).css('height', '100%');
    ($('body') as any).css('overflow', 'hidden');
  }

  closeModal(){
    if (this.open){
      ($('#modalPersonalizadoMoreInfo') as any).css('display'​​​​​​​​​​​​​​​​​​​​​​​​​​​, 'none');​​​​​​
      ($('body') as any).css('position', 'inherit');
      ($('body') as any).css('height', 'auto');
      ($('body') as any).css('overflow', 'visible');
      this.open = false;
    }
  }

//---
}
