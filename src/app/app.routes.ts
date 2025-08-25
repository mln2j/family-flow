import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { noAuthGuard } from './guards/noAuth.guard';
import { LoginComponent } from './components/auth/login/login';
import { FamilyComponent } from './components/dashboard/family/family';
import {RegisterComponent} from './components/auth/register/register';
import {SetUpComponent} from './components/auth/setup/setup';
import {CreateFamilyComponent} from './components/dashboard/create-family/create-family';
import {FamilyDetailsComponent} from './components/dashboard/family-details/family-details';


export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [noAuthGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [noAuthGuard] },
  { path: 'family', component: FamilyComponent, canActivate: [authGuard] },
  { path: 'family/:id', component: FamilyDetailsComponent, canActivate: [authGuard] },
  { path: 'setup', component: SetUpComponent, canActivate: [authGuard] },
  { path: 'create-family', component: CreateFamilyComponent, canActivate: [authGuard] },
  { path: '', redirectTo: 'family', pathMatch: 'full' },
  { path: '**', redirectTo: 'family' }
];
