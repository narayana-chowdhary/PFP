import { Component} from '@angular/core';

import { fadeInAnimation } from '../_animations/index';

@Component({
    templateUrl: './app/user/my-account.component.html',
    styles: [`
    .nav.nav-tabs {font-size: 12px;}
    li > a {background: #f5f5f5;}
    li > a.active { color: #F97924;background: #a7ce3a; border: 1px solid #337ab7;border-bottom: 0px solid #337ab7;}
    .dropdown-menu {background: #a7ce3a;}
  `]  ,
    animations: [fadeInAnimation],
})
export class MyAccountComponent {
    pageTitle: string = 'My Account';

}
