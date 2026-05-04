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
      dni: [this.client ? (this.client as any).dni : '', [Validators.required, Validators.min(0)]],
      monthlyIncome: [this.client ? (this.client as any).monthlyIncome : '', Validators.required],
      ocupation: [this.client ? (this.client as any).ocupation : '', Validators.required],
      business: [this.client ? (this.client as any).business : '', [Validators.required, Validators.min(1)]],
      name: [this.client ? (this.client as any).name : '', [Validators.required, Validators.min(1)]],
      surname: [this.client ? (this.client as any).surname : '', Validators.required],
      earningtype: [this.client ? (this.client as any).earningtype : '', Validators.required],
      credithistory: [this.client ? (this.client as any).credithistory : '', [Validators.required, Validators.min(1)]],
      support: [this.client ? (this.client as any).support : '', Validators.required],
      address: [this.client ? (this.client as any).address : '', Validators.required],
      maritalStatus: [this.client ? (this.client as any).maritalStatus : '', [Validators.required, Validators.min(1)]],
      phoneNumber: [this.client ? (this.client as any).phoneNumber : '', Validators.required],
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

}
