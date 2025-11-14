import { Component, inject } from '@angular/core';
import { Auth } from '../../services/Auth.Services';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './login-form.html',
  styleUrl: './login-form.scss',
})
export class LoginForm {
private authService = inject(Auth);

  private router = inject(Router);

  email = '';
  password = '';
  errorMsg = '';

  onSubmit() {
    this.errorMsg = '';

    this.authService
      .login({ email: this.email, password: this.password })
      .subscribe({
        next: (res) => {
          console.log('LOGIN OK', res);
          this.router.navigate(['/pacientes']);
          // this.router.navigate(['/patients']); // o donde quieras redirigir
        },
        error: (err) => {
          console.error(err);
          this.errorMsg = 'Credenciales inválidas';
        },
      });
  }
  logout() {
    this.authService.logout();
  }
}
