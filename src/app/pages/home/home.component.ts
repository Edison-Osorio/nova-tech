import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ProductosService } from '../../services/productos.service';
import { ProductoCardComponent } from '../../shared/producto-card/producto-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ProductoCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  private router = inject(Router);
  productosService = inject(ProductosService);

  irACatalogo(): void {
    this.router.navigate(['/catalogo']);
  }
}
