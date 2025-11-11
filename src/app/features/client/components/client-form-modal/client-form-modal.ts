import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ClassicButtonComponent} from "../../../../shared/components/classic-button/classic-button.component";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Property} from '../../../property/models/property.entity';
import {Client} from '../../models/client.entity';
import {AuthService} from '../../../../shared/services/authentication.service';
import {UserService} from '../../../IAM/services/user.service';

@Component({
  selector: 'app-client-form-modal',
    imports: [
        ClassicButtonComponent,
        FormsModule,
        ReactiveFormsModule
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
      dni: ['', Validators.required],
      monthlyIncome: [ Validators.required],
      ocupation: ['', Validators.required],
      name: ['', Validators.required],
      surname: ['', Validators.required],
      business: ['', Validators.required],
      earningtype: ['', Validators.required],
      credithistory: [true, Validators.required],
      support: [false, Validators.required],
      address: ['', Validators.required],
      maritalStatus: ['', Validators.required],
      phoneNumber: ['', Validators.required],
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



}
