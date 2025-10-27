import { Component } from '@angular/core';
import { Login } from './login/login';
import { Register } from './register/register';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-auth-shell',
  standalone: true,
  imports: [Login, Register],
  template: `
    <app-login
      [isOpen]="showLogin"
      (isOpenChange)="showLogin = $event"
      (requestRegister)="openRegister()">
    </app-login>

    <app-register
      [isOpen]="showRegister"
      (isOpenChange)="showRegister = $event"
      (requestLogin)="openLogin()">
    </app-register>
  `
})
export class AuthShellComponent {
  showLogin = true;
  showRegister = false;

  constructor(private ar: ActivatedRoute) {
    this.ar.queryParamMap.subscribe(p => {
      const view = (p.get('view') || 'login').toLowerCase();
      if (view === 'register') this.openRegister();
      else this.openLogin();
    });
  }

  openRegister() { this.showLogin = false; this.showRegister = true; }
  openLogin()    { this.showRegister = false; this.showLogin = true; }
}
