import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import {
  Department,
  SearchDepartment,
} from '../GeoApiService/departmentService/search-department';

@Component({
  selector: 'app-department-list',
  imports: [RouterLink],
  templateUrl: './department-list.html',
})
export class DepartmentList implements OnInit {
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  searchDepartmentsService = inject(SearchDepartment);
  destroyRef = inject(DestroyRef);
  codeRegion = signal<string>('');
  departments = signal<Department[]>([]);

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.codeRegion.set(params['codeRegion']);
    });
  }

  // Get the departments for the given region
  private _ = toObservable(this.codeRegion)
    .pipe(
      switchMap((codeRegion) =>
        this.searchDepartmentsService.searchDepartment(codeRegion)
      ),
      takeUntilDestroyed(this.destroyRef)
    )
    .subscribe((departments) => {
      this.departments.set(departments);
    });

  // Go to the home page
  goHome() {
    this.router.navigate(['/']);
  }
}
