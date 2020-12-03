import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { User } from '../../models/user';
import { Follow } from '../../models/follow';
import { UserService } from '../../services/user.service';
import { FollowService } from '../../services/follow.service';
import { GLOBAL } from '../../services/global';



@Component({
  selector: 'app-following',
  templateUrl: './followed.component.html',
  styleUrls: ['./followed.component.css'],
  providers: [UserService, FollowService]
})
export class FollowedComponent implements OnInit {
  public title: string;
  public url: string;
  public identity;
  public token;
  public page;
  public nextPage;
  public prevPage;
  public total;
  public pages;
  public users: User[];
  public status: string;
  public follows;
  public followUserOver;
  public followed;
  public userPageId;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _followService: FollowService
  ) {
    this.title = "Seguidores";
    this.url = GLOBAL.url;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.gettoken();
   }

  ngOnInit(){
    var height = $(window).height();
    $('.loginPage').height(height);
    $('.navbar').removeAttr('hidden');
    //console.log("componente following se ha cargado");
    this.actualPage();
  }

/** Funcion para saber que pagina es la actual */
actualPage(){
    this._route.params.subscribe(params => {
      let user_id = params['id'];
      this.userPageId = user_id;

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
      this.getFollows(user_id, page);
    });
}


/** Obtener los usuarios que sigo */
getFollows(user_id, page){
  this._followService.getFollowed(this.token, user_id, page).subscribe(
    response => {
      if(!response.follows){
        this.status = 'error';
      }else{
        console.log(response);
        
        this.total = response.total;
        this.followed  = response.follows;
        this.pages = response.pages;
        this.follows = response.users_following;

        if(page > this.pages){
          this._router.navigate(['/gente', 1]);
        }
      }
    },
    error => {
      var errorMessage = <any>error;
      console.log(errorMessage);

      if(errorMessage != null){
        this.status = 'error';
      }
    }
  );
}

/** Accion para cuando el cursor entra en el boton de seguir */
mouseEnter(user_id){
  this.followUserOver = user_id;
}

/** Accion para cuando el cursor sale del boton de seguir */
mouseLeave(user_id){
  this.followUserOver = 0;
}


/** Funcion para empezar a seguir a un usuario */
followUser(followed){
  var follow = new Follow('', this.identity._id, followed);
  this._followService.addFollow(this.token, follow).subscribe(
    response => {

      if(!response.follow){
        this.status = 'error';
      }else{
        this.status = 'success';
        this.follows.push(followed);
      }
    },
    error => {
      var errorMessage = <any>error;
      console.log(errorMessage);

      if(errorMessage != null){
        this.status = 'error';
      }
    }
    );
}

/** Funcion para dejar de seguir a un usuario */
unfollowUser(followed){
  this._followService.deleteFollow(this.token, followed).subscribe(
    response => {
      var search = this.follows.indexOf(followed);
      if(search != -1){
        this.follows.splice(search, 1);
      }
    }, 
    error => {
      var errorMessage = <any>error;
      console.log(errorMessage);

      if(errorMessage != null){
        this.status = 'error';
      }
    }
  );
}

}

