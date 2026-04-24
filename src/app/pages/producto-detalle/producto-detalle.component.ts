import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { ProductosService } from '../../services/productos.service';
import { FavoritosService } from '../../services/favoritos.service';
import { CarritoService } from '../../services/carrito.service';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-producto-detalle',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './producto-detalle.component.html',
  styleUrl: './producto-detalle.component.css',
})
export class ProductoDetalleComponent {
  private route = inject(ActivatedRoute);
  private productosService = inject(ProductosService);
  favoritosService = inject(FavoritosService);
  carritoService = inject(CarritoService);

  producto = signal<Producto | null>(null);
  noEncontrado = signal(false);

  ngOnInit(): void {
    this.route.params
      .pipe(
        switchMap(params => {
          const nombre = decodeURIComponent(params['nombre'] || '');
          return this.productosService.getProductos().pipe(
            switchMap(lista => {
              const found = lista.find(p => p.nombre === nombre) ?? null;
              return [found];
            })
          );
        })
      )
      .subscribe(p => {
        this.producto.set(p);
        this.noEncontrado.set(p === null);
      });
  }

  get esFavorito(): boolean {
    return this.producto() ? this.favoritosService.esFavorito(this.producto()!.nombre) : false;
  }

  toggleFavorito(): void {
    if (this.producto()) this.favoritosService.toggle(this.producto()!);
  }

  agregarAlCarrito(): void {
    if (this.producto()) this.carritoService.agregar(this.producto()!);
  }
}
