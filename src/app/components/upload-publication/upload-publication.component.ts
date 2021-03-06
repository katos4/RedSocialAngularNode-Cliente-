import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { UserService } from '../../services/user.service';
import { GLOBAL } from '../../services/global';
import { Publication } from '../../models/publications';
import { PublicationService } from '../../services/publication.service';
import { UploadService } from '../../services/upload.service';


@Component({
  selector: 'app-upload-publication',
  templateUrl: './upload-publication.component.html',
  styleUrls: ['./upload-publication.component.css'],
  providers: [UserService, PublicationService, UploadService]
})
export class UploadPublicationComponent implements OnInit {
  public identity;
  public token;
  public stats;
  public url;
  public status;
  public statusUpload;
  public statusUpload2;
  public publication: Publication;
  public filesToUpload: Array<File>;
  public uploadTrue;
  public uploadTrue2;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _publicationService: PublicationService,
    private _uploadService: UploadService
  ) { 
    this.identity = this._userService.getIdentity();
    this.token = this._userService.gettoken();
    this.stats = this._userService.getStats();
    this.url = GLOBAL.url;
    this.publication = new Publication('', '', '', '' , this.identity._id);
    this.uploadTrue = false;
    this.uploadTrue2 = false;
    
   
  }

/** Enviar propiedad sended al componente padre (timeline) */
  @Output() publicationSent = new EventEmitter();


  ngOnInit(){}
  
/** Comprobar que ni el textarea ni la foto estan vacios y luego llamar a la funcion para subir la publicacion */
  onSubmit(form, $event){
   
    var textarea = $('#textarea-publication').val();
  
    if(textarea === ''){
      this.uploadTrue2 = false;
      this.statusUpload = 'error';
      console.log('el textarea está vacio');
    }else{
      this.uploadTrue2 = true;
      this.statusUpload = 'success';
    }

    if(!this.uploadTrue){
      console.log('el archivo esta vacio');
      this.statusUpload2 = 'error';
    }

    if(this.uploadTrue && this.uploadTrue2){
      //console.log('los 2 son true');
      this.uploadFilesAndPublication(form);
      
    }


  }

  /** Subir la publicacion nueva con su foto y texto */
  uploadFilesAndPublication(form){
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
                                }, 2000);
                               form.reset();
                               $('#previewUploadImg').remove();
                               this.publicationSent.emit({send: 'true'});
                               $('#closeModalButton').click();
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

/** Detectar si ha habido un cambio en el input para subir archivos */
  fileChangeEvent(fileInput: any){
    this.filesToUpload = <Array<File>> fileInput.target.files;
    if(this.filesToUpload.length > 0){
      this.uploadTrue = true;
      this.statusUpload2 = 'success';
    }

    let div = $('#previewUploadImgDiv');
    let preview = $('<div id="previewUploadImg">');
    let image = $('<img id="imgPreview">');

    const file = this.filesToUpload;
    const firstFile = file[0];
    const objectURL = URL.createObjectURL(firstFile);

    image.attr('src', objectURL);
    preview.html('');
    preview.append(image);
    div.append(preview);
  }


}
