import { TranslateModule } from '@ngx-translate/core';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ConfigService} from '../../services/config.service';
import {AuthService} from '../../../../shared/services/authentication.service';
import {ClassicButtonComponent} from '../../../../shared/components/classic-button/classic-button.component';
import {Config} from '../../models/config.entity';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-config-form-modal',
  standalone: true,   // si tus otros componentes también usan imports, pon esto
  imports: [
    TranslateModule,
    ReactiveFormsModule,
    ClassicButtonComponent,
    NgIf
  ],
  templateUrl: './config-form-modal.html',
  styleUrl: './config-form-modal.css'
})
export class ConfigFormModal implements OnInit, OnChanges {
  @Output() formSubmitted = new EventEmitter<any>();
  @Input() config: Config | null = null;

  form!: FormGroup;
  userId!: number;
  mensaje: string = '';
  tipoMensaje: 'success' | 'error' | '' = '';
  isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private configService: ConfigService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.userId = user.id;
    this.mensaje = '';
    this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config'] && this.form && this.config) {
      this.patchFormWithConfig(this.config);
    }
  }

  private buildForm() {
    this.form = this.fb.group({
      rate: [this.config ? (this.config as any).rate : '', [Validators.required, Validators.min(0), Validators.max(100)]],
      rateType: [this.config ? (this.config as any).rateType : 'TEA', Validators.required],
      exchange: [this.config ? (this.config as any).exchange : 'SOLES', Validators.required],
      term: [this.config ? (this.config as any).term : '', [Validators.required, Validators.min(1), Validators.max(999)]],
      termtype: [this.config ? (this.config as any).termtype : 'PARCIAL', Validators.required],
    });
  }

  private patchFormWithConfig(config: Config) {
    this.form.patchValue({
      rate:    (config as any).rate,
      rateType:(config as any).rateType,
      exchange:(config as any).exchange,
      term:    (config as any).term,
      termtype:(config as any).termtype,
    });
  }

  submitForm(event: Event) {
    event.preventDefault();
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isSubmitting = true;
    this.mensaje = '';
    this.formSubmitted.emit(this.form.value);
  }

  validarSoloNumeros(event: InputEvent) {
    const input = event.target as HTMLInputElement;
    const tecla = event.data;

    // 1. Si no hay tecla (ej. borrar), no hacemos nada
    if (!tecla) return;

    // 2. Construimos cómo quedaría el texto si aceptamos la tecla
    const valorFuturo = input.value + tecla;

    // 3. Regex flexible para el tipeo:
    // Permite números y UN solo punto decimal en cualquier posición mientras escribe
    const regexTipeo = /^\d*\.?\d*$/;

    if (!regexTipeo.test(valorFuturo)) {
      event.preventDefault();
    }
  }

  validarSoloEnteros(event: InputEvent) {
    const input = event.target as HTMLInputElement;
    const tecla = event.data;

    if (!tecla) return;
    const valorFuturo = input.value + tecla;
    const regexTipeo = /^[0-9]+$/;

    if (!regexTipeo.test(valorFuturo)) {
      event.preventDefault();
    }
  }

}
