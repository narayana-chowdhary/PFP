import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CategoryEnum, AdTypeEnum, IState, ICity, IAdSearchContext } from '../_models/index';
import { AdService, LocationService } from '../_services/index';

import { fadeInAnimation } from '../_animations/index';

@Component({
    templateUrl: './app/ads/ad-search.component.html',
    animations: [fadeInAnimation],
})

export class AdSearchComponent implements OnInit {
    pageTitle: string = 'Search Ads';

    errorMessage: string;
    // Flag to say whether user navigated back to this page from search result page.
    isBack: string = 'false';

    // Search filters.
    selectedCategoryId: number = 1;
    selectedAdTypeId: number = 1;
    selectedStateId: number = 0;
    selectedCityId: number = 0;
    selectedLocality: string = '';
    selectedTitle: string = '';

    // To bind Category and Ad Type dropdown with CategoryEnum and AdTypeEnum
    categories: any[];
    category = CategoryEnum;
    adTypes: any[];
    adType = AdTypeEnum;

    // To bind City and State dropdowns with cities and states from DB
    cities: ICity[] = [{
        id: 0,
        name: '--Select--',
        stateId: 0
    }];
    states: IState[];

    constructor(
        private adService: AdService,
        private locService: LocationService,
        private router: Router,
        private route: ActivatedRoute) {

    }

    ngOnInit() {
        // To bind Category and Ad Type dropdown with CategoryEnum and AdTypeEnum
        this.categories = Object.keys(this.category).filter(Number);
        this.adTypes = Object.keys(this.adType).filter(Number);

        // To bind City and State dropdowns with cities and states from DB
        this.locService.getStatesAndCities()
            .subscribe(data => {
                this.states = data[0]
                this.cities = data[1]
            },
            error => this.errorMessage = <any>error);

        this.isBack = this.route.snapshot.queryParams['isback'] || 'false';

        // If the request is a first request then delete the context and populate the search fields with default values.
        if (this.isBack == 'false') {
            this.adService.adSearchContext = undefined;
        }
        // If the request is a isback request then populate the search fields based on search context.
        this.selectedCategoryId = this.adService.adSearchContext.selectedCategoryId;
        this.selectedAdTypeId = this.adService.adSearchContext.selectedAdTypeId;
        this.selectedStateId = this.adService.adSearchContext.selectedStateId;
        this.selectedCityId = this.adService.adSearchContext.selectedCityId;
        this.selectedLocality = this.adService.adSearchContext.selectedLocality;
        this.selectedTitle = this.adService.adSearchContext.selectedTitle;
    }

    // On State dropdown selected index change reset the city dropdown selected value.
    onSelect(stateId: number) {
        this.selectedCityId = 0;
    }

    SearchAds(): void {
        // On search button click save the search context and navigate to search result page.
        this.adService.adSearchContext = {
            selectedCategoryId: this.selectedCategoryId,
            selectedAdTypeId: this.selectedAdTypeId,
            selectedStateId: this.selectedStateId,
            selectedCityId: this.selectedCityId,
            selectedLocality: this.selectedLocality,
            selectedTitle: this.selectedTitle,
            selectedPageSize: 3,
            selectedSortBy: 'createDate',
            selectedListView: true
        };

        this.router.navigate(['/ads/result']);
    }
}
