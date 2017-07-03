import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { LayoutComponent } from './views/layout/layout.component';
import { SchoolSystemViewModule } from 'app/views/school-system-view/school-system-view.module';
import { DataService } from 'app/services/data.service';
import { CrossfilterService } from 'app/services/crossfilter.service';
import { MemoryCubeService } from 'app/services/data-providers/memory-cube.service';
import { ApiProviderService } from 'app/services/data-providers/api-provider.service';
import { LayoutsModule } from './views/layout/layouts.module';
import { Angulartics2Module, Angulartics2GoogleAnalytics } from 'angulartics2';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    SchoolSystemViewModule,
    LayoutsModule,
    Angulartics2Module.forRoot([ Angulartics2GoogleAnalytics ])
  ],
  providers: [
    DataService,
    ApiProviderService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
