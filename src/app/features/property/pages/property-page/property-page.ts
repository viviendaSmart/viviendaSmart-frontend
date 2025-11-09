import {Component, OnInit} from '@angular/core';
import {SideBarComponent} from '../../../../shared/components/side-bar/side-bar.component';
import {HeaderBarComponent} from '../../../../shared/components/header-bar/header-bar.component/header-bar.component';
import {Property} from '../../models/property.entity';
import {PropertyService} from '../../services/property.service';
import {UserService} from '../../../IAM/services/user.service';
import {PropertyList} from '../../components/property-list/property-list';
import {PropertyFormModal} from '../../components/property-form-modal/property-form-modal';
import {NgIf} from '@angular/common';
import {AuthService} from '../../../../shared/services/authentication.service';
import {ClassicButtonComponent} from '../../../../shared/components/classic-button/classic-button.component';

@Component({
  selector: 'app-property-page',
  imports: [
    SideBarComponent,
    HeaderBarComponent,
    PropertyList,
    PropertyFormModal,
    NgIf,
    ClassicButtonComponent
  ],
  templateUrl: './property-page.html',
  styleUrl: './property-page.css'
})
export class PropertyPage implements OnInit {
  showModal = true;
  properties: Property[] = [];

  constructor(private propertyService: PropertyService,
              private userService: UserService,
              private authService: AuthService,
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

  openModal() {
    this.showModal = true;
  }

  onFormSubmitted(formValue: any) {
    const user = this.authService.getUser();
    const newProperty: Property = {
      ...formValue,
      ownerId: user.id
    }

    this.propertyService.postProperty(newProperty).subscribe({
      next: () => {
        console.log('Formulario enviado:', formValue);
        this.loadProperties();
        this.showModal = false;
      },
      error: (err) => console.error('Error al crear propiedad', err)
    });
  }

  onModalClosed() {
    this.showModal = false;
  }

}
