import { Location } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import {
  Municipalites,
  SearchMunicipalites,
} from '../GeoApiService/municipalitiesService/search-municipalites';

@Component({
  selector: 'app-municipalities-list',
  imports: [],
  templateUrl: './municipalities-list.html',
})
export class MunicipalitiesList implements OnInit {
  location = inject(Location);
  activatedRoute = inject(ActivatedRoute);
  searchMunicipalitesService = inject(SearchMunicipalites);
  codeDepartment = signal<string>('');
  municipalities = signal<Municipalites[]>([]);
  destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.codeDepartment.set(params['codeDepartment']);
    });
  }

  private _ = toObservable(this.codeDepartment)
    .pipe(
      switchMap((codeDepartment) =>
        this.searchMunicipalitesService.searchMunicipalites(codeDepartment)
      ),
      takeUntilDestroyed(this.destroyRef)
    )
    .subscribe((municipalities) => {
      this.municipalities.set(municipalities);
    });

  goBack() {
    this.location.back();
  }
}
