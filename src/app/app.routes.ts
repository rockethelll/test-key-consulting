import { Routes } from '@angular/router';
import { MunicipalitiesList } from './municipalities-list/municipalities-list';

export const routes: Routes = [
  {
    path: 'department/:codeDepartment',
    component: MunicipalitiesList,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
