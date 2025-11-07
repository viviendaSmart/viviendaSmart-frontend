import { Component } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf} from '@angular/common';
import {AuthService} from '../../../../shared/services/authentication.service';
import {UserService} from '../../services/user.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-login-page',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css'
})
export class LoginPage {
  form: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
    private _snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  login(): void {
    if (this.form.invalid) return;

    const { email, password } = this.form.value;
    this.loading = true;

    this.userService.login({ email, password }).subscribe({
      next: (loginResponse) => {
        this.authService.saveToken(loginResponse.token);
        this.authService.saveUser(loginResponse.email);

        console.log('✅ Token guardado:', this.authService.getToken());
        console.log('👤 Usuario guardado:', loginResponse.email);

        this.loading = false;
        this.router.navigate(['/home']); // Redirige tras el login
      },
      error: () => this.showError('Correo o contraseña incorrectos')
    });
  }

  private showError(message: string): void {
    this._snackBar.open(message, '', { duration: 3000 });
    this.loading = false;
  }
}
