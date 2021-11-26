import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { WalletComponent } from './headers/wallet/wallet.component';
import { WalletService } from './services/wallet.service';
import { Web3ModalModule } from './components/web3-modal/web3-modal.module';
import { Web3ModalComponent } from './components/web3-modal/web3-modal.component';
import { Web3ModalService } from './components/web3-modal/web3-modal.service';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Torus from '@toruslabs/torus-embed';
import Portis from '@portis/web3';
import Fortmatic from "fortmatic";
import Authereum from "authereum";
import LedgerProvider from '@web3modal/ledger-provider';
import { ModalComponent } from './components/modal/modal.component';
import { TestnetWarningComponent } from './components/testnet-warning/testnet-warning.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ThemeDirective } from './shared/directive/theme.directive';
import { FromWeiPipe } from './shared/pipes/from-wei.pipe';
import { ContractsService } from './services/contracts.service';
import { CdtBalanceService } from './services/cdt-balance.service';

@NgModule({
  declarations: [
    AppComponent,
    WalletComponent,
    ModalComponent,
    TestnetWarningComponent,
    ThemeDirective,
    FromWeiPipe,
  ],
  imports: [
    BrowserModule,
    Web3ModalModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  entryComponents: [Web3ModalComponent],
  providers: [
    {
      provide: Web3ModalService,
      useFactory: () => new Web3ModalService({
        disableInjectedProvider: false,
        cacheProvider: true,
        providerOptions: {
          walletconnect: {
            package: WalletConnectProvider,
            options: {
              infuraId: '00e69497300347a38e75c3287621cb16',
            },
          },
          // torus: {
          //   package: Torus,
          // },
          // portis: {
          //   package: Portis,
          //   options: {
          //     id: '759af39b-e2ce-4cb8-840c-050197a82d9a',
          //   },
          // },
          // fortmatic: {
          //   package: Fortmatic, // required
          //   options: {
          //     key: "FORTMATIC_KEY" // required
          //   }
          // },
          // authereum: {
          //   package: Authereum // required
          // },
          // "custom-example": {
          //   display: {
          //     logo: 'assets/ledger.svg',
          //     name: "Ledger",
          //     description: "Scan qrcode with your mobile wallet"
          //   },
          //   package: LedgerProvider,
          //   options: {
          //     rpcUrl: "http://localhost:8545",
          //     networkId: 1,
          //     chainId: 1,
          //     accountsLength: 1,
          //     askConfirm: true,
          //   },
          //   connector: async (x, options) => {
          //     const provider = new LedgerProvider(options);

          //     console.log(provider);
          //     return provider;
          //   }
          // }
        },
        network: '',
      })
    },
    {
      provide: ContractsService,
      useFactory: () => new ContractsService({
        checkDotTokenContractAddresses: {
          '97': '0x0cBD6fAdcF8096cC9A43d90B45F65826102e3eCE', // testnet
          '56': '0x0cBD6fAdcF8096cC9A43d90B45F65826102e3eCE'
        }
      })
    },
    WalletService,
    CdtBalanceService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
