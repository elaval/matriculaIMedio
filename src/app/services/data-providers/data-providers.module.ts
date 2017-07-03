import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MemoryCubeService } from './memory-cube.service';
import { ApiProviderService } from './api-provider.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers : [
    MemoryCubeService,
    ApiProviderService
  ]
})
export class DataProvidersModule { }
