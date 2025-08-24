import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Firestore, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-setup',
  imports: [
    FormsModule,
    NgIf
  ],
  templateUrl: './setup.html',
  styleUrl: './setup.sass'
})
export class SetUpComponent implements OnInit {
  private firestore = inject(Firestore);
  private auth = inject(Auth);
  private router = inject(Router);

  displayName = '';
  errorMessage = '';

  async ngOnInit() {
    const user = this.auth.currentUser;
    const userRef = doc(this.firestore, `users/${user!.uid}`);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const data = userSnap.data() as { setupComplete?: boolean };
      if (data.setupComplete) {
        this.router.navigate(['']);
      }
    }
  }

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
