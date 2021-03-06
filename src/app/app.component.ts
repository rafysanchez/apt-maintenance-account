import { Component } 	  from '@angular/core';
import { environment }  from '../environments/environment';

@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  styles: ['./app.component.css']
})
export class AppComponent {

  brand = environment.brand;

  constructor() {
    console.log('Is Production Environment: ' + environment.production);
  }

}
