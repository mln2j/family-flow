import {Component, inject} from '@angular/core';
import {Auth, signInWithEmailAndPassword} from '@angular/fire/auth';
import {Router, RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    RouterModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.sass']
})
export class LoginComponent {
  private auth = inject(Auth);
  private router = inject(Router);

  email = '';
  password = '';
  errorMessage = '';

  async login() {
    this.errorMessage = '';
    try {
      await signInWithEmailAndPassword(this.auth, this.email, this.password);
      this.router.navigate(['/family']);
    } catch (error: any) {
      this.errorMessage = error.message ?? 'Došlo je do pogreške prilikom prijave.';
    }
  }
}
