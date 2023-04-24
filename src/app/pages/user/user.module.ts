import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { ProfileInfoComponent } from './profile-info/profile-info.component';
import { SettingsComponent } from './settings/settings.component';
import { AccountComponent } from './account/account.component';
import { SharedModule } from '../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

import { WebcamModule } from 'ngx-webcam';


@NgModule({
  declarations: [ProfileInfoComponent, SettingsComponent, AccountComponent],
  imports: [CommonModule, UserRoutingModule, ReactiveFormsModule, SharedModule, WebcamModule],
})
export class UserModule {}
