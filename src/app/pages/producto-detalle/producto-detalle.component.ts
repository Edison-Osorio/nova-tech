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
  cantidadSeleccionada = signal(1);
  confirmacionVisible = signal(false);
  private confirmacionTimer: ReturnType<typeof setTimeout> | null = null;

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

  incrementarCantidad(): void {
    this.cantidadSeleccionada.update(n => n + 1);
  }

  decrementarCantidad(): void {
    this.cantidadSeleccionada.update(n => Math.max(1, n - 1));
  }

  agregarAlCarrito(): void {
    if (this.producto()) {
      this.carritoService.agregar(this.producto()!, this.cantidadSeleccionada());
      this.cantidadSeleccionada.set(1);
      this.mostrarConfirmacion();
    }
  }

  private mostrarConfirmacion(): void {
    if (this.confirmacionTimer) clearTimeout(this.confirmacionTimer);
    this.confirmacionVisible.set(true);
    this.confirmacionTimer = setTimeout(() => {
      this.confirmacionVisible.set(false);
    }, 2500);
  }
}
