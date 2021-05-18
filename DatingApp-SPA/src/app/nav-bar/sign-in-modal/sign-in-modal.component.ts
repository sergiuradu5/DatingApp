import { Component, OnInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { Form, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-sign-in-modal',
  templateUrl: './sign-in-modal.component.html',
  styleUrls: ['./sign-in-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignInModalComponent implements OnInit {
  @ViewChild('loginForm', { read: NgForm }) loginForm: any;
  model: any={};


  constructor(public bsModalRef: BsModalRef,
              private authService: AuthService,
              private alertify: AlertifyService,
              private router: Router) { }

  ngOnInit(): void {
  }

  login()
{
  this.authService.login(this.model).subscribe( next => {
    this.alertify.success('Logged in successfully');
  }, error => {
    this.alertify.error(error);
  }, ()=> {
    this.bsModalRef.hide();
    this.router.navigate(['/members']);
  });
}

loggedIn()
{
  return this.authService.loggedIn();
}

}
