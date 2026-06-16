import { Component, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ViviendaSmart');

  constructor(private translate: TranslateService) {
    this.translate.addLangs(['es', 'en']);
    const savedLang = localStorage.getItem('viviendaSmart_lang') || 'es';
    this.translate.setDefaultLang('es');
    this.translate.use(savedLang);
  }
}
