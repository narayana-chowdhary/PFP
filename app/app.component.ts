import { Component } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError, NavigationCancel } from '@angular/router';

@Component({
  selector: 'pfp-app',
  templateUrl: 'app/app.component.html',
  styles: [`
    @media (max-width: 1200px) {#sideBarDiv {display:none}}
    @media (max-width: 1200px) {#routerDiv {width:100%}}
  `]
})
export class AppComponent {

  loading: boolean = true;

  constructor(private router: Router) {
    router.events.subscribe((routerEvent: Event) => {
      this.checkRouterEvent(routerEvent);
    });
  }

  checkRouterEvent(routerEvent: Event): void {
    if (routerEvent instanceof NavigationStart) {
      this.loading = true;
    }

    if (routerEvent instanceof NavigationEnd ||
      routerEvent instanceof NavigationCancel ||
      routerEvent instanceof NavigationError) {
      this.loading = false;
    }
  }

    displaySideBar(): void {
        // Example of primary and secondary routing together
        // this.router.navigate(['/login', {outlets: { popup: ['relatedads']}}]); // Does not work
        // this.router.navigate([{outlets: { primary: ['login'], popup: ['relatedads']}}]); // Works
        this.router.navigate([{outlets: { popup: ['relatedads']}}]); // Works

    }
    
    hideSideBar(): void {
        this.router.navigate([{ outlets: { popup: null } }]);
    }

}
