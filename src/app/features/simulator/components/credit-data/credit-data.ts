import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ConfigService} from '../../../config/services/config.service';

@Component({
  selector: 'app-credit-data',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './credit-data.html',
  styleUrl: './credit-data.css'
})
export class CreditData implements OnInit {
  form!: FormGroup;

  constructor(private fb: FormBuilder,
              private configService: ConfigService) {
  }

  ngOnInit() {
    this.buildForm()
    this.loadConfigAndPatchForm()
  }

  private buildForm() {
    this.form = this.fb.group({
      price: [null, [Validators.required, Validators.min(0)]],
      initalPayment: [0, [Validators.min(0)]],
      bono: [0, [Validators.min(0)]],

      rateType: ['', Validators.required],
      rate: [null, [Validators.required, Validators.min(0)]],
      plazo: [null, [Validators.required, Validators.min(1)]],

      termtype: ['', Validators.required],
      term: [null, [Validators.required, Validators.min(0)]],

      exchange: ['', Validators.required],
    });
  }

  private loadConfigAndPatchForm() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id;

    if (!userId) return;

    this.configService.getByUserId(userId).subscribe({
      next: (config: any) => {
        if (!config) return;

        this.form.patchValue({
          rateType: config.rateType,        // TEM, TEA, etc.
          rate: config.rate,               // BigDecimal → número
          termtype: config.termtype,       // PARCIAL / TOTAL
          term: config.term,               // meses gracia
          exchange: config.exchange,         // SOLES / DOLARES
          // Si decides que "plazo" es igual que "term" o algo derivado:
          // plazo: config.term
        });

        console.log('Form precargado con config:', this.form.value);
      },
      error: err => console.error('Error cargando config para simulador', err)
    });
  }
}
