import {Component, OnInit} from '@angular/core';
import {SideBarComponent} from '../../../../shared/components/side-bar/side-bar.component';
import {HeaderBarComponent} from '../../../../shared/components/header-bar/header-bar.component/header-bar.component';
import {Property} from '../../models/property.entity';
import {PropertyService} from '../../services/property.service';
import {UserService} from '../../../IAM/services/user.service';

@Component({
  selector: 'app-property-page',
  imports: [
    SideBarComponent,
    HeaderBarComponent
  ],
  templateUrl: './property-page.html',
  styleUrl: './property-page.css'
})
export class PropertyPage implements OnInit {
  showModal = false;
  properties: Property[] = [];

  constructor(private propertyService: PropertyService,
              private userService: UserService,
              ) {}
  ngOnInit() {
    this.loadProperties();

  }
  loadProperties() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const ownerId = user.id;

    this.propertyService.getByOwnerId(ownerId).subscribe({
      next: (properties: Property[]) => {
        this.properties = properties;
        console.log(this.properties)
      },
      error: (error) => {
        console.log('Error al obtener propiedades', error);
      }
    });

  }

}
