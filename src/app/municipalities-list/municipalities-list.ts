import { DecimalPipe, Location } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { MunicipalitiesListStateService } from '../core/services/municipalities-list-state.service';
import { SortColumn } from '../shared/types/sort.types';

@Component({
  selector: 'app-municipalities-list',
  imports: [DecimalPipe],
  templateUrl: './municipalities-list.html',
})
export class MunicipalitiesList implements OnInit {
  private location = inject(Location);
  private activatedRoute = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  // Service for business logic
  stateService = inject(MunicipalitiesListStateService);

  // Expose signals and computed values from service to template (readonly access)
  readonly municipalities = this.stateService.municipalities.asReadonly();
  readonly sortColumn = this.stateService.sortColumn.asReadonly();
  readonly sortDirection = this.stateService.sortDirection.asReadonly();
  readonly currentPage = this.stateService.currentPage.asReadonly();
  readonly itemsPerPage = this.stateService.itemsPerPage;
  readonly searchTerm = this.stateService.searchTerm.asReadonly();
  readonly filteredMunicipalities = this.stateService.filteredMunicipalities;
  readonly sortedMunicipalities = this.stateService.sortedMunicipalities;
  readonly paginatedMunicipalities = this.stateService.paginatedMunicipalities;
  readonly totalPages = this.stateService.totalPages;
  readonly maxDisplayedItem = this.stateService.maxDisplayedItem;

  ngOnInit(): void {
    // Listen to route params and update the state
    this.activatedRoute.params
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        this.stateService.setCodeDepartment(params['codeDepartment']);
      });
  }

  goBack(): void {
    this.location.back();
  }

  sort(column: SortColumn): void {
    this.stateService.sort(column);
  }

  getSortIcon(column: SortColumn): string {
    return this.stateService.getSortIcon(column);
  }

  goToPage(page: number): void {
    this.stateService.goToPage(page);
  }

  previousPage(): void {
    this.stateService.previousPage();
  }

  nextPage(): void {
    this.stateService.nextPage();
  }

  getPageNumbers(): number[] {
    return this.stateService.getPageNumbers();
  }

  onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.stateService.onSearchChange(target.value);
  }
}
