import {Component, OnDestroy, OnInit} from '@angular/core';
import {BookingService} from './booking.service';
import {Booking} from './booking.model';
import {IonItemSliding, LoadingController} from '@ionic/angular';
import {Subscription} from "rxjs";

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit, OnDestroy {
  public bookings: Booking[] = [];
  private subscription: Subscription;

  constructor(
    private _bookingService: BookingService,
    private _loadingController: LoadingController,
  ) {
  }

  ngOnInit() {
    this.subscription = this._bookingService.bookings.subscribe(
      (response) => {
        this.bookings = response;
      }
    );
  }

  onCancelBooking(bookingId: string, slidingElement: IonItemSliding) {
    slidingElement.close();
    this._loadingController.create({
      message: 'Canceling current booking'
    }).then((loadingElement) => {
      loadingElement.present();
      this._bookingService.cancelBooking(bookingId).subscribe(
        () => {
          loadingElement.dismiss();
        }
      );
    });

    console.log("Booking Cancled!");
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
