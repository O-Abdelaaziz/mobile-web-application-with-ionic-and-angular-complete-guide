import {Injectable} from '@angular/core';
import {Booking} from "./booking.model";
import {delay, map, switchMap, take, tap} from "rxjs/operators";
import {AuthenticationService} from "../auth/authentication.service";
import {BehaviorSubject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Place} from "../places/place.model";


interface BookingDate {
  bookedFrom: string;
  bookedTo: string;
  firstName: string;
  lastName: string;
  guestNumber: number;
  placeId: string;
  placeImage: string;
  placeTitle: string;
  userId: string;
}


@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private readonly BASE_URL = 'https://ionic-angular-7efb9-default-rtdb.firebaseio.com/booking';

  private _bookings = new BehaviorSubject<Booking[]>([]);

  constructor(
    private _httpClient: HttpClient,
    private _authService: AuthenticationService) {
  }

  get bookings() {
    return this._bookings.asObservable();
  }

  fetchBookings() {
    return this._httpClient
      .get<{ [key: string]: BookingDate }>(`${this.BASE_URL}.json?orderBy="userId"&equalTo="${this._authService.userId}"`).pipe(
        map((response: any) => {
          const bookings = [];
          for (const key in response) {
            if (response.hasOwnProperty(key)) {
              bookings.push(new Booking(
                key,
                response[key].placeId,
                response[key].userId,
                response[key].placeTitle,
                response[key].placeImage,
                response[key].firstName,
                response[key].lastName,
                response[key].guestNumber,
                new Date(response[key].dateFrom),
                new Date(response[key].dateTo),
              ));
            }
          }
          return bookings;
        }),
        tap((response) => {
          this._bookings.next(response);
        })
      );
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
    let generatedId: string;
    let newBooking;
    this._authService.userId.pipe(
      take(1),
      switchMap((userId) => {
        if (!userId) {
          throw new Error('No user id found');
        }
        newBooking = new Booking(
          Math.random().toString(),
          placeId,
          userId,
          placeTitle,
          placeImage,
          firstName,
          lastName,
          guestNumber,
          dateFrom,
          dateTo
        );
        return this._httpClient.post<{ name: string }>(this.BASE_URL + '.json', {...newBooking, id: null});
      }),
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
    return this._httpClient.get(`${this.BASE_URL}/${bookingId}.json`).pipe(
      switchMap(() => {
        return this.bookings;
      }),
      take(1),
      tap(bookings => {
        this._bookings.next(bookings.filter(p => p.id !== bookingId));
      })
    );
  }
}
