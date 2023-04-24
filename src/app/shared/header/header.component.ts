import { Component, ViewChild, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isAuth:boolean
  @ViewChild('navlinks') class: any;

  constructor(
    private authService: AuthService,
  ) {
    this.isAuth = this.authService.isAuthenticated()    
  }

  ngOnInit(): void {}

  logout() {
    this.authService.logout()
  }

  toggle() {
    let toggle = document.querySelector('.toggle')!;
    if (toggle) {
      toggle.classList.toggle('active')
    } 

    if (this.class.nativeElement.classList.length > 1) {
      this.class.nativeElement.classList.remove("active-menu")
    } else {
      this.class.nativeElement.classList.add("active-menu")
    }
  }
}
