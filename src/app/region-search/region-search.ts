import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { Department } from '../core/models/department.model';
import { Region } from '../core/models/region.model';
import { RegionNavigationService } from '../core/services/region-navigation.service';
import { RegionSearchStateService } from '../core/services/region-search-state.service';

@Component({
  selector: 'app-region-search',
  imports: [],
  templateUrl: './region-search.html',
})
export class RegionSearch implements OnInit {
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  // Services for business logic
  searchState = inject(RegionSearchStateService);
  navigationService = inject(RegionNavigationService);

  // Expose signals from services to template (readonly access)
  readonly displayValue = this.searchState.displayValue.asReadonly();
  readonly regions = this.searchState.regions.asReadonly();
  readonly selectedRegion = this.searchState.selectedRegion.asReadonly();
  readonly selectedDepartment =
    this.navigationService.selectedDepartment.asReadonly();
  readonly showDropdown = this.searchState.showDropdown.asReadonly();
  readonly isLoading = this.searchState.isLoading.asReadonly();
  readonly departments = this.searchState.departments.asReadonly();
  readonly isLoadingDepartments =
    this.searchState.isLoadingDepartments.asReadonly();

  handleSearch(search: string): void {
    this.searchState.handleSearch(search);
  }

  selectRegion(region: Region, event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.searchState.selectRegion(region);
    // Don't navigate anymore, departments will be displayed in the same component
  }

  selectDepartment(department: Department): void {
    this.navigationService.navigateToDepartment(department);
  }

  onInputFocus(): void {
    this.searchState.onInputFocus();
  }

  clearSearch(): void {
    this.searchState.reset();
    this.navigationService.selectedDepartment.set(null);
    this.router.navigate(['/']);
  }

  ngOnInit(): void {
    // Listen to route changes to detect department selection
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.navigationService.handleRouteChange(
          this.searchState.selectedRegion()
        );
      });
  }
}
