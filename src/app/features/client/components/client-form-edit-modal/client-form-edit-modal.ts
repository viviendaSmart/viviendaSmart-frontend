import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ClassicButtonComponent} from "../../../../shared/components/classic-button/classic-button.component";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Property} from '../../../property/models/property.entity';
import {Client} from '../../models/client.entity';
import {PropertyService} from '../../../property/services/property.service';
import {AuthService} from '../../../../shared/services/authentication.service';
import {Config} from '../../../config/models/config.entity';

@Component({
  selector: 'app-client-form-edit-modal',
    imports: [
        ClassicButtonComponent,
        FormsModule,
        ReactiveFormsModule
    ],
  templateUrl: './client-form-edit-modal.html',
  styleUrl: './client-form-edit-modal.css'
})
export class ClientFormEditModal implements OnInit {
  @Output() formEdited = new EventEmitter<any>();
  @Output() modalClosed = new EventEmitter<void>();
  @Output() onDelete = new EventEmitter<any>();
  @Input() client: Client| null = null;
  form2!: FormGroup;
  constructor(private fb: FormBuilder,
              private propertyService: PropertyService,
              private authService: AuthService,) {}

  ngOnInit() {
    this.buildForm()

  }

  private buildForm() {
    this.form2 = this.fb.group({
      dni: [this.client ? (this.client as any).dni : '', [Validators.required, Validators.minLength(8), Validators.maxLength(8), Validators.pattern(/^\d{8}$/)]],
      monthlyIncome: [this.client ? (this.client as any).monthlyIncome : '', [Validators.required, Validators.min(0.01)]],
      ocupation: [this.client ? (this.client as any).ocupation : '', [Validators.required, Validators.maxLength(30), Validators.pattern(/^[a-zA-Z<UNK> ]*$/)]],
      business: [this.client ? (this.client as any).business : '', [Validators.required, Validators.maxLength(30), Validators.pattern(/^[a-zA-Z<UNK> ]*$/)]],
      name: [this.client ? (this.client as any).name : '', [Validators.required, Validators.maxLength(30), Validators.pattern(/^[a-zA-Z<UNK> ]*$/)]],
      surname: [this.client ? (this.client as any).surname : '', [Validators.required, Validators.maxLength(30),  Validators.pattern(/^[a-zA-Z<UNK> ]*$/)]],
      earningtype: [this.client ? (this.client as any).earningtype : '', [Validators.required, Validators.maxLength(30),  Validators.pattern(/^[a-zA-Z<UNK> ]*$/)]],
      credithistory: [this.client ? (this.client as any).credithistory : '', [Validators.required, Validators.maxLength(30)]],
      support: [this.client ? (this.client as any).support : '', Validators.required],
      address: [this.client ? (this.client as any).address : '', [Validators.required, Validators.maxLength(30)]],
      maritalStatus: [this.client ? (this.client as any).maritalStatus : '', Validators.required],
      phoneNumber: [this.client ? (this.client as any).phoneNumber : '', [Validators.required, Validators.maxLength(9), Validators.pattern(/^9[0-9]{8}$/)]],
    });
  }


  editForm(event: Event): void {
    event.preventDefault();
    if (this.form2.valid) {
      this.formEdited.emit(this.form2.value);
    }
  }
  deleteForm(event: Event): void {
    event.preventDefault();
    if (this.client) {
      this.onDelete.emit(this.client);
    }
  }

  close()
  {
    this.modalClosed.emit();
  }

  validarEntrada(event: InputEvent) {
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]*$/;
    if (event.data && !regex.test(event.data)) {
      event.preventDefault();
    }
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

}
