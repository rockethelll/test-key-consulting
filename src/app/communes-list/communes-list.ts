import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-communes-list',
  imports: [],
  templateUrl: './communes-list.html',
})
export class CommunesList {
  location = inject(Location)

  goBack() {
    this.location.back();
  }
}
