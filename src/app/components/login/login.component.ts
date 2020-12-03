import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UserService]
})
export class LoginComponent implements OnInit {
  public title:String;
  public user: User;
  public status: string;
  public identity;
  public token;
 

  //socket;
  //server = 'http://localhost:5000';

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService
  ) { 
    this.title = 'Identificate';
    this.user = new User("","","","","","","ROLE_USER","","","","","","","","");
  }

  ngOnInit(): void {
    //console.log('componente de login cargado');
  
      var height = $(window).height();
      $('.loginPage').height(height);

  }

  /**Metodo submit del boton del formulario de login */
  onSubmit(){
    // console.log(this.user);
  
    this._userService.login(this.user).subscribe(
      response => {
    
        this.identity = response.user;
        
        if(!this.identity || !this.identity._id){
          this.status = 'error';
        }else{
          this.status = 'success';
          //mostrar barra de navegacion
          $('.navbar').removeAttr('hidden');
          // persistir datos del usuario en el local storage
          localStorage.setItem('identity', JSON.stringify(this.identity));
          sessionStorage.setItem('identity', JSON.stringify(this.identity));
          // conseguir el token
          this.gettoken();
          //conseguir el socket del servidor
          const localUser = localStorage.getItem('identity');
        /*  this.socket = io.connect(this.server);
          //OBTENER EL ID DEL SOCKET CONECTADO EN EL SERVIDOR
          this.socket.on('connect', () => {
          //console.log(this.socket.id, this.socket.io.engine.id, this.socket.json.id);
          localStorage.setItem('socket-id', this.socket.id);
          this.identity = JSON.parse(localUser);
          this.identity['socketId'] = this.socket.id;
          localStorage.setItem('identity', JSON.stringify(this.identity)); 
          });  */

          this._router.navigate(['/home']);
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


/** Obtener el token del usuario logueado */
gettoken(){
  this._userService.login(this.user, 'true').subscribe(
    response => {
      this.token = response.token;
      if(this.token.length <= 0){
        this.status = 'error';
      }else{
        this.status = 'success';
        //console.log(this.token);
        // persistir datos del usuario en el local storage
        localStorage.setItem('token', this.token);
        sessionStorage.setItem('token', this.token);
        // conseguir los contadores o estadisticas del usuario
        this.getCounters();
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


/**Obtengo las estadisticas desde el servicio y las almaceno en el session storage
 * esto se hace asi para no sobrecargar a la api con peticiones y hacerla solo 1 vez
 */
getCounters(){
  this._userService.getCounters().subscribe(
    response => {
      //console.log(response);
      localStorage.setItem('stats', JSON.stringify(response));
      sessionStorage.setItem('stats', JSON.stringify(response));
      //this._router.navigate(['/']);
      this.status = 'success';
    },
    error => {
      console.log(<any>error);
    }
  );
}

}
