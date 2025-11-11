import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Subject, catchError, debounceTime, of, switchMap } from 'rxjs';
import { Region, SearchRegions } from '../GeoApiService/search-regions';

@Component({
  selector: 'app-region-search',
  imports: [FormsModule],
  templateUrl: './region-search.html',
})
export class RegionSearch {
  searchRegionsService = inject(SearchRegions);
  private destroyRef = inject(DestroyRef);
  search = signal('');
  regions = signal<Region[]>([]);
  selectedRegion = signal<Region | null>(null);
  showDropdown = signal(false);
  isLoading = signal(false);

  private searchSubject = new Subject<string>();

  // Initialization of the subscription with debounce and switchMap
  // takeUntilDestroyed handles automatically the cleanup
  private _ = this.searchSubject
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
        return this.searchRegionsService.searchRegions(term).pipe(
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
    this.search.set(search.trim().toLowerCase());
    this.searchSubject.next(search.trim().toLowerCase());
  }

  // Handle the selection of a region and set the search to the region name
  selectRegion(region: Region) {
    this.selectedRegion.set(region);
    this.search.set(region.nom);
    this.showDropdown.set(false);
    this.regions.set([]);
  }

  // Show the dropdown when the input is focused
  onInputFocus() {
    if (this.regions().length > 0) {
      this.showDropdown.set(true);
    }
  }

  // Hide the dropdown when the input is blurred
  onInputBlur() {
    // Delay to allow clicking on an element of the dropdown
    setTimeout(() => {
      this.showDropdown.set(false);
    }, 1000);
  }
}
