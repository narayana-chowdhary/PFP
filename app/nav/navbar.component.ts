import { Component, Inject } from '@angular/core'
import { AuthService } from '../_services/index'
import { Router } from '@angular/router'
import { TOASTR_TOKEN, Toastr } from '../_common/index'

@Component({
  selector: 'nav-bar',
  templateUrl: 'app/nav/navbar.component.html',
  styles: [`
    .nav.navbar-nav {font-size: 12px;}
    #searchForm {margin-right: 100px;}
    @media (max-width: 1200px) {#searchForm {display:none}}
    li > a.active { color: #F97924; }
    .dropdown-menu {background: #a7ce3a;}
  `]
})
export class NavBarComponent {
  pageTitle: string = 'People For Plants';

  constructor(private auth: AuthService,
    private router: Router,
    @Inject(TOASTR_TOKEN) private toastr: Toastr) {

  }

  logout() {
    this.auth.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
    this.toastr.success('Lotout successful');
  }
}