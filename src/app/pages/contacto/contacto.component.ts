import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import emailjs from '@emailjs/browser';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.css',
})
export class ContactoComponent implements OnInit {
  form!: FormGroup;
  enviando = false;
  enviado = false;
  errorEnvio = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    emailjs.init(environment.emailjsPublicKey);

    this.form = this.fb.group({
      nombre:  ['', [Validators.required, Validators.minLength(2)]],
      cc:      ['', [Validators.required, Validators.pattern(/^\d{5,12}$/)]],
      correo:  ['', [Validators.required, Validators.email]],
      celular: ['', [Validators.required, Validators.pattern(/^\d{10,13}$/)]],
      asunto:  ['', Validators.required],
      mensaje: ['', Validators.required],
    });
  }

  campoInvalido(campo: string): boolean {
    const c = this.form.get(campo);
    return !!(c && c.invalid && c.touched);
  }

  soloDigitos(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/\D/g, '');
    const campo = input.name;
    this.form.get(campo)?.setValue(input.value, { emitEvent: false });
  }

  enviar(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.enviando = true;
    this.enviado = false;
    this.errorEnvio = false;

    const v = this.form.value;
    const params = {
      nombre:  v.nombre,
      cc:      v.cc,
      correo:  v.correo,
      celular: v.celular,
      asunto:  v.asunto,
      mensaje: v.mensaje,
      fecha:   new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' }),
    };

    emailjs
      .send(environment.emailjsServiceId, environment.emailjsTemplateId, params)
      .then(() => {
        this.enviado = true;
        this.form.reset();
      })
      .catch(() => {
        this.errorEnvio = true;
      })
      .finally(() => {
        this.enviando = false;
      });
  }
}
