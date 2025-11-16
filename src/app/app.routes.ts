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
  {
    path: 'dashboard',
    loadComponent: () =>
      import('../app/features/auth/components/dashboard/dashboard')
        .then(m => m.Dashboard),
    canActivate: [authGuard],
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
  {
    path: 'enfermeras',
    loadComponent: () =>
      import('./features/auth/nuser.component/nuser.component')
        .then(m => m.NuserComponent),
    canActivate: [authGuard],
  },
  {
    path: 'citas',
    loadComponent: () =>
      import('./features/auth/medical-appointment.component/medical-appointment.component')
        .then(m => m.MedicalAppointmentComponent),
    canActivate: [authGuard],
  },
  {
    path: 'diagnosticos',
    loadComponent: () =>
      import('./features/auth/diagnosis.component/diagnosis.component')
        .then(m => m.DiagnosisComponent),
  },
  {
    path: 'facturas',
    loadComponent: () =>
      import('./features/auth/bill.component/bill.component')
        .then(m => m.BillComponent),

    canActivate: [authGuard],
  },
  // cualquier ruta rara → login
  {
    path: '**',
    redirectTo: 'login',
  },
];
