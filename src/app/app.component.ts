import { Component, OnInit, DoCheck } from '@angular/core';
import { UserService } from './services/user.service';

declare var $:any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService]
})
export class AppComponent implements OnInit, DoCheck{
  public title: string;
  public identity;


  constructor(
    private _userService: UserService
  ){
    this.title = 'Angular social';
  }

  ngOnInit() {
    this.identity =this._userService.getIdentity();
    console.log(this.identity);
 }

 ngDoCheck(){
  this.identity =this._userService.getIdentity();
 }


}
