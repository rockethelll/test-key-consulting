import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Municipality } from '../../core/models/municipality.model';

@Injectable({
  providedIn: 'root',
})
export class SearchMunicipalites {
  http = inject(HttpClient);

  // Get the municipalities for the given department
  searchMunicipalites(codeDepartment: string) {
    return this.http.get<Municipality[]>(environment.municipalitesUrl(codeDepartment));
  }
}
