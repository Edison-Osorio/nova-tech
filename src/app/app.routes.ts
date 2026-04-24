import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'catalogo',
    loadComponent: () => import('./pages/catalogo/catalogo.component').then(m => m.CatalogoComponent),
  },
  {
    path: 'favoritos',
    loadComponent: () => import('./pages/favoritos/favoritos.component').then(m => m.FavoritosComponent),
  },
  {
    path: 'producto/:nombre',
    loadComponent: () => import('./pages/producto-detalle/producto-detalle.component').then(m => m.ProductoDetalleComponent),
  },
  {
    path: 'contacto',
    loadComponent: () => import('./pages/contacto/contacto.component').then(m => m.ContactoComponent),
  },
  {
    path: 'quienes-somos',
    loadComponent: () => import('./pages/quienes-somos/quienes-somos.component').then(m => m.QuienesSomosComponent),
  },
  {
    path: 'sesion',
    loadComponent: () => import('./pages/sesion/sesion.component').then(m => m.SesionComponent),
  },
  { path: '**', redirectTo: '' },
];
