import { bootstrapApplication } from '@angular/platform-browser';
import { provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import config from 'devextreme/core/config';
import { AppComponent } from './app/app.component';
import { licenseKey } from './devextreme-license';

config({ licenseKey });

bootstrapApplication(AppComponent, {
  providers: [provideZoneChangeDetection(), provideHttpClient()],
}).catch((err) => console.error(err));
