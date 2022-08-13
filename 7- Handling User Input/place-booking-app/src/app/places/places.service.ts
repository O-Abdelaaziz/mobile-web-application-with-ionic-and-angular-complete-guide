import {Injectable} from '@angular/core';
import {Place} from './place.model';
import {AuthenticationService} from '../auth/authentication.service';
import {BehaviorSubject} from 'rxjs';
import {take, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  private places: BehaviorSubject<Place[]> = new BehaviorSubject<Place[]>([
    new Place(
      'p1',
      'Manhattan Mansion',
      'In the heart of New York City.',
      'https://lonelyplanetimages.imgix.net/mastheads/GettyImages-538096543_medium.jpg?sharp=10&vib=20&w=1200',
      149.99,
      new Date('2022-08-12'),
      new Date('2022-08-15'),
      'user1'
    ),
    new Place(
      'p2',
      'L\'Amour Toujours',
      'A romantic place in Paris!',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Paris_Night.jpg/1024px-Paris_Night.jpg',
      189.99,
      new Date('2022-08-12'),
      new Date('2022-08-20'),
      'user1'
    ),
    new Place(
      'p3',
      'The Foggy Palace',
      'Not your average city trip!',
      'https://upload.wikimedia.org/wikipedia/commons/0/01/San_Francisco_with_two_bridges_and_the_fog.jpg',
      99.99,
      new Date('2022-08-12'),
      new Date('2022-08-19'),
      'user1'
    )
  ]);

  constructor(private _authService: AuthenticationService) {
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
    this.places.pipe(
      take(1)
    ).subscribe((places) => {
      this.places.next(places.concat(newPlace));
    });
  }
}
