import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { interval, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { CdtBalanceService } from '../../services/cdt-balance.service';
import { WalletService } from '../../services/wallet.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {

  public $wallet: Observable<any>;
  public CDTamount: string;

  constructor(public walletService: WalletService, public cdtBalanceService: CdtBalanceService, private changeDetectorRef: ChangeDetectorRef) {
    this.$wallet = this.walletService.getWalletWithoutFilter();

    interval(1000)
      .pipe(mergeMap(() => this.cdtBalanceService.balance$))
      .subscribe(x => {
        this.CDTamount = x;
        this.changeDetectorRef.detectChanges();
      });
  }

  ngOnInit(): void {
  }

  connect() {
    this.walletService.initialize();
  }

  disconnect() {
    this.walletService.disconnect();
  }

}
