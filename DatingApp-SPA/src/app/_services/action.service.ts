import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActionService {
  private actionToPerform: Subject<string> = new Subject<string>();
  currentActionToPerform = this.actionToPerform.asObservable();
  constructor() { }

  emitActionToPerform(action: string) {
    this.actionToPerform.next(action);
    this.actionToPerform.next("");
  }
}
