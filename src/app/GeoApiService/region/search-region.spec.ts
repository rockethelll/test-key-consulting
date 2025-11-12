import { TestBed } from '@angular/core/testing';

import { SearchRegion } from './search-region';

describe('SearchRegions', () => {
  let service: SearchRegion;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchRegion);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
