import { Component, inject, output } from '@angular/core';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-carrito-modal',
  standalone: true,
  templateUrl: './carrito-modal.component.html',
})
export class CarritoModalComponent {
  cerrar = output<void>();

  carritoService = inject(CarritoService);

  onQuitarUno(nombre: string): void {
    this.carritoService.quitarUno(nombre);
  }

  onAgregarUno(nombre: string): void {
    const item = this.carritoService.items().find(i => i.nombre === nombre);
    if (item) this.carritoService.agregar(item);
  }

  onEliminar(nombre: string): void {
    this.carritoService.eliminar(nombre);
  }

  onVaciar(): void {
    this.carritoService.vaciar();
  }

  onCerrar(): void {
    this.cerrar.emit();
  }
}
