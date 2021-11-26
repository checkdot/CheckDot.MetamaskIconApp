import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { WalletService } from './wallet.service';

@Injectable({
  providedIn: 'root'
})
export class CdtBalanceService {

  public balance$: BehaviorSubject<string> = new BehaviorSubject('0');

  constructor(public walletService: WalletService) {
    this.updateBalance();
  }

  public updateBalance() {
    this.walletService.getCdtBalance().pipe(take(1)).toPromise().then((balance) => {
      this.balance$.next(balance);
    });
  }
}
