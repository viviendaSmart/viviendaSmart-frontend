import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'viviendaSmart_theme';

  constructor() {
    this.initializeTheme();
  }

  private initializeTheme(): void {
    const savedTheme = localStorage.getItem(this.THEME_KEY);
    if (savedTheme === 'dark') {
      this.setDarkTheme();
    } else {
      this.setLightTheme();
    }
  }

  public isDarkMode(): boolean {
    return document.body.classList.contains('dark-theme');
  }

  public toggleTheme(): void {
    if (this.isDarkMode()) {
      this.setLightTheme();
    } else {
      this.setDarkTheme();
    }
  }

  private setLightTheme(): void {
    document.body.classList.remove('dark-theme');
    localStorage.setItem(this.THEME_KEY, 'light');
  }

  private setDarkTheme(): void {
    document.body.classList.add('dark-theme');
    localStorage.setItem(this.THEME_KEY, 'dark');
  }
}
