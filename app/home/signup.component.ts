import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, AbstractControl, Validators, FormControlName } from '@angular/forms';
import { Router } from '@angular/router'

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { GenericValidator } from '../shared/generic-validator';

import { AuthService } from '../_services/index'
import { IUser } from '../_models/index';

import { fadeInAnimation } from '../_animations/index';

function passwordMatcher(c: AbstractControl): { [key: string]: boolean } | null {
    let passwordControl = c.get('password');
    let confirmControl = c.get('confirmPassword');

    if (passwordControl.pristine || confirmControl.pristine) {
        return null;
    }

    if (passwordControl.value === confirmControl.value) {
        return null;
    }
    return { 'match': true };
}

@Component({
    templateUrl: './app/home/signup.component.html',
    animations: [fadeInAnimation],
})
export class SignupComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

    pageTitle: string = 'Sing Up';
    userNameInvalid = false;
    errorMessage: string;
    signupForm: FormGroup;

    newUser: IUser;

    private sub: Subscription;

    // Use with the generic validation message class
    displayMessage: { [key: string]: string } = {};
    private validationMessages: { [key: string]: { [key: string]: string } };
    private genericValidator: GenericValidator;

    get isDirty(): boolean {
        if (this.signupForm.dirty) {
            return true;
        }
        return false;
    }

    constructor(
        private authService: AuthService,
        private router: Router,
        private fb: FormBuilder) {

        // Defines all of the validation messages for the form.
        // These could instead be retrieved from a file or database.
        this.validationMessages = {
            userName: {
                required: 'User Name is required.',
                minlength: 'User Name must be at least 8 characters.',
                maxlength: 'User Name cannot exceed 15 characters.'
            },
            confirmPassword: {
                required: 'Confirm Password is required.'
            },
            password: {
                required: 'Password is required.',
                minlength: 'Password should be at least 8 characters.',
                maxlength: 'Password should not be more than 15 characters.'
            },
            passwordGroup: {
                match: 'The confirmation does not match the password.'
            }
        };

        // Define an instance of the validator for use with this form, 
        // passing in this form's set of validation messages.
        this.genericValidator = new GenericValidator(this.validationMessages);

    }

    ngOnInit(): void {
        this.signupForm = this.fb.group({
            userName: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(15)]],
            passwordGroup: this.fb.group({
                password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(15)]],
                confirmPassword: ['', Validators.required],
            }, { validator: passwordMatcher })
        });

    }

    ngOnDestroy(): void {
        // this.sub.unsubscribe();
    }

    ngAfterViewInit(): void {
        // Watch for the blur event from any input element on the form.
        let controlBlurs: Observable<any>[] = this.formInputElements
            .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

        // Merge the blur event observable with the valueChanges observable
        Observable.merge(this.signupForm.valueChanges, ...controlBlurs).debounceTime(800).subscribe(value => {
            this.displayMessage = this.genericValidator.processMessages(this.signupForm);
        });
    }

    signUp(): void {
        if (this.signupForm.dirty && this.signupForm.valid) {
            this.userNameInvalid = false;

            this.newUser = this.authService.initializeUser();
            // // Copy the form values over the user object values
            // let u = Object.assign({}, this.newUser, this.signupForm.value);

            this.newUser.userName = this.signupForm.value.userName;
            this.newUser.password = this.signupForm.value.passwordGroup.password;

            this.sub = this.authService.saveUser(this.newUser)
                .subscribe(
                () => this.onSaveComplete(),
                (error: any) => {
                    if (<any>error === 'USERNAME_ALREADY_TAKEN')
                        this.userNameInvalid = true;
                    else
                        this.errorMessage = <any>error
                }
                );
        }

    }

    onSaveComplete(): void {
        // Reset the form to clear the flags
        this.signupForm.reset();
        this.router.navigate(['user/account/profile']);

        // if (this.authService.redirectUrl) {
        //     this.router.navigateByUrl(this.authService.redirectUrl);
        //     this.authService.redirectUrl = null;
        // } else {
        //     this.router.navigate(['ads']);
        // }

    }

}
