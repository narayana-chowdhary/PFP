import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot, RouterStateSnapshot, Router,
    CanActivate
} from '@angular/router';

import { AuthService } from '../_services/index';
import { LoginComponent } from './login.component';

@Injectable()
export class LoginGuard implements CanActivate {

    constructor(private authService: AuthService,
        private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        console.log('In canActivate: ' + state.url);
        return this.checkLoggedIn(state.url);
    }

    checkLoggedIn(url: string): boolean {
        if (!this.authService.isAuthenticated()) {
            return true;
        }
        this.router.navigate(['/home']);
        return false;
    }

}
