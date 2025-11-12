import { Component } from '@angular/core';

@Component({
  selector: 'app-communes-list',
  standalone: true,
  imports: [],
  template: `
    <div class="p-4 border-2 border-green-500 bg-green-100">
      <h2 class="text-2xl font-bold">Liste des communes</h2>
      <p>communes-list works!</p>
      <p>Template inline - Route: department/:codeDepartement</p>
    </div>
  `,
})
export class CommunesList {}
