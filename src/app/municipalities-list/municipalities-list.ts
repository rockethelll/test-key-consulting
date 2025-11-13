import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-municipalities-list',
  imports: [],
  templateUrl: './municipalities-list.html',
})
export class MunicipalitiesList {
  location = inject(Location);

  goBack() {
    this.location.back();
  }
}
