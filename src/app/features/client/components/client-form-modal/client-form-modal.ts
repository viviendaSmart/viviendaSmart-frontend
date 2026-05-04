import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ClassicButtonComponent} from "../../../../shared/components/classic-button/classic-button.component";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import { NgIf } from '@angular/common';
import {Property} from '../../../property/models/property.entity';
import {Client} from '../../models/client.entity';
import {AuthService} from '../../../../shared/services/authentication.service';
import {UserService} from '../../../IAM/services/user.service';
import {Config} from '../../../config/models/config.entity';

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

  constructor(private fb: FormBuilder) {}
  ngOnInit() {
    this.form = this.fb.group({
      dni: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8), Validators.pattern(/^\d{8}$/)]],
      monthlyIncome: [ '', [Validators.required, Validators.min(0.01)]],
      ocupation: ['', [Validators.required, Validators.maxLength(100)]],
      name: ['', [Validators.required, Validators.maxLength(100)]],
      surname: ['', [Validators.required, Validators.maxLength(100)]],
      business: ['', [Validators.required, Validators.maxLength(100)]],
      earningtype: ['', Validators.required],
      credithistory: [true, Validators.required],
      support: [false, Validators.required],
      address: ['', [Validators.required, Validators.maxLength(255)]],
      maritalStatus: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.maxLength(15), Validators.pattern(/^\+?\d+$/)]],
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

  close()
  {
    this.modalClosed.emit();
  }



}
