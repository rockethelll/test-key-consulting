import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { SearchDepartment } from '../../GeoApiService/departmentService/search-department';
import { Department } from '../models/department.model';

@Injectable({
  providedIn: 'root',
})
export class DepartmentListStateService {
  private searchDepartmentsService = inject(SearchDepartment);
  private destroyRef = inject(DestroyRef);

  codeRegion = signal<string>('');
  departments = signal<Department[]>([]);

  constructor() {
    // Get the departments for the given region when codeRegion changes
    toObservable(this.codeRegion)
      .pipe(
        switchMap((codeRegion) =>
          this.searchDepartmentsService.searchDepartment(codeRegion)
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((departments) => {
        this.departments.set(departments);
      });
  }

  setCodeRegion(codeRegion: string): void {
    this.codeRegion.set(codeRegion);
  }
}
