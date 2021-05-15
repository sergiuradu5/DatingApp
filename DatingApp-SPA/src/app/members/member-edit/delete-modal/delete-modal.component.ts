import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.css']
})
export class DeleteModalComponent {
  @Input() userId:number;
  constructor(public bsModalRef: BsModalRef,
              private userService: UserService,
              private authService: AuthService,
              private alertify: AlertifyService,
              private router: Router
    ) { }

  deleteUser() {
    this.userService.deleteUser(this.userId).subscribe(data => {
    this.alertify.success('Profile deleted successfully');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('searchFilter');
    this.userService.currentUserSearchFilter = null;
    this.authService.decodedToken = null;
    this.authService.currentUser = null;
      this.router.navigate(['/home']);
    }, err => {
      this.alertify.error('Could not delete profile');
    })
  }


}
