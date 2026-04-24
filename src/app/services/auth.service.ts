import { Injectable, signal, computed } from '@angular/core';

const STORAGE_USUARIOS = 'novatech_usuarios';
const STORAGE_SESION = 'novatech_sesion';

export interface Usuario {
  nombre: string;
  email: string;
  password: string;
}

export interface Sesion {
  nombre: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _sesion = signal<Sesion | null>(this.cargarSesion());
  readonly sesion = this._sesion.asReadonly();
  readonly estaLogueado = computed(() => this._sesion() !== null);
  readonly nombreUsuario = computed(() => this._sesion()?.nombre ?? '');

  private cargarSesion(): Sesion | null {
    try {
      const raw = localStorage.getItem(STORAGE_SESION);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  private getUsuarios(): Usuario[] {
    try {
      const raw = localStorage.getItem(STORAGE_USUARIOS);
      const list = raw ? JSON.parse(raw) : [];
      return Array.isArray(list) ? list : [];
    } catch {
      return [];
    }
  }

  private guardarUsuarios(lista: Usuario[]): void {
    localStorage.setItem(STORAGE_USUARIOS, JSON.stringify(lista));
  }

  login(email: string, password: string): string | null {
    const usuarios = this.getUsuarios();
    const u = usuarios.find(x => x.email.toLowerCase() === email.toLowerCase());
    if (!u || u.password !== password) return 'Correo o contraseña incorrectos.';
    const sesion: Sesion = { nombre: u.nombre, email: u.email };
    localStorage.setItem(STORAGE_SESION, JSON.stringify(sesion));
    this._sesion.set(sesion);
    return null;
  }

  registro(nombre: string, email: string, password: string): string | null {
    if (nombre.trim().length < 2) return 'Indica un nombre válido.';
    if (!email || !email.includes('@')) return 'Indica un correo electrónico válido.';
    if (password.length < 6) return 'La contraseña debe tener al menos 6 caracteres.';
    const usuarios = this.getUsuarios();
    if (usuarios.some(x => x.email.toLowerCase() === email.toLowerCase())) {
      return 'Ese correo ya está registrado.';
    }
    usuarios.push({ nombre: nombre.trim(), email: email.toLowerCase(), password });
    this.guardarUsuarios(usuarios);
    return null;
  }

  cerrarSesion(): void {
    localStorage.removeItem(STORAGE_SESION);
    this._sesion.set(null);
  }
}
