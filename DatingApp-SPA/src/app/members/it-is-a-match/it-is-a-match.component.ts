import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from 'src/app/_models/user';
import { trigger, keyframes, animate, transition } from '@angular/animations';
import * as kf from '../keyframes';

@Component({
  selector: 'app-it-is-a-match',
  templateUrl: './it-is-a-match.component.html',
  styleUrls: ['./it-is-a-match.component.css'],
  animations: [ 
    trigger('matchAnimator', [
      transition('* => wobble', animate(350, keyframes(kf.wobble))),
      transition('* => zoomIn', animate(250, keyframes(kf.zoomIn))),
      transition('* => swing', animate(350, keyframes(kf.swing))),
    ])
  ]
})
export class ItIsAMatchComponent implements OnInit {

  @Input() userLiker: any;
  @Input() userLiked: User;
  @Input() show: boolean;
  @Output() resetUserLiked = new EventEmitter<void>();

  animationState: string;
  constructor() { }

  ngOnInit(): void {
  }

  closeComponent(): void {
    this.show = false;
    setTimeout(() => {
      this.resetUserLiked.emit();
    }, 400)
    
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
