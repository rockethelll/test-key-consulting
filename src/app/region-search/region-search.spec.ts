import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { render, screen, waitFor } from '@testing-library/angular';
import { fireEvent } from '@testing-library/dom';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { environment } from '../../environments/environment';
import { Region } from '../core/models/region.model';
import { RegionSearch } from './region-search';

describe('RegionSearchComponent', () => {
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(async () => {
    await render(RegionSearch, {
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([
          { path: 'region/:codeRegion', component: {} as any },
          { path: 'department/:codeDepartment', component: {} as any },
        ]),
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    httpMock.verify();
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(RegionSearch).toBeTruthy();
  });

  it('should display search input with placeholder', () => {
    const input = screen.getByPlaceholderText('Rechercher une région...');
    expect(input).toBeInTheDocument();
  });

  it('should call API and display regions when searching', async () => {
    const mockRegions: Region[] = [
      { nom: 'Bretagne', code: '53', _score: 1 },
      { nom: 'Occitanie', code: '76', _score: 1 },
    ];

    const input = screen.getByPlaceholderText(
      'Rechercher une région...'
    ) as HTMLInputElement;

    // Simulate user typing
    fireEvent.input(input, { target: { value: 'Bre' } });

    // Wait for debounce (300ms) + a bit more for the request
    await waitFor(
      () => {
        const req = httpMock.expectOne(environment.regionsUrl('bre'));
        expect(req.request.method).toBe('GET');
        req.flush(mockRegions);
      },
      { timeout: 500 }
    );

    // Wait for the regions to be displayed
    await waitFor(() => {
      expect(screen.getByText('Bretagne')).toBeInTheDocument();
      expect(screen.getByText('Occitanie')).toBeInTheDocument();
    });

    // Check that region codes are displayed
    expect(screen.getByText('Code: 53')).toBeInTheDocument();
    expect(screen.getByText('Code: 76')).toBeInTheDocument();
  });

  it('should show loading state during search', async () => {
    const input = screen.getByPlaceholderText(
      'Rechercher une région...'
    ) as HTMLInputElement;

    // Simulate user typing
    fireEvent.input(input, { target: { value: 'Bre' } });

    // Wait for debounce and check loading state
    await waitFor(
      () => {
        expect(screen.getByText('Recherche en cours...')).toBeInTheDocument();
      },
      { timeout: 500 }
    );

    // Flush the request
    const req = httpMock.expectOne(environment.regionsUrl('bre'));
    req.flush([{ nom: 'Bretagne', code: '53', _score: 1 }]);
  });

  it('should display "Aucune région trouvée" when no results', async () => {
    const input = screen.getByPlaceholderText(
      'Rechercher une région...'
    ) as HTMLInputElement;

    // Simulate user typing
    fireEvent.input(input, { target: { value: 'InvalidRegion' } });

    // Wait for debounce and API call
    await waitFor(
      () => {
        const req = httpMock.expectOne(environment.regionsUrl('invalidregion'));
        expect(req.request.method).toBe('GET');
        req.flush([]);
      },
      { timeout: 500 }
    );

    // Wait for the "no results" message
    await waitFor(() => {
      expect(screen.getByText('Aucune région trouvée')).toBeInTheDocument();
    });
  });

  it('should select a region and display it', async () => {
    const mockRegions: Region[] = [{ nom: 'Bretagne', code: '53', _score: 1 }];

    const input = screen.getByPlaceholderText(
      'Rechercher une région...'
    ) as HTMLInputElement;

    // Simulate user typing
    fireEvent.input(input, { target: { value: 'Bre' } });

    // Wait for debounce and flush the request
    await waitFor(
      () => {
        const req = httpMock.expectOne(environment.regionsUrl('bre'));
        req.flush(mockRegions);
      },
      { timeout: 500 }
    );

    // Wait for the region to appear and click it
    await waitFor(() => {
      expect(screen.getByText('Bretagne')).toBeInTheDocument();
    });

    const regionButton = screen.getByText('Bretagne').closest('button');
    if (regionButton) {
      fireEvent.click(regionButton);
    }

    // Check that the selected region is displayed
    await waitFor(() => {
      expect(screen.getByText(/Région sélectionnée:/i)).toBeInTheDocument();
      expect(screen.getByText('Bretagne')).toBeInTheDocument();
    });
  });

  it('should debounce search requests', async () => {
    const input = screen.getByPlaceholderText(
      'Rechercher une région...'
    ) as HTMLInputElement;

    // Type multiple characters quickly (simulating rapid typing)
    fireEvent.input(input, { target: { value: 'B' } });
    fireEvent.input(input, { target: { value: 'Br' } });
    fireEvent.input(input, { target: { value: 'Bre' } });

    // Wait for debounce (300ms) - only one request should be made for the final value
    await waitFor(
      () => {
        // Should only have one request for 'bre', not multiple requests
        const req = httpMock.expectOne(environment.regionsUrl('bre'));
        expect(req.request.method).toBe('GET');
        req.flush([{ nom: 'Bretagne', code: '53', _score: 1 }]);
      },
      { timeout: 500 }
    );

    // Verify no other requests were made (expectNone will pass if no requests match)
    // The afterEach will verify that all requests were handled
  });
});
