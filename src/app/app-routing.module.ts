import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './services/auth-guard.service';
import { AuthNotGuardService } from './services/auth-not-guard.service';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
 {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule),
    canActivate:[AuthNotGuardService]
  },
  {
    path: 'signin',
    loadChildren: () => import('./pages/signin/signin.module').then( m => m.SigninPageModule),
    canActivate:[AuthNotGuardService]
  },
  {
    path: 'home',
    loadChildren: () => import('./app/home/home.module').then( m => m.HomePageModule),
    canActivate:[AuthGuardService]
  },
  {
    path: 'more',
    loadChildren: () => import('./app/more/more.module').then( m => m.MorePageModule),
    canActivate:[AuthGuardService]
  },
  {
    path: '**',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }