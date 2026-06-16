import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ClassicButtonComponent} from '../../classic-button/classic-button.component';
import {TranslateService, TranslateModule} from '@ngx-translate/core';


@Component({
  selector: 'app-header-bar',
  imports: [
    ClassicButtonComponent,
    TranslateModule
  ],
  templateUrl: './header-bar.component.html',
  styleUrl: './header-bar.component.css'
})
export class HeaderBarComponent {
  @Input() params = { title: '',name: '', description: '', aux: false, aux2: false };
  @Output() openModal = new EventEmitter<void>();

  currentLang: string = 'es';

  constructor(public translate: TranslateService) {
    this.currentLang = localStorage.getItem('viviendaSmart_lang') || 'es';
  }

  onShowModal() {
    this.openModal.emit();
  }

  toggleLanguage() {
    this.currentLang = this.currentLang === 'es' ? 'en' : 'es';
    this.translate.use(this.currentLang);
    localStorage.setItem('viviendaSmart_lang', this.currentLang);
  }
}
