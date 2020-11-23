import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { InfoCovidService } from '../../services/infoCovid.service';


@Component({
  selector: 'app-info-covid',
  templateUrl: './info-covid.component.html',
  styleUrls: ['./info-covid.component.css'],
  providers: [InfoCovidService]
})
export class InfoCovidComponent implements OnInit {
  public date;
  public dateToShow;
  public arrayCovid;
  public todayConfirmed;
  public regions;
  public nameCountry;
  public arrayCountries;
  public countryName = [];
  public selectedValue;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _infoCovidService: InfoCovidService
  ) { }

  ngOnInit() {
    var height = $(window).height();
    $('.loginPage').height(height);
    $('.navbar').removeAttr('hidden');
    this.selectedValue = 'spain';
    this.getDate();
    this.getinfo(this.selectedValue);
    this.getAllCountries();
  }

  getDate(){
    let d = new Date();
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    let year = d.getFullYear();

    if (month.length < 2) {
    month = '0' + month;
    }
    if (day.length < 2) {
    day = '0' + day;
  }

    this.date = [year, month, day].join('-');
    this.dateToShow = [day, month, year].join('/');
  }

  getinfo(country){

    this._infoCovidService.getInfo(this.date, country).subscribe(
      response => {
        if(response){
          this.arrayCovid = response.dates;
         // console.log(this.arrayCovid);
          this.getCountryDetails();
          $('.lds-ring').hide();
        }
      },
      error => {
        console.log(error as any);
      }
    );
  }

getCountryDetails(){
  let array = [];
   // tslint:disable-next-line: forin
  for (let key in this.arrayCovid) {
    array = this.arrayCovid[key].countries;
  }

  // tslint:disable-next-line: forin
  for(let k in array){
   // console.log(array[k].id);
    this.nameCountry = array[k].name_es;
    this.todayConfirmed = array[k].today_confirmed;
    this.regions = array[k].regions;
  }
}

getAllCountries(){
  let arrayCountry;
  this._infoCovidService.getCountries(this.date).subscribe(
    response => {
      this.arrayCountries = response.dates;
      // tslint:disable-next-line: forin
      for(let key in this.arrayCountries){
        // console.log(this.arrayCountries[key].countries);
        arrayCountry = this.arrayCountries[key].countries;
      }
       // tslint:disable-next-line: forin
      for(let k in arrayCountry){
       this.countryName.push({
         'id':arrayCountry[k].id,
         'name':arrayCountry[k].name_es
        });
      }
    },
    error => {
      console.log(error as any);
    }
  );
}

onChange(country){
  console.log(country);
  if(country){
  this.getinfo(country);
  }
}


}
