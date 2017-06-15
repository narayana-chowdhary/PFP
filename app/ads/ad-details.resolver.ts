import { Injectable } from '@angular/core'
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

import { AdService } from '../_services/index';
import { IAd } from '../_models/index';

@Injectable()
export class AdDetailsResolver implements Resolve<any> {
    constructor(private adService: AdService,
        private router: Router) {
    }

    resolve(route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<IAd> {
        let id = route.params['id'];
        // let id = route.paramMap.get('id');
        if (isNaN(+id)) {
            console.log(`Ad id was not a number: ${id}`);
            this.router.navigate(['/ads/result']);
            return Observable.of(null);
        }
        return this.adService.getAd(+id)
            .map(ad => {
                if (ad) {
                    return ad;
                }
                console.log(`Ad was not found: ${id}`);
                this.router.navigate(['/ads/result']);
                return null;
            })
            .catch(error => {
                console.log(`Retrieval error: ${error}`);
                this.router.navigate(['/ads/result']);
                return Observable.of(null);
            });
    }
}