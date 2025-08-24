import { Component, inject } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Router , RouterModule} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

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
  private firestore = inject(Firestore);
  private auth = inject(Auth);
  private router = inject(Router);

  email = '';
  password = '';
  errorMessage = '';

  async login() {
    this.errorMessage = '';
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, this.email, this.password);
      const user = userCredential.user;

      const userDocRef = doc(this.firestore, `users/${user.uid}`);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data() as { setupComplete?: boolean };

        if (userData.setupComplete) {
          this.router.navigate(['']);
        } else {
          this.router.navigate(['/set-up']);
        }
      } else {
        this.router.navigate(['/set-up']);
      }

    } catch (error: any) {
      this.errorMessage = error.message || 'Došlo je do pogreške prilikom prijave.';
    }
  }
}
