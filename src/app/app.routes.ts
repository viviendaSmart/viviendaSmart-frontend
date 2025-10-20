import { Routes } from '@angular/router';
const HomePage =()=>import('./features/home/pages/home-page/home-page').then(m=>m.HomePage);
const UserPage = () => import("./features/user/pages/user-page/user-page").then(m=>m.UserPage);
const PropertyPage = () => import("./features/property/pages/property-page/property-page").then(m=>m.PropertyPage);
const SimulatorPage = () => import("./features/simulator/pages/simulator-page/simulator-page").then(m=>m.SimulatorPage);
const ConfigPage =() => import("./features/config/pages/config-page/config-page").then(m=>m.ConfigPage);
const ReportPage = () => import("./features/report/pages/report-page/report-page").then(m=>m.ReportPage);

import {LoginPage} from './features/IAM/pages/login-page/login-page';

export const routes: Routes = [
  {path: 'login', component: LoginPage},
  {path:'home',loadComponent:HomePage},
  {path:'user',loadComponent:UserPage},
  {path:'property',loadComponent:PropertyPage},
  {path:'simulator',loadComponent:SimulatorPage},
  {path:'config',loadComponent:ConfigPage},
  {path:'report',loadComponent:ReportPage},
  {path:'**',component:LoginPage},
];
