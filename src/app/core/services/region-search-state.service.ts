import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { catchError, debounceTime, of, switchMap } from 'rxjs';
import { SearchRegion } from '../../GeoApiService/regionService/search-region';
import { SEARCH_DEBOUNCE_TIME } from '../constants/app.constants';
import { Region } from '../models/region.model';

@Injectable({
  providedIn: 'root',
})
export class RegionSearchStateService {
  private searchRegionsService = inject(SearchRegion);
  private destroyRef = inject(DestroyRef);

  // Display value in the input (can be set without triggering search)
  displayValue = signal('');
  // Internal search term for API calls
  private searchTerm = signal('');
  regions = signal<Region[]>([]);
  selectedRegion = signal<Region | null>(null);
  showDropdown = signal(false);
  isLoading = signal(false);

  constructor() {
    // Convert the search term signal to an Observable and apply debounce + switchMap
    toObservable(this.searchTerm)
      .pipe(
        debounceTime(SEARCH_DEBOUNCE_TIME),
        switchMap((term) => {
          if (!term || term.trim().length === 0) {
            this.regions.set([]);
            this.showDropdown.set(false);
            return of([]);
          }
          this.isLoading.set(true);
          this.showDropdown.set(true);
          return this.searchRegionsService.searchRegion(term).pipe(
            catchError(() => {
              this.isLoading.set(false);
              return of([]);
            })
          );
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((regions) => {
        this.regions.set(regions);
        this.isLoading.set(false);
      });
  }

  handleSearch(search: string): void {
    const trimmed = search.trim().toLowerCase();
    this.displayValue.set(search.trim());
    this.searchTerm.set(trimmed);
  }

  selectRegion(region: Region): void {
    this.selectedRegion.set(region);
    this.displayValue.set(region.nom);
    this.showDropdown.set(false);
    this.regions.set([]);
    // Don't update searchTerm to avoid triggering a new search
  }

  onInputFocus(): void {
    if (this.regions().length > 0) {
      this.showDropdown.set(true);
    }
  }

  // Reset method for testing purposes
  reset(): void {
    this.displayValue.set('');
    this.searchTerm.set('');
    this.regions.set([]);
    this.selectedRegion.set(null);
    this.showDropdown.set(false);
    this.isLoading.set(false);
  }
}
