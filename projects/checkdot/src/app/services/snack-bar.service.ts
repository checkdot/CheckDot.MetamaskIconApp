import { Injectable } from '@angular/core';
import {ThemeService} from './theme.service';
import {tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {

  private customClass: string;

  constructor(private themeService: ThemeService) {
    this.themeService.$theme
      .pipe(tap(theme => this.customClass = theme !== 'dark' ? 'snack-bar-light' : 'snack-bar-dark'))
      .subscribe();
  }

  success(message: string): void {
    this.show(message);
  }

  error(message: string): void {
    this.showError(message);
  }

  private show(message: string): void {
    const snackbar = (window as any).Snackbar;

    snackbar.show({
      text: `<strong>${message}</strong>`,
      actionText: 'X',
      duration: 60000,
      pos: 'bottom-right',
      customClass: this.customClass
    });
  }

  private showError(message: string): void {
    const snackbar = (window as any).Snackbar;

    snackbar.show({
      text: `<strong>${message}</strong>`,
      actionText: 'X',
      duration: 60000,
      pos: 'bottom-right',
      customClass: this.customClass + '-error'
    });
  }
}
