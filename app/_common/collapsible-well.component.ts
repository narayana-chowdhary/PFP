import { Component, Input } from '@angular/core';

@Component({
        selector: 'collapsible-well',
        template: `
        <div (click)="toggleContent()" class="well pointable hoverwell" [ngClass]="{'active': visible }">
                <ng-content select="[well-title]"></ng-content>
        </div>
        <div *ngIf="visible" style="border: 1px solid #e3e3e3;">
                <ng-content  select="[well-body]"></ng-content>
        </div>
        `
        ,
        styles: [`
        .well {
        min-height: 5px;
        padding: 5px;
        margin-bottom: 1px;
        background-color: #f5f5f5;
        border: 0px solid transparent;
        border-left: 5px solid #337ab7;
        border-bottom: 1px solid #337ab7;
        border-radius: 0px;
        -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .05);
                box-shadow: inset 0 1px 1px rgba(0, 0, 0, .05);
        }
        .well div { color: #bbb; }
        .hoverwell:hover { background-color: #a7ce3a; }
        .active { background-color: #a7ce3a; border-left: 0px solid #337ab7; }
        `]
})
export class CollapsibleWellComponent {
        visible: boolean = false;
        toggleContent() {
                this.visible = !this.visible;
        }
}