import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {HeaderBarComponent} from '../../../../shared/components/header-bar/header-bar.component/header-bar.component';
import {SideBarComponent} from '../../../../shared/components/side-bar/side-bar.component';
import {Client} from '../../models/client.entity';
import {ClientService} from '../../services/client.service';
import {AuthService} from '../../../../shared/services/authentication.service';
import {ClientList} from '../../components/client-list/client-list';
import {Property} from '../../../property/models/property.entity';

@Component({
  selector: 'app-client-page',
  imports: [
    HeaderBarComponent,
    SideBarComponent,
    ClientList
  ],
  templateUrl: './client-page.html',
  styleUrl: './client-page.css'
})
export class ClientPage implements OnInit {
  clients: Client[] = [];
  @Output() editProperty = new EventEmitter<Property>();
  constructor(private clientService: ClientService,
              private authService: AuthService,
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

}
