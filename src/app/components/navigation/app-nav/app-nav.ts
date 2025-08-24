import { Component, inject } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { Router, RouterModule } from '@angular/router';
import {AsyncPipe, NgIf} from '@angular/common';

@Component({
  selector: 'app-nav',
  imports: [
    RouterModule,
    NgIf,
    AsyncPipe
  ],
  templateUrl: './app-nav.html',
  styleUrl: './app-nav.sass'
})
export class AppNavComponent {
  private auth = inject(Auth);
  private router = inject(Router);

  user$ = authState(this.auth);

  async logout() {
    await this.auth.signOut();
    this.router.navigate(['/login']);
  }
}
