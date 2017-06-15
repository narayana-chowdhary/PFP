import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs/Rx';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

import { IAd, CategoryEnum, AdTypeEnum, IAdSearchContext } from '../_models/index';

@Injectable()
export class AdService {

    get adSearchContext(): IAdSearchContext {
        if (sessionStorage.getItem('adSearchContext')) {
            return JSON.parse(sessionStorage.getItem('adSearchContext'));
        }
        else {
            return {
                selectedCategoryId: CategoryEnum["Plant"],
                selectedAdTypeId: AdTypeEnum["Offering Ad"],
                selectedStateId: 0,
                selectedCityId: 0,
                selectedLocality: '',
                selectedTitle: '',
                selectedPageSize: 3,
                selectedSortBy: 'createDate',
                selectedListView: true
            };
        }
    }

    set adSearchContext(value: IAdSearchContext) {
        if (value) {
            sessionStorage.setItem('adSearchContext', JSON.stringify(value));
        }
        else {
            sessionStorage.removeItem('adSearchContext');
        }
    }

    private baseUrl = 'api/ads';

    constructor(private http: Http) {

    }

    getAds(): Observable<IAd[]> {

        let adFilters: string = 'adType=' + this.adSearchContext.selectedAdTypeId + '&itemCategory=' + this.adSearchContext.selectedCategoryId;
        if (this.adSearchContext.selectedLocality)
            adFilters = adFilters + '&locality=' + this.adSearchContext.selectedLocality;
        if (this.adSearchContext.selectedTitle)
            adFilters = adFilters + '&adTitle=' + this.adSearchContext.selectedTitle;
        if (this.adSearchContext.selectedStateId > 0)
            adFilters = adFilters + '&stateId=' + this.adSearchContext.selectedStateId;
        if (this.adSearchContext.selectedCityId > 0)
            adFilters = adFilters + '&cityId=' + this.adSearchContext.selectedCityId;

        console.log('adFilters: ' + adFilters);

        const url = `${this.baseUrl}/?${adFilters}`;

        return this.http.get(url)
            .map(this.extractData)
            .do(data => console.log('getAds: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    getUserAds(id: number): Observable<IAd[]> {
        //const url = `${this.baseUrl}/?createUserId=${id}&isActive=true`;
        const url = `${this.baseUrl}/?createUserId=${id}`;
        return this.http.get(url)
            .map(this.extractData)
            .do(data => console.log('getUserAds: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    getAd(id: number): Observable<IAd> {
        if (id === 0) {
            return Observable.of(this.initializeAd());
            // return Observable.create((observer: any) => {
            //     observer.next(this.initializeAd());
            //     observer.complete();
            // });
        };
        const url = `${this.baseUrl}/${id}`;
        return this.http.get(url)
            .map(this.extractData)
            .do(data => console.log('getAd: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    saveAd(ad: IAd): Observable<IAd> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        if (ad.id === 0) {
            return this.createAd(ad, options);
        }
        return this.updateAd(ad, options);
    }

    private createAd(ad: IAd, options: RequestOptions): Observable<IAd> {
        ad.id = undefined;
        return this.http.post(this.baseUrl, ad, options)
            .map(this.extractData)
            .do(data => console.log('createAd: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    private updateAd(ad: IAd, options: RequestOptions): Observable<IAd> {
        const url = `${this.baseUrl}/${ad.id}`;
        return this.http.put(url, ad, options)
            .map(() => ad)
            .do(data => console.log('updateAd: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    deleteAd(id: number): Observable<Response> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        const url = `${this.baseUrl}/${id}`;
        return this.http.delete(url, options)
            .do(data => console.log('deleteAd: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    private extractData(response: Response) {
        let body = response.json();
        return body.data || {};
    }

    private handleError(error: Response): Observable<any> {
        // in a real world app, we may send the server to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }

    initializeAd(): IAd {
        let date = new Date
        // Return an initialized object
        return {
            id: 0,
            itemCategory: 1,
            adType: 1,
            adTitle: null,
            specialCharactistics: null,
            easeOfAccess: null,
            description: null,
            imageUrls: [],
            postedByName: null,
            contactEmail: null,
            contactPhone: null,
            maintainPrivacy: true,
            locality: null,
            cityId: null,
            cityName: null,
            stateId: null,
            stateName: null,
            isActive: true,
            createDate: date.toLocaleString(),
            createUserId: null
        };
    }

}
