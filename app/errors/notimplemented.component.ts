import { Component } from '@angular/core'

@Component({
  template: `
    <h3 class="errorMessage">Not Implemented</h3>
  `,
  styles: [`
    .errorMessage { 
      margin-top:150px; 
      font-size: 100px;
      text-align: center; 
    }`]
})
export class NotImplementedComponent{
  constructor() {

  }

}


