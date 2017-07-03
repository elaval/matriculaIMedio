import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {BrowserModule} from '@angular/platform-browser';

import {NavigationModule} from './navigation/navigation.module';
import {TopnavbarModule} from './topnavbar/topnavbar.module';
import {FooterModule} from './footer/footer.module';
import { SchoolSystemViewModule } from 'app/views/school-system-view/school-system-view.module';
import { LayoutComponent } from 'app/views/layout/layout.component';

@NgModule({
    declarations: [LayoutComponent],
    imports     : [BrowserModule, NavigationModule,
    SchoolSystemViewModule],
    exports     : [LayoutComponent]
})

export class LayoutsModule {}
