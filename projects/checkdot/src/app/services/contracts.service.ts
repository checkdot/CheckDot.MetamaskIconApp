import { Injectable } from '@angular/core';
import { Wallet } from './wallet.service';
import { AbiItem } from 'web3-utils';
import { Contract } from 'web3-eth-contract';

import * as CheckDotToken from "../shared/contracts/CheckDotToken";

export interface ContractsAddresses {
  checkDotTokenContractAddresses: { [key: string]: string };
}

@Injectable({
  providedIn: 'root'
})
export class ContractsService {

  constructor(public contractsAddress: ContractsAddresses) {

  }

  public getCheckDotTokenContract(wallet: Wallet): Contract {
    if (Object.keys(this.contractsAddress.checkDotTokenContractAddresses).includes(wallet.network.toString())) {
      return new wallet.web3.eth.Contract(CheckDotToken.abi as AbiItem[], this.contractsAddress.checkDotTokenContractAddresses[wallet.network.toString()]);
    }
    return undefined;
  }

  public async getCheckDotAddressBalance(wallet: Wallet, address: string) {
    const checkDotTokenContract = this.getCheckDotTokenContract(wallet);

    return checkDotTokenContract.methods.balanceOf(address).call();
  }


}
