import { Injectable } from '@angular/core'
import { Http, Response, Headers, RequestOptions } from '@angular/http';
// import { Observable } from 'rxjs/Rx';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

import { IUser } from '../_models/index';

@Injectable()
export class AuthService {

    private baseUrl = 'api/users';
    redirectUrl: string;

    get currentUser(): IUser {
        if (sessionStorage.getItem('currentUser')) {
            return JSON.parse(sessionStorage.getItem('currentUser'));
        }
        else
        {
            return undefined;
        }

    }
    set currentUser(value: IUser) {
        if (value) {
            sessionStorage.setItem('currentUser', JSON.stringify(value));
        }
        else {
            sessionStorage.removeItem('currentUser');
        }
    }

    constructor(private http: Http) {

    }

    loginUser(userName: string, password: string) {

        const url = `${this.baseUrl}/?userName=^${userName}$&password=^${password}$&isActive=true`;

        return this.http.get(url)
            .map(this.extractData)
            .map(data => data[0]).do(data => {
                if (data) {
                    this.currentUser = data;
                    console.log('loginUser: ' + JSON.stringify(data))
                }
            }).catch(error => {
                this.handleError;
                return Observable.of(false);
            })

    }

    changePassword(oldPassword: string, newPassword: string) {

        if (this.currentUser.password === oldPassword) {

            let headers = new Headers({ 'Content-Type': 'application/json' });
            let options = new RequestOptions({ headers: headers });

            let user: IUser = Object.assign({}, this.currentUser);
            user.password = newPassword;

            const url = `${this.baseUrl}/${user.id}`;
            this.http.put(url, user, options)
                .map(() => user)
                .do(data => {
                    if (data) {
                        this.currentUser = data;
                    }
                    console.log('changePassword: ' + JSON.stringify(data))
                }
                )
                .catch(this.handleError).subscribe();

            return Observable.of(true);
        }
        else {
            return Observable.of(false);
        }
    }

    //method to check whether user logged in or not
    isAuthenticated() {
        return !!this.currentUser;
    }

    //method to check whether logged in user is a admin
    isAdmin() {
        if (!!this.currentUser)
            return this.currentUser.isAdmin;
    }

    saveUser(user: IUser): Observable<IUser> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        //if the request is to create a new user account(from Sign Up page)
        if (user.id === 0) {
            return this.createUser(user, options);
        }
        //if the request is to update the user account(from Change Password or Edit Profile page)
        return this.updateCurrentUser(user, options);
    }

    private createUser(user: IUser, options: RequestOptions): Observable<IUser> {
        user.id = undefined;
        return this.http.post(this.baseUrl, user, options)
            .map(this.extractData)
            .do(data => {
                if (data) {
                    this.currentUser = data;
                }
                console.log('createUser: ' + JSON.stringify(data))
            }
            )
            .catch(this.handleError);
    }

    private updateCurrentUser(user: IUser, options: RequestOptions): Observable<IUser> {
        const url = `${this.baseUrl}/${user.id}`;
        return this.http.put(url, user, options)
            .map(() => user)
            .do(data => {
                if (data) {
                    this.currentUser = data;
                }
                console.log('updateUser: ' + JSON.stringify(data))
            }
            )
            .catch(this.handleError);
    }

    logout() {
        this.currentUser = undefined;
        return Observable.of(false);
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

    initializeUser(): IUser {
        let date = new Date
        // Return an initialized object
        return {
            id: 0,
            userName: null,
            password: null,
            isAdmin: false,
            firstName: null,
            lastName: null,
            email: null,
            mobile: null,
            emailNotification: false,
            mobileNotification: false,
            rating: null,
            sendEvents: false,
            addresses: [],
            isActive: true,
            createDate: date.toLocaleString(),
            modifyDate: null,
        };
    }
}