import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './views/admin-layout/admin-layout.component';
import { BasicLayoutComponent } from './views/basic-layout/basic-layout.component';
import { SharedModule } from './shared/shared.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { WebcamModule } from 'ngx-webcam';


@NgModule({
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    BasicLayoutComponent,
    DashboardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    WebcamModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
