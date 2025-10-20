import {Component, Input} from '@angular/core';


@Component({
  selector: 'app-header-bar',
  imports: [

  ],
  templateUrl: './header-bar.component.html',
  styleUrl: './header-bar.component.css'
})
export class HeaderBarComponent {
  @Input() params = { title: '',name: '', description: '', aux: false };
}
