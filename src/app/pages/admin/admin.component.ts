import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { ProductosService } from '../../services/productos.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { Producto } from '../../models/producto.model';

type FormularioProducto = Omit<Producto, 'id'>;

const FORMULARIO_VACIO: FormularioProducto = {
  nombre: '',
  descripcion: '',
  imagen: '',
  caracteristicas: '',
  precio: undefined,
};

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FormsModule, DecimalPipe],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent {
  productosService = inject(ProductosService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  mostrarFormulario = signal(false);
  editandoId = signal<string | null>(null);
  idParaEliminar = signal<string | null>(null);

  formulario = signal<FormularioProducto>({ ...FORMULARIO_VACIO });
  errores = signal<Partial<Record<keyof FormularioProducto, string>>>({});

  tituloFormulario = computed(() =>
    this.editandoId() ? 'Editar producto' : 'Agregar producto'
  );

  abrirCrear(): void {
    this.editandoId.set(null);
    this.formulario.set({ ...FORMULARIO_VACIO });
    this.errores.set({});
    this.mostrarFormulario.set(true);
  }

  abrirEditar(producto: Producto): void {
    this.editandoId.set(producto.id ?? null);
    this.formulario.set({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      imagen: producto.imagen,
      caracteristicas: producto.caracteristicas,
      precio: producto.precio,
    });
    this.errores.set({});
    this.mostrarFormulario.set(true);
  }

  cerrarFormulario(): void {
    this.mostrarFormulario.set(false);
    this.editandoId.set(null);
  }

  actualizarCampo<K extends keyof FormularioProducto>(
    campo: K,
    valor: FormularioProducto[K]
  ): void {
    this.formulario.update(f => ({ ...f, [campo]: valor }));
    this.errores.update(e => ({ ...e, [campo]: undefined }));
  }

  private validar(): boolean {
    const f = this.formulario();
    const errs: Partial<Record<keyof FormularioProducto, string>> = {};

    if (!f.nombre.trim()) errs.nombre = 'El nombre es obligatorio.';
    if (!f.descripcion.trim()) errs.descripcion = 'La descripción es obligatoria.';
    if (!f.imagen.trim()) errs.imagen = 'La imagen es obligatoria.';
    if (!f.caracteristicas.trim()) errs.caracteristicas = 'Las características son obligatorias.';
    if (f.precio !== undefined && f.precio < 0) errs.precio = 'El precio no puede ser negativo.';

    this.errores.set(errs);
    return Object.keys(errs).length === 0;
  }

  guardar(): void {
    if (!this.validar()) return;

    const f = this.formulario();
    const id = this.editandoId();

    if (id) {
      this.productosService.actualizar(id, f);
      this.toastService.show('Producto actualizado correctamente.');
    } else {
      this.productosService.agregar(f);
      this.toastService.show('Producto agregado correctamente.');
    }

    this.cerrarFormulario();
  }

  confirmarEliminar(id: string): void {
    this.idParaEliminar.set(id);
  }

  cancelarEliminar(): void {
    this.idParaEliminar.set(null);
  }

  ejecutarEliminar(): void {
    const id = this.idParaEliminar();
    if (!id) return;
    this.productosService.eliminar(id);
    this.toastService.show('Producto eliminado correctamente.');
    this.idParaEliminar.set(null);
  }

  cerrarSesion(): void {
    this.authService.cerrarSesion();
    this.router.navigate(['/']);
  }
}
