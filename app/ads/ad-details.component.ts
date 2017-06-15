import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AdService } from '../_services/index';
import { IAd, CategoryEnum, AdTypeEnum } from '../_models/index';

import { fadeInAnimation } from '../_animations/index';

@Component({
    templateUrl: '/app/ads/ad-details.component.html',
    animations: [fadeInAnimation],
})
export class AdDetailsComponent implements OnInit, OnDestroy {
    pageTitle: string = 'Ad Details';
    ad: IAd

    category = CategoryEnum;
    adType = AdTypeEnum;
    
    constructor(
        private adService: AdService,
        private router: Router,
        private route: ActivatedRoute) {

    }

    ngOnInit() {
        this.route.data.forEach((data) => {
            this.ad = data['ad']
        })
    }

    ngOnDestroy() {
    }

    onBack(): void {
        this.router.navigate(['/ads/result'], {queryParams:{'isback' : 'true'}});
        
    }

}