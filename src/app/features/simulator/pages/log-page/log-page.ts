import { TranslateModule } from '@ngx-translate/core';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideBarComponent } from '../../../../shared/components/side-bar/side-bar.component';
import { HeaderBarComponent } from '../../../../shared/components/header-bar/header-bar.component/header-bar.component';
import { SimulatorService } from '../../services/simulator.service';
import { AuthService } from '../../../../shared/services/authentication.service';
import { SimulationLogItemComponent } from '../../components/simulation-log-item/simulation-log-item.component';
import { ClientService } from '../../../client/services/client.service';
import { PropertyService } from '../../../property/services/property.service';

@Component({
  selector: 'app-log-page',
  standalone: true,
  imports: [
    TranslateModule,CommonModule, SideBarComponent, HeaderBarComponent, SimulationLogItemComponent],
  templateUrl: './log-page.html',
  styleUrl: './log-page.css'
})
export class LogPage implements OnInit {
  simulations: any[] = [];
  clients: any[] = [];
  properties: any[] = [];

  constructor(
    private simulatorService: SimulatorService,
    private authService: AuthService,
    private clientService: ClientService,
    private propertyService: PropertyService
  ) {}

  ngOnInit() {
    const user = this.authService.getUser();
    if (user && user.id) {
      this.clientService.getByUserId(user.id).subscribe({
        next: (clients) => {
          this.clients = clients;
          this.loadProperties(user.id);
        },
        error: (err) => console.error('Error al cargar clientes', err)
      });
    }
  }

  loadProperties(userId: number) {
    this.propertyService.getByOwnerId(userId).subscribe({
      next: (properties) => {
        this.properties = properties;
        this.loadSimulations(userId);
      },
      error: (err) => console.error('Error al cargar propiedades', err)
    });
  }

  loadSimulations(userId: number) {
    this.simulatorService.getByParm('userId', userId).subscribe({
      next: (sims: any[]) => {
        this.simulations = sims.map(sim => {
          const client = this.clients.find(c => c.id === sim.clientId);
          const property = this.properties.find(p => p.id === sim.propertyId);
          return {
            ...sim,
            clientDni: client ? client.dni : 'N/A',
            propertyAddress: property ? property.address : 'N/A'
          };
        });
        
        // Ordenar por fecha descendente
        this.simulations.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0).getTime();
          const dateB = new Date(b.createdAt || 0).getTime();
          return dateB - dateA; // Descending
        });
      },
      error: (err) => console.error('Error al cargar simulaciones', err)
    });
  }
}
