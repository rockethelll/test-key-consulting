import 'zone.js';
import 'zone.js/testing';

import { getTestBed } from '@angular/core/testing';
import {
  BrowserTestingModule,
  platformBrowserTesting,
} from '@angular/platform-browser/testing';
import '@testing-library/jest-dom/vitest';

getTestBed().initTestEnvironment(
  BrowserTestingModule,
  platformBrowserTesting()
);
