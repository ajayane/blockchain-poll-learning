import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';

const contractABI = require("./contractABI.json"); //Application Binary Interface. from remix.

declare let window: any;

@Injectable({
  providedIn: 'root'
})
export class Web3Service {
  private web3: Web3 | undefined;
  private contract: Contract | undefined;
  private contractAddress = '0x10BE674d85Ce73708EdC988205da062c2fe079db';

  constructor(private zone: NgZone) {
    if (window.web3) {
      this.web3 = new Web3(window.ethereum);
      this.contract = new this.web3.eth.Contract(contractABI, this.contractAddress);

      window.ethereum.enable().catch((err: any) => {
        console.error(err);
        alert("permission denier");
      })
    } else {
      console.warn('Metamask not installed');
    }
  }
  getAccount() {
    return this.web3?.eth.getAccounts().then((accounts) =>
      accounts[0] || ''
    );
  }
  async executeTransaction(fnName: string, ...args: any[]): Promise<any> {
    const account = await this.getAccount();
    return this.contract?.methods[fnName](...args).send({ from: account });
  }
  async call(fnName: string, ...args: any[]) {
    const account = await this.getAccount();
    return this.contract?.methods[fnName](...args).call({ from: account });
  }
  onEvents(event: string) {
    return new Observable((observer) => {
      this.contract?.events[event]().on('data', (data: any) => {
        this.zone.run(() => {
          observer.next({
            event: data.event,
            payload: data.returnValues
          })
        })
      });
    })

  }
}
