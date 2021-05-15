import { Component, OnInit } from '@angular/core';
import { AuthService } from './_services/auth.service';
import {JwtHelperService} from '@auth0/angular-jwt';
import { User } from './_models/user';
import { UserService } from './_services/user.service';
import { Router } from '@angular/router';
import { AlertifyService } from './_services/alertify.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'DatingApp-SPA';
  jwtHelper = new JwtHelperService();
  isSideDrawerOpen = false;
  constructor(private authService: AuthService, 
              private userService: UserService,
              private router: Router,
              private alertify: AlertifyService)
  {
    
  }

  ngOnInit()
  {
    const token = localStorage.getItem('token');
    const user: User =JSON.parse(localStorage.getItem('user')); //JSON.parse : json to object
    const searchFilter = JSON.parse(localStorage.getItem('searchFilter'));
    if(token) {
      this.authService.decodedToken = this.jwtHelper.decodeToken(token);
    }
    if(user) {
      this.authService.currentUser = user;
      this.authService.changeMemberPhoto(user.photoUrl);
    }
    if(user && !searchFilter) {
      this.userService.getUserSearchFilter(this.authService.decodedToken.nameidd).subscribe(data => {
        localStorage.setItem('searchFilter',JSON.stringify(data));
      })
    }
  }

  loggedIn()
  {
    return this.authService.loggedIn();
  }

  logout()
  {
    this.toggleSideDrawer(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('searchFilter');
    this.authService.decodedToken = null;
    this.authService.currentUser = null;
    this.userService.initiateUserSearchFilter(null);
    this.userService.resetUserAfterLogout();
    this.alertify.message('Logged out');
    this.router.navigate(['/home']);
  }

  toggleSideDrawer(toggleValue: boolean) {
      this.isSideDrawerOpen = toggleValue;
    
  }
}
