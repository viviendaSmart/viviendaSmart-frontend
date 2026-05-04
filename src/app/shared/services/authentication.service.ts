import { Injectable } from '@angular/core';

const TOKEN_KEY = 'authToken';
const USER_KEY = 'authUser';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() {}

  public saveToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  public removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  }

  public saveUser(username: any): void {
    localStorage.setItem(USER_KEY, JSON.stringify(username));
  }

  public getUser(): any {
    const user = localStorage.getItem(USER_KEY);
    try {
      return user ? JSON.parse(user) : null;
    } catch (e) {
      console.error('❌ Error al parsear el usuario desde localStorage:', e);
      return null;
    }
  }

  public removeUser(): void {
    localStorage.removeItem(USER_KEY);
  }

  public logout(): void {
    this.removeToken();
    this.removeUser();
  }

  public isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
