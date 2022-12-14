import {Injectable} from '@angular/core';
import {Booking} from "./booking.model";

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  public _booking: Booking[] = [
    {
      id: 'xyz',
      placeId: 'p1',
      placeTitle: 'Manhattan Mansion',
      guestNumber: 2,
      userId: 'abc',
    }
  ];

  constructor() {
  }

  get bookings() {
    return [...this._booking];
  }
}
