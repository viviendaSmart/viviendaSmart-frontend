import { Component } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {UserService} from '../../services/user.service';
import {AuthService} from '../../../../shared/services/authentication.service';
import {NgIf, NgOptimizedImage} from '@angular/common';
import {MatSnackBar} from '@angular/material/snack-bar';
import {User} from '../../models/user.entity';
import {TermsModalComponent} from '../../../../shared/components/terms-modal/terms-modal.component';

@Component({
  selector: 'app-register-page',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    NgIf,
    NgOptimizedImage,
    TermsModalComponent
  ],
  templateUrl: './register-page.html',
  styleUrls: ['./register-page.css']
})
export class RegisterPage {
  form: FormGroup;
  loading = false;
  showTermsModal = false;
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private _snackBar: MatSnackBar,
    private authService: AuthService,
    private router: Router,
  ) {
    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email,Validators.minLength(4), Validators.maxLength(30)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(30)]],
      requestedRole: ['PROPERTY_MANAGER'],
      termsAccepted: [false, Validators.requiredTrue]
    }, { });
  }

  register() {
    if (this.form.invalid || this.loading) {
      if (this.form.get('termsAccepted')?.invalid) {
        this.showError('Debe aceptar los Términos y Condiciones');
      }
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    const { firstName, lastName, email, password, requestedRole } = this.form.value;

    this.userService.register({ firstName, lastName, email, password, requestedRole })
      .subscribe({
        next: () => {
          // ahora sí, login
          this.userService.login({email, password}).subscribe({
            next: (loginResponse) => {
              this.authService.saveToken(loginResponse.token);
              this.authService.saveUser({username: loginResponse.user});
              this.router.navigate(['/login']);
              this.loading = false;
            },
            error: () => this.showError('Error al hacer login después del registro')
          });
        },
        error: () => this.showError('Correo o contraseña incorrectos')
      });
  }
  private showError(message: string): void {
    this._snackBar.open(message, '', { duration: 3000 });
    this.loading = false;
  }
  validarEntrada(event: InputEvent) {
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]*$/;
    if (event.data && !regex.test(event.data)) {
      event.preventDefault();
    }
  }

  toggleTermsModal(): void {
    this.showTermsModal = !this.showTermsModal;
  }
}
