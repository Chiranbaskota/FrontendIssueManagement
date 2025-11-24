import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const credentials = authService.getCredentials();

  if (credentials && !req.url.includes('/auth/')) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Basic ${credentials}`
      }
    });
    return next(clonedRequest);
  }

  return next(req);
};
