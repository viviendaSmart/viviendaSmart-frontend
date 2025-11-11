import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {HeaderBarComponent} from '../../../../shared/components/header-bar/header-bar.component/header-bar.component';
import {SideBarComponent} from '../../../../shared/components/side-bar/side-bar.component';
import {Client} from '../../models/client.entity';
import {ClientService} from '../../services/client.service';
import {AuthService} from '../../../../shared/services/authentication.service';
import {ClientList} from '../../components/client-list/client-list';
import {ClientFormModal} from '../../components/client-form-modal/client-form-modal';
import {NgIf} from '@angular/common';
import {UserService} from '../../../IAM/services/user.service';
import {ClientFormEditModal} from '../../components/client-form-edit-modal/client-form-edit-modal';
import {PropertyFormEditModal} from '../../../property/components/property-form-edit-modal/property-form-edit-modal';

@Component({
  selector: 'app-client-page',
  imports: [
    HeaderBarComponent,
    SideBarComponent,
    ClientList,
    ClientFormModal,
    NgIf,
    ClientFormEditModal,
    PropertyFormEditModal
  ],
  templateUrl: './client-page.html',
  styleUrl: './client-page.css'
})
export class ClientPage implements OnInit {
  showModal = false;
  showEditModal = false;
  clients: Client[] = [];
  selectedClient: Client | null = null;

  constructor(private clientService: ClientService,
              private authService: AuthService,
              private userService: UserService,
  ) { }

  ngOnInit() {
    this.loadClients();
  }
  loadClients() {
    const user = JSON.parse(localStorage.getItem('user')|| '{}');
    const userId = user.id;
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

  }

  openModal() {
    this.showModal = true;

  }

  openEditModal(client: Client) {
    this.showEditModal = true;
    this.selectedClient = client;
  }
  closeModal() {
    this.showModal = false;
    this.showEditModal = false;
  }

  onFormSubmitted(formValue: any) {
    const user = this.authService.getUser();
    const newClient: Client = {
      ...formValue,
      userId: user.id
    }

    this.clientService.postClient(newClient).subscribe({
      next: () => {
        console.log('Formulario enviado:', newClient);
        this.loadClients();
        this.showModal = false;
      },
      error: (err) =>{
        console.error('Error al crear cliente', err)
        console.log(newClient);
      }
    });

  }
  onFormEdited(formValue: any) {
    if (!this.selectedClient) return;

    const user = this.authService.getUser();

    const updatedClient: Client = {
      ...this.selectedClient,  // id, ownerId, etc.
      ...formValue,              // address, price, size, photo nuevos
      userId: user.id           // por si quieres asegurar el owner
    };

    this.clientService.putClient(updatedClient).subscribe({
      next: () => {
        console.log('✅ Cliente Actualizado:', updatedClient);
        this.loadClients();   // recarga la lista
        this.showEditModal = false;
        this.selectedClient = null;
      },
      error: (err) => console.error('Error al actualizar propiedad', err)
    });
  }

  onDeleteClient(client: Client) {
    if (!client.id) return;  // por si acaso

    this.clientService.deleteClient(client).subscribe({
      next: () => {
        console.log('🗑️ Cliente eliminado:', client);
        this.loadClients();   // recarga la lista
        this.closeModal();    // cierra modal y limpia selectedClient
      },
      error: (err) => console.error('Error al eliminar propiedad', err)
    });
  }

}
