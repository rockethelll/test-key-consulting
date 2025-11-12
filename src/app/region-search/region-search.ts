import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { catchError, debounceTime, of, switchMap } from 'rxjs';
import { Region, SearchRegion } from '../GeoApiService/regionService/search-region';
import { Router } from '@angular/router';

@Component({
  selector: 'app-region-search',
  imports: [],
  templateUrl: './region-search.html',
})
export class RegionSearch {
  router = inject(Router);
  searchRegionsService = inject(SearchRegion);
  private destroyRef = inject(DestroyRef);
  // Display value in the input (can be set without triggering search)
  displayValue = signal('');
  // Internal search term for API calls
  private searchTerm = signal('');
  regions = signal<Region[]>([]);
  selectedRegion = signal<Region | null>(null);
  showDropdown = signal(false);
  isLoading = signal(false);

  // Convert the search term signal to an Observable and apply debounce + switchMap
  // takeUntilDestroyed handles automatically the cleanup
  private _ = toObservable(this.searchTerm)
    .pipe(
      debounceTime(300),
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

  // Handle the search input and set the search to the input value
  handleSearch(search: string) {
    const trimmed = search.trim().toLowerCase();
    this.displayValue.set(search.trim());
    this.searchTerm.set(trimmed);
  }

  // Handle the selection of a region and set the search to the region name
  selectRegion(region: Region, event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.selectedRegion.set(region);
    this.displayValue.set(region.nom);
    this.showDropdown.set(false);
    this.regions.set([]);
    // Don't update searchTerm to avoid triggering a new search
    this.router.navigate(['/region', region.code]);
  }

  // Show the dropdown when the input is focused
  onInputFocus() {
    if (this.regions().length > 0) {
      this.showDropdown.set(true);
    }
  }
}
