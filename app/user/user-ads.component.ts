import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';

import { IAd, CategoryEnum, AdTypeEnum } from '../_models/index';
import { AdService, AuthService } from '../_services/index';
import { PagerService } from '../_common/index';
import * as _ from 'underscore';

import { fadeInAnimation } from '../_animations/index';

@Component({
    templateUrl: '/app/user/user-ads.component.html',
    animations: [fadeInAnimation],
})
export class UserAdsComponent implements OnInit, OnDestroy {
    pageTitle: string = 'User Ads';

    errorMessage: string;

    private sub: Subscription;

    category = CategoryEnum;
    adType = AdTypeEnum;

    sortBy: string;

    pageSize: number = 3;

    // list of of all ads to be paged
    ads: IAd[]

    // pager object
    pager: any = {};

    // paged ads
    pagedAds: IAd[]

    constructor(
        private adService: AdService,
        private pagerService: PagerService,
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthService) {

    }
    
    ngOnInit() {
        this.sub = this.route.data.subscribe(data => {
            this.ads = data['ads'];
            // sort by create date
            this.sortAds('createDate');
        },
            error => this.errorMessage = <any>error);
    }
    ngOnDestroy(): void {
        if (this.sub)
            this.sub.unsubscribe();
    }

    setPageSize(selectedSize: number) {
        this.pageSize = selectedSize;
        this.setPage(1);
    }
    sortAds(sortBy: string) {
        if (sortBy === 'adTitle') {
            this.ads.sort((a, b) => {
                if (a.adTitle > b.adTitle) return 1
                else if (a.adTitle === b.adTitle) return 0
                else return -1
            })
        }
        else if (sortBy === 'locality') {
            this.ads.sort((a, b) => {
                if (a.locality > b.locality) return 1
                else if (a.locality === b.locality) return 0
                else return -1
            })
        }
        else if (sortBy === 'createDate') {
            this.ads.sort((a, b) => {
                // if (a.createDate > b.createDate) return 1
                // else if (a.createDate === b.createDate) return 0
                if (new Date(a.createDate) < new Date(b.createDate)) return 1
                else if (new Date(a.createDate) === new Date(b.createDate)) return 0
                else return -1
            })
        }

        this.setPage(1);
    }

    setPage(page: number) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }

        // get pager object from service
        this.pager = this.pagerService.getPager(this.ads.length, page, this.pageSize);

        // get current page of items
        this.pagedAds = this.ads.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }
}