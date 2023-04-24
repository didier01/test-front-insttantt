import { Component, OnInit,  EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { UserModel } from '../../core/models/user-model';
import { FreeApiService } from '../../core/services/free-api.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../shared/toast/toast.service';

import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  loader:boolean = false
  isAuth:boolean = false

  userForm!: FormGroup;
  countries: any = []
  cities: any = []


  currentImage: any = {};
  currentUser: any = {};

  @Output() getPicture = new EventEmitter<WebcamImage>();
  showWebcam = true;
  enableCam = true;
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

  }

  ngOnInit(): void {
    this.getCountries()
    this.getUserStorage()
  }

  getUserStorage(){
    if (sessionStorage.getItem('userLogged')) {
      this.currentUser = JSON.parse(sessionStorage.getItem('userLogged')!);      
    }
  }

  createForm() {
    this.userForm = this.formBuilder.group({
      country: [,[Validators.required]],
      city: [,[Validators.required]],
      address: [,[Validators.required]],
    });
  }

  getCountries(){
    this.loader = true
    this.freeApi.getCountries()
      .subscribe((res:any) => {
        this.countries = res.data
        this.loader = false
    });
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
    let photoProfile = this.currentImage ? this.currentImage.imageAsDataUrl : ''
    let user: UserModel = { ...this.userForm.value , photoProfile, id: this.currentUser._id};
    this.userService.updateUser(user).subscribe((res:any)=>{
      this.enableCam = false
      this.cleanPhoto()
      this.userForm.reset();

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
    this.currentImage = webcamImage;
    this.getPicture.emit(webcamImage);
    this.showWebcam = false;
    this.allowButtons = false;
    this.enableCam = !this.enableCam
  }

  get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }

  cleanPhoto() {
    this.currentImage = {};
    this.showWebcam = true;
    this.allowButtons = true;
  }

  showCamera(){
    this.enableCam = !this.enableCam
    this.cleanPhoto()
  }

  // WEBCAM -------------------
}
