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
  {
    path: 'medicos',
    loadComponent: () =>
      import('./features/auth/medic.component/medic.component')
        .then(m => m.MedicComponent),
    canActivate: [authGuard],
  },
  // cualquier ruta rara → login
  {
    path: '**',
    redirectTo: 'login',
  },
   {
    path: 'enfermeras',
    loadComponent: () =>
      import('./features/auth/nuser.component/nuser.component')
        .then(m => m.NuserComponent),
        // canActivate: [authGuard],
  },

>>>>>>> 3b69ee5 (Enfermeras)
];
