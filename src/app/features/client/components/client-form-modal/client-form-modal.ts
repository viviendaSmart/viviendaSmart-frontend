import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ClassicButtonComponent } from "../../../../shared/components/classic-button/classic-button.component";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { NgIf } from '@angular/common';
import { Property } from '../../../property/models/property.entity';
import { Client } from '../../models/client.entity';
import { AuthService } from '../../../../shared/services/authentication.service';
import { UserService } from '../../../IAM/services/user.service';
import { Config } from '../../../config/models/config.entity';

@Component({
  selector: 'app-client-form-modal',
  imports: [
    ClassicButtonComponent,
    FormsModule,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './client-form-modal.html',
  styleUrl: './client-form-modal.css'
})
export class ClientFormModal implements OnInit {
  @Output() formSubmitted = new EventEmitter<any>();
  @Output() modalClosed = new EventEmitter<void>();
  form!: FormGroup;

  constructor(private fb: FormBuilder) { }
  ngOnInit() {
    this.form = this.fb.group({
      dni: ['', [Validators.required, Validators.minLength(8), Validators.minLength(8), Validators.maxLength(8), Validators.pattern(/^\d{8}$/)]],
      monthlyIncome: ['', [Validators.required, Validators.min(0.01)]],
      ocupation: ['', [Validators.required, Validators.maxLength(30), Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]*$/)]],
      name: ['', [Validators.required, Validators.maxLength(30), Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]*$/)]],
      surname: ['', [Validators.required, Validators.maxLength(30), Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]*$/)]],
      business: ['', [Validators.required, Validators.maxLength(30), Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]*$/)]],
      earningtype: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]*$/)]],
      credithistory: [true, Validators.required],
      support: [false, Validators.required],
      address: ['', [Validators.required, Validators.maxLength(30)]],
      maritalStatus: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9), Validators.pattern(/^9[0-9]{8}$/)]],
    })
  }
  submitForm(event: Event): void {
    event.preventDefault();
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (this.form.valid) {
      this.formSubmitted.emit(this.form.value);
    }
  }
  validarEntrada(event: InputEvent) {
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]*$/;
    if (event.data && !regex.test(event.data)) {
      event.preventDefault();
    }
  }
  close() {
    this.modalClosed.emit();
  }

  restringirPrimerDigito(event: InputEvent, type: string) {
    const input = event.target as HTMLInputElement;
    const tecla = event.data;

    if (tecla && !/^[0-9]$/.test(tecla)) {
      event.preventDefault();
      return;
    }

    const isCelular = type.toLowerCase() !== 'dni';

    if (isCelular) {
      if (input.value.length === 0 && tecla !== '9') {
        event.preventDefault();
      }
    }
  }

  blockScientificNotation(event: KeyboardEvent) {
    if (['e', 'E', '+', '-'].includes(event.key)) {
      event.preventDefault();
    }
  }

}
