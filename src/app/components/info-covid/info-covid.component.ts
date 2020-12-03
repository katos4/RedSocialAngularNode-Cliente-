import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { InfoCovidService } from '../../services/infoCovid.service';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

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
  public todayRecovered;
  public newCountryConfirmed;
  public newCountryDead;
  public newCountryRecovered;
  public source;
  public regions;
  public nameCountry;
  public arrayCountries;
  public countryName = [];
  public selectedValue;
  public noExistRegions;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _infoCovidService: InfoCovidService
  ) { }

  myControl = new FormControl();
  filteredOptions: Observable<string[]>;

  ngOnInit() {
    var height = $(window).height();
    $('.loginPage').height(height);
    $('.navbar').removeAttr('hidden');
    this.selectedValue = 'spain';
    this.noExistRegions = false;
    this.getDate();
    this.getinfo(this.selectedValue);
    this.getAllCountries();
  }


/** Obtener la fecha actual y formatearla de manera que la api del covid la acepte */
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

/** Obtener toda la informacion del pais */
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

/** Filtrar la informacion del pais y los detalles de interes */
getCountryDetails(){
  let array = [];
   // tslint:disable-next-line: forin
  for (let key in this.arrayCovid) {
    array = this.arrayCovid[key].countries;
    // console.log(this.arrayCovid[key]);
  }

  // tslint:disable-next-line: forin
  for(let k in array){
   // console.log(array[k].id);
    this.nameCountry = array[k].name_es;
    this.todayConfirmed = array[k].today_confirmed;

    array[k].regions.length === 0 ?  this.noExistRegions = true :  this.noExistRegions = false;
    this.regions = array[k].regions;
    
    this.todayRecovered = array[k].today_recovered;
    this.newCountryConfirmed = array[k].today_new_confirmed;
    this.newCountryDead = array[k].today_new_deaths;
    this.newCountryRecovered = array[k].today_new_recovered;
    this.source = array[k].source;

  }
}

/** Obtener una lista de todos los paises */
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

/** Detectar si el select ha cambiado y obtener la informacion del pais nuevo seleccionado */
onChange(country){
  console.log(country);
  if(country){
  this.getinfo(country);
  }
}


}
