import { TranslateModule } from '@ngx-translate/core';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ClassicButtonComponent} from "../../../../shared/components/classic-button/classic-button.component";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {PropertyService} from '../../services/property.service';
import {AuthService} from '../../../../shared/services/authentication.service';
import {Property} from '../../models/property.entity';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-property-form-edit-modal',
  imports: [
    TranslateModule,
    ClassicButtonComponent,
    ReactiveFormsModule,
    FormsModule,
    NgIf
  ],
  templateUrl: './property-form-edit-modal.html',
  styleUrl: './property-form-edit-modal.css'
})
export class PropertyFormEditModal implements OnInit{
  @Output() formEdited = new EventEmitter<any>();
  @Output() modalClosed = new EventEmitter<void>();
  @Output() onDelete = new EventEmitter<any>();
  @Input() property: Property| null = null;
  form2!: FormGroup;


  constructor(private fb: FormBuilder,
              private propertyService: PropertyService,
              private authService: AuthService,) {

  }

  ngOnInit() {
    //console.log('🧾 Modal cargado con propiedad:', this.property);
    this.form2 = this.fb.group({
      address: [this.property?.address || '', [Validators.required, Validators.maxLength(30)]],
      price: [this.property?.price || '', [Validators.required, Validators.min(10), Validators.maxLength(1000000000)]],
      photo: [this.property?.photo || '', [Validators.required, Validators.maxLength(500)]],
      size: [this.property?.size || '', [Validators.required, Validators.min(10), Validators.maxLength(50000)]],
    })
  }

  editForm(event: Event): void {
    event.preventDefault();
    if (this.form2.valid) {
      this.formEdited.emit(this.form2.value);
    }
  }
  deleteForm(event: Event): void {
    event.preventDefault();
    if (this.property) {
      this.onDelete.emit(this.property);
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
