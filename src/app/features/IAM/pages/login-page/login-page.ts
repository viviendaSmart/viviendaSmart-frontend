import { TranslateModule } from '@ngx-translate/core';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgOptimizedImage, NgIf } from '@angular/common';
import { AuthService } from '../../../../shared/services/authentication.service';
import { UserService } from '../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TermsModalComponent } from '../../../../shared/components/terms-modal/terms-modal.component';

@Component({
  selector: 'app-login-page',
  imports: [
    TranslateModule,
    RouterLink,
    ReactiveFormsModule,
    NgOptimizedImage,
    NgIf,
    TermsModalComponent
  ],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css'
})
export class LoginPage {
  form: FormGroup;
  loading = false;
  showTermsModal = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
    private _snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.maxLength(30)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(30)]],
      termsAccepted: [false, Validators.requiredTrue]
    });
  }

  login(): void {
    if (this.form.invalid) {
      if (this.form.get('termsAccepted')?.invalid) {
        this.showError('Debe aceptar los Términos y Condiciones');
      }
      this.form.markAllAsTouched();
      return;
    }
    const { email, password } = this.form.value;
    this.loading = true;

    this.userService.login({ email, password }).subscribe({
      next: (loginResponse) => {
        this.authService.saveToken(loginResponse.token);
        this.authService.saveUser(loginResponse.user);

        this.loading = false;
        this.router.navigate(['/home']).then();
      },
      error: () => this.showError('Credenciales inválidas')
    });
  }

  private showError(message: string): void {
    this._snackBar.open(message, '', { duration: 3000 });
    this.loading = false;
  }

  toggleTermsModal(): void {
    this.showTermsModal = !this.showTermsModal;
  }
}
