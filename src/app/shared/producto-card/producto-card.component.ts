import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Producto } from '../../models/producto.model';
import { FavoritosService } from '../../services/favoritos.service';

@Component({
  selector: 'app-producto-card',
  standalone: true,
  templateUrl: './producto-card.component.html',
})
export class ProductoCardComponent {
  @Input({ required: true }) producto!: Producto;
  @Input() mostrarEliminar = false;
  @Output() eliminado = new EventEmitter<string>();

  favoritosService = inject(FavoritosService);
  private router = inject(Router);

  expandido = false;

  get esFavorito(): boolean {
    return this.favoritosService.esFavorito(this.producto.nombre);
  }

  toggleFavorito(event: Event): void {
    event.stopPropagation();
    this.favoritosService.toggle(this.producto);
  }

  eliminarFavorito(event: Event): void {
    event.stopPropagation();
    this.eliminado.emit(this.producto.nombre);
  }

  toggleVerMas(event: Event): void {
    event.stopPropagation();
    this.expandido = !this.expandido;
  }

  irADetalle(): void {
    this.router.navigate(['/producto', this.producto.nombre]);
  }
}
