import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Publication } from '../../models/publications';
import { Like } from '../../models/like';
import { GLOBAL } from '../../services/global';
import { UserService } from '../../services/user.service';
import { PublicationService } from '../../services/publication.service';
import { LikeService } from '../../services/like.service';
import { CommentService } from '../../services/comment.service';
import { Comment } from '../../models/comment';


@Component({
  selector: 'app-publications',
  templateUrl: './publications.component.html',
  styleUrls: ['./publications.component.css'],
  providers: [UserService, PublicationService, LikeService, CommentService]
})
export class PublicationsComponent implements OnInit {
  public title: string;
  public identity;
  public token;
  public url: string;
  public status: string;
  public page;
  public total;
  public pages;
  public itemsPerPage;
  public publications: Publication[];
  public modalData: any[] = [];
  public open = false;
  public open2 = false;
  public likesArray = [];
  public userPubArray = [];
  public noMore = false;
  public comments = [];
  public comment: Comment;
  public idPublication;


  public pageComments;
  public totalComments;
  public itemsPerPageComments;
  public pagesComments;
  @Input() user: string;


  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _publicationService: PublicationService,
    private _likeService: LikeService,
    private _commentService: CommentService
  ) {
    this.title = 'Publicaciones';
    this.identity = _userService.getIdentity();
    this.token = _userService.gettoken();
    this.url = GLOBAL.url;
    this.page = 1;
    this.comment = new Comment('', '', this.identity._id, '' , '');
   }

  ngOnInit(){
    this.getPublications(this.user, this.page);

    var height = $(window).height();
    $('.loginPage').height(height);
    $('.navbar').removeAttr('hidden');

    this.getLikes();
  }


  getPublications(user, page, adding = false){
    this._publicationService.getPublicationsUser(this.token, user, page).subscribe(
      response => {
        if(response.publications){
         // console.log(response.publications);
          this.total = response.total_items;
          this.pages = response.pages;
          this.itemsPerPage = response.items_per_page;

          if(!adding){
            this.publications = response.publications;
            this.publications.forEach(publication => {
              this.getComments(publication._id);
            });
            console.log(this.publications);
          }else{
            var arrayA = this.publications;
            var arrayB = response.publications;

            this.publications = arrayA.concat(arrayB);
            $("html, body").animate({scrollTop: $('html').prop("scrollHeight")}, 500);
          }

        }else{
          this.status = 'error;'
        }
      }, 
      error => {
        var errorMessage = <any>error;
        console.log(errorMessage);
        this.status = 'error';
      }
    );
  }

  viewMore(){
    /** Cuando la longitud del array de publicaciones sea igual al total de publicaciones, significará 
     * que no hay mas publicaciones que mostrar
    */
   console.log(this.pages);
   this.page += 1;


   if(this.page === this.pages){
      this.noMore = true;
    }

   this.getPublications(this.user, this.page, true);
  }


  openModal(id, file, userImg, userNick, text, userId, comments){
    this.open = true;
    ($('#modalPersonalizado') as any).css('display'​​​​​​​​​​​​​​​​​​​​​​​​​​​,'block');​​​​​​
    ($('body') as any).css('position', 'static');
    ($('body') as any).css('height', '100%');
    ($('body') as any).css('overflow', 'hidden');

    this.modalData = [];
    this.modalData.push({
      "userId": userId,
      "imgId":id, 
      "file":file, 
      "userImage":userImg,
      "nick": userNick,
      "text": text, 
      "comments": comments
    });
   // console.log(this.modalData);
    return false;

  }

  closeModal(){
    if(this.open){
      ($('#modalPersonalizado') as any).css('display'​​​​​​​​​​​​​​​​​​​​​​​​​​​,'none');​​​​​​
      ($('body') as any).css('position', 'inherit');
      ($('body') as any).css('height', 'auto');
      ($('body') as any).css('overflow', 'visible');
      this.open = false;
    } 
  }

  openDeleteModal(){
    ($('#deleteModalConfirmation') as any).css('display'​​​​​​​​​​​​​​​​​​​​​​​​​​​,'block');​​​​​​
    this.open2 = true;
  }

  closeDeleteModal(){
    if(this.open2){
      ($('#deleteModalConfirmation') as any).css('display'​​​​​​​​​​​​​​​​​​​​​​​​​​​,'none');​​​​​​
      ($('body') as any).css('position', 'inherit');
      ($('body') as any).css('height', 'auto');
      ($('body') as any).css('overflow', 'visible');
      this.open2 = false;
    }
  }

  deletePublication(id){
    console.log("id de la publicacion " + id);
    this.deleteAllComments(id);
    this.deleteAllLikes(id);
    this._publicationService.deletePublication(this.token, id).subscribe(
      response => {
        this.closeDeleteModal();
        this.closeModal();
        this.getPublications(this.user, 1);
      
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  deleteAllComments(id){
    this._commentService.deleteAllComments(this.token, id).subscribe(
      response => {
       // console.log(response);
      },
      error =>{}
    );
  }

  deleteAllLikes(id){
    this._likeService.deleteAllLikes(this.token, id).subscribe(
      response => {
       // console.log(response);
      },
      error => {}
    );
  }

  giveLike(idPub){
    // console.log('el id de la publicacion es: ' + idPub);
 
     var like = new Like('', idPub, this.identity._id,'');
     this._likeService.addLike(this.token, like).subscribe(
       response => {
         if(response){
           this.status = 'success';
           this.likesArray.push(idPub);
           //console.log(this.likesArray);
         }else{
           this.status = 'error';
         }
       },
       error => {
         console.log(<any>error);
       }
     );
  }

  unlikePublication(idPub){
 
     this._likeService.deleteLike(this.token, idPub).subscribe(
       response => {
         var search = this.likesArray.indexOf(idPub);
         if(search != -1){
           this.likesArray.splice(search, 1);
         }
       },
       error => {
         console.log(<any>error);
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

          if(!this.userPubArray.includes(like.user)){
            this.userPubArray.push(like.user);
          }
         //console.log(like.publication);
        });

      },
      error => {
        console.log(<any>error);
      }
    );
  }

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


  getAllComments(idPub, page = null, adding = false){
    this.idPublication = idPub;
    this._commentService.getComments(this.token, idPub, page).subscribe(
      response => {
        this.totalComments = response.total_items;
        this.pagesComments = response.pages;
        this.itemsPerPageComments = response.items_per_page;
        //console.log(response);

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

  sendComment(publicationId){
    var idPub = publicationId;
    this.comment.publication = idPub;
   // console.log(this.comment);

    this._commentService.addComment(this.token, this.comment).subscribe(
      response => {
        // console.log(response.comment.text);
        if (response.comment.text){
          this.getComments(idPub);
         // $('#comment-text-input').val('');
          this.comment.text = '';
        }
      },
      error => {
        console.log(<any> error);
      }
    );
  }

  viewAllComments(idPub){
    // console.log('ver todos los comentarios publicacion ' + idPub);
    this.open = true;
    ($('#modalPersonalizadoComentarios') as any).css('display'​​​​​​​​​​​​​​​​​​​​​​​​​​​, 'block');​​​​​​
    ($('body') as any).css('position', 'static');
    ($('body') as any).css('height', '100%');
    ($('body') as any).css('overflow', 'hidden');

    this.getAllComments(idPub, this.pageComments);
  }

//-----  
}
