import { Component, OnInit, inject } from '@angular/core';
import { FamilyService} from '../../../services/family.service';
import { Auth, authState } from '@angular/fire/auth';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Family as FamilyModel } from '../../../models/family.model';
import {AsyncPipe, NgFor, NgIf} from '@angular/common';

@Component({
  selector: 'app-family',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    NgFor
  ],
  templateUrl: './family.html',
  styleUrls: ['./family.sass'],
})
export class FamilyComponent implements OnInit {
  private familyService = inject(FamilyService);
  private auth = inject(Auth);

  families$: Observable<FamilyModel[]> = of([]);

  ngOnInit() {
    this.families$ = authState(this.auth).pipe(
      switchMap(user => {
        if (!user) return of([]);
        return this.familyService.getFamiliesByUserId(user.uid);
      })
    );
  }
}
