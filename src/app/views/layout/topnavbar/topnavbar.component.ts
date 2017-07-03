import { Component } from '@angular/core';
import { smoothlyMenu } from '../../../app.helpers';
declare var jQuery: any;

@Component({
    selector: 'app-topnavbar',
    styleUrls: ['./topnavbar.css'],
    templateUrl: 'topnavbar.template.html'
})
export class TopnavbarComponent {
    searchText: string;

    constructor(
    ) {}

    toggleNavigation(): void {
        jQuery('body').toggleClass('mini-navbar');
        smoothlyMenu();
    }

    getVoice() {
 
    }

    onEnter(question) {
    }

}
