import { provideZoneChangeDetection } from "@angular/core";
/* eslint-disable no-console */
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

platformBrowserDynamic().bootstrapModule(AppModule, { applicationProviders: [provideZoneChangeDetection()], })
  // @ts-expect-warning: `console.error` is used here intentionally for simple error logging during bootstrap
  .catch((err) => console.error(err));
