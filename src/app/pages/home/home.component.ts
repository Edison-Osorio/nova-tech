import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ProductosService } from '../../services/productos.service';
import { ProductoCardComponent } from '../../shared/producto-card/producto-card.component';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ProductoCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  private productosService = inject(ProductosService);
  private router = inject(Router);
  productos = signal<Producto[]>([]);

  ngOnInit(): void {
    this.productosService.getProductos().subscribe(data => this.productos.set(data));
  }

  irACatalogo(): void {
    this.router.navigate(['/catalogo']);
  }
}
