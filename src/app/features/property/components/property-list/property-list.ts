import { Component } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-property-list',
  imports: [],
  templateUrl: './property-list.html',
  styleUrl: './property-list.css'
})
export class PropertyList {
  constructor(private router: Router) {}
  viewVehicle(id: number) {}

}
