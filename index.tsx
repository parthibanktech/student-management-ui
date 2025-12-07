
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';
import { AppComponent } from './src/app/app.component';
import { provideRouter, withHashLocation } from '@angular/router';

import { routes } from './src/app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    provideHttpClient(),
    provideRouter(routes, withHashLocation()),
  ],
}).catch(err => console.error(err));

// AI Studio always uses an `index.tsx` file for all project types.
