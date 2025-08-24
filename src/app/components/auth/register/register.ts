import { Component, inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import {Router, RouterModule} from '@angular/router';
import { FormsModule } from '@angular/forms';
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
  private firestore = inject(Firestore);
  private router = inject(Router);

  email = '';
  password = '';
  errorMessage = '';

  async register() {
    this.errorMessage = '';
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, this.email, this.password);
      const user = userCredential.user;

      await setDoc(doc(this.firestore, `users/${user.uid}`), {
        email: user.email,
        displayName: null,
        familyIds: [],
        setupComplete: false,
        createdAt: new Date()
      });

      this.router.navigate(['/set-up']);
    } catch (error: any) {
      this.errorMessage = error.message || 'Došlo je do pogreške prilikom registracije.';
    }
  }
}
