import {inject, Injectable} from '@angular/core';
import {BaseService} from '../../../shared/services/base.service';
import {Client} from '../models/client.entity';
import {AuthService} from '../../../shared/services/authentication.service';
import {environment} from '../../../../environments/environment';
import {Observable} from 'rxjs';

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
    return this.http.get<Client[]>(`${this.resourceEndpoint}?userId=${userId}`);
  }

}
