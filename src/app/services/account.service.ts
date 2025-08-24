import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, addDoc, updateDoc, deleteDoc, docData, query, where } from '@angular/fire/firestore';
import { Account } from '../models/account.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private firestore = inject(Firestore);
  private accountsCollection = collection(this.firestore, 'accounts');

  getAccountsByFamilyId(familyId: string): Observable<Account[]> {
    const q = query(this.accountsCollection, where('familyId', '==', familyId));
    return collectionData(q, { idField: 'id' }) as Observable<Account[]>;
  }

  getAccountById(id: string): Observable<Account | undefined> {
    const accountDoc = doc(this.firestore, `accounts/${id}`);
    return docData(accountDoc, { idField: 'id' }) as Observable<Account | undefined>;
  }

  getAccountsByOwnerId(ownerId: string): Observable<Account[]> {
    const q = query(this.accountsCollection, where('ownerId', '==', ownerId));
    return collectionData(q, { idField: 'id' }) as Observable<Account[]>;
  }

  getAccountsByEditorId(userId: string): Observable<Account[]> {
    const q = query(this.accountsCollection, where('editorIds', 'array-contains', userId));
    return collectionData(q, { idField: 'id' }) as Observable<Account[]>;
  }

  async createAccount(account: Account): Promise<void> {
    await addDoc(this.accountsCollection, account);
  }

  async updateAccount(id: string, data: Partial<Account>): Promise<void> {
    const accountDoc = doc(this.firestore, `accounts/${id}`);
    await updateDoc(accountDoc, data);
  }

  async deleteAccount(id: string): Promise<void> {
    const accountDoc = doc(this.firestore, `accounts/${id}`);
    await deleteDoc(accountDoc);
  }
}
