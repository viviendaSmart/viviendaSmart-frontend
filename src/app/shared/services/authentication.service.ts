import { Injectable } from '@angular/core';

const TOKEN_KEY = 'authToken';
const USER_KEY = 'authUser';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() {}

  public saveToken(token: string): void {
    sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  public removeToken(): void {
    sessionStorage.removeItem(TOKEN_KEY);
  }

  public saveUser(username: any): void {
    sessionStorage.setItem(USER_KEY, JSON.stringify(username));
  }

  public getUser(): any {
    const user = sessionStorage.getItem(USER_KEY);
    try {
      return user ? JSON.parse(user) : null;
    } catch (e) {
      console.error('❌ Error al parsear el usuario desde sessionStorage:', e);
      return null;
    }
  }

  public removeUser(): void {
    sessionStorage.removeItem(USER_KEY);
  }

  public logout(): void {
    this.removeToken();
    this.removeUser();
  }

  public isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
