import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FavoritosService } from '../../services/favoritos.service';
import { CarritoService } from '../../services/carrito.service';
import { AuthService } from '../../services/auth.service';
import { CarritoModalComponent } from '../carrito-modal/carrito-modal.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CarritoModalComponent],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  favoritosService = inject(FavoritosService);
  carritoService = inject(CarritoService);
  authService = inject(AuthService);

  mostrarCarrito = signal(false);

  toggleCarrito(): void {
    this.mostrarCarrito.update(v => !v);
  }

  cerrarSesion(): void {
    this.authService.cerrarSesion();
  }
}
