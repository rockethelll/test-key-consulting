import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

export type Municipalites = {
  nom: string;
  code: string;
  codeDepartement: string;
  siren: string;
  codeEpci: string;
  codeRegion: string;
  codesPostaux: string[];
  population: number;
};

@Injectable({
  providedIn: 'root',
})
export class SearchMunicipalites {
  http = inject(HttpClient);

  // Get the municipalities for the given department
  searchMunicipalites(codeDepartment: string) {
    return this.http.get<Municipalites[]>(environment.municipalitesUrl(codeDepartment));
  }
}
