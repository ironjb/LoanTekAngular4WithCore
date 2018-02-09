import { enableProdMode } from '@angular/core';
import { platformBrowser } from '@angular/platform-browser';
import { PrintReceiptModuleNgFactory } from './tmp/aot/print-receipt/print-receipt.module.ngfactory';

enableProdMode();
window.console && console.log('Running AOT compiled');
platformBrowser().bootstrapModuleFactory(PrintReceiptModuleNgFactory);
