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
      address: ['', [Validators.required, Validators.maxLength(255)]],
      price: ['', [Validators.required, Validators.min(0.01)]],
      photo: ['string', [Validators.required, Validators.maxLength(500)]],
      size: ['', [Validators.required, Validators.min(0.01)]],
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
