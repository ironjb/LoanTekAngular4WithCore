import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

window.console && console.log('Running JIT compiled');
platformBrowserDynamic().bootstrapModule(AppModule);
