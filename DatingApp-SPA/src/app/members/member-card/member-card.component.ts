import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from 'src/app/_models/user';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {
  @Input() user: User;
  
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private alertify: AlertifyService
  ) { }
  ngOnInit() {
  }

  visitUser(recipientId: number) {
    this.userService.visitUser(this.authService.decodedToken.nameid, recipientId).subscribe( data => {
      this.alertify.success('You have visited ' + this.user.knownAs);
    }, error => {
      this.alertify.error(error);
    }); 
  }

  sendLike(recipientId: number)
  {
    this.visitUser(recipientId);
    this.userService.sendLike(this.authService.decodedToken.nameid, recipientId).subscribe( data=> {
      this.alertify.success('You have liked ' + this.user.knownAs);
    }, error => {
      this.alertify.error(error);
    }); 
  }

}
