import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ClassicButtonComponent} from "../../../../shared/components/classic-button/classic-button.component";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {PropertyService} from '../../services/property.service';
import {AuthService} from '../../../../shared/services/authentication.service';
import {Property} from '../../models/property.entity';

@Component({
  selector: 'app-property-form-edit-modal',
  imports: [
    ClassicButtonComponent,
    ReactiveFormsModule,
    FormsModule
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
      address: [this.property?.address || '', Validators.required],
      price: [this.property?.price || '', Validators.required],
      photo: [this.property?.photo || '', Validators.required],
      size: [this.property?.size || '', Validators.required],
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

}
