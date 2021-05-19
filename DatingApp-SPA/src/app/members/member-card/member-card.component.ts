import { Component, OnInit, Input } from '@angular/core';
import { trigger, keyframes, animate, transition, state, style } from '@angular/animations';
import { User } from 'src/app/_models/user';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import * as kf from '../keyframes';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css'],
  animations: [
    trigger('cardAnimator', [  
      state('notFlipped', style({ transform: 'rotateY(0deg)'})),
      state('flipped', style({ transform: 'rotateY(180deg)'})),
      transition('notFlipped => flipped', animate(500)),
      transition('flipped => notFlipped', animate(500)),
      transition('* => flipOutX', animate(600, keyframes(kf.flipOutX))),
      transition('* => flipOutY', animate(600, keyframes(kf.flipOutY)))
    ]),
    trigger('backCardAnimator', [
      state('notFlipped', style({ transform: 'rotateY(0deg)'})),  
      state('flipped', style({ transform: 'rotateY(180deg)'})),
      transition('flipped => notFlipped', animate(500))
  ])
  ]
})
export class MemberCardComponent implements OnInit {
  @Input() user: User;
  isFlipped: boolean = false;
  animationState: string;
  
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
      this.isFlipped = true;
      setTimeout(() => {
        this.user.hasMatchedCurrentUser = true;
      }, 250);
      
    }, error => {
      this.alertify.error(error);
    }); 
    
  }

  startAnimation(state) {
    console.log(state)
    if(!this.animationState) {
      this.animationState = state
    }
  }

  resetAnimationState() {
    this.animationState = '';
  }

}
