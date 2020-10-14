import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { Publication } from '../../models/publications';
import { GLOBAL } from '../../services/global';
import { UserService } from '../../services/user.service';



@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {
public identity;
public token;
public title: string;
public url;


  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService
  ) { 
    this.title = "Timeline";
    this.identity = this._userService.getIdentity();
    this.token = this._userService.gettoken();
    this.url = GLOBAL.url;
  }

  ngOnInit() {
    console.log("componente timeline cargado");
  }

}
