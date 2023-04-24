import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './views/admin-layout/admin-layout.component';
import { UserModule } from './pages/user/user.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuthModule } from './pages/auth/auth.module';
import { BasicLayoutComponent } from './views/basic-layout/basic-layout.component';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'auth',
    component: BasicLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./pages/auth/auth.module').then((m) => m.AuthModule),
      },
    ],
  },
  {
    path: 'user',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./pages/user/user.module').then((m) => m.UserModule),
      },
    ],
  },
  {
    path: 'dashboard',
    component: AdminLayoutComponent,
    // canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: DashboardComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
