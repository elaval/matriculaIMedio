import { Component, AfterViewInit } from '@angular/core';
import {Router} from '@angular/router';

declare var jQuery: any;

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'navigation',
    templateUrl: 'navigation.template.html'
})

export class NavigationComponent implements AfterViewInit {

    constructor(private router: Router) {}

    ngAfterViewInit() {
        jQuery('#side-menu').metisMenu();
    }

    activeRoute(routename: string): boolean {
        return this.router.url.indexOf(routename) > -1;
    }


}
