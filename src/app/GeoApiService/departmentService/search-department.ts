import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

export type Department = {
  nom: string;
  code: string;
  _score: number;
};

@Injectable({
  providedIn: 'root',
})
export class SearchDepartment {
  http = inject(HttpClient);

  searchDepartment(codeRegion: string) {
    return this.http.get<Department[]>(environment.departementsUrl(codeRegion));
  }
}
