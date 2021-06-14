import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';
import { User } from '../_models/user';
import { Router } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { GeolocationService } from '../_services/geolocation.service';
import { GeolocationCoords } from '../_models/geolocation-coords';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
user: User;
registerForm: FormGroup;
bsConfig: Partial<BsDatepickerConfig>; //Partial class makes all of the properties of the class OPTIONAL
coords: GeolocationCoords = null;
@Output() cancelRegister = new EventEmitter();
  constructor(private authService: AuthService,
              private alertify: AlertifyService,
              private fb: FormBuilder,
              private router: Router,
              private geolocationService: GeolocationService
    ) { }

  ngOnInit() {
    this.geolocationService.initiateLocation();
    this.geolocationService.currentCoordsObservable.subscribe(coords => {
      this.coords = coords;
      
    });


    this.bsConfig = {
      containerClass: 'theme-red'
    };
    this.createRegisterForm();
    // this.registerForm = new FormGroup({ //This Here is How to declare a REACTIVE FORM
    //   username: new FormControl('', Validators.required),
    //   password: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]),
    //   confirmPassword: new FormControl('', Validators.required)

    // }, this.passwordMatchValidator);
  }
 
createRegisterForm() { //This here is a reactive form built via a FORM BUILDER
  this.registerForm = this.fb.group({
    gender: ['male'],
    
    username: ['', Validators.required],
    knownAs: ['', Validators.required],
    dateOfBirth: [null, Validators.required],
    city: ['', Validators.required],
    country: ['', Validators.required],
    

    password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
    confirmPassword: ['', Validators.required]
  }, {validator: this.passwordMatchValidator });
}

  passwordMatchValidator(g: FormGroup) {
    return g.get('password').value === g.get('confirmPassword').value ?  null : { 'mismatch': true};
  }

  register()
  {
    if (this.registerForm.valid)
    {
      if (this.coords == null) {
        alert('Please allow the website to access your location');
        return;
      }
      this.user = Object.assign( {}, this.registerForm.value);
      this.user.lastSavedGeolocation = this.coords;
      // this.user.lastSavedGeolocation.latitude = this.coords.latitude;
      // this.user.lastSavedGeolocation.longitude = this.coords.longitude;

      this.authService.register(this.user).subscribe( () => {
        this.alertify.success('Registration successful');

      }, error => {
        
        this.alertify.error(error.error[0].description);
      }, () => {
        this.authService.login(this.user).subscribe( () => {
          this.router.navigate( ['/member/edit']);
        });
    })};
      
  }
  cancel()
  {
    this.cancelRegister.emit(false);
    this.alertify.message("Registration canceled");
  }
}
