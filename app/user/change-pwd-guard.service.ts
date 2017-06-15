import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';

import { ChangePWDComponent } from './change-pwd.component';

@Injectable()
export class ChangePWDGuard implements CanDeactivate<ChangePWDComponent> {

    canDeactivate(component: ChangePWDComponent): boolean {
        if (component.isDirty) {
            return confirm(`Navigate away and lose all changes?`);
        }
        return true;
    }
}
