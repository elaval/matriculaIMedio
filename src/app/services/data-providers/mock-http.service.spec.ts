import { TestBed, inject } from '@angular/core/testing';

import { MockHttpService } from './mock-http.service';

describe('MockHttpService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MockHttpService]
    });
  });

  it('should ...', inject([MockHttpService], (service: MockHttpService) => {
    expect(service).toBeTruthy();
  }));
});
