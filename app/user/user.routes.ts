import { ProfileComponent } from './profile.component';
import { MyAccountComponent } from './my-account.component';
import { ChangePWDComponent } from './change-pwd.component';
import { UserAdsComponent } from './user-ads.component';
import { AuthGuard } from './auth-guard.service';
import { UserAdsResolver } from './user-ads.resolver';
import { ProfileGuard } from './profile-guard.service';
import { ChangePWDGuard } from './change-pwd-guard.service';

export const userRoutes = [
    {
        path: 'account',
        canActivate: [ AuthGuard ],
        component: MyAccountComponent,
        children: [
            {
                path: '',
                redirectTo: 'ads',
                pathMatch: 'full'
            },
            {
                path: 'ads',
                component: UserAdsComponent,
                resolve: { ads: UserAdsResolver },
            },
            {
                path: 'profile',
                component: ProfileComponent,
                canDeactivate: [ProfileGuard]
            },
            {
                path: 'pwd',
                component: ChangePWDComponent,
                canDeactivate: [ChangePWDGuard]
            }
        ]
    }
]