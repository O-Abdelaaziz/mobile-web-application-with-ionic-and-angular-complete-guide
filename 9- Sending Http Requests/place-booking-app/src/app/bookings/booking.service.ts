import {Injectable} from '@angular/core';
import {Booking} from "./booking.model";
import {delay, switchMap, take, tap} from "rxjs/operators";
import {AuthenticationService} from "../auth/authentication.service";
import {BehaviorSubject} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private readonly BASE_URL = 'https://ionic-angular-7efb9-default-rtdb.firebaseio.com/booking';

  private _bookings = new BehaviorSubject<Booking[]>([]);

  constructor(
    private _httpClient: HttpClient,
    private authService: AuthenticationService) {
  }

  get bookings() {
    return this._bookings.asObservable();
  }

  addBooking(
    placeId: string,
    placeTitle: string,
    placeImage: string,
    firstName: string,
    lastName: string,
    guestNumber: number,
    dateFrom: Date,
    dateTo: Date
  ) {
    const newBooking = new Booking(
      Math.random().toString(),
      placeId,
      this.authService.userId,
      placeTitle,
      placeImage,
      firstName,
      lastName,
      guestNumber,
      dateFrom,
      dateTo
    );
    let generatedId: string;

    return this._httpClient.post<{ name: string }>(this.BASE_URL + '.json', {...newBooking, id: null}).pipe(
      switchMap((response: any) => {
        generatedId = response.name;
        return this.bookings;
      }),
      take(1),
      tap((bookings) => {
        newBooking.id = generatedId;
        this._bookings.next(bookings.concat(newBooking));
      }),
    );
  }

  cancelBooking(bookingId: string) {
    return this.bookings.pipe(
      take(1),
      delay(1000),
      tap(bookings => {
        this._bookings.next(bookings.filter(p => p.id !== bookingId));
      })
    );
  }
}
