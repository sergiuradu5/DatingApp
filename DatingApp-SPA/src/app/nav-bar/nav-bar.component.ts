import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  @Input() isSideDrawerOpen: boolean;
  @Output() toggleSideDrawer = new EventEmitter();
  isMenuCollapsed : boolean;
  model: any={};
  photoUrl: string;
  
  constructor(public authService: AuthService,
            private alertify: AlertifyService,
            private router: Router
    ) { }

  ngOnInit() {
    this.authService.currentPhotoUrl.subscribe(photoUrl => this.photoUrl = photoUrl);
  }
login()
{
  this.authService.login(this.model).subscribe( next => {
    this.alertify.success('Logged in successfully');
  }, error => {
    this.alertify.error(error);
  }, ()=> {
    this.router.navigate(['/members']);
  });
}

loggedIn()
{
  return this.authService.loggedIn();
}

logout()
{
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('searchFilter');
  this.authService.decodedToken = null;
  this.authService.currentUser = null;
  this.alertify.message('Logged out');
  this.router.navigate(['/home']);
}


toggleSideDrawerEvent() {
  this.isSideDrawerOpen = !this.isSideDrawerOpen;
  console.log('SideDrawer toggled from the navbar, isSideDrawerOpen: ', this.isSideDrawerOpen);
  this.toggleSideDrawer.emit(this.isSideDrawerOpen);
  
}

}
