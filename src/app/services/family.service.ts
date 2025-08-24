import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, collectionData, docData, addDoc, updateDoc, deleteDoc, query, where } from '@angular/fire/firestore';
import { Family } from '../models/family.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FamilyService {
  private firestore = inject(Firestore);
  private familiesCollection = collection(this.firestore, 'families');

  getFamilyById(id: string): Observable<Family> {
    const familyDoc = doc(this.firestore, `families/${id}`);
    return docData(familyDoc, { idField: 'id' }) as Observable<Family>;
  }

  getFamiliesByUserId(userId: string): Observable<Family[]> {
    const q = query(this.familiesCollection, where('members', 'array-contains', userId));
    return collectionData(q, { idField: 'id' }) as Observable<Family[]>;
  }

  getAllFamilies(): Observable<Family[]> {
    return collectionData(this.familiesCollection, { idField: 'id' }) as Observable<Family[]>;
  }

  async createFamily(family: Family): Promise<void> {
    await addDoc(this.familiesCollection, family);
  }

  async updateFamily(id: string, data: Partial<Family>): Promise<void> {
    const familyDoc = doc(this.firestore, `families/${id}`);
    await updateDoc(familyDoc, data);
  }

  async deleteFamily(id: string): Promise<void> {
    const familyDoc = doc(this.firestore, `families/${id}`);
    await deleteDoc(familyDoc);
  }
}
