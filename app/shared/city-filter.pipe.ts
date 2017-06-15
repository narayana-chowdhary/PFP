import { PipeTransform, Pipe } from '@angular/core';
import { ICity } from '../_models/index';

@Pipe({
    name: 'cityFilter'
})
export class CityFilterPipe implements PipeTransform {
    transform(value: ICity[], stateId: number): ICity[] {
        stateId = stateId ? stateId : 0;
        return value.filter((city: ICity) =>
            city.stateId == stateId);
    }
}