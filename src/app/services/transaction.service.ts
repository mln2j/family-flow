import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, doc, updateDoc, deleteDoc, query, where, orderBy } from '@angular/fire/firestore';
import { Transaction } from '../models/transaction.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private firestore = inject(Firestore);
  private transactionsCollection = collection(this.firestore, 'transactions');

  getTransactionsByAccountId(accountId: string): Observable<Transaction[]> {
    const q = query(this.transactionsCollection, where('accountId', '==', accountId), orderBy('date', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<Transaction[]>;
  }

  async addTransaction(transaction: Transaction): Promise<void> {
    await addDoc(this.transactionsCollection, transaction);
  }

  async updateTransaction(id: string, data: Partial<Transaction>): Promise<void> {
    const transactionDoc = doc(this.firestore, `transactions/${id}`);
    await updateDoc(transactionDoc, data);
  }

  async deleteTransaction(id: string): Promise<void> {
    const transactionDoc = doc(this.firestore, `transactions/${id}`);
    await deleteDoc(transactionDoc);
  }
}
