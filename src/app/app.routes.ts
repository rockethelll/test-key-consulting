import { Routes } from '@angular/router';
import { CommunesList } from './communes-list/communes-list';

export const routes: Routes = [
  {
    path: 'departements/:codeDepartement',
    component: CommunesList,
  },
  {
    path: '**',
    redirectTo: '',
  }
];
