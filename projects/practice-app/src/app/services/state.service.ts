import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  private paginatorState: any;

  setPaginatorState(state: any) {
    this.paginatorState = state;
  }

  getPaginatorState() {
    return this.paginatorState;
  }
}
