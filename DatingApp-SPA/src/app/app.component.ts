import { Component, OnInit } from '@angular/core';
import { AuthService } from './_services/auth.service';
import {JwtHelperService} from '@auth0/angular-jwt';
import { User } from './_models/user';
import { UserService } from './_services/user.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'DatingApp-SPA';
  jwtHelper = new JwtHelperService();
  constructor(private authService: AuthService, 
              private userService: UserService)
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
}
