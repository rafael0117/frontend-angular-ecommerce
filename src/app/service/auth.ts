import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Registrar } from '../interface/registrar';
import { TokenPairResponse } from '../interface/token-pair-response';
import { Login } from '../interface/login';
import { environment } from '../../enviroments/environment';

// ==== Constantes a nivel de módulo ====
const API_URL = `${environment.apiBaseUrl}/api/auth`;;

// Usa sessionStorage (recomendado para access token)
const SS = sessionStorage;
// Si prefieres localStorage: const SS = localStorage;

const ACCESS = 'auth_access';
const REFRESH = 'auth_refresh';
const USERNAME = 'auth_username';
const ROLES = 'auth_roles';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // ---- Estado reactivo de autenticación ----
  private _isLoggedIn$ = new BehaviorSubject<boolean>(this.isAuthenticated());
  public  isLoggedIn$  = this._isLoggedIn$.asObservable();

  constructor(private http: HttpClient) {}

  // ========= Helpers de storage =========
  private setTokens(access: string, refresh: string) {
    SS.setItem(ACCESS, access);
    SS.setItem(REFRESH, refresh);
  }
  private setProfile(username: string, roles: string[]) {
    SS.setItem(USERNAME, username);
    SS.setItem(ROLES, JSON.stringify(roles || []));
  }
  private clearStorage() {
    SS.removeItem(ACCESS);
    SS.removeItem(REFRESH);
    SS.removeItem(USERNAME);
    SS.removeItem(ROLES);
  }
  private emitAuthState() {
    this._isLoggedIn$.next(this.isAuthenticated());
  }

  get accessToken(): string | null { return SS.getItem(ACCESS); }
  get refreshToken(): string | null { return SS.getItem(REFRESH); }
  get username(): string | null { return SS.getItem(USERNAME); }
  get roles(): string[] {
    const raw = SS.getItem(ROLES);
    return raw ? JSON.parse(raw) : [];
  }
  get displayUsername(): string { return this.username ?? ''; }

  // ========= Utilidades públicas =========
  isAuthenticated(offsetSeconds = 10): boolean {
    const token = this.accessToken;
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload?.exp as number | undefined;
      if (!exp) return true; // si no hay exp, lo consideramos válido
      const now = Math.floor(Date.now() / 1000);
      return now < (exp - offsetSeconds);
    } catch {
      return false;
    }
  }

  hasAnyRole(required: string[]): boolean {
    const r = this.roles;
    return required.some(x => r.includes(x));
  }

  getAuthHeader(): HttpHeaders {
    const at = this.accessToken;
    return at ? new HttpHeaders({ Authorization: `Bearer ${at}` }) : new HttpHeaders();
  }

  // ========= Endpoints del AuthController =========

  /** POST /api/auth/login */
  login(credentials: Login): Observable<TokenPairResponse> {
    return this.http.post<TokenPairResponse>(`${API_URL}/login`, credentials).pipe(
      tap(res => {
        this.setTokens(res.accessToken, res.refreshToken);
        this.setProfile(res.username, res.roles || []);
        this.emitAuthState();
      })
    );
  }

  /** POST /api/auth/register */
  register(request: Registrar): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${API_URL}/register`, request);
  }

  /**
   * POST /api/auth/refresh
   * Envía Authorization: Bearer <refreshToken> y actualiza tokens/perfil.
   */
  refresh(): Observable<TokenPairResponse> {
    const refresh = this.refreshToken;
    if (!refresh) throw new Error('No hay refresh token almacenado');

    const headers = new HttpHeaders({ Authorization: `Bearer ${refresh}` });
    return this.http.post<TokenPairResponse>(`${API_URL}/refresh`, {}, { headers }).pipe(
      tap(res => {
        this.setTokens(res.accessToken, res.refreshToken);
        if (res.username) this.setProfile(res.username, res.roles || this.roles);
        this.emitAuthState();
      })
    );
  }

  /**
   * POST /api/auth/logout?username=...
   * Invalida refresh tokens del usuario y limpia cliente.
   */
  logoutAllServerSide(): Observable<{ message: string }> {
    const user = this.username;
    if (!user) {
      this.logoutClientSide();
      return new Observable<{ message: string }>(sub => {
        sub.next({ message: 'Sesión local cerrada' });
        sub.complete();
      });
    }
    return this.http.post<{ message: string }>(`${API_URL}/logout?username=${encodeURIComponent(user)}`, {}).pipe(
      tap(() => this.logoutClientSide())
    );
  }

  /** Limpia únicamente el lado cliente (tokens, perfil). */
  logoutClientSide(): void {
    this.clearStorage();
    this.emitAuthState();
  }
}
