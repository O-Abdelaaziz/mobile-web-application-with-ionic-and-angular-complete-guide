import {Component, OnDestroy, OnInit} from '@angular/core';
import {BookingService} from './booking.service';
import {Booking} from './booking.model';
import {IonItemSliding} from '@ionic/angular';
import {Subscription} from "rxjs";

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit, OnDestroy {
  public bookings: Booking[] = [];
  private subscription: Subscription;

  constructor(private _bookingService: BookingService) {
  }

  ngOnInit() {
    this.subscription = this._bookingService.bookings.subscribe(
      (response) => {
        this.bookings = response;
      }
    );
  }

  onCancelBooking(id: string, slidingElement: IonItemSliding) {
    slidingElement.close();
    console.log("Booking Cancled!");
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
