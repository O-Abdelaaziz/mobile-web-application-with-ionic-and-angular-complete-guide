import {Injectable} from '@angular/core';
import {Place} from './place.model';
import {AuthenticationService} from '../auth/authentication.service';
import {BehaviorSubject} from 'rxjs';
import {take, map, tap, delay, switchMap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';

interface PlaceDate {
  availableFrom: string;
  availableTo: string;
  description: string;
  imageUrl: string;
  price: number;
  title: string;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private readonly BASE_URL = 'https://ionic-angular-7efb9-default-rtdb.firebaseio.com/offered-places.json';
  private places: BehaviorSubject<Place[]> = new BehaviorSubject<Place[]>([]);

  constructor(
    private _httpClient: HttpClient,
    private _authService: AuthenticationService) {
  }

  fetchPlace() {
    return this._httpClient.get<{ [key: string]: PlaceDate }>(this.BASE_URL).pipe(
      map((response: any) => {
        const places = [];
        for (const key in response) {
          if (response.hasOwnProperty(key)) {
            places.push(new Place(
              key,
              response[key].title,
              response[key].description,
              response[key].imageUrl,
              response[key].price,
              new Date(response[key].availableFrom),
              new Date(response[key].availableTo),
              response[key].userId
            ));
          }
        }
        return places;
      }),
      tap((response) => {
        this.places.next(response);
      })
    );
  }

  get placesList() {
    return this.places.asObservable();
  }

  getPlace(placeId) {
    return this.places.pipe(
      take(1),
      map((places) => ({...places.find(place => place.id === placeId)})),
    );
  }

  addPlace(title: string, description: string, price: number, dateFrom: Date, dateTo: Date) {
    const newPlace = new Place(Math.random().toString(),
      title,
      description,
      'https://upload.wikimedia.org/wikipedia/commons/0/01/San_Francisco_with_two_bridges_and_the_fog.jpg',
      price,
      dateFrom,
      dateTo,
      this._authService.userId);
    let generatedId: string;

    return this._httpClient.post(this.BASE_URL, {...newPlace, id: null}).pipe(
      switchMap((response: any) => {
        generatedId = response.name;
        return this.places;
      }),
      take(1),
      tap((places) => {
        newPlace.id = generatedId;
        this.places.next(places.concat(newPlace));
      }),
    );
    // return this.places.pipe(
    //   take(1),
    //   delay(1000),
    //   tap((places) => {
    //     this.places.next(places.concat(newPlace));
    //   }),
    // );
  }

  updatePlace(placeId: string, title: string, description: string) {
    return this.places.pipe(
      take(1),
      delay(1000),
      tap((places) => {
        const updatedPlaceIndex = places.findIndex(p => p.id === placeId);
        const updatedPlaces = [...places];
        const oldPlace = updatedPlaces[updatedPlaceIndex];
        updatedPlaces[updatedPlaceIndex] = new Place(
          oldPlace.id,
          title,
          description,
          oldPlace.imageUrl,
          oldPlace.price,
          oldPlace.availableFrom,
          oldPlace.availableTo,
          oldPlace.userId);
        this.places.next(updatedPlaces);
      })
    );
  }
}
