import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { SimulationRequest } from '../models/simulation-request';
import { BaseService } from '../../../shared/services/base.service';

@Injectable({
  providedIn: 'root'
})
export class SimulatorService extends BaseService<SimulationRequest> {

  constructor() {
    super();
    this.resourceEndpoint = `${this.serverBaseUrl}${environment.simulatorEndpointPath}`;
  }

  simulate(request: SimulationRequest): Observable<any> {
    return this.http.post<any>(this.resourceEndpoint, request);
  }
}
