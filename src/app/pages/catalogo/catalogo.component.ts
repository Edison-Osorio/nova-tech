import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductosService } from '../../services/productos.service';
import { ProductoCardComponent } from '../../shared/producto-card/producto-card.component';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [FormsModule, ProductoCardComponent],
  templateUrl: './catalogo.component.html',
  styleUrl: './catalogo.component.css',
})
export class CatalogoComponent {
  private productosService = inject(ProductosService);
  busqueda = signal('');

  productos = computed(() => {
    const texto = this.busqueda().toLowerCase();
    const todos = this.productosService.productos();
    if (!texto) return todos;
    return todos.filter(p => p.nombre.toLowerCase().includes(texto));
  });

  onBusqueda(valor: string): void {
    this.busqueda.set(valor);
  }
}
