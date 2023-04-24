import { TestBed } from '@angular/core/testing';

import { FreeApiService } from './free-api.service';

describe('FreeApiService', () => {
  let service: FreeApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FreeApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
