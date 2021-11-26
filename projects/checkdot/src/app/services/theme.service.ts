import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  public $theme: BehaviorSubject<string>;

  constructor() {
    if (window.localStorage.getItem('theme') == undefined || !['light', 'dark'].includes(window.localStorage.getItem('theme'))) {
      window.localStorage.setItem('theme', environment.defaultTheme);
      this.$theme = new BehaviorSubject(environment.defaultTheme);
    } else {
      this.$theme = new BehaviorSubject(window.localStorage.getItem('theme'));
    }
  }

  public setDark() {
    this.$theme.next("dark");
    window.localStorage.setItem('theme', "dark");
  }

  public setLight() {
    this.$theme.next("light");
    window.localStorage.setItem('theme', "light");
  }
}
