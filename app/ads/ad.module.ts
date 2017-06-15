import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';

import { AdSearchComponent } from './ad-Search.component';

import { AdListComponent } from './ad-list.component';
import { AdThumbnailComponent } from './ad-thumbnail.component';
import { AdListResolver } from './ad-list.resolver';

import { AdDetailsComponent } from './ad-details.component';
import { AdDetailsResolver } from './ad-details.resolver';

import { AdEditComponent } from './ad-edit.component';
import { AuthGuard } from '../user/auth-guard.service';
import { AdEditGuard } from './ad-guard.service';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        redirectTo: 'search',
        pathMatch: 'full'
      },
      {
        path: 'search',
        component: AdSearchComponent
      },
      {
        path: 'result',
        component: AdListComponent,
        resolve: { ads: AdListResolver }
      },
      {
        path: ':id',
        component: AdDetailsComponent,
        resolve: { ad: AdDetailsResolver }
      },
      {
        path: ':id/edit',
        component: AdEditComponent,
        resolve: { ad: AdDetailsResolver },
        canActivate: [AuthGuard],
        canDeactivate: [AdEditGuard],
      }
    ])
  ],
  declarations: [
    AdSearchComponent,
    AdListComponent,
    AdThumbnailComponent,
    AdDetailsComponent,
    AdEditComponent
  ],
  providers: [
    AdListResolver,
    AdDetailsResolver,
    AdEditGuard
  ]
})
export class AdModule { }
