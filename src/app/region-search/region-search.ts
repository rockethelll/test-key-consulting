import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-region-search',
  imports: [ReactiveFormsModule],
  templateUrl: './region-search.html',
})
export class RegionSearch {
  form = new FormGroup({
    nom: new FormControl(''),
  });

  onSubmit() {
    const nom = this.form.value.nom;
    if (nom) {
      // Utiliser la valeur du formulaire pour faire une recherche
      console.log('Recherche de région:', nom);
      // TODO: Implémenter la logique de recherche
    }
  }
}
