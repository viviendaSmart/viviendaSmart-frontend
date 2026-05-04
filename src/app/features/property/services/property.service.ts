import {inject, Injectable} from '@angular/core';
import {BaseService} from '../../../shared/services/base.service';
import {Property} from '../models/property.entity';
import { AuthService } from '../../../shared/services/authentication.service';
import {environment} from '../../../../environments/environment';
import {Observable} from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class PropertyService extends BaseService<Property> {
  public authService: AuthService = inject(AuthService);

  constructor() {
    super();
    this.resourceEndpoint = `${this.serverBaseUrl}${environment.propertyEndpointPath}`;
  }

  getByOwnerId(ownerId: number): Observable<Property[]> {
    return this.http.get<Property[]>(`${this.resourceEndpoint}?ownerId=${ownerId}`);
  }

  postProperty(property: Property): Observable<Property> {
    return this.http.post<Property>(this.resourceEndpoint, property);
  }

  putProperty(property: Property): Observable<Property> {
    return this.http.put<Property>(`${this.resourceEndpoint}/${property.id}`, property);
  }

  deleteProperty(property: Property): Observable<Property> {
    return this.http.delete<Property>(`${this.resourceEndpoint}/${property.id}`);
  }

}
