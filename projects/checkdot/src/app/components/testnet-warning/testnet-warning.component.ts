import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { WalletService } from '../../services/wallet.service';

@Component({
  selector: 'app-testnet-warning',
  templateUrl: './testnet-warning.component.html',
  styleUrls: ['./testnet-warning.component.css']
})
export class TestnetWarningComponent implements OnInit {

  public hidden: boolean = true;
  public network: String = "";

  constructor(public walletService: WalletService, public changeDetector: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.walletService.getWalletWithoutFilter().subscribe((wallet) => {
      if (wallet === undefined) {
        this.hidden = true;
        return ;
      }
      if (wallet?.network === 3) {
        this.network = "Ropsten";
        this.hidden = false;
      } else if (wallet?.network === 5777) {
        this.network = "Local";
        this.hidden = false;
      } else {
        this.hidden = true;
      }
      this.changeDetector.detectChanges();
    });
  }

}
