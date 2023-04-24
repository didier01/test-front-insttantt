import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserModel } from '../../../core/models/user-model';
import { ToastService } from '../../../shared/toast/toast.service';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  registerForm!: FormGroup;
  loader: boolean = false
  todayDate : any= ''

  emailPattern: string = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  numberPattern = '^([0-9])*$';

  documentTypes: any = [
    { id: 'CC', name: 'CC (Cédula de ciudadanía)' },
    { id: 'CE', name: 'CE (Cédula de extranjeria)' },
    { id: 'TI', name: 'TI (Tarjeta de indentidad)' },
    { id: 'PA', name: 'PA (Pasaporte)' },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private toastService: ToastService,
    private authService: AuthService,
    private router : Router
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.setMaxDate()
  }

  setMaxDate(){
    let date = new Date()
    this.todayDate = this.returnFormatDate(date)
  }

  createForm() {
    this.registerForm = this.formBuilder.group({
      documentType: [, [Validators.required]],
      documentNumber: [, [Validators.required]],
      firstname: [, [Validators.required]],
      lastname: [, [Validators.required]],
      birthdate: [, [Validators.required]],
      expeditionDate: [, [Validators.required]],
      phoneNumber: [, [Validators.required]],
      email: [, [Validators.required, Validators.pattern(this.emailPattern)]],
    });
  }

  submitForm() {
    
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.registerForm.markAsDirty();
      this.toastService.showDangerToast('Faltan campos por completar');
      return;
    }
    this.loader = true
    let user: UserModel = { ...this.registerForm.value };
  
    this.authService.registerUser(user)
    .subscribe((res:any) => {
      this.loader = false
      this.router.navigateByUrl('dashboard');
      this.toastService.showSuccessToast('El usuario se registró correctamente');
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

  changeDocument(event: any) {
    let value = event.target.value;
    this.registerForm.get('documentType')!.setValue(value);
  }

  validateAdultAge() {
    let birthdate = this.registerForm.get('birthdate')!.value
    let now = new Date();
    let date = new Date(birthdate);
    let age = now.getFullYear() - date.getFullYear();
    let month = now.getMonth() - date.getMonth();
    if (month < 0 || (month === 0 && now.getDate() < date.getDate())) {
        age--;
    }
    // return age;
    console.log('age: ', age);

    if (age < 18) {
      this.registerForm.get('birthdate')!.setValue('')
      this.toastService.showDangerToast('Debes ser mayor de edad para poder registrarte');
    } 
  
  }


  validateFields(field: string, error: string) {
    return (
      this.registerForm.get(field)?.errors?.[error] &&
      this.registerForm.get(field)?.touched
    );
  }

  
  returnFormatDate(date:any) {
    return (
      date.getFullYear() +
      '-' +
      ('0' + (date.getMonth() + 1)).slice(-2) +
      '-' +
      ('0' + (date.getDate() )).slice(-2)
    );
  }


}
