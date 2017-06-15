import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { userRoutes } from './user.routes';
import { ProfileComponent } from './profile.component';
import { ChangePWDComponent } from './change-pwd.component';
import { MyAccountComponent } from './my-account.component';
import { UserAdsComponent } from './user-ads.component';
import { UserAdsResolver } from './user-ads.resolver';
import { ProfileGuard } from './profile-guard.service';
import { ChangePWDGuard } from './change-pwd-guard.service';

import {
    CollapsibleWellComponent
} from '../_common/index';

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(userRoutes)
    ],
    declarations: [
        ProfileComponent,
        ChangePWDComponent,
        MyAccountComponent,
        UserAdsComponent,
        CollapsibleWellComponent,
    ],
    providers: [
        UserAdsResolver,
        ProfileGuard,
        ChangePWDGuard
    ]
})
export class UserModule {

}