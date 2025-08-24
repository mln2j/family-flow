import { Component, inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import {Router, RouterModule} from '@angular/router';
import { FormsModule } from "@angular/forms";
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-register',
    imports: [
      FormsModule,
      NgIf,
      RouterModule
    ],
  templateUrl: './register.html',
  styleUrl: './register.sass'
})

export class RegisterComponent {
  private auth = inject(Auth);
  private router = inject(Router);

  email = '';
  password = '';
  errorMessage = '';

  async register() {
    this.errorMessage = '';
    try {
      await createUserWithEmailAndPassword(this.auth, this.email, this.password);
      this.router.navigate(['/family']);
    } catch (error: any) {
      this.errorMessage = error.message || 'Došlo je do pogreške.';
    }
  }
}
