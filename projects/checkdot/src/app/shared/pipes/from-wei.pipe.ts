import { Pipe, PipeTransform } from '@angular/core';
import Web3 from 'web3';

@Pipe({
  name: 'fromWei'
})
export class FromWeiPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {
    return Web3.utils.fromWei(value, "ether");
  }

}
