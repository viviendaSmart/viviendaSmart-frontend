import { TranslateModule } from '@ngx-translate/core';
import { Component, Input } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/authentication.service';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-side-bar',
  imports: [
    TranslateModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent {

  constructor(
    private authService: AuthService,
    private router: Router,
    private themeService: ThemeService
  ) { }

  get isDarkMode(): boolean {
    return this.themeService.isDarkMode();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  options = [
    { class: 'SIDEBAR.HOME', link: '/home', src: '../assets/img/hogar.png' },
    { class: 'SIDEBAR.CLIENTS', link: '/client', src: '/assets/img/usuarios.png' },
    { class: 'SIDEBAR.PROPERTIES', link: '/property', src: '/assets/img/edificio.png' },
    { class: 'SIDEBAR.CONFIG', link: '/config', src: '/assets/img/ajustes.png' },
    { class: 'SIDEBAR.SIMULATOR', link: '/simulator', src: '/assets/img/computadora.png' },
    { class: 'SIDEBAR.LOGS', link: '/log', src: '/assets/img/estadisticas.png' },
  ]

  onLeave() {
    this.authService.removeToken();
    this.authService.removeUser();
    this.router.navigate(['/login']);
  }
}
