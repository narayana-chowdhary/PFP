import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { AdEditComponent } from './ad-edit.component';

@Injectable()
export class AdEditGuard implements CanDeactivate<AdEditComponent> {
    canDeactivate(component: AdEditComponent): boolean {
        if (component.isDirty) {
            return confirm(`Navigate away and lose all changes to ad?`);
        }
        return true;
    }
}
