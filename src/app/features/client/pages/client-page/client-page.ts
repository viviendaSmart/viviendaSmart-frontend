import {Component, OnInit} from '@angular/core';
import {HeaderBarComponent} from '../../../../shared/components/header-bar/header-bar.component/header-bar.component';
import {SideBarComponent} from '../../../../shared/components/side-bar/side-bar.component';
import {Client} from '../../models/client.entity';
import {ClientService} from '../../services/client.service';

@Component({
  selector: 'app-client-page',
  imports: [
    HeaderBarComponent,
    SideBarComponent
  ],
  templateUrl: './client-page.html',
  styleUrl: './client-page.css'
})
export class ClientPage implements OnInit {
  clients: Client[] = []  ;
  constructor(private clientService: ClientService
  ) { }
  ngOnInit() {
    this.loadClients();
  }
  loadClients() {
    const user = JSON.parse(localStorage.getItem('user')|| '{}');
    const userId = user.id;

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

}
