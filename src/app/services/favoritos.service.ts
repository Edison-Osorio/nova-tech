import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { Router } from '@angular/router';
import { Producto } from '../models/producto.model';
import { ToastService } from './toast.service';
import { AuthService } from './auth.service';

const STORAGE_KEY = 'favoritos';

@Injectable({ providedIn: 'root' })
export class FavoritosService {
  private toast = inject(ToastService);
  private auth = inject(AuthService);
  private router = inject(Router);
  private _favoritos = signal<Producto[]>(this.cargarDeStorage());
  private lastEmail = this.auth.sesion()?.email ?? null;
  readonly favoritos = this._favoritos.asReadonly();
  readonly count = computed(() => this._favoritos().length);

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
    this._favoritos.set([]);
    localStorage.removeItem(STORAGE_KEY);
  }

  private cargarDeStorage(): Producto[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const data = JSON.parse(raw);
      if (!Array.isArray(data)) return [];
      return data.map((f: string | Producto) =>
        typeof f === 'string' ? { nombre: f, descripcion: '', imagen: '', caracteristicas: '' } : f
      );
    } catch {
      return [];
    }
  }

  private guardarEnStorage(lista: Producto[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
  }

  esFavorito(nombre: string): boolean {
    return this._favoritos().some(f => f.nombre === nombre);
  }

  toggle(producto: Producto): void {
    if (!this.auth.estaLogueado()) {
      this.toast.show('Debes iniciar sesión para agregar productos a favoritos.');
      this.router.navigate(['/sesion']);
      return;
    }
    if (this.esFavorito(producto.nombre)) {
      this.quitar(producto.nombre);
    } else {
      this.agregar(producto);
    }
  }

  agregar(producto: Producto): void {
    if (this.esFavorito(producto.nombre)) return;
    const nueva = [...this._favoritos(), producto];
    this._favoritos.set(nueva);
    this.guardarEnStorage(nueva);
    this.toast.show('Agregado a favoritos');
  }

  quitar(nombre: string): void {
    const nueva = this._favoritos().filter(f => f.nombre !== nombre);
    this._favoritos.set(nueva);
    this.guardarEnStorage(nueva);
    this.toast.show('Eliminado de favoritos');
  }
}
