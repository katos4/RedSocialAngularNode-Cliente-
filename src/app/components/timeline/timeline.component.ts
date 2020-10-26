import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { Publication } from '../../models/publications';
import { GLOBAL } from '../../services/global';
import { UserService } from '../../services/user.service';
import { PublicationService } from '../../services/publication.service';
import * as $ from 'jquery';


@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css'],
  providers: [UserService, PublicationService]
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

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _publicationService: PublicationService
  ) { 
    this.title = "Timeline";
    this.identity = this._userService.getIdentity();
    this.token = this._userService.gettoken();
    this.url = GLOBAL.url;
    this.page = 1;
  }

  ngOnInit() {
    //console.log("componente timeline cargado");
    this.getPublications(this.page);

    var height = $(window).height();
    $('.loginPage').height(height);
    $('.navbar').removeAttr('hidden');
  }
  

  getPublications(page, adding = false){
    this._publicationService.getPublications(this.token, page).subscribe(
      response => {
        //console.log(response);
        if(response.publications){
          this.total = response.total_items;
          this.pages = response.pages;
          this.itemsPerPage = response.items_per_page;

          if(!adding){
            this.publications = response.publications;
          }else{
            var arrayA = this.publications;
            var arrayB = response.publications;
            console.log("ARRAY A "+arrayA);
            console.log("ARRAY B "+arrayB);

            this.publications = arrayA.concat(arrayB);

            /**scroll animado con jquery cuando se pulsa el boton de ver mas publicaciones */
            $("html, body").animate({scrollTop: $('html').prop("scrollHeight")}, 500);
          }

         /* if(page > this.pages){
            this._router.navigate(['/home']);
          }*/

        }else{
          this.status = 'error';
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

  public noMore = false;
  viewMore(){
    /** Cuando la longitud del array de publicaciones sea igual al total de publicaciones, significará 
     * que no hay mas publicaciones que mostrar
    */

    this.page += 1;
    if(this.page == this.pages){
      this.noMore = true;
    }

    this.getPublications(this.page, true);
  }

  /*
    viewMore(){
     Cuando la longitud del array de publicaciones sea igual al total de publicaciones, significará 
      que no hay mas publicaciones que mostrar
   if(this.publications.length == this.total){
    this.noMore = true;
  }else{
    this.page += 1;
  }
  this.getPublications(this.page, true);
  } */



  refresh(event){
    this.getPublications(1);
  }



//--
}
