import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-input-form-modal',
  imports: [
    ReactiveFormsModule,
    NgForOf,
    NgIf
  ],
  templateUrl: './input-form-modal.html',
  styleUrl: './input-form-modal.css'
})
export class InputFormModal implements OnInit {
// Opciones que te pasa el padre
  @Input() viviendas: { address: string; }[] = [];
  @Input() clientes: { dni: string;}[] = [];

  // Emitimos cuando cambie algo
  @Output() selectionChange = new EventEmitter<{ address: string | null; dni: string | null }>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      address: [null, Validators.required],
      dni: [null, Validators.required]
    });

    this.form.valueChanges.subscribe(value => {
      this.selectionChange.emit(value);
    });
  }
}
