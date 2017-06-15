import { Injectable } from '@angular/core'
import { Resolve } from '@angular/router'

import { AdService, AuthService } from '../_services/index'

@Injectable()
export class UserAdsResolver implements Resolve<any> {
    constructor(
        private adService: AdService,
        private authService: AuthService) {

    }

    resolve() {
        if (this.authService.isAuthenticated())
            return this.adService.getUserAds(this.authService.currentUser.id);
    }
}