import { Injectable, inject } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { BaseService } from '../../../shared/services/base.service';
import { User } from '../models/user.entity';
import { catchError, Observable, retry } from 'rxjs';
import { HttpClient, HttpHeaders, HttpContext } from '@angular/common/http';
import {AuthService} from '../../../shared/services/authentication.service';
import {SKIP_AUTH} from '../../../shared/infrastructure/auth-header';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService<User> {
  public authService: AuthService = inject(AuthService);

  constructor() {
    super();
    this.resourceEndpoint = environment.usersEndpointPath;
  }

  register(userPayload: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    requestedRole: string;
  }): Observable<any> {
    const url = `${this.serverBaseUrl}${environment.registerEndpointPath}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // 🔥 Limpia cualquier token antes de registrar
    this.authService.removeToken();

    console.log('🔧 Enviando registro a:', url);
    console.log('📦 Payload:', userPayload);

    return this.http.post(url, userPayload, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      responseType: 'text' as 'json',   // 👈 evita que intente parsear JSON
      observe: 'response'
    }).pipe(catchError(this.handleError));
  }

  login(credentials: { email: string; password: string; }) {
    const url = `${this.serverBaseUrl}${environment.loginEndpointPath}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<{ token: string; id: number; email: string }>(
      url,
      credentials,
      { headers, context: new HttpContext().set(SKIP_AUTH, true) } // 👈 idem
    ).pipe(catchError(this.handleError));
  }
}
