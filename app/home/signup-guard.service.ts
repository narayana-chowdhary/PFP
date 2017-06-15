import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router,
         CanActivate, CanDeactivate } from '@angular/router';

import { AuthService } from '../_services/index';
import { SignupComponent } from './signup.component';

@Injectable()
export class SignupGuard implements CanActivate, CanDeactivate<SignupComponent> {

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

    canDeactivate(component: SignupComponent): boolean {
        if (component.isDirty) {
            return confirm(`Navigate away and lose all changes?`);
        }
        return true;
    }
}
