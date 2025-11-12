import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RegionSearch } from './region-search/region-search';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RegionSearch],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
