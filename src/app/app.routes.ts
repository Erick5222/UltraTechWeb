import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Services } from './features/services/services';
import { Portfolio } from './features/portfolio/portfolio';
import { Contact } from './features/contact/contact';
import { AiPlatform } from './features/ai-platform/ai-platform';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'services', component: Services },
  { path: 'portfolio', component: Portfolio },
  { path: 'about', redirectTo: 'contact', pathMatch: 'full' },
  { path: 'contact', component: Contact },
  { path: 'ai-platform', component: AiPlatform },
  { path: '**', redirectTo: '' },
];
