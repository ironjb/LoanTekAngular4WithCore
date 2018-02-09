import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { PrintReceiptModule } from './print-receipt/print-receipt.module';

window.console && console.log('Running JIT compiled');
platformBrowserDynamic().bootstrapModule(PrintReceiptModule);
