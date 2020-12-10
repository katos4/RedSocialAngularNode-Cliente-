import { Component, OnInit, EventEmitter, Input, Output, DoCheck, OnChanges, SimpleChanges, NgModule } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { UserService } from '../../services/user.service';
import { GLOBAL } from '../../services/global';
import { Publication } from '../../models/publications';
import { PublicationService } from '../../services/publication.service';
import { UploadService } from '../../services/upload.service';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  providers: [UserService, PublicationService, UploadService]
})
export class SidebarComponent implements OnInit, OnChanges {
  public identity;
  public token;
  public stats;
  public url;
  public status;
  public publication: Publication;
  public filesToUpload: Array<File>;
  public newStats = false;
  @Input() refreshStat;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _publicationService: PublicationService,
    private _uploadService: UploadService
  ) { 
    this.identity = this._userService.getIdentity();
    this.token = this._userService.gettoken();
   // this.stats = this._userService.getStats();
    this.url = GLOBAL.url;
    this.publication = new Publication('', '', '', '' , this.identity._id);
  }
 

  ngOnInit() {
    //console.log("componente sidebar cargado");
    this.updateSessionStorage();
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes.refreshStat.currentValue);
    if(changes.refreshStat.currentValue == 'true'){
      console.log('algo ha cambiado');
      this.updateSessionStorage();
    }else{
      console.log('nada ha cambiado');
    }
  }

  updateSessionStorage(){
    this._userService.getCounters().subscribe(
      response => {
        sessionStorage.setItem('stats', JSON.stringify(response));
        this.stats = this._userService.getStats();
        this.status = 'success';
      },
      error => {
        console.log(<any>error);
      }
    );
  }

 /* ngDoCheck(){
    if(this.refreshStat == 'true'){
      console.log('se ha publicado algo');
      this.newStats = true;
      this.newStat(this.newStats);
    }
   // this.stats = this._userService.getStats();
   }


  onSubmit(form, $event){
    //console.log(this.publication);
    this._publicationService.addPublication(this.token, this.publication).subscribe(
      response => {
        if(response.publication){
          //this.publication = response.publication;
          this.status = 'success';

          //subir imagen
          this._uploadService.makeFileRequest(this.url+'upload-image-pub/'+response.publication._id, [], this.filesToUpload, this.token, 'image')
                             .then((result:any) => {
                               this.status = 'success';
                               this.publication.file = result.image;
                               setTimeout(function(){
                                var alert = document.getElementById("alertaExito");
                                alert.style.display = 'none';
                                },2000);
                               form.reset();

                            });

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

    //public filesToUpload: Array<File>;
*/

  /**Detectar si ha habido un cambio en el input file del formulario para subir publicaciones */
  fileChangeEvent(fileInput: any){
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }

}








