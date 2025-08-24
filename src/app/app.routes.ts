import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './components/auth/login/login';
import { FamilyComponent } from './components/dashboard/family/family';
import {RegisterComponent} from './components/auth/register/register';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'family', component: FamilyComponent, canActivate: [authGuard] },
  { path: '', redirectTo: 'family', pathMatch: 'full' },
  { path: '**', redirectTo: 'family' }
];
