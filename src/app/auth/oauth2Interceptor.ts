import { HttpInterceptorFn } from "@angular/common/http";

export const oauth2Interceptor: HttpInterceptorFn = (req, next) => {
  // Cambia el nombre del token según donde lo guardes
 const token = localStorage.getItem('oauth2_access_token');
  // Lista de URLs que no requieren el token, por ejemplo login, refresh, etc.
  const excludedUrls = ['/api/auth/login', '/api/auth/refresh'];
  const isExcluded = excludedUrls.some(url => req.url.includes(url));

  if (isExcluded) {
    // No agregues Authorization si la URL está excluida
    return next(req.clone({ withCredentials: true }));
  }

  let modifiedReq = req.clone({ withCredentials: true });

  if (token) {
    modifiedReq = modifiedReq.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(modifiedReq);
};