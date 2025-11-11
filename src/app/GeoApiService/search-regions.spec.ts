import { TestBed } from '@angular/core/testing';

import { SearchRegions } from './search-regions';

describe('SearchRegions', () => {
  let service: SearchRegions;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchRegions);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
