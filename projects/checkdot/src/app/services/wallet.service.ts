import { Injectable, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject, throwError } from 'rxjs';
import { Web3ModalService } from '../components/web3-modal/web3-modal.service';
import { AbiItem } from 'web3-utils';
import Web3 from 'web3';
import { catchError, filter, map, mergeMap, take, tap } from 'rxjs/operators';
import { TransactionReceipt } from 'web3-core';
import { environment } from '../../environments/environment';
import { ContractsService } from './contracts.service';

export class Wallet {
  constructor(
    public web3: Web3,
    public address: string,
    public network: number,
    public chainId: number
  ) {}
};

@Injectable({
  providedIn: 'root'
})
export class WalletService {

  public monitoring: BehaviorSubject<{ loading?: boolean, title?: String, content?: String, empty?: boolean }> = new BehaviorSubject<{ loading?: boolean, title?: String, content?: String, empty?: boolean }>(undefined);

  private wallet: BehaviorSubject<Wallet> = new BehaviorSubject<Wallet>(undefined);
  private allowedNetworks: Array<number> = environment.allowedNetworks;

  constructor(private web3ModalService: Web3ModalService, private contractsService: ContractsService) {
    if (this.web3ModalService.haveCachedProvider() && this.web3ModalService.getCachedProvider() != undefined) {
      this.web3ModalService.connectToCachedProvider().then((p) => {
        this.web3ModalService.getCachedProvider().connector().then((provider) => {
          this.updateWallet(provider);
          this.updateProvider(provider);
        });
      });
    }
  }

  updateProvider(provider: any) {
    provider.on("accountsChanged", (accounts: string[]) => {
      this.updateWallet(provider);
    });

    provider.on("chainChanged", (info: { chainId: number }) => {
      this.updateWallet(provider);
    });

    // provider.on("connect", (info: { chainId: number }) => {
    //   this.wallet.next(undefined);
    // });

    provider.on("disconnect", (error: { code: number; message: string }) => {
      this.wallet.next(undefined);
    });
  }

  updateWallet(provider: any) {
    const web3 = new Web3(provider);
    this.monitoring.next({ loading: true, empty: true });

    Promise.resolve(Promise.all([web3.eth.net.getId(), web3.eth.getChainId()])).then(([networkId, chainId]) => {
      if (!this.allowedNetworks.includes(networkId)) {
        this.monitoring.next({
          title: `Network "${networkId}" not supported`,
          content: 'Please switch to Binance Mainnet and refresh the site.'
        });
      } else {
        this.monitoring.next({ empty: true });
        web3.eth.getAccounts().then((accounts) => {
          this.wallet.next({ web3, address: accounts[0], network: networkId, chainId } as Wallet);
        });
      }
    });
  }

  initialize() {
    this.web3ModalService.open()
    .then((provider: any) => {
      this.updateWallet(provider);
      this.updateProvider(provider);
    }).catch((e) => {
      console.log("error", e);
    });
  }

  disconnect() {
    this.web3ModalService.clearCachedProvider();
    this.wallet.next(undefined);
  }

  public getWallet(): Observable<Wallet> {
    return this.wallet.asObservable().pipe(filter(x => x !== undefined));
  }

  public getWalletWithoutFilter(): Observable<Wallet> {
    return this.wallet.asObservable();
  }

  public isAllowedNetwork(network: number): boolean {
    return this.allowedNetworks.includes(network);
  }

  public getEthBalance(): Observable<string> {
    return this.getWallet().pipe(
      take(1),
      mergeMap((wallet) => {
        return wallet.web3.eth.getBalance(wallet.address);
      })
    );
  }

  public getCdtBalance(): Observable<string> {
    return this.getWallet().pipe(
      take(1),
      mergeMap(wallet => this.contractsService.getCheckDotAddressBalance(wallet, wallet.address)),
      map(balanceOfCDT => {
        return Web3.utils.fromWei(balanceOfCDT);
      })
    );
  }

  public sendTransaction(to: string, value: string, callback?: (error: Error, hash: string) => void): Observable<TransactionReceipt> {
    return this.getWallet().pipe(
      take(1),
      mergeMap((wallet) => {
        return wallet.web3.eth.sendTransaction({ to: to, from: wallet.address, value: value }, callback);
      })
    );
  }

}
