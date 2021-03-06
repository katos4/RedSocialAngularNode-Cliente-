import { Component, OnInit, DoCheck } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from './services/user.service';
import { GLOBAL } from './services/global';


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
  public url: string;


  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService
  ){
    this.title = 'Angular social';
    this.url = GLOBAL.url;
  }

  ngOnInit() {
    this.identity = this._userService.getIdentity();
    //console.log(this.identity);
    
    var height = $(window).height();
    $('.loginPage').height(height);
 }

 ngDoCheck(){
  this.identity = this._userService.getIdentity();
  //console.log(this.identity);
  //console.log(this.identity.image);
 }

 logout(){
  $('.navbar').attr('hidden', true);
   localStorage.clear();
   sessionStorage.clear();
   this.identity = null;
   this._router.navigate(['/']);
 }


}
