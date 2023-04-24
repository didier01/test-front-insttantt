import { Component, OnInit, OnDestroy, HostListener  } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'insttantt-test';

  ngOnInit(): void {}

  // @HostListener('window:beforeunload')
  async ngOnDestroy()
  {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('expire');
    sessionStorage.removeItem('userLogged');
  }
}
