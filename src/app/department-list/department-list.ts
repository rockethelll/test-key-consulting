import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DepartmentListStateService } from '../core/services/department-list-state.service';

@Component({
  selector: 'app-department-list',
  imports: [RouterLink],
  templateUrl: './department-list.html',
})
export class DepartmentList implements OnInit {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  // Service for business logic
  stateService = inject(DepartmentListStateService);

  // Expose signals from service to template (readonly access)
  readonly codeRegion = this.stateService.codeRegion.asReadonly();
  readonly departments = this.stateService.departments.asReadonly();

  ngOnInit(): void {
    // Listen to route params and update the state
    this.activatedRoute.params
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        this.stateService.setCodeRegion(params['codeRegion']);
      });
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}
