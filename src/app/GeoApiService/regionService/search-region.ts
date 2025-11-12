import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

export type Region = {
  nom: string;
  code: string;
  _score: number;
};

@Injectable({
  providedIn: 'root',
})
export class SearchRegion {
  http = inject(HttpClient);

  searchRegion(regionName: string) {
    return this.http.get<Region[]>(environment.regionsUrl(regionName));
  }
}
