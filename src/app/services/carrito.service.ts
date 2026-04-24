import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { Producto } from '../models/producto.model';
import { AuthService } from './auth.service';

const STORAGE_KEY = 'carrito';

export interface ItemCarrito extends Producto {
  cantidad: number;
}

@Injectable({ providedIn: 'root' })
export class CarritoService {
  private auth = inject(AuthService);
  private _items = signal<ItemCarrito[]>(this.cargarDeStorage());
  private lastEmail = this.auth.sesion()?.email ?? null;
  readonly items = this._items.asReadonly();
  readonly count = computed(() =>
    this._items().reduce((s, i) => s + i.cantidad, 0)
  );

  constructor() {
    effect(() => {
      const email = this.auth.sesion()?.email ?? null;
      if (email !== this.lastEmail) {
        this.lastEmail = email;
        this.limpiar();
      }
    });
  }

  private limpiar(): void {
    this._items.set([]);
    localStorage.removeItem(STORAGE_KEY);
  }

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
