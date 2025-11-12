import { Routes } from '@angular/router';
import { CommunesList } from './communes-list/communes-list';
import { DepartmentList } from './department-list/department-list';

export const routes: Routes = [
  {
    path: 'region/:codeRegion',
    component: DepartmentList,
  },
  {
    path: 'department/:codeDepartement',
    component: CommunesList,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
