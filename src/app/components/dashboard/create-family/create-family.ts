import { Component, inject } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';
import {collection, Firestore, addDoc, serverTimestamp, doc, updateDoc, arrayUnion} from '@angular/fire/firestore';
import {Router} from '@angular/router';
import {Auth} from '@angular/fire/auth';

@Component({
  selector: 'app-create-family',
  imports: [
    FormsModule,
    NgIf
  ],
  templateUrl: './create-family.html',
  styleUrl: './create-family.sass'
})
export class CreateFamilyComponent {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);

  familyName = '';
  errorMessage = '';

  async createFamily() {
    this.errorMessage = '';
    try {
      const user = this.auth.currentUser!;

      const familiesRef = collection(this.firestore, 'families');
      const familyDocRef = await addDoc(familiesRef, {
        name: this.familyName,
        createdAt: serverTimestamp(),
        owner: user.uid,
        members: [user.uid],
        admins: [user.uid]
      });

      const userDocRef = doc(this.firestore, `users/${user.uid}`);
      await updateDoc(userDocRef, {
        familyIds: arrayUnion(familyDocRef.id)
      });

      this.router.navigate(['/family']);
    } catch (err: any) {
      this.errorMessage = err.message || 'Greška pri kreiranju obitelji.';
    }
  }

}
