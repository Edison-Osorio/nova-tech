import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.estaLogueado()) {
    router.navigate(['/sesion'], { queryParams: { redirect: 'admin' } });
    return false;
  }

  if (!auth.esAdmin()) {
    router.navigate(['/']);
    return false;
  }

  return true;
};
