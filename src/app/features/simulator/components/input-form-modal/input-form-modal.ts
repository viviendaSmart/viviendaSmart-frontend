import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-input-form-modal',
  imports: [
    ReactiveFormsModule,
    NgForOf
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
      address: [null],
      dni: [null]
    });

    this.form.valueChanges.subscribe(value => {
      this.selectionChange.emit(value);
    });
  }
}
