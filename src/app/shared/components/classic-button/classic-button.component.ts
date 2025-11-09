import {Component, Input, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-classic-button',
  imports: [],
  templateUrl: './classic-button.component.html',
  styleUrl: './classic-button.component.css',
  encapsulation: ViewEncapsulation.None

})
export class ClassicButtonComponent {
  @Input() disabled: boolean = false;
}
