import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, query, where, doc, docData, updateDoc } from '@angular/fire/firestore';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private firestore = inject(Firestore);

  getUsersByFamilyId(familyId: string): Observable<User[]> {
    const usersCollection = collection(this.firestore, 'users');
    const q = query(usersCollection, where('familyIds', 'array-contains', familyId));
    return collectionData(q, { idField: 'id' }) as Observable<User[]>;
  }

  getUserById(id: string): Observable<User | undefined> {
    const userDoc = doc(this.firestore, `users/${id}`);
    return docData(userDoc, { idField: 'id' }) as Observable<User | undefined>;
  }

  async updateUser(id: string, data: Partial<User>): Promise<void> {
    const userDoc = doc(this.firestore, `users/${id}`);
    await updateDoc(userDoc, data);
  }

}
