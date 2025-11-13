import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { SearchDepartment } from '../../GeoApiService/departmentService/search-department';
import { Department } from '../models/department.model';
import { Region } from '../models/region.model';

@Injectable({
  providedIn: 'root',
})
export class RegionNavigationService {
  private router = inject(Router);
  private searchDepartmentService = inject(SearchDepartment);
  private destroyRef = inject(DestroyRef);

  selectedDepartment = signal<Department | null>(null);

  navigateToDepartment(department: Department): void {
    this.router.navigate(['/department', department.code]);
  }

  handleRouteChange(selectedRegion: Region | null): void {
    const url = this.router.url;
    const departmentMatch = url.match(/\/department\/([^\/]+)/);

    if (departmentMatch) {
      if (selectedRegion) {
        const codeDepartment = departmentMatch[1];
        const codeRegion = selectedRegion.code;
        this.loadDepartment(codeRegion, codeDepartment);
      } else {
        // If no region is selected, redirect to home
        this.router.navigate(['/']);
        this.selectedDepartment.set(null);
      }
    } else {
      this.selectedDepartment.set(null);
    }
  }

  private loadDepartment(codeRegion: string, codeDepartment: string): void {
    this.searchDepartmentService
      .searchDepartment(codeRegion)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((departments: Department[]) => {
        const department = departments.find(
          (d: Department) => d.code === codeDepartment
        );
        if (department) {
          this.selectedDepartment.set(department);
        }
      });
  }
}
