import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Router} from '@angular/router';
import {ClassicButtonComponent} from '../../../../shared/components/classic-button/classic-button.component';
import {MatCard, MatCardActions} from '@angular/material/card';
import {NgForOf} from '@angular/common';
import {Property} from '../../../property/models/property.entity';
import {Client} from '../../models/client.entity';

@Component({
  selector: 'app-client-list',
  imports: [
    ClassicButtonComponent,
    MatCard,
    MatCardActions,
    NgForOf
  ],
  templateUrl: './client-list.html',
  styleUrl: './client-list.css'
})
export class ClientList {
  @Input() clients: Array<Client> = [];
  @Output() editClient = new EventEmitter<Client>();
  constructor(private router: Router) { }
  onShowEditForm(client: Client){
    this.editClient.emit(client);
  }
}
