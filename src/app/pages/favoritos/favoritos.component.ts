import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FavoritosService } from '../../services/favoritos.service';
import { ProductoCardComponent } from '../../shared/producto-card/producto-card.component';

@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [RouterLink, ProductoCardComponent],
  templateUrl: './favoritos.component.html',
  styleUrl: './favoritos.component.css',
})
export class FavoritosComponent {
  favoritosService = inject(FavoritosService);

  quitar(nombre: string): void {
    this.favoritosService.quitar(nombre);
  }
}
