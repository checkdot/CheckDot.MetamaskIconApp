import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, ViewEncapsulation } from '@angular/core';
import { filter } from 'rxjs/operators';
import { WalletService } from '../../services/wallet.service';

@Component({
  selector: 'app-modal',
  // host: {
  //   '[hidden]': 'hidden',
  // },
  inputs: ['open', 'allowClose'],
  outputs: ['closed'],
  styleUrls: ['./modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './modal.component.html',
})
export class ModalComponent implements AfterViewInit {
  allowClose: boolean = true;
  hidden: boolean = true;
  closed: EventEmitter<any> = new EventEmitter();

  constructor(public walletService: WalletService, public detectChanges: ChangeDetectorRef) {
  }

  ngAfterViewInit(): void {
    this.walletService.monitoring.subscribe(() => {
      this.detectChanges.detectChanges();
    });
  }

  close(event) {
    if (!this.allowClose) return;

    this.walletService.monitoring.next({ empty: true });
    this.closed.next(true);
    event.stopPropagation();
  }
}
