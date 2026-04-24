import { Injectable, signal, computed, inject } from '@angular/core';
import { Producto } from '../models/producto.model';
import { ToastService } from './toast.service';

const STORAGE_KEY = 'carrito';

export interface ItemCarrito extends Producto {
  cantidad: number;
}

@Injectable({ providedIn: 'root' })
export class CarritoService {
  private toast = inject(ToastService);
  private _items = signal<ItemCarrito[]>(this.cargarDeStorage());
  readonly items = this._items.asReadonly();
  readonly count = computed(() =>
    this._items().reduce((s, i) => s + i.cantidad, 0)
  );

  private cargarDeStorage(): ItemCarrito[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private guardarEnStorage(items: ItemCarrito[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  agregar(producto: Producto): void {
    const lista = [...this._items()];
    const idx = lista.findIndex(i => i.nombre === producto.nombre);
    if (idx >= 0) {
      lista[idx] = { ...lista[idx], cantidad: lista[idx].cantidad + 1 };
    } else {
      lista.push({ ...producto, cantidad: 1 });
    }
    this._items.set(lista);
    this.guardarEnStorage(lista);
    this.toast.show('Producto agregado al carrito');
  }
}
