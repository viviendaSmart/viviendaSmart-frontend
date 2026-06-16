import { TranslateModule } from '@ngx-translate/core';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PropertyService} from '../../services/property.service';
import {Property} from '../../models/property.entity';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import {ClassicButtonComponent} from '../../../../shared/components/classic-button/classic-button.component';
import {AuthService} from '../../../../shared/services/authentication.service';

@Component({
  selector: 'app-property-form-modal',
  imports: [
    TranslateModule,
    ReactiveFormsModule,
    NgForOf,
    NgIf,
    ClassicButtonComponent
  ],
  templateUrl: './property-form-modal.html',
  styleUrl: './property-form-modal.css'
})
export class PropertyFormModal implements OnInit {
  @Output() formSubmitted = new EventEmitter<any>();
  @Output() modalClosed = new EventEmitter<void>();
  @Input() properties: Array<Property> = [];
  form!: FormGroup;

  constructor(private fb: FormBuilder,
              private propertyService: PropertyService,
              private authService: AuthService,) { }

  ngOnInit() {
    this.form = this.fb.group({
      address: ['', [Validators.required, Validators.maxLength(30)]],
      price: ['', [Validators.required, Validators.min(10),  Validators.maxLength(1000000000)]],
      photo: ['string', [Validators.required, Validators.maxLength(500)]],
      size: ['', [Validators.required, Validators.min(10), Validators.maxLength(50000)]],
    })
  }

  submitForm(event: Event): void {
    event.preventDefault();
    if (this.form.valid) {
      this.formSubmitted.emit(this.form.value);
    }
  }

  close()
  {
    this.modalClosed.emit();
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
}
