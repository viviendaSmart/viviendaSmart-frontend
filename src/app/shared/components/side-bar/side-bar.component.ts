import {Component, Input} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {AuthService} from '../../services/authentication.service';

@Component({
  selector: 'app-side-bar',
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent {

  constructor(private authService: AuthService, private router: Router) {

  }

  options = [
    { class: 'Inicio', link: '/home', src: '../assets/img/hogar.png' },
    { class: 'Clientes', link: '/client', src: '/assets/img/usuarios.png' },
    { class: 'Inmuebles', link: '/property', src: '/assets/img/edificio.png' },
    { class: 'Configuracion', link: '/config', src: '/assets/img/ajustes.png' },
    { class: 'Simulación', link: '/simulator', src: '/assets/img/computadora.png' },
    //{ class: 'Reportes', link: '/report', src: '../../assets/img/estadisticas.png' },
  ]

  onLeave(){
    this.authService.removeToken();
    this.authService.removeUser();
    this.router.navigate(['/login']);
  }
}
