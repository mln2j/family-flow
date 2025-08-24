import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { inject } from '@angular/core';
import { Firestore, doc, updateDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-set-up',
  imports: [
    FormsModule,
    NgIf
  ],
  templateUrl: './set-up.html',
  styleUrl: './set-up.sass'
})
export class SetUpComponent {
  private firestore = inject(Firestore);
  private auth = inject(Auth);
  private router = inject(Router);

  displayName = '';
  errorMessage = '';

  async saveProfile() {
    this.errorMessage = '';
    const user = this.auth.currentUser;
    if (!user) {
      this.errorMessage = 'Niste prijavljeni.';
      return;
    }
    try {
      const userRef = doc(this.firestore, `users/${user.uid}`);
      await updateDoc(userRef, {
        displayName: this.displayName,
        setupComplete: true
      });
      this.router.navigate(['/family']);
    } catch (error: any) {
      this.errorMessage = error.message || 'Greška pri spremanju.';
    }
  }
}
