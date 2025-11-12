import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { environment } from '../../../environments/environment';
import { Region, SearchRegion } from './search-region';

describe('SearchRegion', () => {
  let service: SearchRegion;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SearchRegion,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(SearchRegion);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Check that there are no open requests remaining
    httpMock.verify();
    TestBed.resetTestingModule();
  });

  it('should call the correct API URL and return mock data', async () => {
    const regionName = 'Bretagne';
    const mockRegions: Region[] = [{ nom: 'Bretagne', code: '53', _score: 1 }];

    // Convert the observable to a promise
    const promise = firstValueFrom(service.searchRegion(regionName));

    // Expect a request to the API
    const req = httpMock.expectOne(environment.regionsUrl(regionName));
    expect(req.request.method).toBe('GET');
    req.flush(mockRegions);

    const regions = await promise;
    expect(regions).toEqual(mockRegions);
  });

  it('should handle HTTP errors correctly', async () => {
    const regionName = 'Occitanie';
    const errorMessage = 'Erreur réseau';

    // Convert the observable to a promise
    const promise = firstValueFrom(service.searchRegion(regionName));

    // Expect a request to the API
    const req = httpMock.expectOne(environment.regionsUrl(regionName));
    expect(req.request.method).toBe('GET');
    req.flush(errorMessage, { status: 500, statusText: 'Erreur serveur' });

    // Try to get the regions and expect an error
    try {
      await promise;
      throw new Error('Expected error, got success');
    } catch (error: any) {
      expect(error.status).toBe(500);
      expect(error.statusText).toBe('Erreur serveur');
    }
  });

  it('should detect open requests if not flushed', () => {
    const regionName = 'Normandie';
    service.searchRegion(regionName).subscribe();

    // Get the request
    const reqs = httpMock.match(environment.regionsUrl(regionName));

    // Check that there is a request pending
    expect(reqs.length).toBe(1);
  });
});
