import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'

import { AuthService } from '../_services/index'

import { fadeInAnimation } from '../_animations/index';

@Component({
    templateUrl: 'app/home/login.component.html',
    styles: [`
    em {float:right; color:#E05C65; padding-left:10px;}
    `],
    animations: [fadeInAnimation],
})
export class LoginComponent implements OnInit {
    pageTitle: string = 'Login';
    loginInvalid = false;
    errorMessage: string;
    redirect: string = 'false';

    constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) {

    }
    ngOnInit() {
        this.redirect = this.route.snapshot.queryParams['redirect'] || 'false';
        if (this.redirect === 'false')
            this.authService.redirectUrl = null;
    }
    login(formValues: any) {
        this.loginInvalid = false;

        this.authService.loginUser(formValues.userName, formValues.password)
            .subscribe(resp => {
                if (!resp) {
                    this.loginInvalid = true;
                } else {
                    if (this.authService.redirectUrl) {
                        this.router.navigateByUrl(this.authService.redirectUrl);
                        this.authService.redirectUrl = null;
                    } else {
                        this.router.navigate(['ads/search']);
                    }
                }
            },
            (error: any) => {
                if (<any>error === 'INVALID_LOGIN_INFO')
                    this.loginInvalid = true;
                else
                    this.errorMessage = <any>error;
            }
            );

    }

}