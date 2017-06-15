import { Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs/Rx';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/forkJoin';

import { IState, ICity } from '../_models/index';

@Injectable()
export class LocationService {

    stateList: IState[];
    cityList: ICity[];

    private stateUrl = 'api/states';
    private cityUrl = 'api/cities';

    constructor(private http: Http) {

    }

    // Uses Observable.forkJoin() to run multiple concurrent http.get() requests.
    // The entire operation will result in an error state if any single request fails.
    getStatesAndCities() {

        if (this.stateList && this.stateList.length > 0)
            return Observable.forkJoin(
                Observable.of(this.stateList),
                Observable.of(this.cityList));
        else {
            return Observable.forkJoin(
                this.http.get(this.stateUrl)
                .map(this.extractData)
                //  .map((response: Response) => <IState[]>response.json())
                    .do(data => {
                        this.stateList = data;
                        console.log('getStates: ' + JSON.stringify(data));
                    }
                    )
                    .catch(this.handleError),
                this.http.get(this.cityUrl)
                .map(this.extractData)
                //  .map((response: Response) => <ICity[]>response.json())
                    .do(data => {
                        this.cityList = data;
                        console.log('getCities: ' + JSON.stringify(data));
                    }
                    )
                    .catch(this.handleError)
            );
        }
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

}

