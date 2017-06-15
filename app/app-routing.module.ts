import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './home/login.component';
import { SignupComponent } from './home/signup.component';
import { SignupGuard } from './home/signup-guard.service';
import { LoginGuard } from './home/login-guard.service';

import { SelectiveStrategy } from './selective-strategy.service';

import { Error404Component } from './errors/404.component';
import { NotImplementedComponent } from './errors/notimplemented.component';

const APPROUTES = [
    { path: 'home', component: HomeComponent },
    //{ path: 'welcome', redirectTo: 'home', pathMatch: 'full' },
    { path: 'login', component: LoginComponent, canActivate: [LoginGuard]  },
    { path: 'signup', component: SignupComponent, canDeactivate: [SignupGuard], canActivate: [SignupGuard] },
    { path: 'user', loadChildren: 'app/user/user.module#UserModule' },
    {
        path: 'ads',
        data: { preload: true },
        loadChildren: 'app/ads/ad.module#AdModule'
    },
    { path: 'notimplemented', component: NotImplementedComponent },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: '**', component: Error404Component }
]

@NgModule({
    imports: [
        RouterModule.forRoot(APPROUTES, { preloadingStrategy: SelectiveStrategy }) //, { enableTracing: true })
    ],
    providers: [SelectiveStrategy],
    exports: [RouterModule]
})
export class AppRoutingModule { }