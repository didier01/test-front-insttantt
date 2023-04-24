import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './account/account.component';
import { ProfileInfoComponent } from './profile-info/profile-info.component';

const routes: Routes = [
  { path: '', redirectTo: 'profile', pathMatch: 'full' },

  {
    path: '',
    children: [
      {
        path: 'account',
        component: AccountComponent,
      },
      {
        path: 'profile',
        component: ProfileInfoComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
