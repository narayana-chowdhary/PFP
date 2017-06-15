import { NgModule }  from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { TruncatePipe } from './truncate.pipe';
import { CityFilterPipe } from '../shared/city-filter.pipe';
import { LocationService } from '../_services/index';
import { PagerService } from '../_common/index';

@NgModule({
  imports: [ 
    CommonModule
    ],
  exports : [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TruncatePipe,
    CityFilterPipe
  ],
  declarations: [ 
    TruncatePipe,
    CityFilterPipe
    ],
  providers: [
    LocationService,
    PagerService,
  ]
})
export class SharedModule { }
