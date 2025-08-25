import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Family} from '../../../models/family.model';
import {ActivatedRoute} from '@angular/router';
import {arrayRemove, arrayUnion, doc, docData, Firestore, getDoc, updateDoc} from '@angular/fire/firestore';
import {Auth} from '@angular/fire/auth';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-family-details',
  imports: [
    AsyncPipe,
    NgIf,
    NgForOf,
    FormsModule
  ],
  templateUrl: './family-details.html',
  styleUrl: './family-details.sass'
})
export class FamilyDetailsComponent implements OnInit {
  familyId!: string;
  family$!: Observable<Family | undefined>;
  currentUserId!: string;
  joinRequestsData: { uid: string; displayName: string | null }[] = [];
  membersData: { uid: string; displayName: string | null }[] = [];
  canManageRequests = false;
  isEditingName = false;
  editableFamilyName = '';


  constructor(private route: ActivatedRoute, private firestore: Firestore, private auth: Auth) {}

  ngOnInit() {
    this.currentUserId = this.auth.currentUser!.uid;

    this.familyId = this.route.snapshot.paramMap.get('id')!;

    const familyDocRef = doc(this.firestore, `families/${this.familyId}`);
    this.family$ = docData(familyDocRef) as Observable<Family | undefined>;

    this.family$.subscribe(family => {
      if (family) {
        this.editableFamilyName = family.name;
        this.loadMembersDisplayNames(family.members);
        if (family.joinRequests && family.joinRequests.length > 0) {
          this.loadJoinRequestsDisplayNames(family.joinRequests);
        } else {
          this.joinRequestsData = [];
        }
        this.canManageRequests = (family.ownerId === this.currentUserId || family.admins.includes(this.currentUserId));
      }
    });
  }

  startEditingName() {
    this.isEditingName = true;
  }

  cancelEditingName() {
    this.isEditingName = false;
    this.family$.subscribe(family => {
      if (family) this.editableFamilyName = family.name;
    });
  }

  async saveFamilyName() {
    if (!this.editableFamilyName.trim()) return;

    await this.changeFamilyName(this.editableFamilyName);
    this.isEditingName = false;
  }

  async promoteToAdmin(userId: string, family: Family) {
    if (!this.canManageRequests) return;

    const isOwner = family.ownerId === this.currentUserId;
    if (!isOwner) {
      console.warn("Samo vlasnik može promovirati u admina");
      return;
    }

    const familyRef = doc(this.firestore, `families/${this.familyId}`);
    const userRef = doc(this.firestore, `users/${userId}`);

    await updateDoc(familyRef, {
      admins: arrayUnion(userId)
    });
    await updateDoc(userRef, {
      familyIds: arrayUnion(this.familyId)
    });
  }

  async removeMember(userId: string, family: Family) {
    if (!this.canManageRequests) return;

    const isOwner = family.ownerId === this.currentUserId;
    const isAdmin = family.admins.includes(this.currentUserId);
    const isUserOwner = family.ownerId === userId;
    const isUserAdmin = family.admins.includes(userId);

    if (isUserOwner) {
      console.warn('Vlasnika nije moguće izbaciti.');
      return;
    }

    if (isAdmin && isUserAdmin && !isOwner) {
      console.warn('Admin ne može izbaciti druge admine.');
      return;
    }

    if (!isOwner && !isAdmin) {
      console.warn('Samo vlasnik i admin mogu izbaciti članove.');
      return;
    }

    if (userId === this.currentUserId) {
      console.warn('Ne možeš izbaciti sebe.');
      return;
    }

    const familyRef = doc(this.firestore, `families/${this.familyId}`);
    const userRef = doc(this.firestore, `users/${userId}`);

    await updateDoc(familyRef, {
      members: arrayRemove(userId),
      admins: arrayRemove(userId),
    });

    await updateDoc(userRef, {
      familyIds: arrayRemove(this.familyId),
    });
  }

  async transferOwnership(newOwnerId: string, family: Family) {
    const isOwner = family.ownerId === this.currentUserId;
    if (!isOwner) {
      console.warn("Samo vlasnik može prenijeti vlasništvo.");
      return;
    }

    if (newOwnerId === this.currentUserId) {
      console.warn("Već si vlasnik obitelji.");
      return;
    }

    const familyRef = doc(this.firestore, `families/${this.familyId}`);

    await updateDoc(familyRef, {
      ownerId: newOwnerId,
      admins: arrayUnion(newOwnerId)
    });
  }

  async changeFamilyName(newName: string) {
    const familyRef = doc(this.firestore, `families/${this.familyId}`);
    await updateDoc(familyRef, {
      name: newName
    });
  }

  async loadJoinRequestsDisplayNames(joinRequests: string[]) {
    this.joinRequestsData = [];

    for (const uid of joinRequests) {
      const userDocRef = doc(this.firestore, `users/${uid}`);
      const userSnap = await getDoc(userDocRef);
      if (userSnap.exists()) {
        const data = userSnap.data() as { displayName?: string };
        this.joinRequestsData.push({
          uid,
          displayName: data.displayName || 'Nepoznato ime'
        });
      } else {
        this.joinRequestsData.push({
          uid,
          displayName: 'Nepoznato ime'
        });
      }
    }
  }


  async sendJoinRequest() {
    const familyDocRef = doc(this.firestore, `families/${this.familyId}`);

    try {
      await updateDoc(familyDocRef, {
        joinRequests: arrayUnion(this.currentUserId)
      });
    } catch (error) {
      console.error('Greška pri slanju zahtjeva', error);
    }
  }

  async acceptJoinRequest(userId: string) {
    const familyDocRef = doc(this.firestore, `families/${this.familyId}`);

    await updateDoc(familyDocRef, {
      members: arrayUnion(userId),
      joinRequests: arrayRemove(userId)
    });
  }

  async rejectJoinRequest(userId: string) {
    const familyDocRef = doc(this.firestore, `families/${this.familyId}`);

    await updateDoc(familyDocRef, {
      joinRequests: arrayRemove(userId)
    });
  }

  async loadMembersDisplayNames(members: string[]) {
    this.membersData = [];

    for (const uid of members) {
      const userDocRef = doc(this.firestore, `users/${uid}`);
      const userSnap = await getDoc(userDocRef);
      if (userSnap.exists()) {
        const data = userSnap.data() as { displayName?: string };
        this.membersData.push({
          uid,
          displayName: data.displayName || 'Nepoznato ime'
        });
      } else {
        this.membersData.push({
          uid,
          displayName: 'Nepoznato ime'
        });
      }
    }
  }
}
