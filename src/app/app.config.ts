import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes), provideFirebaseApp(() => initializeApp({ projectId: "chronobuildmaster", appId: "1:271826533750:web:410e7beacfcf8ad6fc4e57", storageBucket: "chronobuildmaster.firebasestorage.app", apiKey: "AIzaSyC87QGYCQBNAn9V39XQf3r-SOFH0XFqsyU", authDomain: "chronobuildmaster.firebaseapp.com", messagingSenderId: "271826533750", measurementId: "G-PLF41B6D4Z" })), provideAuth(() => getAuth()), provideFirestore(() => getFirestore())
  ]
};
