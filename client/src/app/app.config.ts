import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { InitService } from '../core/services/init-service';
import { lastValueFrom } from 'rxjs';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes, withViewTransitions()),
    provideHttpClient(),
    // Inizializzatore che blocca l'avvio dell'applicazione finchè non termina la chiamata init e mostra uno splash (loader) che verrà poi rimosso
    // Prima di avviare eseguo async () => ..
    provideAppInitializer(async () => {
      // Recupero il servizio init
      const initService = inject(InitService);
      // Ritorno una promise attendendo obbligatoriamente che questa promise si risolva prima del bootstrao dell'app
      return new Promise<void>((resolve) => {
        // Ritardo l'init di 500 ms
        setTimeout(async () => {
          try {
            // Chiamo init service e lo trasformo in una promise
            return lastValueFrom(initService.init());
          } finally {
            // Trovo elemento by id e lo rimuovo poi dico ad angular di rimuoverlo con resolve
            const splash = document.getElementById('initial-splash');
            if (splash) {
              splash.remove();
            }
            resolve()
          }
        }, 500)
      })
    })
  ]
};
