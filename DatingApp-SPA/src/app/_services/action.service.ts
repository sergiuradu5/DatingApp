import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActionService {
  private startIndexOfMainCard: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  currentStartIndexOfMainCard = this.startIndexOfMainCard.asObservable()

  private startIndexOfSecCard: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  currentStartIndexOfSecCard = this.startIndexOfSecCard.asObservable()
  constructor() { }

  changeStartIndexOfMainCard(startIndex: number) {
    console.log('startOfIndexMainCard changed');
    this.startIndexOfMainCard.next(startIndex);
  }

  resetStartIndexOfMainCard() {
    console.log('startOfIndexMainCard restarted');
    this.startIndexOfMainCard.next(0);
  }

  changeStartIndexOfSecCard(startIndex: number) {
    console.log('startOfIndexSecCard changed');
    this.startIndexOfSecCard.next(startIndex);
  }

  resetStartIndexOfSecCard() {
    console.log('startOfIndexSecCard restarted');
    this.startIndexOfSecCard.next(0);
  }
  
}
