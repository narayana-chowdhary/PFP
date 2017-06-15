import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, ElementRef, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, AbstractControl, ValidatorFn, FormControlName } from '@angular/forms';
import { Router } from '@angular/router'

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { AuthService, LocationService } from '../_services/index'
import { IUser, IAddress, IState, ICity } from '../_models/index';
import { TOASTR_TOKEN, Toastr } from '../_common/index'

import { NumberValidators } from '../shared/number.validator';
import { GenericValidator } from '../shared/generic-validator';

import { fadeInAnimation } from '../_animations/index';

function emailMatcher(c: AbstractControl): { [key: string]: boolean } | null {
  let emailControl = c.get('email');
  let confirmControl = c.get('confirmEmail');

  // if (emailControl.pristine || confirmControl.pristine) {
  //   return null;
  // }
  if ((emailControl.pristine || confirmControl.pristine)
    && (emailControl.value === '' && confirmControl.value == '')) {
    return null;
  }

  if (emailControl.value === confirmControl.value) {
    return null;
  }
  return { 'match': true };
}

@Component({
  templateUrl: 'app/user/profile.component.html',
    animations: [fadeInAnimation],
})
export class ProfileComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  profileForm: FormGroup;

  user: IUser;
  private sub: Subscription;

  // Use with the generic validation message class
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  addresseChanged: boolean = false;
  errorMessage: string;

  cities: ICity[] = [{
    id: 0,
    name: '--Select--',
    stateId: 0
  }];
  states: IState[];

  get isDirty(): boolean {
    if (this.profileForm.dirty || this.addresseChanged) {
      return true;
    }
    return false;
  }

  get addresses(): FormArray {
    return <FormArray>this.profileForm.get('addresses');
  }

  constructor(
    private authService: AuthService,
    private locService: LocationService,
    private router: Router,
    private fb: FormBuilder,
    @Inject(TOASTR_TOKEN) private toastr: Toastr) {

    // Defines all of the validation messages for the form.
    // These could instead be retrieved from a file or database.
    this.validationMessages = {
      firstName: {
        required: 'First Name is required.',
        minlength: 'First Name must be at least three characters.'
      },
      lastName: {
        required: 'Last Name is required.',
        maxlength: 'Last Name cannot exceed 50 characters.'
      },
      email: {
        required: 'Email is required.',
        pattern: 'Please enter a valid Email address.'
      },
      confirmEmail: {
        required: 'Confirm Email is required.'
      },
      emailGroup: {
        match: 'Confirm Email is required.'
      },
      mobile: {
        required: 'Mobile No. is required.',
        pattern: 'The Mobile No. must be 10 digit number.'
      },
      rating: {
        range: 'Rate us between 1 (lowest) and 5 (highest).'
      },
      locality: {
        required: 'Locality is required.'
      },
      city: {
        required: 'City is required.'
      },
      state: {
        required: 'State is required.'
      },
      zip: {
        required: 'Zip Code is required.',
        pattern: 'The Zip Code must be 6 digit number.'
      },
      addresses: {
        minlength: 'Please add at least one address to receive events notifications.'
      }
    };

    // Define an instance of the validator for use with this form, 
    // passing in this form's set of validation messages.
    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit(): void {
    this.addresseChanged = false;
    //this.errorMessage = null;

    this.sub = this.locService.getStatesAndCities()
      .subscribe(data => {
        this.states = data[0]
        this.cities = data[1]
      },
      error => this.errorMessage = <any>error);

    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      emailGroup: this.fb.group({
        email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+')]],
        confirmEmail: ['', Validators.required],
      }, { validator: emailMatcher }),
      mobile: ['', Validators.pattern('[0-9]{10}')],
      emailNotification: true,
      mobileNotification: false,
      rating: ['', NumberValidators.range(1, 5)],
      sendEventsDetails: false,
      addresses: this.fb.array([])
    });

    this.profileForm.get('mobileNotification').valueChanges
      .subscribe(value => this.setNotification(value));

    this.profileForm.get('sendEventsDetails').valueChanges
      .subscribe(value => this.setEventsDetails(value));

    this.populateUserProfile(this.authService.currentUser)

  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  ngAfterViewInit(): void {
    // Watch for the blur event from any input element on the form.
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    // Merge the blur event observable with the valueChanges observable
    Observable.merge(this.profileForm.valueChanges, ...controlBlurs).debounceTime(800).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.profileForm);
    });
  }

  setNotification(notifyVia: boolean): void {
    const mobileControl = this.profileForm.get('mobile');
    if (notifyVia === true) {
      mobileControl.setValidators([Validators.required, Validators.pattern('[0-9]{10}')]);
    } else {
      mobileControl.setValidators(Validators.pattern('[0-9]{10}'));
    }
    mobileControl.updateValueAndValidity();
  }

  setEventsDetails(sendEvents: boolean): void {
    if (sendEvents === true) {
      this.addresses.setValidators(Validators.compose([Validators.required, Validators.minLength(1)]));
    } else {
      this.addresses.clearValidators();
    }
    this.addresses.updateValueAndValidity();
  }

  // Add a new address to the list of addresses.
  addAddress(): void {
    this.addresses.push(this.buildAddress(null));
    this.addresseChanged = true;
  }

  // Remove the address from the list of addresses.
  removeAddress(idx: number): void {
    this.addresses.removeAt(idx);
    this.addresseChanged = true;
  }

  // Build a new address FormGroup
  buildAddress(address: IAddress): FormGroup {
    if (address) {
      return this.fb.group({
        locality: [address.locality, Validators.required],
        city: [address.cityId, Validators.required],
        state: [address.stateId, Validators.required],
        zip: [address.zip, [Validators.required, Validators.pattern('[0-9]{6}')]]
      })
    }
    else {
      return this.fb.group({
        locality: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        zip: ['', [Validators.required, Validators.pattern('[0-9]{6}')]]
      });
    }
  }

  populateUserProfile(user: IUser): void {
    if (this.profileForm) {
      this.profileForm.reset();
    }
    //this.user = user;
    this.user = Object.assign({}, user);

    // Update the data on the form
    this.profileForm.patchValue({
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      emailGroup: {
        email: this.user.email,
        confirmEmail: this.user.email
      },
      mobile: this.user.mobile,
      emailNotification: this.user.emailNotification,
      mobileNotification: this.user.mobileNotification,
      rating: this.user.rating,
      sendEventsDetails: this.user.sendEvents
    });
    if (this.user.sendEvents) {
      // this.profileForm.setControl('addresses', this.fb.array(this.bindAddress(this.user.addresses)));

      if (this.user.addresses)
        this.profileForm.setControl('addresses', this.fb.array(this.user.addresses.map((address: IAddress) =>
          (this.buildAddress(address)))));
      else
        this.profileForm.setControl('addresses', this.fb.array([this.buildAddress(null)]));

      // const addressFGs = this.user.addresses.map(address => this.fb.group(address));
      // const addressFormArray = this.fb.array(addressFGs);
      // this.profileForm.setControl('addresses', addressFormArray);

      this.addresses.setValidators(Validators.compose([Validators.required, Validators.minLength(1)]));
    }
  }

  saveProfile(): void {
    if ((this.profileForm.dirty && this.profileForm.valid) ||
      (this.addresseChanged)) {

      this.getUserProfile();

      this.authService.saveUser(this.user)
        .subscribe(
        () => this.onSaveComplete(),
        (error: any) => this.errorMessage = <any>error
        );

    } else if (!this.profileForm.dirty) {
      this.onSaveComplete();
    }
  }

  onSaveComplete(): void {
    // Reset the form to clear the flags
    //this.profileForm.reset();
    this.ngOnInit();
    //this.router.navigate(['ads']);

    this.toastr.success('Profile updated successful');
  }

  reset(): void {
    this.ngOnInit();
  }

  getUserProfile() {
    this.user.firstName = this.profileForm.value.firstName;
    this.user.lastName = this.profileForm.value.lastName;
    this.user.email = this.profileForm.value.emailGroup.email;
    this.user.mobile = this.profileForm.value.mobile
    this.user.emailNotification = this.profileForm.value.emailNotification
    this.user.mobileNotification = this.profileForm.value.mobileNotification
    this.user.rating = this.profileForm.value.rating
    this.user.sendEvents = this.profileForm.value.sendEventsDetails
    this.user.addresses = [];
    if (this.user.sendEvents) {
      if (!!this.addresses) {
        for (let i = 0; i < this.addresses.length; i++) {
          this.user.addresses.push({
            id: i + 1,
            locality: this.addresses.get(i.toString() + '.locality').value,
            cityId: this.addresses.get(i.toString() + '.city').value,
            stateId: this.addresses.get(i.toString() + '.state').value,
            zip: this.addresses.get(i.toString() + '.zip').value,
            userId: this.user.id
          })
        }
      }
    }
  }

}
