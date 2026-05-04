import {inject, Injectable} from '@angular/core';
import {BaseService} from '../../../shared/services/base.service';
import {Config} from '../models/config.entity';
import {AuthService} from '../../../shared/services/authentication.service';
import {environment} from '../../../../environments/environment';
import {Observable} from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ConfigService extends BaseService<Config>{
  public authService: AuthService = inject(AuthService);
  constructor() {
    super();
    this.resourceEndpoint = `${this.serverBaseUrl}${environment.configEndpointPath}`;
  }

  getByUserId(userId: string): Observable<Config> {
    return this.http.get<Config>(`${this.resourceEndpoint}/${userId}`);
  }

  postConfig(config: Config): Observable<Config> {
    return this.http.post<Config>(this.resourceEndpoint, config);
  }

  putConfig(config: Config): Observable<Config> {
    return this.http.put<Config>(`${this.resourceEndpoint}/${config.id}`, config);
  }

  deleteConfig(config: Config): Observable<Config> {
    return this.http.delete<Config>(`${this.resourceEndpoint}/${config.id}`);
  }


}
