import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [UserService]
})
export class RegisterComponent implements OnInit {
  public title:String;
  public user: User;
  public status: string;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService
  ) {
    this.title = "Registrate";
    this.user = new User("","","","","","","ROLE_USER","","","","","","","","");
   }

  ngOnInit(): void {
 
  }

  onSubmit(registerForm){
    let pass = $('#user-password').val();
    if(this.isValid(pass)){
      this.user.password = pass.toString();
      console.log(this.user);
      this.registerUser(this.user, registerForm);
    }
  }

  registerUser(user, form){
   this._userService.register(user).subscribe(
      response =>{
        if(response.user && response.user._id){
         // console.log(response.user);
          this.status = 'success';
          form.reset();
          ($('#registerModal')as any).modal('toggle');
          this._router.navigate(['/login']);
        }else{
          this.status = 'error';
        }
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  /** validar campos de formulario de registro */
  isValid(pass){
    if(pass.length < 8){
      $('#pass-error').removeClass('hide-pass');
      return false;
    }else{
      $('#pass-error').addClass('hide-pass');
    }

    return true;
  }

  onStrengthChanged($event){
   // console.log($event);
  }

}
