// import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Component, Input} from '@angular/core';
import { IAd, CategoryEnum, AdTypeEnum } from '../_models/index';

@Component({
    selector: 'ad-thumbnail',
    templateUrl: './app/ads/ad-thumbnail.component.html',
    styles: [`
    .thumbnail { min-height: 310px;}
    .fill {
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
    }
    .fill img {
        flex-shrink: 0;
        min-width: 100%;
        min-height: 100%
    }
    `]
})
export class AdThumbnailComponent {
    @Input() ad: IAd

    category = CategoryEnum;
    adType = AdTypeEnum;

}
