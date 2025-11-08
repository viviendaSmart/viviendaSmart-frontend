import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {PropertyService} from '../../services/property.service';
import {Property} from '../../models/property.entity';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-property-form-modal',
  imports: [],
  templateUrl: './property-form-modal.html',
  styleUrl: './property-form-modal.css'
})
export class PropertyFormModal implements OnInit {
  @Output() formSubmitted = new EventEmitter<any>();
  @Output() modalClosed = new EventEmitter<void>();
  form!: FormGroup;

  addresses: string[] = [];
  sizes: number[] = [];
  prices: number[] = [];
  photos: string[] = [];

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.form = this.fb.group({
      address: ['', Validators.required],
      price: ['', Validators.required],
      photo: ['', Validators.required],
      size: ['', Validators.required],
    })

    close()
    {
      this.modalClosed.emit();
    }
  }

}
