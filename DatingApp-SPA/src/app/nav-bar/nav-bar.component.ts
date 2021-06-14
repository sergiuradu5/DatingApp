import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import {Router} from '@angular/router';
import { UserService } from '../_services/user.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SignInModalComponent } from './sign-in-modal/sign-in-modal.component';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  @Input() isSideDrawerOpen: boolean;
  @Input() signInModalToggled: boolean;
  @Output() toggleSideDrawer = new EventEmitter();
  @Output() toggleSignInModal = new EventEmitter();
  model: any={};
  photoUrl: string;
  
  
  constructor(public authService: AuthService,
            private alertify: AlertifyService,
            private router: Router,
            private userService: UserService,
            private modalService: BsModalService

    ) { }

  ngOnInit() {
    this.authService.currentPhotoUrl.subscribe(photoUrl => this.photoUrl = photoUrl);
  }
login()
{
  this.authService.login(this.model).subscribe( next => {
    this.alertify.success('Logged in successfully');
    this.router.navigate(['/members']);
  }, error => {
    
    this.alertify.error(error);
  });
}

loggedIn()
{
  return this.authService.loggedIn();
}

toggleSideDrawerEvent() {
  this.isSideDrawerOpen = !this.isSideDrawerOpen;
  
  this.toggleSideDrawer.emit(this.isSideDrawerOpen);
  
}

toggleTheSignInModal() {
  this.signInModalToggled = !this.signInModalToggled;
  this.toggleSignInModal.emit(this.signInModalToggled);
}

}
