import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/_models/user';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from 'src/app/_services/auth.service';
import { DeleteModalComponent } from './delete-modal/delete-modal.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css'],
})
export class MemberEditComponent implements OnInit {
  
  user: User;
  photoUrl: string;
  bsModalRef: BsModalRef;
  genderList = [{value: 'male', display: 'Male'}, {value: 'female', display: 'Female'}, {value: 'other', display: 'Other' }]; 

  @ViewChild('editForm', {static: true}) editForm: NgForm;
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.editForm.dirty) {
      $event.returnValue = true;
    }
  }

  constructor(
    private route: ActivatedRoute,
    private alertify: AlertifyService,
    private userService: UserService,
    private authService: AuthService,
    private modalService: BsModalService
  ) {}

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.user = data['user'];
     
      
    });
    this.authService.currentPhotoUrl.subscribe(photoUrl => this.photoUrl=photoUrl);
  }

  updateUser() {
    this.userService.updateUser(this.authService.decodedToken.nameid, this.user).subscribe( updatedUser => {
      localStorage.removeItem('user');
      localStorage.setItem('user', JSON.stringify(updatedUser));
      this.alertify.success('Profile updated successfully');
      this.editForm.reset(this.user);

    }, error => {
      this.alertify.error(error);
    });

  }

  updateMainPhoto(photoUrl) {
    this.user.photoUrl = photoUrl;
  }

  deleteButtonClicked() {
    const initialState = {
      userId: this.user.id
    };
    this.bsModalRef = this.modalService.show(DeleteModalComponent, {initialState});
  }
}
