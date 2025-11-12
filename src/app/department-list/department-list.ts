import { Component } from '@angular/core';

@Component({
  selector: 'app-department-list',
  standalone: true,
  imports: [],
  template: `
    <div class="p-4 border-2 border-blue-500 bg-blue-100">
      <h2 class="text-2xl font-bold">Liste des départements</h2>
      <p>department-list works!</p>
      <p>Template inline - Route: region/:codeRegion</p>
    </div>
  `,
})
export class DepartmentList {}
