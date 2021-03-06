import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { UploadService } from '../../services/upload.service';
import { GLOBAL } from '../../services/global';


@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
  providers: [UserService, UploadService]
})
export class UserEditComponent implements OnInit {
  public title: string;
  public user: User;
  public identity;
  public token;
  public status;
  public url: string;
  public filesToUpload: Array<File>;
  public genders;
  public maritals;
  public checked;
  


  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService ,
    private _uploadService: UploadService
  ) { 
    this.title = "Actualizar mis datos";
    this.user = this._userService.getIdentity();
    this.identity = this.user;
    this.token = this._userService.gettoken();
    this.url = GLOBAL.url;
    this.genders = ['Hombre', 'Mujer', 'Otro'];
    this.maritals = ['Soltero/a', 'Casado/a', 'Viudo/a', 'Divorciado/a', 'Separado/a', 'Unión libre'];

  }

  ngOnInit(){
    // console.log(this.user);
    // console.log("User edit se ha cargado");
    var height = $(window).height();
    $('.loginPage').height(height);
    $('.navbar').removeAttr('hidden');
   // console.log(this.identity);

    if (this.identity.relationship === true){
      this.checked = true;
    }
    // tslint:disable-next-line: no-unused-expression

  }

  onSubmit(){
    console.log('submit');
    if( $('#casilla-relacion').prop('checked') ){
      console.log('checked es true');
     /* this.user.relationship = true;
      this.checked = true;*/
    }
    //console.log(this.user);
    this._userService.updateUser(this.user).subscribe(
      response => {
        if (!response.user){
          this.status = 'error';
        }else{
          this.status = 'success';
          localStorage.setItem('identity', JSON.stringify(response.user));
          this.identity = this.user;
          $('#imgPreviewEdit').remove();
          
          //Subida de archivos

          this._uploadService.makeFileRequest(this.url + 'upload-image-user/' + this.user._id, [], this.filesToUpload, this.token, 'image')
                .then((result: any) => {
                  //console.log(result);
                  this.user.image = result.user.image;
                  sessionStorage.setItem('identity', JSON.stringify(this.user));
                });
          this.filesToUpload = [];
          console.log(this.filesToUpload);
        }
      },
      error => {
        var messageError = <any> error;
        console.log(messageError);

        if (messageError != null){
          this.status = 'error';
        }
      }
    );

  }


fileChangeEvent(fileInput: any){
  this.filesToUpload = <Array<File>> fileInput.target.files;
  //console.log(this.filesToUpload);
  let image;
  let div;
  let preview;

  div = $('#imagenUsuarioSubida');
  preview = $('<div id="previewUploadImgEdit">');
  image = $('<img id="imgPreviewEdit">');
  const file = this.filesToUpload;
  const firstFile = file[0];
  const objectURL = URL.createObjectURL(firstFile);
  image.attr('src', objectURL);
  preview.html('');
  preview.append(image);
  div.append(preview);
}

addEmoji($event){
  console.log($event);
}

}
