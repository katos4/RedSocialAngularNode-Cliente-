import { Component, OnInit, DoCheck } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GLOBAL } from '../../services/global';
import * as $ from 'jquery';

//modelos
import { Publication } from '../../models/publications';
import { Like } from '../../models/like';
import { Comment } from '../../models/comment';

//servicios
import { UserService } from '../../services/user.service';
import { LikeService } from '../../services/like.service';
import { PublicationService } from '../../services/publication.service';
import { CommentService } from '../../services/comment.service';


@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css'],
  providers: [UserService, PublicationService, LikeService, CommentService]
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
public noMoreComments = false;
public likesArray = [];
public userPubArray = [];
public newLike;
public countLikes;
public comment: Comment;
public comments: Comment[];
public open;
public existPublication = 0;

public pageComments;
public totalComments;
public itemsPerPageComments;
public pagesComments;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _publicationService: PublicationService,
    private _likeService: LikeService,
    private _commentService: CommentService
  ) { 
    this.title = "Timeline";
    this.identity = this._userService.getIdentity();
    this.token = this._userService.gettoken();
    this.url = GLOBAL.url;
    this.page = 1;
    this.pageComments = 1;
    this.newLike = false;
    this.comment = new Comment('', '', this.identity._id, '' , '');
    this.open = false;
  
  }

  ngOnInit() {
    const height = $(window).height();
    $('.loginPage').height(height);
    $('.navbar').removeAttr('hidden');

    this.getPublications(this.page);
    this.getLikes();
    this.autoScroll();

  }

  ngDoCheck(){
   //this.getPublications(this.page);
   }

  getCountLikes(id){
    this._likeService.getCountLikes(this.token, id).subscribe(
      response => {
        //console.log(response);
       this.countLikes = response.likes;

       //console.log('likes de la publicacion ' + id + ' ==> ' + this.countLikes);
        
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

  public idPublication;
  getAllComments(idPub, page, adding = false){
    this.idPublication = idPub;
    this._commentService.getComments(this.token, idPub, page).subscribe(
      response => {
        this.totalComments = response.total_items;
        this.pagesComments = response.pages;
        this.itemsPerPageComments = response.items_per_page;
        console.log(response);

        this.publications.forEach(publication => {
          if (publication._id === idPub){
            if(!adding){
              this.comments = response.comments;
            }else{
              var arrayA = this.comments;
              var arrayB = response.comments;

              this.comments = arrayA.concat(arrayB);
            }
          }
        });
      },
      error => {
        console.log(error as any);
      }
    );
  }

  getPublications(page, adding = false){
    var temporal;
    this._publicationService.getPublications(this.token, page).subscribe(
      response => {
        if (response.publications){
          // console.log(response.publications);
           this.total = response.total_items;
           this.pages = response.pages;
           this.itemsPerPage = response.items_per_page;

           if (!adding){
            this.publications = response.publications;
            this.existPublication = this.publications.length;
           // console.log(this.existPublication);
            this.publications.forEach(publication => {
              this.getCountLikes(publication._id);
              this.getComments(publication._id);

            });
          }else{
            var arrayA = this.publications;
            var arrayB = response.publications;
            // console.log("ARRAY A " + arrayA);
            // console.log("ARRAY B " + arrayB);

            this.publications = arrayA.concat(arrayB);

            /** scroll animado con jquery cuando se pulsa el boton de ver mas publicaciones */
            // $("html, body").animate({scrollTop: $('html').prop("scrollHeight")}, 500);
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


  viewMoreComments(){
    this.pageComments += 1;
    if(this.pageComments === this.pagesComments){
      this.noMoreComments = true;
    }
    console.log(this.pageComments);
    this.getAllComments(this.idPublication, this.pageComments, true);
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

/**Obtener los likes */
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

  /**Funcion añadir comentario que se llama desde el html */
  sendComment(publicationId){
    var idPub = publicationId;
    this.comment.publication = idPub;
    $('#comment-text-input').css({border: 'none'});
    if( $('#comment-text-input').val() !== ''){
      this.addComment(idPub, this.comment);
      $('#comment-text-input').css({border: 'none'});
    }else{
      $('#comment-text-input').css({border: '2px solid', 'border-color': '#c91d16',});
      console.log('el input está vacio');
    }
  }

  /**Funcion añadir comentario que llama al servicio */
  addComment(id, comment){
    this._commentService.addComment(this.token, comment).subscribe(
      response => {
       // console.log(response.comment.text);
        if (response.comment.text){
          this.getComments(id);
         // $('#comment-text-input').val('');
          this.comment.text = '';
        }
      },
      error => {
        console.log(<any> error);
      }
    );
  }

  /**Obtener los comentarios y quedarse con los dos ultimos para mostrarlos */
  getComments(idPub){
    // var idPub = '5fa6d064992c5b6de458ff02';
    this._commentService.getComments(this.token, idPub).subscribe(
      response => {
        // console.log(response.comments);
        this.publications.forEach(publication => {
          if (publication._id == idPub){
            if (response.comments.length >= 3){
              publication['comments'] = response.comments.slice(0, 2);
            }else{
              publication['comments'] = response.comments;
            }
          }
        });
      },
      error => {
        console.log(error as any);
      }
    );
  }

  
/**Ver todos los comentarios */
  viewAllComments(idPub){
    // console.log('ver todos los comentarios publicacion ' + idPub);
    this.open = true;
    ($('#modalPersonalizadoComentarios') as any).css('display'​​​​​​​​​​​​​​​​​​​​​​​​​​​, 'block');​​​​​​
    ($('body') as any).css('position', 'static');
    ($('body') as any).css('height', '100%');
    ($('body') as any).css('overflow', 'hidden');

    this.getAllComments(idPub, this.pageComments);
  }

/**Cerrar modal comentarios */
  closeModal(){
    if (this.open){
      ($('#modalPersonalizadoComentarios') as any).css('display'​​​​​​​​​​​​​​​​​​​​​​​​​​​, 'none');​​​​​​
      ($('body') as any).css('position', 'inherit');
      ($('body') as any).css('height', 'auto');
      ($('body') as any).css('overflow', 'visible');
      this.open = false;
    } 
  }

  /**Hacer scroll infinito */
  autoScroll(){
    $(window).scroll(function() {
      if ($(window).scrollTop() + $(window).height() >= $(document).height()) {
       //Al llegar al pie de la pagina se ejecuta
       $('#view-more-pubs-button').trigger('click');
   }
   });
  }
//--
}
