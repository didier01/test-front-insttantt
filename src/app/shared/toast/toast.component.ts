import { Component, OnInit } from '@angular/core';
import { ToastService } from './toast.service';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
  animations: [
    trigger('toastTrigger', [
      state('open', style({ transform: 'translateY(0%)' })),
      state('close', style({ transform: 'translateY(-200%)' })),
      transition('open <=> close', [animate('300ms ease-in-out')]),
    ]),
  ],
})
export class ToastComponent implements OnInit {
  toastClass!: string[];
  toastMessage!: string;
  toastIcon!: string;
  showsToast!: boolean;

  constructor(public toast: ToastService) {}

  ngOnInit(): void {}

  dismiss(): void {
    this.toast.dismissToast();
  }
}
