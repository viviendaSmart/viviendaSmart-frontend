import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {PropertyService} from '../../services/property.service';
import {Property} from '../../models/property.entity';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgForOf} from '@angular/common';
import {ClassicButtonComponent} from '../../../../shared/components/classic-button/classic-button.component';
import {AuthService} from '../../../../shared/services/authentication.service';

@Component({
  selector: 'app-property-form-modal',
  imports: [
    ReactiveFormsModule,
    NgForOf,
    ClassicButtonComponent
  ],
  templateUrl: './property-form-modal.html',
  styleUrl: './property-form-modal.css'
})
export class PropertyFormModal implements OnInit {
  @Output() formSubmitted = new EventEmitter<any>();
  @Output() modalClosed = new EventEmitter<void>();
  form!: FormGroup;

  constructor(private fb: FormBuilder,
              private propertyService: PropertyService,
              private authService: AuthService,) { }

  ngOnInit() {
    this.form = this.fb.group({
      address: ['', Validators.required],
      price: ['', Validators.required],
      photo: ['string', Validators.required],
      size: ['', Validators.required],
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
