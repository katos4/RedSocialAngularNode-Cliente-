import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  constructor() { }

  ngOnInit(){

    this.search.valueChanges
    .pipe(
      debounceTime(100)
    )
    .subscribe( value => this.searchEmitter.emit(value));
  }

/** Crear formulario con el nombre search para pasarlo a otro componente */
search = new FormControl('');

/** Pasar el formulario como evento hacia otro componente */
@Output('search') searchEmitter = new EventEmitter<string>();

}
