import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

type Tab = 'login' | 'registro';

@Component({
  selector: 'app-sesion',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './sesion.component.html',
  styleUrl: './sesion.component.css',
})
export class SesionComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);

  tabActiva = signal<Tab>('login');
  mensaje = signal('');
  tipoMensaje = signal<'error' | 'ok' | ''>('');

  get estaLogueado() { return this.authService.estaLogueado(); }
  get nombreSesion() { return this.authService.nombreUsuario(); }
  get emailSesion()  { return this.authService.sesion()?.email ?? ''; }

  formLogin!: FormGroup;
  formRegistro!: FormGroup;

  ngOnInit(): void {
    this.formLogin = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.formRegistro = this.fb.group({
      nombre:    ['', [Validators.required, Validators.minLength(2)]],
      email:     ['', [Validators.required, Validators.email]],
      password:  ['', [Validators.required, Validators.minLength(6)]],
      password2: ['', Validators.required],
    });

    this.route.queryParams.subscribe(params => {
      this.tabActiva.set(params['modo'] === 'registro' ? 'registro' : 'login');
    });
  }

  seleccionarTab(tab: Tab): void {
    this.tabActiva.set(tab);
    this.limpiarMensaje();
    this.router.navigate([], { queryParams: tab === 'registro' ? { modo: 'registro' } : {}, replaceUrl: true });
  }

  private limpiarMensaje(): void {
    this.mensaje.set('');
    this.tipoMensaje.set('');
  }

  private mostrarMensaje(texto: string, tipo: 'error' | 'ok'): void {
    this.mensaje.set(texto);
    this.tipoMensaje.set(tipo);
  }

  login(): void {
    this.limpiarMensaje();
    this.formLogin.markAllAsTouched();
    if (this.formLogin.invalid) {
      this.mostrarMensaje('Completa correo y contraseña.', 'error');
      return;
    }
    const { email, password } = this.formLogin.value;
    const error = this.authService.login(email, password);
    if (error) {
      this.mostrarMensaje(error, 'error');
    } else {
      this.router.navigate(['/']);
    }
  }

  registrar(): void {
    this.limpiarMensaje();
    this.formRegistro.markAllAsTouched();
    if (this.formRegistro.invalid) {
      this.mostrarMensaje('Revisa los campos del formulario.', 'error');
      return;
    }
    const { nombre, email, password, password2 } = this.formRegistro.value;
    if (password !== password2) {
      this.mostrarMensaje('Las contraseñas no coinciden.', 'error');
      return;
    }
    const error = this.authService.registro(nombre, email, password);
    if (error) {
      this.mostrarMensaje(error, 'error');
    } else {
      this.mostrarMensaje('Cuenta creada. Ya puedes iniciar sesión.', 'ok');
      this.formRegistro.reset();
      this.seleccionarTab('login');
    }
  }

  cerrarSesion(): void {
    this.authService.cerrarSesion();
  }
}
