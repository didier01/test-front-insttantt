import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '../../../shared/toast/toast.service';
import { AuthService } from '../../../core/services/auth.service';
import { UserModel } from '../../../core/models/user-model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm!: FormGroup;
  loader:boolean = false


  constructor(
    private formBuilder: FormBuilder, 
    private toastService: ToastService,
    private authService: AuthService,
    private router: Router
    ) {
    this.createForm();
  }

  ngOnInit(): void {}

  createForm() {
    this.loginForm = this.formBuilder.group({
      user: [, [Validators.required]],
      password: [, [Validators.required]],
    });
  }

  submitForm() {
    
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.loginForm.markAsDirty();
      this.toastService.showDangerToast('Faltan campos por completar');
      return;
    }
    this.loader = true
    let user: UserModel = { ...this.loginForm.value };
    
    this.authService.login(user)
    .subscribe((res:any) => {
      console.log('res: ', res);
      this.loader = false
      this.router.navigateByUrl('dashboard');
      this.toastService.showSuccessToast(`Bienvenido ${res.user.firstname}`);
    }, (err:any)=> {
      console.log('err: ', err);
      this.loader = false
      if (err.status == 400) {
        this.toastService.showDangerToast(err.error.msg);
        return
      }
      this.toastService.showDangerToast('Hubo un error intentalo nuevamente');
    });
  }

  validateFields(field: string, error: string) {
    return (
      this.loginForm.get(field)?.errors?.[error] &&
      this.loginForm.get(field)?.touched
    );
  }
}
