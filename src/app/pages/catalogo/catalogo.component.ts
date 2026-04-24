import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductosService } from '../../services/productos.service';
import { ProductoCardComponent } from '../../shared/producto-card/producto-card.component';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [FormsModule, ProductoCardComponent],
  templateUrl: './catalogo.component.html',
  styleUrl: './catalogo.component.css',
})
export class CatalogoComponent {
  private productosService = inject(ProductosService);
  private _todos = signal<Producto[]>([]);
  busqueda = signal('');

  productos = computed(() => {
    const texto = this.busqueda().toLowerCase();
    if (!texto) return this._todos();
    return this._todos().filter(p => p.nombre.toLowerCase().includes(texto));
  });

  ngOnInit(): void {
    this.productosService.getProductos().subscribe(data => this._todos.set(data));
  }

  onBusqueda(valor: string): void {
    this.busqueda.set(valor);
  }
}
