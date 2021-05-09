import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { User } from 'src/app/_models/user';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';

@Component({
  selector: 'app-member-card-detailed',
  templateUrl: './member-card-detailed.component.html',
  styleUrls: ['./member-card-detailed.component.css']
})
export class MemberCardDetailedComponent implements OnInit {
  @Input() user: User;
  @Output() skipCurrentUser = new EventEmitter();

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private alertify: AlertifyService
  ) { }
  ngOnInit() {
  }

  skipUser() {
    this.skipCurrentUser.emit(this.user.id);
    this.visitUser(this.user.id);
  }

  visitUser(visitedId: number) {
    this.userService.visitUser(this.authService.decodedToken.nameid, visitedId).subscribe( data=> {
      this.alertify.success('You have visited ' + this.user.knownAs);
    }, error => {
      this.alertify.error(error);
    })

  }

  sendLike(recipientId: number)
  {
    this.userService.sendLike(this.authService.decodedToken.nameid, recipientId).subscribe( data=> {
      this.alertify.success('You have liked ' + this.user.knownAs);
    }, error => {
      this.alertify.error(error);
    }); 

    this.skipUser();
  }

}
