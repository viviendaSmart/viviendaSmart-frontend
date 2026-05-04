import {Component, EventEmitter, OnInit, Output} from '@angular/core';
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
import {PropertyFormEditModal} from '../../components/property-form-edit-modal/property-form-edit-modal';

@Component({
  selector: 'app-property-page',
  imports: [
    SideBarComponent,
    HeaderBarComponent,
    PropertyList,
    PropertyFormModal,
    NgIf,
    PropertyFormEditModal
  ],
  templateUrl: './property-page.html',
  styleUrl: './property-page.css'
})
export class PropertyPage implements OnInit {
  showModal = false;
  showEditModal = false;
  properties: Property[] = [];
  selectedProperty: Property| null = null;

  constructor(private propertyService: PropertyService,
              private userService: UserService,
              private authService: AuthService,
              ) {}
  ngOnInit() {
    this.loadProperties();

  }
  loadProperties() {
    const user = this.authService.getUser();
    const ownerId = user.id;
    this.propertyService.getByOwnerId(ownerId).subscribe({
      next: (properties: Property[]) => {
        this.properties = properties;
        //console.log(this.properties)
      },
      error: (error) => {
        console.log('Error al obtener propiedades', error);
      }
    });

  }

  openModal() {
    this.showModal = true;
  }

  openEditModal(property: Property) {
    this.showEditModal = true;
    this.selectedProperty = property;

  }

  onFormSubmitted(formValue: any) {
    const user = this.authService.getUser();
    const newProperty: Property = {
      ...formValue,
      ownerId: user.id
    }
    this.propertyService.postProperty(newProperty).subscribe({
      next: () => {
        //console.log('Formulario enviado:', formValue);
        this.loadProperties();
        this.showModal = false;
      },
      error: (err) => console.error('Error al crear propiedad', err)
    });
  }

  onFormEdited(formValue: any) {
    if (!this.selectedProperty) return;

    const user = this.authService.getUser();

    const updatedProperty: Property = {
      ...this.selectedProperty,  // id, ownerId, etc.
      ...formValue,              // address, price, size, photo nuevos
      ownerId: user.id           // por si quieres asegurar el owner
    };

    this.propertyService.putProperty(updatedProperty).subscribe({
      next: () => {
        //console.log('✅ Propiedad actualizada:', updatedProperty);
        this.loadProperties();   // recarga la lista
        this.showEditModal = false;
        this.selectedProperty = null;
      },
      error: (err) => console.error('Error al actualizar propiedad', err)
    });
  }

  onDeleteProperty(property: Property) {
    if (!property.id) return;  // por si acaso

    this.propertyService.deleteProperty(property).subscribe({
      next: () => {
        //console.log('🗑️ Propiedad eliminada:', property);
        this.loadProperties();   // recarga la lista
        this.onModalClosed();    // cierra modal y limpia selectedProperty
      },
      error: (err) => console.error('Error al eliminar propiedad', err)
    });
  }
  onModalClosed() {
    this.showModal = false;
    this.showEditModal = false;
    this.selectedProperty = null;
  }

}
