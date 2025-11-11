import {inject, Injectable} from '@angular/core';
import {BaseService} from '../../../shared/services/base.service';
import {Client} from '../models/client.entity';
import {AuthService} from '../../../shared/services/authentication.service';
import {environment} from '../../../../environments/environment';
import {Observable} from 'rxjs';
import {Property} from '../../property/models/property.entity';

@Injectable({
  providedIn: 'root',
})

export class ClientService extends BaseService<Client>{
  public authService: AuthService = inject(AuthService);

  constructor() {
    super();
    this.resourceEndpoint= `${this.serverBaseUrl}${environment.clientEndpointPath}`;
  }

  getByUserId(userId: string): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.resourceEndpoint}/by-user-id?userId=${userId}`);
  }

  postClient(client: Client): Observable<Client> {
    return this.http.post<Client>(this.resourceEndpoint, client);
  }

  putClient(client: Client): Observable<Client> {
    return this.http.put<Client>(`${this.resourceEndpoint}/${client.id}`, client);
  }

  deleteClient(client: Client): Observable<Client> {
    return this.http.delete<Client>(`${this.resourceEndpoint}/${client.id}`);
  }

}
