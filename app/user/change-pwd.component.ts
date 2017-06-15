import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, ElementRef, Inject } from '@angular/core';
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
import { TOASTR_TOKEN, Toastr } from '../_common/index'

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
    templateUrl: './app/user/change-pwd.component.html',
    animations: [fadeInAnimation],
})
export class ChangePWDComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

    errorMessage: string;
    changePWDForm: FormGroup;
    passwordInvalid = false;
    passwordMessage: string;

    private sub: Subscription;

    // Use with the generic validation message class
    displayMessage: { [key: string]: string } = {};
    private validationMessages: { [key: string]: { [key: string]: string } };
    private genericValidator: GenericValidator;

    get isDirty(): boolean {
        if (this.changePWDForm.dirty) {
            return true;
        }
        return false;
    }

    constructor(
        private authService: AuthService,
        private router: Router,
        private fb: FormBuilder,
        @Inject(TOASTR_TOKEN) private toastr: Toastr) {

        // Defines all of the validation messages for the form.
        // These could instead be retrieved from a file or database.
        this.validationMessages = {
            oldPassword: {
                required: 'Old Password is required.'
            },
            password: {
                required: 'New Password is required.',
                minlength: 'New Password must be at least 8 characters.'
            },
            confirmPassword: {
                required: 'Confirm New Password is required.'
            },
            passwordGroup: {
                match: 'The confirmation password does not match the new password.'
            }
        };

        // Define an instance of the validator for use with this form, 
        // passing in this form's set of validation messages.
        this.genericValidator = new GenericValidator(this.validationMessages);
    }

    ngOnInit(): void {
        this.changePWDForm = this.fb.group({
            oldPassword: ['', [Validators.required]],
            passwordGroup: this.fb.group({
                password: ['', [Validators.required, Validators.minLength(8)]],
                confirmPassword: ['', Validators.required],
            }, { validator: passwordMatcher })
        });
    }

    ngAfterViewInit(): void {
        // Watch for the blur event from any input element on the form.
        let controlBlurs: Observable<any>[] = this.formInputElements
            .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

        // Merge the blur event observable with the valueChanges observable
        Observable.merge(this.changePWDForm.valueChanges, ...controlBlurs).debounceTime(800).subscribe(value => {
            this.displayMessage = this.genericValidator.processMessages(this.changePWDForm);
        });
    }

    changePassword(): void {
        if (this.changePWDForm.dirty && this.changePWDForm.valid) {
            this.sub = this.authService.changePassword(this.changePWDForm.value.oldPassword, this.changePWDForm.value.passwordGroup.password)
                .subscribe(resp => {
                    if (!resp) {
                        this.passwordInvalid = true;
                    } else {
                        this.onComplete();
                    }
                })
        }
    }
    ngOnDestroy(): void {
        if (this.sub)
            this.sub.unsubscribe();
    }
    onComplete(): void {
        // Reset the form to clear the flags
        this.changePWDForm.reset();
        this.router.navigate(['/ads/search']);
        this.toastr.success('Password changed successful');
    }

}
