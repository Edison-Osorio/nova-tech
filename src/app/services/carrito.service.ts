import { Injectable, signal, computed } from '@angular/core';
import { Producto } from '../models/producto.model';

const STORAGE_KEY = 'carrito';

export interface ItemCarrito extends Producto {
  cantidad: number;
}

@Injectable({ providedIn: 'root' })
export class CarritoService {
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

  agregar(producto: Producto, cantidad = 1): void {
    const lista = [...this._items()];
    const idx = lista.findIndex(i => i.nombre === producto.nombre);
    if (idx >= 0) {
      lista[idx] = { ...lista[idx], cantidad: lista[idx].cantidad + cantidad };
    } else {
      lista.push({ ...producto, cantidad });
    }
    this._items.set(lista);
    this.guardarEnStorage(lista);
  }

  quitarUno(nombre: string): void {
    const lista = [...this._items()];
    const idx = lista.findIndex(i => i.nombre === nombre);
    if (idx < 0) return;
    if (lista[idx].cantidad > 1) {
      lista[idx] = { ...lista[idx], cantidad: lista[idx].cantidad - 1 };
    } else {
      lista.splice(idx, 1);
    }
    this._items.set(lista);
    this.guardarEnStorage(lista);
  }

  eliminar(nombre: string): void {
    const lista = this._items().filter(i => i.nombre !== nombre);
    this._items.set(lista);
    this.guardarEnStorage(lista);
  }

  vaciar(): void {
    this._items.set([]);
    this.guardarEnStorage([]);
  }
}
