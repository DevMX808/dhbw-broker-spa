import { Routes } from '@angular/router';
import { SettingsPageComponent } from './containers/settings-page.component';

export const SETTINGS_ROUTES: Routes = [
  { path: '', component: SettingsPageComponent, title: 'Settings' }
];
