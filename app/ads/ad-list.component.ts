import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, Event, NavigationStart } from '@angular/router';

import { IAd, CategoryEnum, AdTypeEnum, IAdSearchContext } from '../_models/index';
import { AdService } from '../_services/index';
import { PagerService } from '../_common/index';

import * as _ from 'underscore';
import { Subscription } from 'rxjs/Subscription';

import { fadeInAnimation } from '../_animations/index';

@Component({
    templateUrl: './app/ads/ad-list.component.html',
    // styles: [`.list-view {width:100%} `],
    animations: [fadeInAnimation],
})

export class AdListComponent implements OnInit, OnDestroy {
    pageTitle: string = 'Ads - Search Result';
    errorMessage: string;

    private sub: Subscription;

    category = CategoryEnum;
    adType = AdTypeEnum;

    isBack: string = 'false';

    pageSize: number = 3;
    listView: boolean = true;
    sortBy: string = 'createDate';

    // list of all ads to be paged
    ads: IAd[]
    // pager object
    pager: any = {};
    // paged ads
    pagedAds: IAd[]

    constructor(
        private adService: AdService,
        private pagerService: PagerService,
        private router: Router,
        private route: ActivatedRoute) {
        router.events.subscribe((routerEvent: Event) => {
            this.checkRouterEvent(routerEvent);
        });
    }

    // Method to save the selected PageSize, ViewType and SortOrder to search context when navigating away, 
    // so that to apply the same when navigating back from Ad Details page.
    checkRouterEvent(routerEvent: Event): void {
        if (routerEvent instanceof NavigationStart) {
            let searchContext: IAdSearchContext = Object.assign({}, this.adService.adSearchContext);
            searchContext.selectedPageSize = this.pageSize;
            searchContext.selectedSortBy = this.sortBy;
            searchContext.selectedListView = this.listView;
            this.adService.adSearchContext = Object.assign({}, searchContext);
        }
    }

    ngOnInit() {
        // this.adService.getAds().subscribe(ads => { this.ads = ads})
        // this.ads = this.route.snapshot.data['ads']

        this.isBack = this.route.snapshot.queryParams['isback'] || 'false';

        if (this.isBack == 'true') {
            this.pageSize = this.adService.adSearchContext.selectedPageSize;
            this.sortBy = this.adService.adSearchContext.selectedSortBy;
            this.listView = this.adService.adSearchContext.selectedListView;
        }

        this.sub = this.route.data.subscribe(data => {
            this.ads = data['ads'];
            // sort by create date if it is a first request else sort based on previous user selection
            this.sortAds();
        },
            error => this.errorMessage = <any>error);
    }

    // Method to sort the adds.
    sortAds() {
        if (this.sortBy === 'adTitle') {
            this.ads.sort((a, b) => {
                if (a.adTitle > b.adTitle) return 1
                else if (a.adTitle === b.adTitle) return 0
                else return -1
            })
        }
        else if (this.sortBy === 'locality') {
            this.ads.sort((a, b) => {
                if (a.locality > b.locality) return 1
                else if (a.locality === b.locality) return 0
                else return -1
            })
        }
        else if (this.sortBy === 'createDate') {
            this.ads.sort((a, b) => {
                // if (a.createDate > b.createDate) return 1
                // else if (a.createDate === b.createDate) return 0
                if (new Date(a.createDate) < new Date(b.createDate)) return 1
                else if (new Date(a.createDate) === new Date(b.createDate)) return 0
                else return -1
            })
        }

        // initialize to page 1
        this.setPage(1);
    }

    // Method to display ads for selected page.
    setPage(page: number) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }
        // get pager object from service
        this.pager = this.pagerService.getPager(this.ads.length, page, this.pageSize);
        // get current page of items
        this.pagedAds = this.ads.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }

}
