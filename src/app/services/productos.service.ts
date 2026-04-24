import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { Producto } from '../models/producto.model';

@Injectable({ providedIn: 'root' })
export class ProductosService {
  private http = inject(HttpClient);
  private productos$: Observable<Producto[]> | null = null;

  getProductos(): Observable<Producto[]> {
    if (!this.productos$) {
      this.productos$ = this.http
        .get<Producto[]>('productos.json')
        .pipe(shareReplay(1));
    }
    return this.productos$;
  }
}
