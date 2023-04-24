import { Component, OnInit,  EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';


import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { ToastService } from '../../../shared/toast/toast.service';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { FreeApiService } from '../../../core/services/free-api.service';
import { UserModel } from '../../../core/models/user-model';

@Component({
  selector: 'app-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.scss']
})
export class ProfileInfoComponent implements OnInit {
  
  loader:boolean = false
  isAuth:boolean = false

  userForm!: FormGroup;
  countries: any = []
  cities: any = []


  currentImage: any = '';
  currentUser: any = {};

  todayDate : any= ''

  emailPattern: string = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  numberPattern = '^([0-9])*$';

  documentTypes: any = [
    { id: 'CC', name: 'CC (Cédula de ciudadanía)' },
    { id: 'CE', name: 'CE (Cédula de extranjeria)' },
    { id: 'TI', name: 'TI (Tarjeta de indentidad)' },
    { id: 'PA', name: 'PA (Pasaporte)' },
  ];

  @Output() getPicture = new EventEmitter<WebcamImage>();
  showWebcam = true;
  disableCam = true;
  errors: WebcamInitError[] = [];
  
  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();

  allowButtons: boolean = true;


  constructor(
    private formBuilder: FormBuilder, 
    private toastService: ToastService,
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private freeApi: FreeApiService
    ) {
    this.createForm();
    this.isAuth = this.authService.isAuthenticated()    
    this.getUserStorage()
  }

  ngOnInit(): void {
    this.getCountries()
    this.setMaxDate()
    this.getUserById()
  }

  getUserStorage(){
    if (sessionStorage.getItem('userLogged')) {
      this.currentUser = JSON.parse(sessionStorage.getItem('userLogged')!);      
    }
  }

  setMaxDate(){
    let date = new Date()
    this.todayDate = this.returnFormatDate(date)
  }

  createForm() {
    this.userForm = this.formBuilder.group({
      documentType: [, [Validators.required]],
      documentNumber: [, [Validators.required]],
      firstname: [, [Validators.required]],
      lastname: [, [Validators.required]],
      birthdate: [, [Validators.required]],
      expeditionDate: [, [Validators.required]],
      phoneNumber: [, [Validators.required]],
      email: [, [Validators.required, Validators.pattern(this.emailPattern)]],
      country: [,[Validators.required]],
      city: [,[Validators.required]],
      address: [,[Validators.required]],
      photoProfile: [],
    });
  } 

  patchForm(data:any){
   

    this.currentImage = data.photoProfile ? data.photoProfile :''
    this.userForm.patchValue({
      id: data._id ? data._id : '',     
      ...data
    })
    let birthdate = data.birthdate ? data.birthdate.split('T')[0] : '';
    let expeditionDate = data.expeditionDate ?  data.expeditionDate.split('T')[0] : ''
    
    this.userForm.get('birthdate')!.setValue(birthdate);
    this.userForm.get('expeditionDate')!.setValue(expeditionDate);

    let country =  this.countries.find((item:any) => item.country == data.country)
    this.cities = country.cities
  }

  getCountries(){
    this.loader = true
    this.freeApi.getCountries()
      .subscribe((res:any) => {
        this.countries = res.data
        this.loader = false
    });
  }
  getUserById(){
    this.loader = true
    this.userService.getUserById(this.currentUser._id)
      .subscribe((res:any) => {
        this.currentUser = res.user        
        this.patchForm(this.currentUser)
        this.loader = false
    },(err:any) => {
      this.loader = false
      if (err.status == 400) {
        this.toastService.showDangerToast(err.error.msg);
        return
      }
      this.toastService.showDangerToast('Hubo un error intentalo nuevamente');
    })
  }


  submitForm() {
    if (!this.isAuth) {
      this.toastService.showDangerToast('Debes iniciar sesión para editar tus datos');
      return
    }
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      this.userForm.markAsDirty();
      this.toastService.showDangerToast('Faltan campos por completar');
      return;
    }
    this.loader = true
    let photoProfile = this.currentImage ? this.currentImage : ''
    let user: UserModel = { ...this.userForm.value , photoProfile, id: this.currentUser._id};

    this.userService.updateUser(user).subscribe((res:any)=>{
      this.disableCam = true;
      this.cleanPhoto()
      this.loader = false
      this.toastService.showSuccessToast(`Información actualizada con éxito`);
    }, (err:any) => {
      this.loader = false
      if (err.status == 400) {
        this.toastService.showDangerToast(err.error.msg);
        return
      }
      this.toastService.showDangerToast('Hubo un error intentalo nuevamente');
    })
  } 
  
  changeDocument(event: any) {
    let value = event.target.value;
    this.userForm.get('documentType')!.setValue(value);
  }

  changeCountry(event: any) {
    let value = event.target.value;    
    let country =  this.countries.find((item:any) => item.country == value)
    this.cities = country.cities
  }

  changeCity(event: any) {
    let value = event.target.value;
    this.userForm.get('country')!.setValue(value);
  }

  validateFields(field: string, error: string) {
    return (
      this.userForm.get(field)?.errors?.[error] &&
      this.userForm.get(field)?.touched
    );
  }

  validateAdultAge() {
    let birthdate = this.userForm.get('birthdate')!.value
    let now = new Date();
    let date = new Date(birthdate);
    let age = now.getFullYear() - date.getFullYear();
    let month = now.getMonth() - date.getMonth();
    if (month < 0 || (month === 0 && now.getDate() < date.getDate())) {
        age--;
    }
   
    if (age < 18) {
      this.userForm.get('birthdate')!.setValue('')
      this.toastService.showDangerToast('Debes ser mayor de edad para poder registrarte');
    } 
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
  reverseDate(date:any) {
    let splitted = date.split('-')
    return (
      splitted[2] +
      '-' +
      splitted[1] +
      '-' +
      splitted[0]
    );
  }


  // WEBCAM -------------------
  takeSnapshot(): void {
    this.trigger.next();
  }

  onOffWebCame() {
    this.showWebcam = !this.showWebcam;
  }

  handleInitError(error: WebcamInitError) {
    this.errors.push(error);
  }

  changeWebCame(directionOrDeviceId: boolean | string) {
    this.nextWebcam.next(directionOrDeviceId);
  }

  handleImage(webcamImage: WebcamImage) {
    this.currentImage = webcamImage.imageAsDataUrl;
    // this.userForm.get('photoProfile')!.setValue(webcamImage.imageAsDataUrl);
    this.getPicture.emit(webcamImage);
    this.showWebcam = false;
    this.allowButtons = false;
    this.disableCam = !this.disableCam
  }

  get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }

  cleanPhoto() {
    this.currentImage = '';    
    this.showWebcam = true;
    this.allowButtons = true;
  }

  showCamera(){
    this.disableCam = !this.disableCam
    this.cleanPhoto()
  }

  // WEBCAM -------------------

}
