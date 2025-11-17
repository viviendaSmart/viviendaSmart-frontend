import { Component, OnInit } from '@angular/core';
import {SideBarComponent} from '../../../../shared/components/side-bar/side-bar.component'
import {HeaderBarComponent} from '../../../../shared/components/header-bar/header-bar.component/header-bar.component';
import {CreditData} from '../../components/credit-data/credit-data';
import {AuthService} from '../../../../shared/services/authentication.service';
import {InputFormModal} from '../../components/input-form-modal/input-form-modal';
import {Property} from '../../../property/models/property.entity';
import {PropertyService} from '../../../property/services/property.service';
import {ClientService} from '../../../client/services/client.service';
import {Client} from '../../../client/models/client.entity';
@Component({
  selector: 'app-simulator-page',
  imports: [
    SideBarComponent,
    HeaderBarComponent,
    CreditData,
    InputFormModal
  ],
  templateUrl: './simulator-page.html',
  styleUrl: './simulator-page.css'
})
export class SimulatorPage implements OnInit {

  constructor(private authService: AuthService,
              private propertyService: PropertyService,
              private clientService: ClientService,) { }
  properties: Property[] = [];
  clients: Client[] = [];
  ngOnInit() {
    this.loadClientsAndProperties()
  }


  loadClientsAndProperties() {
    const user = JSON.parse(localStorage.getItem('user')|| '{}');
    const userId = user.id;
    // Cargar Clientes
    console.log(userId);
    this.clientService.getByUserId(userId).subscribe({
      next: (clients: Client[]) => {
        this.clients = clients;
        console.log(this.clients);
      },
      error: (error) => {
        console.log("Error al cargar clientes",error);
      }
    })

    // Cargar Propiedades
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
