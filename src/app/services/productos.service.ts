import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Producto } from '../models/producto.model';

const STORAGE_KEY = 'novatech_productos';

function generarId(): string {
  return `p_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

@Injectable({ providedIn: 'root' })
export class ProductosService {
  private http = inject(HttpClient);

  private _productos = signal<Producto[]>([]);
  readonly productos = this._productos.asReadonly();

  constructor() {
    this.inicializar();
  }

  private inicializado = false;

  inicializar(): Promise<void> {
    if (this.inicializado) return Promise.resolve();
    this.inicializado = true;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const lista: Producto[] = JSON.parse(stored);
        this._productos.set(lista);
        return Promise.resolve();
      } catch {
        /* cae al JSON estático */
      }
    }

    return new Promise(resolve => {
      this.http.get<Producto[]>('productos.json').subscribe({
        next: lista => {
          const conIds = lista.map(p => ({ ...p, id: p.id ?? generarId() }));
          this._productos.set(conIds);
          this.persistir();
          resolve();
        },
        error: () => resolve(),
      });
    });
  }

  private persistir(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this._productos()));
  }

  agregar(producto: Omit<Producto, 'id'>): void {
    const nuevo: Producto = { ...producto, id: generarId() };
    this._productos.update(lista => [...lista, nuevo]);
    this.persistir();
  }

  actualizar(id: string, cambios: Partial<Omit<Producto, 'id'>>): void {
    this._productos.update(lista =>
      lista.map(p => (p.id === id ? { ...p, ...cambios } : p))
    );
    this.persistir();
  }

  eliminar(id: string): void {
    this._productos.update(lista => lista.filter(p => p.id !== id));
    this.persistir();
  }

  getById(id: string): Producto | undefined {
    return this._productos().find(p => p.id === id);
  }

  getByNombre(nombre: string): Producto | undefined {
    return this._productos().find(
      p => p.nombre.toLowerCase() === nombre.toLowerCase()
    );
  }
}
