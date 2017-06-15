import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { NavBarComponent } from './nav/navbar.component';

import {
  JQ_TOKEN,
  TOASTR_TOKEN,
  Toastr
} from './_common/index';

import { AuthService, AdService } from './_services/index';
import { AuthGuard } from './user/auth-guard.service';
import { SignupGuard } from './home/signup-guard.service';
import { LoginGuard } from './home/login-guard.service';

import { AppRoutingModule } from './app-routing.module';
import { Error404Component } from './errors/404.component';
import { NotImplementedComponent } from './errors/notimplemented.component';
import { HomeComponent } from './home/home.component';

import { LoginComponent } from './home/login.component';
import { SignupComponent } from './home/signup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { PFPData } from './pfp-data';

declare let toastr: Toastr;
declare let jQuery: Object;

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    InMemoryWebApiModule.forRoot(PFPData, {
      delay: 1000 , passThruUnknownUrl: true
      //config.caseSensitiveSearch = true
    }),
    AppRoutingModule
  ],
  declarations: [
    AppComponent,
    NavBarComponent,
    Error404Component,
    NotImplementedComponent,
    HomeComponent,
    LoginComponent,
    SignupComponent,
  ],
  providers: [
    AuthService,
    AuthGuard,
    SignupGuard,
    LoginGuard,
    AdService,
    { provide: TOASTR_TOKEN, useValue: toastr },
    { provide: JQ_TOKEN, useValue: jQuery },
    // { provide: API_ENDPOINT, useValue: 'http://localhost:59970' },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
