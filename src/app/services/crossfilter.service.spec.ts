/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CrossfilterService } from './crossfilter.service';

describe('CrossfilterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CrossfilterService]
    });
  });

  it('should ...', inject([CrossfilterService], (service: CrossfilterService) => {
    expect(service).toBeTruthy();
  }));
});
