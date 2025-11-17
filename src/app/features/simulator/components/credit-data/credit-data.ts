import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';

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
  constructor(private fb: FormBuilder,) {
  }

  ngOnInit() {
    this.fb.group({
      precioVivienda: [300000],
      aporteInicial: [50000],
      bono: [0],
      tipoTasa: ['TEA'],
      tasaAnual: [9],
      capsAnuales: [12],
      plazo: [240],
      tipoGracia: ['NINGUNO'],
      mesesGracia: [0],
      moneda: ['PEN'],
      tasaDescuento: [10],
    })
  }
}
