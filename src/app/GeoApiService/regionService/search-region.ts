import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Region } from '../../core/models/region.model';

@Injectable({
  providedIn: 'root',
})
export class SearchRegion {
  http = inject(HttpClient);

  searchRegion(regionName: string) {
    return this.http.get<Region[]>(environment.regionsUrl(regionName));
  }
}
