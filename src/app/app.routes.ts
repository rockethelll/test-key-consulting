import { Routes } from '@angular/router';
import { DepartmentList } from './department-list/department-list';
import { MunicipalitiesList } from './municipalities-list/municipalities-list';

export const routes: Routes = [
  {
    path: 'region/:codeRegion',
    component: DepartmentList,
  },
  {
    path: 'department/:codeDepartment',
    component: MunicipalitiesList,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
