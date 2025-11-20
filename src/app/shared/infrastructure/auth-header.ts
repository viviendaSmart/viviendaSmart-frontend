import { HttpContextToken, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/authentication.service';

export const SKIP_AUTH = new HttpContextToken<boolean>(() => false);

export const AuthHeader: HttpInterceptorFn = (req, next) => {
  // si el contexto pide saltar auth, no añadimos Authorization
  //if (req.context.get(SKIP_AUTH)) return next(req);

  const authService = inject(AuthService);
  const token = authService.getToken();

  // fallback por si acaso
  // const isPublic = /\/users\/(signup|signin)(\/|$)/.test(req.url);
  // if (isPublic) return next(req);

  if (token) {
    const authReq = req.clone({
      headers: req.headers.set(`Authorization`, `Bearer ${token}`)
    });
    //console.log('✅ Token agregado:', authReq.headers.get('Authorization')); // Debug
    return next(authReq);
  }
  return next(req);
};
