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
import {ResponseFormModal} from '../../components/response-form-modal/response-form-modal';
@Component({
  selector: 'app-simulator-page',
  imports: [
    SideBarComponent,
    HeaderBarComponent,
    CreditData,
    InputFormModal,
    ResponseFormModal
  ],
  templateUrl: './simulator-page.html',
  styleUrl: './simulator-page.css'
})
export class SimulatorPage implements OnInit {
  plazo!: number;
  simulationResult: any | null = null; // o SimulationResult | null
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
    const stored = localStorage.getItem('response');
    if (stored) {
      try {
        this.simulationResult = JSON.parse(stored);
        console.log('SimulationResult cargado desde localStorage (inicio):', this.simulationResult);
      } catch (e) {
        console.error('Error parseando SimulationResult de localStorage', e);
        this.simulationResult = null;
      }
    }
  }

  onSelectionChange(selection: { address: string | null; dni: string | null }) {
    const { address, dni } = selection;

    this.selectedProperty = this.properties.find(p => p.address === address) ?? null;
    //console.log(this.selectedProperty);

    this.selectedClient   = this.clients.find(c => c.dni === dni) ?? null;
    //console.log(this.selectedClient);
  }

  onPlazoChange(plazo: number) {
    this.plazo = plazo;
  }

  loadClientsAndProperties() {
    const user = this.authService.getUser();
    const userId = user.id;

    // Cargar Clientes
    this.clientService.getByUserId(userId).subscribe({
      next: (clients: Client[]) => {
        this.clients = clients;
        //console.log(this.clients);
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
        //console.log(this.properties)
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

        // 🔹 1) Guardar en la propiedad para data binding en tiempo real
        this.simulationResult = response;

        // 🔹 2) Opcional: seguir guardando en localStorage para persistencia
        localStorage.setItem('response', JSON.stringify(response));
      },
      error: (err) => {
        console.error('Error en simulación:', err);
      }
    });
  }

  onCleanSimulate() {
    this.simulationResult = null;

    // 2) borrar del localStorage
    localStorage.removeItem('response');

    console.log('Simulación limpiada');
  }

}
