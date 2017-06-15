import { Injectable } from '@angular/core'
import { Resolve, ActivatedRouteSnapshot } from '@angular/router'
import { AdService } from '../_services/index'
import { IAd } from '../_models/index';

@Injectable()
export class AdListResolver implements Resolve<any> {
    constructor(private adService: AdService) {

    }

    resolve(route: ActivatedRouteSnapshot) {
        return this.adService.getAds();
        // return this.adService.getAds().delay(1000)
    }
}