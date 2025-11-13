import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { environment } from '../../../environments/environment';
import { Municipality } from '../../core/models/municipality.model';
import { SearchMunicipalites } from './search-municipalites';
describe('SearchMunicipalites', () => {
  let service: SearchMunicipalites;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SearchMunicipalites,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(SearchMunicipalites);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Check that there are no open requests remaining
    httpMock.verify();
    TestBed.resetTestingModule();
  });

  it('should call the correct API URL and return mock data', async () => {
    const codeDepartment = '35';
    const mockMunicipalities: Municipality[] = [
      {
        nom: 'Rennes',
        code: '35238',
        codeDepartement: '35',
        siren: '213502388',
        codeEpci: '243500139',
        codeRegion: '53',
        codesPostaux: ['35000', '35200', '35700'],
        population: 222485,
      },
      {
        nom: 'Saint-Malo',
        code: '35288',
        codeDepartement: '35',
        siren: '213502888',
        codeEpci: '243500139',
        codeRegion: '53',
        codesPostaux: ['35400'],
        population: 47723,
      },
    ];

    // Convert the observable to a promise
    const promise = firstValueFrom(service.searchMunicipalites(codeDepartment));

    // Expect a request to the API
    const req = httpMock.expectOne(
      environment.municipalitesUrl(codeDepartment)
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockMunicipalities);

    const municipalities = await promise;
    expect(municipalities).toEqual(mockMunicipalities);
  });

  it('should handle HTTP errors correctly', async () => {
    const codeDepartment = '22';
    const errorMessage = 'Erreur réseau';

    // Convert the observable to a promise
    const promise = firstValueFrom(service.searchMunicipalites(codeDepartment));

    // Expect a request to the API
    const req = httpMock.expectOne(
      environment.municipalitesUrl(codeDepartment)
    );
    expect(req.request.method).toBe('GET');
    req.flush(errorMessage, { status: 500, statusText: 'Erreur serveur' });

    // Try to get the municipalities and expect an error
    try {
      await promise;
      throw new Error('Expected error, got success');
    } catch (error: any) {
      expect(error.status).toBe(500);
      expect(error.statusText).toBe('Erreur serveur');
    }
  });

  it('should detect open requests if not flushed', () => {
    const codeDepartment = '11';
    service.searchMunicipalites(codeDepartment).subscribe();

    // Get the request
    const reqs = httpMock.match(environment.municipalitesUrl(codeDepartment));

    // Check that there is a request pending
    expect(reqs.length).toBe(1);
  });
});
