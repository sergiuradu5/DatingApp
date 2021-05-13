import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-learn-more',
  templateUrl: './learn-more.component.html',
  styleUrls: ['./learn-more.component.css']
})
export class LearnMoreComponent {
  @Output() backToHome = new EventEmitter();
  constructor() { }

  backToHomeFunction()
  {
    this.backToHome.emit(false);
  }

}
