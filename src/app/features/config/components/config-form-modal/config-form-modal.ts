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

@Component({
  selector: 'app-config-form-modal',
  standalone: true,   // si tus otros componentes también usan imports, pon esto
  imports: [
    ReactiveFormsModule,
    ClassicButtonComponent
  ],
  templateUrl: './config-form-modal.html',
  styleUrl: './config-form-modal.css'
})
export class ConfigFormModal implements OnInit, OnChanges {
  @Output() formSubmitted = new EventEmitter<any>();
  @Input() config: Config | null = null;

  form!: FormGroup;
  userId!: number;

  constructor(
    private fb: FormBuilder,
    private configService: ConfigService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.userId = user.id;

    this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config'] && this.form && this.config) {
      this.patchFormWithConfig(this.config);
    }
  }

  private buildForm() {
    this.form = this.fb.group({
      rate: [this.config ? (this.config as any).rate : '', [Validators.required, Validators.min(0)]],
      rateType: [this.config ? (this.config as any).rateType : '', Validators.required],
      exchange: [this.config ? (this.config as any).exchange : '', Validators.required],
      term: [this.config ? (this.config as any).term : '', [Validators.required, Validators.min(1)]],
      termtype: [this.config ? (this.config as any).termtype : '', Validators.required],
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
    if (this.form.valid) {
      this.formSubmitted.emit(this.form.value);
    }
  }
}
