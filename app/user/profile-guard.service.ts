import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';

import { ProfileComponent } from './profile.component';

@Injectable()
export class ProfileGuard implements CanDeactivate<ProfileComponent> {

    canDeactivate(component: ProfileComponent): boolean {
        if (component.isDirty) {
            return confirm(`Navigate away and lose all changes to profile?`);
        }
        return true;
    }
}
