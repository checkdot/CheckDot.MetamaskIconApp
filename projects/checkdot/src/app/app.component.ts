import { ChangeDetectorRef, Component } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { ThemeService } from './services/theme.service';
import { Wallet, WalletService } from './services/wallet.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'testapp';
  walletError: string = undefined;
  tokenIsPresent: boolean = false;

  public $theme: Observable<string>;
  public connected$: BehaviorSubject<string> = new BehaviorSubject('disconnected');

  constructor(public walletService: WalletService, public themeService: ThemeService, private changeDetectorRef: ChangeDetectorRef) {
    this.$theme = this.themeService.$theme.asObservable();
    this.walletService.getWallet().pipe(take(1)).toPromise().then(() => {
      this.connected$.next('connected');
    });
  }

  connect() {
    this.walletService.initialize();
  }

  addIcon() {
    const tokenAddress = '0x0cbd6fadcf8096cc9a43d90b45f65826102e3ece';
    const tokenSymbol = 'CDT';
    const tokenDecimals = 18;
    const tokenImage = 'https://checkdot.io/token-200x200.png';

    this.walletService.getWallet().pipe(take(1)).toPromise().then((wallet: Wallet) => {
      try {
        let provider: any = wallet.web3.currentProvider;

        provider.request({
          method: "wallet_watchAsset",
          params: {
            type: 'ERC20', // Initially only supports ERC20, but eventually more!
            options: {
              address: tokenAddress, // The address that the token is at.
              symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
              decimals: tokenDecimals, // The number of decimals in the token
              image: tokenImage, // A string url of the token logo
            },
          }
        }).then(() => {
        });
      } catch (error) {
        console.error(error.message);
      }
    });
  }

}
