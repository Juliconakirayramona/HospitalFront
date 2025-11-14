import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
 
   {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/components/login-form/login-form')
        .then(m => m.LoginForm),
  },

  // cuando entres a '/', redirige a /login
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  // ejemplo: pacientes
  {
    path: 'pacientes',
    loadComponent: () =>
      import('./features/auth/patient.component/patient.component')
        .then(m => m.PatientComponent),
        canActivate: [authGuard],
  },

  // cualquier ruta rara → login
  {
    path: '**',
    redirectTo: 'login',
  },
];
