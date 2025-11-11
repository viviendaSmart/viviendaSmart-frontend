import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ClassicButtonComponent} from "../../../../shared/components/classic-button/classic-button.component";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Property} from '../../../property/models/property.entity';
import {Client} from '../../models/client.entity';
import {PropertyService} from '../../../property/services/property.service';
import {AuthService} from '../../../../shared/services/authentication.service';

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
    this.form2 = this.fb.group({
      dni: [this.client?.dni || '', Validators.required],
      monthlyIncome: [ this.client?.monthlyIncome || '',Validators.required],
      ocupation: [this.client?.ocupation || '', Validators.required],
      name: [this.client?.name || '', Validators.required],
      surname: [this.client?.surname || '', Validators.required],
      business: [this.client?.business || '', Validators.required],
      earningtype: [this.client?.earningtype || '', Validators.required],
      credithistory: [this.client?.credithistory || '', Validators.required],
      support: [this.client?.support || '', Validators.required],
      address: [this.client?.address || '', Validators.required],
      maritalStatus: [this.client?.maritalStatus || '', Validators.required],
      phoneNumber: [this.client?.phoneNumber || '', Validators.required],
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
    if (this.client) {
      this.onDelete.emit(this.client);
    }
  }

  close()
  {
    this.modalClosed.emit();
  }

}
