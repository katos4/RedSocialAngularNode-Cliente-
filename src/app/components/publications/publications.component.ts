import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Publication } from '../../models/publications';
import { GLOBAL } from '../../services/global';
import { UserService } from '../../services/user.service';
import { PublicationService } from '../../services/publication.service';


@Component({
  selector: 'app-publications',
  templateUrl: './publications.component.html',
  styleUrls: ['./publications.component.css'],
  providers: [UserService, PublicationService]
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
  @Input() user: string;


  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _publicationService: PublicationService
  ) {
    this.title = 'Publicaciones';
    this.identity = _userService.getIdentity();
    this.token = _userService.gettoken();
    this.url = GLOBAL.url;
    this.page = 1;
   }

  ngOnInit(){
    this.getPublications(this.user, this.page);

    var height = $(window).height();
    $('.loginPage').height(height);
  }


  getPublications(user, page, adding = false){
    this._publicationService.getPublicationsUser(this.token, user, page).subscribe(
      response => {
        if(response.publications){
          console.log(response.publications);
          this.total = response.total_items;
          this.pages = response.pages;
          this.itemsPerPage = response.items_per_page;

          if(!adding){
            this.publications = response.publications;
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


  public noMore = false;
  viewMore(){
    /** Cuando la longitud del array de publicaciones sea igual al total de publicaciones, significará 
     * que no hay mas publicaciones que mostrar
    */
   this.page += 1;

    if(this.page == this.pages){
      this.noMore = true;
    }

    this.getPublications(this.user, this.page, true);
  }


  openModal(id){
    console.log("El id de la imagen clickada es " + id);
    
  }

//-----  
}
