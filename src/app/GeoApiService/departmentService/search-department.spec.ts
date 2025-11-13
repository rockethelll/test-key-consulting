import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { environment } from '../../../environments/environment';
import { Department, SearchDepartment } from './search-department';

describe('SearchDepartment', () => {
  let service: SearchDepartment;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SearchDepartment,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(SearchDepartment);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Check that there are no open requests remaining
    httpMock.verify();
    TestBed.resetTestingModule();
  });

  it('should call the correct API URL and return mock data', async () => {
    const codeRegion = '53';
    const mockDepartments: Department[] = [
      { nom: 'Ille-et-Vilaine', code: '35', _score: 1 },
      { nom: "Côtes-d'Armor", code: '22', _score: 1 },
    ];

    // Convert the observable to a promise
    const promise = firstValueFrom(service.searchDepartment(codeRegion));

    // Expect a request to the API
    const req = httpMock.expectOne(environment.departementsUrl(codeRegion));
    expect(req.request.method).toBe('GET');
    req.flush(mockDepartments);

    const departments = await promise;
    expect(departments).toEqual(mockDepartments);
  });

  it('should handle HTTP errors correctly', async () => {
    const codeRegion = '76';
    const errorMessage = 'Erreur réseau';

    // Convert the observable to a promise
    const promise = firstValueFrom(service.searchDepartment(codeRegion));

    // Expect a request to the API
    const req = httpMock.expectOne(environment.departementsUrl(codeRegion));
    expect(req.request.method).toBe('GET');
    req.flush(errorMessage, { status: 500, statusText: 'Erreur serveur' });

    // Try to get the departments and expect an error
    try {
      await promise;
      throw new Error('Expected error, got success');
    } catch (error: any) {
      expect(error.status).toBe(500);
      expect(error.statusText).toBe('Erreur serveur');
    }
  });

  it('should detect open requests if not flushed', () => {
    const codeRegion = '11';
    service.searchDepartment(codeRegion).subscribe();

    // Get the request
    const reqs = httpMock.match(environment.departementsUrl(codeRegion));

    // Check that there is a request pending
    expect(reqs.length).toBe(1);
  });
});
