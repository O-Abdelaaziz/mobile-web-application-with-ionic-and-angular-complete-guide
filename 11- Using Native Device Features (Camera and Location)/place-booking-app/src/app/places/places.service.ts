import {Injectable} from '@angular/core';
import {Place} from './place.model';
import {AuthenticationService} from '../auth/authentication.service';
import {BehaviorSubject, of} from 'rxjs';
import {take, map, tap, switchMap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {PlaceLocation} from "./location.model";

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
  private readonly BASE_URL = 'https://ionic-angular-7efb9-default-rtdb.firebaseio.com/offered-places';
  private places: BehaviorSubject<Place[]> = new BehaviorSubject<Place[]>([]);

  constructor(
    private _httpClient: HttpClient,
    private _authService: AuthenticationService) {
  }

  fetchPlace() {
    return this._httpClient.get<{ [key: string]: PlaceDate }>(this.BASE_URL + '.json').pipe(
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
              response[key].userId,
              response[key].location,
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
    return this._httpClient.get(`${this.BASE_URL}/${placeId}.json`).pipe(
      map((response: Place) => {
        return new Place(
          placeId,
          response.title,
          response.description,
          response.imageUrl,
          response.price,
          new Date(response.availableFrom),
          new Date(response.availableTo),
          response.userId, response.location);
      })
    );

  }

  addPlace(title: string, description: string, price: number, dateFrom: Date, dateTo: Date, location: PlaceLocation) {
    let generatedId: string;
    let newPlace;
    return  this._authService.userId.pipe(
      take(1),
      switchMap((userId) => {
        if (!userId) {
          throw new Error('No user id found');
        }
        newPlace = new Place(Math.random().toString(),
          title,
          description,
          'https://upload.wikimedia.org/wikipedia/commons/0/01/San_Francisco_with_two_bridges_and_the_fog.jpg',
          price,
          dateFrom,
          dateTo,
          userId,
          location);

        return this._httpClient.post(this.BASE_URL + '.json', {...newPlace, id: null});
      }),
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
    let updatedPlaces: Place[];
    return this.places.pipe(
      take(1),
      switchMap((response: Place[]) => {
        if (!response || response.length <= 0) {
          return this.fetchPlace();
        } else {
          return of(response);
        }
      }),
      switchMap((response) => {
        const updatedPlaceIndex = response.findIndex(p => p.id === placeId);
        updatedPlaces = [...response];
        const oldPlace = updatedPlaces[updatedPlaceIndex];
        updatedPlaces[updatedPlaceIndex] = new Place(
          oldPlace.id,
          title,
          description,
          oldPlace.imageUrl,
          oldPlace.price,
          oldPlace.availableFrom,
          oldPlace.availableTo,
          oldPlace.userId, oldPlace.location);
        return this._httpClient.put(`${this.BASE_URL}/${placeId}.json`, {
          ...updatedPlaces[updatedPlaceIndex],
          id: null
        });
      }),
      tap(() => {
        this.places.next(updatedPlaces);
      })
    )
      ;
  }
}
