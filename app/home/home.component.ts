import { Component } from '@angular/core';

import { fadeInAnimation } from '../_animations/index';

@Component({
    templateUrl: 'app/home/home.component.html',
    animations: [fadeInAnimation],
    // // attach the fade in animation to the host (root) element of this component
    // host: { '[@fadeInAnimation]': '' }
})
export class HomeComponent {
    public pageTitle: string = 'Welcome to People For Plants';

    constructor() { }
}
