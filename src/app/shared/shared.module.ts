import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { RouterModule } from '@angular/router';
import { ToastComponent } from './toast/toast.component';
import { LoaderComponent } from './loader/loader.component';

@NgModule({
  declarations: [HeaderComponent, FooterComponent, ToastComponent, LoaderComponent],
  imports: [CommonModule,RouterModule],
  exports: [HeaderComponent, FooterComponent, ToastComponent, LoaderComponent],
})
export class SharedModule {}
