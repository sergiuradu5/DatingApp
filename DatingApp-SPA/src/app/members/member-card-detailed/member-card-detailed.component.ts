import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { User } from 'src/app/_models/user';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { trigger, keyframes, animate, transition } from '@angular/animations';
import * as kf from './keyframes';

@Component({
  selector: 'app-member-card-detailed',
  templateUrl: './member-card-detailed.component.html',
  styleUrls: ['./member-card-detailed.component.css'],
  animations: [ 
    trigger('cardAnimator', [
      transition('* => wobble', animate(350, keyframes(kf.wobble))),
      transition('* => flipOutY', animate(350, keyframes(kf.flipOutY))),
      transition('* => slideOutLeft', animate(350, keyframes(kf.slideOutLeft))),
      transition('* => slideOutRight', animate(350, keyframes(kf.slideOutRight))),
      transition('* => swing', animate(350, keyframes(kf.swing))),
    ])
  ]
})
export class MemberCardDetailedComponent implements OnInit {
  animationState: string;
  
  @Input() user: User;
  @Output() skipCurrentUser = new EventEmitter();

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private alertify: AlertifyService
  ) { }

  startAnimation(state) {
    console.log(state)
    if(!this.animationState) {
      this.animationState = state
    }
  }

  resetAnimationState() {
    this.animationState = '';
  }

  ngOnInit() {
  }

  skipUser() {
    this.startAnimation('slideOutLeft');
    setTimeout( () => {
      this.proceedToNextUser();
    }, 350);
    
  }

  proceedToNextUser() {
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

    this.startAnimation('slideOutRight');
    setTimeout(() => {
      this.proceedToNextUser();
    }, 350);
    
  }

}
