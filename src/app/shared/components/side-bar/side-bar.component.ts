import {Component, Input} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';

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
  options = [
    { class: 'Inicio', link: '/home', src: '../assets/img/hogar.png' },
    { class: 'Clientes', link: '/client', src: '/assets/img/usuarios.png' },
    { class: 'Inmuebles', link: '/property', src: '/assets/img/edificio.png' },
    { class: 'Simulación', link: '/simulator', src: '/assets/img/computadora.png' },
    { class: 'Configuracion', link: '/config', src: '/assets/img/ajustes.png' },
    { class: 'Reportes', link: '/report', src: '../../assets/img/estadisticas.png' },
  ]
}
