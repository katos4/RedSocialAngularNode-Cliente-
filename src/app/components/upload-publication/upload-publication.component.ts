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
  public publication: Publication;

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
    
   
  }

  ngOnInit(){
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
                              }, 2000);
                             form.reset();
                             this.sended.emit({send: 'true'});
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


  public filesToUpload: Array<File>;

  fileChangeEvent(fileInput: any){
    this.filesToUpload = <Array<File>>fileInput.target.files;
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

//output (esto iria en el componente futuro dedicado solo al formulario de enviar publicaciones)
@Output() sended = new EventEmitter();
sendPublication(event){
  console.log(event);
  this.sended.emit({send: 'true'});
}

}
