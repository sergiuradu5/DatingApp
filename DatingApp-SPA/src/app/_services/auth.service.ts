import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';
import { environment } from 'src/environments/environment';
import {map} from 'rxjs/operators';
import {JwtHelperService} from '@auth0/angular-jwt';
import { User } from '../_models/user';
import { UserService } from './user.service';
import { UserSearchFilter } from '../_models/user-search-filter';
import { GeolocationService } from './geolocation.service';
import { GeolocationCoords } from '../_models/geolocation-coords';
import { AlertifyService } from './alertify.service';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = environment.baseUrl;
  jwtHelper = new JwtHelperService();
  decodedToken: any;
  currentUser: User;

  photoUrl = new BehaviorSubject<string>('../../assets/user.png'); //For ANY to ANY Comunication 
  currentPhotoUrl = this.photoUrl.asObservable();

  localStorageUserSearchFilter: UserSearchFilter;
  
  constructor(private http: HttpClient,
    private userService: UserService, 
    private geolocationService: GeolocationService,
    private alertify: AlertifyService
    ) { }

  changeMemberPhoto(photoUrl: string) {
    this.photoUrl.next(photoUrl);
  }


  login (model: any)
  {
    return this.http.post(this.baseUrl + 'auth/' + 'login', model)
    .pipe(
      map((response: any) => {
        const user=response;
        if(user) {
          localStorage.setItem('token', user.token);
          localStorage.setItem('user', JSON.stringify(user.user));
          localStorage.setItem('searchFilter', JSON.stringify(user.searchFilter));
          this.decodedToken= this.jwtHelper.decodeToken(user.token);
          this.currentUser= user.user;
          this.localStorageUserSearchFilter = user.searchFilter;
          this.changeMemberPhoto(this.currentUser.photoUrl);
          this.userService.resetUserAfterLogin(this.currentUser);
          this.userService.initiateUserSearchFilter(this.localStorageUserSearchFilter);
          this.geolocationService.updateUserGeolocation(this.decodedToken.nameid).subscribe(data => {
            this.alertify.success('Location updated successfully');
          }, error => {
            this.alertify.error(error);
          })
          
          
          
          
        }
      })
    )
  }



  register(user : User) {
    return this.http.post(this.baseUrl + 'auth/' + 'register', user);
  }

  loggedIn() {
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }

  roleMatch(allowedRoles): boolean {
    let isMatch = false;
    const userRoles = this.decodedToken.role as Array<string>;
    allowedRoles.forEach(element => {
      if(userRoles.includes(element)) {
        isMatch = true;
        return;
      }
    });
    return isMatch;
  }

  getRoles() : Array<string>{
    const userRoles = this.decodedToken.role as Array<string>;
    return userRoles;
  }

}
