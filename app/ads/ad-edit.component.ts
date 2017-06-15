import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, ElementRef, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormControlName } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { IAd, CategoryEnum, AdTypeEnum, IState, ICity } from '../_models/index';
import { AdService, AuthService, LocationService } from '../_services/index';

import { TOASTR_TOKEN, Toastr } from '../_common/index'

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { GenericValidator } from '../shared/generic-validator';

import { fadeInAnimation } from '../_animations/index';

@Component({
    templateUrl: './app/ads/ad-edit.component.html',
    animations: [fadeInAnimation],
})
export class AdEditComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

    pageTitle: string = 'Ad Edit';
    errorMessage: string;
    adEditForm: FormGroup;

    ad: IAd
    private sub: Subscription;

    // Use with the generic validation message class
    displayMessage: { [key: string]: string } = {};
    private validationMessages: { [key: string]: { [key: string]: string } };
    private genericValidator: GenericValidator;

    // To handle dynamic image button list.
    newImageUrl = '';
    imageUrls: string[];
    imageUpdated: boolean = false;

    // To populate Category and Ad Type dropdowns with CategoryEnum and AdTypeEnum.
    categories: any[];
    category = CategoryEnum;
    adTypes: any[];
    adType = AdTypeEnum;

    // To populate state and city dropdown with states and cities from DB.
    cities: ICity[] = [{
        id: 0,
        name: '--Select--',
        stateId: 0
    }];
    states: IState[];

    // mode: string;

    // To get form state from canDeactivate guard
    get isDirty(): boolean {
        if (this.adEditForm.dirty) {
            return true;
        }
        return false;
    }

    constructor(private route: ActivatedRoute,
        private adService: AdService,
        private authService: AuthService,
        private locService: LocationService,
        private router: Router,
        private fb: FormBuilder,
        @Inject(TOASTR_TOKEN) private toastr: Toastr) {

        // Defines all of the validation messages for the form.
        // These could instead be retrieved from a file or database.
        this.validationMessages = {
            itemCategory: {
                required: 'Category is required.'
            },
            adType: {
                required: 'Ad Type is required.'
            },
            adTitle: {
                required: 'Ad Title is required.',
                minlength: 'Ad Title must be at least 10 characters.'
            },
            locality: {
                required: 'Locality is required.',
                minlength: 'Locality must be at least 3 characters.'
            },
            city: {
                required: 'City is required.'
            },
            state: {
                required: 'State is required.'
            },
            imageUrl: {
                pattern: 'Must be a .png or .jpg url.'
            },
            postedByName: {
                required: 'Name is required.',
                minlength: 'Name must be at least 3 characters.'
            },
            contactEmail: {
                required: 'Email is required.',
                pattern: 'Please enter a valid email address.'
            },
            contactPhone: {
                required: 'Mobile No. is required.',
                pattern: 'The Mobile No. must be 10 digit number.'
            }
        };

        // Define an instance of the validator for use with this form, 
        // passing in this form's set of validation messages.
        this.genericValidator = new GenericValidator(this.validationMessages);
    }

    ngOnInit(): void {
        // this.mode = this.route.snapshot.queryParams['mode'] || 'add';
        // console.log('mode: '+this.mode);

        this.categories = Object.keys(this.category).filter(Number)
        this.adTypes = Object.keys(this.adType).filter(Number)

        this.locService.getStatesAndCities()
            .subscribe(data => {
                this.states = data[0]
                this.cities = data[1]
            },
            error => this.errorMessage = <any>error);

        // let emailRegex = '^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$';

        this.adEditForm = this.fb.group({
            itemCategory: ['', [Validators.required]],
            adType: ['', [Validators.required]],
            adTitle: ['', [Validators.required, Validators.minLength(10)]],
            specialCharactistics: '',
            easeOfAccess: '',
            description: '',
            locality: ['', [Validators.required, Validators.minLength(3)]],
            city: ['', [Validators.required]],
            state: ['', [Validators.required]],
            imageUrl: ['', [Validators.pattern('.*\/.*.(png|jpg)')]],
            postedByName: ['', [Validators.required, Validators.minLength(3)]],
            contactEmail: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+')]],
            contactPhone: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
            maintainPrivacy: false,

        });
        // Watch for changes to the resolve data
        this.sub = this.route.data.subscribe(data => {
            this.onAdRetrieved(data['ad']);
        });
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }

    ngAfterViewInit(): void {
        // Watch for the blur event from any input element on the form.
        let controlBlurs: Observable<any>[] = this.formInputElements
            .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));
        // Merge the blur event observable with the valueChanges observable
        Observable.merge(this.adEditForm.valueChanges, ...controlBlurs).debounceTime(800).subscribe(value => {
            this.displayMessage = this.genericValidator.processMessages(this.adEditForm);
        });
    }

    onAdRetrieved(ad: IAd): void {
        // if (this.adEditForm) {
        //     this.adEditForm.reset();
        // }
        this.ad = Object.assign({}, ad);
        // Adjust the title
        if (this.ad.id === 0) {
            this.pageTitle = 'Add Ad';
        } else {
            this.pageTitle = `Edit Ad: ${this.ad.adTitle}`;
        }
        this.populateAdData()
    }

    addImageUrl(): void {
        this.imageUrls.push(this.newImageUrl);
        this.newImageUrl = '';
        this.imageUpdated = true;
    }
    removeImage(index: number): void {
        if (index !== -1) {
            this.imageUrls.splice(index, 1);
        }
        this.imageUpdated = true;
    }

    populateAdData(): void {
        if (this.adEditForm) {
            this.adEditForm.reset();
        }

        if (this.ad.id === 0) {
            this.ad.postedByName = this.authService.currentUser.lastName;
            this.ad.contactEmail = this.authService.currentUser.email;
            this.ad.contactPhone = this.authService.currentUser.mobile;
            this.ad.imageUrls = [];
            
        }
        // Update the data on the form
        this.adEditForm.patchValue({
            itemCategory: this.ad.itemCategory,
            adType: this.ad.adType,
            adTitle: this.ad.adTitle,
            specialCharactistics: this.ad.specialCharactistics,
            easeOfAccess: this.ad.easeOfAccess,
            description: this.ad.description,
            locality: this.ad.locality,
            city: this.ad.cityId || '',
            state: this.ad.stateId || '',
            postedByName: this.ad.postedByName,
            contactEmail: this.ad.contactEmail,
            contactPhone: this.ad.contactPhone,
            maintainPrivacy: this.ad.maintainPrivacy,
        });
        this.imageUrls = this.ad.imageUrls.slice();
    }

    saveAd(): void {
        if (this.adEditForm.dirty && this.adEditForm.valid) {
            this.ad.itemCategory = this.adEditForm.value.itemCategory;
            this.ad.adType = this.adEditForm.value.adType;
            this.ad.adTitle = this.adEditForm.value.adTitle;
            this.ad.specialCharactistics = this.adEditForm.value.specialCharactistics;
            this.ad.easeOfAccess = this.adEditForm.value.easeOfAccess;
            this.ad.description = this.adEditForm.value.description;
            this.ad.locality = this.adEditForm.value.locality;
            this.ad.cityId = this.adEditForm.value.city;
            this.ad.cityName = this.cities.find(city => city.id == +this.adEditForm.value.city).name;
            this.ad.stateId = this.adEditForm.value.state;
            this.ad.stateName = this.states.find(state => state.id == +this.adEditForm.value.state).name;
            this.ad.postedByName = this.adEditForm.value.postedByName;
            this.ad.contactEmail = this.adEditForm.value.contactEmail;
            this.ad.contactPhone = this.adEditForm.value.contactPhone;
            this.ad.maintainPrivacy = this.adEditForm.value.maintainPrivacy;
            if (!this.imageUrls || this.imageUrls.length == 0)
                this.ad.imageUrls = ['/app/assets/images/save-plants.png'];
            else
                this.ad.imageUrls = this.imageUrls.slice();

            let date = new Date;
            if (this.ad.id === 0) {
                this.ad.createUserId = this.authService.currentUser.id;
                this.ad.createDate = date.toLocaleString();
            }
            else
            {
                this.ad.modifyDate = date.toLocaleString();
            }

            this.adService.saveAd(this.ad)
                .subscribe(
                () => this.onSaveComplete(),
                (error: any) => this.errorMessage = <any>error
                );

        } else if (!this.adEditForm.dirty) {
            this.onSaveComplete();
        }
    }

    onSaveComplete(): void {
        // Reset the form to clear the flags
        this.adEditForm.reset();
        this.router.navigate(['user/account/ads']);
        // Adjust the message
        if (this.ad.id === 0) {
            this.toastr.success('Ad added successful');
        } else {
            this.toastr.success('Ad updated successful');
        }
    }

    reset(): void {
        this.imageUrls = [];
        this.ngOnInit();
        this.imageUpdated = false;
    }

    deleteAd(): void {
        if (confirm(`Do you really want to delete this ad?`)) {
            this.adService.deleteAd(this.ad.id)
                .subscribe(
                () => this.onDeleteComplete(),
                (error: any) => this.errorMessage = <any>error
                );
        }
    }

    onDeleteComplete(): void {
        // Reset the form to clear the flags
        this.adEditForm.reset();
        this.router.navigate(['user/account/ads']);
        this.toastr.success('Ad deleted successful');
    }

    onBack(): void {
        this.router.navigate(['/user/account/ads'], { queryParams: { 'isback': 'true' } });
    }

    onSelect(stateId: number) {
        this.adEditForm.patchValue({
            city: ''
        });
    }
}
