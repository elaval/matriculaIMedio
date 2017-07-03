/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ApiProviderService } from './api-provider.service';

describe('ApiProviderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApiProviderService]
    });
  });

  it('should ...', inject([ApiProviderService], (service: ApiProviderService) => {
    expect(service).toBeTruthy();
  }));
});
