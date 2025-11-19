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
import {SimulationRequest} from '../../models/simulation-request';
import {SimulatorService} from '../../services/simulator.service';
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
  plazo!: number;

  selectedProperty: Property | null = null;
  selectedClient: Client | null = null;
  constructor(private authService: AuthService,
              private propertyService: PropertyService,
              private clientService: ClientService,
              private simulatorService: SimulatorService) { }
  properties: Property[] = [];
  clients: Client[] = [];

  ngOnInit() {
    this.loadClientsAndProperties()
  }

  onSelectionChange(selection: { address: string | null; dni: string | null }) {
    const { address, dni } = selection;

    this.selectedProperty = this.properties.find(p => p.address === address) ?? null;
    console.log(this.selectedProperty);
    this.selectedClient   = this.clients.find(c => c.dni === dni) ?? null;
    console.log(this.selectedClient);
  }

  onPlazoChange(plazo: number) {
    this.plazo = plazo;
    console.log('Plazo recibido desde CreditData:', this.plazo);
  }

  loadClientsAndProperties() {
    const user = JSON.parse(localStorage.getItem('user')|| '{}');
    const userId = user.id;

    // Cargar Clientes
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

  onSimulate(request: SimulationRequest) {
    console.log('SimulationRequest que llega del hijo:', request);

    this.simulatorService.simulate(request).subscribe({
      next: (response) => {
        console.log('Resultado simulación:', response);
        // aquí luego guardas en una variable y lo muestras en pantalla
      },
      error: (err) => {
        console.error('Error en simulación:', err);
      }
    });
  }

}
