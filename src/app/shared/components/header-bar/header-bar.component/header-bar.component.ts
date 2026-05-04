import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ClassicButtonComponent} from '../../classic-button/classic-button.component';


@Component({
  selector: 'app-header-bar',
  imports: [
    ClassicButtonComponent

  ],
  templateUrl: './header-bar.component.html',
  styleUrl: './header-bar.component.css'
})
export class HeaderBarComponent {
  @Input() params = { title: '',name: '', description: '', aux: false, aux2: false };
  @Output() openModal = new EventEmitter<void>();
  onShowModal() {
    this.openModal.emit();
  }
}
