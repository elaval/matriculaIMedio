/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MemoryCubeService } from './memory-cube.service';

describe('MemoryCubeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MemoryCubeService]
    });
  });

  it('should ...', inject([MemoryCubeService], (service: MemoryCubeService) => {
    expect(service).toBeTruthy();
  }));
});
