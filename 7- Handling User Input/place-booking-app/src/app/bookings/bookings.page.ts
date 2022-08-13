import {Component, OnInit} from '@angular/core';
import {BookingService} from "./booking.service";
import {Booking} from "./booking.model";
import {IonItemSliding} from "@ionic/angular";

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit {
  public bookings: Booking[] = [];

  constructor(private _bookingService: BookingService) {
  }

  ngOnInit() {
    this.bookings = this._bookingService._booking;
  }

  onCancelBooking(id: string, slidingElement: IonItemSliding) {
    slidingElement.close();
    console.log("Booking Cancled!");
  }
}
