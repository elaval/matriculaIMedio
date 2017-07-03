import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { SchoolSystemViewComponent } from './school-system-view.component';
import { MatriculaDeficitComponent } from 'app/views/matricula-deficit/matricula-deficit.component';
import { FormsModule } from '@angular/forms';
import { WidgetComunaComponent } from 'app/views/widget-comuna/widget-comuna.component';
import { WidgetMigracionIntercomunalComponent } from 'app/views/widget-migracion-intercomunal/widget-migracion-intercomunal.component';
import { WidgetMigracionIntracomunalComponent } from 'app/views/widget-migracion-intracomunal/widget-migracion-intracomunal.component';
import { DebugComponent } from 'app/views/debug/debug.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
  ],
  declarations: [
    SchoolSystemViewComponent,
    MatriculaDeficitComponent,
    WidgetComunaComponent,
    WidgetMigracionIntercomunalComponent,
    WidgetMigracionIntracomunalComponent,
    DebugComponent
  ],
  exports: [
    SchoolSystemViewComponent,
  ]
})
export class SchoolSystemViewModule { }
