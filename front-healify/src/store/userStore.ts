import { makeAutoObservable } from 'mobx';

class UserStore {
  constructor() {
    makeAutoObservable(this);
  }
  isAuthenticated = false;

  setAuthenticated(value: boolean) {
    this.isAuthenticated = value
  }

  
}
export const runtimeStore = new UserStore();