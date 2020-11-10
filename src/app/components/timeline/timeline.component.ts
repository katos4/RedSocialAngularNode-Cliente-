import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { Publication } from '../../models/publications';
import { Like } from '../../models/like';
import { GLOBAL } from '../../services/global';
import { UserService } from '../../services/user.service';
import { LikeService } from '../../services/like.service';
import { PublicationService } from '../../services/publication.service';


import * as $ from 'jquery';



@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css'],
  providers: [UserService, PublicationService, LikeService]
})
export class TimelineComponent implements OnInit {
public identity;
public token;
public title: string;
public url;
public status;
public page;
public total;
public pages;
public itemsPerPage;
public publications: Publication[];
public name: string;
public noMore = false;
public likesArray = [];
public userPubArray = [];
public newLike;
public countLikes;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _publicationService: PublicationService,
    private _likeService: LikeService
  ) { 
    this.title = "Timeline";
    this.identity = this._userService.getIdentity();
    this.token = this._userService.gettoken();
    this.url = GLOBAL.url;
    this.page = 1;
    this.newLike = false;
  }

  ngOnInit() {
    //console.log("componente timeline cargado");
    this.getPublications(this.page);

    var height = $(window).height();
    $('.loginPage').height(height);
    $('.navbar').removeAttr('hidden');

   
    this.getLikes();
    //this.getCountLikes();
    //console.log(this.likesArray);
    //console.log(this.userPubArray);
    
  } 
  
  getCountLikes(id){
    this._likeService.getCountLikes(this.token, id).subscribe(
      response => {
        //console.log(response);
       this.countLikes = response.likes;

       console.log('likes de la publicacion ' + id + ' ==> ' + this.countLikes);
        
       this.publications.forEach(publication => {
        if (publication._id === id){
          publication['likes'] = response.likes;
        }
        });

      },
      error => {
        if (error.message){
          console.log('hay un error');
        }
       // console.log(error as any);
      }
    );
  }

  getPublications(page, adding = false){
    this._publicationService.getPublications(this.token, page).subscribe(
      response => {
        var pubId;
        console.log(response);
        if (response.publications){
          this.total = response.total_items;
          this.pages = response.pages;
          this.itemsPerPage = response.items_per_page;

        

          if (!adding){
            this.publications = response.publications;
            this.publications.forEach(publication => {
              this.getCountLikes(publication._id);
             });
          }else{
            var arrayA = this.publications;
            var arrayB = response.publications;
            console.log("ARRAY A " + arrayA);
            console.log("ARRAY B " + arrayB);

            this.publications = arrayA.concat(arrayB);

            /**scroll animado con jquery cuando se pulsa el boton de ver mas publicaciones */
            $("html, body").animate({scrollTop: $('html').prop("scrollHeight")}, 500);
          }

        }else{
          this.status = 'error';
        }
      },
      error => {
        var errorMessage = <any> error;
        console.log(errorMessage);
        if (errorMessage != null){
          this.status = 'error';
        }
      }
    );
  }

  viewMore(){
    /** Cuando la longitud del array de publicaciones sea igual al total de publicaciones, significará 
     * que no hay mas publicaciones que mostrar
    */

    this.page += 1;
    if (this.page == this.pages){
      this.noMore = true;
    }

    this.getPublications(this.page, true);
  }

  
  refresh(event){
    this.getPublications(1);
  }


  giveLike(idPub){
   // console.log('el id de la publicacion es: ' + idPub);

    var like = new Like('', idPub, this.identity._id, '');
    this._likeService.addLike(this.token, like).subscribe(
      response => {
        if (response){
          this.status = 'success';
          this.likesArray.push(idPub);
          //console.log(this.likesArray);
        }else{
          this.status = 'error';
        }
      },
      error => {
        console.log(error as any);
      }
    );
  }

  unlikePublication(idPub){

    this._likeService.deleteLike(this.token, idPub).subscribe(
      response => {
        var search = this.likesArray.indexOf(idPub);
        if (search != -1){
          this.likesArray.splice(search, 1);
        }
      },
      error => {
        console.log(error as any);
      }
    );
  }


  getLikes(){
    let temp;
    
    this._likeService.getLikes(this.token).subscribe(
      response => {
        temp = response;
       // console.log(temp.myLikes);
        temp.myLikes.forEach(like => {
          this.likesArray.push(like.publication);

          if (!this.userPubArray.includes(like.user)){
            this.userPubArray.push(like.user);
          }
          //console.log(like.publication);
        });

      },
      error => {
        console.log(error as any);
      }
    );
  }

 

//--
}
