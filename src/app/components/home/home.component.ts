import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public title: string;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
  ) { 
    this.title = "Bienvenido a Fleets";
  }

  ngOnInit(){
    // console.log("Home Component cargado");
    setTimeout(() => {
      this._router.navigate(['/timeline']);
    }, 2100);
    
    var height = $(window).height();
    $('.loginPage').height(height);

  }

}
