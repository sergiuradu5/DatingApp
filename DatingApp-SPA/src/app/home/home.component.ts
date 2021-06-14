import { animate, keyframes, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import * as kf from '../members/keyframes';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [ 
    trigger('heartAnimator', [      
      transition('* => flipAround', animate("800ms ease-out", keyframes(kf.flipAround))),
    ])
  ]
})
export class HomeComponent implements OnInit {
registerMode = false;
learnMoreMode = false;
animationState: string;
  constructor(
    public authService : AuthService
  ) { }

  ngOnInit() {
  }

  registerToggle()
  {
    this.registerMode = true;
  }

  cancelRegisterMode(registerMode: boolean)
  {
    this.registerMode = registerMode;
  }

  learnMoreToggle()
  {
    this.learnMoreMode = true;
  }

  backToHomeFunction(backToHome: boolean)
  {
    this.learnMoreMode = backToHome;
  }

  startAnimation(state) {
    
    if(!this.animationState) {
      this.animationState = state
    }
  }

  resetAnimationState() {
    this.animationState = '';
  }
}
