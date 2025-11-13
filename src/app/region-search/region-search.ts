import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { catchError, debounceTime, filter, of, switchMap } from 'rxjs';
import {
  Department,
  SearchDepartment,
} from '../GeoApiService/departmentService/search-department';
import {
  Region,
  SearchRegion,
} from '../GeoApiService/regionService/search-region';

@Component({
  selector: 'app-region-search',
  imports: [],
  templateUrl: './region-search.html',
})
export class RegionSearch implements OnInit {
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  searchRegionsService = inject(SearchRegion);
  searchDepartmentService = inject(SearchDepartment);
  private destroyRef = inject(DestroyRef);
  // Display value in the input (can be set without triggering search)
  displayValue = signal('');
  // Internal search term for API calls
  private searchTerm = signal('');
  regions = signal<Region[]>([]);
  selectedRegion = signal<Region | null>(null);
  selectedDepartment = signal<Department | null>(null);
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

  ngOnInit() {
    // Listen to route changes to detect department selection
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        const url = this.router.url;
        const departmentMatch = url.match(/\/department\/([^\/]+)/);

        if (departmentMatch && this.selectedRegion()) {
          const codeDepartment = departmentMatch[1];
          const codeRegion = this.selectedRegion()!.code;

          // Récupérer les départements de la région et trouver celui correspondant
          this.searchDepartmentService
            .searchDepartment(codeRegion)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((departments) => {
              const department = departments.find(
                (d) => d.code === codeDepartment
              );
              if (department) {
                this.selectedDepartment.set(department);
              }
            });
        } else {
          this.selectedDepartment.set(null);
        }
      });
  }
}
